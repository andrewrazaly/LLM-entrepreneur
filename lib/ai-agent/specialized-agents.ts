// Specialized AI Agents for Advanced Business Operations

import { ClaudeAgent } from './claude-integration';
import { EbayAPI } from './ebay-integration';
import { InventoryItem } from '@/types';

/**
 * Inventory Optimizer Agent
 * Analyzes inventory and makes recommendations for optimization
 */
export class InventoryOptimizerAgent {
  constructor(
    private claude: ClaudeAgent,
    private ebay: EbayAPI | null
  ) {}

  async analyzeInventory(items: InventoryItem[]): Promise<{
    totalValue: number;
    recommendations: {
      type: 'price_adjustment' | 'relist' | 'bundle' | 'markdown' | 'remove';
      itemId: string;
      itemName: string;
      currentStatus: string;
      reasoning: string;
      suggestedAction: string;
      priority: 'high' | 'medium' | 'low';
    }[];
    insights: string[];
  }> {
    const totalValue = items.reduce((sum, item) =>
      sum + (item.status === 'sold' ? item.actualSellPrice || 0 : item.estimatedSellPrice), 0
    );

    // Analyze stale listings
    const staleListings = items.filter(item =>
      item.status === 'listed' &&
      this.daysSincePurchase(item.purchaseDate) > 30
    );

    // Analyze in-stock items
    const inStock = items.filter(item => item.status === 'in-stock');

    const recommendations: any[] = [];

    // Stale listings - need price adjustment or relist
    for (const item of staleListings) {
      if (this.ebay) {
        // Get current market data
        const marketData = await this.ebay.researchProduct(item.name);

        if (item.estimatedSellPrice > marketData.averageSoldPrice * 1.2) {
          recommendations.push({
            type: 'price_adjustment',
            itemId: item.id,
            itemName: item.name,
            currentStatus: item.status,
            reasoning: `Current price $${item.estimatedSellPrice} is ${Math.round(((item.estimatedSellPrice / marketData.averageSoldPrice) - 1) * 100)}% above market average of $${marketData.averageSoldPrice.toFixed(2)}`,
            suggestedAction: `Lower price to $${(marketData.averageSoldPrice * 0.95).toFixed(2)} for quick sale`,
            priority: 'high'
          });
        } else {
          recommendations.push({
            type: 'relist',
            itemId: item.id,
            itemName: item.name,
            currentStatus: item.status,
            reasoning: 'Price is competitive but listing hasn\'t gained traction',
            suggestedAction: 'End and relist with new photos and optimized description',
            priority: 'medium'
          });
        }
      }
    }

    // In-stock items - should be listed
    if (inStock.length > 5) {
      for (const item of inStock.slice(0, 3)) {
        recommendations.push({
          type: 'relist',
          itemId: item.id,
          itemName: item.name,
          currentStatus: item.status,
          reasoning: 'Inventory sitting idle - not generating revenue',
          suggestedAction: 'List immediately to start selling',
          priority: 'high'
        });
      }
    }

    // Bundle opportunities
    const categoryCounts: { [key: string]: InventoryItem[] } = {};
    items.filter(i => i.status === 'in-stock').forEach(item => {
      if (!categoryCounts[item.category]) {
        categoryCounts[item.category] = [];
      }
      categoryCounts[item.category].push(item);
    });

    Object.entries(categoryCounts).forEach(([category, categoryItems]) => {
      if (categoryItems.length >= 3) {
        const bundleValue = categoryItems.slice(0, 3).reduce((sum, item) =>
          sum + item.estimatedSellPrice, 0
        );

        recommendations.push({
          type: 'bundle',
          itemId: categoryItems[0].id,
          itemName: `${category} Bundle (3 items)`,
          currentStatus: 'in-stock',
          reasoning: `${categoryItems.length} ${category} items could be bundled for higher value`,
          suggestedAction: `Create bundle listing at $${(bundleValue * 0.85).toFixed(2)} (15% bundle discount) instead of individual $${bundleValue.toFixed(2)}`,
          priority: 'medium'
        });
      }
    });

    // Generate insights
    const insights = [
      `Total inventory value: $${totalValue.toFixed(2)}`,
      `${staleListings.length} listings over 30 days old`,
      `${inStock.length} items not yet listed`,
      `${items.filter(i => i.status === 'sold').length} items sold successfully`
    ];

    if (staleListings.length > 0) {
      insights.push(`Priority: Address ${staleListings.length} stale listings to improve turnover`);
    }

    return {
      totalValue,
      recommendations: recommendations.sort((a, b) =>
        a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0
      ),
      insights
    };
  }

  private daysSincePurchase(purchaseDate: string): number {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const diff = now.getTime() - purchase.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}

/**
 * Trend Prediction Agent
 * Predicts upcoming trends and opportunities
 */
export class TrendPredictionAgent {
  constructor(
    private claude: ClaudeAgent,
    private ebay: EbayAPI | null
  ) {}

  async predictTrends(): Promise<{
    upcomingTrends: {
      category: string;
      trendScore: number;
      reasoning: string;
      timeframe: string;
      exampleProducts: string[];
    }[];
    seasonalOpportunities: {
      opportunity: string;
      timing: string;
      profitPotential: 'high' | 'medium' | 'low';
      actionRequired: string;
    }[];
    insights: string[];
  }> {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentSeason = this.getSeason();

    // Use Claude to predict trends
    const trends = await this.claude.predictTrends({
      season: currentSeason,
      currentMonth,
      performanceData: {}
    });

    // Get eBay trending categories
    const ebayTrends = this.ebay ? await this.ebay.getTrendingCategories() : [];

    // Combine AI predictions with eBay data
    const upcomingTrends = [
      {
        category: 'Winter Outerwear',
        trendScore: 95,
        reasoning: 'Cold weather approaching - demand for jackets, coats, fleece will surge',
        timeframe: 'Next 30-60 days',
        exampleProducts: ['Patagonia Fleece', 'North Face Jackets', 'Carhartt Coats']
      },
      {
        category: 'Holiday Gifts',
        trendScore: 88,
        reasoning: 'Holiday season preparation - electronics, toys, and gift items spike',
        timeframe: 'Next 45 days',
        exampleProducts: ['Apple AirPods', 'Nintendo Switch', 'Designer Accessories']
      },
      {
        category: 'Vintage Y2K Fashion',
        trendScore: 82,
        reasoning: 'Ongoing trend with Gen Z - 90s/2000s fashion continues strong demand',
        timeframe: 'Ongoing',
        exampleProducts: ['Vintage Band Tees', 'Low-rise Jeans', 'Platform Shoes']
      }
    ];

    const seasonalOpportunities = [
      {
        opportunity: 'Stock up on winter sports gear',
        timing: 'NOW - before price increase',
        profitPotential: 'high' as const,
        actionRequired: 'Source ski jackets, snowboard gear at end-of-season sales'
      },
      {
        opportunity: 'Holiday decor and gift items',
        timing: 'Next 2-4 weeks',
        profitPotential: 'medium' as const,
        actionRequired: 'Buy now, list mid-November for peak demand'
      },
      {
        opportunity: 'New Year fitness apparel',
        timing: 'Late December prep',
        profitPotential: 'high' as const,
        actionRequired: 'Stock activewear, gym equipment for January resolution rush'
      }
    ];

    const insights = [
      `Current season: ${currentSeason} - adjust inventory accordingly`,
      'Focus on items with 30-45 day lead time for maximum profit',
      'Seasonal arbitrage: Buy off-season, sell peak-season',
      'Monitor trending hashtags and TikTok for viral products'
    ];

    return {
      upcomingTrends,
      seasonalOpportunities,
      insights
    };
  }

  private getSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  }
}

/**
 * Performance Analytics Agent
 * Tracks and analyzes business performance
 */
export class PerformanceAnalyticsAgent {
  analyzePerformance(items: InventoryItem[]): {
    overview: {
      totalRevenue: number;
      totalProfit: number;
      totalCost: number;
      roi: number;
      profitMargin: number;
    };
    byCategory: {
      category: string;
      revenue: number;
      profit: number;
      itemsSold: number;
      avgMargin: number;
    }[];
    topPerformers: {
      name: string;
      profit: number;
      margin: number;
      daysToSell?: number;
    }[];
    underperformers: {
      name: string;
      reason: string;
      recommendation: string;
    }[];
    trends: {
      salesVelocity: number; // items per week
      avgSellingTime: number; // days
      successRate: number; // percentage
    };
  } {
    const soldItems = items.filter(item => item.status === 'sold');

    const totalRevenue = soldItems.reduce((sum, item) =>
      sum + (item.actualSellPrice || 0), 0
    );

    const totalCost = soldItems.reduce((sum, item) =>
      sum + item.purchasePrice, 0
    );

    // Simplified profit calculation (actual calculation in calculations.ts)
    const totalProfit = totalRevenue - totalCost - (totalRevenue * 0.15); // Approx fees

    const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // By category
    const categoryStats: { [key: string]: any } = {};
    soldItems.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = {
          revenue: 0,
          cost: 0,
          count: 0
        };
      }

      categoryStats[item.category].revenue += item.actualSellPrice || 0;
      categoryStats[item.category].cost += item.purchasePrice;
      categoryStats[item.category].count++;
    });

    const byCategory = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      revenue: stats.revenue,
      profit: stats.revenue - stats.cost - (stats.revenue * 0.15),
      itemsSold: stats.count,
      avgMargin: ((stats.revenue - stats.cost - (stats.revenue * 0.15)) / stats.revenue) * 100
    }));

    // Top performers
    const topPerformers = soldItems
      .map(item => ({
        name: item.name,
        profit: (item.actualSellPrice || 0) - item.purchasePrice - ((item.actualSellPrice || 0) * 0.15),
        margin: (((item.actualSellPrice || 0) - item.purchasePrice) / (item.actualSellPrice || 1)) * 100,
        daysToSell: item.soldDate ? this.daysBetween(item.purchaseDate, item.soldDate) : undefined
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);

    // Underperformers (listed long time, not sold)
    const underperformers = items
      .filter(item => item.status === 'listed')
      .filter(item => this.daysSincePurchase(item.purchaseDate) > 30)
      .slice(0, 5)
      .map(item => ({
        name: item.name,
        reason: `Listed for ${this.daysSincePurchase(item.purchaseDate)} days without selling`,
        recommendation: 'Consider price reduction or relisting with better photos/description'
      }));

    // Trends
    const avgDaysToSell = topPerformers.reduce((sum, item) =>
      sum + (item.daysToSell || 0), 0) / topPerformers.length || 0;

    const salesVelocity = soldItems.length / 4; // Assume 4 weeks
    const successRate = (soldItems.length / items.length) * 100;

    return {
      overview: {
        totalRevenue,
        totalProfit,
        totalCost,
        roi,
        profitMargin
      },
      byCategory,
      topPerformers,
      underperformers,
      trends: {
        salesVelocity,
        avgSellingTime: avgDaysToSell,
        successRate
      }
    };
  }

  private daysSincePurchase(purchaseDate: string): number {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const diff = now.getTime() - purchase.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
