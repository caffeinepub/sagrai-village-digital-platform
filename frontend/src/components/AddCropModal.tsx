import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddCrop } from '../hooks/useCrops';
import { useAuth } from './AuthProvider';
import { ExternalBlob } from '../backend';
import ImageUploadField from './ImageUploadField';
import { toast } from 'sonner';

interface AddCropModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCropModal({ open, onClose }: AddCropModalProps) {
  const { userProfile } = useAuth();
  const addCrop = useAddCrop();
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [imageBlob, setImageBlob] = useState<ExternalBlob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim() || !quantity || !price || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!imageBlob) {
      toast.error('Please upload a crop image');
      return;
    }
    try {
      await addCrop.mutateAsync({
        cropName: cropName.trim(),
        quantity: BigInt(Math.round(Number(quantity))),
        price: BigInt(Math.round(Number(price))),
        description: description.trim(),
        farmerName: userProfile?.name || '',
        farmerPhone: phone.trim(),
        image: imageBlob,
      });
      toast.success('Crop listing submitted! Awaiting admin approval.');
      onClose();
      setCropName(''); setQuantity(''); setPrice(''); setDescription(''); setImageBlob(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add crop. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Add New Crop Listing</DialogTitle>
          <DialogDescription>Fill in the details about your crop. It will be reviewed by admin before going live.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cropName">Crop Name *</Label>
            <Input id="cropName" value={cropName} onChange={e => setCropName(e.target.value)} placeholder="e.g., Wheat, Paddy, Potato" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg) *</Label>
              <Input id="quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="100" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹/kg) *</Label>
              <Input id="price" type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} placeholder="25" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your crop quality, harvest date, etc." rows={3} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Phone *</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" required />
          </div>
          <ImageUploadField onBlobReady={setImageBlob} label="Crop Photo *" />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 btn-primary" disabled={addCrop.isPending}>
              {addCrop.isPending ? <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />Submitting...</> : 'Submit Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
