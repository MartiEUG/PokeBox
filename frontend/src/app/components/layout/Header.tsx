import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, ShoppingBag, Sword, Trophy, HeadphonesIcon, User, LogOut, Wallet, Package, ArrowLeftRight, Truck, ArrowUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  const navItems = [
    { path: '/', label: 'Home', icon: Zap },
    { path: '/cases', label: 'Cases', icon: ShoppingBag },
    { path: '/trade', label: 'Intercambio', icon: ArrowLeftRight },
    { path: '/delivery', label: 'Envío', icon: Truck },
    { path: '/battles', label: 'Battles', icon: Sword },
    { path: '/rewards', label: 'Rewards', icon: Trophy },
    { path: '/upgrade', label: 'Upgrade', icon: ArrowUp },
    { path: '/support', label: 'Support', icon: HeadphonesIcon },
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-[var(--dark-card)] border-b border-gray-800 backdrop-blur-lg bg-opacity-90">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center hover:scale-105 transition-transform">
              <span className="text-3xl">🎮</span>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">PokeBox</span>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                      isActive
                        ? 'bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] text-black'
                        : 'text-gray-300 hover:text-white hover:bg-[var(--dark-hover)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* User Section */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--dark-hover)] border border-gray-700 rounded-lg">
              <Wallet className="w-4 h-4 text-[var(--neon-yellow)]" />
              <span className="text-white font-medium">$1,000</span>
            </div>
            
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] text-black rounded-lg hover:opacity-90 transition-opacity"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.username || 'Player'}</span>
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded">Lv.{user?.level || 1}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--dark-card)] border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                  <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="block px-4 py-3 text-white hover:bg-[var(--dark-hover)] transition-colors">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <Link to="/inventory" onClick={() => setShowUserMenu(false)} className="block px-4 py-3 text-white hover:bg-[var(--dark-hover)] transition-colors border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Inventory</span>
                    </div>
                  </Link>
                  <Link to="/trade" onClick={() => setShowUserMenu(false)} className="block px-4 py-3 text-white hover:bg-[var(--dark-hover)] transition-colors border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="w-4 h-4" />
                      <span>Intercambio</span>
                    </div>
                  </Link>
                  <Link to="/delivery" onClick={() => setShowUserMenu(false)} className="block px-4 py-3 text-white hover:bg-[var(--dark-hover)] transition-colors border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Envío a Domicilio</span>
                    </div>
                  </Link>
                  <button 
                    onClick={async () => {
                      await logout();
                      setShowUserMenu(false);
                      navigate('/login');
                    }} 
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-[var(--dark-hover)] transition-colors border-t border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
