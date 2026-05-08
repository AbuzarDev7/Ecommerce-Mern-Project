import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import api from '../api';
import { User, Package, Mail, Calendar, ChevronRight, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout, forgotPassword } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!window.confirm('Send password reset email to your registered address?')) return;
    
    setResetLoading(true);
    try {
      await forgotPassword(user.email);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error('Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* User Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass rounded-[3rem] p-8 text-center border border-neutral-100 shadow-xl">
            <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-brand" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">{user.name}</h2>
            <p className="text-neutral-500 mb-6">{user.email}</p>
            
            <div className="flex justify-center gap-2 mb-8">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.role === 'admin' ? 'bg-brand text-white' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {user.role} Account
              </span>
            </div>

            <button 
              onClick={logout}
              className="w-full py-4 border-2 border-red-100 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          <div className="glass rounded-[3rem] p-8 border border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-6">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl cursor-not-allowed opacity-60">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-neutral-400" />
                  <span className="text-sm font-medium">Update Email</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
              <div 
                onClick={handlePasswordReset}
                className={`flex items-center justify-between p-4 bg-neutral-50 rounded-2xl cursor-pointer hover:bg-neutral-100 transition-colors ${resetLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand" />
                  <span className="text-sm font-medium">{resetLoading ? 'Sending...' : 'Change Password'}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
            <Package className="w-8 h-8 text-brand" />
            Order History
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order._id} 
                  className="glass rounded-3xl p-6 md:p-8 border border-neutral-100 hover:border-brand/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="font-bold text-neutral-800">{order._id}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Status</p>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        {order.isPaid ? 'Paid & Confirmed' : 'Processing'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div className="flex-grow">
                          <p className="font-bold text-neutral-800">{item.title}</p>
                          <p className="text-sm text-neutral-500">{item.qty} × ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-end pt-6 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-neutral-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Total Amount</p>
                      <p className="text-2xl font-bold text-brand">${order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
              <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-800">No orders yet</h3>
              <p className="text-neutral-500">When you purchase something, it will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
