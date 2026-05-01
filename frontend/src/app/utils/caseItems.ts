import { Item } from '../context/AuthContext';

interface ItemTemplate {
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  minValue: number;
  maxValue: number;
}

// Item pools for each case
export const caseItemPools: Record<number, ItemTemplate[]> = {
  1: [ // Electric Starter
    { name: 'Thunder Stone', rarity: 'Common', minValue: 50, maxValue: 100 },
    { name: 'Volt Badge', rarity: 'Common', minValue: 75, maxValue: 125 },
    { name: 'Electric Crystal', rarity: 'Rare', minValue: 150, maxValue: 250 },
    { name: 'Plasma Orb', rarity: 'Rare', minValue: 200, maxValue: 300 },
    { name: 'Lightning Shard', rarity: 'Epic', minValue: 350, maxValue: 500 },
    { name: 'Thunderbolt Medal', rarity: 'Legendary', minValue: 600, maxValue: 800 },
  ],
  2: [ // Fire Legend
    { name: 'Flame Ember', rarity: 'Common', minValue: 150, maxValue: 250 },
    { name: 'Fire Stone', rarity: 'Rare', minValue: 300, maxValue: 450 },
    { name: 'Volcanic Rock', rarity: 'Rare', minValue: 400, maxValue: 550 },
    { name: 'Inferno Crystal', rarity: 'Epic', minValue: 700, maxValue: 900 },
    { name: 'Phoenix Feather', rarity: 'Legendary', minValue: 1200, maxValue: 1600 },
    { name: 'Eternal Flame', rarity: 'Mythic', minValue: 2000, maxValue: 2500 },
  ],
  3: [ // Water Champion
    { name: 'Water Drop', rarity: 'Common', minValue: 300, maxValue: 500 },
    { name: 'Ocean Pearl', rarity: 'Rare', minValue: 600, maxValue: 850 },
    { name: 'Tidal Wave Charm', rarity: 'Epic', minValue: 1200, maxValue: 1600 },
    { name: 'Deep Sea Crystal', rarity: 'Epic', minValue: 1400, maxValue: 1800 },
    { name: 'Blastoise Card', rarity: 'Legendary', minValue: 2200, maxValue: 2800 },
    { name: 'Neptune\'s Trident', rarity: 'Mythic', minValue: 3500, maxValue: 4500 },
  ],
  4: [ // Psychic Master
    { name: 'Mind Shard', rarity: 'Rare', minValue: 800, maxValue: 1200 },
    { name: 'Teleport Stone', rarity: 'Rare', minValue: 900, maxValue: 1300 },
    { name: 'Psychic Orb', rarity: 'Epic', minValue: 1600, maxValue: 2200 },
    { name: 'Third Eye Crystal', rarity: 'Legendary', minValue: 2800, maxValue: 3500 },
    { name: 'Cosmic Brain', rarity: 'Mythic', minValue: 4500, maxValue: 6000 },
  ],
  5: [ // Dragon Elite
    { name: 'Dragon Scale', rarity: 'Epic', minValue: 2500, maxValue: 3500 },
    { name: 'Wyrm Claw', rarity: 'Epic', minValue: 3000, maxValue: 4000 },
    { name: 'Dragon Fang', rarity: 'Legendary', minValue: 5000, maxValue: 6500 },
    { name: 'Elder Dragon Egg', rarity: 'Legendary', minValue: 6000, maxValue: 8000 },
    { name: 'Dragon Soul Stone', rarity: 'Mythic', minValue: 10000, maxValue: 15000 },
  ],
  6: [ // Grass Bundle
    { name: 'Leaf Stone', rarity: 'Common', minValue: 100, maxValue: 200 },
    { name: 'Miracle Seed', rarity: 'Rare', minValue: 250, maxValue: 400 },
    { name: 'Nature Crystal', rarity: 'Epic', minValue: 500, maxValue: 750 },
    { name: 'Forest Crown', rarity: 'Legendary', minValue: 900, maxValue: 1300 },
  ],
  7: [ // Ice Collection
    { name: 'Ice Shard', rarity: 'Common', minValue: 300, maxValue: 450 },
    { name: 'Frost Crystal', rarity: 'Rare', minValue: 600, maxValue: 900 },
    { name: 'Glacier Stone', rarity: 'Epic', minValue: 1100, maxValue: 1500 },
    { name: 'Eternal Ice', rarity: 'Legendary', minValue: 1800, maxValue: 2400 },
  ],
  8: [ // Fighting Spirit
    { name: 'Power Band', rarity: 'Rare', minValue: 500, maxValue: 800 },
    { name: 'Fighting Gloves', rarity: 'Rare', minValue: 700, maxValue: 1000 },
    { name: 'Champion Belt', rarity: 'Epic', minValue: 1500, maxValue: 2000 },
    { name: 'Warrior\'s Spirit', rarity: 'Legendary', minValue: 2500, maxValue: 3500 },
  ],
};

// Rarity probabilities (in percentages)
const rarityWeights = {
  Common: 50,
  Rare: 30,
  Epic: 15,
  Legendary: 4,
  Mythic: 1,
};

// Generate a random item from a case
export function generateRandomItem(caseId: number): Item {
  const itemPool = caseItemPools[caseId];
  if (!itemPool || itemPool.length === 0) {
    // Fallback item
    return {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Mystery Item',
      rarity: 'Common',
      value: 100,
      obtainedAt: new Date().toISOString(),
      caseId,
    };
  }

  // Calculate total weight
  const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
  
  // Get random number
  let random = Math.random() * totalWeight;
  
  // Determine rarity based on weights
  let selectedRarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' = 'Common';
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    random -= weight;
    if (random <= 0) {
      selectedRarity = rarity as any;
      break;
    }
  }

  // Filter items by rarity
  const itemsOfRarity = itemPool.filter(item => item.rarity === selectedRarity);
  
  // If no items of that rarity, fall back to any item
  const availableItems = itemsOfRarity.length > 0 ? itemsOfRarity : itemPool;
  
  // Select random item from filtered pool
  const template = availableItems[Math.floor(Math.random() * availableItems.length)];
  
  // Generate random value within range
  const value = Math.floor(Math.random() * (template.maxValue - template.minValue + 1)) + template.minValue;

  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    rarity: template.rarity,
    value,
    obtainedAt: new Date().toISOString(),
    caseId,
  };
}

// Get rarity color
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'Mythic':
      return 'from-yellow-500 to-orange-500';
    case 'Legendary':
      return 'from-purple-500 to-pink-500';
    case 'Epic':
      return 'from-blue-500 to-cyan-500';
    case 'Rare':
      return 'from-red-500 to-rose-500';
    case 'Common':
      return 'from-gray-400 to-gray-500';
    default:
      return 'from-gray-400 to-gray-500';
  }
}

// Get rarity glow color
export function getRarityGlow(rarity: string): string {
  switch (rarity) {
    case 'Mythic':
      return 'shadow-[0_0_30px_rgba(234,179,8,0.6)]';
    case 'Legendary':
      return 'shadow-[0_0_30px_rgba(168,85,247,0.6)]';
    case 'Epic':
      return 'shadow-[0_0_30px_rgba(59,130,246,0.6)]';
    case 'Rare':
      return 'shadow-[0_0_30px_rgba(239,68,68,0.6)]';
    default:
      return '';
  }
}
