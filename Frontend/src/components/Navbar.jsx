import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { cart } = useCartStore();
  const { user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
              LUXE
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/shop" className="text-neutral-600 hover:text-brand transition-colors">Shop</Link>
              <Link to="/categories" className="text-neutral-600 hover:text-brand transition-colors">Categories</Link>
              {user?.role === 'admin' && (
                <Link to="/admin/products" className="text-brand font-bold hover:text-brand-dark transition-colors">Admin Panel</Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 bg-neutral-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 w-64 transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            </div>

            <div className="flex items-center gap-2">
              <Link to="/cart" className="relative p-2 text-neutral-600 hover:text-brand transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="p-2 text-neutral-600 hover:text-brand transition-colors">
                    <User className="w-6 h-6" />
                  </Link>
                  <button onClick={logout} className="p-2 text-neutral-600 hover:text-red-500 transition-colors">
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 rounded-full bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-all shadow-md hover:shadow-lg">
                  Login
                </Link>
              )}
              
              <button className="md:hidden p-2 text-neutral-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
