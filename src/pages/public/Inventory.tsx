import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Car } from '../../types';
import { CarCard } from '../../components/ui/CarCard';
import { Search, Filter } from 'lucide-react';

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

  const uniqueMakes = Array.from(new Set(cars.map(car => car.make)));

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6 md:mb-0">
            OUR <span className="text-yellow-500">COLLECTION</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <select
                value={filterMake}
                onChange={(e) => setFilterMake(e.target.value)}
                className="w-full sm:w-48 bg-zinc-900 border border-zinc-800 text-white pl-10 pr-8 py-3 rounded-xl focus:outline-none focus:border-yellow-500 appearance-none transition-colors"
              >
                <option value="">All Makes</option>
                {uniqueMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-500 text-xl">No vehicles found matching your criteria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilterMake('');}}
              className="mt-4 text-yellow-500 hover:text-yellow-400 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
