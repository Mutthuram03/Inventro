import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import BarcodeScanner from './pages/BarcodeScanner';
import LogsHistory from './pages/LogsHistory';
import Categories from './pages/Categories';
import * as api from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [p, l] = await Promise.all([api.getProducts(), api.getLogs()]);
      setProducts(p || []);
      setLogs(l || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScan = async (scanData) => {
    const response = await api.scanBarcode(scanData);
    await fetchData(); 
    return response;
  };

  const handleProductChange = async () => {
    await fetchData();
  };

  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  return (
    <Router>
      <AppShell>
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                products={products} 
                logs={logs} 
                loading={loading} 
                productById={productById} 
              />
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProductManagement 
                products={products} 
                onProductChange={handleProductChange} 
                productById={productById} 
              />
            } 
          />
          <Route 
            path="/scan" 
            element={<BarcodeScanner products={products} onScan={handleScan} />} 
          />
          <Route 
            path="/history" 
            element={<LogsHistory logs={logs} productById={productById} />} 
          />
          <Route 
            path="/categories" 
            element={<Categories products={products} loading={loading} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
