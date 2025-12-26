'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Inventory from '@/components/Inventory';
import Suppliers from '@/components/Suppliers';
import ListingOptimizer from '@/components/ListingOptimizer';
import Goals from '@/components/Goals';
import AIAgent from '@/components/AIAgent';

type Tab = 'dashboard' | 'inventory' | 'suppliers' | 'optimizer' | 'goals' | 'ai-agent';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Resale Business Dashboard</h1>
          <p className="text-slate-600 mt-1">From flipping to building your brand</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            <TabButton
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              icon="📊"
            >
              Dashboard
            </TabButton>
            <TabButton
              active={activeTab === 'inventory'}
              onClick={() => setActiveTab('inventory')}
              icon="📦"
            >
              Inventory
            </TabButton>
            <TabButton
              active={activeTab === 'suppliers'}
              onClick={() => setActiveTab('suppliers')}
              icon="🏭"
            >
              Suppliers
            </TabButton>
            <TabButton
              active={activeTab === 'optimizer'}
              onClick={() => setActiveTab('optimizer')}
              icon="✨"
            >
              Listing Optimizer
            </TabButton>
            <TabButton
              active={activeTab === 'goals'}
              onClick={() => setActiveTab('goals')}
              icon="🎯"
            >
              Goals
            </TabButton>
            <TabButton
              active={activeTab === 'ai-agent'}
              onClick={() => setActiveTab('ai-agent')}
              icon="🤖"
            >
              AI Agent
            </TabButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'suppliers' && <Suppliers />}
        {activeTab === 'optimizer' && <ListingOptimizer />}
        {activeTab === 'goals' && <Goals />}
        {activeTab === 'ai-agent' && <AIAgent />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-slate-600 text-sm">
          <p>Built to help you get rich through strategic reselling</p>
        </div>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </button>
  );
}
