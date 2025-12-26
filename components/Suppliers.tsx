'use client';

import { useEffect, useState } from 'react';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from '@/lib/storage';
import { calculateLandedCost, formatCurrency } from '@/lib/calculations';
import { Supplier } from '@/types';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = () => {
    setSuppliers(getSuppliers());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Supplier Management</h2>
          <p className="text-slate-600 mt-1">Research and track manufacturers for your future brand</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Supplier
        </button>
      </div>

      {/* Add Supplier Form */}
      {showAddForm && (
        <AddSupplierForm
          onClose={() => setShowAddForm(false)}
          onAdd={(supplier) => {
            addSupplier(supplier);
            loadSuppliers();
            setShowAddForm(false);
          }}
        />
      )}

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suppliers.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg p-8 shadow-sm border border-slate-200 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Suppliers Yet</h3>
            <p className="text-slate-600 mb-6">
              Start researching manufacturers to prepare for building your brand
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <p className="text-sm text-slate-700">Popular sourcing platforms:</p>
              <ul className="text-sm text-slate-600 list-disc list-inside">
                <li>Alibaba.com - Wide range of Chinese manufacturers</li>
                <li>Made-in-China.com - Quality verified suppliers</li>
                <li>Global Sources - Trade shows and verified suppliers</li>
                <li>IndiaMART - Indian manufacturers</li>
                <li>ThomasNet - US & North American suppliers</li>
              </ul>
            </div>
          </div>
        ) : (
          suppliers.map(supplier => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onSelect={() => setSelectedSupplier(supplier)}
              onDelete={() => {
                if (confirm('Are you sure you want to delete this supplier?')) {
                  deleteSupplier(supplier.id);
                  loadSuppliers();
                }
              }}
            />
          ))
        )}
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <SupplierDetailModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}

      {/* Tips Section */}
      {suppliers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Supplier Research Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Due Diligence:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Request samples before bulk orders</li>
                <li>Verify business licenses</li>
                <li>Check reviews and references</li>
                <li>Use trade assurance programs</li>
              </ul>
            </div>
            <div>
              <strong>Negotiation:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Compare multiple suppliers</li>
                <li>Negotiate MOQ and pricing</li>
                <li>Discuss payment terms</li>
                <li>Clarify shipping and customs</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SupplierCard({
  supplier,
  onSelect,
  onDelete
}: {
  supplier: Supplier;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const landedCost = calculateLandedCost(supplier.unitPrice, supplier.minimumOrderQuantity, supplier.shippingCost);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{supplier.name}</h3>
          <p className="text-sm text-slate-600">{supplier.country}</p>
        </div>
        {supplier.rating && (
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
            <span className="text-yellow-600">★</span>
            <span className="text-sm font-medium text-yellow-700">{supplier.rating}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">MOQ:</span>
          <span className="font-medium text-slate-900">{supplier.minimumOrderQuantity} units</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Unit Price:</span>
          <span className="font-medium text-slate-900">{formatCurrency(supplier.unitPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Landed Cost/Unit:</span>
          <span className="font-medium text-blue-600">{formatCurrency(landedCost.costPerUnit)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Total Investment:</span>
          <span className="font-medium text-slate-900">{formatCurrency(landedCost.totalCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Lead Time:</span>
          <span className="font-medium text-slate-900">{supplier.leadTimeDays} days</span>
        </div>
      </div>

      {supplier.productTypes.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-600 mb-2">Product Types:</p>
          <div className="flex flex-wrap gap-1">
            {supplier.productTypes.map((type, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-slate-200">
        <button
          onClick={onSelect}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          View Details
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function AddSupplierForm({
  onClose,
  onAdd
}: {
  onClose: () => void;
  onAdd: (supplier: Supplier) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    productTypes: '',
    minimumOrderQuantity: '',
    unitPrice: '',
    shippingCost: '',
    leadTimeDays: '',
    rating: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: formData.name,
      country: formData.country,
      contactEmail: formData.contactEmail || undefined,
      contactPhone: formData.contactPhone || undefined,
      website: formData.website || undefined,
      productTypes: formData.productTypes.split(',').map(t => t.trim()).filter(t => t),
      minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
      unitPrice: parseFloat(formData.unitPrice),
      shippingCost: parseFloat(formData.shippingCost),
      leadTimeDays: parseInt(formData.leadTimeDays),
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      notes: formData.notes || undefined
    };

    onAdd(newSupplier);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Supplier</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Guangzhou Textiles Co."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., China, India, USA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="contact@supplier.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+86 123 456 7890"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://supplier.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Types (comma separated)</label>
              <input
                type="text"
                value={formData.productTypes}
                onChange={(e) => setFormData({ ...formData, productTypes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., T-shirts, Hoodies, Jackets"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Order Quantity *</label>
              <input
                type="number"
                required
                value={formData.minimumOrderQuantity}
                onChange={(e) => setFormData({ ...formData, minimumOrderQuantity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5.50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Cost (Total) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.shippingCost}
                onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="250.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lead Time (Days) *</label>
              <input
                type="number"
                required
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="4.5"
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
              placeholder="Quality notes, communication experience, etc."
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
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SupplierDetailModal({ supplier, onClose }: { supplier: Supplier; onClose: () => void }) {
  const landedCost = calculateLandedCost(supplier.unitPrice, supplier.minimumOrderQuantity, supplier.shippingCost);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{supplier.name}</h3>
            <p className="text-slate-600">{supplier.country}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              {supplier.contactEmail && (
                <p><strong>Email:</strong> {supplier.contactEmail}</p>
              )}
              {supplier.contactPhone && (
                <p><strong>Phone:</strong> {supplier.contactPhone}</p>
              )}
              {supplier.website && (
                <p><strong>Website:</strong> <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{supplier.website}</a></p>
              )}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Cost Breakdown (MOQ Order)</h4>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({supplier.minimumOrderQuantity} units @ {formatCurrency(supplier.unitPrice)}):</span>
                <span className="font-medium">{formatCurrency(landedCost.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">{formatCurrency(landedCost.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Duties (6.25%):</span>
                <span className="font-medium">{formatCurrency(landedCost.duties)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-300 pt-2 font-bold">
                <span>Total Landed Cost:</span>
                <span>{formatCurrency(landedCost.totalCost)}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>Cost Per Unit:</span>
                <span className="font-bold">{formatCurrency(landedCost.costPerUnit)}</span>
              </div>
            </div>
          </div>

          {/* Product Types */}
          {supplier.productTypes.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Product Types</h4>
              <div className="flex flex-wrap gap-2">
                {supplier.productTypes.map((type, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {supplier.notes && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Notes</h4>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4">{supplier.notes}</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
