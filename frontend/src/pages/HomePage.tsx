import React from 'react';
import { Link } from '@tanstack/react-router';
import { MapPin, Users, Wheat, Globe, ArrowRight, ShoppingCart, Bell, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const highlights = [
  { icon: '👥', label: 'Population', value: '200–300', color: 'text-primary' },
  { icon: '🗣️', label: 'Language', value: 'Hindi', color: 'text-primary' },
  { icon: '🌾', label: 'Main Crops', value: 'Paddy, Wheat, Potato', color: 'text-primary' },
  { icon: '📍', label: 'PIN Code', value: '283136', color: 'text-primary' },
];

const crops = ['🌾 Paddy', '🌿 Wheat', '🥔 Potato', '🫘 Pulses', '🌱 Seasonal Crops'];

const values = [
  { icon: '💚', label: 'Kind', desc: 'Warm and welcoming to all' },
  { icon: '🤝', label: 'Faithful', desc: 'Loyal to traditions and community' },
  { icon: '🙏', label: 'Helpful', desc: 'Always ready to assist neighbors' },
  { icon: '🏛️', label: 'Respectful', desc: 'Honoring age-old traditions' },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative h-[420px] sm:h-[500px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Sagrai Village"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="flex items-center gap-2 mb-3">
            <img src="/assets/generated/village-logo.dim_256x256.png" alt="Sagrai" className="w-14 h-14 rounded-full border-2 border-white/50 object-cover" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-2 drop-shadow-lg">Sagrai</h1>
          <p className="text-lg sm:text-xl font-medium text-white/90 mb-1">District: Firozabad • State: Uttar Pradesh</p>
          <p className="text-white/70 text-sm mb-6">PIN: 283136 • India</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/crops">
              <Button className="btn-accent px-6 py-2.5 rounded-full font-semibold shadow-lg">
                <ShoppingCart size={16} className="mr-2" /> Crop Marketplace
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="border-white text-white hover:bg-white/20 px-6 py-2.5 rounded-full font-semibold bg-transparent">
                Learn More <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Strip */}
      <section className="bg-primary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {highlights.map(h => (
              <div key={h.label} className="flex flex-col items-center text-center text-white">
                <span className="text-2xl mb-1">{h.icon}</span>
                <p className="text-white/70 text-xs uppercase tracking-wider">{h.label}</p>
                <p className="font-semibold text-sm mt-0.5">{h.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Welcome to</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-4">Sagrai Village</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Sagrai is a historic and peaceful village nestled in the heart of Firozabad district, Uttar Pradesh, India. 
              Founded by the visionary <strong className="text-foreground">Mr. Harisingh</strong> and other respected village elders, 
              Sagrai has grown into a close-knit community that cherishes its agricultural heritage and cultural traditions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The village is agriculturally rich, with fertile lands producing paddy, wheat, potato, pulses, and various seasonal crops. 
              It is also blessed by the proximity to the revered <strong className="text-foreground">Ma Sheetala Mata Temple</strong>, 
              which holds deep spiritual significance for the community.
            </p>
            <Link to="/about">
              <Button className="btn-primary rounded-full px-6">
                Read Our Story <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {values.map(v => (
              <Card key={v.label} className="card-hover shadow-card border-border">
                <CardContent className="p-5">
                  <span className="text-3xl mb-3 block">{v.icon}</span>
                  <h3 className="font-semibold text-foreground mb-1">{v.label}</h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Crops */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Agriculture</p>
            <h2 className="font-display text-3xl font-bold text-primary">Our Main Crops</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {crops.map(crop => (
              <span key={crop} className="px-5 py-2.5 bg-card rounded-full border border-border text-foreground font-medium shadow-xs text-sm">
                {crop}
              </span>
            ))}
          </div>
          <div className="text-center">
            <Link to="/crops">
              <Button className="btn-accent rounded-full px-8 py-3 text-base font-semibold shadow-md">
                <ShoppingCart size={18} className="mr-2" /> Visit Crop Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-primary">Explore Sagrai</h2>
          <p className="text-muted-foreground mt-2">Discover everything our village has to offer</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { to: '/crops', icon: '🌾', title: 'Crop Marketplace', desc: 'Buy and sell fresh crops directly from farmers', color: 'border-primary/30 hover:border-primary' },
            { to: '/notices', icon: '📢', title: 'Notice Board', desc: 'Stay updated with village announcements', color: 'border-accent/30 hover:border-accent' },
            { to: '/gallery', icon: '📸', title: 'Photo Gallery', desc: 'Explore beautiful moments from our village', color: 'border-primary/30 hover:border-primary' },
            { to: '/culture', icon: '🎭', title: 'Culture & Traditions', desc: 'Learn about our rich cultural heritage', color: 'border-accent/30 hover:border-accent' },
            { to: '/agriculture', icon: '🚜', title: 'Agriculture', desc: 'Discover our farming practices and crops', color: 'border-primary/30 hover:border-primary' },
            { to: '/contact', icon: '📞', title: 'Contact Us', desc: 'Get in touch with the village community', color: 'border-accent/30 hover:border-accent' },
          ].map(item => (
            <Link key={item.to} to={item.to}>
              <Card className={`card-hover shadow-card border-2 ${item.color} transition-all duration-200 h-full`}>
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
