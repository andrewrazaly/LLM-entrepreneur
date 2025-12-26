// Local storage utilities for persisting data

import { InventoryItem, Supplier, Transaction, Goal } from '@/types';

const STORAGE_KEYS = {
  INVENTORY: 'resale_inventory',
  SUPPLIERS: 'resale_suppliers',
  TRANSACTIONS: 'resale_transactions',
  GOALS: 'resale_goals'
};

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from storage: ${error}`);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to storage: ${error}`);
  }
}

// Inventory functions
export function getInventory(): InventoryItem[] {
  return getFromStorage<InventoryItem[]>(STORAGE_KEYS.INVENTORY, []);
}

export function saveInventory(items: InventoryItem[]): void {
  saveToStorage(STORAGE_KEYS.INVENTORY, items);
}

export function addInventoryItem(item: InventoryItem): void {
  const items = getInventory();
  items.push(item);
  saveInventory(items);
}

export function updateInventoryItem(id: string, updates: Partial<InventoryItem>): void {
  const items = getInventory();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    saveInventory(items);
  }
}

export function deleteInventoryItem(id: string): void {
  const items = getInventory();
  const filtered = items.filter(item => item.id !== id);
  saveInventory(filtered);
}

// Supplier functions
export function getSuppliers(): Supplier[] {
  return getFromStorage<Supplier[]>(STORAGE_KEYS.SUPPLIERS, []);
}

export function saveSuppliers(suppliers: Supplier[]): void {
  saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
}

export function addSupplier(supplier: Supplier): void {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveSuppliers(suppliers);
}

export function updateSupplier(id: string, updates: Partial<Supplier>): void {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(s => s.id === id);
  if (index !== -1) {
    suppliers[index] = { ...suppliers[index], ...updates };
    saveSuppliers(suppliers);
  }
}

export function deleteSupplier(id: string): void {
  const suppliers = getSuppliers();
  const filtered = suppliers.filter(s => s.id !== id);
  saveSuppliers(filtered);
}

// Transaction functions
export function getTransactions(): Transaction[] {
  return getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

export function saveTransactions(transactions: Transaction[]): void {
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
}

export function addTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  saveTransactions(filtered);
}

// Goal functions
export function getGoals(): Goal[] {
  return getFromStorage<Goal[]>(STORAGE_KEYS.GOALS, []);
}

export function saveGoals(goals: Goal[]): void {
  saveToStorage(STORAGE_KEYS.GOALS, goals);
}

export function addGoal(goal: Goal): void {
  const goals = getGoals();
  goals.push(goal);
  saveGoals(goals);
}

export function updateGoal(id: string, updates: Partial<Goal>): void {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates };
    saveGoals(goals);
  }
}

export function deleteGoal(id: string): void {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  saveGoals(filtered);
}

// Export all data
export function exportData() {
  return {
    inventory: getInventory(),
    suppliers: getSuppliers(),
    transactions: getTransactions(),
    goals: getGoals(),
    exportDate: new Date().toISOString()
  };
}

// Import all data
export function importData(data: any) {
  if (data.inventory) saveInventory(data.inventory);
  if (data.suppliers) saveSuppliers(data.suppliers);
  if (data.transactions) saveTransactions(data.transactions);
  if (data.goals) saveGoals(data.goals);
}
