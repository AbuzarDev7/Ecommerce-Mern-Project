import React, { useState, useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';
import { motion, AnimatePresence } from 'framer-motion';

import { LayoutGrid, ListFilter, Tag } from 'lucide-react';

const Categories = () => {
  const { products, fetchProducts, loading } = useProductStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Shop by Category</h1>
          <p className="text-neutral-500">Discover our curated collections of premium goods.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-2xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat 
                ? 'bg-white text-brand shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
               <ProductCard product={product} onView={() => handleViewProduct(product._id)} />

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
          <Tag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-800">No products found</h3>
          <p className="text-neutral-500">We couldn't find any products in the {activeCategory} category.</p>
        </div>
      )}
      <ProductQuickView 
        productId={selectedProductId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>

  );
};

export default Categories;
