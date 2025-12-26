// Business calculations and utilities

import { EbayFees, ProfitCalculation, InventoryItem } from '@/types';

/**
 * Calculate eBay fees for a sale
 * Based on current eBay fee structure (as of 2025)
 */
export function calculateEbayFees(salePrice: number, category: string = 'clothing'): EbayFees {
  // No insertion fees for most listings now
  const insertionFee = 0;

  // Final value fee (typically 12.9% for most categories, varies by category)
  const finalValueFeeRate = category === 'clothing' ? 0.129 : 0.129;
  const finalValueFee = salePrice * finalValueFeeRate;

  // Payment processing fee (2.35% + $0.30)
  const paymentProcessingFee = (salePrice * 0.0235) + 0.30;

  const total = insertionFee + finalValueFee + paymentProcessingFee;

  return {
    insertionFee,
    finalValueFee,
    paymentProcessingFee,
    total
  };
}

/**
 * Calculate profit for a single item
 */
export function calculateItemProfit(
  purchasePrice: number,
  sellPrice: number,
  category: string = 'clothing',
  shippingCost: number = 0,
  otherExpenses: number = 0
): ProfitCalculation {
  const ebayFees = calculateEbayFees(sellPrice, category);

  const revenue = sellPrice;
  const costOfGoods = purchasePrice;
  const shipping = shippingCost;
  const netProfit = revenue - costOfGoods - ebayFees.total - shipping - otherExpenses;
  const profitMargin = (netProfit / revenue) * 100;

  return {
    revenue,
    costOfGoods,
    ebayFees,
    shipping,
    otherExpenses,
    netProfit,
    profitMargin
  };
}

/**
 * Calculate total inventory value
 */
export function calculateInventoryValue(items: InventoryItem[]): {
  totalInvested: number;
  totalEstimatedValue: number;
  totalSold: number;
  totalProfit: number;
  itemsInStock: number;
  itemsListed: number;
  itemsSold: number;
} {
  let totalInvested = 0;
  let totalEstimatedValue = 0;
  let totalSold = 0;
  let totalProfit = 0;
  let itemsInStock = 0;
  let itemsListed = 0;
  let itemsSold = 0;

  items.forEach(item => {
    totalInvested += item.purchasePrice;

    if (item.status === 'in-stock') {
      itemsInStock++;
      totalEstimatedValue += item.estimatedSellPrice;
    } else if (item.status === 'listed') {
      itemsListed++;
      totalEstimatedValue += item.estimatedSellPrice;
    } else if (item.status === 'sold' && item.actualSellPrice) {
      itemsSold++;
      totalSold += item.actualSellPrice;
      const profit = calculateItemProfit(item.purchasePrice, item.actualSellPrice, item.category);
      totalProfit += profit.netProfit;
    }
  });

  return {
    totalInvested,
    totalEstimatedValue,
    totalSold,
    totalProfit,
    itemsInStock,
    itemsListed,
    itemsSold
  };
}

/**
 * Calculate landed cost for products from suppliers (including shipping, duties, etc.)
 */
export function calculateLandedCost(
  unitPrice: number,
  quantity: number,
  shippingCost: number,
  dutyRate: number = 0.0625, // 6.25% typical for clothing from China to US
  otherFees: number = 0
): {
  subtotal: number;
  shipping: number;
  duties: number;
  totalCost: number;
  costPerUnit: number;
} {
  const subtotal = unitPrice * quantity;
  const shipping = shippingCost;
  const duties = subtotal * dutyRate;
  const totalCost = subtotal + shipping + duties + otherFees;
  const costPerUnit = totalCost / quantity;

  return {
    subtotal,
    shipping,
    duties,
    totalCost,
    costPerUnit
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Calculate days between dates
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
