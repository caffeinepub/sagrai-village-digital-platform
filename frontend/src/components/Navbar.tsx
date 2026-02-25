import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X, Settings } from 'lucide-react';
import { useAuth } from './AuthProvider';
import LoginButton from './LoginButton';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/culture', label: 'Culture' },
  { to: '/agriculture', label: 'Agriculture' },
  { to: '/crops', label: '🌾 Crops' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/notices', label: 'Notices' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string) => {
    if (to === '/') return currentPath === '/';
    return currentPath.startsWith(to);
  };

  const isAdminActive = currentPath.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ background: 'oklch(0.28 0.10 145)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
              <img src="/assets/generated/village-logo.dim_256x256.png" alt="Sagrai" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-display font-bold text-lg leading-tight">Sagrai</p>
              <p className="text-white/70 text-xs leading-tight">Firozabad, UP</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive(link.to)
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Panel link — only for admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`ml-1 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-150 ${
                  isAdminActive
                    ? 'bg-amber-400/30 text-amber-200 ring-1 ring-amber-300/50'
                    : 'bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 hover:text-amber-100'
                }`}
              >
                <Settings size={15} />
                Control Panel
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LoginButton />
            </div>
            <button
              className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/20" style={{ background: 'oklch(0.24 0.09 145)' }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Panel link in mobile menu */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isAdminActive
                    ? 'bg-amber-400/30 text-amber-200'
                    : 'bg-amber-400/20 text-amber-200 hover:bg-amber-400/30'
                }`}
              >
                <Settings size={15} />
                Control Panel
              </Link>
            )}

            <div className="pt-2 pb-1">
              <LoginButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
