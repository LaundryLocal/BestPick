import React, { useRef, useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, Video, PlayCircle, Plus, Tag, DollarSign, ExternalLink, FileText } from 'lucide-react';
import { StoredAsset } from '../types';
import { saveAsset, deleteAsset, updateAsset } from '../services/db';

interface Props {
  assets: StoredAsset[];
  onUpdate: () => void;
}

export const ImageManager: React.FC<Props> = ({ assets, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const files = Array.from(e.target.files) as File[];
        for (const file of files) {
          await saveAsset(file);
        }
        onUpdate();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Gagal mengunggah file.";
        alert(`Error: ${errorMessage}`);
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

  const handleFieldUpdate = async (asset: StoredAsset, field: keyof StoredAsset, value: string) => {
    const updatedAsset = { ...asset, [field]: value };
    await updateAsset(updatedAsset);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="text-center md:text-left">
          <h3 className="text-base font-black italic uppercase tracking-tight">Katalog Media</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{assets.length} Item Tersimpan</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-3 transition-all hover:bg-orange-600 shadow-lg"
        >
          <Plus size={16} strokeWidth={3} />
          {isUploading ? 'MENGUNGGAH...' : 'TAMBAH PRODUK VIRAL'}
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" multiple onChange={handleFileChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="relative w-full md:w-48 aspect-video md:aspect-square bg-slate-50 overflow-hidden">
              {asset.type === 'video' ? (
                <video src={asset.dataUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={asset.dataUrl} className="w-full h-full object-cover" alt="" />
              )}
              <div className="absolute top-3 right-3">
                 <button onClick={() => handleDelete(asset.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-100">
                    <Trash2 size={14} />
                  </button>
              </div>
            </div>

            <div className="p-5 flex-1 space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                <input
                  type="text"
                  defaultValue={asset.name}
                  onBlur={(e) => handleFieldUpdate(asset, 'name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-900 focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga (Angka)</label>
                  <input
                    type="number"
                    defaultValue={asset.price}
                    onBlur={(e) => handleFieldUpdate(asset, 'price', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-900 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Shopee Link</label>
                   <input
                    type="text"
                    defaultValue={asset.shopeeLink}
                    onBlur={(e) => handleFieldUpdate(asset, 'shopeeLink', e.target.value)}
                    className="w-full bg-blue-50/20 border border-slate-200 rounded-lg px-3 py-2 text-[9px] font-medium text-blue-700 focus:border-blue-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Produk (Detail)</label>
                <textarea
                  defaultValue={asset.description}
                  onBlur={(e) => handleFieldUpdate(asset, 'description', e.target.value)}
                  placeholder="Jelaskan keunggulan produk di sini agar pembeli yakin..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-medium text-slate-600 focus:border-orange-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};