import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, ShieldCheck, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { forgotPassword, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      const code = err?.code;
      if (code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (code === 'auth/too-many-requests') {
        toast.error('Too many requests. Try again later.');
      } else {
        toast.error(err.message || 'Failed to send reset email');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="max-w-md w-full glass p-8 md:p-12 rounded-[2rem] border border-neutral-200 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="relative z-10 flex items-center gap-2 text-neutral-500 hover:text-brand transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Login</span>
        </button>

        {!sent ? (
          <>
            {/* Header */}
            <div className="relative z-10 text-center mb-10">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-brand" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Forgot Password?</h2>
              <p className="text-neutral-500">No worries! Enter your email and we'll send you a reset link.</p>
            </div>

            {/* Form */}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="relative z-10 text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Check Your Email!</h2>
            <p className="text-neutral-500 mb-2">
              We've sent a password reset link to:
            </p>
            <p className="text-brand font-bold mb-8">{email}</p>
            <p className="text-sm text-neutral-400 mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setSent(false)}
                className="w-full py-3 border-2 border-neutral-200 text-neutral-700 rounded-2xl font-bold hover:bg-neutral-50 transition-all"
              >
                Try Another Email
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
