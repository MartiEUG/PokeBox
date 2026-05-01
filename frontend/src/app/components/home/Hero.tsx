import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--neon-blue)] opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--neon-yellow)] opacity-10 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6 bg-gradient-to-r from-[var(--neon-yellow)] via-[var(--neon-blue)] to-[var(--electric-purple)] bg-clip-text text-transparent">
              Unlock Epic Rewards
            </h1>
            <p className="mb-8 text-gray-300 max-w-2xl mx-auto">
              Open mystery cases, battle other players, and collect rare items. Experience the thrill of unboxing with provably fair odds.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Button variant="primary" size="lg" onClick={() => navigate('/cases')}>
              <Sparkles className="w-5 h-5" />
              Open Cases Now
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/battles')}>
              <TrendingUp className="w-5 h-5" />
              Join Battle
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="bg-[var(--dark-card)] border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-[var(--neon-yellow)] mb-2">1M+</div>
              <div className="text-gray-400">Cases Opened</div>
            </div>
            <div className="bg-[var(--dark-card)] border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-[var(--neon-blue)] mb-2">50K+</div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div className="bg-[var(--dark-card)] border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-[var(--electric-purple)] mb-2">$2M+</div>
              <div className="text-gray-400">Items Won</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
