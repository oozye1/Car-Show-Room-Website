import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../../types';
import { Calendar, Gauge, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 border border-zinc-800"
    >
      <Link to={`/inventory/${car.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        <img
          src={car.images[0] || 'https://via.placeholder.com/800x500?text=No+Image'}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            View Details
          </span>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {car.make} <span className="text-gray-400 font-normal">{car.model}</span>
            </h3>
            <p className="text-yellow-500 font-mono text-lg font-bold">
              ${car.price.toLocaleString()}
            </p>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
            car.status === 'Available' ? 'bg-green-500/20 text-green-500' : 
            car.status === 'Reserved' ? 'bg-orange-500/20 text-orange-500' : 
            'bg-red-500/20 text-red-500'
          }`}>
            {car.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar size={16} className="mr-2 text-zinc-600" />
            {car.year}
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Gauge size={16} className="mr-2 text-zinc-600" />
            {car.mileage.toLocaleString()} mi
          </div>
        </div>
      </div>
    </motion.div>
  );
};
