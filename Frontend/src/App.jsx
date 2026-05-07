import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminProducts from './pages/AdminProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import useAuthStore from './store/useAuthStore';

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user || user.role !== 'admin') {
    return <div className="p-20 text-center text-4xl font-bold text-red-500">Access Denied: Admins Only</div>;
  }
  return children;
};

// Placeholder components for other routes
const Shop = () => <div className="p-20 text-center text-4xl font-bold text-neutral-800">Shop Page Coming Soon</div>;
const Profile = () => <div className="p-20 text-center text-4xl font-bold text-neutral-800">Profile Page Coming Soon</div>;

function App() {
  const { getMe } = useAuthStore();

  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-neutral-200 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center text-neutral-500">
            <p className="text-xl font-bold text-neutral-900 mb-4">LUXE</p>
            <p>© 2024 LUXE E-commerce. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
