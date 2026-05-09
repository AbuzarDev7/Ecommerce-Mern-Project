import { create } from 'zustand';
import api from '../api';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', userData);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    set({ user: null, token: null });
    window.location.href = '/login';
  },

  getMe: async () => {
    if (!localStorage.getItem('token')) return;
    set({ loading: true });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, loading: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },
  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to send reset email', loading: false });
      throw err;
    }
  },
}));

export default useAuthStore;
