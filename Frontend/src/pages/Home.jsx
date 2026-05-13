import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import useProductStore from '../store/useProductStore';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductQuickView from '../components/ProductQuickView';
import { useState } from 'react';


const Home = () => {
  const { products, fetchProducts, loading } = useProductStore();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = [
    { name: 'Modern Tailoring', image: 'https://via.placeholder.com/300?text=Modern+Tailoring' },
    { name: 'Refined Leisure', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600' },
    { name: 'Essential Goods', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Editorial Categories */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative aspect-[3/4] group overflow-hidden cursor-pointer bg-neutral-100"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-white bg-black/80 px-6 py-3">
                  {cat.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-32 border-t border-neutral-100">
        <div className="flex justify-between items-center mb-20">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-neutral-900 uppercase italic">Latest Pieces</h2>
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Summer / Autumn 24</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[3/4] bg-neutral-100" />
                <div className="h-4 bg-neutral-100 w-2/3" />
                <div className="h-4 bg-neutral-100 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={() => handleViewProduct(product._id)}
                />
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <ProductCard
                  key={i}
                  product={{
                    _id: i,
                    title: `Essential Item ${i}`,
                    price: (150 + i * 10).toFixed(2),
                    category: 'Essentials',
                    imageUrl: `https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600&sig=${i}`
                  }}
                  onView={() => handleViewProduct(i)}
                />
              ))
            )}

          </div>
        )}
      </section>

      {/* Minimalism Quote Section */}
      <section className="bg-neutral-900 py-40">
        <div className="max-w-4xl mx-auto px-10 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <h2 className="text-3xl sm:text-5xl font-medium text-white leading-tight italic tracking-tight">
              "Luxury is not the opposite of poverty; it is the opposite of vulgarity."
            </h2>
            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.6em] text-neutral-500">
              Coco Chanel
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter - Minimalist */}
      <section className="py-40">
        <div className="max-w-2xl mx-auto px-10 text-center">
          <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-neutral-400 mb-8">
            The Journal
          </h2>
          <p className="text-3xl font-bold text-neutral-900 mb-12 tracking-tighter italic">
            Receive exclusive updates and access to new collections.
          </p>
          <div className="flex items-center border-b-2 border-neutral-900 py-4">
            <input
              type="email"
              placeholder="YOUR@EMAIL.COM"
              className="flex-1 bg-transparent text-[11px] font-black tracking-[0.2em] focus:outline-none uppercase"
            />
            <button className="text-[11px] font-black uppercase tracking-[0.3em] ml-4">
              Join
            </button>
          </div>
        </div>
      </section>
      <ProductQuickView
        productId={selectedProductId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>

  );
};

export default Home;

