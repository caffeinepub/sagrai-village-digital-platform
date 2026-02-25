import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditCrop } from '../hooks/useCrops';
import { Crop, ExternalBlob } from '../backend';
import ImageUploadField from './ImageUploadField';
import { toast } from 'sonner';

interface EditCropModalProps {
  open: boolean;
  onClose: () => void;
  crop: Crop;
}

export default function EditCropModal({ open, onClose, crop }: EditCropModalProps) {
  const editCrop = useEditCrop();
  const [cropName, setCropName] = useState(crop.cropName);
  const [quantity, setQuantity] = useState(crop.quantity.toString());
  const [price, setPrice] = useState(crop.price.toString());
  const [description, setDescription] = useState(crop.description);
  const [phone, setPhone] = useState(crop.farmerPhone);
  const [imageBlob, setImageBlob] = useState<ExternalBlob | null>(null);

  useEffect(() => {
    setCropName(crop.cropName);
    setQuantity(crop.quantity.toString());
    setPrice(crop.price.toString());
    setDescription(crop.description);
    setPhone(crop.farmerPhone);
    setImageBlob(null);
  }, [crop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim() || !quantity || !price || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const finalImage = imageBlob || crop.imageUrl;
    try {
      await editCrop.mutateAsync({
        cropId: crop.id,
        crop: {
          cropName: cropName.trim(),
          quantity: BigInt(Math.round(Number(quantity))),
          price: BigInt(Math.round(Number(price))),
          description: description.trim(),
          farmerName: crop.farmerName,
          farmerPhone: phone.trim(),
          image: finalImage,
        },
      });
      toast.success('Crop updated! Awaiting re-approval.');
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update crop.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Edit Crop Listing</DialogTitle>
          <DialogDescription>Update your crop details. It will need re-approval after editing.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Crop Name *</Label>
            <Input value={cropName} onChange={e => setCropName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity (kg) *</Label>
              <Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Price (₹/kg) *</Label>
              <Input type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required />
          </div>
          <div className="space-y-2">
            <Label>Contact Phone *</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <ImageUploadField
            onBlobReady={setImageBlob}
            existingImageUrl={crop.imageUrl.getDirectURL()}
            label="Crop Photo (leave unchanged to keep existing)"
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 btn-primary" disabled={editCrop.isPending}>
              {editCrop.isPending ? <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
