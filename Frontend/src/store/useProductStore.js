import { create } from 'zustand';
import api from '../api';

const useProductStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, products: [] }); // Clear products before fetching
    try {
      const { data } = await api.get('/products');
      set({ products: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch products', loading: false });
    }
  },

  fetchMyProducts: async () => {
    set({ loading: true, products: [] }); // Clear products before fetching
    try {
      const { data } = await api.get('/products/my');
      set({ products: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch your products', loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ product: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch product', loading: false });
    }
  },
}));

export default useProductStore;
