import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Package, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { encodeProductQR } from '../utils/qr';

const QRDisplayModal = ({ product, isOpen, onClose }) => {
  const qrRef = useRef(null);

  const handleDownload = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 50, 50, 900, 900);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${product.barcode || product.id}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl text-white">
                  <QrCode size={20} />
                </div>
                <h3 className="font-bold text-slate-900 leading-tight">Product QR</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-10 flex flex-col items-center">
              <div ref={qrRef} className="p-6 bg-white rounded-3xl border-2 border-slate-100 shadow-inner mb-6">
                <QRCodeSVG 
                  value={encodeProductQR(product)} 
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="w-full space-y-2 text-center">
                <h4 className="text-lg font-bold text-slate-900">{product.name}</h4>
                <p className="text-xs text-slate-400 uppercase font-mono tracking-widest">{product.barcode || product.id}</p>
              </div>

              <button
                onClick={handleDownload}
                className="mt-10 w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 group"
              >
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                Download PNG
              </button>
              
              <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                Encoded as JSON Tracking ID
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRDisplayModal;
