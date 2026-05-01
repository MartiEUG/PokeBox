import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import {
  Check, X, Sparkles, Shuffle, ArrowUpRight, Zap,
  TrendingUp, Shield, Flame, Droplets, Wind, Cpu,
  ChevronRight, Target, AlertTriangle
} from 'lucide-react';

// ─── Target Card Pool ─────────────────────────────────────────────────────────

interface TargetCard {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  value: number;
}

const TARGET_POOL: TargetCard[] = [
  // Common
  { id: 'tc_01', name: 'Thunder Stone',      rarity: 'Common',    value: 80    },
  { id: 'tc_02', name: 'Volt Badge',          rarity: 'Common',    value: 110   },
  { id: 'tc_03', name: 'Leaf Stone',          rarity: 'Common',    value: 160   },
  { id: 'tc_04', name: 'Water Drop',          rarity: 'Common',    value: 210   },
  // Rare
  { id: 'tc_05', name: 'Electric Crystal',   rarity: 'Rare',      value: 280   },
  { id: 'tc_06', name: 'Miracle Seed',        rarity: 'Rare',      value: 380   },
  { id: 'tc_07', name: 'Fire Stone',          rarity: 'Rare',      value: 480   },
  { id: 'tc_08', name: 'Ocean Pearl',         rarity: 'Rare',      value: 700   },
  { id: 'tc_09', name: 'Mind Shard',          rarity: 'Rare',      value: 950   },
  // Epic
  { id: 'tc_10', name: 'Lightning Shard',    rarity: 'Epic',      value: 1200  },
  { id: 'tc_11', name: 'Inferno Crystal',    rarity: 'Epic',      value: 1600  },
  { id: 'tc_12', name: 'Psychic Orb',        rarity: 'Epic',      value: 2000  },
  { id: 'tc_13', name: 'Tidal Wave Charm',   rarity: 'Epic',      value: 2600  },
  { id: 'tc_14', name: 'Dragon Scale',       rarity: 'Epic',      value: 3200  },
  // Legendary
  { id: 'tc_15', name: 'Phoenix Feather',    rarity: 'Legendary', value: 4200  },
  { id: 'tc_16', name: 'Deep Sea Crystal',   rarity: 'Legendary', value: 5500  },
  { id: 'tc_17', name: 'Dragon Fang',        rarity: 'Legendary', value: 7000  },
  { id: 'tc_18', name: 'Third Eye Crystal',  rarity: 'Legendary', value: 8500  },
  { id: 'tc_19', name: 'Elder Dragon Egg',   rarity: 'Legendary', value: 10000 },
  // Mythic
  { id: 'tc_20', name: 'Eternal Flame',      rarity: 'Mythic',    value: 13000 },
  { id: 'tc_21', name: 'Cosmic Brain',       rarity: 'Mythic',    value: 17000 },
  { id: 'tc_22', name: 'Neptune\'s Trident', rarity: 'Mythic',    value: 22000 },
  { id: 'tc_23', name: 'Dragon Soul Stone',  rarity: 'Mythic',    value: 30000 },
];

// ─── Core Probability Formula ─────────────────────────────────────────────────
// Dynamic: based entirely on ratio = targetValue / inputValue
// ratio=1.5x → ~65%   ratio=2x → ~52%   ratio=5x → ~24%   ratio=10x → ~14%
function calcSuccessRate(inputValue: number, targetValue: number): number {
  if (!inputValue || !targetValue || inputValue <= 0 || targetValue <= 0) return 0;
  const ratio = targetValue / inputValue;
  const raw = 90 * Math.pow(1 / ratio, 0.8);
  return Math.round(Math.min(97, Math.max(1, raw)) * 1000) / 1000;
}

// ─── Risk label based on probability ─────────────────────────────────────────
function getRiskLabel(rate: number): { label: string; color: string } {
  if (rate >= 70) return { label: 'Riesgo Bajo',     color: '#4ade80' };
  if (rate >= 50) return { label: 'Riesgo Medio',    color: '#a3e635' };
  if (rate >= 35) return { label: 'Riesgo Alto',     color: '#facc15' };
  if (rate >= 20) return { label: 'Riesgo Extremo',  color: '#fb923c' };
  return               { label: 'Riesgo Legendario', color: '#f87171' };
}

// ─── Dial arc color ───────────────────────────────────────────────────────────
function getDialColor(rate: number): string {
  if (rate >= 70) return '#4ade80';
  if (rate >= 50) return '#a3e635';
  if (rate >= 35) return '#facc15';
  if (rate >= 20) return '#fb923c';
  return '#f87171';
}

// ─── Rarity visual metadata ───────────────────────────────────────────────────
function getRarityMeta(rarity: string) {
  switch (rarity) {
    case 'Mythic':    return { g: 'from-yellow-400 via-orange-300 to-amber-500', glow: 'rgba(251,191,36,0.6)',   tc: '#fbbf24', icon: '✺', border: 'rgba(251,191,36,0.4)'  };
    case 'Legendary': return { g: 'from-purple-500 via-fuchsia-400 to-pink-400', glow: 'rgba(168,85,247,0.6)',  tc: '#c084fc', icon: '❋', border: 'rgba(168,85,247,0.4)'  };
    case 'Epic':      return { g: 'from-blue-500 via-cyan-400 to-sky-400',       glow: 'rgba(56,189,248,0.6)',  tc: '#38bdf8', icon: '◈', border: 'rgba(56,189,248,0.4)'  };
    case 'Rare':      return { g: 'from-rose-500 via-red-400 to-pink-400',       glow: 'rgba(251,113,133,0.6)', tc: '#fb7185', icon: '✦', border: 'rgba(251,113,133,0.4)' };
    default:          return { g: 'from-slate-400 to-slate-500',                 glow: 'rgba(148,163,184,0.3)', tc: '#94a3b8', icon: '⬡', border: 'rgba(148,163,184,0.2)' };
  }
}

// ─── Card type icon ───────────────────────────────────────────────────────────
function getCardTypeIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('thunder') || n.includes('electric') || n.includes('volt') || n.includes('lightning') || n.includes('plasma'))
    return <Zap className="w-8 h-8" />;
  if (n.includes('fire') || n.includes('flame') || n.includes('inferno') || n.includes('phoenix') || n.includes('ember'))
    return <Flame className="w-8 h-8" />;
  if (n.includes('water') || n.includes('ocean') || n.includes('tidal') || n.includes('sea') || n.includes('neptune'))
    return <Droplets className="w-8 h-8" />;
  if (n.includes('leaf') || n.includes('nature') || n.includes('forest') || n.includes('miracle') || n.includes('seed'))
    return <Wind className="w-8 h-8" />;
  if (n.includes('psychic') || n.includes('mind') || n.includes('brain') || n.includes('cosmic') || n.includes('crystal'))
    return <Cpu className="w-8 h-8" />;
  if (n.includes('dragon') || n.includes('wyrm') || n.includes('elder') || n.includes('soul'))
    return <Shield className="w-8 h-8" />;
  return <TrendingUp className="w-8 h-8" />;
}

// ─── Probability Dial (SVG) ───────────────────────────────────────────────────
function ProbabilityDial({
  rate, isUpgrading, inputValue, targetValue
}: { rate: number; isUpgrading: boolean; inputValue: number; targetValue: number }) {
  const R    = 82;
  const circ = 2 * Math.PI * R;
  const dash = circ * (rate / 100);
  const col  = getDialColor(rate);
  const risk = getRiskLabel(rate);
  const ratio = targetValue > 0 && inputValue > 0 ? (targetValue / inputValue) : 0;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Risk badge above dial */}
      <AnimatePresence mode="wait">
        {rate > 0 && (
          <motion.div key={risk.label}
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-3 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest"
            style={{ background: `${risk.color}18`, border: `1px solid ${risk.color}50`, color: risk.color }}>
            ◉ {risk.label.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ width: 260, height: 260, position: 'relative' }}>
        <svg width="260" height="260" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="arcG2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={col} />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
            <filter id="gF">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="cg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0d1535" />
              <stop offset="100%" stopColor="#070b1a" />
            </radialGradient>
          </defs>

          {/* Tick ring */}
          {Array.from({ length: 80 }).map((_, i) => {
            const angle = ((i / 80) * 360 - 90) * (Math.PI / 180);
            const rI = i % 5 === 0 ? 91 : 94;
            const inRange = rate > 0 && i < (rate / 100) * 80;
            return (
              <line key={i}
                x1={100 + rI * Math.cos(angle)} y1={100 + rI * Math.sin(angle)}
                x2={100 + 99 * Math.cos(angle)} y2={100 + 99 * Math.sin(angle)}
                stroke={inRange ? col : '#1a2545'}
                strokeWidth={i % 5 === 0 ? 2.5 : 1.2}
                opacity={inRange ? 0.95 : 0.35}
              />
            );
          })}

          {/* Track */}
          <circle cx="100" cy="100" r={R} fill="none" stroke="#0c1228" strokeWidth="14" />

          {/* Progress arc */}
          <motion.circle cx="100" cy="100" r={R}
            fill="none" stroke="url(#arcG2)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 100 100)"
            filter="url(#gF)"
            animate={{ strokeDasharray: `${dash} ${circ}` }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />

          {/* Spinning rings when upgrading */}
          {isUpgrading && (
            <motion.circle cx="100" cy="100" r="68"
              fill="none" stroke="#00d4ff" strokeWidth="1.5"
              strokeDasharray="14 9" strokeLinecap="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '100px 100px' }}
              filter="url(#gF)"
            />
          )}
          {isUpgrading && (
            <motion.circle cx="100" cy="100" r="58"
              fill="none" stroke="#a855f7" strokeWidth="1"
              strokeDasharray="8 14" strokeLinecap="round"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '100px 100px' }}
              filter="url(#gF)"
            />
          )}

          {/* Center bg */}
          <circle cx="100" cy="100" r="56" fill="url(#cg)" />
          <circle cx="100" cy="100" r="54" fill="none" stroke="#1a2545" strokeWidth="1" />

          {/* Main % */}
          {rate > 0 ? (
            <>
              <text x="100" y="88" textAnchor="middle" fill="white" fontSize="24" fontWeight="700"
                fontFamily="'Courier New', monospace" filter={isUpgrading ? 'url(#gF)' : undefined}>
                {rate.toFixed(3)}%
              </text>
              <text x="100" y="104" textAnchor="middle" fill="#4b5a7a" fontSize="6.5" letterSpacing="2.5"
                fontFamily="sans-serif">PROBABILIDAD</text>
              <text x="100" y="115" textAnchor="middle" fill="#4b5a7a" fontSize="6.5" letterSpacing="2.5"
                fontFamily="sans-serif">DE MEJORA</text>
            </>
          ) : (
            <>
              <text x="100" y="97" textAnchor="middle" fill="#2a3558" fontSize="13"
                fontFamily="'Courier New', monospace">SELECCIONA</text>
              <text x="100" y="112" textAnchor="middle" fill="#2a3558" fontSize="13"
                fontFamily="'Courier New', monospace">CARTAS</text>
            </>
          )}

          {/* Cardinal dots */}
          {rate > 0 && [0, 90, 180, 270].map((deg) => {
            const rad = (deg - 90) * Math.PI / 180;
            return (
              <circle key={deg}
                cx={100 + 103 * Math.cos(rad)} cy={100 + 103 * Math.sin(rad)}
                r="2.5" fill={col} filter="url(#gF)" opacity="0.9"
              />
            );
          })}
        </svg>
      </div>

      {/* Ratio display below */}
      {ratio > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mt-1 text-xs">
          <span className="text-gray-600">${inputValue.toLocaleString()}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
          <span style={{ color: col }}>${targetValue.toLocaleString()}</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: `${col}15`, color: col, border: `1px solid ${col}35` }}>
            ×{ratio.toFixed(2)}
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ─── Inventory Card (left panel) ──────────────────────────────────────────────
function InventoryCard({ item, isSelected, onClick }: { item: any; isSelected: boolean; onClick: () => void }) {
  const meta = getRarityMeta(item.rarity);
  return (
    <motion.div onClick={onClick}
      whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
      className="relative cursor-pointer rounded-xl overflow-hidden"
      style={{
        background: isSelected ? 'rgba(0,212,255,0.07)' : 'rgba(13,18,40,0.97)',
        border: `1.5px solid ${isSelected ? 'rgba(0,212,255,0.65)' : meta.border}`,
        boxShadow: isSelected ? `0 0 22px rgba(0,212,255,0.22), 0 0 8px ${meta.glow}` : `0 0 6px ${meta.glow}25`,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
      <div className={`relative h-24 bg-gradient-to-br ${meta.g}`}>
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(7,11,26,0.62)' }}>
          <span style={{ color: meta.tc }} className="opacity-80">{getCardTypeIcon(item.name)}</span>
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(130deg, transparent 35%, rgba(255,255,255,0.1) 52%, transparent 68%)' }} />
        {/* Rarity pips */}
        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
          {Array.from({ length: item.rarity === 'Mythic' ? 5 : item.rarity === 'Legendary' ? 4 : item.rarity === 'Epic' ? 3 : item.rarity === 'Rare' ? 2 : 1 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full" style={{ background: meta.tc }} />
          ))}
        </div>
        <AnimatePresence>
          {isSelected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#00d4ff', boxShadow: '0 0 10px rgba(0,212,255,0.7)' }}>
              <Check className="w-3 h-3 text-black" strokeWidth={3.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="px-2 py-1.5">
        <p className="text-white truncate" style={{ fontSize: '0.65rem' }}>{item.name}</p>
        <div className="flex items-center justify-between mt-0.5">
          <span style={{ color: meta.tc, fontSize: '0.6rem' }}>{meta.icon} {item.rarity}</span>
          <span className="text-yellow-400" style={{ fontSize: '0.65rem' }}>${item.value.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Target Card Row (right panel selector) ───────────────────────────────────
function TargetCardRow({
  card, inputValue, isSelected, onClick
}: { card: TargetCard; inputValue: number; isSelected: boolean; onClick: () => void }) {
  const meta = getRarityMeta(card.rarity);
  const rate = calcSuccessRate(inputValue, card.value);
  const col  = getDialColor(rate);
  const ratio = inputValue > 0 ? card.value / inputValue : 0;

  return (
    <motion.button onClick={onClick}
      whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
      style={{
        background: isSelected ? `${meta.glow}18` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isSelected ? meta.border : 'rgba(255,255,255,0.05)'}`,
        boxShadow: isSelected ? `0 0 16px ${meta.glow}40` : 'none',
      }}>
      {/* Icon */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${meta.g}`}
        style={{ opacity: 0.85 }}>
        <span style={{ color: '#fff', fontSize: 18 }}>{meta.icon}</span>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-white text-xs font-medium truncate">{card.name}</span>
          <span className="text-xs flex-shrink-0" style={{ color: meta.tc }}>{card.rarity[0]}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-yellow-400" style={{ fontSize: '0.65rem' }}>${card.value.toLocaleString()}</span>
          {ratio > 0 && (
            <span style={{ fontSize: '0.6rem', color: '#4b5a7a' }}>×{ratio.toFixed(1)}</span>
          )}
        </div>
      </div>
      {/* Probability pill */}
      <div className="flex-shrink-0 text-right">
        {inputValue > 0 ? (
          <div className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: `${col}18`, color: col, border: `1px solid ${col}40`, minWidth: 48 }}>
            {rate.toFixed(1)}%
          </div>
        ) : (
          <div className="text-gray-700 text-xs">--</div>
        )}
      </div>
      {isSelected && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: meta.tc }} />}
    </motion.button>
  );
}

// ─── Selected Target Card Preview ─────────────────────────────────────────────
function TargetCardPreview({ card, rate, isUpgrading }: { card: TargetCard | null; rate: number; isUpgrading: boolean }) {
  if (!card) {
    return (
      <div className="rounded-2xl flex flex-col items-center justify-center text-center py-10 px-6"
        style={{ background: 'rgba(13,18,40,0.6)', border: '1.5px dashed rgba(255,255,255,0.07)', minHeight: 200 }}>
        <Target className="w-8 h-8 text-gray-700 mb-3" />
        <p className="text-gray-600 text-xs leading-relaxed">Selecciona una carta objetivo de la lista</p>
      </div>
    );
  }
  const meta = getRarityMeta(card.rarity);
  const col  = getDialColor(rate);
  return (
    <motion.div className="rounded-2xl overflow-hidden"
      animate={isUpgrading
        ? { boxShadow: [`0 0 20px ${meta.glow}`, `0 0 50px ${meta.glow}`, `0 0 20px ${meta.glow}`] }
        : { boxShadow: `0 0 18px ${meta.glow}50` }}
      transition={{ duration: 1.2, repeat: isUpgrading ? Infinity : 0 }}
      style={{ border: `1.5px solid ${meta.border}` }}>
      <div className={`relative bg-gradient-to-br ${meta.g}`} style={{ height: 160 }}>
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(7,11,26,0.55)' }}>
          {isUpgrading
            ? <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-12 h-12 text-white opacity-90" />
              </motion.div>
            : <span style={{ fontSize: 48, color: meta.tc, opacity: 0.85 }}>{meta.icon}</span>
          }
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)' }} />
        {/* Rarity badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(0,0,0,0.55)', color: meta.tc, border: `1px solid ${meta.border}` }}>
          {card.rarity}
        </div>
        {/* Prob pill */}
        {rate > 0 && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: `${col}25`, color: col, border: `1px solid ${col}50` }}>
            {rate.toFixed(3)}%
          </div>
        )}
      </div>
      <div className="p-4" style={{ background: 'rgba(7,11,26,0.97)' }}>
        <div className="text-white font-semibold text-sm mb-0.5">{card.name}</div>
        <div className="text-2xl font-bold" style={{ color: '#ffd700', textShadow: `0 0 20px rgba(255,215,0,0.4)` }}>
          ${card.value.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Dynamic Probability Insight ─────────────────────────────────────────────
function ProbabilityInsight({ inputValue, targetValue, rate }: { inputValue: number; targetValue: number; rate: number }) {
  if (!inputValue || !targetValue) return null;
  const ratio = targetValue / inputValue;
  const col = getDialColor(rate);
  const risk = getRiskLabel(rate);

  const barSegments = [
    { label: 'Alta',     min: 70, max: 100, color: '#4ade80' },
    { label: 'Media',    min: 50, max: 70,  color: '#a3e635' },
    { label: 'Alta',     min: 35, max: 50,  color: '#facc15' },
    { label: 'Extrema',  min: 20, max: 35,  color: '#fb923c' },
    { label: 'Legendario', min: 0, max: 20, color: '#f87171' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 space-y-3"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" /> Análisis de mejora
        </span>
        <span className="font-bold" style={{ color: col }}>{risk.label}</span>
      </div>

      {/* Risk bar */}
      <div className="relative h-2 rounded-full overflow-hidden flex">
        {barSegments.reverse().map((seg, i) => (
          <div key={i} className="h-full" style={{ flex: seg.max - seg.min, background: seg.color, opacity: 0.25 }} />
        ))}
        {/* Indicator */}
        <motion.div className="absolute top-0 bottom-0 w-0.5 rounded-full"
          style={{ background: col, boxShadow: `0 0 6px ${col}`, left: `${Math.min(99, Math.max(1, 100 - rate))}%` }}
          animate={{ left: `${Math.min(99, Math.max(1, 100 - rate))}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-700">
        <span>100% ← Alta</span>
        <span>Baja → 0%</span>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="rounded-lg p-2.5 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-gray-600 text-xs mb-1">Invertido</div>
          <div className="text-white text-xs font-semibold">${inputValue.toLocaleString()}</div>
        </div>
        <div className="rounded-lg p-2.5 text-center"
          style={{ background: `${col}10`, border: `1px solid ${col}25` }}>
          <div className="text-gray-600 text-xs mb-1">Ratio</div>
          <div className="text-xs font-bold" style={{ color: col }}>×{ratio.toFixed(2)}</div>
        </div>
        <div className="rounded-lg p-2.5 text-center"
          style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.18)' }}>
          <div className="text-gray-600 text-xs mb-1">Objetivo</div>
          <div className="text-yellow-400 text-xs font-semibold">${targetValue.toLocaleString()}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Result Modal ─────────────────────────────────────────────────────────────
function ResultModal({ result, onClose }: { result: { success: boolean; item?: any } | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)' }}
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.72, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.72, y: 40 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300 }}
            className="relative rounded-2xl max-w-sm w-full overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0d1535, #070b1a)',
              border: `2px solid ${result.success ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.5)'}`,
            }}
            onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 15%, ${result.success ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)'}, transparent 70%)` }} />
            <button onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-8 text-center relative">
              <motion.div
                initial={{ scale: 0, rotate: result.success ? -180 : 0 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
                style={{
                  background: result.success ? 'linear-gradient(135deg, #4ade80, #22d3ee)' : 'linear-gradient(135deg, #f87171, #ec4899)',
                  boxShadow: result.success ? '0 0 40px rgba(74,222,128,0.5)' : '0 0 40px rgba(248,113,113,0.5)',
                }}>
                {result.success ? <Check className="w-10 h-10 text-black" strokeWidth={3} /> : <X className="w-10 h-10 text-white" strokeWidth={2.5} />}
              </motion.div>

              {result.success ? (
                <>
                  <h2 className="text-white text-2xl font-bold mb-1">¡Upgrade Exitoso!</h2>
                  <p className="text-gray-400 text-sm mb-5">Has obtenido la carta objetivo</p>
                  {result.item && (() => {
                    const meta = getRarityMeta(result.item.rarity);
                    return (
                      <div className="rounded-xl p-5 mb-6"
                        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${meta.border}` }}>
                        <div className="text-3xl mb-2" style={{ color: meta.tc }}>{meta.icon}</div>
                        <div className="text-white font-semibold mb-1">{result.item.name}</div>
                        <div className="text-xs mb-3" style={{ color: meta.tc }}>{result.item.rarity}</div>
                        <div className="text-2xl font-bold"
                          style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
                          ${result.item.value.toLocaleString()}
                        </div>
                      </div>
                    );
                  })()}
                  <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-black"
                    style={{ background: 'linear-gradient(135deg, #4ade80, #22d3ee)', boxShadow: '0 0 20px rgba(74,222,128,0.3)' }}>
                    ¡Continuar!
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-white text-2xl font-bold mb-1">Upgrade Fallido</h2>
                  <p className="text-gray-400 text-sm mb-6">Las cartas se han perdido. El riesgo forma parte del juego.</p>
                  <button onClick={onClose} className="w-full py-3 rounded-xl font-semibold text-gray-300"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Cerrar
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Upgrade Component ───────────────────────────────────────────────────
export function Upgrade() {
  const { user, inventory, removeItems, addItem, refreshInventory } = useAuth();
  const [selectedItems, setSelectedItems]     = useState<string[]>([]);
  const [selectedTarget, setSelectedTarget]   = useState<TargetCard | null>(null);
  const [isUpgrading, setIsUpgrading]         = useState(false);
  const [upgradeResult, setUpgradeResult]     = useState<{ success: boolean; item?: any } | null>(null);

  // ── Derived ──
  const selectedCards = useMemo(() =>
    inventory.filter(i => selectedItems.includes(i.id)), [inventory, selectedItems]);
  const totalValue = useMemo(() =>
    selectedCards.reduce((s, i) => s + i.value, 0), [selectedCards]);
  const successRate = useMemo(() =>
    calcSuccessRate(totalValue, selectedTarget?.value ?? 0), [totalValue, selectedTarget]);
  const canUpgrade = selectedItems.length > 0 && selectedTarget !== null && totalValue > 0;

  // ── Sort targets by value for easier browsing ──
  const sortedTargets = useMemo(() => [...TARGET_POOL].sort((a, b) => a.value - b.value), []);

  // ── Handlers ──
  const toggleItem = (id: string) =>
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectRandom = () => {
    const shuffled = [...inventory].sort(() => Math.random() - 0.5);
    const count = Math.max(1, Math.floor(Math.random() * Math.min(5, inventory.length)) + 1);
    setSelectedItems(shuffled.slice(0, count).map(i => i.id));
  };

  const handleUpgrade = async () => {
    if (!user || !canUpgrade || !selectedTarget) return;
    setIsUpgrading(true);

    setTimeout(async () => {
      const roll    = Math.random() * 100;
      const success = roll < successRate;

      if (success) {
        const newItem = {
          name:   selectedTarget.name,
          rarity: selectedTarget.rarity,
          value:  selectedTarget.value,
          caseId: 0,
        };
        await removeItems(selectedItems);
        await addItem(newItem);
        await refreshInventory();
        setUpgradeResult({ success: true, item: { ...newItem, id: 'temp', obtainedAt: new Date().toISOString() } });
        toast.success('¡Upgrade exitoso! 🎉');
      } else {
        await removeItems(selectedItems);
        await refreshInventory();
        setUpgradeResult({ success: false });
        toast.error('Upgrade fallido. Las cartas se han perdido.');
      }
      setSelectedItems([]);
      setIsUpgrading(false);
    }, 2400);
  };

  // ── Render ──
  return (
    <div className="min-h-screen py-16" style={{ background: 'var(--dark-bg)' }}>

      {/* ── Header ── */}
      <div className="container mx-auto px-4 lg:px-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff', letterSpacing: 3 }}>
            <Zap className="w-3.5 h-3.5" /> SISTEMA DE UPGRADE
          </div>
          <h1 className="text-white mb-3"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: -1 }}>
            Upgrade de{' '}
            <span style={{ background: 'linear-gradient(135deg, #ffd700, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Cartas
            </span>
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
            La probabilidad de éxito depende del valor que inviertes vs. el valor de la carta que quieres obtener.
            A mayor mejora deseada, mayor riesgo.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 lg:px-6">

        {/* ── 3-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 mb-8 items-start">

          {/* ─── LEFT — Inventory ─── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(10,14,38,0.97)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Header */}
              <div className="px-5 py-4" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold text-sm">Cartas a Mejorar</div>
                    <div className="text-gray-600 text-xs mt-0.5">Selecciona las cartas que sacrificarás</div>
                  </div>
                  {selectedItems.length > 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
                      {selectedItems.length} selec.
                    </motion.div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedItems(inventory.map(i => i.id))}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                    Seleccionar todo
                  </button>
                  <button onClick={selectRandom}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                    <Shuffle className="w-3 h-3" /> Aleatorio
                  </button>
                  {selectedItems.length > 0 && (
                    <button onClick={() => setSelectedItems([])}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid */}
              <div className="p-4" style={{ maxHeight: 440, overflowY: 'auto' }}>
                {inventory.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4 opacity-15">◈</div>
                    <p className="text-gray-600 text-sm">No tienes cartas en tu inventario</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {inventory.map(item => (
                      <InventoryCard key={item.id} item={item}
                        isSelected={selectedItems.includes(item.id)}
                        onClick={() => toggleItem(item.id)} />
                    ))}
                  </div>
                )}
              </div>

              {/* Value bar */}
              {selectedItems.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ background: 'rgba(0,212,255,0.06)', borderTop: '1px solid rgba(0,212,255,0.15)' }}>
                  <span className="text-gray-400 text-xs">{selectedItems.length} cartas · Valor total</span>
                  <span className="text-yellow-400 font-bold">${totalValue.toLocaleString()}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ─── CENTER — Dial + CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-5 lg:w-[280px]">

            {/* Dial panel */}
            <div className="rounded-2xl p-5 w-full flex flex-col items-center"
              style={{ background: 'rgba(10,14,38,0.97)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <ProbabilityDial
                rate={successRate}
                isUpgrading={isUpgrading}
                inputValue={totalValue}
                targetValue={selectedTarget?.value ?? 0}
              />
            </div>

            {/* Insight */}
            {canUpgrade && (
              <div className="w-full">
                <ProbabilityInsight
                  inputValue={totalValue}
                  targetValue={selectedTarget?.value ?? 0}
                  rate={successRate}
                />
              </div>
            )}

            {/* CTA Button */}
            <motion.button
              disabled={!canUpgrade || isUpgrading}
              onClick={handleUpgrade}
              whileHover={canUpgrade && !isUpgrading ? { scale: 1.03, y: -2 } : {}}
              whileTap={canUpgrade && !isUpgrading ? { scale: 0.97 } : {}}
              className="relative w-full py-4 rounded-2xl font-bold text-base overflow-hidden"
              style={{
                background: canUpgrade && !isUpgrading
                  ? 'linear-gradient(135deg, #ffd700 0%, #f59e0b 35%, #00d4ff 70%, #0ea5e9 100%)'
                  : 'rgba(255,255,255,0.04)',
                color: canUpgrade && !isUpgrading ? '#000' : '#3a4460',
                boxShadow: canUpgrade && !isUpgrading
                  ? '0 0 32px rgba(255,215,0,0.38), 0 0 64px rgba(0,212,255,0.18)'
                  : 'none',
                border: canUpgrade && !isUpgrading ? 'none' : '1px solid rgba(255,255,255,0.06)',
                cursor: canUpgrade && !isUpgrading ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
              }}>
              {/* Shimmer */}
              {canUpgrade && !isUpgrading && (
                <motion.div className="absolute inset-0 pointer-events-none"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)', width: '50%' }}
                />
              )}
              <span className="relative flex items-center justify-center gap-2">
                {isUpgrading
                  ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}>
                      <Sparkles className="w-5 h-5" />
                    </motion.div> Upgradeando...</>
                  : <><ArrowUpRight className="w-5 h-5" /> ↑ Upgrade de Cartas</>
                }
              </span>
            </motion.button>

            {/* Warning */}
            {canUpgrade && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-start gap-2 px-4 py-2.5 rounded-xl w-full"
                style={{ background: 'rgba(251,146,60,0.07)', border: '1px solid rgba(251,146,60,0.2)' }}>
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-orange-400 text-xs leading-relaxed">
                  Si fallas, perderás las {selectedItems.length} carta{selectedItems.length !== 1 ? 's' : ''} seleccionada{selectedItems.length !== 1 ? 's' : ''}.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* ─── RIGHT — Target Card ─── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(10,14,38,0.97)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-5 py-4" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-white font-semibold text-sm">Carta Objetivo</div>
                <div className="text-gray-600 text-xs mt-0.5">
                  {totalValue > 0
                    ? 'La probabilidad cambia según la carta que elijas'
                    : 'Selecciona cartas para ver la probabilidad'}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Preview of selected target */}
                <TargetCardPreview card={selectedTarget} rate={successRate} isUpgrading={isUpgrading} />

                {/* Scrollable target list */}
                <div>
                  <div className="text-gray-600 text-xs mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Elige la carta que deseas obtener
                    {totalValue > 0 && <span className="text-gray-700">· prob. en tiempo real</span>}
                  </div>
                  <div className="space-y-1.5" style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {sortedTargets.map(card => (
                      <TargetCardRow
                        key={card.id}
                        card={card}
                        inputValue={totalValue}
                        isSelected={selectedTarget?.id === card.id}
                        onClick={() => setSelectedTarget(card)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── How it works ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {[
              { icon: '◈', title: '1. Invierte cartas',   desc: 'Selecciona cartas de tu inventario. El valor total es tu inversión.',             color: '#00d4ff' },
              { icon: '❋', title: '2. Elige objetivo',    desc: 'Selecciona la carta que quieres obtener. La probabilidad se calcula al instante.', color: '#c084fc' },
              { icon: '⚡', title: '3. Probabilidad real', desc: 'Cuanto mayor sea la mejora deseada, mayor el riesgo y menor la probabilidad.',     color: '#ffd700' },
              { icon: '✺', title: '4. Resultado',         desc: 'Éxito: ganas la carta objetivo. Fallo: pierdes las cartas invertidas.',            color: '#fb923c' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: 'rgba(10,14,38,0.97)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-2xl mb-2" style={{ color: s.color }}>{s.icon}</div>
                <div className="text-white font-semibold text-xs mb-1">{s.title}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Formula note */}
          <div className="rounded-xl px-5 py-3 flex items-center gap-4"
            style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <Zap className="w-4 h-4 text-cyan-500 flex-shrink-0" />
            <div className="text-xs text-gray-500">
              <span className="text-cyan-400 font-medium">Fórmula de probabilidad: </span>
              La probabilidad se calcula como{' '}
              <code className="text-gray-300 bg-white/5 px-1.5 py-0.5 rounded text-xs">P = 90% × (valorInvertido / valorObjetivo)^0.8</code>
              {' '}— No depende de la rareza, sino únicamente de la diferencia de valor entre lo que inviertes y lo que deseas obtener.
            </div>
          </div>
        </motion.div>
      </div>

      <ResultModal result={upgradeResult} onClose={() => setUpgradeResult(null)} />
    </div>
  );
}
