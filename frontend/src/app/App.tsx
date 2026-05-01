import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './components/home/Home';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './components/dashboard/Dashboard';
import { Cases } from './components/cases/Cases';
import { CaseDetail } from './components/cases/CaseDetail';
import { Battles } from './components/battles/Battles';
import { Upgrade } from './components/upgrade/Upgrade';
import { Rewards } from './components/rewards/Rewards';
import { Support } from './components/support/Support';
import { BoxCovers } from './components/boxes/BoxCovers';
import { Inventory } from './components/inventory/Inventory';
import { Trade } from './components/trade/Trade';
import { Delivery } from './components/delivery/Delivery';
import { Toaster } from './components/ui/sonner';
import { SupabaseStatus } from './components/debug/SupabaseStatus';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[var(--dark-bg)] text-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/battles" element={<Battles />} />
              <Route path="/upgrade" element={<Upgrade />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/support" element={<Support />} />
              <Route path="/box-covers" element={<BoxCovers />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" theme="dark" />
          <SupabaseStatus />
        </div>
      </Router>
    </AuthProvider>
  );
}