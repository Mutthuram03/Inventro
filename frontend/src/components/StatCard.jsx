import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, colorClass, loading, warning }) => {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={`glass-card glass-card-hover p-5 border-l-4 ${warning ? 'border-l-danger bg-red-50/30' : colorClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900 leading-none">
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded" />
              ) : (
                value
              )}
            </h3>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${warning ? 'bg-danger text-white' : 'bg-slate-50 text-slate-500 hover:bg-primary hover:text-white'} transition-colors duration-300`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.article>
  );
};

export default StatCard;
