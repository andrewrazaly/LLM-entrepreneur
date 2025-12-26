'use client';

import { useState, useEffect } from 'react';
import { AgentConfig, ProductOpportunity, AgentDecision } from '@/lib/ai-agent/types';

export default function AIAgent() {
  const [agent, setAgent] = useState<AgentConfig>({
    id: 'main-agent',
    name: 'Business Growth Agent',
    enabled: false,
    budget: {
      daily: 50,
      perItem: 20,
      total: 500
    },
    strategy: 'balanced',
    targetMargin: 40,
    autoListings: false,
    autoPurchase: false,
    riskTolerance: 'medium'
  });

  const [opportunities, setOpportunities] = useState<ProductOpportunity[]>([]);
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [isResearching, setIsResearching] = useState(false);

  const runResearch = async () => {
    setIsResearching(true);

    // Simulate AI research
    setTimeout(() => {
      const mockOpportunities: ProductOpportunity[] = [
        {
          id: '1',
          name: 'Vintage Nike Air Jordan 1 (1985-2000)',
          category: 'shoes',
          estimatedCost: 30,
          estimatedSellPrice: 120,
          projectedProfit: 75,
          profitMargin: 62.5,
          demandScore: 95,
          competitionScore: 45,
          confidenceScore: 88,
          source: 'AI Market Analysis',
          reasoning: 'Classic sneakers have consistent demand. Original Air Jordans from 85-2000 era sell for premium prices. Low supply + high nostalgia = strong margins.',
          dataPoints: {
            averageSoldPrice: 120,
            soldCount30Days: 450,
            activeListings: 80,
            trendingScore: 92
          },
          recommended: true,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Carhartt Vintage Work Jackets',
          category: 'clothing',
          estimatedCost: 15,
          estimatedSellPrice: 60,
          projectedProfit: 38,
          profitMargin: 63.3,
          demandScore: 85,
          competitionScore: 35,
          confidenceScore: 82,
          source: 'AI Market Analysis',
          reasoning: 'Workwear trend is strong. Vintage Carhartt has cult following. Easy to find at thrift stores. Sell to fashion-conscious buyers at premium.',
          dataPoints: {
            averageSoldPrice: 60,
            soldCount30Days: 320,
            activeListings: 45,
            trendingScore: 87
          },
          recommended: true,
          timestamp: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Patagonia Fleece (Better Sweater)',
          category: 'clothing',
          estimatedCost: 20,
          estimatedSellPrice: 75,
          projectedProfit: 46,
          profitMargin: 61.3,
          demandScore: 90,
          competitionScore: 50,
          confidenceScore: 85,
          source: 'AI Market Analysis',
          reasoning: 'Patagonia holds value exceptionally well. Better Sweater is iconic piece. Strong brand loyalty. Found frequently at thrift stores.',
          dataPoints: {
            averageSoldPrice: 75,
            soldCount30Days: 280,
            activeListings: 65,
            trendingScore: 84
          },
          recommended: true,
          timestamp: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Lululemon Align Leggings',
          category: 'clothing',
          estimatedCost: 12,
          estimatedSellPrice: 55,
          projectedProfit: 36,
          profitMargin: 65.5,
          demandScore: 92,
          competitionScore: 60,
          confidenceScore: 80,
          source: 'AI Market Analysis',
          reasoning: 'Massive demand for discounted Lululemon. Align leggings are bestseller. Easy to ship. Quick turnover. Watch for pilling issues.',
          dataPoints: {
            averageSoldPrice: 55,
            soldCount30Days: 890,
            activeListings: 250,
            trendingScore: 89
          },
          recommended: true,
          timestamp: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Apple AirPods Pro (1st/2nd Gen)',
          category: 'other',
          estimatedCost: 80,
          estimatedSellPrice: 140,
          projectedProfit: 45,
          profitMargin: 32.1,
          demandScore: 98,
          competitionScore: 75,
          confidenceScore: 70,
          source: 'AI Market Analysis',
          reasoning: 'Extremely high demand. Fast sales. Higher risk (fakes, condition issues). Verify authenticity. Check battery health before buying.',
          dataPoints: {
            averageSoldPrice: 140,
            soldCount30Days: 1200,
            activeListings: 450,
            trendingScore: 95
          },
          recommended: false,
          timestamp: new Date().toISOString()
        }
      ];

      setOpportunities(mockOpportunities);
      setIsResearching(false);
    }, 2000);
  };

  const toggleAgent = () => {
    setAgent({ ...agent, enabled: !agent.enabled });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">AI Business Agent</h2>
            <p className="text-indigo-100">
              Autonomous AI that researches, decides, and grows your business automatically
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${agent.enabled ? 'bg-green-500' : 'bg-red-500'}`}>
              {agent.enabled ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={toggleAgent}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                agent.enabled
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {agent.enabled ? 'Stop Agent' : 'Start Agent'}
            </button>
          </div>
        </div>
      </div>

      {/* Agent Configuration */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Agent Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Daily Budget</label>
            <input
              type="number"
              value={agent.budget.daily}
              onChange={(e) => setAgent({
                ...agent,
                budget: { ...agent.budget, daily: parseFloat(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">Max spending per day</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Per Item Limit</label>
            <input
              type="number"
              value={agent.budget.perItem}
              onChange={(e) => setAgent({
                ...agent,
                budget: { ...agent.budget, perItem: parseFloat(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">Max cost per item</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Total Budget</label>
            <input
              type="number"
              value={agent.budget.total}
              onChange={(e) => setAgent({
                ...agent,
                budget: { ...agent.budget, total: parseFloat(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <p className="text-xs text-slate-500 mt-1">Overall budget limit</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Strategy</label>
            <select
              value={agent.strategy}
              onChange={(e) => setAgent({ ...agent, strategy: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Margin %</label>
            <input
              type="number"
              value={agent.targetMargin}
              onChange={(e) => setAgent({ ...agent, targetMargin: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Risk Tolerance</label>
            <select
              value={agent.riskTolerance}
              onChange={(e) => setAgent({ ...agent, riskTolerance: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agent.autoPurchase}
              onChange={(e) => setAgent({ ...agent, autoPurchase: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-slate-700">Auto-Purchase (Agent buys items)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agent.autoListings}
              onChange={(e) => setAgent({ ...agent, autoListings: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-slate-700">Auto-List (Agent creates eBay listings)</span>
          </label>
        </div>
      </div>

      {/* Research Products */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900">Product Research</h3>
          <button
            onClick={runResearch}
            disabled={isResearching}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            {isResearching ? 'Researching...' : 'Run AI Research'}
          </button>
        </div>

        {isResearching && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">AI analyzing market opportunities...</p>
          </div>
        )}

        {!isResearching && opportunities.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>Click "Run AI Research" to discover profitable products</p>
          </div>
        )}

        {opportunities.length > 0 && (
          <div className="space-y-4">
            {opportunities.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>

      {/* Safety Warning */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
        <h3 className="text-red-900 font-bold text-lg mb-2">⚠️ Autonomous Mode Warning</h3>
        <div className="text-red-800 space-y-2">
          <p>
            <strong>With Auto-Purchase enabled</strong>, the AI will make real purchasing decisions with your money.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Set strict budget limits</li>
            <li>Start with small amounts to test</li>
            <li>Monitor decisions daily</li>
            <li>The AI makes probabilistic decisions - not guaranteed profits</li>
            <li>You are responsible for all purchases</li>
          </ul>
          <p className="font-bold mt-4">
            This is experimental. Use at your own risk.
          </p>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: ProductOpportunity }) {
  return (
    <div className={`border-2 rounded-lg p-4 ${opportunity.recommended ? 'border-green-400 bg-green-50' : 'border-yellow-400 bg-yellow-50'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 text-lg">{opportunity.name}</h4>
          <p className="text-sm text-slate-600 capitalize">{opportunity.category}</p>
        </div>
        {opportunity.recommended && (
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            RECOMMENDED
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div>
          <p className="text-xs text-slate-600">Est. Cost</p>
          <p className="font-bold text-slate-900">${opportunity.estimatedCost}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Est. Sell Price</p>
          <p className="font-bold text-slate-900">${opportunity.estimatedSellPrice}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Profit</p>
          <p className="font-bold text-green-600">${opportunity.projectedProfit}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Margin</p>
          <p className="font-bold text-green-600">{opportunity.profitMargin.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-600">Demand Score</span>
          <span className="font-medium text-slate-900">{opportunity.demandScore}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${opportunity.demandScore}%` }}
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-600">Competition (lower is better)</span>
          <span className="font-medium text-slate-900">{opportunity.competitionScore}/100</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-orange-600 h-2 rounded-full"
            style={{ width: `${opportunity.competitionScore}%` }}
          />
        </div>
      </div>

      <div className="bg-white bg-opacity-50 rounded p-3 mb-3">
        <p className="text-sm font-medium text-slate-900 mb-1">AI Analysis:</p>
        <p className="text-sm text-slate-700">{opportunity.reasoning}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white bg-opacity-50 rounded p-2 text-center">
          <p className="text-slate-600">Avg Sold Price</p>
          <p className="font-bold text-slate-900">${opportunity.dataPoints.averageSoldPrice}</p>
        </div>
        <div className="bg-white bg-opacity-50 rounded p-2 text-center">
          <p className="text-slate-600">Sales (30d)</p>
          <p className="font-bold text-slate-900">{opportunity.dataPoints.soldCount30Days}</p>
        </div>
        <div className="bg-white bg-opacity-50 rounded p-2 text-center">
          <p className="text-slate-600">Active Listings</p>
          <p className="font-bold text-slate-900">{opportunity.dataPoints.activeListings}</p>
        </div>
      </div>
    </div>
  );
}
