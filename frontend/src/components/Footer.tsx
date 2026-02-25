import React from 'react';
import { Link } from '@tanstack/react-router';
import { MapPin, Code2, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'oklch(0.20 0.08 145)' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Village Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/generated/village-logo.dim_256x256.png" alt="Sagrai" className="w-12 h-12 rounded-full object-cover border-2 border-white/30" />
              <div>
                <h3 className="font-display font-bold text-xl">Sagrai Village</h3>
                <p className="text-white/60 text-sm">Digital Platform</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              A historic and peaceful village in Firozabad district, Uttar Pradesh. 
              Founded by Mr. Harisingh and respected village elders.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin size={14} className="text-accent flex-shrink-0" />
                <span>Sagrai, Firozabad, Uttar Pradesh — PIN 283136</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-accent flex-shrink-0" />
                <a
                  href="tel:8533034708"
                  className="text-white/70 hover:text-accent transition-colors"
                >
                  Helpline: 8533034708
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-accent flex-shrink-0" />
                <a
                  href="mailto:abhaypratapabhaypratap112@gmail.com"
                  className="text-white/70 hover:text-accent transition-colors break-all"
                >
                  abhaypratapabhaypratap112@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Village' },
                { to: '/crops', label: 'Crop Marketplace' },
                { to: '/notices', label: 'Notice Board' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-accent text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Village Details */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Village Info</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>📍 District: Firozabad</li>
              <li>🗺️ State: Uttar Pradesh</li>
              <li>🇮🇳 Country: India</li>
              <li>📮 PIN: 283136</li>
              <li>👥 Population: 200–300</li>
              <li>🗣️ Language: Hindi</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-sm">
            © {year} Sagrai Village Digital Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/abhay-pratap.jpg"
              alt="Abhay Pratap"
              className="w-10 h-10 rounded-full object-cover object-top border-2 border-accent/60 flex-shrink-0"
            />
            <p className="text-white/60 text-xs flex items-center gap-1.5">
              <Code2 size={13} className="text-accent" />
              Developed by <span className="text-accent font-semibold">Abhay Pratap</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
