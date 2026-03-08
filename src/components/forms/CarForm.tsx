import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Car } from '../../types';
import { X, Plus, Save, Trash2, Upload, ImagePlus, GripVertical, AlertCircle } from 'lucide-react';
import { doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';

interface CarFormProps {
  car?: Car | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImageItem {
  url: string;
  uploading?: boolean;
  progress?: number;
  file?: File;
  error?: string;
}

export const CarForm: React.FC<CarFormProps> = ({ car, onClose, onSuccess }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<Car>({
    defaultValues: car || {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      description: '',
      status: 'Available',
      slug: '',
    }
  });

  const [images, setImages] = useState<ImageItem[]>(
    car?.images?.map(url => ({ url })) || []
  );
  const [features, setFeatures] = useState<string[]>(car?.features || ['']);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Auto-generate slug from make + model
  const make = watch('make');
  const model = watch('model');

  useEffect(() => {
    if (!car && make && model) {
      const slug = `${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  }, [make, model, car, setValue]);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File "${file.name}" exceeds 10MB limit`);
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File "${file.name}" is not a supported image type (JPEG, PNG, WebP, AVIF)`);
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageRef = ref(storage, `cars/${timestamp}-${safeName}`);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setImages(prev => prev.map(img =>
            img.file === file ? { ...img, progress } : img
          ));
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }, []);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);

    // Add placeholder items with uploading state
    const newItems: ImageItem[] = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
      file,
    }));

    setImages(prev => [...prev, ...newItems]);

    // Upload each file
    for (const file of fileArray) {
      try {
        const downloadURL = await uploadFile(file);
        setImages(prev => prev.map(img =>
          img.file === file
            ? { url: downloadURL, uploading: false }
            : img
        ));
      } catch (error: any) {
        const errorMessage = error.message || 'Upload failed';
        setUploadError(errorMessage);
        // Remove the failed upload
        setImages(prev => prev.filter(img => img.file !== file));
      }
    }
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = ''; // Reset so same file can be selected again
    }
  }, [handleFiles]);

  const removeImage = async (index: number) => {
    const img = images[index];
    setImages(prev => prev.filter((_, i) => i !== index));

    // Try to delete from storage if it's a Firebase URL
    if (img.url.includes('firebasestorage.app') || img.url.includes('firebase')) {
      try {
        const storageRef = ref(storage, img.url);
        await deleteObject(storageRef);
      } catch {
        // Ignore deletion errors (file may not exist or URL format differs)
      }
    }
  };

  const addImageUrl = () => {
    setImages(prev => [...prev, { url: '' }]);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, url: value } : img));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const isUploading = images.some(img => img.uploading);

  const onSubmit = async (data: Car) => {
    if (isUploading) return;

    try {
      const cleanData = {
        ...data,
        images: images.filter(img => img.url.trim() !== '' && !img.uploading).map(img => img.url),
        features: features.filter(f => f.trim() !== ''),
        updatedAt: new Date().toISOString(),
      };

      if (car) {
        await updateDoc(doc(db, 'cars', car.id), cleanData);
      } else {
        cleanData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'cars'), cleanData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Failed to save car. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-900 w-full max-w-4xl rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-white">{car ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 overflow-y-auto space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Make</label>
              <input {...register('make', { required: true })} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
              {errors.make && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Model</label>
              <input {...register('model', { required: true })} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
              {errors.model && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
              <input type="number" {...register('year', { required: true, min: 1900, valueAsNumber: true })} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Price ($)</label>
              <input type="number" {...register('price', { required: true, min: 0, valueAsNumber: true })} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mileage</label>
              <input type="number" {...register('mileage', { required: true, min: 0, valueAsNumber: true })} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select {...register('status')} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none appearance-none">
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Slug (URL)</label>
            <input {...register('slug', { required: true })} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none font-mono text-sm" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea {...register('description')} rows={5} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
          </div>

          {/* ===== IMAGE UPLOAD SECTION ===== */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-400">Vehicle Images</label>
              <button
                type="button"
                onClick={addImageUrl}
                className="text-gray-500 hover:text-gray-300 text-xs flex items-center transition-colors"
              >
                <Plus size={14} className="mr-1" /> Add URL manually
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer mb-4 ${
                dragOver
                  ? 'border-yellow-500 bg-yellow-500/5'
                  : 'border-zinc-700 hover:border-zinc-500 bg-black/30'
              }`}
              onClick={() => document.getElementById('image-file-input')?.click()}
            >
              <input
                id="image-file-input"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  dragOver ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-gray-500'
                }`}>
                  <Upload size={24} />
                </div>
                <p className="text-white font-medium mb-1">
                  {dragOver ? 'Drop images here' : 'Drag & drop images here'}
                </p>
                <p className="text-gray-600 text-sm">
                  or click to browse — JPEG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                <AlertCircle size={16} className="shrink-0" />
                <span>{uploadError}</span>
                <button onClick={() => setUploadError(null)} className="ml-auto text-red-400/60 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group aspect-[16/10] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950"
                  >
                    {/* If it's a URL input (no preview) */}
                    {!img.url && !img.uploading ? (
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <input
                          value={img.url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          placeholder="Paste image URL..."
                          className="w-full bg-black border border-zinc-700 text-white px-3 py-2 rounded-lg focus:border-yellow-500 focus:outline-none text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <>
                        {/* Image Preview */}
                        <img
                          src={img.url}
                          alt={`Vehicle image ${index + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />

                        {/* Upload Progress Overlay */}
                        {img.uploading && (
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                            <div className="w-10 h-10 mb-2">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#27272a" strokeWidth="2" />
                                <circle
                                  cx="18" cy="18" r="16" fill="none" stroke="#eab308" strokeWidth="2"
                                  strokeDasharray={`${(img.progress || 0) * 1.005} 100.5`}
                                  strokeLinecap="round"
                                  className="transition-all duration-300"
                                />
                              </svg>
                            </div>
                            <span className="text-white text-xs font-mono">{img.progress || 0}%</span>
                          </div>
                        )}

                        {/* Hover overlay with actions */}
                        {!img.uploading && (
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Remove image"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}

                        {/* Image number badge */}
                        {!img.uploading && (
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-mono">
                            {index === 0 ? 'MAIN' : index + 1}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {/* Add more button */}
                <button
                  type="button"
                  onClick={() => document.getElementById('image-file-input')?.click()}
                  className="aspect-[16/10] rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 flex flex-col items-center justify-center text-gray-600 hover:text-gray-400 transition-all bg-black/20"
                >
                  <ImagePlus size={24} className="mb-1" />
                  <span className="text-xs">Add More</span>
                </button>
              </div>
            )}

            {images.length > 0 && (
              <p className="text-gray-600 text-xs mt-3">
                The first image will be used as the main listing photo. {images.filter(i => !i.uploading && i.url).length} image{images.filter(i => !i.uploading && i.url).length !== 1 ? 's' : ''} added.
              </p>
            )}
          </div>

          {/* Features */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-400">Features</label>
              <button type="button" onClick={addFeature} className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center">
                <Plus size={16} className="mr-1" /> Add Feature
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="e.g. Heated Seats"
                    className="flex-1 bg-black border border-zinc-700 text-white px-4 py-2 rounded-xl focus:border-yellow-500 focus:outline-none text-sm"
                  />
                  <button type="button" onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-400 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900 sticky bottom-0 z-10 flex justify-between items-center">
          <div>
            {isUploading && (
              <p className="text-yellow-500 text-sm flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                Uploading images...
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors font-bold">
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isUploading}
              className="px-8 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Vehicle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
