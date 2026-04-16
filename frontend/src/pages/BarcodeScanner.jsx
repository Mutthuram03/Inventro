import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Barcode, QrCode, ArrowRight, CheckCircle2, XCircle, Loader2, Package, Camera, Keyboard } from 'lucide-react';
import QRScannerCamera from '../components/QRScannerCamera';
import { decodeProductQR } from '../utils/qr';

const MovementSelector = ({ action, setAction }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 ml-1">Movement Type</label>
    <div className="flex p-1 bg-slate-100 rounded-xl">
      {['IN', 'OUT'].map((btnAction) => (
        <button
          key={btnAction}
          type="button"
          onClick={() => setAction(btnAction)}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            action === btnAction 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {btnAction === 'IN' ? 'Stock In' : 'Stock Out'}
        </button>
      ))}
    </div>
  </div>
);

const QuantityInput = ({ quantity, setQuantity }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 ml-1">Quantity</label>
    <input
      type="number"
      min="1"
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
      className="block w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none transition-all font-bold"
    />
  </div>
);

const BarcodeScanner = ({ products, onScan }) => {
  const [barcode, setBarcode] = useState('');
  const [action, setAction] = useState('OUT');
  const [quantity, setQuantity] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '', product: {} }
  const [scanMode, setScanMode] = useState('CAMERA'); // 'CAMERA' | 'MANUAL'
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (scanMode === 'MANUAL') {
      inputRef.current?.focus();
    }
  }, [status, scanMode]);

  const processScan = useCallback(async (code) => {
    if (!code) return;

    setIsScanning(true);
    setStatus(null);

    // Attempt to decode as JSON QR first
    const decoded = decodeProductQR(code);
    const finalCode = decoded ? decoded.id : code;

    try {
      const response = await onScan({ barcode: finalCode, action, quantity: parseInt(quantity, 10) });
      setStatus({
        type: 'success',
        message: `${action === 'IN' ? 'Added' : 'Removed'} ${quantity} unit(s) of ${response.product.name}`,
        product: response.product
      });
      setBarcode('');
    } catch (error) {
      console.error(error);
      const isInvalidQR = code.startsWith('{') && !decoded;
      setStatus({
        type: 'error',
        message: isInvalidQR ? 'Invalid QR code' : (error.response?.data?.message || 'Product not found.')
      });
    } finally {
      setIsScanning(false);
    }
  }, [action, quantity, onScan]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    processScan(barcode);
  }, [barcode, processScan]);

  const handleCameraScan = useCallback((decodedText) => {
    if (isScanning) return;
    processScan(decodedText);
  }, [isScanning, processScan]);

  const isQR = barcode.length > 20 || barcode.startsWith('http');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Scanning Terminal</h1>
        <p className="text-slate-500">Fast inventory movement via barcode or QR code.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <section className="glass-card p-8 space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-2">
            <button
              onClick={() => setScanMode('CAMERA')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
                scanMode === 'CAMERA' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Camera size={18} />
              Camera
            </button>
            <button
              onClick={() => setScanMode('MANUAL')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
                scanMode === 'MANUAL' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Keyboard size={18} />
              Manual
            </button>
          </div>

          {scanMode === 'MANUAL' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Manual Entry</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    {isQR ? <QrCode size={20} /> : <Barcode size={20} />}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Scan or type code..."
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-mono text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MovementSelector action={action} setAction={setAction} />
                <QuantityInput quantity={quantity} setQuantity={setQuantity} />
              </div>

              <button
                type="submit"
                disabled={isScanning || !barcode}
                className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 group"
              >
                {isScanning ? <Loader2 className="animate-spin" size={24} /> : <>Process Scan <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <QRScannerCamera onScanSuccess={handleCameraScan} />
              <div className="grid grid-cols-2 gap-4">
                <MovementSelector action={action} setAction={setAction} />
                <QuantityInput quantity={quantity} setQuantity={setQuantity} />
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                <p className="text-sm text-primary font-medium">Position the QR code within the frame to scan.</p>
              </div>
            </div>
          )}
        </section>

        {/* Feedback Area */}
        <section className="h-full min-h-[300px]">
          <AnimatePresence mode="wait">
            {!status && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center"
              >
                <div className="p-6 bg-slate-50 rounded-full mb-4">
                  <Barcode size={48} className="opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-slate-600">Waiting for Input</h3>
                <p className="text-sm mt-2">The scanned result will appear here instantly.</p>
              </motion.div>
            )}

            {status && (
              <motion.div
                key="status"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`glass-card p-8 h-full flex flex-col border-l-8 ${
                  status.type === 'success' ? 'border-l-success' : 'border-l-danger'
                }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  {status.type === 'success' ? (
                    <div className="p-3 bg-success/10 text-success rounded-2xl">
                      <CheckCircle2 size={32} />
                    </div>
                  ) : (
                    <div className="p-3 bg-danger/10 text-danger rounded-2xl">
                      <XCircle size={32} />
                    </div>
                  )}
                  <div>
                    <h3 className={`text-xl font-bold ${status.type === 'success' ? 'text-slate-900' : 'text-danger'}`}>
                      {status.type === 'success' ? 'Scan successful' : 'Scan failed'}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">{status.message}</p>
                  </div>
                </div>

                {status.product && (
                  <div className="mt-auto bg-slate-50 rounded-3xl p-6 border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white shadow-sm rounded-xl">
                        <Package size={24} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{status.product.name}</h4>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{status.product.barcode}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Stock Level</p>
                        <p className="text-xl font-black text-slate-900">{status.product.quantity}</p>
                      </div>
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Category</p>
                        <p className="text-sm font-bold text-primary truncate">{status.product.category}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStatus(null)}
                  className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default BarcodeScanner;

