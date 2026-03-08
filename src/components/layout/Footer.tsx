import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <Car className="h-8 w-8 text-white group-hover:text-yellow-500 transition-colors" />
              <span className="text-xl font-bold text-white tracking-tighter">
                SOUTHEAST<span className="text-yellow-500">CARS</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the pinnacle of automotive excellence. We curate the world's finest vehicles for the most discerning drivers.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">EXPLORE</h3>
            <ul className="space-y-4">
              <li><Link to="/inventory" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Inventory</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Services</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">CONTACT</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-yellow-500 mt-0.5" />
                <span>123 Luxury Lane, Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone size={18} className="text-yellow-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail size={18} className="text-yellow-500" />
                <span>sales@southeastcars.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">FOLLOW US</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-3 rounded-full bg-gray-900 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-3 rounded-full bg-gray-900 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 rounded-full bg-gray-900 text-white hover:bg-yellow-500 hover:text-black transition-all duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Southeast Cars & Commercials. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-600 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
