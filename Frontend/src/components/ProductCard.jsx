import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onView }) => {
  const { addToCart } = useCartStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      toast.error('Admins cannot add items to cart', {
        icon: '🚫',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }


    addToCart(product);
    toast.success(`${product.title} added to cart!`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={onView}
    >

      {/* Product Image */}
      <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative mb-6">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300?text=No+Image'} 
          alt={product.title} 
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out"
        />
        
        {/* Subtle Quick Add */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
          <button 
            onClick={handleAddToCart}
            className="w-full py-4 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-neutral-800 transition-all"
          >
            Quick Add
          </button>
        </div>
        
        <button 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors z-10 opacity-0 group-hover:opacity-100 duration-500"
        >
          <Heart className="w-5 h-5" />
        </button>

      </div>

      {/* Product Info */}
      <div className="space-y-1 px-1">
        <div className="flex justify-between items-baseline">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-900 leading-tight">
            {product.title}
          </h3>
          <p className="text-[12px] font-bold text-neutral-400 tracking-tighter">
            ${product.price}
          </p>
        </div>
        <p className="text-[10px] text-neutral-300 font-medium uppercase tracking-widest italic">
          {product.category}
        </p>
      </div>
    </motion.div>


  );
};

export default ProductCard;
