import React, { useState } from 'react';
import InventoryTable from '../components/InventoryTable';
import QRDisplayModal from '../components/QRDisplayModal';
import * as api from '../services/api';
import { Plus, X, Package, Tag, Hash, Boxes, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const ProductManagement = ({ products, onProductChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [qrProduct, setQrProduct] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleViewQR = (product) => {
    setQrProduct(product);
    setIsQRModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      onProductChange();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData.entries());
    productData.quantity = parseInt(productData.quantity, 10);
    productData.price = parseFloat(productData.price);

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productData);
    } else {
      // Provide a unique ID from frontend if backend allows
      productData.id = uuidv4();
      await api.createProduct(productData);
    }
    onProductChange();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 mt-1">Manage and organize your entire inventory list.</p>
        </div>
        <button 
          onClick={handleAddProduct} 
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <InventoryTable 
        products={products} 
        onEdit={handleEditProduct} 
        onDelete={handleDeleteProduct} 
        onViewQR={handleViewQR}
      />

      <QRDisplayModal 
        product={qrProduct} 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
      />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Package className="text-primary" size={24} />
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                      <Tag size={14} className="text-slate-400" />
                      Product Name
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={editingProduct?.name} 
                      className="block w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none transition-all" 
                      required 
                      placeholder="e.g. Wireless Mouse"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        <Package size={14} className="text-slate-400" />
                        Category
                      </label>
                      <input 
                        type="text" 
                        name="category" 
                        defaultValue={editingProduct?.category} 
                        className="block w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none transition-all" 
                        required 
                        placeholder="e.g. Electronics"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        <Hash size={14} className="text-slate-400" />
                        Barcode/SKU
                      </label>
                      <input 
                        type="text" 
                        name="barcode" 
                        defaultValue={editingProduct?.barcode} 
                        className="block w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none transition-all font-mono" 
                        required 
                        placeholder="e.g. SKU-12345"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        <Boxes size={14} className="text-slate-400" />
                        Initial Quantity
                      </label>
                      <input 
                        type="number" 
                        name="quantity" 
                        defaultValue={editingProduct?.quantity} 
                        className="block w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none transition-all" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                        <IndianRupee size={14} className="text-slate-400" />
                        Price (₹)
                      </label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="price" 
                        defaultValue={editingProduct?.price} 
                        className="block w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none transition-all" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 text-lg"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;

