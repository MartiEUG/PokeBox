import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Item } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  ArrowLeftRight,
  Package,
  Search,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Filter,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react';
import { getRarityColor, getRarityGlow, caseItemPools } from '../../utils/caseItems';
import { toast } from 'sonner@2.0.3';

// Build the global trade catalog from all case item pools
interface CatalogItem {
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  value: number;
  caseId: number;
  catalogId: string;
}

function buildTradeCatalog(): CatalogItem[] {
  const catalog: CatalogItem[] = [];
  let idCounter = 0;
  for (const [caseId, pool] of Object.entries(caseItemPools)) {
    for (const template of pool) {
      // Create a few variants per item template
      const midValue = Math.floor((template.minValue + template.maxValue) / 2);
      const lowValue = Math.floor(template.minValue * 1.05);
      const highValue = Math.floor(template.maxValue * 0.95);
      catalog.push(
        { name: template.name, rarity: template.rarity, value: midValue, caseId: Number(caseId), catalogId: `cat_${idCounter++}` },
        { name: template.name, rarity: template.rarity, value: lowValue, caseId: Number(caseId), catalogId: `cat_${idCounter++}` },
        { name: template.name, rarity: template.rarity, value: highValue, caseId: Number(caseId), catalogId: `cat_${idCounter++}` },
      );
    }
  }
  return catalog;
}

const FULL_CATALOG = buildTradeCatalog();

const rarityEmoji: Record<string, string> = {
  Common: '⚪',
  Rare: '🔵',
  Epic: '🟣',
  Legendary: '🟡',
  Mythic: '🔴',
};

const rarityOrder: Record<string, number> = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3,
  Mythic: 4,
};

function ValueDiffBadge({ offered, received }: { offered: number; received: number }) {
  const diff = received - offered;
  if (Math.abs(diff) < 1) {
    return (
      <span className="flex items-center gap-1 text-gray-400 text-xs">
        <Minus className="w-3 h-3" /> Equal Value
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="flex items-center gap-1 text-green-400 text-xs">
        <TrendingDown className="w-3 h-3" /> ${Math.abs(diff).toFixed(0)} below your item
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-red-400 text-xs">
      <TrendingUp className="w-3 h-3" /> +${diff.toFixed(0)} over limit
    </span>
  );
}

type TradeStep = 'select-offer' | 'select-receive' | 'confirm' | 'success';

export function Trade() {
  const { isAuthenticated, getInventory, tradeItem } = useAuth();
  const [inventory, setInventory] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<TradeStep>('select-offer');
  const [offeredItem, setOfferedItem] = useState<Item | null>(null);
  const [receivedItem, setReceivedItem] = useState<CatalogItem | null>(null);
  const [trading, setTrading] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState('all');
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [sortBy, setSortBy] = useState<'value-desc' | 'value-asc' | 'rarity'>('value-desc');

  useEffect(() => {
    loadInventory();
  }, [isAuthenticated]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const items = await getInventory();
      setInventory(items);
    } finally {
      setLoading(false);
    }
  };

  // Filtered inventory for offer selection
  const filteredInventory = useMemo(() => {
    let items = inventory;
    if (inventoryFilter !== 'all') items = items.filter(i => i.rarity === inventoryFilter);
    if (inventorySearch) items = items.filter(i => i.name.toLowerCase().includes(inventorySearch.toLowerCase()));
    return [...items].sort((a, b) => {
      if (sortBy === 'value-asc') return a.value - b.value;
      if (sortBy === 'value-desc') return b.value - a.value;
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });
  }, [inventory, inventoryFilter, inventorySearch, sortBy]);

  // Filtered catalog for receive selection — only items with value ≤ offered item
  const filteredCatalog = useMemo(() => {
    if (!offeredItem) return [];
    let items = FULL_CATALOG.filter(i => i.value <= offeredItem.value);
    if (catalogFilter !== 'all') items = items.filter(i => i.rarity === catalogFilter);
    if (catalogSearch) items = items.filter(i => i.name.toLowerCase().includes(catalogSearch.toLowerCase()));
    // Deduplicate by name+value+rarity and shuffle for variety
    const seen = new Set<string>();
    const deduped = items.filter(i => {
      const key = `${i.name}_${i.value}_${i.rarity}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return deduped.sort((a, b) => b.value - a.value);
  }, [offeredItem, catalogFilter, catalogSearch]);

  const handleSelectOffer = (item: Item) => {
    setOfferedItem(item);
    setReceivedItem(null);
    setStep('select-receive');
    setCatalogFilter('all');
    setCatalogSearch('');
  };

  const handleSelectReceive = (item: CatalogItem) => {
    setReceivedItem(item);
    setStep('confirm');
  };

  const handleTrade = async () => {
    if (!offeredItem || !receivedItem) return;
    setTrading(true);
    try {
      await tradeItem(offeredItem.id, {
        name: receivedItem.name,
        rarity: receivedItem.rarity,
        value: receivedItem.value,
        caseId: receivedItem.caseId,
      });
      setStep('success');
      toast.success(`¡Intercambio completado! Obtuviste ${receivedItem.name}`);
      await loadInventory();
    } catch {
      toast.error('Error al realizar el intercambio. Inténtalo de nuevo.');
    } finally {
      setTrading(false);
    }
  };

  const handleReset = () => {
    setOfferedItem(null);
    setReceivedItem(null);
    setStep('select-offer');
    setInventoryFilter('all');
    setInventorySearch('');
  };

  const rarityFilters = ['all', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center py-12">
            <ArrowLeftRight className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="mb-4">Inicia sesión para intercambiar</h2>
            <p className="text-gray-400 mb-6">Necesitas una cuenta para usar el sistema de intercambio.</p>
            <Button variant="primary" onClick={() => (window.location.href = '/login')}>
              Iniciar Sesión
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-[var(--neon-yellow)]/20 to-[var(--neon-blue)]/20 rounded-lg border border-[var(--neon-yellow)]/30">
              <ArrowLeftRight className="w-6 h-6 text-[var(--neon-yellow)]" />
            </div>
            <h1 className="bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
              Centro de Intercambio
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Intercambia tus cartas por otras de igual o menor valor del catálogo global.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-2">
            {[
              { id: 'select-offer', label: '1. Elige tu carta', icon: Package },
              { id: 'select-receive', label: '2. Elige la nueva', icon: Sparkles },
              { id: 'confirm', label: '3. Confirmar', icon: CheckCircle },
            ].map((s, idx) => {
              const stepOrder = ['select-offer', 'select-receive', 'confirm', 'success'];
              const current = stepOrder.indexOf(step);
              const thisStep = stepOrder.indexOf(s.id);
              const isDone = current > thisStep;
              const isActive = current === thisStep;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] text-black'
                        : isDone
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-[var(--dark-card)] text-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">{s.label}</span>
                  </div>
                  {idx < 2 && <div className="w-6 h-px bg-gray-700" />}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* SUCCESS */}
        <AnimatePresence mode="wait">
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-8xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="mb-4 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] bg-clip-text text-transparent">
                ¡Intercambio exitoso!
              </h2>
              <p className="text-gray-400 mb-2">Has intercambiado:</p>
              <div className="flex items-center gap-4 mb-8">
                <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                  {offeredItem?.name}
                </div>
                <ArrowLeftRight className="w-6 h-6 text-[var(--neon-yellow)]" />
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
                  {receivedItem?.name}
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="primary" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Nuevo Intercambio
                </Button>
                <Button variant="secondary" onClick={() => (window.location.href = '/inventory')}>
                  Ver Inventario
                </Button>
              </div>
            </motion.div>
          )}

          {/* CONFIRM */}
          {step === 'confirm' && offeredItem && receivedItem && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <h2 className="mb-6 text-center">Confirmar Intercambio</h2>
                <div className="grid grid-cols-5 gap-4 items-center mb-8">
                  {/* Offered */}
                  <div className="col-span-2">
                    <div className="text-xs text-gray-400 text-center mb-2">Entregas</div>
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${getRarityColor(offeredItem.rarity)} bg-opacity-20 border border-red-500/30 text-center ${getRarityGlow(offeredItem.rarity)}`}
                    >
                      <div className="text-4xl mb-2">{rarityEmoji[offeredItem.rarity]}</div>
                      <div className="text-sm text-white mb-1">{offeredItem.name}</div>
                      <div className="text-xs text-gray-300 mb-1">{offeredItem.rarity}</div>
                      <div className="text-[var(--neon-yellow)]">${offeredItem.value.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="col-span-1 flex flex-col items-center gap-2">
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                      <ArrowLeftRight className="w-8 h-8 text-[var(--neon-yellow)]" />
                    </motion.div>
                    <ValueDiffBadge offered={offeredItem.value} received={receivedItem.value} />
                  </div>

                  {/* Received */}
                  <div className="col-span-2">
                    <div className="text-xs text-gray-400 text-center mb-2">Recibes</div>
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${getRarityColor(receivedItem.rarity)} bg-opacity-20 border border-green-500/30 text-center ${getRarityGlow(receivedItem.rarity)}`}
                    >
                      <div className="text-4xl mb-2">{rarityEmoji[receivedItem.rarity]}</div>
                      <div className="text-sm text-white mb-1">{receivedItem.name}</div>
                      <div className="text-xs text-gray-300 mb-1">{receivedItem.rarity}</div>
                      <div className="text-[var(--neon-yellow)]">${receivedItem.value.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Value note */}
                <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">
                    Solo puedes intercambiar por cartas de <strong>igual o menor valor</strong>. Una vez confirmado, el intercambio no se puede deshacer.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setStep('select-receive')}>
                    Atrás
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleTrade}
                    disabled={trading}
                  >
                    {trading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Confirmar Intercambio
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 1: Select offer */}
          {step === 'select-offer' && (
            <motion.div key="select-offer" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                  <h2 className="text-lg">Selecciona la carta que quieres ofrecer</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Package className="w-4 h-4" />
                    <span>{inventory.length} cartas en inventario</span>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar carta..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[var(--dark-hover)] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-blue)]"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {rarityFilters.map((r) => (
                      <button
                        key={r}
                        onClick={() => setInventoryFilter(r)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          inventoryFilter === r
                            ? 'bg-[var(--neon-yellow)] text-black'
                            : 'bg-[var(--dark-hover)] text-gray-400 hover:text-white'
                        }`}
                      >
                        {r === 'all' ? 'Todos' : r}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none pl-3 pr-8 py-2 bg-[var(--dark-hover)] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--neon-blue)] cursor-pointer"
                    >
                      <option value="value-desc">Mayor valor</option>
                      <option value="value-asc">Menor valor</option>
                      <option value="rarity">Por rareza</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </Card>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-[var(--neon-yellow)] border-t-transparent rounded-full mx-auto" />
                  <p className="text-gray-400 mt-4">Cargando inventario...</p>
                </div>
              ) : filteredInventory.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="mb-2">No hay cartas disponibles</h3>
                    <p className="text-gray-400 mb-6">
                      {inventorySearch || inventoryFilter !== 'all'
                        ? 'No se encontraron cartas con ese filtro.'
                        : '¡Abre algunas cajas para obtener cartas!'}
                    </p>
                    <Button variant="primary" onClick={() => (window.location.href = '/cases')}>
                      Abrir Cajas
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredInventory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <div
                        onClick={() => handleSelectOffer(item)}
                        className={`relative cursor-pointer rounded-xl border transition-all duration-200 overflow-hidden
                          ${offeredItem?.id === item.id
                            ? 'border-[var(--neon-yellow)] shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                            : 'border-gray-700 hover:border-gray-500'
                          } bg-[var(--dark-card)] p-4`}
                      >
                        {/* Rarity badge */}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${getRarityColor(item.rarity)} text-white mb-3`}
                        >
                          {item.rarity}
                        </span>

                        {/* Visual */}
                        <div
                          className={`w-full aspect-square rounded-lg bg-gradient-to-br ${getRarityColor(item.rarity)} flex items-center justify-center mb-3 ${getRarityGlow(item.rarity)}`}
                        >
                          <span className="text-4xl">{rarityEmoji[item.rarity]}</span>
                        </div>

                        <div className="text-sm text-white mb-1 truncate">{item.name}</div>
                        <div className="text-[var(--neon-yellow)] text-sm">${item.value.toLocaleString()}</div>

                        {/* Select overlay */}
                        {offeredItem?.id === item.id && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-[var(--neon-yellow)]" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Select what to receive */}
          {step === 'select-receive' && offeredItem && (
            <motion.div key="select-receive" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {/* Offered item summary */}
              <div className="mb-6 p-4 bg-[var(--dark-card)] border border-[var(--neon-yellow)]/30 rounded-xl flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${getRarityColor(offeredItem.rarity)} flex items-center justify-center shrink-0 ${getRarityGlow(offeredItem.rarity)}`}
                >
                  <span className="text-2xl">{rarityEmoji[offeredItem.rarity]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-400">Ofreces:</div>
                  <div className="text-white truncate">{offeredItem.name}</div>
                  <div className="text-[var(--neon-yellow)] text-sm">${offeredItem.value.toLocaleString()} · {offeredItem.rarity}</div>
                </div>
                <Button variant="ghost" onClick={() => setStep('select-offer')} className="text-sm shrink-0">
                  Cambiar
                </Button>
              </div>

              {/* Catalog filters */}
              <Card className="mb-6">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg">Cartas disponibles para recibir</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Solo se muestran cartas con valor ≤ ${offeredItem.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
                    <Filter className="w-4 h-4" />
                    {filteredCatalog.length} disponibles
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar carta del catálogo..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[var(--dark-hover)] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-blue)]"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {rarityFilters.map((r) => (
                      <button
                        key={r}
                        onClick={() => setCatalogFilter(r)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          catalogFilter === r
                            ? 'bg-[var(--neon-blue)] text-black'
                            : 'bg-[var(--dark-hover)] text-gray-400 hover:text-white'
                        }`}
                      >
                        {r === 'all' ? 'Todos' : r}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {filteredCatalog.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="mb-2">Sin cartas disponibles</h3>
                    <p className="text-gray-400">
                      No hay cartas con ese filtro que puedas obtener a cambio.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredCatalog.map((item, index) => {
                    const isSelected = receivedItem?.catalogId === item.catalogId;
                    const diff = item.value - offeredItem.value;
                    return (
                      <motion.div
                        key={item.catalogId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div
                          onClick={() => handleSelectReceive(item)}
                          className={`relative cursor-pointer rounded-xl border transition-all duration-200 overflow-hidden
                            ${isSelected
                              ? 'border-[var(--neon-blue)] shadow-[0_0_20px_rgba(0,212,255,0.4)]'
                              : 'border-gray-700 hover:border-gray-500'
                            } bg-[var(--dark-card)] p-4`}
                        >
                          {/* Value diff tag */}
                          <div className="absolute top-2 right-2">
                            {Math.abs(diff) < 1 ? (
                              <span className="text-xs bg-gray-500/40 text-gray-300 px-1.5 py-0.5 rounded">≈</span>
                            ) : (
                              <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                                -{Math.abs(diff).toFixed(0)}
                              </span>
                            )}
                          </div>

                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${getRarityColor(item.rarity)} text-white mb-3`}
                          >
                            {item.rarity}
                          </span>

                          <div
                            className={`w-full aspect-square rounded-lg bg-gradient-to-br ${getRarityColor(item.rarity)} flex items-center justify-center mb-3 ${getRarityGlow(item.rarity)}`}
                          >
                            <span className="text-4xl">{rarityEmoji[item.rarity]}</span>
                          </div>

                          <div className="text-sm text-white mb-1 truncate">{item.name}</div>
                          <div className="text-[var(--neon-yellow)] text-sm">${item.value.toLocaleString()}</div>

                          {isSelected && (
                            <div className="mt-2">
                              <Button
                                variant="primary"
                                className="w-full text-xs py-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStep('confirm');
                                }}
                              >
                                Continuar →
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
