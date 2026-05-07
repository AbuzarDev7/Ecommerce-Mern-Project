import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import useProductStore from '../store/useProductStore';
import { motion } from 'framer-motion';

const Home = () => {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen pb-20">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-neutral-900">Featured Products</h2>
            <p className="text-neutral-500 mt-2">Explore our most popular items handpicked for you.</p>
          </div>
          <button className="text-brand font-bold hover:underline">View All Products</button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              // Mock data if no products from API yet
              [1, 2, 3, 4].map((i) => (
                <ProductCard key={i} product={{
                  _id: i,
                  title: `Premium Product ${i}`,
                  price: 199.99,
                  category: 'Essentials',
                  imageUrl: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&sig=${i}`
                }} />
              ))
            )}
          </motion.div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-neutral-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Join the Luxe Circle</h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 rounded-full bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button className="px-8 py-4 bg-brand text-white rounded-full font-bold hover:bg-brand-dark transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
