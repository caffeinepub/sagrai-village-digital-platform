import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePlaceOrder } from '../hooks/useOrders';
import { useAuth } from './AuthProvider';
import { Crop } from '../backend';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

interface OrderRequestModalProps {
  open: boolean;
  onClose: () => void;
  crop: Crop;
}

export default function OrderRequestModal({ open, onClose, crop }: OrderRequestModalProps) {
  const { userProfile } = useAuth();
  const placeOrder = usePlaceOrder();
  const [buyerName, setBuyerName] = useState(userProfile?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(userProfile?.phone || '');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) {
      toast.error('Please fill in your name and phone number');
      return;
    }
    try {
      await placeOrder.mutateAsync({ cropId: crop.id, buyerName: buyerName.trim(), buyerPhone: buyerPhone.trim(), message: message.trim() });
      setSuccess(true);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to place order request.');
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle size={56} className="text-primary" />
            <h3 className="text-xl font-display font-bold text-primary">Order Request Sent!</h3>
            <p className="text-muted-foreground text-sm">Your order request for <strong>{crop.cropName}</strong> has been sent to <strong>{crop.farmerName}</strong>. They will contact you at {buyerPhone}.</p>
            <Button onClick={handleClose} className="btn-primary w-full">Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-primary font-display">Send Order Request</DialogTitle>
              <DialogDescription>
                Request to buy <strong>{crop.cropName}</strong> from {crop.farmerName} at ₹{crop.price.toString()}/kg
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Your Name *</Label>
                <Input value={buyerName} onChange={e => setBuyerName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Your Phone *</Label>
                <Input value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Message (optional)</Label>
                <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Specify quantity needed, delivery preferences, etc." rows={3} />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1 btn-primary" disabled={placeOrder.isPending}>
                  {placeOrder.isPending ? <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />Sending...</> : 'Send Request'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
