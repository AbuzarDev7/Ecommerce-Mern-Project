import React, { useEffect } from 'react';
import { X, ShoppingCart, Star, Truck, ShieldCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ProductQuickView = ({ productId, isOpen, onClose }) => {
  const { product, fetchProductById, loading } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();


  useEffect(() => {
    if (productId && isOpen) {
      fetchProductById(productId);
    }
  }, [productId, isOpen, fetchProductById]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {loading || !product ? (
              <div className="flex-1 flex items-center justify-center h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
              </div>
            ) : (
              <>
                {/* Image Gallery */}
                <div className="w-full md:w-1/2 bg-neutral-50 h-[300px] md:h-auto overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                  <div className="flex flex-col h-full">
                    <div className="mb-8">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2 block">
                        {product.category}
                      </span>
                      <h2 className="text-4xl font-black text-neutral-900 tracking-tighter mb-4">
                        {product.title}
                      </h2>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold text-neutral-900">4.8</span>
                        </div>
                        <span className="text-neutral-300">|</span>
                        <span className="text-sm text-neutral-500 font-medium">124 Reviews</span>
                      </div>
                      <p className="text-3xl font-black text-neutral-900 mb-8">
                        ${product.price}
                      </p>
                      <p className="text-neutral-500 leading-relaxed mb-8">
                        {product.description || "Crafted with precision and a focus on minimalist aesthetics, this piece represents our commitment to quality and timeless design."}
                      </p>
                    </div>

                    <div className="space-y-6 mb-10">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                        <Truck className="w-5 h-5 text-neutral-900" />
                        <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Fast & Free Shipping Worldwide</p>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                        <ShieldCheck className="w-5 h-5 text-neutral-900" />
                        <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">2-Year Authentic Warranty</p>
                      </div>
                    </div>

                    <div className="mt-auto flex gap-4">
                      <button 
                        onClick={() => {
                          if (user && user.role === 'admin') {
                            toast.error('Admins cannot shop');
                            return;
                          }
                          addToCart(product);
                          toast.success('Added to Bag');
                        }}
                        className="flex-1 py-5 bg-neutral-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
                      >

                        <ShoppingCart className="w-5 h-5" />
                        Add to Bag
                      </button>
                      <button className="p-5 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-all">
                        <Heart className="w-5 h-5 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
