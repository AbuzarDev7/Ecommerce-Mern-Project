import React, { useState } from 'react';
import { CheckCircle, CreditCard, ShieldCheck, ArrowLeft, ArrowRight, Printer, ShoppingBag, Download } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!shippingAddress.address || !shippingAddress.city) {
      toast.error('Please fill in shipping details');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate fake payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        orderItems: cart.map(item => ({
          title: item.title,
          qty: item.quantity,
          image: item.imageUrl,
          price: item.price,
          product: item._id
        })),
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: 'Pakistan' // Default or add field
        },
        paymentMethod: 'Credit Card (Simulated)',
        totalPrice: getTotal()
      };

      const { data } = await api.post('/orders', orderData);
      
      setOrderId(data._id);
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success('Payment Successful!');
    } catch (err) {
      toast.error('Order creation failed');
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-neutral-100 print:shadow-none print:border-none">
          {/* Success Header - Hidden on print */}
          <div className="bg-green-500 p-12 text-center text-white print:hidden">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Thank You!</h1>
            <p className="text-green-100">Your order has been placed successfully.</p>
          </div>

          {/* Receipt Content */}
          <div className="p-8 md:p-16">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-1">LUXE</h2>
                <p className="text-neutral-500">Premium E-commerce</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Order Receipt</p>
                <p className="text-xl font-bold text-neutral-900">{orderId}</p>
                <p className="text-neutral-500 text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-y border-neutral-100 py-8 mb-8">
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Items Purchased</h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-neutral-800">{item.title}</p>
                      <p className="text-sm text-neutral-500">Quantity: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-bold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-right mb-12">
              <div className="flex justify-end gap-12 text-neutral-500">
                <span>Subtotal</span>
                <span className="text-neutral-900 font-semibold">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-end gap-12 text-neutral-500">
                <span>Shipping</span>
                <span className="text-neutral-900 font-semibold">$0.00</span>
              </div>
              <div className="flex justify-end gap-12 pt-4 border-t border-neutral-100">
                <span className="text-xl font-bold text-neutral-900">Total Paid</span>
                <span className="text-3xl font-bold text-brand">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 text-center text-neutral-500 text-sm mb-12 print:hidden">
              <p>A confirmation email has been sent to your registered address.</p>
            </div>

            {/* Action Buttons - Hidden on print */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button 
                onClick={handlePrint}
                className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
              >
                <Printer className="w-5 h-5" />
                Print Receipt
              </button>
              <button 
                onClick={() => { clearCart(); navigate('/'); }}
                className="flex-1 py-4 border-2 border-neutral-200 text-neutral-800 rounded-2xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-neutral-500 hover:text-brand transition-colors mb-8 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Cart
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-8">Secure Checkout</h1>
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-brand" />
                Shipping Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="firstName"
                  value={shippingAddress.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name" 
                  className="p-4 bg-neutral-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" 
                />
                <input 
                  type="text" 
                  name="lastName"
                  value={shippingAddress.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name" 
                  className="p-4 bg-neutral-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" 
                />
                <input 
                  type="text" 
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  placeholder="Address" 
                  className="col-span-2 p-4 bg-neutral-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" 
                />
                <input 
                  type="text" 
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="City" 
                  className="p-4 bg-neutral-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" 
                />
                <input 
                  type="text" 
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code" 
                  className="p-4 bg-neutral-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand" 
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand" />
                Payment Method (Simulation)
              </h2>
              <div className="glass p-6 rounded-3xl border-2 border-brand/20">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] text-white font-bold italic">VISA</div>
                    <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-[10px] text-white font-bold italic">MC</div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-neutral-300" />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-neutral-100 rounded-xl text-neutral-400 font-mono tracking-widest">
                    4242 •••• •••• 4242
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-neutral-500">
                    <p>Exp: 12 / 2026</p>
                    <p className="text-right">CVC: •••</p>
                  </div>
                </div>
              </div>
            </section>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-5 bg-neutral-900 text-white rounded-[2rem] font-bold text-xl hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-6 h-6" />
                  Pay ${getTotal().toFixed(2)} Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order Preview */}
        <div className="hidden lg:block">
          <div className="glass rounded-[3rem] p-10 sticky top-24 border border-neutral-100">
            <h3 className="text-2xl font-bold text-neutral-900 mb-8">Order Summary</h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                  <div className="flex-grow">
                    <p className="font-bold text-neutral-800">{item.title}</p>
                    <p className="text-sm text-neutral-500">{item.quantity} × ${item.price}</p>
                  </div>
                  <p className="font-bold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-neutral-100 space-y-4">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="text-neutral-900 font-bold">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="text-green-500 font-bold italic">FREE</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-neutral-100">
                <span className="text-2xl font-bold text-neutral-900">Total</span>
                <span className="text-3xl font-bold text-brand">${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
