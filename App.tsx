import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Wind, 
  Droplets, 
  Star, 
  Menu,
  X,
  Play,
  Settings,
  Heart,
  ChevronRight,
  HelpCircle,
  Truck,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Zap,
  ArrowRight,
  Search,
  CheckCircle,
  Share2,
  Info
} from 'lucide-react';
import { getAllAssets } from './services/db';
import { ImageManager } from './components/ImageManager';
import { StoredAsset, DEFAULT_SHOPEE_LINK } from './types';

function App() {
  const [storedAssets, setStoredAssets] = useState<StoredAsset[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      console.error("DB Error", err);
    }
  };

  const handleBuyClick = (link?: string) => {
    window.open(link || DEFAULT_SHOPEE_LINK, '_blank');
  };

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowAdmin(true);
        return 0;
      }
      return newCount;
    });
  };

  const formatPrice = (price: string) => {
    const num = parseInt(price) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 scroll-smooth selection:bg-orange-100 selection:text-orange-600">
      {/* Admin Panel Modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-0 md:p-8">
          <div className="bg-white rounded-none md:rounded-3xl w-full max-w-6xl h-full md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <Settings className="w-4 h-4 text-white animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight italic leading-none">Management Dashboard</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Atur Katalog Produk Anda</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowAdmin(false); fetchAssets(); }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all border border-slate-200"
                >
                  <X size={18} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 md:p-10">
                <ImageManager assets={storedAssets} onUpdate={fetchAssets} />
             </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
            {/* Left: Media */}
            <div className="w-full md:w-1/2 relative bg-slate-50 aspect-square md:aspect-auto">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg text-slate-900 md:hidden">
                <X size={20} />
              </button>
              {selectedProduct.type === 'video' ? (
                <video src={selectedProduct.dataUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : (
                <img src={selectedProduct.dataUrl} className="w-full h-full object-cover" alt={selectedProduct.name} />
              )}
            </div>
            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white overflow-y-auto">
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-orange-100">Rekomendasi Utama</div>
                      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-100">Original</div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic leading-tight tracking-tight">{selectedProduct.name}</h2>
                    <p className="text-orange-600 font-black text-2xl mt-2 italic">{formatPrice(selectedProduct.price)}</p>
                  </div>
                  <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-orange-600 transition-colors hidden md:block" onClick={() => setSelectedProduct(null)}>
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100 pb-2">
                    <Info size={14} /> Deskripsi Produk
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedProduct.description || "Produk pilihan terbaik yang telah dikurasi oleh tim kami. Memiliki rating tinggi dan ulasan positif dari ribuan pembeli di Shopee. Kualitas terjamin dan pengiriman cepat."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Badge icon={<ShieldCheck size={14}/>} text="Garansi Ori" />
                  <Badge icon={<Truck size={14}/>} text="Bebas Ongkir" />
                  <Badge icon={<Clock size={14}/>} text="Stok Ready" />
                  <Badge icon={<Award size={14}/>} text="Best Seller" />
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <button 
                  onClick={() => handleBuyClick(selectedProduct.shopeeLink)}
                  className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-500 transition-all flex items-center justify-center gap-3 uppercase italic"
                >
                  BELI DI SHOPEE <ShoppingBag size={24} />
                </button>
                <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">Aman & Terpercaya via Shopee Mall</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Neat Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 px-4 md:px-10 flex items-center justify-center ${scrolled ? 'pt-2' : 'pt-4 md:pt-6'}`}>
        <div className={`w-full max-w-7xl mx-auto h-14 md:h-16 flex justify-between items-center px-5 md:px-8 rounded-2xl md:rounded-full transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl border border-slate-200 shadow-md' : 'bg-white border border-slate-100 shadow-sm'}`}>
          <div className="flex items-center gap-2 cursor-pointer select-none group" onClick={handleLogoClick}>
            <div className="bg-orange-600 text-white p-1.5 rounded-lg shadow-md transition-transform group-hover:rotate-6">
              <ShieldCheck size={18} strokeWidth={2.5} />
            </div>
            <span className="font-black tracking-tighter text-slate-900 uppercase italic text-lg">BEST<span className="text-orange-600">PICK.</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <NavLink href="#katalog" text="Katalog Viral" />
            <NavLink href="#guide" text="Tips Belanja" />
            <button 
              onClick={() => handleBuyClick()}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-[10px] hover:bg-orange-600 transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-slate-900/10"
            >
              SHOPEE TERLARIS <ChevronRight size={12} />
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden bg-slate-900 text-white p-2 rounded-lg border border-slate-700 shadow-md">
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-4 top-20 bottom-4 w-64 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col justify-between animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
             <nav className="flex flex-col gap-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-50">Menu Pilihan</p>
                <a href="#katalog" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-slate-900 italic uppercase">Katalog Viral</a>
                <a href="#guide" onClick={() => setIsMenuOpen(false)} className="text-lg font-black text-slate-900 italic uppercase">Cara Pilih Barang</a>
             </nav>
             <button onClick={() => handleBuyClick()} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-sm uppercase italic flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20">
                <ShoppingBag size={18} /> LIHAT DI SHOPEE
             </button>
          </div>
        </div>
      )}

      {/* Curated Hero Section */}
      <header className="relative pt-32 pb-16 md:pt-48 md:pb-32 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border border-orange-100">
                <Search size={12} strokeWidth={3} /> SOLUSI BELANJA CERDAS & HEMAT
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase italic">
                  PUSAT KURASI PRODUK <br/>
                  <span className="text-orange-600">SHOPEE TERLARIS</span> <br/>
                  <span className="text-slate-900">DI INDONESIA.</span>
                </h1>
                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Bingung pilih barang di Shopee? Kami sudah pilihkan produk paling <span className="text-slate-900 font-bold underline decoration-orange-400">viral, berkualitas,</span> dan sudah teruji oleh ribuan pembeli agar Anda tidak salah beli.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <button 
                  onClick={() => document.getElementById('katalog')?.scrollIntoView()}
                  className="bg-slate-900 text-white h-14 md:h-16 px-8 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 uppercase italic"
                >
                  CEK KATALOG VIRAL
                  <ArrowRight size={18} />
                </button>
                <div className="flex items-center gap-3 bg-slate-50 px-6 h-14 md:h-16 rounded-xl border border-slate-100">
                   <div className="text-orange-600">
                      <CheckCircle size={20} strokeWidth={2.5} />
                   </div>
                   <div className="text-left">
                      <p className="font-black text-slate-900 text-[10px] uppercase leading-none">100% TERPERCAYA</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">RISET BERDASARKAN ULASAN</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 relative shadow-sm">
                <div className="absolute -top-4 -right-4 bg-orange-600 text-white p-4 rounded-2xl rotate-12 shadow-xl animate-bounce-slow">
                   <TrendingUp size={24} />
                </div>
                <div className="space-y-6">
                   <h3 className="text-xl font-black text-slate-900 uppercase italic">Trending Hari Ini</h3>
                   <div className="space-y-4">
                      <TrendingItem icon="👟" name="Sepatu Sport Viral" count="10k+ Terjual" />
                      <TrendingItem icon="🌧️" name="Jas Hujan Premium" count="8.5k+ Terjual" />
                      <TrendingItem icon="🧴" name="Skincare Korea" count="15k+ Terjual" />
                   </div>
                   <div className="pt-4 border-t border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center italic">Diperbarui setiap jam</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Guide Section */}
      <section id="guide" className="py-20 md:py-28 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
             <div className="space-y-6 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-600">
                   <HelpCircle size={20} strokeWidth={3} />
                   <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none">CARA BIAR <br/>TIDAK SALAH BELI</h2>
                </div>
                <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">Ikuti tips sederhana dari tim kami agar pengalaman belanja Shopee Anda selalu memuaskan dan barang sampai sesuai harapan.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <FeatureCard icon={<CheckCircle2/>} title="Cek Bintang 4.8+" desc="Hanya pilih toko dengan rating minimal 4.8 agar kualitas terjamin." />
                   <FeatureCard icon={<Truck/>} title="Free Ongkir Extra" desc="Cek logo biru pada produk untuk hemat biaya kirim ke seluruh Indo." />
                   <FeatureCard icon={<Award/>} title="Shopee Mall" desc="Wajib utamakan toko Mall jika ingin garansi barang 100% original." />
                   <FeatureCard icon={<Zap/>} title="Flash Sale Mania" desc="Tunggu jam 12 malam untuk diskon gila-gilaan pada produk viral." />
                </div>
             </div>
             
             <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-600/10 blur-[80px] rounded-full"></div>
                <div className="relative z-10 space-y-6">
                   <div className="flex gap-1 text-orange-500">
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                   </div>
                   <h3 className="text-xl md:text-2xl font-black italic tracking-tight uppercase leading-snug">Rekomendasi Minggu Ini:<br/>"Elektronik Rumah Tangga Viral"</h3>
                   <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">Banyak yang bingung pilih Air Fryer atau Blender? Kami sudah tes 10 merek berbeda. Hasilnya, merek di katalog kami adalah yang paling awet dan hemat listrik.</p>
                   <button 
                     onClick={() => handleBuyClick()}
                     className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold text-xs shadow-xl hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2 uppercase italic"
                   >
                      LIHAT PRODUK TERBAIK
                      <ChevronRight size={16} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="katalog" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-16 text-center md:text-left">
             <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-orange-600 font-black text-[9px] uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                   <Zap size={10} /> PRODUK TERLARIS MINGGU INI
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase italic leading-none">KATALOG VIRAL</h2>
             </div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] max-w-xs md:text-right italic">Klik gambar atau tombol untuk cek detail & harga terbaru.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {storedAssets.map((asset) => (
              <div key={asset.id} className="group relative flex flex-col bg-white rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedProduct(asset)}>
                {/* Media Container */}
                <div className="relative aspect-square md:aspect-[3/4] overflow-hidden bg-slate-50">
                  {asset.type === 'video' ? (
                    <video src={asset.dataUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  ) : (
                    <img src={asset.dataUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={asset.name} />
                  )}
                  
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1.5">
                     <div className="bg-white/90 backdrop-blur-sm text-slate-900 px-2 py-0.5 md:px-3 md:py-1 rounded md:rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-sm">
                        TERLARIS
                     </div>
                  </div>

                  {asset.type === 'video' && (
                    <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-orange-600 text-white p-1.5 md:p-2 rounded-lg shadow-lg">
                       <Play size={10} fill="white" className="md:w-3 md:h-3" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                     <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-[8px] md:text-[10px] uppercase tracking-widest shadow-xl hidden md:flex items-center justify-center gap-2">
                        LIHAT DETAIL <ChevronRight size={12} />
                     </button>
                  </div>
                </div>
                
                {/* Product Detail */}
                <div className="p-3 md:p-6 space-y-2 md:space-y-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-[10px] md:text-sm font-black text-slate-800 tracking-tight uppercase italic line-clamp-2 leading-tight">
                      {asset.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                       <div className="flex text-yellow-400">
                          {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="currentColor" className="md:w-2.5 md:h-2.5" />)}
                       </div>
                       <span className="text-[7px] md:text-[8px] font-black text-slate-300 uppercase">4.9/5 Rating</span>
                    </div>
                  </div>

                  <div className="pt-2 md:pt-4 border-t border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <span className="block text-[7px] text-slate-300 font-bold uppercase tracking-tight mb-0.5">HARGA DISKON</span>
                      <span className="text-xs md:text-base font-black text-orange-600 tracking-tight italic leading-none">
                        {formatPrice(asset.price)}
                      </span>
                    </div>
                    <button 
                      className="w-full md:w-auto bg-slate-900 text-white p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center"
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(asset); }}
                    >
                      <ShoppingBag size={14} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {storedAssets.length === 0 && (
            <div className="py-24 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                 <ShoppingBag className="text-slate-200" size={24} />
               </div>
               <p className="text-slate-300 font-bold uppercase italic tracking-widest text-[9px]">Produk rekomendasi sedang diproses...</p>
            </div>
          )}
        </div>
      </section>

      {/* Floating Action Mobile */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-3 rounded-2xl shadow-2xl flex justify-between items-center px-5">
         <div className="flex flex-col">
            <span className="text-[7px] text-slate-400 font-black uppercase">Promo Viral</span>
            <span className="text-xs font-black text-white italic tracking-tighter">Cek Keranjang Shopee</span>
         </div>
         <button onClick={() => handleBuyClick()} className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase italic flex items-center gap-2 shadow-lg shadow-orange-600/20">
            LIHAT SEMUA <ChevronRight size={12} />
         </button>
      </div>

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6 md:px-10 text-center space-y-10">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase italic leading-none">BELANJA JADI <br/><span className="text-orange-600">LEBIH MUDAH.</span></h2>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-lg mx-auto italic">Berhenti membuang uang untuk barang zonk. Percayakan belanja Anda pada kurasi tim ahli kami.</p>
            
            <button onClick={() => handleBuyClick()} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-base shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 uppercase italic mx-auto">
               <ShoppingBag size={20} /> MULAI BELANJA CERDAS
            </button>
            
            <div className="pt-20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
               <div className="flex items-center gap-2">
                  <div className="bg-slate-900 text-white p-1 rounded-md"><ShieldCheck size={16}/></div>
                  <span className="font-black italic text-sm uppercase tracking-tight">BEST PICK OFFICIAL</span>
               </div>
               <p className="text-[8px] font-black uppercase tracking-[0.3em] text-center">© 2024 KURASI SHOPEE TERBAIK • INDONESIA</p>
               <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-md bg-slate-200"></div>
                  <div className="w-5 h-5 rounded-md bg-slate-200"></div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

const NavLink = ({ href, text }: { href: string, text: string }) => (
  <a href={href} className="text-[9px] font-black text-slate-400 hover:text-orange-600 transition-colors uppercase tracking-[0.2em] italic">{text}</a>
);

const TrendingItem = ({ icon, name, count }: { icon: string, name: string, count: string }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 hover:border-orange-200 transition-colors">
     <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold text-slate-800 uppercase tracking-tight italic">{name}</span>
     </div>
     <span className="text-[8px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{count}</span>
  </div>
);

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-orange-100 transition-all text-left group">
     <div className="text-orange-600 mb-2 group-hover:scale-110 transition-transform inline-block">
       {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: 3 })}
     </div>
     <h4 className="text-[10px] font-black text-slate-900 uppercase italic tracking-tight mb-0.5">{title}</h4>
     <p className="text-[9px] text-slate-400 font-medium leading-snug">{desc}</p>
  </div>
);

const Badge = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
    <div className="text-orange-600">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-tight text-slate-900">{text}</span>
  </div>
);

export default App;