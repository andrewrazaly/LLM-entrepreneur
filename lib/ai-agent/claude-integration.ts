// Claude API Integration for Real AI Decision Making

import Anthropic from '@anthropic-ai/sdk';

export class ClaudeAgent {
  private client: Anthropic;
  private model: string = 'claude-sonnet-4-20250514';

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // For client-side use
    });
  }

  /**
   * Research profitable products using Claude
   */
  async researchProducts(params: {
    budget: number;
    targetMargin: number;
    strategy: string;
    currentInventory: any[];
  }): Promise<any[]> {
    const prompt = `You are an expert eBay reseller with years of experience. Your job is to find the MOST profitable products to resell right now.

CONTEXT:
- Budget: $${params.budget}
- Target Margin: ${params.targetMargin}%
- Strategy: ${params.strategy}
- Current Inventory: ${params.currentInventory.length} items

TASK: Analyze the current market and identify 5 specific product opportunities.

CRITERIA FOR EACH PRODUCT:
1. HIGH DEMAND - Currently selling well on eBay
2. GOOD MARGINS - At least ${params.targetMargin}% profit after eBay fees (12.9% + 2.35% + $0.30)
3. EASY TO SOURCE - Available at thrift stores, clearance sales, or wholesale
4. QUICK TURNOVER - Sells within 30 days
5. LOW RISK - Not oversaturated, authentic products

RETURN JSON ARRAY with exactly 5 opportunities:
[
  {
    "name": "Specific product name",
    "category": "clothing|shoes|accessories|other",
    "estimatedCost": 15,
    "estimatedSellPrice": 50,
    "projectedProfit": 32,
    "profitMargin": 64,
    "demandScore": 85,
    "competitionScore": 35,
    "confidenceScore": 82,
    "reasoning": "Detailed explanation of why this is profitable",
    "dataPoints": {
      "averageSoldPrice": 50,
      "soldCount30Days": 200,
      "activeListings": 45,
      "trendingScore": 87
    },
    "recommended": true,
    "sourcingTips": "Where to find these items"
  }
]

Focus on REAL, ACTIONABLE opportunities someone can source TODAY.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      // Extract JSON from response
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return [];
  }

  /**
   * Analyze a specific product opportunity
   */
  async analyzeProduct(productName: string, context: any): Promise<any> {
    const prompt = `Analyze this product for resale profitability: "${productName}"

PROVIDE:
1. Current market demand on eBay
2. Average selling price (last 30 days)
3. Estimated sourcing cost
4. Competition level
5. Profit potential after fees
6. Risks and considerations
7. Sourcing recommendations

Return detailed JSON analysis with all ProductOpportunity fields.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return null;
  }

  /**
   * Make purchase decision
   */
  async shouldPurchase(opportunity: any, constraints: {
    budget: number;
    targetMargin: number;
    riskTolerance: string;
    strategy: string;
  }): Promise<{
    decision: 'buy' | 'pass';
    confidence: number;
    reasoning: string;
  }> {
    const prompt = `Should I purchase this item for resale?

OPPORTUNITY:
${JSON.stringify(opportunity, null, 2)}

MY CONSTRAINTS:
- Budget: $${constraints.budget}
- Target Margin: ${constraints.targetMargin}%
- Risk Tolerance: ${constraints.riskTolerance}
- Strategy: ${constraints.strategy}

ANALYZE:
1. Does this meet my margin requirements?
2. Is the risk acceptable for my tolerance level?
3. Will this sell quickly?
4. Is this a good use of my capital?

RETURN JSON:
{
  "decision": "buy" or "pass",
  "confidence": 0-100,
  "reasoning": "Detailed explanation of decision",
  "alternativeAction": "Optional suggestion if passing"
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return {
      decision: 'pass',
      confidence: 0,
      reasoning: 'Failed to analyze'
    };
  }

  /**
   * Generate optimized eBay listing
   */
  async generateListing(item: {
    name: string;
    brand?: string;
    category: string;
    condition: string;
    size?: string;
    color?: string;
    purchasePrice: number;
    targetProfit: number;
  }): Promise<{
    title: string;
    description: string;
    suggestedPrice: number;
    keywords: string[];
    reasoning: string;
  }> {
    const prompt = `Create a high-converting eBay listing for this item:

ITEM DETAILS:
- Name: ${item.name}
- Brand: ${item.brand || 'N/A'}
- Category: ${item.category}
- Condition: ${item.condition}
- Size: ${item.size || 'N/A'}
- Color: ${item.color || 'N/A'}
- Purchase Price: $${item.purchasePrice}
- Target Profit: $${item.targetProfit}

CREATE:
1. Optimized eBay title (MAX 80 characters) - packed with searchable keywords
2. Compelling description that sells (emphasize condition, brand, style)
3. Optimal price that gives target profit after eBay fees (12.9% + 2.35% + $0.30)
4. Top keywords for search visibility

RETURN JSON:
{
  "title": "Exactly 80 chars or less",
  "description": "Full HTML-formatted description",
  "suggestedPrice": calculated price as number,
  "keywords": ["keyword1", "keyword2", ...],
  "reasoning": "Why this pricing and strategy"
}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    throw new Error('Failed to generate listing');
  }

  /**
   * Optimize pricing for existing listing
   */
  async optimizePricing(listing: {
    currentPrice: number;
    daysListed: number;
    views: number;
    watchers: number;
    originalCost: number;
  }): Promise<{
    action: 'lower_price' | 'keep_price' | 'raise_price' | 'add_best_offer' | 'relist';
    newPrice?: number;
    reasoning: string;
  }> {
    const prompt = `Optimize pricing for this eBay listing:

CURRENT STATUS:
- Price: $${listing.currentPrice}
- Days Listed: ${listing.daysListed}
- Views: ${listing.views}
- Watchers: ${listing.watchers}
- Cost: $${listing.originalCost}

ANALYZE and recommend best action to sell faster or maximize profit.

RETURN JSON with action and reasoning.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return {
      action: 'keep_price',
      reasoning: 'Unable to analyze'
    };
  }

  /**
   * Predict trends and opportunities
   */
  async predictTrends(params: {
    season: string;
    currentMonth: string;
    performanceData: any;
  }): Promise<{
    upcomingTrends: string[];
    recommendations: string[];
    opportunityWindows: any[];
  }> {
    const prompt = `As a trend forecasting expert for resale business, predict upcoming opportunities.

CONTEXT:
- Current Month: ${params.currentMonth}
- Season: ${params.season}
- Recent Performance: ${JSON.stringify(params.performanceData)}

PREDICT:
1. What categories will trend in next 30 days?
2. Seasonal opportunities coming up
3. Products to stock up on now
4. Products to avoid (seasonal decline)

Return structured JSON with trends and actionable recommendations.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return {
      upcomingTrends: [],
      recommendations: [],
      opportunityWindows: []
    };
  }

  /**
   * Learn from results and adapt strategy
   */
  async learnFromResults(data: {
    successfulItems: any[];
    failedItems: any[];
    currentStrategy: string;
  }): Promise<{
    insights: string[];
    strategyAdjustments: any;
    recommendations: string[];
  }> {
    const prompt = `Analyze business performance and provide strategic insights.

SUCCESSFUL ITEMS (sold well):
${JSON.stringify(data.successfulItems, null, 2)}

FAILED ITEMS (didn't sell or low profit):
${JSON.stringify(data.failedItems, null, 2)}

CURRENT STRATEGY: ${data.currentStrategy}

PROVIDE:
1. Key insights about what's working
2. Patterns in successful vs failed items
3. Recommended strategy adjustments
4. Specific actions to improve performance

Return structured JSON with actionable insights.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return {
      insights: [],
      strategyAdjustments: {},
      recommendations: []
    };
  }
}
