import { motion } from 'motion/react';
import { Mail, Lock, Zap, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated (using effect, not render)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Welcome back! Login successful.');
        // Navigate to dashboard on success
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--neon-yellow)] to-[var(--neon-blue)] rounded-lg flex items-center justify-center">
              <Zap className="w-7 h-7 text-black" />
            </div>
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400">Login to continue your adventure</p>
        </div>
        
        <div className="bg-[var(--dark-card)] border border-gray-800 rounded-xl p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--dark-hover)] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                  placeholder="Enter your email or username"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[var(--dark-hover)] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[var(--neon-blue)] hover:text-[var(--neon-yellow)] transition-colors">
                Forgot password?
              </Link>
            </div>
            
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--neon-blue)] hover:text-[var(--neon-yellow)] transition-colors">
              Register now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}