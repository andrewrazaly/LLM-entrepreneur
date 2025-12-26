// AI Learning System - Improves strategy based on results

import { InventoryItem } from '@/types';
import { AgentConfig, AgentDecision } from './types';

export interface LearningData {
  id: string;
  timestamp: string;
  decision: AgentDecision;
  outcome: {
    sold: boolean;
    sellPrice?: number;
    profit?: number;
    daysToSell?: number;
    roi?: number;
  };
  learnings: string[];
}

export class LearningSystem {
  private history: LearningData[] = [];

  constructor() {
    this.loadHistory();
  }

  /**
   * Record a decision and its outcome
   */
  recordOutcome(decision: AgentDecision, outcome: {
    sold: boolean;
    sellPrice?: number;
    profit?: number;
    daysToSell?: number;
  }) {
    const learningData: LearningData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      decision,
      outcome: {
        ...outcome,
        roi: outcome.profit && decision.financialImpact.cost
          ? (outcome.profit / decision.financialImpact.cost) * 100
          : 0
      },
      learnings: this.extractLearnings(decision, outcome)
    };

    this.history.push(learningData);
    this.saveHistory();
  }

  /**
   * Extract learnings from outcome
   */
  private extractLearnings(decision: AgentDecision, outcome: any): string[] {
    const learnings: string[] = [];

    if (outcome.sold) {
      if (outcome.daysToSell && outcome.daysToSell < 7) {
        learnings.push('Quick sale - high demand product');
        learnings.push(`Price point $${outcome.sellPrice} is effective`);
      }

      if (outcome.profit && outcome.profit > decision.financialImpact.expectedReturn * 0.9) {
        learnings.push('Met or exceeded profit expectations');
      }

      if (outcome.roi && outcome.roi > 100) {
        learnings.push('Excellent ROI - similar products are good investments');
      }
    } else {
      learnings.push('Item didn\'t sell - analyze pricing or demand');
    }

    return learnings;
  }

  /**
   * Analyze performance patterns
   */
  analyzePatterns(): {
    successRate: number;
    averageROI: number;
    bestCategories: string[];
    bestPriceRanges: { min: number; max: number; successRate: number }[];
    insights: string[];
  } {
    const soldItems = this.history.filter(h => h.outcome.sold);
    const successRate = (soldItems.length / this.history.length) * 100 || 0;

    const avgROI = soldItems.reduce((sum, item) => sum + (item.outcome.roi || 0), 0) / soldItems.length || 0;

    // Find best performing categories
    const categoryPerformance: { [key: string]: { total: number; sold: number } } = {};
    this.history.forEach(item => {
      const category = (item.decision.dataUsed[0] as any)?.category || 'unknown';
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { total: 0, sold: 0 };
      }
      categoryPerformance[category].total++;
      if (item.outcome.sold) {
        categoryPerformance[category].sold++;
      }
    });

    const bestCategories = Object.entries(categoryPerformance)
      .map(([cat, perf]) => ({
        category: cat,
        rate: (perf.sold / perf.total) * 100
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3)
      .map(c => c.category);

    // Analyze price ranges
    const priceRanges = [
      { min: 0, max: 20 },
      { min: 20, max: 50 },
      { min: 50, max: 100 },
      { min: 100, max: Infinity }
    ];

    const bestPriceRanges = priceRanges.map(range => {
      const itemsInRange = this.history.filter(h => {
        const cost = h.decision.financialImpact.cost;
        return cost >= range.min && cost < range.max;
      });

      const successRate = itemsInRange.length > 0
        ? (itemsInRange.filter(i => i.outcome.sold).length / itemsInRange.length) * 100
        : 0;

      return {
        ...range,
        successRate
      };
    }).filter(r => r.successRate > 0);

    // Generate insights
    const insights = this.generateInsights({
      successRate,
      avgROI,
      bestCategories,
      totalDecisions: this.history.length
    });

    return {
      successRate,
      averageROI: avgROI,
      bestCategories,
      bestPriceRanges,
      insights
    };
  }

  /**
   * Generate actionable insights
   */
  private generateInsights(data: any): string[] {
    const insights: string[] = [];

    if (data.successRate > 70) {
      insights.push('Strong overall performance - continue current strategy');
    } else if (data.successRate < 40) {
      insights.push('Low success rate - consider adjusting product selection criteria');
    }

    if (data.avgROI > 100) {
      insights.push('Excellent ROI - you\'re picking winners');
    } else if (data.avgROI < 50) {
      insights.push('ROI below target - focus on higher margin opportunities');
    }

    if (data.bestCategories.length > 0) {
      insights.push(`Best performing categories: ${data.bestCategories.join(', ')}`);
      insights.push('Focus more on these categories');
    }

    if (data.totalDecisions < 10) {
      insights.push('Need more data to identify patterns - keep selling');
    }

    return insights;
  }

  /**
   * Recommend strategy adjustments based on learnings
   */
  recommendAdjustments(currentConfig: AgentConfig): Partial<AgentConfig> {
    const patterns = this.analyzePatterns();
    const adjustments: Partial<AgentConfig> = {};

    // Adjust target margin based on success rate
    if (patterns.successRate < 40 && currentConfig.targetMargin > 30) {
      adjustments.targetMargin = currentConfig.targetMargin - 5;
    } else if (patterns.successRate > 80 && currentConfig.targetMargin < 60) {
      adjustments.targetMargin = currentConfig.targetMargin + 5;
    }

    // Adjust strategy based on ROI
    if (patterns.averageROI < 50 && currentConfig.strategy === 'aggressive') {
      adjustments.strategy = 'balanced';
    } else if (patterns.averageROI > 150 && currentConfig.strategy === 'conservative') {
      adjustments.strategy = 'balanced';
    }

    return adjustments;
  }

  /**
   * Get performance metrics for dashboard
   */
  getMetrics(days: number = 30): {
    totalDecisions: number;
    successfulSales: number;
    totalRevenue: number;
    totalProfit: number;
    averageDaysToSell: number;
    topPerformingProducts: any[];
  } {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recentHistory = this.history.filter(h =>
      new Date(h.timestamp) >= cutoff
    );

    const soldItems = recentHistory.filter(h => h.outcome.sold);

    const totalRevenue = soldItems.reduce((sum, item) =>
      sum + (item.outcome.sellPrice || 0), 0
    );

    const totalProfit = soldItems.reduce((sum, item) =>
      sum + (item.outcome.profit || 0), 0
    );

    const avgDaysToSell = soldItems.length > 0
      ? soldItems.reduce((sum, item) => sum + (item.outcome.daysToSell || 0), 0) / soldItems.length
      : 0;

    const topPerforming = soldItems
      .sort((a, b) => (b.outcome.roi || 0) - (a.outcome.roi || 0))
      .slice(0, 5)
      .map(item => ({
        decision: item.decision,
        profit: item.outcome.profit,
        roi: item.outcome.roi,
        daysToSell: item.outcome.daysToSell
      }));

    return {
      totalDecisions: recentHistory.length,
      successfulSales: soldItems.length,
      totalRevenue,
      totalProfit,
      averageDaysToSell: avgDaysToSell,
      topPerformingProducts: topPerforming
    };
  }

  /**
   * Predict success probability for new opportunity
   */
  predictSuccess(opportunity: any): {
    probability: number;
    reasoning: string;
  } {
    const patterns = this.analyzePatterns();

    let probability = 50; // Base 50%

    // Adjust based on category performance
    if (patterns.bestCategories.includes(opportunity.category)) {
      probability += 20;
    }

    // Adjust based on price range
    const priceRange = patterns.bestPriceRanges.find(r =>
      opportunity.estimatedCost >= r.min && opportunity.estimatedCost < r.max
    );
    if (priceRange && priceRange.successRate > 60) {
      probability += 15;
    }

    // Adjust based on margin
    if (opportunity.profitMargin > 60) {
      probability += 10;
    }

    probability = Math.min(95, Math.max(10, probability));

    const reasoning = `Based on ${this.history.length} past decisions, ` +
      `success rate in ${opportunity.category} category, ` +
      `price range performance, and margin analysis.`;

    return {
      probability,
      reasoning
    };
  }

  private loadHistory() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ai_learning_history');
      if (stored) {
        this.history = JSON.parse(stored);
      }
    }
  }

  private saveHistory() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_learning_history', JSON.stringify(this.history));
    }
  }
}
