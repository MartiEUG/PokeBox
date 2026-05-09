import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Item } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getRarityColor, getRarityGlow } from '../../utils/caseItems';
import { toast } from 'sonner';
import {
  Truck, Home, Package, CheckCircle, Clock, MapPin,
  Phone, Mail, User, Search, ChevronDown, Star,
  ArrowRight, RefreshCw, Box, ShieldCheck, Globe,
  Sparkles, History, PlusCircle, Info,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface DeliveryOrder {
  id: string;
  userId: string;
  cards: Item[];
  address: ShippingAddress;
  status: 'processing' | 'preparing' | 'shipped' | 'delivered';
  trackingNumber: string;
  orderNumber: string;
  createdAt: string;
  estimatedDelivery: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rarityEmoji: Record<string, string> = {
  Common: '⚪', Rare: '🔵', Epic: '🟣', Legendary: '🟡', Mythic: '🔴',
};

const COUNTRIES = [
  'España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela',
  'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay', 'Costa Rica', 'Guatemala',
  'Estados Unidos', 'Reino Unido', 'Francia', 'Alemania', 'Italia', 'Otro',
];

function generateOrderNumber() {
  return `PB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

function generateTracking() {
  return `PKB${Math.random().toString(36).substr(2, 12).toUpperCase()}ES`;
}

function estimatedDate() {
  const d = new Date();
  d.setDate(d.getDate() + 10 + Math.floor(Math.random() * 5));
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getStatusInfo(status: DeliveryOrder['status']) {
  switch (status) {
    case 'processing':
      return { label: 'Procesando', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', icon: Clock };
    case 'preparing':
      return { label: 'Preparando', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', icon: Box };
    case 'shipped':
      return { label: 'Enviado', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30', icon: Truck };
    case 'delivered':
      return { label: 'Entregado', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', icon: CheckCircle };
  }
}

function loadOrders(userId: string): DeliveryOrder[] {
  const all: DeliveryOrder[] = JSON.parse(localStorage.getItem('pokebox_delivery_orders') || '[]');
  return all.filter(o => o.userId === userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function saveOrder(order: DeliveryOrder) {
  const all: DeliveryOrder[] = JSON.parse(localStorage.getItem('pokebox_delivery_orders') || '[]');
  all.push(order);
  localStorage.setItem('pokebox_delivery_orders', JSON.stringify(all));
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function Field({
  label, icon: Icon, type = 'text', value, onChange, placeholder, required = false, error,
}: {
  label: string; icon: any; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean; error?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">
        {label} {required && <span className="text-[var(--neon-yellow)]">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-9 pr-4 py-2.5 bg-[var(--dark-hover)] border rounded-lg text-white placeholder-gray-600
            focus:outline-none transition-colors ${error
              ? 'border-red-500 focus:border-red-400'
              : 'border-gray-700 focus:border-[var(--neon-blue)]'}`}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

type DeliveryStep = 'select-cards' | 'shipping-info' | 'review' | 'success';

const MAX_CARDS = 5;

export function Delivery() {
  const { user, isAuthenticated, getInventory } = useAuth();

  const [activeTab, setActiveTab] = useState<'new' | 'orders'>('new');
  const [inventory, setInventory] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<DeliveryStep>('select-cards');
  const [selectedCards, setSelectedCards] = useState<Item[]>([]);
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [lastOrder, setLastOrder] = useState<DeliveryOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');

  // Address form
  const [form, setForm] = useState<ShippingAddress>({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'España',
  });
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await getInventory();
      setInventory(items);
      if (user) setOrders(loadOrders(user.id));
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = useMemo(() => {
    let items = inventory;
    if (rarityFilter !== 'all') items = items.filter(i => i.rarity === rarityFilter);
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return items;
  }, [inventory, rarityFilter, search]);

  const toggleCard = (item: Item) => {
    setSelectedCards(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.filter(c => c.id !== item.id);
      if (prev.length >= MAX_CARDS) {
        toast.error(`Máximo ${MAX_CARDS} cartas por pedido`);
        return prev;
      }
      return [...prev, item];
    });
  };

  const updateForm = (field: keyof ShippingAddress) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Nombre requerido';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email válido requerido';
    if (!form.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!form.address1.trim()) newErrors.address1 = 'Dirección requerida';
    if (!form.city.trim()) newErrors.city = 'Ciudad requerida';
    if (!form.state.trim()) newErrors.state = 'Provincia/Estado requerido';
    if (!form.postalCode.trim()) newErrors.postalCode = 'Código postal requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!user) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500)); // simulate processing
    const order: DeliveryOrder = {
      id: `order_${Date.now()}`,
      userId: user.id,
      cards: selectedCards,
      address: form,
      status: 'processing',
      trackingNumber: generateTracking(),
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      estimatedDelivery: estimatedDate(),
    };
    saveOrder(order);
    setLastOrder(order);
    setOrders(prev => [order, ...prev]);
    setStep('success');
    setSubmitting(false);
    toast.success('¡Pedido creado! Recibirás tus cartas pronto.');
  };

  const handleNewOrder = () => {
    setStep('select-cards');
    setSelectedCards([]);
    setLastOrder(null);
    setErrors({});
  };

  const rarityFilters = ['all', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center py-12">
            <Truck className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="mb-4">Inicia sesión para solicitar envíos</h2>
            <p className="text-gray-400 mb-6">Necesitas una cuenta para solicitar el envío de tus cartas a domicilio.</p>
            <Button variant="primary" onClick={() => window.location.href = '/login'}>Iniciar Sesión</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-[var(--neon-blue)]/20 to-purple-500/20 rounded-lg border border-[var(--neon-blue)]/30">
              <Truck className="w-6 h-6 text-[var(--neon-blue)]" />
            </div>
            <h1 className="bg-gradient-to-r from-[var(--neon-blue)] to-purple-400 bg-clip-text text-transparent">
              Envío a Domicilio
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Recibe tus cartas digitales impresas y enviadas directamente a tu hogar.
          </p>
        </motion.div>

        {/* ── Info Banner ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="p-4 bg-[var(--dark-card)] border border-[var(--neon-blue)]/20 rounded-xl flex flex-wrap gap-6 items-center">
            {[
              { icon: ShieldCheck, label: 'Impresión premium', desc: 'Cartas de alta calidad' },
              { icon: Truck, label: 'Envío seguro', desc: 'Embalaje protegido' },
              { icon: Globe, label: 'Envío internacional', desc: 'A más de 30 países' },
              { icon: Clock, label: '10-15 días hábiles', desc: 'Tiempo estimado' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-[var(--neon-blue)]" />
                <div>
                  <div className="text-sm text-white">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-8">
          <div className="flex gap-2 p-1 bg-[var(--dark-card)] border border-gray-800 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-sm ${
                activeTab === 'new'
                  ? 'bg-gradient-to-r from-[var(--neon-blue)] to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Nueva Solicitud
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-sm ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[var(--neon-blue)] to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" /> Mis Pedidos
              {orders.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] rounded text-xs">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* ════════════════════════ ORDER HISTORY TAB ═══════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div key="orders-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {orders.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <Box className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="mb-2">Sin pedidos todavía</h3>
                    <p className="text-gray-400 mb-6">Crea tu primera solicitud de envío desde la pestaña "Nueva Solicitud".</p>
                    <Button variant="secondary" onClick={() => setActiveTab('new')}>
                      Crear Pedido
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, idx) => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card>
                          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            {/* Order info */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="text-white">{order.orderNumber}</span>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${statusInfo.bg} ${statusInfo.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {statusInfo.label}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {new Date(order.createdAt).toLocaleDateString('es-ES')}
                                </span>
                              </div>

                              {/* Cards preview */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {order.cards.map(card => (
                                  <div
                                    key={card.id}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${getRarityColor(card.rarity)} bg-opacity-10 border border-gray-700`}
                                  >
                                    <span className="text-sm">{rarityEmoji[card.rarity]}</span>
                                    <span className="text-xs text-white">{card.name}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Address */}
                              <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{order.address.address1}, {order.address.city}, {order.address.country}</span>
                              </div>
                            </div>

                            {/* Tracking */}
                            <div className="flex flex-col gap-2 md:items-end shrink-0">
                              <div className="text-xs text-gray-500">Tracking</div>
                              <div className="font-mono text-sm text-[var(--neon-blue)] bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/20 px-3 py-1.5 rounded-lg">
                                {order.trackingNumber}
                              </div>
                              <div className="text-xs text-gray-500">
                                Entrega est.: {order.estimatedDelivery}
                              </div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-4 pt-4 border-t border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                              {(['processing', 'preparing', 'shipped', 'delivered'] as const).map((s, i) => {
                                const si = getStatusInfo(s);
                                const SI = si.icon;
                                const steps = ['processing', 'preparing', 'shipped', 'delivered'];
                                const currentIdx = steps.indexOf(order.status);
                                const done = i <= currentIdx;
                                return (
                                  <div key={s} className="flex items-center flex-1">
                                    <div className={`flex flex-col items-center gap-1 ${done ? si.color : 'text-gray-700'}`}>
                                      <SI className="w-4 h-4" />
                                      <span className="text-xs hidden sm:block">{si.label}</span>
                                    </div>
                                    {i < 3 && (
                                      <div className={`flex-1 h-0.5 mx-2 ${i < currentIdx ? 'bg-[var(--neon-blue)]' : 'bg-gray-800'}`} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ════════════════════════ NEW ORDER TAB ═══════════════════════════ */}
          {activeTab === 'new' && (
            <motion.div key="new-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

              {/* Step indicator */}
              {step !== 'success' && (
                <div className="flex items-center gap-2 mb-8">
                  {[
                    { id: 'select-cards', label: '1. Seleccionar cartas', icon: Sparkles },
                    { id: 'shipping-info', label: '2. Dirección de envío', icon: MapPin },
                    { id: 'review', label: '3. Confirmar pedido', icon: CheckCircle },
                  ].map((s, idx) => {
                    const stepOrder = ['select-cards', 'shipping-info', 'review', 'success'];
                    const current = stepOrder.indexOf(step);
                    const thisStep = stepOrder.indexOf(s.id);
                    const isDone = current > thisStep;
                    const isActive = current === thisStep;
                    const Icon = s.icon;
                    return (
                      <div key={s.id} className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[var(--neon-blue)] to-purple-500 text-white'
                            : isDone
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-[var(--dark-card)] text-gray-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">{s.label}</span>
                        </div>
                        {idx < 2 && <div className="w-6 h-px bg-gray-700" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ─── STEP 1: Select Cards ─────────────────────────────────── */}
              <AnimatePresence mode="wait">
                {step === 'select-cards' && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Card className="mb-6">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                        <div>
                          <h2 className="text-lg mb-1">Elige las cartas a recibir</h2>
                          <p className="text-sm text-gray-400">Máximo {MAX_CARDS} cartas por pedido</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg border text-sm ${
                          selectedCards.length === MAX_CARDS
                            ? 'bg-[var(--neon-yellow)]/10 border-[var(--neon-yellow)]/30 text-[var(--neon-yellow)]'
                            : 'bg-[var(--dark-hover)] border-gray-700 text-gray-400'
                        }`}>
                          {selectedCards.length} / {MAX_CARDS} seleccionadas
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar carta..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-[var(--dark-hover)] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--neon-blue)]"
                          />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {rarityFilters.map(r => (
                            <button
                              key={r}
                              onClick={() => setRarityFilter(r)}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                rarityFilter === r
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

                    {/* Selected cards summary */}
                    {selectedCards.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <div className="p-4 bg-[var(--neon-blue)]/5 border border-[var(--neon-blue)]/20 rounded-xl">
                          <div className="text-sm text-gray-400 mb-3">Cartas seleccionadas:</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedCards.map(card => (
                              <button
                                key={card.id}
                                onClick={() => toggleCard(card)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${getRarityColor(card.rarity)} bg-opacity-20 border border-[var(--neon-blue)]/30 text-white text-xs hover:opacity-70 transition-opacity`}
                              >
                                {rarityEmoji[card.rarity]} {card.name} ×
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {loading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-[var(--neon-blue)] border-t-transparent rounded-full mx-auto" />
                        <p className="text-gray-400 mt-4">Cargando inventario...</p>
                      </div>
                    ) : filteredInventory.length === 0 ? (
                      <Card>
                        <div className="text-center py-12">
                          <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                          <h3 className="mb-2">No hay cartas disponibles</h3>
                          <p className="text-gray-400 mb-6">Abre algunas cajas para obtener cartas.</p>
                          <Button variant="primary" onClick={() => window.location.href = '/cases'}>Abrir Cajas</Button>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                        {filteredInventory.map((item, index) => {
                          const isSelected = selectedCards.some(c => c.id === item.id);
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              whileHover={{ scale: 1.03 }}
                            >
                              <div
                                onClick={() => toggleCard(item)}
                                className={`relative cursor-pointer rounded-xl border transition-all duration-200 bg-[var(--dark-card)] p-3 ${
                                  isSelected
                                    ? 'border-[var(--neon-blue)] shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                                    : 'border-gray-700 hover:border-gray-500'
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-2 right-2 z-10">
                                    <div className="w-5 h-5 bg-[var(--neon-blue)] rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-3.5 h-3.5 text-black" />
                                    </div>
                                  </div>
                                )}
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${getRarityColor(item.rarity)} text-white mb-2`}>
                                  {item.rarity}
                                </span>
                                <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${getRarityColor(item.rarity)} flex items-center justify-center mb-2 ${getRarityGlow(item.rarity)}`}>
                                  <span className="text-3xl">{rarityEmoji[item.rarity]}</span>
                                </div>
                                <div className="text-xs text-white truncate">{item.name}</div>
                                <div className="text-xs text-[var(--neon-yellow)]">${item.value.toLocaleString()}</div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        onClick={() => setStep('shipping-info')}
                        disabled={selectedCards.length === 0}
                        className={selectedCards.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        Continuar con dirección <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ─── STEP 2: Shipping Info ───────────────────────────────── */}
                {step === 'shipping-info' && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Form */}
                      <div className="lg:col-span-2">
                        <Card>
                          <h2 className="text-lg mb-6">Datos de envío</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                              <Field label="Nombre completo" icon={User} value={form.fullName}
                                onChange={updateForm('fullName')} placeholder="Tu nombre" required error={errors.fullName} />
                            </div>
                            <Field label="Email" icon={Mail} type="email" value={form.email}
                              onChange={updateForm('email')} placeholder="tu@email.com" required error={errors.email} />
                            <Field label="Teléfono" icon={Phone} type="tel" value={form.phone}
                              onChange={updateForm('phone')} placeholder="+34 600 000 000" required error={errors.phone} />
                            <div className="sm:col-span-2">
                              <Field label="Dirección" icon={MapPin} value={form.address1}
                                onChange={updateForm('address1')} placeholder="Calle, número, piso..." required error={errors.address1} />
                            </div>
                            <div className="sm:col-span-2">
                              <Field label="Complemento (opcional)" icon={Home} value={form.address2}
                                onChange={updateForm('address2')} placeholder="Apartamento, edificio..." />
                            </div>
                            <Field label="Ciudad" icon={MapPin} value={form.city}
                              onChange={updateForm('city')} placeholder="Ciudad" required error={errors.city} />
                            <Field label="Provincia / Estado" icon={MapPin} value={form.state}
                              onChange={updateForm('state')} placeholder="Provincia" required error={errors.state} />
                            <Field label="Código postal" icon={MapPin} value={form.postalCode}
                              onChange={updateForm('postalCode')} placeholder="28001" required error={errors.postalCode} />
                            <div>
                              <label className="block text-sm text-gray-400 mb-1.5">
                                País <span className="text-[var(--neon-yellow)]">*</span>
                              </label>
                              <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <select
                                  value={form.country}
                                  onChange={e => updateForm('country')(e.target.value)}
                                  className="w-full pl-9 pr-8 py-2.5 bg-[var(--dark-hover)] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[var(--neon-blue)] appearance-none cursor-pointer"
                                >
                                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* Disclaimer */}
                          <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                            <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-300">
                              Tus datos de envío se usan únicamente para gestionar este pedido y no se comparten con terceros. Las cartas físicas son réplicas impresas de tus cartas digitales.
                            </p>
                          </div>
                        </Card>
                      </div>

                      {/* Sidebar: order summary */}
                      <div className="space-y-4">
                        <Card>
                          <h3 className="text-sm text-gray-400 mb-3">Resumen del pedido</h3>
                          <div className="space-y-2 mb-4">
                            {selectedCards.map(card => (
                              <div key={card.id} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getRarityColor(card.rarity)} flex items-center justify-center shrink-0`}>
                                  <span className="text-sm">{rarityEmoji[card.rarity]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-white truncate">{card.name}</div>
                                  <div className="text-xs text-gray-500">{card.rarity}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="pt-3 border-t border-gray-800 flex justify-between text-sm">
                            <span className="text-gray-400">Cartas</span>
                            <span className="text-white">{selectedCards.length}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-400">Envío</span>
                            <span className="text-green-400">Incluido</span>
                          </div>
                          <div className="flex justify-between mt-2 pt-2 border-t border-gray-800">
                            <span className="text-gray-400">Total</span>
                            <span className="text-[var(--neon-yellow)]">Gratis</span>
                          </div>
                        </Card>

                        <div className="flex flex-col gap-3">
                          <Button variant="secondary" onClick={() => setStep('select-cards')}>
                            ← Atrás
                          </Button>
                          <Button variant="primary" onClick={() => {
                            if (validateForm()) setStep('review');
                          }}>
                            Revisar pedido <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── STEP 3: Review & Confirm ────────────────────────────── */}
                {step === 'review' && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="max-w-2xl mx-auto space-y-6">
                      {/* Cards */}
                      <Card>
                        <h3 className="mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[var(--neon-blue)]" /> Cartas seleccionadas
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {selectedCards.map(card => (
                            <div key={card.id} className={`p-3 rounded-xl bg-gradient-to-br ${getRarityColor(card.rarity)} bg-opacity-10 border border-gray-700 flex items-center gap-3`}>
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRarityColor(card.rarity)} flex items-center justify-center shrink-0 ${getRarityGlow(card.rarity)}`}>
                                <span className="text-xl">{rarityEmoji[card.rarity]}</span>
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs text-white truncate">{card.name}</div>
                                <div className="text-xs text-gray-400">{card.rarity}</div>
                                <div className="text-xs text-[var(--neon-yellow)]">${card.value.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Address */}
                      <Card>
                        <h3 className="mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[var(--neon-blue)]" /> Dirección de envío
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-white">{form.fullName}</p>
                          <p className="text-gray-400">{form.address1}</p>
                          {form.address2 && <p className="text-gray-400">{form.address2}</p>}
                          <p className="text-gray-400">{form.postalCode} – {form.city}, {form.state}</p>
                          <p className="text-gray-400">{form.country}</p>
                          <p className="text-gray-400 mt-2">{form.email} · {form.phone}</p>
                        </div>
                        <button
                          onClick={() => setStep('shipping-info')}
                          className="mt-4 text-xs text-[var(--neon-blue)] hover:underline"
                        >
                          Editar dirección
                        </button>
                      </Card>

                      {/* Delivery estimate */}
                      <Card>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[var(--neon-blue)]/10 rounded-lg">
                            <Truck className="w-6 h-6 text-[var(--neon-blue)]" />
                          </div>
                          <div>
                            <div className="text-white">Envío estándar</div>
                            <div className="text-gray-400 text-sm">Tiempo estimado: 10–15 días hábiles</div>
                            <div className="text-green-400 text-sm">Gratuito</div>
                          </div>
                        </div>
                      </Card>

                      <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setStep('shipping-info')}>
                          ← Atrás
                        </Button>
                        <Button variant="primary" className="flex-1" onClick={handleSubmitOrder} disabled={submitting}>
                          {submitting ? (
                            <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</>
                          ) : (
                            <><CheckCircle className="w-4 h-4" /> Confirmar Pedido</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── SUCCESS ─────────────────────────────────────────────── */}
                {step === 'success' && lastOrder && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg mx-auto text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                      className="text-7xl mb-6"
                    >
                      📦
                    </motion.div>
                    <h2 className="mb-2 bg-gradient-to-r from-[var(--neon-blue)] to-purple-400 bg-clip-text text-transparent">
                      ¡Pedido confirmado!
                    </h2>
                    <p className="text-gray-400 mb-8">
                      Tus cartas serán impresas y enviadas a tu domicilio en los próximos días.
                    </p>

                    <Card className="text-left mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1">Número de pedido</div>
                          <div className="text-white">{lastOrder.orderNumber}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Estado</div>
                          <div className="text-yellow-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Procesando
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Tracking</div>
                          <div className="font-mono text-[var(--neon-blue)] text-xs">{lastOrder.trackingNumber}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Entrega estimada</div>
                          <div className="text-white">{lastOrder.estimatedDelivery}</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">Dirección</div>
                        <div className="text-white text-sm">{lastOrder.address.fullName}</div>
                        <div className="text-gray-400 text-sm">{lastOrder.address.address1}, {lastOrder.address.city}</div>
                      </div>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="primary" onClick={handleNewOrder}>
                        <PlusCircle className="w-4 h-4" /> Nuevo Pedido
                      </Button>
                      <Button variant="secondary" onClick={() => { setActiveTab('orders'); handleNewOrder(); }}>
                        <History className="w-4 h-4" /> Ver Mis Pedidos
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
