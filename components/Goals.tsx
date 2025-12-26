'use client';

import { useEffect, useState } from 'react';
import { getGoals, addGoal, updateGoal, deleteGoal, getInventory } from '@/lib/storage';
import { calculateInventoryValue } from '@/lib/calculations';
import { Goal } from '@/types';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const userGoals = getGoals();
    const inventory = getInventory();
    const stats = calculateInventoryValue(inventory);

    // Update goals with current values
    const updatedGoals = userGoals.map(goal => {
      let current = goal.current;

      // Auto-update based on type
      if (goal.type === 'revenue') {
        current = stats.totalSold;
      } else if (goal.type === 'profit') {
        current = stats.totalProfit;
      } else if (goal.type === 'items-sold') {
        current = stats.itemsSold;
      }

      return { ...goal, current };
    });

    // Save updated goals
    updatedGoals.forEach(goal => {
      if (goal.current !== userGoals.find(g => g.id === goal.id)?.current) {
        updateGoal(goal.id, { current: goal.current });
      }
    });

    setGoals(updatedGoals);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Goals & Targets</h2>
          <p className="text-slate-600 mt-1">Set milestones and track your progress</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Goal
        </button>
      </div>

      {/* Motivational Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Your Journey to Financial Freedom</h3>
        <p className="text-purple-100">
          Every goal you hit brings you closer to building your brand and achieving wealth.
          Stay focused, stay consistent, and keep pushing forward.
        </p>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <AddGoalForm
          onClose={() => setShowAddForm(false)}
          onAdd={(goal) => {
            addGoal(goal);
            loadGoals();
            setShowAddForm(false);
          }}
        />
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-3 bg-white rounded-lg p-8 shadow-sm border border-slate-200 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Goals Set</h3>
            <p className="text-slate-600 mb-6">
              Set your first goal to start tracking your progress
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <p className="text-sm text-slate-700 font-medium">Goal Ideas:</p>
              <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                <li>Monthly Revenue: $1,000 per month</li>
                <li>Monthly Profit: $500 per month</li>
                <li>Items Sold: 20 items this month</li>
                <li>Inventory Value: Build up to $2,000 in stock</li>
                <li>Supplier Research: Contact 5 manufacturers</li>
              </ul>
            </div>
          </div>
        ) : (
          goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onDelete={() => {
                if (confirm('Are you sure you want to delete this goal?')) {
                  deleteGoal(goal.id);
                  loadGoals();
                }
              }}
            />
          ))
        )}
      </div>

      {/* Suggested Goals for Beginners */}
      {goals.length < 3 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-3">Suggested Goals for Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <h4 className="font-medium text-slate-900 mb-2">Phase 1: eBay Flipping</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Sell first 10 items</li>
                <li>Generate $500 in revenue</li>
                <li>Achieve $200 in profit</li>
                <li>Maintain 40% profit margin</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <h4 className="font-medium text-slate-900 mb-2">Phase 2: Scale & Preparation</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>$2,000 monthly revenue</li>
                <li>$1,000 monthly profit</li>
                <li>Research 10 suppliers</li>
                <li>Save $3,000 for first order</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: () => void }) {
  const progress = (goal.current / goal.target) * 100;
  const isComplete = progress >= 100;

  const typeIcons = {
    revenue: '💰',
    profit: '📈',
    'items-sold': '📦',
    custom: '🎯'
  };

  const typeColors = {
    revenue: 'from-green-500 to-emerald-500',
    profit: 'from-blue-500 to-cyan-500',
    'items-sold': 'from-purple-500 to-pink-500',
    custom: 'from-orange-500 to-red-500'
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border-2 ${isComplete ? 'border-green-500' : 'border-slate-200'} relative overflow-hidden`}>
      {/* Background gradient */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${typeColors[goal.type]}`} />

      <div className="flex justify-between items-start mb-4 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeIcons[goal.type]}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{goal.title}</h3>
            <p className="text-xs text-slate-500 capitalize">{goal.period} Goal</p>
          </div>
        </div>
        {isComplete && (
          <span className="text-2xl">✅</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium text-slate-900">{Math.min(progress, 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all bg-gradient-to-r ${typeColors[goal.type]}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 text-slate-500">
          <span>{goal.current.toLocaleString()}</span>
          <span>{goal.target.toLocaleString()}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Remaining:</span>
          <span className="font-medium text-slate-900">
            {Math.max(0, goal.target - goal.current).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Deadline:</span>
          <span className={`font-medium ${daysUntilDeadline < 7 ? 'text-red-600' : 'text-slate-900'}`}>
            {daysUntilDeadline > 0 ? `${daysUntilDeadline} days` : 'Overdue'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onDelete}
        className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
      >
        Delete Goal
      </button>
    </div>
  );
}

function AddGoalForm({ onClose, onAdd }: { onClose: () => void; onAdd: (goal: Goal) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'revenue' as Goal['type'],
    target: '',
    period: 'monthly' as Goal['period'],
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      target: parseFloat(formData.target),
      current: 0,
      period: formData.period,
      deadline: formData.deadline
    };

    onAdd(newGoal);
  };

  // Set default deadline based on period
  useEffect(() => {
    if (!formData.deadline) {
      const today = new Date();
      let defaultDate = new Date();

      switch (formData.period) {
        case 'daily':
          defaultDate.setDate(today.getDate() + 1);
          break;
        case 'weekly':
          defaultDate.setDate(today.getDate() + 7);
          break;
        case 'monthly':
          defaultDate.setMonth(today.getMonth() + 1);
          break;
        case 'yearly':
          defaultDate.setFullYear(today.getFullYear() + 1);
          break;
      }

      setFormData(prev => ({ ...prev, deadline: defaultDate.toISOString().split('T')[0] }));
    }
  }, [formData.period]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Goal</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Monthly Revenue Target"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Goal Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Goal['type'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="revenue">Revenue (auto-tracked)</option>
              <option value="profit">Profit (auto-tracked)</option>
              <option value="items-sold">Items Sold (auto-tracked)</option>
              <option value="custom">Custom (manual)</option>
            </select>
            {formData.type !== 'custom' && (
              <p className="text-xs text-blue-600 mt-1">This goal will automatically update based on your sales</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Period *</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as Goal['period'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deadline *</label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
