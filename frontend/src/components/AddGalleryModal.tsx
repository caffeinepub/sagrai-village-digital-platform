import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddGalleryItem } from '../hooks/useGallery';
import { toast } from 'sonner';

interface AddGalleryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddGalleryModal({ open, onClose }: AddGalleryModalProps) {
  const addItem = useAddGalleryItem();
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    try {
      await addItem.mutateAsync({ imageUrl: imageUrl.trim(), caption: caption.trim() });
      toast.success('Gallery item added!');
      onClose();
      setImageUrl(''); setCaption('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add gallery item.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Add Gallery Photo</DialogTitle>
          <DialogDescription>Add a photo to the village gallery.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Image URL *</Label>
            <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/photo.jpg" required />
          </div>
          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-border">
              <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
          <div className="space-y-2">
            <Label>Caption (optional)</Label>
            <Input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Describe this photo..." />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 btn-primary" disabled={addItem.isPending}>
              {addItem.isPending ? 'Adding...' : 'Add Photo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
