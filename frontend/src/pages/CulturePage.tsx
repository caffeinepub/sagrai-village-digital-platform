import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const festivals = [
  { icon: '🪔', name: 'Diwali', desc: 'Festival of lights celebrated with great joy, diyas, and sweets shared among all families.' },
  { icon: '🎨', name: 'Holi', desc: 'The festival of colors brings the entire village together in joyful celebration.' },
  { icon: '🌾', name: 'Harvest Festival', desc: 'Celebrating the bounty of the land after a successful harvest season.' },
  { icon: '🛕', name: 'Sheetala Mata Puja', desc: 'Special prayers and offerings at the Ma Sheetala Mata Temple, a deeply revered tradition.' },
];

const traditions = [
  { icon: '🤝', title: 'Community Gatherings', desc: 'Regular village meetings where elders guide decisions and community bonds are strengthened.' },
  { icon: '🎵', title: 'Folk Music & Dance', desc: 'Traditional folk songs and dances are performed during festivals and special occasions.' },
  { icon: '🍲', title: 'Communal Feasts', desc: 'Shared meals during festivals bring the entire village together in celebration.' },
  { icon: '📖', title: 'Oral Traditions', desc: 'Stories, wisdom, and history are passed down through generations by village elders.' },
];

export default function CulturePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative h-[360px] overflow-hidden">
        <img
          src="/assets/generated/culture-banner.dim_1200x400.png"
          alt="Sagrai Culture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Heritage & Identity</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold drop-shadow-lg">Culture of Sagrai</h1>
          <p className="text-white/80 text-lg mt-2">Traditions, values, and community spirit</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Community Values */}
        <section>
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Our Identity</p>
            <h2 className="font-display text-3xl font-bold text-primary">Community Values</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">The four pillars that define the character of Sagrai's people</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💚', title: 'Kind', desc: 'Warmth and compassion are the hallmarks of every Sagrai resident.' },
              { icon: '🤝', title: 'Faithful', desc: 'Unwavering loyalty to community, traditions, and spiritual values.' },
              { icon: '🙏', title: 'Helpful', desc: 'A culture of mutual support where no one is left behind.' },
              { icon: '🏛️', title: 'Respect Traditions', desc: 'Ancient customs are honored and celebrated with pride.' },
            ].map(v => (
              <Card key={v.title} className="card-hover shadow-card border-border text-center">
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">{v.icon}</span>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Ma Sheetala Mata Temple */}
        <section className="bg-secondary rounded-2xl p-8 sm:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Spiritual Heart</p>
              <h2 className="font-display text-3xl font-bold text-primary mb-4">Ma Sheetala Mata Temple</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Ma Sheetala Mata Temple is the spiritual and cultural heart of Sagrai village. 
                This sacred temple is dedicated to Goddess Sheetala Mata, who is revered as the protector 
                of the village and its people.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Devotees from Sagrai and surrounding villages gather here during festivals and auspicious occasions 
                to offer prayers and seek blessings. The temple serves as a unifying force for the community, 
                bringing people together in faith and celebration.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The annual Sheetala Mata Puja is one of the most important events in the village calendar, 
                celebrated with great devotion, traditional rituals, and communal feasting.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { icon: '🛕', title: 'Sacred Site', desc: 'A revered temple that has been the spiritual center of Sagrai for generations.' },
                { icon: '🙏', title: 'Annual Puja', desc: 'The Sheetala Mata Puja is celebrated with great devotion every year.' },
                { icon: '🌸', title: 'Community Unity', desc: 'The temple brings together all families in shared faith and celebration.' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border">
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Festivals */}
        <section>
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Celebrations</p>
            <h2 className="font-display text-3xl font-bold text-primary">Festivals & Traditions</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {festivals.map(f => (
              <Card key={f.name} className="card-hover shadow-card border-border">
                <CardContent className="p-6">
                  <span className="text-4xl mb-4 block">{f.icon}</span>
                  <h3 className="font-semibold text-foreground mb-2">{f.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Language & Traditions */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Language</p>
              <h2 className="font-display text-3xl font-bold text-primary mb-4">Hindi — Our Mother Tongue</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Hindi is the primary language spoken in Sagrai, connecting the village to the broader cultural 
                tapestry of Uttar Pradesh and northern India. The language carries within it centuries of 
                poetry, folk songs, and oral traditions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Village elders share stories, proverbs, and wisdom in Hindi, ensuring that the cultural 
                heritage of Sagrai is preserved and passed on to younger generations.
              </p>
            </div>
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Daily Life</p>
              <h2 className="font-display text-3xl font-bold text-primary mb-4">Living Traditions</h2>
              <div className="space-y-4">
                {traditions.map(t => (
                  <div key={t.title} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{t.icon}</span>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{t.title}</h4>
                      <p className="text-muted-foreground text-sm mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
