import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap, Award, Users, TrendingUp, CheckCircle2, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Car } from '../../types';
import { CarCard } from '../../components/ui/CarCard';

const stats = [
  { label: 'Vehicles Sold', value: '2,500+', icon: TrendingUp },
  { label: 'Happy Customers', value: '2,200+', icon: Users },
  { label: 'Years Experience', value: '15+', icon: Award },
  { label: 'Quality Rating', value: '4.9/5', icon: Star },
];

const testimonials = [
  {
    name: 'James Mitchell',
    role: 'Business Owner',
    text: 'Exceptional service from start to finish. The team at Southeast Cars made buying my new vehicle an absolute pleasure. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Sarah Thompson',
    role: 'Marketing Director',
    text: 'I was impressed by the quality of vehicles and the transparency throughout the entire process. Found my dream car at an unbeatable price.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Engineer',
    text: 'The financing options were flexible and the staff were incredibly knowledgeable. Best car buying experience I have ever had.',
    rating: 5,
  },
];

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const carsRef = collection(db, 'cars');
        const q = query(carsRef, where('status', '==', 'Available'), orderBy('createdAt', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];
        setFeaturedCars(cars);
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <Helmet>
        <title>Southeast Cars & Commercials | Premium Used Cars for Sale</title>
        <meta name="description" content="Southeast Cars & Commercials - Browse our curated collection of premium used cars and commercial vehicles. Certified quality, flexible financing, and exceptional service. Find your perfect vehicle today." />
        <meta name="keywords" content="used cars for sale, premium cars, commercial vehicles, car dealership, certified used cars, car showroom, buy cars, Southeast Cars, vehicle financing, quality used vehicles, affordable cars" />
        <link rel="canonical" href="https://www.southeastcars.com/" />
        <meta property="og:title" content="Southeast Cars & Commercials | Premium Used Cars for Sale" />
        <meta property="og:description" content="Browse our curated collection of premium used cars and commercial vehicles. Certified quality and flexible financing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.southeastcars.com/" />
      </Helmet>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Premium vehicles at Southeast Cars showroom"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-yellow-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-yellow-500/3 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">Now Open — Browse Our Latest Arrivals</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 font-serif"
          >
            Find Your Perfect
            <br />
            <span className="text-gradient-gold">Vehicle Today</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Southeast Cars & Commercials offers a hand-picked selection of quality used vehicles.
            Every car is fully inspected, certified, and ready for the road.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/inventory"
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-base hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 hover:scale-[1.02]"
            >
              <span>BROWSE INVENTORY</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-base border border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all"
            >
              <span>BOOK A VIEWING</span>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 150-Point Inspection</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Finance Available</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Part Exchange Welcome</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative py-20 bg-zinc-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 mb-4">
                    <stat.icon size={22} />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-white font-mono mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES / WHY CHOOSE US ===== */}
      <section className="py-24 bg-black relative overflow-hidden" aria-labelledby="why-choose-heading">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/3 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-yellow-500 text-sm font-semibold tracking-wider uppercase mb-3">Why Choose Us</p>
              <h2 id="why-choose-heading" className="text-3xl md:text-5xl font-bold text-white font-serif mb-4">
                The Southeast Cars Difference
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                We go above and beyond to ensure every customer drives away with confidence and satisfaction.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'Curated Selection',
                description: 'Every vehicle is hand-picked for quality, condition, and value. We only stock cars we would drive ourselves.',
              },
              {
                icon: Shield,
                title: 'Certified Quality',
                description: 'Rigorous 150-point inspection and full certification process ensures complete peace of mind with every purchase.',
              },
              {
                icon: Zap,
                title: 'Flexible Financing',
                description: 'Bespoke financial solutions tailored to your needs. Competitive rates and flexible terms to suit every budget.',
              },
            ].map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.15}>
                <div className="group glass-card glass-card-hover rounded-2xl p-8 transition-all duration-500 h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 text-yellow-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED VEHICLES ===== */}
      {featuredCars.length > 0 && (
        <section className="py-24 bg-zinc-950 relative" aria-labelledby="featured-heading">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
                <div>
                  <p className="text-yellow-500 text-sm font-semibold tracking-wider uppercase mb-3">Featured Vehicles</p>
                  <h2 id="featured-heading" className="text-3xl md:text-5xl font-bold text-white font-serif">
                    Latest Arrivals
                  </h2>
                </div>
                <Link
                  to="/inventory"
                  className="group mt-4 md:mt-0 inline-flex items-center text-sm text-gray-400 hover:text-yellow-500 transition-colors font-medium"
                >
                  View All Vehicles
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car, i) => (
                <AnimatedSection key={car.id} delay={i * 0.15}>
                  <CarCard car={car} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-black relative overflow-hidden" aria-labelledby="testimonials-heading">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/3 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-yellow-500 text-sm font-semibold tracking-wider uppercase mb-3">Testimonials</p>
              <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-bold text-white font-serif mb-4">
                What Our Customers Say
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-2xl p-8 md:p-12 relative">
                <Quote size={48} className="text-yellow-500/10 absolute top-6 left-6" />
                <div className="relative">
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <blockquote>
                    <p className="text-lg md:text-xl text-gray-300 text-center leading-relaxed mb-8 font-light italic">
                      "{testimonials[activeTestimonial].text}"
                    </p>
                  </blockquote>
                  <div className="text-center">
                    <p className="text-white font-semibold">{testimonials[activeTestimonial].name}</p>
                    <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i === activeTestimonial ? 'bg-yellow-500 w-6' : 'bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonials.length)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-32 relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Premium car interior representing the luxury experience at Southeast Cars"
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-2xl">
              <p className="text-yellow-500 text-sm font-semibold tracking-wider uppercase mb-4">Ready to Get Started?</p>
              <h2 id="cta-heading" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-serif">
                Your Next Car <br />
                Awaits You
              </h2>
              <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed">
                Visit our showroom today, browse our full inventory online, or schedule a private viewing. Our team is ready to help you find the perfect vehicle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex justify-center items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20"
                >
                  BOOK APPOINTMENT
                </Link>
                <Link
                  to="/inventory"
                  className="inline-flex justify-center items-center px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 hover:border-white/30 transition-all"
                >
                  BROWSE CARS
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};
