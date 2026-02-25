import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddNotice } from '../hooks/useNotices';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

interface AddNoticeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddNoticeModal({ open, onClose }: AddNoticeModalProps) {
  const { userProfile } = useAuth();
  const addNotice = useAddNotice();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }
    try {
      await addNotice.mutateAsync({ title: title.trim(), content: content.trim(), postedBy: userProfile?.name || 'Admin' });
      toast.success('Notice posted successfully!');
      onClose();
      setTitle(''); setContent('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to post notice.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Post New Notice</DialogTitle>
          <DialogDescription>Add an announcement for the village community.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notice title" required />
          </div>
          <div className="space-y-2">
            <Label>Content *</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Notice details..." rows={4} required />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 btn-primary" disabled={addNotice.isPending}>
              {addNotice.isPending ? 'Posting...' : 'Post Notice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
