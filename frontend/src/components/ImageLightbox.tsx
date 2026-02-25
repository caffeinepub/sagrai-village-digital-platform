import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxItem {
  imageUrl: string;
  caption?: string;
}

interface ImageLightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({ items, currentIndex, onClose, onNavigate }: ImageLightboxProps) {
  const current = items[currentIndex];
  if (!current) return null;

  return (
    <Dialog open={true} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
          >
            <X size={18} />
          </button>
          {items.length > 1 && (
            <>
              <button
                onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => onNavigate((currentIndex + 1) % items.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <img
            src={current.imageUrl}
            alt={current.caption || 'Gallery image'}
            className="w-full max-h-[80vh] object-contain"
          />
          {current.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-3 text-center">
              {current.caption}
            </div>
          )}
          {items.length > 1 && (
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
