import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllGalleryItems, useDeleteGalleryItem } from '../hooks/useGallery';
import { useAuth } from '../components/AuthProvider';
import AddGalleryModal from '../components/AddGalleryModal';
import ImageLightbox from '../components/ImageLightbox';
import { Plus, Trash2, Images } from 'lucide-react';
import { toast } from 'sonner';
import { GalleryItem } from '../backend';

export default function GalleryPage() {
  const { isAdmin } = useAuth();
  const { data: items = [], isLoading } = useGetAllGalleryItems();
  const deleteItem = useDeleteGalleryItem();

  const [addOpen, setAddOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this gallery photo?')) return;
    try {
      await deleteItem.mutateAsync(id);
      toast.success('Photo deleted.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete photo.');
    }
  };

  const lightboxItems = items.map((item: GalleryItem) => ({
    imageUrl: item.imageUrl,
    caption: item.caption || undefined,
  }));

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-primary py-14 text-white text-center">
        <h1 className="font-display text-4xl font-bold mb-2">📸 Photo Gallery</h1>
        <p className="text-white/70 text-lg">Beautiful moments from Sagrai village</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex justify-end mb-6">
            <Button onClick={() => setAddOpen(true)} className="btn-primary gap-2">
              <Plus size={16} /> Add Photo
            </Button>
          </div>
        )}

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Images size={56} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No photos yet</h3>
            <p className="text-muted-foreground">
              {isAdmin ? 'Add the first photo to the gallery.' : 'Gallery photos will appear here soon.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item: GalleryItem, index: number) => (
              <div key={item.id} className="group relative rounded-xl overflow-hidden shadow-card border border-border aspect-square cursor-pointer">
                <img
                  src={item.imageUrl}
                  alt={item.caption || `Gallery photo ${item.id}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setLightboxIndex(index)}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%239ca3af" font-size="30"%3E📷%3C/text%3E%3C/svg%3E';
                  }}
                />
                {/* Caption overlay */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-white text-xs line-clamp-2">{item.caption}</p>
                  </div>
                )}
                {/* Admin delete */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Delete photo"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                {/* View overlay */}
                <div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"
                  onClick={() => setLightboxIndex(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {addOpen && <AddGalleryModal open={addOpen} onClose={() => setAddOpen(false)} />}
      {lightboxIndex !== null && (
        <ImageLightbox
          items={lightboxItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
