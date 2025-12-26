'use client';

import { useEffect, useState } from 'react';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/lib/storage';
import { calculateItemProfit, formatCurrency } from '@/lib/calculations';
import { InventoryItem } from '@/types';

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in-stock' | 'listed' | 'sold'>('all');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    setItems(getInventory());
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Item
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          All ({items.length})
        </FilterButton>
        <FilterButton active={filter === 'in-stock'} onClick={() => setFilter('in-stock')}>
          In Stock ({items.filter(i => i.status === 'in-stock').length})
        </FilterButton>
        <FilterButton active={filter === 'listed'} onClick={() => setFilter('listed')}>
          Listed ({items.filter(i => i.status === 'listed').length})
        </FilterButton>
        <FilterButton active={filter === 'sold'} onClick={() => setFilter('sold')}>
          Sold ({items.filter(i => i.status === 'sold').length})
        </FilterButton>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <AddItemForm
          onClose={() => setShowAddForm(false)}
          onAdd={(item) => {
            addInventoryItem(item);
            loadInventory();
            setShowAddForm(false);
          }}
        />
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Purchase Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Sell Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No items found. Add your first item to get started.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <InventoryRow
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => {
                      updateInventoryItem(item.id, updates);
                      loadInventory();
                    }}
                    onDelete={() => {
                      if (confirm('Are you sure you want to delete this item?')) {
                        deleteInventoryItem(item.id);
                        loadInventory();
                      }
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventoryRow({
  item,
  onUpdate,
  onDelete
}: {
  item: InventoryItem;
  onUpdate: (updates: Partial<InventoryItem>) => void;
  onDelete: () => void;
}) {
  const profit = item.actualSellPrice
    ? calculateItemProfit(item.purchasePrice, item.actualSellPrice, item.category)
    : null;

  const statusColors = {
    'in-stock': 'bg-blue-100 text-blue-800',
    'listed': 'bg-purple-100 text-purple-800',
    'sold': 'bg-green-100 text-green-800'
  };

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <div>
          <div className="font-medium text-slate-900">{item.name}</div>
          {item.brand && <div className="text-sm text-slate-500">{item.brand}</div>}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 capitalize">{item.category}</td>
      <td className="px-4 py-3 text-sm text-slate-900">{formatCurrency(item.purchasePrice)}</td>
      <td className="px-4 py-3 text-sm text-slate-900">
        {item.actualSellPrice ? formatCurrency(item.actualSellPrice) : formatCurrency(item.estimatedSellPrice)}
      </td>
      <td className="px-4 py-3 text-sm">
        {profit ? (
          <div className={profit.netProfit > 0 ? 'text-green-600' : 'text-red-600'}>
            {formatCurrency(profit.netProfit)}
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3">
        <select
          value={item.status}
          onChange={(e) => onUpdate({ status: e.target.value as InventoryItem['status'] })}
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}
        >
          <option value="in-stock">In Stock</option>
          <option value="listed">Listed</option>
          <option value="sold">Sold</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function AddItemForm({
  onClose,
  onAdd
}: {
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'clothing' as InventoryItem['category'],
    brand: '',
    size: '',
    condition: 'good' as InventoryItem['condition'],
    purchasePrice: '',
    estimatedSellPrice: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      brand: formData.brand || undefined,
      size: formData.size || undefined,
      condition: formData.condition,
      purchasePrice: parseFloat(formData.purchasePrice),
      estimatedSellPrice: parseFloat(formData.estimatedSellPrice),
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'in-stock',
      notes: formData.notes || undefined
    };

    onAdd(newItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Item</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Item Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Vintage Nike Hoodie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryItem['category'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="clothing">Clothing</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Nike, Adidas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., M, L, XL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition *</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as InventoryItem['condition'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Sell Price *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.estimatedSellPrice}
                onChange={(e) => setFormData({ ...formData, estimatedSellPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="30.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Any additional details..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}
