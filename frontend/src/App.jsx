import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import BarcodeScanner from './pages/BarcodeScanner';
import LogsHistory from './pages/LogsHistory';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import { AuthProvider, useAuth } from './context/AuthContext';
export * as api from './services/api'; 

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell>{children}</AppShell>;
};

// 1. Move internal logic to a stable child component
const InventroInternal = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  
  const { user, loading: authLoading } = useAuth();

  const fetchData = async () => {
    try {
      const [p, l] = await Promise.all([api.getProducts(), api.getLogs()]);
      setProducts(p || []);
      setLogs(l || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchData();
      } else {
        setAppLoading(false);
      }
    }
  }, [user, authLoading]);

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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        
        {/* App Routes (Protected) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard 
                products={products} 
                logs={logs} 
                loading={appLoading} 
                productById={productById} 
                refreshData={fetchData}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductManagement 
                products={products} 
                onProductChange={handleProductChange} 
                productById={productById} 
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/scan" 
          element={
            <ProtectedRoute>
              <BarcodeScanner products={products} onScan={handleScan} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <LogsHistory logs={logs} productById={productById} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <Categories products={products} loading={appLoading} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// 2. Main App component only provides the context
function App() {
  return (
    <AuthProvider>
      <InventroInternal />
    </AuthProvider>
  );
}

export default App;
