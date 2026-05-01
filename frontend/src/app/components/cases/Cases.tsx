import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Zap, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fireLegendBox from 'figma:asset/9ec76398309a55ad6c038687fb265739b33249d1.png';
import aquaBox from 'figma:asset/a014c295a4dcea3753600c4a6c664a9ce162dcd3.png';
import forestBox from 'figma:asset/5e0c1ee4f63b7569a0a9fa8da13d032b3aa3ec7b.png';
import natureBox from 'figma:asset/8ee16956421ef7e0637c1c60c1217bc723ef217d.png';
import blastoiseCard from 'figma:asset/cf34049cc11b36cdcad8ff7a5531e03368aaf7db.png';

const cases = [
  { id: 1, name: 'Electric Starter', price: 199, rarity: 'Common', category: 'Starter', color: 'yellow', image: null, featuredCard: null },
  { id: 2, name: 'Fire Legend', price: 499, rarity: 'Mythic', category: 'Legend', color: 'red', image: fireLegendBox, featuredCard: null },
  { id: 3, name: 'Water Champion', price: 999, rarity: 'Legendary', category: 'Champion', color: 'blue', image: aquaBox, featuredCard: blastoiseCard },
  { id: 4, name: 'Psychic Master', price: 1999, rarity: 'Legendary', category: 'Master', color: 'purple', image: null, featuredCard: null },
  { id: 5, name: 'Dragon Elite', price: 4999, rarity: 'Epic', category: 'Elite', color: 'yellow', image: null, featuredCard: null },
  { id: 6, name: 'Grass Bundle', price: 299, rarity: 'Epic', category: 'Bundle', color: 'blue', image: forestBox, featuredCard: null },
  { id: 7, name: 'Ice Collection', price: 799, rarity: 'Rare', category: 'Collection', color: 'blue', image: natureBox, featuredCard: null },
  { id: 8, name: 'Fighting Spirit', price: 1299, rarity: 'Rare', category: 'Spirit', color: 'red', image: null, featuredCard: null },
];

export function Cases() {
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const rarities = ['All', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  
  const filteredCases = cases.filter(caseItem => {
    const matchesRarity = selectedRarity === 'All' || caseItem.rarity === selectedRarity;
    const matchesSearch = caseItem.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRarity && matchesSearch;
  });
  
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
            Case Catalog
          </h1>
          <p className="text-gray-400">
            Choose your case and try your luck
          </p>
        </motion.div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cases..."
                    className="w-full bg-[var(--dark-hover)] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                  />
                </div>
              </div>
              
              {/* Rarity Filter */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                {rarities.map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => setSelectedRarity(rarity)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                      selectedRarity === rarity
                        ? 'bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] text-black'
                        : 'bg-[var(--dark-hover)] text-gray-400 hover:text-white'
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Cases Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card hover glow={caseItem.color as any}>
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate(`/cases/${caseItem.id}`)}
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    {caseItem.image ? (
                      <img 
                        src={caseItem.image} 
                        alt={caseItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="absolute inset-0 bg-gradient-to-br from-[var(--neon-yellow)] via-transparent to-[var(--neon-blue)] opacity-20"
                        />
                        <Zap className="w-16 h-16 text-[var(--neon-yellow)]" />
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white">{caseItem.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        caseItem.rarity === 'Mythic' ? 'bg-yellow-500/20 text-yellow-400' :
                        caseItem.rarity === 'Legendary' ? 'bg-purple-500/20 text-purple-400' :
                        caseItem.rarity === 'Epic' ? 'bg-blue-500/20 text-blue-400' :
                        caseItem.rarity === 'Rare' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {caseItem.rarity}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--neon-yellow)]">{caseItem.price} Credits</span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="primary"
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/cases/${caseItem.id}`);
                  }}
                >
                  View Details
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}