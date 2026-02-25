import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActor } from '../hooks/useActor';
import { useAuth } from './AuthProvider';
import { Role } from '../backend';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function RoleSelectionModal() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { actor } = useActor();
  const { refetchProfile } = useAuth();
  const queryClient = useQueryClient();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !selectedRole) return;
    if (!name.trim() || !phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await actor.saveCallerUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        role: selectedRole,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      });
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      await refetchProfile();
      toast.success('Profile created successfully! Welcome to Sagrai Village Platform.');
    } catch (err: any) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img src="/assets/generated/village-logo.dim_256x256.png" alt="Sagrai" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <DialogTitle className="text-primary font-display text-xl">Welcome to Sagrai!</DialogTitle>
              <DialogDescription>Complete your profile to get started</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === 'role' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">I am joining as a...</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect(Role.farmer)}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-secondary transition-all duration-200 group"
              >
                <span className="text-4xl">👨‍🌾</span>
                <div className="text-center">
                  <p className="font-semibold text-foreground group-hover:text-primary">Farmer</p>
                  <p className="text-xs text-muted-foreground mt-1">Sell your crops</p>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect(Role.buyer)}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-accent hover:bg-secondary transition-all duration-200 group"
              >
                <span className="text-4xl">🛒</span>
                <div className="text-center">
                  <p className="font-semibold text-foreground group-hover:text-accent">Buyer</p>
                  <p className="text-xs text-muted-foreground mt-1">Buy fresh crops</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button type="button" onClick={() => setStep('role')} className="text-sm text-muted-foreground hover:text-primary">← Back</button>
              <span className="text-sm font-medium text-primary">
                {selectedRole === Role.farmer ? '👨‍🌾 Farmer' : '🛒 Buyer'} Profile
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" required />
            </div>
            <Button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading ? <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />Saving...</span> : 'Create Profile'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
