// Core business types for the resale business dashboard

export interface InventoryItem {
  id: string;
  name: string;
  category: 'clothing' | 'shoes' | 'accessories' | 'other';
  brand?: string;
  size?: string;
  condition: 'new' | 'like-new' | 'excellent' | 'good' | 'fair';
  purchasePrice: number;
  purchaseDate: string;
  estimatedSellPrice: number;
  actualSellPrice?: number;
  soldDate?: string;
  status: 'in-stock' | 'listed' | 'sold';
  ebayListingUrl?: string;
  photos?: string[];
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  productTypes: string[];
  minimumOrderQuantity: number;
  unitPrice: number;
  shippingCost: number;
  leadTimeDays: number;
  notes?: string;
  rating?: number;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'expense';
  date: string;
  amount: number;
  itemId?: string;
  description: string;
  category: string;
}

export interface Goal {
  id: string;
  title: string;
  type: 'revenue' | 'profit' | 'items-sold' | 'custom';
  target: number;
  current: number;
  deadline: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface EbayFees {
  insertionFee: number;
  finalValueFee: number;
  paymentProcessingFee: number;
  total: number;
}

export interface ProfitCalculation {
  revenue: number;
  costOfGoods: number;
  ebayFees: EbayFees;
  shipping: number;
  otherExpenses: number;
  netProfit: number;
  profitMargin: number;
}
