import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Upload, X, Loader2 } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import api from '../api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const { products, fetchMyProducts, loading: storeLoading } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    stock: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product created successfully!');
      setShowModal(false);
      resetForm();
      fetchMyProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', price: '', description: '', category: '', stock: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchMyProducts();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">Admin Inventory</h1>
          <p className="text-neutral-500 mt-2">Manage your luxury collection</p>
        </div>
        <button 
          onClick={() => { 
            resetForm(); 
            setShowModal(true); 
          }}
          className="px-6 py-3 bg-brand text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden border border-neutral-200">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-sm font-bold text-neutral-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={product.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <span className="font-semibold text-neutral-800">{product.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-500">{product.category}</td>
                <td className="px-6 py-4 font-bold text-brand">${product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-neutral-400 hover:text-brand transition-colors"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">Create New Product</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-neutral-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Area */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-3xl p-8 bg-neutral-50 hover:border-brand/50 transition-colors relative group">
                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                    <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-brand" />
                    </div>
                    <p className="text-neutral-900 font-bold">Upload Product Image</p>
                    <p className="text-neutral-500 text-sm mt-1">PNG, JPG up to 10MB</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                  </label>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Product Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none" 
                    placeholder="e.g. Minimalist Watch"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none" 
                    placeholder="e.g. Accessories"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Price ($)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none" 
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none resize-none" 
                  placeholder="Describe the product details..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-neutral-100 text-neutral-700 rounded-2xl font-bold hover:bg-neutral-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
