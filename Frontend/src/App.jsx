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
import Categories from './pages/Categories';
import AdminOrders from './pages/AdminOrders';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import useAuthStore from './store/useAuthStore';
import useCartStore from './store/useCartStore';
import Footer from './components/Footer';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <div className="p-20 text-center text-4xl font-bold text-red-500">Please Login to Access this Page</div>;
  }
  return children;
};

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user || user.role !== 'admin') {
    return <div className="p-20 text-center text-4xl font-bold text-red-500">Access Denied: Admins Only</div>;
  }
  return children;
};

// Placeholder components for other routes

function App() {
  const { getMe, user } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    getMe();
  }, [getMe]);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>

    </Router>
  );
}

export default App;
