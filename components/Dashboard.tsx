'use client';

import { useEffect, useState } from 'react';
import { getInventory, getGoals } from '@/lib/storage';
import { calculateInventoryValue, formatCurrency } from '@/lib/calculations';
import { InventoryItem, Goal } from '@/types';

export default function Dashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalEstimatedValue: 0,
    totalSold: 0,
    totalProfit: 0,
    itemsInStock: 0,
    itemsListed: 0,
    itemsSold: 0
  });

  useEffect(() => {
    const items = getInventory();
    const userGoals = getGoals();
    setInventory(items);
    setGoals(userGoals);
    setStats(calculateInventoryValue(items));
  }, []);

  const profitMargin = stats.totalSold > 0 ? (stats.totalProfit / stats.totalSold) * 100 : 0;
  const roi = stats.totalInvested > 0 ? (stats.totalProfit / stats.totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Business Dashboard</h2>
        <p className="text-blue-100">
          Track your journey from eBay flipping to building your own brand. Every item sold gets you closer to your goals.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Invested"
          value={formatCurrency(stats.totalInvested)}
          subtitle="Capital deployed"
          color="blue"
        />
        <MetricCard
          title="Total Profit"
          value={formatCurrency(stats.totalProfit)}
          subtitle={`${roi.toFixed(1)}% ROI`}
          color="green"
        />
        <MetricCard
          title="Items Sold"
          value={stats.itemsSold.toString()}
          subtitle={`${stats.itemsListed} listed, ${stats.itemsInStock} in stock`}
          color="purple"
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(stats.totalSold)}
          subtitle={`${profitMargin.toFixed(1)}% margin`}
          color="yellow"
        />
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Inventory Status</h3>
          <div className="space-y-3">
            <StatusBar
              label="In Stock"
              count={stats.itemsInStock}
              total={inventory.length}
              color="blue"
            />
            <StatusBar
              label="Listed on eBay"
              count={stats.itemsListed}
              total={inventory.length}
              color="purple"
            />
            <StatusBar
              label="Sold"
              count={stats.itemsSold}
              total={inventory.length}
              color="green"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <QuickStat
              label="Estimated Inventory Value"
              value={formatCurrency(stats.totalEstimatedValue)}
            />
            <QuickStat
              label="Average Profit Per Sale"
              value={stats.itemsSold > 0 ? formatCurrency(stats.totalProfit / stats.itemsSold) : '$0.00'}
            />
            <QuickStat
              label="Turn Rate"
              value={inventory.length > 0 ? `${((stats.itemsSold / inventory.length) * 100).toFixed(1)}%` : '0%'}
            />
          </div>
        </div>
      </div>

      {/* Active Goals */}
      {goals.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Goals</h3>
          <div className="space-y-4">
            {goals.slice(0, 3).map(goal => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-slate-700">{goal.title}</span>
                    <span className="text-sm text-slate-600">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {inventory.length === 0 && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Start?</h3>
          <p className="text-slate-600 mb-6">
            Add your first items to inventory to start tracking your resale business
          </p>
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-sm text-slate-700">1. Go to <strong>Inventory</strong> tab</p>
            <p className="text-sm text-slate-700">2. Add your second-hand items with purchase prices</p>
            <p className="text-sm text-slate-700">3. Use <strong>Listing Optimizer</strong> to create eBay listings</p>
            <p className="text-sm text-slate-700">4. Mark items as sold to track profit</p>
            <p className="text-sm text-slate-700">5. Research <strong>Suppliers</strong> for your future brand</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color
}: {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`rounded-lg p-6 border ${colorClasses[color]}`}>
      <p className="text-sm text-slate-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color
}: {
  label: string;
  count: number;
  total: number;
  color: 'blue' | 'purple' | 'green';
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const colorClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-600">{count}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-700">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
