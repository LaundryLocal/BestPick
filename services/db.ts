import { StoredAsset, DEFAULT_SHOPEE_LINK } from '../types';

const DB_NAME = 'GoldentAffiliateDB';
const STORE_NAME = 'assets';
const DB_VERSION = 3; // Bump version for schema change

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error("Gagal membuka database: " + request.error?.message));
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveAsset = async (file: File): Promise<StoredAsset> => {
  return new Promise((resolve, reject) => {
    if (file.size > 50 * 1024 * 1024) {
      return reject(new Error("File terlalu besar (Maksimal 50MB)"));
    }

    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const db = await initDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const type = file.type.startsWith('video/') ? 'video' : 'image';

        const newAsset: StoredAsset = {
          id: crypto.randomUUID(),
          dataUrl: reader.result as string,
          name: "Produk Baru", 
          price: "89000",
          shopeeLink: DEFAULT_SHOPEE_LINK,
          type: type,
          timestamp: Date.now()
        };

        const request = store.add(newAsset);
        
        request.onsuccess = () => resolve(newAsset);
        request.onerror = () => {
          if (request.error?.name === 'QuotaExceededError') {
            reject(new Error("Penyimpanan Browser Penuh. Hapus beberapa produk lama."));
          } else {
            reject(new Error("Gagal menyimpan ke Database: " + request.error?.message));
          }
        };
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Terjadi kesalahan saat memproses file."));
      }
    };

    reader.onerror = () => reject(new Error("Gagal membaca file dari perangkat Anda."));
    reader.readAsDataURL(file);
  });
};

export const updateAsset = async (asset: StoredAsset): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(asset);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error("Gagal memperbarui data: " + request.error?.message));
  });
};

export const getAllAssets = async (): Promise<StoredAsset[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result as StoredAsset[];
      const processed = results.map(item => ({
        ...item,
        type: item.type || 'image',
        price: item.price || '89000',
        shopeeLink: item.shopeeLink || DEFAULT_SHOPEE_LINK
      }));
      resolve(processed.sort((a, b) => b.timestamp - a.timestamp));
    };
    request.onerror = () => reject(new Error("Gagal mengambil data: " + request.error?.message));
  });
};

export const deleteAsset = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error("Gagal menghapus data: " + request.error?.message));
  });
};