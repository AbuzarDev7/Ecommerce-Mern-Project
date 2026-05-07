import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCartStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-neutral-400" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our luxury collection and find something you love.
        </p>
        <Link to="/shop" className="px-8 py-4 bg-brand text-white rounded-full font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <h1 className="text-4xl font-bold text-neutral-900 mb-12">Shopping Bag</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="glass rounded-3xl p-6 flex flex-col sm:flex-row gap-6 border border-neutral-100 hover:border-brand/20 transition-all">
              <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-neutral-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold mb-1">{item.category}</p>
                    <h3 className="text-xl font-bold text-neutral-900">{item.title}</h3>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-6">
                  <div className="flex items-center gap-4 bg-neutral-100 rounded-full px-4 py-2">
                    <button 
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="text-neutral-500 hover:text-brand"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-neutral-900 w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="text-neutral-500 hover:text-brand"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-2xl font-bold text-brand">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass rounded-[2.5rem] p-8 sticky top-24 border border-neutral-100 shadow-xl shadow-neutral-100">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="text-neutral-900 font-semibold">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="text-green-500 font-semibold italic text-sm">FREE Shipping</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Tax</span>
                <span className="text-neutral-900 font-semibold">$0.00</span>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex justify-between">
                <span className="text-xl font-bold text-neutral-900">Total</span>
                <span className="text-3xl font-bold text-brand">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="w-full py-5 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-2 group">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="text-center text-xs text-neutral-400 mt-6 px-4 leading-relaxed">
              Secure checkout guaranteed. We accept all major credit cards and digital payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
