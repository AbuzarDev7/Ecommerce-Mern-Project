import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { cart } = useCartStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = user?.role === 'admin' 
    ? [
        { name: 'Dashboard', path: '/admin/products' },
        { name: 'Orders', path: '/admin/orders' }, // Future order management
      ]
    : [
        { name: 'Collections', path: '/' },
      ];



  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'py-4 bg-white/90 backdrop-blur-xl border-b border-neutral-100 shadow-sm' : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-neutral-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Nav Links - Desktop Left */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-neutral-500 ${
                  location.pathname === link.path ? 'text-neutral-900' : 'text-neutral-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logo - Centered */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-black tracking-[0.3em] text-neutral-900">
            LUXE
          </Link>
          
          {/* Right Side Tools */}
          <div className="flex items-center gap-6">
            <button className="hidden sm:block text-neutral-400 hover:text-neutral-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/profile" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                {user.role !== 'admin' && (
                  <Link to="/cart" className="relative text-neutral-400 hover:text-neutral-900 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                )}

              </div>
            ) : (
              <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[70px] bg-white z-40 md:hidden"
          >
            <div className="px-10 py-12 flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-black tracking-tighter text-neutral-900"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-12 pt-12 border-t border-neutral-100">
                 {!user && (
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xl font-bold underline"
                    >
                      Sign In
                    </Link>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
