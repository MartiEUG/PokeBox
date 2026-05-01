import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import logo from 'figma:asset/6e863f4494a0b578dad3289d366d63fdcde5ae2f.png';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[var(--dark-card)] border-t border-gray-800 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo} 
                alt="PokeBox Logo" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-gray-400">
              The ultimate gaming loot-box platform. Open cases, battle friends, and collect rare items.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-gray-400 hover:text-[var(--neon-blue)] transition-colors">Support</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-[var(--neon-blue)] transition-colors">FAQ</Link></li>
              <li><Link to="/legal" className="text-gray-400 hover:text-[var(--neon-blue)] transition-colors">Legal</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-[var(--neon-blue)] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-[var(--neon-blue)] transition-colors">How It Works</Link></li>
              <li><Link to="/provably-fair" className="text-gray-400 hover:text-[var(--neon-blue)] transition-colors">Provably Fair</Link></li>
              <li><Link to="/responsible-gaming" className="text-gray-400 hover:text-[var(--neon-blue)] transition-colors">Responsible Gaming</Link></li>
              <li><Link to="/affiliate" className="text-gray-400 hover:text-[var(--neon-blue)] transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="mb-4 text-white">Connect With Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-[var(--dark-hover)] rounded-lg flex items-center justify-center hover:bg-[var(--neon-blue)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[var(--dark-hover)] rounded-lg flex items-center justify-center hover:bg-[var(--neon-blue)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[var(--dark-hover)] rounded-lg flex items-center justify-center hover:bg-[var(--neon-blue)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[var(--dark-hover)] rounded-lg flex items-center justify-center hover:bg-[var(--neon-blue)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[var(--dark-hover)] rounded-lg flex items-center justify-center hover:bg-[var(--neon-blue)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} PokeBox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}