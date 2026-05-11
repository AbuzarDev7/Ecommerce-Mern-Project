import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, UserCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Signup = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('role', role);

      await register(submitData);

      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="max-w-md w-full glass p-8 md:p-12 rounded-[2rem] border border-neutral-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Join LUXE</h2>
          <p className="text-neutral-500">Create your account today</p>
        </div>

        {/* Role Toggle */}
        <div className="relative z-10 flex items-center justify-center gap-2 mb-8 p-1.5 bg-neutral-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              role === 'user'
                ? 'bg-white text-neutral-900 shadow-md'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <UserCircle className="w-4 h-4" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              role === 'admin'
                ? 'bg-white text-neutral-900 shadow-md'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Seller
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-neutral-100 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all outline-none"
                placeholder="John Doe"
                required
              />
              <User className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-neutral-100 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all outline-none"
                placeholder="name@example.com"
                required
              />
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-neutral-100 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all outline-none"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {role === 'admin' ? 'Register as Seller' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-brand font-bold hover:underline">Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
