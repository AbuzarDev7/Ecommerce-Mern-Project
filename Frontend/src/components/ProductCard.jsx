import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
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
      whileHover={{ y: -10 }}
      className="group relative glass rounded-3xl overflow-hidden border border-neutral-100 hover:border-brand/30 transition-all duration-500"
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-neutral-100 relative">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-neutral-600 hover:text-red-500 hover:bg-white transition-all shadow-sm">
          <Heart className="w-5 h-5" />
        </button>
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full py-3 bg-brand text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">{product.category}</p>
            <h3 className="text-lg font-semibold text-neutral-800 mt-1">{product.title}</h3>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold text-neutral-700">4.5</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-2xl font-bold text-brand">${product.price}</p>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-red-500 font-bold">Only {product.stock} left!</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
