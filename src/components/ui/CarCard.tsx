import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../../types';
import { Calendar, Gauge, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const statusColors = {
    Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Reserved: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Sold: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group glass-card rounded-2xl overflow-hidden glass-card-hover transition-all duration-500"
      itemScope
      itemType="https://schema.org/Car"
    >
      <Link to={`/inventory/${car.slug}`} className="block" aria-label={`View ${car.year} ${car.make} ${car.model} - $${car.price.toLocaleString()}`}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={car.images[0] || 'https://via.placeholder.com/800x500?text=No+Image'}
            alt={`${car.year} ${car.make} ${car.model} for sale at Southeast Cars`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            itemProp="image"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[car.status as keyof typeof statusColors] || statusColors.Available}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
              {car.status}
            </span>
          </div>

          {/* Price on image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider" itemProp="brand">{car.make}</p>
              <h3 className="text-white text-xl font-bold leading-tight" itemProp="name">
                {car.make} {car.model}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight size={18} className="text-white" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-yellow-500 font-mono text-xl font-bold" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="priceCurrency" content="USD" />
              <span itemProp="price" content={String(car.price)}>${car.price.toLocaleString()}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar size={14} className="mr-1.5 text-gray-600" />
              <span itemProp="vehicleModelDate">{car.year}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <div className="flex items-center text-gray-500 text-sm">
              <Gauge size={14} className="mr-1.5 text-gray-600" />
              <span itemProp="mileageFromOdometer">{car.mileage.toLocaleString()} mi</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
