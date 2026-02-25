import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Calendar, Star } from 'lucide-react';

const values = [
  { icon: '💚', title: 'Kind', desc: 'The people of Sagrai are known for their warmth and kindness towards everyone who visits or lives in the village.' },
  { icon: '🤝', title: 'Faithful', desc: 'Deep faith in traditions, community bonds, and spiritual values defines the character of Sagrai\'s residents.' },
  { icon: '🙏', title: 'Helpful', desc: 'Neighbors help neighbors — a spirit of mutual assistance runs deep in the fabric of village life.' },
  { icon: '🏛️', title: 'Respect Traditions', desc: 'Ancient customs, festivals, and cultural practices are honored and passed down through generations.' },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-primary py-14 text-white text-center">
        <h1 className="font-display text-4xl font-bold mb-2">About Sagrai</h1>
        <p className="text-white/70 text-lg">A village with a rich history and vibrant community</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Village History */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Our History</p>
              <h2 className="font-display text-3xl font-bold text-primary mb-4">Village History</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sagrai was established by the visionary <strong className="text-foreground">Mr. Harisingh</strong> and a group of respected village elders 
                who sought to build a community rooted in agricultural prosperity and strong moral values.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Over the generations, the village has grown while maintaining its core identity — a peaceful, 
                agriculturally rich community where every family contributes to the collective well-being.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Sagrai stands as a testament to the vision of its founders, with fertile lands, 
                a close-knit community, and a deep connection to the sacred <strong className="text-foreground">Ma Sheetala Mata Temple</strong>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-card border-border">
                <CardContent className="p-5 text-center">
                  <Calendar size={28} className="text-primary mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Founded By</p>
                  <p className="text-muted-foreground text-sm mt-1">Mr. Harisingh & Village Elders</p>
                </CardContent>
              </Card>
              <Card className="shadow-card border-border">
                <CardContent className="p-5 text-center">
                  <Users size={28} className="text-primary mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Population</p>
                  <p className="text-muted-foreground text-sm mt-1">200–300 Residents</p>
                </CardContent>
              </Card>
              <Card className="shadow-card border-border">
                <CardContent className="p-5 text-center">
                  <MapPin size={28} className="text-accent mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Location</p>
                  <p className="text-muted-foreground text-sm mt-1">Firozabad, UP</p>
                </CardContent>
              </Card>
              <Card className="shadow-card border-border">
                <CardContent className="p-5 text-center">
                  <Star size={28} className="text-accent mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Famous For</p>
                  <p className="text-muted-foreground text-sm mt-1">Ma Sheetala Mata Temple</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* People & Values */}
        <section>
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Community</p>
            <h2 className="font-display text-3xl font-bold text-primary">People & Values</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">The people of Sagrai are defined by four core values that have guided the community for generations.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
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

        {/* Geographic Info */}
        <section>
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Location</p>
            <h2 className="font-display text-3xl font-bold text-primary">Geographic Information</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <Card className="shadow-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" /> Village Details
                  </h3>
                  <dl className="space-y-3">
                    {[
                      ['Village', 'Sagrai'],
                      ['District', 'Firozabad'],
                      ['State', 'Uttar Pradesh'],
                      ['Country', 'India'],
                      ['PIN Code', '283136'],
                      ['Language', 'Hindi'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                        <dt className="text-muted-foreground text-sm">{k}</dt>
                        <dd className="font-medium text-foreground text-sm">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
              <Card className="shadow-card border-border bg-secondary">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-xl">🛕</span> Ma Sheetala Mata Temple
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Sagrai is blessed by its proximity to the revered Ma Sheetala Mata Temple. 
                    This sacred site is a center of spiritual life for the village, drawing devotees 
                    from across the region and serving as a focal point for community gatherings and festivals.
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* OpenStreetMap Embed */}
            <div className="rounded-xl overflow-hidden border border-border shadow-card">
              <iframe
                title="Sagrai Village Location - Firozabad, Uttar Pradesh"
                src="https://www.openstreetmap.org/export/embed.html?bbox=78.2%2C27.0%2C78.6%2C27.3&layer=mapnik&marker=27.15%2C78.4"
                width="100%"
                height="380"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-3 bg-secondary text-center">
                <p className="text-muted-foreground text-xs">Firozabad District, Uttar Pradesh, India</p>
                <a
                  href="https://www.openstreetmap.org/?mlat=27.15&mlon=78.4#map=12/27.15/78.4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs hover:underline"
                >
                  View larger map →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
