import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Car } from '../../types';
import { CarCard } from '../../components/ui/CarCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export const Inventory: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMake, setFilterMake] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsRef = collection(db, 'cars');
        const q = query(carsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedCars = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Car[];
        setCars(fetchedCars);
      } catch (error) {
        console.error("Error fetching cars: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMake = filterMake ? car.make === filterMake : true;
    return matchesSearch && matchesMake;
  });

  const uniqueMakes = Array.from(new Set(cars.map(car => car.make))).sort();
  const hasActiveFilters = searchTerm || filterMake;

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Used Cars for Sale | Browse Our Inventory | Southeast Cars & Commercials</title>
        <meta name="description" content={`Browse ${cars.length}+ quality used cars and commercial vehicles for sale at Southeast Cars & Commercials. Search by make, model, and more. All vehicles certified and inspected.`} />
        <meta name="keywords" content="used cars for sale, buy used cars, car inventory, used vehicles, pre-owned cars, certified used cars, Southeast Cars inventory, affordable cars" />
        <link rel="canonical" href="https://www.southeastcars.com/inventory" />
        <meta property="og:title" content="Used Cars for Sale | Southeast Cars & Commercials" />
        <meta property="og:description" content="Browse our full inventory of quality used cars and commercial vehicles. All certified and inspected." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.southeastcars.com/inventory" />
      </Helmet>

      {/* Hero Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 hero-gradient" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-yellow-500 text-sm font-semibold tracking-wider uppercase mb-3">Our Collection</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
              Browse Our Vehicles
            </h1>
            <p className="text-gray-500 max-w-xl mb-8">
              Explore our curated selection of quality used cars and commercial vehicles. Use the filters below to find your perfect match.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="search"
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.07] transition-all text-sm placeholder:text-gray-600"
                aria-label="Search vehicles by make or model"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" size={18} />
              <select
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
                className="w-full sm:w-52 bg-white/5 border border-white/10 text-white pl-11 pr-8 py-3 rounded-xl focus:outline-none focus:border-yellow-500/50 appearance-none transition-all text-sm"
                aria-label="Filter by vehicle make"
              >
                <option value="">All Makes</option>
                {uniqueMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => { setSearchTerm(''); setFilterMake(''); }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                aria-label="Clear all filters"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </motion.div>

          {/* Results count */}
          {!loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-sm mt-6"
            >
              Showing {filteredCars.length} of {cars.length} vehicles
            </motion.p>
          )}
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8" aria-label="Vehicle listings">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-yellow-500 animate-spin" />
              </div>
              <p className="text-gray-600 text-sm mt-4">Loading vehicles...</p>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.5) }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg font-medium mb-2">No vehicles found</p>
              <p className="text-gray-600 text-sm mb-6">Try adjusting your search or filter criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setFilterMake(''); }}
                className="text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
