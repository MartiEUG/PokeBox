import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Item } from '../../context/AuthContext';
import { getRarityColor, getRarityGlow } from '../../utils/caseItems';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CaseOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  caseName: string;
}

export function CaseOpeningModal({ isOpen, onClose, item, caseName }: CaseOpeningModalProps) {
  const navigate = useNavigate();
  const [showRevealing, setShowRevealing] = useState(true);
  const [showItem, setShowItem] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setShowRevealing(true);
      setShowItem(false);

      // Show item after animation
      const timer = setTimeout(() => {
        setShowRevealing(false);
        setShowItem(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[var(--dark-card)] border border-gray-800 rounded-2xl p-8 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-[var(--dark-hover)] rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: -20,
                    opacity: 0,
                  }}
                  animate={{
                    y: '120%',
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'linear',
                  }}
                  className="absolute"
                >
                  <Sparkles className={`w-4 h-4 text-${item.rarity === 'Mythic' ? 'yellow' : item.rarity === 'Legendary' ? 'purple' : 'blue'}-400`} />
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <h2 className="mb-6 text-2xl bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
                Opening {caseName}
              </h2>

              {/* Revealing Animation */}
              <AnimatePresence mode="wait">
                {showRevealing && (
                  <motion.div
                    key="revealing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-16"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="w-32 h-32 mx-auto bg-gradient-to-br from-[var(--neon-yellow)] via-[var(--neon-blue)] to-[var(--electric-purple)] rounded-full opacity-50 blur-xl"
                    />
                    <p className="mt-8 text-xl text-white animate-pulse">
                      Revealing your item...
                    </p>
                  </motion.div>
                )}

                {/* Item Reveal */}
                {showItem && (
                  <motion.div
                    key="item"
                    initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 100,
                      damping: 15,
                    }}
                    className="py-8"
                  >
                    {/* Rarity Badge */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6"
                    >
                      <span className={`inline-block px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getRarityColor(item.rarity)} text-white ${getRarityGlow(item.rarity)}`}>
                        {item.rarity}
                      </span>
                    </motion.div>

                    {/* Item Display */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className={`w-48 h-48 mx-auto bg-gradient-to-br ${getRarityColor(item.rarity)} rounded-2xl flex items-center justify-center mb-6 ${getRarityGlow(item.rarity)}`}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="text-6xl"
                      >
                        💎
                      </motion.div>
                    </motion.div>

                    {/* Item Name */}
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-3xl text-white mb-4"
                    >
                      {item.name}
                    </motion.h3>

                    {/* Item Value */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="mb-8"
                    >
                      <div className="text-sm text-gray-400 mb-1">Estimated Value</div>
                      <div className="text-4xl bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
                        ${item.value}
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.1 }}
                      className="flex gap-4 justify-center"
                    >
                      <Button
                        variant="primary"
                        onClick={onClose}
                      >
                        Continue
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          navigate('/inventory');
                          onClose();
                        }}
                      >
                        View Inventory
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}