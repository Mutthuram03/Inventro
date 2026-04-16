import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, AlertCircle } from 'lucide-react';

const QRScannerCamera = ({ onScanSuccess, onScanError }) => {
  const html5QrCodeRef = useRef(null);
  const [error, setError] = useState(null);
  
  // Use refs for callbacks to keep the effect stable
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanErrorRef = useRef(onScanError);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    onScanErrorRef.current = onScanError;
  }, [onScanSuccess, onScanError]);

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        const readerElement = document.getElementById("reader");
        if (!readerElement) return;

        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode("reader");
        }

        const config = { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };

        await html5QrCodeRef.current.start(
          { facingMode: "environment" }, 
          config, 
          (decodedText) => {
            if (isMounted && onScanSuccessRef.current) {
              onScanSuccessRef.current(decodedText);
            }
          },
          (errorMessage) => {
            if (onScanErrorRef.current && !errorMessage.includes("No MultiFormat Readers were able to decode the image")) {
              onScanErrorRef.current(errorMessage);
            }
          }
        );
      } catch (err) {
        console.error("Unable to start scanning", err);
        if (isMounted) setError(err.message || "Failed to start camera");
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        html5QrCodeRef.current = null;
        
        if (scanner.isScanning) {
          scanner.stop().then(() => {
            scanner.clear();
          }).catch(err => console.error("Error stopping scanner", err));
        }
      }
    };
  }, []); // Effect is now completely stable

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto overflow-hidden rounded-[2rem] border-4 border-slate-100 bg-slate-900 shadow-2xl group">
      <div id="reader" className="w-full h-full"></div>
      
      {error && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="text-danger mb-4" size={48} />
          <p className="text-white font-bold mb-2">Camera Error</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      )}

      {/* Overlay UI */}
      {!error && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <div className="w-64 h-64 border-2 border-primary/50 rounded-3xl animate-pulse flex items-center justify-center">
            <div className="w-full h-0.5 bg-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
        <Camera size={14} className="text-primary" />
        {error ? 'Scanner Offline' : 'Live Scanner Active'}
      </div>
      
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-120px); opacity: 0; }
          50% { transform: translateY(120px); opacity: 1; }
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        #reader__scan_region {
            background: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default QRScannerCamera;
