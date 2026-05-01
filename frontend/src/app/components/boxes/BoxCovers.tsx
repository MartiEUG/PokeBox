import { motion } from 'motion/react';
import boxCover1 from 'figma:asset/a014c295a4dcea3753600c4a6c664a9ce162dcd3.png';
import boxCover2 from 'figma:asset/5e0c1ee4f63b7569a0a9fa8da13d032b3aa3ec7b.png';
import boxCover3 from 'figma:asset/8ee16956421ef7e0637c1c60c1217bc723ef217d.png';
import fireLegendBox from 'figma:asset/9ec76398309a55ad6c038687fb265739b33249d1.png';
import blastoiseCard from 'figma:asset/cf34049cc11b36cdcad8ff7a5531e03368aaf7db.png';

interface BoxCover {
  id: string;
  name: string;
  image: string;
  theme: string;
  rarity: string;
  glowColor: string;
  featuredCard?: string;
}

const boxCovers: BoxCover[] = [
  {
    id: 'fire-legend',
    name: 'Fire Legend',
    image: fireLegendBox,
    theme: 'Inferno',
    rarity: 'Mythic',
    glowColor: '#ff6b00',
  },
  {
    id: 'box-1',
    name: 'Water Champion',
    image: boxCover1,
    theme: 'Aqua',
    rarity: 'Legendary',
    glowColor: '#00d4ff',
    featuredCard: blastoiseCard,
  },
  {
    id: 'box-2',
    name: 'Grass Bundle',
    image: boxCover2,
    theme: 'Forest',
    rarity: 'Epic',
    glowColor: '#7fff00',
  },
  {
    id: 'box-3',
    name: 'Ice Collection',
    image: boxCover3,
    theme: 'Nature',
    rarity: 'Rare',
    glowColor: '#9acd32',
  },
];

export function BoxCovers() {
  return (
    <div className="min-h-screen bg-[var(--dark-bg)] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl mb-4 bg-gradient-to-r from-[var(--neon-yellow)] via-[var(--neon-blue)] to-[var(--electric-purple)] bg-clip-text text-transparent">
            Premium Box Collection
          </h1>
          <p className="text-gray-400 text-lg">
            Discover our exclusive loot boxes, each with unique themes and legendary rewards
          </p>
        </div>

        {/* Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boxCovers.map((box, index) => (
            <motion.div
              key={box.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              {/* Box Card */}
              <div className="relative bg-[var(--dark-card)] rounded-2xl overflow-hidden border border-gray-800 hover:border-[var(--neon-blue)] transition-all duration-300">
                {/* Rarity Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className="px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-sm"
                    style={{
                      background: `${box.glowColor}20`,
                      color: box.glowColor,
                      border: `1px solid ${box.glowColor}40`,
                    }}
                  >
                    {box.rarity}
                  </span>
                </div>

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-transparent to-black/50">
                  <motion.img
                    src={box.image}
                    alt={box.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${box.glowColor}, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Box Info */}
                <div className="p-6">
                  <h3 className="text-2xl mb-2">{box.name}</h3>
                  <p className="text-gray-400 mb-4">{box.theme} Theme</p>
                  
                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--neon-blue)] to-[var(--electric-purple)] hover:shadow-lg transition-all duration-300"
                    style={{
                      boxShadow: `0 0 20px ${box.glowColor}40`,
                    }}
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-[var(--dark-card)] rounded-xl p-6 border border-gray-800 text-center"
          >
            <div className="text-4xl mb-2 text-[var(--neon-yellow)]">4</div>
            <div className="text-gray-400">Unique Boxes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-[var(--dark-card)] rounded-xl p-6 border border-gray-800 text-center"
          >
            <div className="text-4xl mb-2 text-[var(--neon-blue)]">100%</div>
            <div className="text-gray-400">Authentic Quality</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-[var(--dark-card)] rounded-xl p-6 border border-gray-800 text-center"
          >
            <div className="text-4xl mb-2 text-[var(--electric-purple)]">∞</div>
            <div className="text-gray-400">Possibilities</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}