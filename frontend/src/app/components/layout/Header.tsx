import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, ShoppingBag, Sword, Trophy, HeadphonesIcon, User, LogOut, Wallet, Package, ArrowLeftRight, Truck, ArrowUp } from 'lucide-react';
import { Button } from '../ui/Button';
import logo from 'figma:asset/6e863f4494a0b578dad3289d366d63fdcde5ae2f.png';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
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
  
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };
  
  return (
    <header className="sticky top-0 z-50 bg-[var(--dark-card)] border-b border-gray-800 backdrop-blur-lg bg-opacity-90">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={logo} 
                alt="PokeBox Logo" 
                className="h-12 w-auto"
              />
            </motion.div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] text-black'
                        : 'text-gray-300 hover:text-white hover:bg-[var(--dark-hover)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
          
          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Balance Display */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--dark-hover)] border border-gray-700 rounded-lg">
                  <Wallet className="w-4 h-4 text-[var(--neon-yellow)]" />
                  <span className="text-white font-medium">${user.balance.toLocaleString()}</span>
                </div>
                
                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] text-black rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.username}</span>
                    <span className="text-xs bg-black/20 px-2 py-0.5 rounded">Lv.{user.level}</span>
                  </motion.button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-[var(--dark-card)] border border-gray-700 rounded-lg shadow-xl overflow-hidden"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 text-white hover:bg-[var(--dark-hover)] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      <Link
                        to="/inventory"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 text-white hover:bg-[var(--dark-hover)] transition-colors border-t border-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>Inventory</span>
                        </div>
                      </Link>
                      <Link
                        to="/trade"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 text-white hover:bg-[var(--dark-hover)] transition-colors border-t border-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowLeftRight className="w-4 h-4" />
                          <span>Intercambio</span>
                        </div>
                      </Link>
                      <Link
                        to="/delivery"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 text-white hover:bg-[var(--dark-hover)] transition-colors border-t border-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <span>Envío a Domicilio</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-400 hover:bg-[var(--dark-hover)] transition-colors border-t border-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}