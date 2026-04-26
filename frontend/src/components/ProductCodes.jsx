import React from 'react';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

const ProductCodes = ({ products }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <motion.div 
          key={product.id} 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 flex flex-col items-center text-center gap-4"
        >
          <h3 className="font-bold text-lg text-slate-900">{product.name}</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full py-4 bg-slate-50 rounded-xl">
            {/* Barcode Section */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Barcode (Code 128)</span>
              <div className="bg-white p-2 rounded border border-slate-100">
                <Barcode 
                  value={product.barcode} 
                  width={1.5} 
                  height={50} 
                  fontSize={12}
                  margin={0}
                />
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">QR Code</span>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <QRCodeSVG 
                  value={product.barcode} 
                  size={80}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center pt-2 px-2">
            <span className="text-xs font-medium text-slate-500">SKU: {product.barcode}</span>
            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
              Stock: {product.quantity}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductCodes;
// Feature update: ProductCodes
