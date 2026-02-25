import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllNotices, useDeleteNotice } from '../hooks/useNotices';
import { useAuth } from '../components/AuthProvider';
import AddNoticeModal from '../components/AddNoticeModal';
import { Notice } from '../backend';
import { Plus, Trash2, Bell, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NoticesPage() {
  const { isAdmin } = useAuth();
  const { data: notices = [], isLoading } = useGetAllNotices();
  const deleteNotice = useDeleteNotice();
  const [addOpen, setAddOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await deleteNotice.mutateAsync(id);
      toast.success('Notice deleted.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete notice.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-primary py-14 text-white text-center">
        <h1 className="font-display text-4xl font-bold mb-2">📢 Notice Board</h1>
        <p className="text-white/70 text-lg">Village announcements and important updates</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex justify-end mb-6">
            <Button onClick={() => setAddOpen(true)} className="btn-primary gap-2">
              <Plus size={16} /> Post Notice
            </Button>
          </div>
        )}

        {/* Notices List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={56} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No notices yet</h3>
            <p className="text-muted-foreground">
              {isAdmin
                ? 'Post the first notice for the village community.'
                : 'Village notices will appear here when posted by the admin.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice: Notice) => (
              <Card key={notice.id} className="shadow-card border-border card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                        <h3 className="font-semibold text-foreground text-lg leading-tight">{notice.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mt-2 mb-4 whitespace-pre-wrap">
                        {notice.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-primary" />
                          {notice.postedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-primary" />
                          {formatDate(notice.createdAt)}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
                        title="Delete notice"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {addOpen && <AddNoticeModal open={addOpen} onClose={() => setAddOpen(false)} />}
    </div>
  );
}
