import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Car } from '../../types';
import { X, Plus, Save, Trash2 } from 'lucide-react';
import { doc, setDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface CarFormProps {
  car?: Car | null;
  onClose: () => void;
  onSuccess: () => void;
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

  const [images, setImages] = useState<string[]>(car?.images || ['']);
  const [features, setFeatures] = useState<string[]>(car?.features || ['']);

  // Auto-generate slug from make + model
  const make = watch('make');
  const model = watch('model');
  
  useEffect(() => {
    if (!car && make && model) {
      const slug = `${make}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  }, [make, model, car, setValue]);

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImage = () => setImages([...images, '']);
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

  const onSubmit = async (data: Car) => {
    try {
      // Clean up arrays (remove empty strings)
      const cleanData = {
        ...data,
        images: images.filter(img => img.trim() !== ''),
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

          {/* Images */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-400">Image URLs</label>
              <button type="button" onClick={addImage} className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center">
                <Plus size={16} className="mr-1" /> Add Image
              </button>
            </div>
            <div className="space-y-3">
              {images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-black border border-zinc-700 text-white px-4 py-2 rounded-xl focus:border-yellow-500 focus:outline-none text-sm"
                  />
                  <button type="button" onClick={() => removeImage(index)} className="text-red-500 hover:text-red-400 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
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

        <div className="p-6 border-t border-zinc-800 bg-zinc-900 sticky bottom-0 z-10 flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors font-bold">
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-8 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center space-x-2"
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
  );
};
