import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { isSubmitting, isSubmitSuccessful } } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Contact Us | Southeast Cars & Commercials | Get in Touch</title>
        <meta name="description" content="Contact Southeast Cars & Commercials for inquiries about our premium used cars and commercial vehicles. Visit our showroom, call us, or send a message. Open Monday to Saturday." />
        <meta name="keywords" content="contact Southeast Cars, car dealership contact, visit showroom, car inquiry, buy used car, vehicle consultation, car dealer phone number, book car viewing" />
        <link rel="canonical" href="https://www.southeastcars.com/contact" />
        <meta property="og:title" content="Contact Us | Southeast Cars & Commercials" />
        <meta property="og:description" content="Get in touch with our team. Visit our showroom, call us, or send a message about our premium used vehicles." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.southeastcars.com/contact" />
      </Helmet>

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 hero-gradient" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-yellow-500 text-sm font-semibold tracking-wider uppercase mb-3">Contact Us</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">Get in Touch</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Have a question about a vehicle or want to arrange a viewing? Our friendly team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Contact Info Cards - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  icon: MapPin,
                  title: 'Visit Our Showroom',
                  lines: ['123 Luxury Lane', 'Beverly Hills, CA 90210', 'United States'],
                },
                {
                  icon: Phone,
                  title: 'Call Us',
                  lines: ['Main: +1 (555) 123-4567', 'Sales: +1 (555) 987-6543'],
                  links: [
                    { href: 'tel:+15551234567', text: 'Main: +1 (555) 123-4567' },
                    { href: 'tel:+15559876543', text: 'Sales: +1 (555) 987-6543' },
                  ],
                },
                {
                  icon: Mail,
                  title: 'Email Us',
                  links: [
                    { href: 'mailto:info@southeastcars.com', text: 'info@southeastcars.com' },
                    { href: 'mailto:sales@southeastcars.com', text: 'sales@southeastcars.com' },
                  ],
                },
                {
                  icon: Clock,
                  title: 'Opening Hours',
                  lines: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed'],
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-500/10 p-2.5 rounded-lg text-yellow-500 shrink-0">
                      <card.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white mb-2">{card.title}</h3>
                      {card.links ? (
                        <div className="space-y-1">
                          {card.links.map(link => (
                            <a key={link.href} href={link.href} className="block text-gray-500 text-sm hover:text-yellow-500 transition-colors">
                              {link.text}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {card.lines?.map((line, idx) => (
                            <p key={idx} className="text-gray-500 text-sm">{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass-card rounded-2xl p-8 md:p-10">
                <h2 className="text-2xl font-bold text-white mb-2 font-serif">Send a Message</h2>
                <p className="text-gray-500 text-sm mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

                {isSubmitSuccessful ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-xl text-center"
                  >
                    <CheckCircle2 size={48} className="mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-emerald-400/70 text-sm">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Name *</label>
                        <input
                          id="contact-name"
                          {...register('name', { required: true })}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 focus:bg-white/[0.07] focus:outline-none transition-all text-sm"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Email *</label>
                        <input
                          id="contact-email"
                          {...register('email', { required: true })}
                          type="email"
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 focus:bg-white/[0.07] focus:outline-none transition-all text-sm"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Subject *</label>
                      <input
                        id="contact-subject"
                        {...register('subject', { required: true })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 focus:bg-white/[0.07] focus:outline-none transition-all text-sm"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Message *</label>
                      <textarea
                        id="contact-message"
                        {...register('message', { required: true })}
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 focus:bg-white/[0.07] focus:outline-none transition-all text-sm resize-none"
                        placeholder="Tell us what you're looking for..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all flex justify-center items-center space-x-2 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
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
      </section>
    </div>
  );
};
