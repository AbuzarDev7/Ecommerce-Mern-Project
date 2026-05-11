import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-[#F9F9F9] flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-5 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-6 block">
                Collection 2024
              </span>
              <h1 className="text-7xl sm:text-8xl font-black text-neutral-900 leading-[0.9] tracking-tighter mb-10">
                The Art of <br /> 
                <span className="text-neutral-300 italic font-medium">Restraint</span>
              </h1>
              <p className="text-lg text-neutral-500 max-w-sm leading-relaxed mb-12">
                A study in minimalism and high-quality materials. Curated essentials for the discerning individual.
              </p>
              <div className="flex items-center gap-10">
                <Link to="/shop" className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-900 border-b-2 border-neutral-900 pb-2 hover:text-neutral-400 hover:border-neutral-400 transition-all">
                  Shop Collection
                </Link>
                <Link to="/about" className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-neutral-900 transition-all">
                  Our Story
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Image Content */}
          <div className="lg:col-span-7 relative h-[70vh] sm:h-[85vh]">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" 
                alt="Editorial" 
                className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
              />
            </motion.div>
            
            {/* Minimalist Overlay Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -bottom-10 -left-10 bg-white p-12 hidden lg:block shadow-2xl"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 mb-2">Philosophy</p>
              <p className="text-2xl font-bold text-neutral-900 max-w-[200px] leading-tight tracking-tighter">
                Quality is the only sustainable luxury.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="flex flex-col items-center gap-4">
           <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-neutral-300 rotate-90 mb-8">Scroll</span>
           <div className="w-[1px] h-20 bg-neutral-200"></div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
