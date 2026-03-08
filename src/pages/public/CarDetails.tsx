import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Car } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Gauge, DollarSign, Check, ArrowLeft, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm();

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        // First try to get by doc ID (for backward compatibility or direct links)
        const docRef = doc(db, 'cars', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() } as Car);
        } else {
          // If not found by ID, try to find by slug
          const carsRef = collection(db, 'cars');
          const q = query(carsRef, where('slug', '==', id));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            setCar({ id: doc.id, ...doc.data() } as Car);
          }
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const onSubmit = async (data: any) => {
    if (!car) return;
    try {
      await addDoc(collection(db, 'inquiries'), {
        carId: car.id,
        userId: user?.uid || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        createdAt: new Date().toISOString(),
        status: 'New'
      });
      reset();
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div></div>;
  if (!car) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Car not found</div>;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`${car.year} ${car.make} ${car.model} | Southeast Cars`}</title>
        <meta name="description" content={`Buy this ${car.year} ${car.make} ${car.model} for $${car.price.toLocaleString()}. ${car.description.substring(0, 150)}...`} />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <Link to="/inventory" className="inline-flex items-center text-gray-400 hover:text-yellow-500 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-800"
            >
              <img 
                src={car.images[activeImage] || 'https://via.placeholder.com/800x500'} 
                alt={car.model} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {car.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-yellow-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${car.model} thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{car.year} {car.make} {car.model}</h1>
              <p className="text-3xl text-yellow-500 font-mono font-bold">${car.price.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
              <div className="flex items-center text-gray-300">
                <Gauge className="mr-3 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Mileage</p>
                  <p className="font-mono text-lg">{car.mileage.toLocaleString()} mi</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="mr-3 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Year</p>
                  <p className="font-mono text-lg">{car.year}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <Check className="mr-3 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <p className="font-mono text-lg">{car.status}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <DollarSign className="mr-3 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Price</p>
                  <p className="font-mono text-lg">${car.price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Description</h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">{car.description}</p>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-400">
                    <Check size={16} className="text-yellow-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Inquiry Form */}
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
              <h3 className="text-2xl font-bold text-white mb-6">Interested? Inquire Now</h3>
              {isSubmitSuccessful ? (
                <div className="bg-green-500/20 text-green-500 p-4 rounded-xl text-center">
                  Thank you! We'll be in touch shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      {...register('name', { required: true })}
                      placeholder="Name"
                      className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none"
                    />
                    <input
                      {...register('email', { required: true })}
                      placeholder="Email"
                      type="email"
                      className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                  <input
                    {...register('phone')}
                    placeholder="Phone"
                    type="tel"
                    className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none"
                  />
                  <textarea
                    {...register('message', { required: true })}
                    placeholder="I'm interested in this vehicle..."
                    rows={4}
                    className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors flex justify-center items-center space-x-2"
                  >
                    <span>SEND INQUIRY</span>
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
