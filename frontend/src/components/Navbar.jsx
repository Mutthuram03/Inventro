import { NavLink, useNavigate } from 'react-router-dom';
import { Package, LayoutDashboard, Barcode, History, FolderTree, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const activeClassName = "bg-primary text-white shadow-md shadow-primary/20";
  const inactiveClassName = "text-slate-600 hover:bg-slate-50 hover:text-primary";

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/scan", icon: Barcode, label: "Scan" },
    { to: "/history", icon: History, label: "History" },
    { to: "/categories", icon: FolderTree, label: "Categories" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="sticky-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tight text-slate-950">
              Scan<span className="text-primary font-extrabold">ventory</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? activeClassName : inactiveClassName
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}

            <div className="w-px h-6 bg-slate-200 mx-2" />

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? activeClassName : inactiveClassName
                }`
              }
            >
              <div className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold">
                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
              <span>Profile</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
