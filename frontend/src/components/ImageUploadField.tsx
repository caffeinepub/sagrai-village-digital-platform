import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ExternalBlob } from '../backend';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
  onBlobReady: (blob: ExternalBlob | null) => void;
  existingImageUrl?: string;
  label?: string;
}

export default function ImageUploadField({ onBlobReady, existingImageUrl, label = 'Crop Image' }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please select a JPG, PNG, or WebP image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.warning('Image is larger than 2MB. Upload may be slow.');
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((pct) => {
      setUploadProgress(pct);
    });
    onBlobReady(blob);
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadProgress(0);
    onBlobReady(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
          >
            <X size={14} />
          </button>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40">
              <Progress value={uploadProgress} className="h-1.5" />
              <p className="text-white text-xs mt-1 text-center">{uploadProgress}%</p>
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-secondary/50 transition-colors">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon size={24} />
            <span className="text-sm">Click to upload image</span>
            <span className="text-xs">JPG, PNG, WebP (max 2MB recommended)</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
