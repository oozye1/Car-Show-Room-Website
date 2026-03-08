import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-950 border-t border-white/5" role="contentinfo">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter / CTA Bar */}
        <div className="py-12 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white font-serif">Stay Updated</h3>
            <p className="text-gray-500 text-sm mt-1">Get notified when new vehicles arrive in our showroom.</p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email for newsletter"
              className="flex-1 md:w-72 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-l-xl focus:outline-none focus:border-yellow-500/50 transition-colors text-sm placeholder:text-gray-600"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-r-xl hover:from-yellow-400 hover:to-yellow-500 transition-all text-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group" aria-label="Southeast Cars - Home">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg">
                <Car className="h-5 w-5 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight leading-none">
                  SOUTHEAST
                </span>
                <span className="text-[10px] font-semibold text-yellow-500 tracking-[0.25em] leading-none mt-0.5">
                  CARS & COMMERCIALS
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your trusted partner for premium used cars and commercial vehicles. Every vehicle is hand-inspected and certified for quality.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:bg-yellow-500 hover:text-black transition-all duration-300" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:bg-yellow-500 hover:text-black transition-all duration-300" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:bg-yellow-500 hover:text-black transition-all duration-300" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {[
                  { name: 'Browse Inventory', path: '/inventory' },
                  { name: 'Contact Us', path: '/contact' },
                  { name: 'About Us', path: '/about' },
                  { name: 'Financing Options', path: '/services' },
                ].map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="group flex items-center text-gray-500 hover:text-yellow-500 transition-colors text-sm">
                      <ArrowUpRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Get in Touch</h3>
            <address className="not-italic">
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                  <span className="text-gray-500 text-sm leading-relaxed">123 Luxury Lane, Beverly Hills, CA 90210</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={16} className="text-yellow-500 shrink-0" />
                  <a href="tel:+15551234567" className="text-gray-500 text-sm hover:text-yellow-500 transition-colors">+1 (555) 123-4567</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={16} className="text-yellow-500 shrink-0" />
                  <a href="mailto:sales@southeastcars.com" className="text-gray-500 text-sm hover:text-yellow-500 transition-colors">sales@southeastcars.com</a>
                </li>
              </ul>
            </address>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Opening Hours</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center"><Clock size={14} className="mr-2 text-yellow-500" />Mon - Fri</span>
                <span className="text-gray-400 font-medium">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center"><Clock size={14} className="mr-2 text-yellow-500" />Saturday</span>
                <span className="text-gray-400 font-medium">10:00 AM - 4:00 PM</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center"><Clock size={14} className="mr-2 text-yellow-500" />Sunday</span>
                <span className="text-gray-400 font-medium">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {currentYear} Southeast Cars & Commercials. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
