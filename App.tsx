
import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, ShieldCheck, X, Settings, ChevronRight, 
  ArrowRight, Search, Info
} from 'lucide-react';
import { getAllAssets } from './services/db.ts';
import { ImageManager } from './components/ImageManager.tsx';
import { DEFAULT_SHOPEE_LINK, StoredAsset } from './types.ts';

function App() {
  // Properly typed state using StoredAsset interface
  const [storedAssets, setStoredAssets] = useState<StoredAsset[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoredAsset | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    fetchAssets();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchAssets = async () => {
    try {
      const stored = await getAllAssets();
      setStoredAssets(stored);
    } catch (err) {
      console.error("Gagal memuat database:", err);
    }
  };

  // Fix: Added optional parameter 'link' to allow handleBuyClick() calls without arguments on line 131
  const handleBuyClick = (link?: string) => {
    window.open(link || DEFAULT_SHOPEE_LINK, '_blank');
  };

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 10) {
        setShowAdmin(true);
        return 0;
      }
      return newCount;
    });
  };

  // Type annotations for price parameter to ensure consistency with database data
  const formatPrice = (price: string) => {
    const num = parseInt(price) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 scroll-smooth">
      {/* Admin Panel */}
      {showAdmin && (
        <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-0 md:p-8">
          <div className="bg-white rounded-none md:rounded-3xl w-full max-w-6xl h-full md:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-slate-900 animate-spin-slow" />
                  <h2 className="text-sm font-black uppercase tracking-tight italic">Admin Katalog</h2>
                </div>
                <button onClick={() => { setShowAdmin(false); fetchAssets(); }} className="p-2 hover:bg-slate-200 rounded-lg">
                  <X size={20} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <ImageManager assets={storedAssets} onUpdate={fetchAssets} />
             </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full max-w-5xl h-[92vh] md:h-auto md:max-h-[90vh] rounded-t-[2rem] md:rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 relative bg-slate-100 aspect-square md:aspect-auto">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 left-4 z-10 bg-white/90 p-2 rounded-full md:hidden">
                <X size={20} />
              </button>
              {selectedProduct.type === 'video' ? (
                <video src={selectedProduct.dataUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : (
                <img src={selectedProduct.dataUrl} className="w-full h-full object-cover" alt="" />
              )}
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-white overflow-y-auto">
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">Editor Pick</span>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 uppercase italic leading-tight">{selectedProduct.name}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-2xl md:text-4xl font-black text-orange-600 italic">{formatPrice(selectedProduct.price)}</p>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase">
                    <Info size={14} /> Detail Deskripsi
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                    {selectedProduct.description || "Pilihan terbaik untuk kategori ini. Produk sudah teruji kualitasnya."}
                  </p>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <button onClick={() => handleBuyClick(selectedProduct.shopeeLink)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-3 uppercase italic">
                  CHECKOUT SHOPEE <ShoppingBag size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all px-4 ${scrolled ? 'pt-2' : 'pt-4'}`}>
        <div className={`max-w-7xl mx-auto h-14 md:h-16 flex justify-between items-center px-6 rounded-full transition-all border ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md border-slate-200' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <div className="bg-orange-600 text-white p-1.5 rounded-lg shadow-md">
              <ShieldCheck size={18} strokeWidth={2.5} />
            </div>
            <span className="font-black text-slate-900 uppercase italic text-lg">BEST<span className="text-orange-600">PICK.</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => handleBuyClick()} className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-[10px] hover:bg-orange-600 transition-all uppercase tracking-widest shadow-lg">
              SHOPEE MALL <ChevronRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-16 md:pt-48 md:pb-32 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-100">
              <Search size={12} strokeWidth={3} /> REKOMENDASI BELANJA TERBAIK
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight uppercase italic">
              BINGUNG PILIH BARANG <br/>
              <span className="text-orange-600">DI SHOPEE?</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Tim kami telah melakukan riset mendalam. Kami hanya mengkurasi barang dengan rating tinggi dan kualitas terjamin.
            </p>
            <div className="pt-4 flex justify-center lg:justify-start">
              <button onClick={() => document.getElementById('katalog')?.scrollIntoView()} className="bg-slate-900 text-white h-14 px-8 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-3 uppercase italic shadow-lg">
                LIHAT KATALOG <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Katalog */}
      <section id="katalog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase italic mb-12">KATALOG VIRAL</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {storedAssets.map((asset) => (
              <div key={asset.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all cursor-pointer" onClick={() => setSelectedProduct(asset)}>
                <div className="relative aspect-square md:aspect-[3/4] overflow-hidden bg-slate-50">
                  {asset.type === 'video' ? (
                    <video src={asset.dataUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  ) : (
                    <img src={asset.dataUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-[10px] uppercase shadow-xl">Detail</button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase italic line-clamp-2 leading-tight">{asset.name}</h3>
                  <p className="text-sm md:text-base font-black text-orange-600 italic">{formatPrice(asset.price)}</p>
                </div>
              </div>
            ))}
          </div>
          {storedAssets.length === 0 && (
            <div className="py-24 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ShoppingBag className="text-slate-200" size={24} />
               </div>
               <p className="text-slate-400 font-bold uppercase italic tracking-widest text-[9px]">Produk belum tersedia. Klik logo 10x untuk masuk admin.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
