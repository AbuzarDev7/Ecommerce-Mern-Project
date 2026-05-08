import { create } from 'zustand';
import api from '../api';

const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  loading: false,

  fetchCart: async () => {
    try {
      const { data } = await api.get('/cart');
      const formattedCart = data.cartItems.map(item => ({
        ...item.product,
        quantity: item.qty
      }));
      set({ cart: formattedCart });
      localStorage.setItem('cart', JSON.stringify(formattedCart));
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  },

  syncCart: async (newCart) => {
    try {
      const cartItems = newCart.map(item => ({
        product: item._id,
        qty: item.quantity
      }));
      await api.post('/cart', { cartItems });
    } catch (err) {
      console.error('Failed to sync cart', err);
    }
  },
  
  addToCart: (product, quantity = 1) => {
    const cart = get().cart;
    const existingItem = cart.find((item) => item._id === product._id);
    
    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }
    
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
    get().syncCart(newCart);
  },

  removeFromCart: (productId) => {
    const newCart = get().cart.filter((item) => item._id !== productId);
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
    get().syncCart(newCart);
  },

  updateQuantity: (productId, quantity) => {
    const newCart = get().cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
    get().syncCart(newCart);
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem('cart');
    get().syncCart([]);
  },

  getTotal: () => {
    return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },
}));

export default useCartStore;
