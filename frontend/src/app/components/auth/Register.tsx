import { motion } from 'motion/react';
import { Mail, Lock, User, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    // Validate terms accepted
    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate username length
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register(formData.username, formData.email, formData.password);
      
      if (result.success) {
        toast.success('Account created successfully! Welcome to PokeBox.');
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
            Create Account
          </h1>
          <p className="text-gray-400">Join thousands of players today</p>
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
              <label className="block text-white mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-[var(--dark-hover)] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                  placeholder="Choose a username"
                  minLength={3}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">At least 3 characters</p>
            </div>
            
            <div>
              <label className="block text-white mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--dark-hover)] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                  placeholder="Enter your email"
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
                  placeholder="Create a password"
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>
            
            <div>
              <label className="block text-white mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-[var(--dark-hover)] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                  placeholder="Confirm your password"
                  minLength={6}
                  required
                />
              </div>
              {formData.password && formData.confirmPassword && (
                <div className="mt-1 flex items-center gap-1">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <p className="text-xs text-green-400">Passwords match</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <p className="text-xs text-red-400">Passwords do not match</p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-start gap-3 text-gray-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded mt-1"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  required
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-[var(--neon-blue)] hover:text-[var(--neon-yellow)] transition-colors">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[var(--neon-blue)] hover:text-[var(--neon-yellow)] transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
            
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--neon-blue)] hover:text-[var(--neon-yellow)] transition-colors">
              Login here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}