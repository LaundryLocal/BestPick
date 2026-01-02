import React from 'react';

export interface StoredAsset {
  id: string;
  dataUrl: string; // Base64
  name: string;
  price: string;
  description?: string; // New: Full product description
  shopeeLink?: string; // Custom link per item
  type: 'image' | 'video';
  timestamp: number;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const DEFAULT_SHOPEE_LINK = "https://s.shopee.co.id/W04sJAjDP";