import React, { useMemo } from 'react';
import { FolderTree, Package, Layers, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Categories = ({ products, loading }) => {
  const categories = useMemo(() => {
    if (loading) return [];
    const categoryMap = products.reduce((acc, product) => {
      const { category, quantity } = product;
      if (!acc[category]) {
        acc[category] = { name: category, count: 0, quantity: 0 };
      }
      acc[category].count++;
      acc[category].quantity += quantity;
      return acc;
    }, {});
    return Object.values(categoryMap).sort((a, b) => b.count - a.count);
  }, [products, loading]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Categories</h1>
        <p className="text-slate-500 mt-1">Organize and view your stock by product grouping.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <div className="col-span-full glass-card p-20 text-center">
            <Layers size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No Categories Found</h3>
            <p className="text-slate-500">Start by adding products to automatically see categories here.</p>
          </div>
        ) : (
          categories.map((category) => (
            <motion.div 
              key={category.name} 
              whileHover={{ y: -4 }}
              className="glass-card glass-card-hover p-6 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <FolderTree size={24} />
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1">{category.name}</h3>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <Package size={14} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">{category.count} <span className="font-medium text-slate-400">Products</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers size={14} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">{category.quantity} <span className="font-medium text-slate-400">Units</span></span>
                </div>
              </div>

              {/* Progress bar style decoration */}
              <div className="mt-6 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-primary/20 group-hover:bg-primary/40 transition-colors"
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Categories;

