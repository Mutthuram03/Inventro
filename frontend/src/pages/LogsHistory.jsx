import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Package, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LogsHistory = ({ logs, productById }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Activity History</h1>
        <p className="text-slate-500 mt-1">Detailed log of all inventory movements and scans.</p>
      </header>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const product = productById.get(log.productId);
                  const isIncoming = log.action === 'IN';
                  
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Package size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{product?.name || 'Unknown Product'}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-mono">{product?.barcode || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          isIncoming ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                        }`}>
                          {isIncoming ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                          {log.action}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-black ${isIncoming ? 'text-success' : 'text-danger'}`}>
                          {isIncoming ? '+' : '-'}{log.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={14} className="text-slate-300" />
                          <span className="text-xs font-medium">
                            {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default LogsHistory;

