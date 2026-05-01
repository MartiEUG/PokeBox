import { motion } from 'motion/react';
import { Shield, Zap, Trophy, TrendingUp, Users, Lock } from 'lucide-react';
import { Card } from '../ui/Card';

const features = [
  {
    icon: Shield,
    title: 'Provably Fair',
    description: 'All outcomes are verifiable and transparent. We use blockchain technology to ensure fairness.',
    color: 'blue'
  },
  {
    icon: Zap,
    title: 'Instant Opening',
    description: 'Experience lightning-fast case opening with smooth animations and instant rewards.',
    color: 'yellow'
  },
  {
    icon: Trophy,
    title: 'Epic Rewards',
    description: 'Win rare and valuable items from our extensive collection of prizes.',
    color: 'purple'
  },
  {
    icon: TrendingUp,
    title: 'Competitive Battles',
    description: 'Challenge other players in head-to-head case battles and prove your luck.',
    color: 'red'
  },
  {
    icon: Users,
    title: 'Active Community',
    description: 'Join thousands of players in our vibrant community and trading marketplace.',
    color: 'blue'
  },
  {
    icon: Lock,
    title: 'Secure Platform',
    description: 'Your account and items are protected with industry-leading security measures.',
    color: 'yellow'
  }
];

export function Features() {
  return (
    <section className="py-16 bg-[var(--dark-card)]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--electric-purple)] bg-clip-text text-transparent">
            Why Choose PokeBox?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the best gaming loot platform with cutting-edge features and unmatched excitement
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover glow={feature.color as any}>
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${
                    feature.color === 'yellow' ? 'bg-yellow-500/20' :
                    feature.color === 'blue' ? 'bg-blue-500/20' :
                    feature.color === 'purple' ? 'bg-purple-500/20' :
                    'bg-red-500/20'
                  }`}>
                    <Icon className={`w-7 h-7 ${
                      feature.color === 'yellow' ? 'text-yellow-400' :
                      feature.color === 'blue' ? 'text-blue-400' :
                      feature.color === 'purple' ? 'text-purple-400' :
                      'text-red-400'
                    }`} />
                  </div>
                  <h3 className="text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
