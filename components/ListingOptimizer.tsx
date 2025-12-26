'use client';

import { useState } from 'react';
import { calculateItemProfit, formatCurrency } from '@/lib/calculations';

export default function ListingOptimizer() {
  const [formData, setFormData] = useState({
    itemName: '',
    brand: '',
    category: 'clothing',
    condition: 'good',
    size: '',
    color: '',
    features: '',
    purchasePrice: '',
    targetProfit: '',
    shippingCost: ''
  });

  const [generatedListing, setGeneratedListing] = useState<{
    title: string;
    description: string;
    suggestedPrice: number;
    profitAnalysis: any;
  } | null>(null);

  const handleGenerate = () => {
    const purchasePrice = parseFloat(formData.purchasePrice) || 0;
    const targetProfit = parseFloat(formData.targetProfit) || 0;
    const shippingCost = parseFloat(formData.shippingCost) || 0;

    // Calculate suggested price to hit target profit
    let suggestedPrice = purchasePrice + targetProfit;

    // Iterate to find price that gives us target profit after fees
    for (let i = 0; i < 10; i++) {
      const profit = calculateItemProfit(purchasePrice, suggestedPrice, formData.category, shippingCost);
      if (profit.netProfit < targetProfit) {
        suggestedPrice += (targetProfit - profit.netProfit);
      } else {
        break;
      }
    }

    const profitAnalysis = calculateItemProfit(purchasePrice, suggestedPrice, formData.category, shippingCost);

    // Generate optimized title (80 chars max for eBay)
    const titleParts = [
      formData.brand,
      formData.itemName,
      formData.size,
      formData.color,
      formData.condition !== 'good' ? formData.condition.toUpperCase() : ''
    ].filter(Boolean);

    const title = titleParts.join(' ').substring(0, 80);

    // Generate compelling description
    const description = generateDescription(formData);

    setGeneratedListing({
      title,
      description,
      suggestedPrice,
      profitAnalysis
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">eBay Listing Optimizer</h2>
        <p className="text-slate-600 mt-1">Generate compelling titles and descriptions that sell</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Item Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Item Name *</label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Vintage Hoodie, Running Shoes"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nike, Adidas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="M, L, XL, 10..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Black, Blue..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="new">New with tags</option>
                <option value="like-new">Like new</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Key Features</label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="e.g., Vintage style, rare colorway, limited edition, perfect for..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Profit</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetProfit}
                  onChange={(e) => setFormData({ ...formData, targetProfit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="15.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Shipping</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.shippingCost}
                  onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Listing
            </button>
          </div>
        </div>

        {/* Generated Output */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Generated Listing</h3>

          {!generatedListing ? (
            <div className="text-center py-12 text-slate-500">
              <p>Fill in the item details and click Generate Listing to create your optimized eBay listing</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Optimized Title</label>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="font-medium text-slate-900">{generatedListing.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{generatedListing.title.length} / 80 characters</p>
                </div>
              </div>

              {/* Price & Profit */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-900">Suggested Price:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(generatedListing.suggestedPrice)}
                  </span>
                </div>
                <div className="text-xs space-y-1 text-green-800">
                  <div className="flex justify-between">
                    <span>eBay Fees:</span>
                    <span>{formatCurrency(generatedListing.profitAnalysis.ebayFees.total)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-green-300 pt-1">
                    <span>Net Profit:</span>
                    <span>{formatCurrency(generatedListing.profitAnalysis.netProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin:</span>
                    <span>{generatedListing.profitAnalysis.profitMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-80 overflow-y-auto">
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: generatedListing.description.replace(/\n/g, '<br />') }} />
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${generatedListing.title}\n\n${generatedListing.description}`);
                  alert('Listing copied to clipboard!');
                }}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">eBay Listing Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <strong>Title Optimization:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Use all 80 characters</li>
              <li>Include brand, size, color</li>
              <li>Add keywords buyers search for</li>
              <li>Avoid special characters</li>
            </ul>
          </div>
          <div>
            <strong>Photography:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Use natural lighting</li>
              <li>Take 6-12 photos</li>
              <li>Show all angles & details</li>
              <li>Include tags/labels</li>
            </ul>
          </div>
          <div>
            <strong>Pricing Strategy:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Research completed listings</li>
              <li>Factor in all fees</li>
              <li>Consider offering free shipping</li>
              <li>Use Best Offer feature</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateDescription(formData: any): string {
  const conditionDescriptions = {
    'new': 'Brand new with tags, never worn',
    'like-new': 'Like new condition, barely worn with no visible signs of wear',
    'excellent': 'Excellent condition with minimal signs of wear',
    'good': 'Good condition with normal signs of wear',
    'fair': 'Fair condition with noticeable signs of wear'
  };

  const parts = [];

  // Opening
  parts.push(`${formData.brand ? formData.brand + ' ' : ''}${formData.itemName}${formData.size ? ' - Size ' + formData.size : ''}${formData.color ? ' - ' + formData.color : ''}`);
  parts.push('');

  // Condition
  parts.push('CONDITION:');
  parts.push(conditionDescriptions[formData.condition as keyof typeof conditionDescriptions] || conditionDescriptions.good);
  parts.push('');

  // Features
  if (formData.features) {
    parts.push('FEATURES:');
    parts.push(formData.features);
    parts.push('');
  }

  // Details
  const details = [];
  if (formData.brand) details.push(`Brand: ${formData.brand}`);
  if (formData.size) details.push(`Size: ${formData.size}`);
  if (formData.color) details.push(`Color: ${formData.color}`);

  if (details.length > 0) {
    parts.push('DETAILS:');
    parts.push(details.join(' | '));
    parts.push('');
  }

  // Closing
  parts.push('SHIPPING:');
  parts.push('Fast shipping from a smoke-free home. Items are carefully packaged to ensure they arrive in perfect condition.');
  parts.push('');
  parts.push('Feel free to message with any questions. Check out my other listings for more great deals!');
  parts.push('');
  parts.push('Thanks for looking!');

  return parts.join('\n');
}
