import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useGetPendingCrops,
  useGetAllCrops,
  useGetAllUsers,
  useGetAllOrders,
  useApproveCrop,
  useRejectCrop,
  useAdminDeleteCrop,
} from '../hooks/useAdmin';
import { useGetAllNotices, useDeleteNotice } from '../hooks/useNotices';
import { useGetAllGalleryItems, useDeleteGalleryItem } from '../hooks/useGallery';
import { useAuth } from '../components/AuthProvider';
import AddNoticeModal from '../components/AddNoticeModal';
import AddGalleryModal from '../components/AddGalleryModal';
import { Crop, User, Order, Notice, GalleryItem, Role } from '../backend';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  Users,
  Wheat,
  Bell,
  Images,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function roleLabel(role: Role): string {
  switch (role) {
    case Role.admin: return 'Admin';
    case Role.farmer: return 'Farmer';
    case Role.buyer: return 'Buyer';
    default: return String(role);
  }
}

function roleBadgeVariant(role: Role): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case Role.admin: return 'default';
    case Role.farmer: return 'secondary';
    default: return 'outline';
  }
}

// ── Crop Approvals Tab ──────────────────────────────────────────────────────
function CropApprovalsTab() {
  const { data: pending = [], isLoading } = useGetPendingCrops();
  const approve = useApproveCrop();
  const reject = useRejectCrop();

  const handleApprove = async (id: number) => {
    try {
      await approve.mutateAsync(id);
      toast.success('Crop approved and now visible in marketplace.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve crop.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await reject.mutateAsync(id);
      toast.success('Crop rejected.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject crop.');
    }
  };

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>;

  if (pending.length === 0) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={48} className="text-primary mx-auto mb-3" />
        <p className="text-foreground font-semibold">All caught up!</p>
        <p className="text-muted-foreground text-sm mt-1">No pending crop listings to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map((crop: Crop) => (
        <Card key={crop.id} className="shadow-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                <img
                  src={crop.imageUrl.getDirectURL()}
                  alt={crop.cropName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-foreground">{crop.cropName}</h3>
                    <p className="text-muted-foreground text-sm">
                      {crop.farmerName} · ₹{crop.price.toString()}/kg · {crop.quantity.toString()} kg
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{crop.description}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">📞 {crop.farmerPhone}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(crop.id)}
                      disabled={approve.isPending}
                      className="btn-primary gap-1"
                    >
                      <CheckCircle size={14} /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(crop.id)}
                      disabled={reject.isPending}
                      className="gap-1"
                    >
                      <XCircle size={14} /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── All Crops Tab ────────────────────────────────────────────────────────────
function AllCropsTab() {
  const { data: crops = [], isLoading } = useGetAllCrops();
  const deleteCrop = useAdminDeleteCrop();

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this crop listing?')) return;
    try {
      await deleteCrop.mutateAsync(id);
      toast.success('Crop deleted.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete crop.');
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Crop</TableHead>
            <TableHead>Farmer</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-16">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crops.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10">No crops found.</TableCell>
            </TableRow>
          ) : (
            crops.map((crop: Crop) => (
              <TableRow key={crop.id}>
                <TableCell className="font-medium">{crop.cropName}</TableCell>
                <TableCell>{crop.farmerName}</TableCell>
                <TableCell>₹{crop.price.toString()}/kg</TableCell>
                <TableCell>{crop.quantity.toString()} kg</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      crop.status === 'approved' ? 'default' :
                      crop.status === 'pending' ? 'secondary' : 'destructive'
                    }
                  >
                    {String(crop.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(crop.createdAt)}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab() {
  const { data: users = [], isLoading } = useGetAllUsers();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-10">No users registered yet.</TableCell>
            </TableRow>
          ) : (
            users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Badge variant={roleBadgeVariant(user.role)}>{roleLabel(user.role)}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Notices Tab ──────────────────────────────────────────────────────────────
function NoticesTab() {
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

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setAddOpen(true)} className="btn-primary gap-2" size="sm">
          <Plus size={14} /> Post Notice
        </Button>
      </div>
      <div className="space-y-3">
        {notices.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No notices posted yet.</p>
        ) : (
          notices.map((notice: Notice) => (
            <Card key={notice.id} className="shadow-card border-border">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{notice.title}</p>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{notice.content}</p>
                  <p className="text-muted-foreground text-xs mt-2">By {notice.postedBy} · {formatDate(notice.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {addOpen && <AddNoticeModal open={addOpen} onClose={() => setAddOpen(false)} />}
    </div>
  );
}

// ── Gallery Tab ──────────────────────────────────────────────────────────────
function GalleryTab() {
  const { data: items = [], isLoading } = useGetAllGalleryItems();
  const deleteItem = useDeleteGalleryItem();
  const [addOpen, setAddOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this gallery photo?')) return;
    try {
      await deleteItem.mutateAsync(id);
      toast.success('Photo deleted.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete photo.');
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setAddOpen(true)} className="btn-primary gap-2" size="sm">
          <Plus size={14} /> Add Photo
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No gallery photos yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item: GalleryItem) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border aspect-square">
              <img
                src={item.imageUrl}
                alt={item.caption || 'Gallery'}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                  <p className="text-white text-xs line-clamp-1">{item.caption}</p>
                </div>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
      {addOpen && <AddGalleryModal open={addOpen} onClose={() => setAddOpen(false)} />}
    </div>
  );
}

// ── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const { data: orders = [], isLoading } = useGetAllOrders();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buyer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Crop ID</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-10">No orders placed yet.</TableCell>
            </TableRow>
          ) : (
            orders.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.buyerName}</TableCell>
                <TableCell>{order.buyerPhone}</TableCell>
                <TableCell>#{order.cropId}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">{order.message || '—'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === 'accepted' ? 'default' :
                      order.status === 'pending' ? 'secondary' : 'destructive'
                    }
                  >
                    {String(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { data: pending = [] } = useGetPendingCrops();

  return (
    <div className="animate-fade-in">
      <div className="bg-primary py-14 text-white text-center">
        <h1 className="font-display text-4xl font-bold mb-2">⚙️ Admin Panel</h1>
        <p className="text-white/70 text-lg">Manage the Sagrai Village Digital Platform</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Tabs defaultValue="approvals">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-secondary p-1 rounded-xl">
            <TabsTrigger value="approvals" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
              <Clock size={14} />
              Approvals
              {pending.length > 0 && (
                <span className="ml-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {pending.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="crops" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
              <Wheat size={14} /> All Crops
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
              <Users size={14} /> Users
            </TabsTrigger>
            <TabsTrigger value="notices" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
              <Bell size={14} /> Notices
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
              <Images size={14} /> Gallery
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
              <ShoppingBag size={14} /> Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approvals">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">Pending Crop Approvals</h2>
            <CropApprovalsTab />
          </TabsContent>

          <TabsContent value="crops">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">All Crop Listings</h2>
            <AllCropsTab />
          </TabsContent>

          <TabsContent value="users">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">Registered Users</h2>
            <UsersTab />
          </TabsContent>

          <TabsContent value="notices">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">Notice Board Management</h2>
            <NoticesTab />
          </TabsContent>

          <TabsContent value="gallery">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">Gallery Management</h2>
            <GalleryTab />
          </TabsContent>

          <TabsContent value="orders">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">All Orders</h2>
            <OrdersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
