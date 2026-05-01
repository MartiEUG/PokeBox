import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Package, TrendingUp, Sparkles } from 'lucide-react';
import { getRarityColor, getRarityGlow } from '../../utils/caseItems';
import type { Item } from '../../context/AuthContext';

export function Inventory() {
  const { user, isAuthenticated, getInventory } = useAuth();
  const [inventory, setInventory] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadInventory();
  }, [isAuthenticated]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const items = await getInventory();
      setInventory(items);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    return item.rarity === filter;
  });

  const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);

  const rarityFilters = ['all', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6">Please login to view your inventory</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
            My Inventory
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your collection of items from opened cases
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--neon-yellow)]/20 rounded-lg">
                  <Package className="w-6 h-6 text-[var(--neon-yellow)]" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Items</div>
                  <div className="text-2xl">{inventory.length}</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--neon-blue)]/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-[var(--neon-blue)]" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Value</div>
                  <div className="text-2xl">${totalValue.toFixed(2)}</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Rare Items</div>
                  <div className="text-2xl">
                    {inventory.filter(i => ['Legendary', 'Mythic'].includes(i.rarity)).length}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <div className="flex flex-wrap gap-2">
              {rarityFilters.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => setFilter(rarity)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filter === rarity
                      ? 'bg-[var(--neon-yellow)] text-black'
                      : 'bg-[var(--dark-hover)] text-gray-400 hover:text-white'
                  }`}
                >
                  {rarity === 'all' ? 'All Items' : rarity}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Inventory Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-[var(--neon-yellow)] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading inventory...</p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card>
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="mb-2">No Items Found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all'
                  ? 'Start opening cases to build your collection!'
                  : `You don't have any ${filter} items yet`}
              </p>
              <Button variant="primary" onClick={() => window.location.href = '/cases'}>
                Browse Cases
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInventory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:scale-105 transition-transform cursor-pointer">
                  {/* Rarity Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs bg-gradient-to-r ${getRarityColor(
                        item.rarity
                      )} text-white ${getRarityGlow(item.rarity)}`}
                    >
                      {item.rarity}
                    </span>
                  </div>

                  {/* Item Display */}
                  <div
                    className={`w-full aspect-square bg-gradient-to-br ${getRarityColor(
                      item.rarity
                    )} rounded-xl flex items-center justify-center mb-4 ${getRarityGlow(
                      item.rarity
                    )}`}
                  >
                    <div className="text-6xl">💎</div>
                  </div>

                  {/* Item Info */}
                  <h3 className="mb-2 text-lg">{item.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Value</span>
                    <span className="text-[var(--neon-yellow)]">${item.value}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-400">Obtained</span>
                    <span className="text-gray-500">
                      {new Date(item.obtainedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
                    <Button variant="secondary" className="flex-1 text-sm py-2">
                      Sell
                    </Button>
                    <Button variant="secondary" className="flex-1 text-sm py-2">
                      List
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
