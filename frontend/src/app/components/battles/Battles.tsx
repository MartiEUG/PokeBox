import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sword, Users, Plus, Trophy, Zap } from 'lucide-react';
import { useState } from 'react';

const activeBattles = [
  { id: 1, host: 'ProGamer_Mike', mode: '1v1', casePrice: 499, slots: { filled: 1, total: 2 }, prize: 998 },
  { id: 2, host: 'ChampionSarah', mode: '1v1', casePrice: 999, slots: { filled: 1, total: 2 }, prize: 1998 },
  { id: 3, host: 'EliteJordan', mode: '2v2', casePrice: 1999, slots: { filled: 3, total: 4 }, prize: 7996 },
];

export function Battles() {
  const [selectedMode, setSelectedMode] = useState<'1v1' | '2v2'>('1v1');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [currentBattle, setCurrentBattle] = useState<any>(null);
  
  const handleJoinBattle = (battle: any) => {
    setCurrentBattle(battle);
    setShowBattleModal(true);
    
    // Simulate battle
    setTimeout(() => {
      setShowBattleModal(false);
      setCurrentBattle(null);
    }, 5000);
  };
  
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-red)] to-[var(--electric-purple)] bg-clip-text text-transparent">
            Case Battles
          </h1>
          <p className="text-gray-400">
            Challenge other players and win big
          </p>
        </motion.div>
        
        {/* Create Battle Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card glow="red">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-red)] to-[var(--electric-purple)] rounded-xl flex items-center justify-center">
                  <Sword className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-white mb-1">Create Your Battle</h2>
                  <p className="text-gray-400">Choose your cases and challenge opponents</p>
                </div>
              </div>
              <Button variant="danger" size="lg" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5" />
                Create Battle
              </Button>
            </div>
          </Card>
        </motion.div>
        
        {/* Battle Mode Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex justify-center gap-4"
        >
          <button
            onClick={() => setSelectedMode('1v1')}
            className={`px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              selectedMode === '1v1'
                ? 'bg-gradient-to-r from-[var(--neon-red)] to-[var(--electric-purple)] text-white'
                : 'bg-[var(--dark-card)] text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            1v1 Battles
          </button>
          <button
            onClick={() => setSelectedMode('2v2')}
            className={`px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              selectedMode === '2v2'
                ? 'bg-gradient-to-r from-[var(--neon-red)] to-[var(--electric-purple)] text-white'
                : 'bg-[var(--dark-card)] text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            2v2 Battles
          </button>
        </motion.div>
        
        {/* Active Battles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-white mb-6">Active Battles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBattles
              .filter(battle => battle.mode === selectedMode)
              .map((battle) => (
                <Card key={battle.id} hover glow="red">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--neon-blue)] to-[var(--electric-purple)] rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white">{battle.host}</div>
                          <div className="text-gray-400">{battle.mode} Battle</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        Live
                      </span>
                    </div>
                    
                    <div className="p-4 bg-[var(--dark-hover)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Case Price:</span>
                        <span className="text-[var(--neon-yellow)]">{battle.casePrice} Credits</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Total Prize:</span>
                        <span className="text-[var(--neon-yellow)]">{battle.prize} Credits</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Players:</span>
                        <span className="text-white">{battle.slots.filled}/{battle.slots.total}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="danger" 
                      size="md" 
                      className="w-full"
                      onClick={() => handleJoinBattle(battle)}
                    >
                      <Sword className="w-4 h-4" />
                      Join Battle
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </motion.div>
        
        {/* Battle Modal */}
        {showBattleModal && currentBattle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => {
              setShowBattleModal(false);
              setCurrentBattle(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--dark-card)] border border-gray-800 rounded-2xl p-8 max-w-4xl w-full"
            >
              <h2 className="text-white mb-8 text-center">Battle in Progress</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Player 1 */}
                <Card>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-blue)] to-[var(--electric-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white mb-2">{currentBattle.host}</h3>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mx-auto w-20 h-20 flex items-center justify-center"
                    >
                      <Zap className="w-12 h-12 text-[var(--neon-yellow)]" />
                    </motion.div>
                    <div className="text-[var(--neon-yellow)] mt-4">Opening...</div>
                  </div>
                </Card>
                
                {/* Player 2 */}
                <Card>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--neon-yellow)] to-[var(--neon-red)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white mb-2">You</h3>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mx-auto w-20 h-20 flex items-center justify-center"
                    >
                      <Zap className="w-12 h-12 text-[var(--neon-blue)]" />
                    </motion.div>
                    <div className="text-[var(--neon-blue)] mt-4">Opening...</div>
                  </div>
                </Card>
              </div>
              
              <div className="text-center">
                <Trophy className="w-12 h-12 text-[var(--neon-yellow)] mx-auto mb-2" />
                <p className="text-gray-400">Winner will be revealed soon...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Create Battle Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--dark-card)] border border-gray-800 rounded-2xl p-8 max-w-2xl w-full"
            >
              <h2 className="text-white mb-6">Create New Battle</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Battle Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-[var(--dark-hover)] border border-[var(--neon-blue)] rounded-lg text-white hover:bg-[var(--dark-card)] transition-colors">
                      1v1
                    </button>
                    <button className="p-4 bg-[var(--dark-hover)] border border-gray-700 rounded-lg text-gray-400 hover:border-[var(--neon-blue)] hover:text-white transition-colors">
                      2v2
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-2">Select Case</label>
                  <select className="w-full bg-[var(--dark-hover)] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors">
                    <option>Electric Starter - 199 Credits</option>
                    <option>Fire Legend - 499 Credits</option>
                    <option>Water Champion - 999 Credits</option>
                    <option>Psychic Master - 1999 Credits</option>
                  </select>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="secondary" size="lg" className="flex-1" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" size="lg" className="flex-1" onClick={() => setShowCreateModal(false)}>
                    Create Battle
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
