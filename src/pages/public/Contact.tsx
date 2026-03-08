import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { isSubmitting, isSubmitSuccessful } } = useForm();

  const onSubmit = async (data: any) => {
    // In a real app, this would send an email or save to a general inquiries collection
    console.log(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">GET IN <span className="text-yellow-500">TOUCH</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our concierge team is available 24/7 to assist with your automotive needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-yellow-500/30 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Visit Our Showroom</h3>
                  <p className="text-gray-400 leading-relaxed">
                    123 Luxury Lane<br />
                    Beverly Hills, CA 90210<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-yellow-500/30 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-500">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                  <p className="text-gray-400 leading-relaxed mb-2">Main: +1 (555) 123-4567</p>
                  <p className="text-gray-400 leading-relaxed">Sales: +1 (555) 987-6543</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-yellow-500/30 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-500">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                  <p className="text-gray-400 leading-relaxed mb-2">General: info@southeastcars.com</p>
                  <p className="text-gray-400 leading-relaxed">Sales: sales@southeastcars.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            {isSubmitSuccessful ? (
              <div className="bg-green-500/20 text-green-500 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p>We will get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      {...register('email', { required: true })}
                      type="email"
                      className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                  <input
                    {...register('subject', { required: true })}
                    className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea
                    {...register('message', { required: true })}
                    rows={6}
                    className="w-full bg-black border border-zinc-700 text-white px-4 py-3 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors flex justify-center items-center space-x-2"
                >
                  <span>SEND MESSAGE</span>
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
