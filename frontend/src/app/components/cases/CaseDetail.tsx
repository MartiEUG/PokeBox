import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowLeft, Zap, Star, Gift } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CaseOpeningModal } from './CaseOpeningModal';
import { generateRandomItem } from '../../utils/caseItems';
import { toast } from 'sonner';
import fireLegendBox from 'figma:asset/9ec76398309a55ad6c038687fb265739b33249d1.png';
import aquaBox from 'figma:asset/a014c295a4dcea3753600c4a6c664a9ce162dcd3.png';
import forestBox from 'figma:asset/5e0c1ee4f63b7569a0a9fa8da13d032b3aa3ec7b.png';
import natureBox from 'figma:asset/8ee16956421ef7e0637c1c60c1217bc723ef217d.png';
import blastoiseCard from 'figma:asset/cf34049cc11b36cdcad8ff7a5531e03368aaf7db.png';

const cases = [
  { 
    id: 1, 
    name: 'Electric Starter', 
    price: 199, 
    rarity: 'Common', 
    category: 'Starter', 
    color: 'yellow', 
    image: null, 
    featuredCard: null,
    description: 'Perfect for beginners looking to start their collection with electric-themed items.',
    dropRate: '15%'
  },
  { 
    id: 2, 
    name: 'Fire Legend', 
    price: 499, 
    rarity: 'Mythic', 
    category: 'Legend', 
    color: 'red', 
    image: fireLegendBox, 
    featuredCard: null,
    description: 'Unleash the power of fire with this legendary collection of rare items.',
    dropRate: '25%'
  },
  { 
    id: 3, 
    name: 'Water Champion', 
    price: 999, 
    rarity: 'Legendary', 
    category: 'Champion', 
    color: 'blue', 
    image: aquaBox, 
    featuredCard: blastoiseCard,
    description: 'Dive into the depths and discover powerful water-type treasures. Features exclusive Blastoise card!',
    dropRate: '30%'
  },
  { 
    id: 4, 
    name: 'Psychic Master', 
    price: 1999, 
    rarity: 'Legendary', 
    category: 'Master', 
    color: 'purple', 
    image: null, 
    featuredCard: null,
    description: 'Unlock the mysteries of the mind with psychic-powered collectibles.',
    dropRate: '20%'
  },
  { 
    id: 5, 
    name: 'Dragon Elite', 
    price: 4999, 
    rarity: 'Epic', 
    category: 'Elite', 
    color: 'yellow', 
    image: null, 
    featuredCard: null,
    description: 'The ultimate collection for dragon trainers seeking the most powerful items.',
    dropRate: '35%'
  },
  { 
    id: 6, 
    name: 'Grass Bundle', 
    price: 299, 
    rarity: 'Epic', 
    category: 'Bundle', 
    color: 'blue', 
    image: forestBox, 
    featuredCard: null,
    description: 'Nature-inspired items perfect for collectors who love the great outdoors.',
    dropRate: '18%'
  },
  { 
    id: 7, 
    name: 'Ice Collection', 
    price: 799, 
    rarity: 'Rare', 
    category: 'Collection', 
    color: 'blue', 
    image: natureBox, 
    featuredCard: null,
    description: 'Cool down with this frosty collection of ice-themed treasures.',
    dropRate: '22%'
  },
  { 
    id: 8, 
    name: 'Fighting Spirit', 
    price: 1299, 
    rarity: 'Rare', 
    category: 'Spirit', 
    color: 'red', 
    image: null, 
    featuredCard: null,
    description: 'Embrace the warrior spirit with powerful fighting-type items.',
    dropRate: '28%'
  },
];

export function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser, addToInventory, recordCaseOpening } = useAuth();
  const [isOpening, setIsOpening] = useState(false);
  const [openedItem, setOpenedItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const caseItem = cases.find(c => c.id === Number(id));

  if (!caseItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <h2 className="mb-4">Case not found</h2>
          <Button onClick={() => navigate('/cases')}>Back to Cases</Button>
        </Card>
      </div>
    );
  }

  const handleOpenCase = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to open cases');
      navigate('/login');
      return;
    }

    if (user.balance < caseItem.price) {
      toast.error('Insufficient balance');
      return;
    }

    setIsOpening(true);

    try {
      // Deduct balance
      await updateUser({ balance: user.balance - caseItem.price });

      // Generate random item
      const item = generateRandomItem(caseItem.id);
      
      // Add to inventory and record opening
      await addToInventory({
        name: item.name,
        rarity: item.rarity,
        value: item.value,
        caseId: caseItem.id,
      });

      await recordCaseOpening(caseItem.id, caseItem.name, item);

      // Show opening modal
      setOpenedItem(item);
      setShowModal(true);
      
      toast.success(`You opened ${caseItem.name}!`);
    } catch (error) {
      console.error('Error opening case:', error);
      toast.error('Failed to open case. Please try again.');
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/cases')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cases
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Case Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden mb-6">
                {caseItem.image ? (
                  <motion.img 
                    src={caseItem.image} 
                    alt={caseItem.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
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
                    <Zap className="w-32 h-32 text-[var(--neon-yellow)]" />
                  </>
                )}
              </div>

              {/* Featured Card Section */}
              {caseItem.featuredCard && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-[var(--neon-yellow)]" />
                    <h3 className="text-xl">Featured Item</h3>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-[var(--neon-blue)]">
                    <motion.img 
                      src={caseItem.featuredCard}
                      alt="Featured Card"
                      className="w-full rounded-lg"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Right Column - Case Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
                  {caseItem.name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  caseItem.rarity === 'Mythic' ? 'bg-yellow-500/20 text-yellow-400' :
                  caseItem.rarity === 'Legendary' ? 'bg-purple-500/20 text-purple-400' :
                  caseItem.rarity === 'Epic' ? 'bg-blue-500/20 text-blue-400' :
                  caseItem.rarity === 'Rare' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {caseItem.rarity}
                </span>
              </div>
              <p className="text-gray-400 text-lg">{caseItem.description}</p>
            </div>

            {/* Stats */}
            <Card>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[var(--dark-hover)] rounded-lg">
                  <div className="text-3xl mb-2 text-[var(--neon-yellow)]">{caseItem.price}</div>
                  <div className="text-gray-400 text-sm">Credits</div>
                </div>
                <div className="text-center p-4 bg-[var(--dark-hover)] rounded-lg">
                  <div className="text-3xl mb-2 text-[var(--neon-blue)]">{caseItem.dropRate}</div>
                  <div className="text-gray-400 text-sm">Rare Drop Rate</div>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card>
              <h3 className="mb-4 text-xl">Case Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Gift className="w-5 h-5 text-[var(--neon-yellow)]" />
                  <span>Multiple rare items guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Star className="w-5 h-5 text-[var(--neon-yellow)]" />
                  <span>Chance for legendary drops</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Zap className="w-5 h-5 text-[var(--neon-yellow)]" />
                  <span>Instant reveal animation</span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={handleOpenCase}
                disabled={isOpening || !isAuthenticated || (user && user.balance < caseItem.price)}
              >
                {isOpening ? 'Opening...' : `Open Case - ${caseItem.price} Credits`}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => {/* TODO: Implement preview */}}
              >
                Preview Items
              </Button>
            </div>

            {/* Warning */}
            <Card>
              <p className="text-sm text-gray-400">
                <span className="text-[var(--neon-yellow)]">Note:</span> All drops are random. Past results do not guarantee future outcomes.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Case Opening Modal */}
      <CaseOpeningModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={openedItem}
        caseName={caseItem.name}
      />
    </div>
  );
}