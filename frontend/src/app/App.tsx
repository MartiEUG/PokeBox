import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './components/home/Home';
import { Cases } from './components/cases/Cases';
import { CaseDetail } from './components/cases/CaseDetail';
import { Trade } from './components/trade/Trade';
import { Delivery } from './components/delivery/Delivery';
import { Battles } from './components/battles/Battles';
import { Rewards } from './components/rewards/Rewards';
import { Upgrade } from './components/upgrade/Upgrade';
import { Support } from './components/support/Support';
import { Dashboard } from './components/dashboard/Dashboard';
import { Inventory } from './components/inventory/Inventory';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { SupabaseStatus } from './components/debug/SupabaseStatus';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--dark-bg)] text-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:id" element={<CaseDetail />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/battles" element={<Battles />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/support" element={<Support />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </main>
        <Footer />
        <SupabaseStatus />
      </div>
    </Router>
  );
}