import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Car } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Gauge, DollarSign, Check, ArrowLeft, Send, Share2, Heart, CheckCircle2 } from 'lucide-react';
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
        const docRef = doc(db, 'cars', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() } as Car);
        } else {
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-yellow-500 animate-spin" />
        </div>
        <p className="text-gray-600 text-sm mt-4">Loading vehicle details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-bold mb-2">Vehicle Not Found</h1>
        <p className="text-gray-500 mb-6">The vehicle you're looking for may have been sold or removed.</p>
        <Link to="/inventory" className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors">
          Browse Our Inventory
        </Link>
      </div>
    );
  }

  // JSON-LD structured data for this specific vehicle
  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${car.year} ${car.make} ${car.model}`,
    "brand": { "@type": "Brand", "name": car.make },
    "model": car.model,
    "vehicleModelDate": String(car.year),
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": car.mileage,
      "unitCode": "SMI"
    },
    "image": car.images,
    "description": car.description,
    "url": `https://www.southeastcars.com/inventory/${car.slug}`,
    "offers": {
      "@type": "Offer",
      "price": car.price,
      "priceCurrency": "USD",
      "availability": car.status === 'Available'
        ? "https://schema.org/InStock"
        : car.status === 'Reserved'
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/SoldOut",
      "seller": {
        "@type": "AutoDealer",
        "name": "Southeast Cars & Commercials",
        "url": "https://www.southeastcars.com"
      }
    },
    "vehicleConfiguration": car.features?.join(', '),
  };

  const statusColors = {
    Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Reserved: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Sold: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{`${car.year} ${car.make} ${car.model} for Sale | $${car.price.toLocaleString()} | Southeast Cars`}</title>
        <meta name="description" content={`Buy this ${car.year} ${car.make} ${car.model} for $${car.price.toLocaleString()}. ${car.mileage.toLocaleString()} miles. ${car.description?.substring(0, 140)}. Certified quality at Southeast Cars & Commercials.`} />
        <meta name="keywords" content={`${car.year} ${car.make} ${car.model}, ${car.make} ${car.model} for sale, used ${car.make}, buy ${car.model}, ${car.make} dealership, Southeast Cars`} />
        <link rel="canonical" href={`https://www.southeastcars.com/inventory/${car.slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={`${car.year} ${car.make} ${car.model} - $${car.price.toLocaleString()}`} />
        <meta property="og:description" content={`${car.year} ${car.make} ${car.model} with ${car.mileage.toLocaleString()} miles for sale at Southeast Cars & Commercials.`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://www.southeastcars.com/inventory/${car.slug}`} />
        {car.images[0] && <meta property="og:image" content={car.images[0]} />}
        <meta property="product:price:amount" content={String(car.price)} />
        <meta property="product:price:currency" content="USD" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${car.year} ${car.make} ${car.model} - $${car.price.toLocaleString()}`} />
        <meta name="twitter:description" content={`${car.mileage.toLocaleString()} miles. Certified quality at Southeast Cars.`} />
        {car.images[0] && <meta name="twitter:image" content={car.images[0]} />}

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(vehicleJsonLd)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-gray-600 hover:text-gray-400 transition-colors">Home</Link></li>
            <li className="text-gray-700">/</li>
            <li><Link to="/inventory" className="text-gray-600 hover:text-gray-400 transition-colors">Inventory</Link></li>
            <li className="text-gray-700">/</li>
            <li className="text-gray-400">{car.year} {car.make} {car.model}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ===== Images Section ===== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card">
              <img
                src={car.images[activeImage] || 'https://via.placeholder.com/800x500'}
                alt={`${car.year} ${car.make} ${car.model} - Image ${activeImage + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Status badge on image */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[car.status as keyof typeof statusColors] || statusColors.Available}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                  {car.status}
                </span>
              </div>
              {/* Image counter */}
              {car.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                  {activeImage + 1} / {car.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === idx
                        ? 'border-yellow-500 ring-2 ring-yellow-500/20'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt={`${car.make} ${car.model} thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ===== Details Section ===== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Title & Price */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-3">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl text-yellow-500 font-mono font-bold">${car.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Gauge, label: 'Mileage', value: `${car.mileage.toLocaleString()} mi` },
                { icon: Calendar, label: 'Year', value: String(car.year) },
                { icon: Check, label: 'Status', value: car.status },
                { icon: DollarSign, label: 'Price', value: `$${car.price.toLocaleString()}` },
              ].map(spec => (
                <div key={spec.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-yellow-500/10 p-2 rounded-lg">
                    <spec.icon size={18} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">{spec.label}</p>
                    <p className="text-white font-mono text-sm font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-yellow-500 rounded-full" />
                Description
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-line">{car.description}</p>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-yellow-500 rounded-full" />
                  Features & Specifications
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-400 text-sm py-1.5">
                      <CheckCircle2 size={14} className="text-yellow-500 mr-2.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inquiry Form */}
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-2 font-serif">Interested in This Vehicle?</h2>
              <p className="text-gray-500 text-sm mb-6">Send us an inquiry and we'll get back to you within 24 hours.</p>

              {isSubmitSuccessful ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-xl text-center"
                >
                  <CheckCircle2 size={40} className="mx-auto mb-3" />
                  <h3 className="text-lg font-bold mb-1">Inquiry Sent!</h3>
                  <p className="text-emerald-400/70 text-sm">Thank you! We'll be in touch shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inquiry-name" className="sr-only">Name</label>
                      <input
                        id="inquiry-name"
                        {...register('name', { required: true })}
                        placeholder="Your name *"
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 focus:bg-white/[0.07] focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry-email" className="sr-only">Email</label>
                      <input
                        id="inquiry-email"
                        {...register('email', { required: true })}
                        placeholder="Your email *"
                        type="email"
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 focus:bg-white/[0.07] focus:outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="inquiry-phone" className="sr-only">Phone</label>
                    <input
                      id="inquiry-phone"
                      {...register('phone')}
                      placeholder="Phone number (optional)"
                      type="tel"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 focus:bg-white/[0.07] focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiry-message" className="sr-only">Message</label>
                    <textarea
                      id="inquiry-message"
                      {...register('message', { required: true })}
                      placeholder={`I'm interested in the ${car.year} ${car.make} ${car.model}...`}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 focus:bg-white/[0.07] focus:outline-none transition-all text-sm resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3.5 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all flex justify-center items-center space-x-2 shadow-lg shadow-yellow-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>SEND INQUIRY</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
