import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const crops = [
  {
    emoji: '🌾',
    name: 'Paddy (Rice)',
    season: 'Kharif (June–November)',
    desc: 'Paddy is the primary crop of Sagrai, grown in the fertile fields during the monsoon season. The village produces high-quality rice that is a staple food for the community.',
    color: 'border-primary/30',
  },
  {
    emoji: '🌿',
    name: 'Wheat',
    season: 'Rabi (November–April)',
    desc: 'Wheat cultivation is a major agricultural activity in Sagrai during the winter season. The golden wheat fields are a beautiful sight and provide the community with flour for daily needs.',
    color: 'border-accent/30',
  },
  {
    emoji: '🥔',
    name: 'Potato',
    season: 'Rabi (October–March)',
    desc: 'Potatoes are an important cash crop for Sagrai farmers. The village\'s soil conditions are ideal for potato cultivation, producing high yields that are sold in local markets.',
    color: 'border-primary/30',
  },
  {
    emoji: '🫘',
    name: 'Pulses',
    season: 'Both Seasons',
    desc: 'Various pulses including lentils, chickpeas, and beans are grown in Sagrai. These nitrogen-fixing crops also help maintain soil fertility for other crops.',
    color: 'border-accent/30',
  },
  {
    emoji: '🌱',
    name: 'Seasonal Crops',
    season: 'Year-round',
    desc: 'Sagrai farmers also grow a variety of seasonal vegetables and other crops throughout the year, ensuring a diverse agricultural output and supplementary income.',
    color: 'border-primary/30',
  },
];

const practices = [
  { icon: '💧', title: 'Irrigation', desc: 'Traditional and modern irrigation methods ensure crops receive adequate water throughout the growing season.' },
  { icon: '🌱', title: 'Organic Farming', desc: 'Many farmers in Sagrai practice traditional organic farming methods passed down through generations.' },
  { icon: '🤝', title: 'Cooperative Farming', desc: 'Farmers often work together during planting and harvest seasons, sharing resources and labor.' },
  { icon: '📊', title: 'Market Access', desc: 'The new Crop Marketplace platform helps farmers connect directly with buyers for better prices.' },
];

export default function AgriculturePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[360px] overflow-hidden">
        <img
          src="/assets/generated/crops-illustration.dim_800x400.png"
          alt="Agriculture in Sagrai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Fertile Lands</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold drop-shadow-lg">Agriculture</h1>
          <p className="text-white/80 text-lg mt-2">The backbone of Sagrai's prosperity</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Our Strength</p>
          <h2 className="font-display text-3xl font-bold text-primary mb-4">Agriculturally Rich Village</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sagrai is blessed with fertile agricultural land that has sustained its community for generations. 
            The village's farmers work tirelessly to cultivate a variety of crops, contributing to both 
            local food security and the regional economy. Agriculture is not just a livelihood here — 
            it is a way of life, a tradition, and a source of pride.
          </p>
        </section>

        {/* Crop Cards */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-primary">Main Crops</h2>
            <p className="text-muted-foreground mt-2">The crops that define Sagrai's agricultural identity</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map(crop => (
              <Card key={crop.name} className={`card-hover shadow-card border-2 ${crop.color} transition-all duration-200`}>
                <CardContent className="p-6">
                  <span className="text-5xl mb-4 block">{crop.emoji}</span>
                  <h3 className="font-semibold text-xl text-foreground mb-1">{crop.name}</h3>
                  <p className="text-accent text-xs font-medium mb-3 uppercase tracking-wider">{crop.season}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{crop.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Farming Practices */}
        <section className="bg-secondary rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-primary">Farming Practices</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {practices.map(p => (
              <div key={p.title} className="text-center">
                <span className="text-4xl mb-3 block">{p.icon}</span>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <div className="bg-primary rounded-2xl p-10 text-white">
            <h2 className="font-display text-3xl font-bold mb-3">Buy Fresh Crops Directly</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Connect with Sagrai's farmers and buy fresh, locally grown crops at fair prices through our online marketplace.
            </p>
            <Link to="/crops">
              <Button className="btn-accent px-8 py-3 text-base font-semibold rounded-full shadow-lg">
                <ShoppingCart size={18} className="mr-2" /> Visit Crop Marketplace
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
