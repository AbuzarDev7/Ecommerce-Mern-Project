import { create } from 'zustand';
import api from '../api';

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
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token, loading: false });
      return data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
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
}));

export default useAuthStore;
