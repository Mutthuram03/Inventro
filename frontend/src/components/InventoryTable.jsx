import React from 'react';
import { Edit2, Trash2, Package, QrCode } from 'lucide-react';

const InventoryTable = ({ products, onEdit, onDelete, onViewQR }) => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Value</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Package size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{product.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">{product.barcode}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-black ${product.quantity < 10 ? 'text-danger' : 'text-slate-700'}`}>
                    {product.quantity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">₹{product.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-black text-primary">₹{(product.quantity * product.price).toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onViewQR(product)} 
                      className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                      title="View QR Code"
                    >
                      <QrCode size={16} />
                    </button>
                    <button 
                      onClick={() => onEdit(product)} 
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="Edit Product"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(product.id)} 
                      className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;

