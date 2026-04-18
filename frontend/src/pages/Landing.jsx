import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ArrowRight, 
  QrCode, 
  Barcode, 
  Activity, 
  Bell, 
  CheckCircle2,
  ChevronRight,
  Globe,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "QR Code Generation",
      description: "Instantly create unique QR codes for every product in your inventory with one click.",
      icon: QrCode,
      color: "blue"
    },
    {
      title: "Barcode Scanning",
      description: "Lightning-fast barcode scanning using your device camera. No expensive hardware needed.",
      icon: Barcode,
      color: "indigo"
    },
    {
      title: "Real-time Tracking",
      description: "Monitor stock levels, movements, and logs in real-time with automated updates.",
      icon: Activity,
      color: "emerald"
    },
    {
      title: "Low Stock Alerts",
      description: "Get smart notifications when products are running low to prevent stockouts.",
      icon: Bell,
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/10 selection:text-primary">
      {/* Landing Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Scanventory Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold tracking-tight text-slate-950">
                Scan<span className="text-primary font-extrabold">ventory</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} 
                className="hover:text-primary transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => navigate('/contact')} 
                className="hover:text-primary transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-bold text-slate-700 hover:text-primary transition-colors px-4 py-2"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Modern Inventory Control
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight leading-[1.1] mb-8">
                Smart Inventory Management <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                  with QR & Barcode
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed mb-12">
                Effortlessly track stock, generate product codes, and manage your warehouse with our all-in-one scanning solution. Built for speed and accuracy.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white text-lg font-bold px-10 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 group"
                >
                  Start Scanning Now
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a 
                  href="#features"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 text-lg font-bold px-10 py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale">
                <div className="flex items-center gap-2"><CheckCircle2 size={20} /> Real-time Sync</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={20} /> Cloud Storage</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={20} /> Secure Auth</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={20} /> API Ready</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-base font-bold text-primary uppercase tracking-widest mb-4">Features</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Everything you need to <br className="hidden md:block" /> scale your operations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className={`p-4 rounded-2xl bg-white shadow-sm text-primary mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-950">Ready to optimize your warehouse?</h2>
            <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
              Join hundreds of industries that trust Scanventory for their day-to-day stock management operations.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-primary text-white text-lg font-bold px-12 py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/25"
            >
              Get Started for Free
            </button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center text-center md:text-left">
              <div>
                <span className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4 block">Our Story</span>
                <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                  Empowering businesses through smart scanning.
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  Scanventory was born from a simple need: making inventory tracking as easy as taking a photo. We've built a platform that eliminates manual entry errors and provides real-time visibility into your warehouse operations.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                   <div className="text-center group">
                      <div className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">99.9%</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Accuracy</div>
                   </div>
                   <div className="w-px h-10 bg-slate-200" />
                   <div className="text-center group">
                      <div className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">24/7</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Support</div>
                   </div>
                </div>
              </div>
              <div className="relative group flex items-center justify-center">
                 <div className="absolute -inset-10 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                 <img src="/logo.png" alt="Scanventory Vision" className="w-64 h-64 object-contain relative z-10 hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="Scanventory Logo" className="w-10 h-10 object-contain brightness-0 invert" />
                <span className="text-2xl font-bold tracking-tight text-white leading-none">
                  Scan<span className="text-primary font-extrabold">ventory</span>
                </span>
              </div>
              <p className="max-w-sm mb-8">
                The modern standard for real-time inventory management. Powered by intelligent scanning and cloud-first technology.
              </p>
              <div className="flex gap-4">
                <div className="p-2 border border-slate-800 rounded-lg hover:text-white cursor-pointer transition-colors">
                  <MessageSquare size={20} />
                </div>
                <div className="p-2 border border-slate-800 rounded-lg hover:text-white cursor-pointer transition-colors">
                  <ExternalLink size={20} />
                </div>
                <div className="p-2 border border-slate-800 rounded-lg hover:text-white cursor-pointer transition-colors">
                  <Globe size={20} />
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-6">Product</h5>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Scanning App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Company</h5>
              <ul className="space-y-4">
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">About</button></li>
                <li>
                  <button 
                    onClick={() => navigate('/contact')} 
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Scanventory. All rights reserved.</p>
            <p>Built with ❤️ for modern warehouses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
