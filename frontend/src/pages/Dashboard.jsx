import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Package, Smartphone, AlertTriangle, IndianRupee, ArrowUpRight, ArrowDownLeft, Clock, Search } from 'lucide-react';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';

const ACTION_OPTIONS = ['ALL', 'IN', 'OUT'];
const PERIOD_OPTIONS = ['week', 'month'];

const formatShortDate = (date) =>
  date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

const buildRecentDaysSeries = (logs, days) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const byKey = new Map();
  for (let index = 0; index < days; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = date.toISOString().slice(0, 10);

    byKey.set(key, {
      key,
      date,
      label: formatShortDate(date),
      count: 0
    });
  }

  logs.forEach((log) => {
    const logDate = new Date(log.timestamp);
    logDate.setHours(0, 0, 0, 0);
    const key = logDate.toISOString().slice(0, 10);

    const bucket = byKey.get(key);
    if (bucket) bucket.count += 1;
  });

  return Array.from(byKey.values());
};

const Dashboard = ({ products = [], logs = [], loading = false, productById = new Map(), userRole = 'Admin' }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const scanFilter = ACTION_OPTIONS.includes(searchParams.get('scanFilter')) ? searchParams.get('scanFilter') : 'ALL';
  const period = PERIOD_OPTIONS.includes(searchParams.get('period')) ? searchParams.get('period') : 'week';
  const dayRange = period === 'month' ? 30 : 7;

  const updateQueryParam = (key, value) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true }
    );
  };

  const filteredLogs = useMemo(() => {
    if (scanFilter === 'ALL') return logs;
    return logs.filter((log) => log.action === scanFilter);
  }, [logs, scanFilter]);

  const activitySeries = useMemo(() => buildRecentDaysSeries(filteredLogs, dayRange), [filteredLogs, dayRange]);

  const recentScans = useMemo(() => {
    return filteredLogs.slice(0, 8).map((log) => {
      const product = productById.get(log.productId);
      return {
        ...log,
        productName: product?.name || 'Unknown product',
        barcode: product?.barcode || 'N/A'
      };
    });
  }, [filteredLogs, productById]);

  const topProducts = useMemo(() => {
    return [...products].sort((a, b) => Number(b.quantity) - Number(a.quantity)).slice(0, 5);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products
      .filter((product) => Number(product.quantity) < 10)
      .sort((a, b) => Number(a.quantity) - Number(b.quantity))
      .slice(0, 5);
  }, [products]);

  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, product) => sum + Number(product.quantity || 0), 0);
  const lowStockCount = products.filter(p => p.quantity < 10).length;
  const averagePrice = (products.length ? products.reduce((sum, product) => sum + Number(product.price || 0), 0) / products.length : 0);

  if (userRole !== 'Admin') {
    return (
      <section className="glass-card p-10 text-center">
        <AlertTriangle size={48} className="mx-auto text-danger mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
        <p className="mt-2 text-slate-500">Dashboard metrics are available for admin role only.</p>
      </section>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventory Overview</h1>
          <p className="text-slate-500 mt-1">Monitor your stock levels and scanning activity in real-time.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-semibold">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Live System Active
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Products" 
          value={totalProducts} 
          icon={Package} 
          colorClass="border-l-primary" 
          loading={loading} 
        />
        <StatCard 
          title="Total Units" 
          value={totalUnits} 
          icon={Smartphone} 
          colorClass="border-l-indigo-500" 
          loading={loading} 
        />
        <StatCard 
          title="Low Stock" 
          value={lowStockCount} 
          icon={AlertTriangle} 
          colorClass="border-l-danger" 
          loading={loading} 
          warning={lowStockCount > 0}
        />
        <StatCard 
          title="Avg. Price" 
          value={`₹${averagePrice.toFixed(2)}`} 
          icon={IndianRupee} 
          colorClass="border-l-emerald-500" 
          loading={loading} 
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Activity Chart */}
        <section className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Scanning Activity</h2>
              <p className="text-sm text-slate-500">Inventory movement over time</p>
            </div>
            <select
              value={period}
              onChange={(e) => updateQueryParam('period', e.target.value)}
              className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activitySeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  width={40}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#2563eb" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="glass-card flex flex-col">
          <div className="p-6 border-b border-slate-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Recent Scans</h2>
              <Clock size={18} className="text-slate-400" />
            </div>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              {ACTION_OPTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => updateQueryParam('scanFilter', item)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                    scanFilter === item 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {recentScans.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <Search size={32} className="mb-2 opacity-20" />
                <p className="text-sm italic">No scans recorded yet</p>
              </div>
            ) : (
              recentScans.map((scan) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={scan.id} 
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${scan.action === 'IN' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {scan.action === 'IN' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-none">{scan.productName}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{scan.barcode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-black ${scan.action === 'IN' ? 'text-success' : 'text-danger'}`}>
                      {scan.action === 'IN' ? '+' : '-'}{scan.quantity}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Products */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">High Stock Items</h2>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary font-bold">
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">{product.quantity}</div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Units In Stock</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Low Stock Urgent */}
        <section className="glass-card p-6 bg-danger/[0.02]">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Urgent Replenishment
            {lowStockProducts.length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-danger animate-ping" />
            )}
          </h2>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-center py-10 text-slate-400">All stock levels healthy!</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-danger/10 shadow-sm shadow-danger/5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
                    <p className="text-xs text-slate-500">ID: {product.barcode}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-danger text-white text-xs font-black rounded-lg">
                      {product.quantity} Left
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Dashboard;

