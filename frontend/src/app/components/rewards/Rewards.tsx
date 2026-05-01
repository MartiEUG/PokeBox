import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Gift, Target, Calendar, Trophy, Star, Zap } from 'lucide-react';

const dailyTasks = [
  { id: 1, title: 'Open 3 Cases', progress: 2, total: 3, reward: 50, completed: false },
  { id: 2, title: 'Win 1 Battle', progress: 0, total: 1, reward: 100, completed: false },
  { id: 3, title: 'Login Daily', progress: 1, total: 1, reward: 25, completed: true },
  { id: 4, title: 'Sell 1 Item', progress: 0, total: 1, reward: 75, completed: false },
];

const weeklyRewards = [
  { tier: 'Bronze', requirement: '10 cases', reward: '500 Credits', unlocked: true },
  { tier: 'Silver', requirement: '25 cases', reward: '1,500 Credits', unlocked: true },
  { tier: 'Gold', requirement: '50 cases', reward: '5,000 Credits', unlocked: false },
  { tier: 'Platinum', requirement: '100 cases', reward: '15,000 Credits', unlocked: false },
];

export function Rewards() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--electric-purple)] bg-clip-text text-transparent">
            Rewards Center
          </h1>
          <p className="text-gray-400">
            Complete tasks and earn exclusive rewards
          </p>
        </motion.div>
        
        {/* Daily Bonus */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card glow="yellow">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-yellow)] to-[var(--neon-blue)] rounded-xl flex items-center justify-center">
                  <Gift className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h2 className="text-white mb-1">Daily Bonus</h2>
                  <p className="text-gray-400">Claim your daily reward</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[var(--neon-yellow)] mb-2">+200 Credits</div>
                <Button variant="primary" size="lg">
                  <Gift className="w-5 h-5" />
                  Claim Bonus
                </Button>
              </div>
            </div>
            
            {/* Daily Login Streak */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white">Login Streak</span>
                <span className="text-[var(--neon-yellow)]">7 Days</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
                      day <= 7
                        ? 'bg-gradient-to-br from-[var(--neon-yellow)] to-[var(--neon-blue)]'
                        : 'bg-[var(--dark-hover)] border border-gray-700'
                    }`}
                  >
                    <Calendar className="w-6 h-6 mb-1" />
                    <span className="text-xs">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Daily Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-[var(--neon-blue)]" />
            Daily Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyTasks.map((task) => (
              <Card key={task.id} hover glow={task.completed ? 'yellow' : 'blue'}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">{task.title}</h3>
                  <span className="text-[var(--neon-yellow)]">+{task.reward} Credits</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{task.progress}/{task.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(task.progress / task.total) * 100}%` }}
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)]"
                    />
                  </div>
                </div>
                
                <Button
                  variant={task.completed ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-full"
                  disabled={!task.completed}
                >
                  {task.completed ? 'Claim Reward' : 'In Progress'}
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>
        
        {/* Weekly Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-white mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[var(--electric-purple)]" />
            Weekly Reward Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyRewards.map((tier, index) => (
              <Card
                key={index}
                hover
                glow={tier.unlocked ? 'yellow' : 'none'}
                className={tier.unlocked ? '' : 'opacity-60'}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    tier.tier === 'Bronze' ? 'bg-orange-900/30 border-2 border-orange-700' :
                    tier.tier === 'Silver' ? 'bg-gray-500/30 border-2 border-gray-400' :
                    tier.tier === 'Gold' ? 'bg-yellow-500/30 border-2 border-yellow-400' :
                    'bg-purple-500/30 border-2 border-purple-400'
                  }`}>
                    {tier.unlocked ? (
                      <Star className={`w-8 h-8 ${
                        tier.tier === 'Bronze' ? 'text-orange-400' :
                        tier.tier === 'Silver' ? 'text-gray-300' :
                        tier.tier === 'Gold' ? 'text-yellow-400' :
                        'text-purple-400'
                      }`} />
                    ) : (
                      <Trophy className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <h3 className="text-white mb-2">{tier.tier}</h3>
                  <p className="text-gray-400 mb-3">{tier.requirement}</p>
                  <div className="text-[var(--neon-yellow)] mb-4">{tier.reward}</div>
                  {tier.unlocked ? (
                    <Button variant="primary" size="sm" className="w-full">
                      <Gift className="w-4 h-4" />
                      Claim
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full" disabled>
                      Locked
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
        
        {/* Monthly Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-[var(--neon-red)]" />
            Monthly Challenges
          </h2>
          <Card glow="red">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-[var(--dark-hover)] rounded-lg">
                <h3 className="text-white mb-2">Case Master</h3>
                <p className="text-gray-400 mb-4">Open 200 cases</p>
                <div className="mb-3">
                  <div className="text-white mb-2">127/200</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '63.5%' }}
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--neon-red)] to-[var(--electric-purple)]"
                    />
                  </div>
                </div>
                <div className="text-[var(--neon-yellow)]">Reward: 10,000 Credits</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--dark-hover)] rounded-lg">
                <h3 className="text-white mb-2">Battle Champion</h3>
                <p className="text-gray-400 mb-4">Win 50 battles</p>
                <div className="mb-3">
                  <div className="text-white mb-2">43/50</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '86%' }}
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--neon-red)] to-[var(--electric-purple)]"
                    />
                  </div>
                </div>
                <div className="text-[var(--neon-yellow)]">Reward: Exclusive Badge</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--dark-hover)] rounded-lg">
                <h3 className="text-white mb-2">Marketplace Mogul</h3>
                <p className="text-gray-400 mb-4">Sell 100 items</p>
                <div className="mb-3">
                  <div className="text-white mb-2">67/100</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '67%' }}
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--neon-red)] to-[var(--electric-purple)]"
                    />
                  </div>
                </div>
                <div className="text-[var(--neon-yellow)]">Reward: 5,000 Credits</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
