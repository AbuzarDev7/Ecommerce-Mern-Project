import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  
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
  },

  removeFromCart: (productId) => {
    const newCart = get().cart.filter((item) => item._id !== productId);
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  updateQuantity: (productId, quantity) => {
    const newCart = get().cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem('cart');
  },

  getTotal: () => {
    return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },
}));

export default useCartStore;
