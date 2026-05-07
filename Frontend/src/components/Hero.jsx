import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-neutral-900 py-24 sm:py-32">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-light/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-xs font-semibold mb-6">
              <Sparkles className="w-3 h-3" />
              <span>New Collection 2024</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-tight">
              Redefining <br />
              <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">Modern Elegance</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-400 max-w-lg">
              Discover our curated collection of premium essentials designed for those who appreciate the finer things in life. Quality meets craftsmanship.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center gap-2 group">
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-full border border-neutral-700 text-white font-semibold hover:bg-neutral-800 transition-all">
                View Lookbook
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
               <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
                alt="Hero" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Float badge */}
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl border border-white/10 hidden sm:block animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  4.9
                </div>
                <div>
                  <p className="text-white font-semibold">Top Rated</p>
                  <p className="text-neutral-400 text-sm">By 20k+ Customers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
