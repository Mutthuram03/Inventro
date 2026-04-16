import { NavLink } from 'react-router-dom';
import { Package, LayoutDashboard, Barcode, History, FolderTree } from 'lucide-react';

const Navbar = () => {
  const activeClassName = "bg-primary text-white shadow-md shadow-primary/20";
  const inactiveClassName = "text-slate-600 hover:bg-slate-50 hover:text-primary";

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/scan", icon: Barcode, label: "Scan" },
    { to: "/history", icon: History, label: "History" },
    { to: "/categories", icon: FolderTree, label: "Categories" },
  ];

  return (
    <nav className="sticky-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-primary rounded-xl text-white transition-transform group-hover:scale-110">
              <Package size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950">
              Scan<span className="text-primary font-extrabold">ventory</span>
            </span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive ? activeClassName : inactiveClassName
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
