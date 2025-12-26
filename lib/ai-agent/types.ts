// AI Agent Types and Interfaces

export interface AgentConfig {
  id: string;
  name: string;
  enabled: boolean;
  budget: {
    daily: number;
    perItem: number;
    total: number;
  };
  strategy: 'conservative' | 'balanced' | 'aggressive';
  targetMargin: number; // percentage
  autoListings: boolean;
  autoPurchase: boolean;
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface ProductOpportunity {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  estimatedSellPrice: number;
  projectedProfit: number;
  profitMargin: number;
  demandScore: number; // 0-100
  competitionScore: number; // 0-100
  confidenceScore: number; // 0-100
  source: string;
  reasoning: string;
  dataPoints: {
    averageSoldPrice: number;
    soldCount30Days: number;
    activeListings: number;
    trendingScore: number;
  };
  recommended: boolean;
  timestamp: string;
}

export interface AgentDecision {
  id: string;
  type: 'research' | 'purchase' | 'listing' | 'pricing' | 'strategy';
  decision: string;
  reasoning: string;
  confidence: number;
  dataUsed: any[];
  outcome?: 'pending' | 'approved' | 'executed' | 'rejected' | 'failed';
  financialImpact: {
    cost: number;
    expectedReturn: number;
    risk: 'low' | 'medium' | 'high';
  };
  timestamp: string;
  executedAt?: string;
  results?: any;
}

export interface AgentAction {
  id: string;
  agentId: string;
  actionType: 'product_research' | 'create_listing' | 'adjust_price' | 'purchase_item' | 'analyze_performance';
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  input: any;
  output?: any;
  error?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
}

export interface MarketResearch {
  query: string;
  results: ProductOpportunity[];
  timestamp: string;
  sources: string[];
  summary: string;
  topRecommendations: ProductOpportunity[];
}

export interface AgentPerformance {
  agentId: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    decisionsM: number;
    successRate: number;
    totalSpent: number;
    totalRevenue: number;
    totalProfit: number;
    roi: number;
    averageMargin: number;
    itemsPurchased: number;
    itemsListed: number;
    itemsSold: number;
  };
  topProducts: {
    name: string;
    profit: number;
    margin: number;
  }[];
  lessons: string[];
}

export interface AgentPrompt {
  role: 'researcher' | 'buyer' | 'lister' | 'pricer' | 'strategist';
  task: string;
  context: {
    currentInventory: any[];
    budget: number;
    performance: any;
    goals: any[];
  };
  constraints: string[];
  output: 'json' | 'text';
}
