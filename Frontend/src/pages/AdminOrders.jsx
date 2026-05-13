import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (id) => {
    const result = await Swal.fire({
      title: 'Deliver Order',
      text: 'Are you sure you want to mark this order as delivered?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, deliver it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/orders/${id}/deliver`);
        Swal.fire({
          title: 'Delivered!',
          text: 'The order has been marked as delivered.',
          icon: 'success'
        });
        fetchOrders();
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update order status',
          icon: 'error'
        });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">Admin Orders</h1>
          <p className="text-neutral-500 mt-2">Manage customer orders and deliveries</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="glass rounded-3xl overflow-hidden border border-neutral-200">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-neutral-500">{order._id}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-800">{order.user?.name || 'Unknown User'}</td>
                  <td className="px-6 py-4 text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-brand">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {order.isDelivered ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" /> Delivered
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> Processing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!order.isDelivered && (
                      <button 
                        onClick={() => handleDeliver(order._id)}
                        className="px-4 py-2 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors shadow-md shadow-brand/20"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-800">No orders found</h3>
          <p className="text-neutral-500">There are no orders placed yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
