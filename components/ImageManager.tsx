
import React, { useRef, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { saveAsset, deleteAsset, updateAsset } from '../services/db.ts';
import { StoredAsset } from '../types.ts';

// Defined interface for props to ensure correct typing of assets and callbacks
interface ImageManagerProps {
  assets: StoredAsset[];
  onUpdate: () => void;
}

export const ImageManager = ({ assets, onUpdate }: ImageManagerProps) => {
  // Specifying HTMLInputElement for the ref to avoid null check issues later
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Added React.ChangeEvent<HTMLInputElement> to correctly type e.target.files and avoid 'unknown' type inference
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const files = Array.from(e.target.files);
        for (const file of files) {
          // Fix: Explicitly casting each file to File to match saveAsset parameter type requirements
          await saveAsset(file as File);
        }
        onUpdate();
      } catch (error: any) {
        alert("Gagal mengunggah: " + error.message);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus produk ini?')) {
      await deleteAsset(id);
      onUpdate();
    }
  };

  // Added keyof StoredAsset to ensure type safety when updating specific fields in the object
  const handleFieldUpdate = async (asset: StoredAsset, field: keyof StoredAsset, value: string) => {
    const updatedAsset = { ...asset, [field]: value };
    await updateAsset(updatedAsset);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-black uppercase italic text-sm">Media Katalog ({assets.length})</h3>
          <p className="text-[10px] text-slate-400 font-bold">Klik logo 10x untuk menutup admin panel.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-orange-600 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> {isUploading ? 'PROSES...' : 'TAMBAH PRODUK'}
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" multiple onChange={handleFileChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="relative w-full md:w-48 bg-slate-50 aspect-square overflow-hidden border-r border-slate-100">
              {asset.type === 'video' ? (
                <video src={asset.dataUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={asset.dataUrl} className="w-full h-full object-cover" alt="" />
              )}
              <button onClick={() => handleDelete(asset.id)} className="absolute top-2 right-2 bg-red-50 text-red-500 p-2 rounded-lg">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-4 flex-1 space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400">Nama</label>
                <input
                  type="text"
                  defaultValue={asset.name}
                  onBlur={(e) => handleFieldUpdate(asset, 'name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400">Harga</label>
                <input
                  type="number"
                  defaultValue={asset.price}
                  onBlur={(e) => handleFieldUpdate(asset, 'price', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400">Link Shopee</label>
                <input
                  type="text"
                  defaultValue={asset.shopeeLink}
                  onBlur={(e) => handleFieldUpdate(asset, 'shopeeLink', e.target.value)}
                  className="w-full bg-blue-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[9px] font-medium outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400">Deskripsi</label>
                <textarea
                  defaultValue={asset.description}
                  onBlur={(e) => handleFieldUpdate(asset, 'description', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
