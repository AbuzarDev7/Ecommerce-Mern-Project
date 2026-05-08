import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();
  const { fetchCart } = useCartStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      await fetchCart();
      toast.success('Login Successful!');
      
      if (user.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="max-w-md w-full glass p-8 md:p-12 rounded-[2rem] border border-neutral-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Welcome Back</h2>
          <p className="text-neutral-500">Sign in to your premium account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-100 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all outline-none"
                placeholder="name@example.com"
                required
              />
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-100 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all outline-none"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-brand focus:ring-brand" />
              <span className="text-neutral-600">Remember me</span>
            </label>
            <a href="#" className="text-brand font-semibold hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-brand font-bold hover:underline">Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
