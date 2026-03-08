import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { SiteSettings } from '../../types';
import { Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SiteSettings>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          reset(docSnap.data() as SiteSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SiteSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), data);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };

  if (loading) return <div className="text-white">Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Site Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-6">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
              <input {...register('siteName')} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
              <input {...register('contactEmail')} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Contact Phone</label>
              <input {...register('contactPhone')} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
              <input {...register('address')} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-6">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Facebook URL</label>
              <input {...register('socialLinks.facebook')} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Twitter URL</label>
              <input {...register('socialLinks.twitter')} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Instagram URL</label>
              <input {...register('socialLinks.instagram')} className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
            ) : (
              <>
                <Save size={18} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
