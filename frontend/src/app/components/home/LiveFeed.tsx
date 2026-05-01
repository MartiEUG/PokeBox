import { motion } from 'motion/react';
import { Trophy, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const winners = [
  { id: 1, username: 'Trainer_Alex', item: 'Legendary Thunder Stone', value: 2499, rarity: 'Legendary' },
  { id: 2, username: 'PokeMaster99', item: 'Rare Fire Crystal', value: 899, rarity: 'Rare' },
  { id: 3, username: 'ChampionSarah', item: 'Epic Water Gem', value: 1299, rarity: 'Epic' },
  { id: 4, username: 'EliteJordan', item: 'Mythic Dragon Scale', value: 4999, rarity: 'Mythic' },
  { id: 5, username: 'ProGamer_Mike', item: 'Rare Grass Seed', value: 799, rarity: 'Rare' },
  { id: 6, username: 'StarTrainer', item: 'Epic Psychic Orb', value: 1499, rarity: 'Epic' },
  { id: 7, username: 'NinjaPlayer', item: 'Legendary Ice Shard', value: 2199, rarity: 'Legendary' },
  { id: 8, username: 'QueenGamer', item: 'Common Electric Bolt', value: 199, rarity: 'Common' },
];

export function LiveFeed() {
  const [displayedWinners, setDisplayedWinners] = useState(winners);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedWinners((prev) => {
        const newWinners = [...prev];
        const last = newWinners.pop()!;
        newWinners.unshift(last);
        return newWinners;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-[var(--neon-yellow)]" />
            <span className="bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-red)] bg-clip-text text-transparent">
              Live Wins
            </span>
          </h2>
          <p className="text-gray-400">
            See what other players are winning right now
          </p>
        </motion.div>
        
        <div className="bg-[var(--dark-card)] border border-gray-800 rounded-xl p-6 max-w-4xl mx-auto">
          <div className="space-y-3 max-h-96 overflow-hidden">
            {displayedWinners.map((winner, index) => (
              <motion.div
                key={`${winner.id}-${index}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between p-4 bg-[var(--dark-hover)] rounded-lg border border-gray-800 hover:border-[var(--neon-blue)] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--neon-blue)] to-[var(--electric-purple)] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white">{winner.username}</div>
                    <div className="text-gray-400">just won</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`${
                    winner.rarity === 'Mythic' ? 'text-yellow-400' :
                    winner.rarity === 'Legendary' ? 'text-purple-400' :
                    winner.rarity === 'Epic' ? 'text-blue-400' :
                    winner.rarity === 'Rare' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {winner.item}
                  </div>
                  <div className="text-[var(--neon-yellow)]">{winner.value} Credits</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
