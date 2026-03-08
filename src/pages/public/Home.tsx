import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export const Home: React.FC = () => {
  return (
    <div className="relative">
      <Helmet>
        <title>Southeast Cars & Commercials | Premium Vehicle Showroom</title>
        <meta name="description" content="Discover the finest collection of cars and commercials. Southeast Cars & Commercials offers curated excellence." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Car Background"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-white mb-6"
          >
            DRIVE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              EXTRAORDINARY
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light"
          >
            Curated excellence for the modern connoisseur. Experience the world's most exclusive automotive masterpieces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to="/inventory"
              className="inline-flex items-center space-x-3 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              <span>VIEW INVENTORY</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 border border-white/5 rounded-2xl hover:border-yellow-500/30 transition-colors bg-white/5 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Curated Selection</h3>
              <p className="text-gray-400 leading-relaxed">
                Every vehicle in our showroom is hand-picked for its rarity, condition, and provenance.
              </p>
            </div>
            <div className="text-center p-8 border border-white/5 rounded-2xl hover:border-yellow-500/30 transition-colors bg-white/5 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Certified Quality</h3>
              <p className="text-gray-400 leading-relaxed">
                Rigorous 150-point inspection and certification process ensures absolute peace of mind.
              </p>
            </div>
            <div className="text-center p-8 border border-white/5 rounded-2xl hover:border-yellow-500/30 transition-colors bg-white/5 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Financing</h3>
              <p className="text-gray-400 leading-relaxed">
                Bespoke financial solutions tailored to your unique requirements and lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Interior"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              READY TO UPGRADE <br />
              YOUR LIFESTYLE?
            </h2>
            <p className="text-xl text-gray-300 mb-10 font-light">
              Visit our showroom today or schedule a private viewing of our exclusive collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex justify-center items-center px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
              >
                BOOK APPOINTMENT
              </Link>
              <Link
                to="/inventory"
                className="inline-flex justify-center items-center px-8 py-4 border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-colors"
              >
                BROWSE CARS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
