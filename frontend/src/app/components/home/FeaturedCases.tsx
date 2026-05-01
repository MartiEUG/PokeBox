import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fireLegendBox from 'figma:asset/9ec76398309a55ad6c038687fb265739b33249d1.png';
import aquaBox from 'figma:asset/a014c295a4dcea3753600c4a6c664a9ce162dcd3.png';
import forestBox from 'figma:asset/5e0c1ee4f63b7569a0a9fa8da13d032b3aa3ec7b.png';
import natureBox from 'figma:asset/8ee16956421ef7e0637c1c60c1217bc723ef217d.png';
import blastoiseCard from 'figma:asset/cf34049cc11b36cdcad8ff7a5531e03368aaf7db.png';

const cases = [
  { id: 1, name: 'Electric Starter', price: 199, rarity: 'Common', color: 'yellow', image: null, featuredCard: null },
  { id: 2, name: 'Fire Legend', price: 499, rarity: 'Mythic', color: 'red', image: fireLegendBox, featuredCard: null },
  { id: 3, name: 'Water Champion', price: 999, rarity: 'Legendary', color: 'blue', image: aquaBox, featuredCard: blastoiseCard },
  { id: 4, name: 'Psychic Master', price: 1999, rarity: 'Legendary', color: 'purple', image: null, featuredCard: null },
  { id: 5, name: 'Dragon Elite', price: 4999, rarity: 'Epic', color: 'yellow', image: null, featuredCard: null },
  { id: 6, name: 'Grass Bundle', price: 299, rarity: 'Epic', color: 'blue', image: forestBox, featuredCard: null },
  { id: 7, name: 'Ice Collection', price: 799, rarity: 'Rare', color: 'blue', image: natureBox, featuredCard: null },
];

export function FeaturedCases() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  const nextCase = () => {
    setCurrentIndex((prev) => (prev + 1) % cases.length);
  };
  
  const prevCase = () => {
    setCurrentIndex((prev) => (prev - 1 + cases.length) % cases.length);
  };
  
  const getVisibleCases = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(cases[(currentIndex + i) % cases.length]);
    }
    return visible;
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-[var(--dark-card)]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
            Featured Cases
          </h2>
          <p className="text-gray-400">
            Explore our most popular mystery cases
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevCase}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[var(--dark-card)] border border-gray-800 rounded-full flex items-center justify-center hover:bg-[var(--dark-hover)] hover:border-[var(--neon-blue)] transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextCase}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[var(--dark-card)] border border-gray-800 rounded-full flex items-center justify-center hover:bg-[var(--dark-hover)] hover:border-[var(--neon-blue)] transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Cases Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-16">
            {getVisibleCases().map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
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
                          <Zap className="w-20 h-20 text-[var(--neon-yellow)]" />
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white">{caseItem.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs ${
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
          </div>
        </div>
      </div>
    </section>
  );
}