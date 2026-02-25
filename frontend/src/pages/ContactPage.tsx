import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useSubmitContactInquiry } from '../hooks/useContactInquiries';
import { MapPin, Phone, Mail, MessageCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const submitInquiry = useSubmitContactInquiry();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error('Please fill in Name, Phone, and Message fields.');
      return;
    }
    try {
      await submitInquiry.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send message. Please try again.');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-primary py-14 text-white text-center">
        <h1 className="font-display text-4xl font-bold mb-2">📞 Contact Us</h1>
        <p className="text-white/70 text-lg">Get in touch with the Sagrai village community</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Send a Message</p>
            <h2 className="font-display text-3xl font-bold text-primary mb-6">We'd Love to Hear From You</h2>

            {submitted ? (
              <Card className="shadow-card border-border">
                <CardContent className="p-8 text-center">
                  <CheckCircle size={56} className="text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold text-primary mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you, <strong>{name}</strong>! Your message has been received. We'll get back to you at {phone} soon.
                  </p>
                  <Button onClick={handleReset} className="btn-primary rounded-full px-6">
                    Send Another Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card border-border">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address (optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full btn-primary rounded-lg py-3"
                      disabled={submitInquiry.isPending}
                    >
                      {submitInquiry.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Village Contact Info */}
          <div className="space-y-6">
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Village Details</p>
              <h2 className="font-display text-3xl font-bold text-primary mb-6">Find Us</h2>
            </div>

            <Card className="shadow-card border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Village Address</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Village Sagrai<br />
                      Firozabad, Uttar Pradesh<br />
                      India — PIN 283136
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Helpline Number</p>
                    <a
                      href="tel:8533034708"
                      className="text-muted-foreground text-sm mt-1 hover:text-primary transition-colors block"
                    >
                      8533034708
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a
                      href="mailto:abhaypratapabhaypratap112@gmail.com"
                      className="text-muted-foreground text-sm mt-1 hover:text-primary transition-colors break-all block"
                    >
                      abhaypratapabhaypratap112@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Contact */}
            <Card className="shadow-card border-border bg-secondary">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MessageCircle size={18} className="text-primary" />
                  Contact via WhatsApp
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  For quick inquiries, reach out to us directly on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919999999999?text=Hello%2C%20I%20am%20contacting%20from%20the%20Sagrai%20Village%20website."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90"
                  style={{ background: 'oklch(0.55 0.18 145)' }}
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              </CardContent>
            </Card>

            {/* Village Info */}
            <Card className="shadow-card border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Village Information</h3>
                <dl className="space-y-3">
                  {[
                    ['Village', 'Sagrai'],
                    ['District', 'Firozabad'],
                    ['State', 'Uttar Pradesh'],
                    ['Country', 'India'],
                    ['PIN Code', '283136'],
                    ['Language', 'Hindi'],
                    ['Population', '200–300'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                      <dt className="text-muted-foreground text-sm">{k}</dt>
                      <dd className="font-medium text-foreground text-sm">{v}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
