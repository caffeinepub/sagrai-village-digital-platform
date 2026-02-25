import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllApprovedCrops, useGetMyCrops, useDeleteCrop } from '../hooks/useCrops';
import { useAuth } from '../components/AuthProvider';
import AddCropModal from '../components/AddCropModal';
import EditCropModal from '../components/EditCropModal';
import OrderRequestModal from '../components/OrderRequestModal';
import { Crop } from '../backend';
import { Search, Plus, ShoppingCart, Edit, Trash2, MessageCircle, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Link } from '@tanstack/react-router';

const CROP_CATEGORIES = ['All', 'Paddy', 'Wheat', 'Potato', 'Pulses', 'Vegetables', 'Other'];

function CropCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-9 w-full mt-2" />
      </CardContent>
    </Card>
  );
}

function CropCard({
  crop,
  onOrder,
  onEdit,
  onDelete,
  isOwner,
  isAuthenticated,
  isBuyer,
}: {
  crop: Crop;
  onOrder: (crop: Crop) => void;
  onEdit: (crop: Crop) => void;
  onDelete: (cropId: number) => void;
  isOwner: boolean;
  isAuthenticated: boolean;
  isBuyer: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = crop.imageUrl.getDirectURL();

  return (
    <Card className="card-hover shadow-card border-border overflow-hidden flex flex-col">
      <div className="relative h-48 bg-secondary overflow-hidden">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={crop.cropName}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-secondary">🌾</div>
        )}
        {isOwner && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => onEdit(crop)}
              className="bg-white/90 hover:bg-white text-primary rounded-full p-1.5 shadow transition-colors"
              title="Edit listing"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete(crop.id)}
              className="bg-white/90 hover:bg-white text-destructive rounded-full p-1.5 shadow transition-colors"
              title="Delete listing"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight">{crop.cropName}</h3>
          <span className="text-primary font-bold text-lg whitespace-nowrap">
            ₹{crop.price.toString()}/kg
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-1">
          Qty: <span className="text-foreground font-medium">{crop.quantity.toString()} kg</span>
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1 line-clamp-2">
          {crop.description}
        </p>
        <div className="border-t border-border pt-3 mt-auto">
          <p className="text-sm font-medium text-foreground mb-0.5">👨‍🌾 {crop.farmerName}</p>
          <p className="text-muted-foreground text-xs mb-3">📞 {crop.farmerPhone}</p>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${crop.farmerPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors text-white"
              style={{ background: 'oklch(0.55 0.18 145)' }}
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            {isAuthenticated && isBuyer && (
              <button
                onClick={() => onOrder(crop)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium btn-accent"
              >
                <ShoppingCart size={14} /> Order
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CropsPage() {
  const { isAuthenticated, isFarmer, isBuyer } = useAuth();
  const { identity } = useInternetIdentity();
  const { data: approvedCrops = [], isLoading } = useGetAllApprovedCrops();
  const deleteCrop = useDeleteCrop();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [editCrop, setEditCrop] = useState<Crop | null>(null);
  const [orderCrop, setOrderCrop] = useState<Crop | null>(null);

  const filteredCrops = useMemo(() => {
    return approvedCrops.filter((crop) => {
      const matchSearch =
        crop.cropName.toLowerCase().includes(search.toLowerCase()) ||
        crop.farmerName.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        category === 'All' || crop.cropName.toLowerCase().includes(category.toLowerCase());
      return matchSearch && matchCategory;
    });
  }, [approvedCrops, search, category]);

  const handleDelete = async (cropId: number) => {
    if (!confirm('Are you sure you want to delete this crop listing?')) return;
    try {
      await deleteCrop.mutateAsync(cropId);
      toast.success('Crop listing deleted.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete crop.');
    }
  };

  const isOwner = (crop: Crop): boolean => {
    if (!identity) return false;
    return crop.farmerPrincipal.toString() === identity.getPrincipal().toString();
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-primary py-14 text-white text-center">
        <h1 className="font-display text-4xl font-bold mb-2">🌾 Crop Marketplace</h1>
        <p className="text-white/70 text-lg">Buy and sell fresh crops directly from Sagrai farmers</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search crops or farmers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CROP_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isAuthenticated && isFarmer && (
            <Button onClick={() => setAddOpen(true)} className="btn-primary gap-2 whitespace-nowrap">
              <Plus size={16} /> Add Crop
            </Button>
          )}
        </div>

        {/* Login prompt for buyers */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-secondary rounded-xl border border-border flex items-center justify-between gap-4 flex-wrap">
            <p className="text-muted-foreground text-sm">
              <strong className="text-foreground">Login</strong> to place order requests or list your crops.
            </p>
            <Link to="/login">
              <Button size="sm" className="btn-primary">Login / Register</Button>
            </Link>
          </div>
        )}

        {/* Results count */}
        {!isLoading && (
          <p className="text-muted-foreground text-sm mb-6">
            Showing <strong className="text-foreground">{filteredCrops.length}</strong> crop{filteredCrops.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CropCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No crops found</h3>
            <p className="text-muted-foreground">
              {search
                ? `No crops match "${search}". Try a different search.`
                : 'No approved crop listings yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCrops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                onOrder={setOrderCrop}
                onEdit={setEditCrop}
                onDelete={handleDelete}
                isOwner={isOwner(crop)}
                isAuthenticated={isAuthenticated}
                isBuyer={isBuyer}
              />
            ))}
          </div>
        )}

        {/* My Pending Crops section for farmers */}
        {isAuthenticated && isFarmer && <MyPendingCrops onEdit={setEditCrop} onDelete={handleDelete} identity={identity} />}
      </div>

      {/* Modals */}
      {addOpen && <AddCropModal open={addOpen} onClose={() => setAddOpen(false)} />}
      {editCrop && <EditCropModal open={!!editCrop} onClose={() => setEditCrop(null)} crop={editCrop} />}
      {orderCrop && <OrderRequestModal open={!!orderCrop} onClose={() => setOrderCrop(null)} crop={orderCrop} />}
    </div>
  );
}

function MyPendingCrops({
  onEdit,
  onDelete,
  identity,
}: {
  onEdit: (crop: Crop) => void;
  onDelete: (id: number) => void;
  identity: ReturnType<typeof useInternetIdentity>['identity'];
}) {
  const { data: myCrops = [], isLoading } = useGetMyCrops();
  const pendingOrRejected = myCrops.filter(
    (c) => c.status === 'pending' || c.status === 'rejected'
  );

  if (isLoading || pendingOrRejected.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-bold text-primary mb-4">My Pending / Rejected Listings</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pendingOrRejected.map((crop) => (
          <Card key={crop.id} className="border-border shadow-card overflow-hidden opacity-80">
            <div className="relative h-36 bg-secondary overflow-hidden">
              <img
                src={crop.imageUrl.getDirectURL()}
                alt={crop.cropName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute top-2 left-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    crop.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {crop.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
                </span>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="font-semibold text-foreground">{crop.cropName}</p>
              <p className="text-muted-foreground text-xs mt-1">₹{crop.price.toString()}/kg · {crop.quantity.toString()} kg</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => onEdit(crop)} className="flex-1 gap-1">
                  <Edit size={12} /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(crop.id)} className="flex-1 gap-1">
                  <Trash2 size={12} /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
