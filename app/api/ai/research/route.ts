// API Route for AI Product Research using Claude

import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const { budget, targetMargin, strategy } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Claude API key not configured. Add ANTHROPIC_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const client = new Anthropic({
      apiKey: apiKey
    });

    const systemPrompt = `You are a seasoned eBay reselling expert with 10+ years of experience building six-figure resale businesses. You have deep expertise in:

- Market trend analysis and demand forecasting
- Profit margin optimization accounting for all eBay fees
- Strategic product sourcing from thrift stores, clearance, and wholesale
- Identifying undervalued items with high resale potential
- Risk assessment for product categories
- Seasonal opportunity recognition
- Brand value analysis and authentication

You approach every recommendation with analytical rigor, considering capital efficiency, turnover velocity, and realistic sourcing availability. You think like a data-driven entrepreneur who has successfully scaled from side hustle to full-time income through strategic product selection.`;

    const userPrompt = `Analyze the current resale market and identify 5 specific, high-probability product opportunities for someone with these constraints:

BUDGET & STRATEGY:
- Daily Budget: $${budget || 50}
- Target Profit Margin: ${targetMargin || 40}% (after ALL eBay fees: 12.9% final value + 2.35% payment processing + $0.30)
- Risk Tolerance: ${strategy || 'balanced'}

SELECTION CRITERIA (rank by priority):
1. **Capital Efficiency**: High ROI relative to purchase price
2. **Demand Strength**: Consistent sales velocity (multiple sales per day across eBay)
3. **Sourcing Accessibility**: Realistically available at thrift stores, clearance racks, estate sales, or wholesale
4. **Turnover Speed**: Sells within 7-30 days maximum
5. **Competition Level**: Moderate competition (not oversaturated, not too niche)
6. **Seasonality**: Consider current month and upcoming 60-day window
7. **Risk Factors**: Authenticity concerns, condition variability, size availability

ANALYSIS REQUIREMENTS:
- Consider current date and seasonal trends
- Factor in brand reputation and resale value retention
- Account for common sourcing locations (Goodwill, Plato's Closet, clearance sections)
- Assess size/style popularity (e.g., women's size 7-9 shoes, size M clothing)
- Include specific brand and product type recommendations

RETURN EXACTLY 5 opportunities as a JSON array:
[
  {
    "id": "1",
    "name": "Specific brand + product type (e.g., 'Lululemon Align Leggings')",
    "category": "clothing|shoes|accessories|other",
    "estimatedCost": 15,
    "estimatedSellPrice": 50,
    "projectedProfit": 32,
    "profitMargin": 64,
    "demandScore": 85,
    "competitionScore": 35,
    "confidenceScore": 82,
    "source": "AI Market Analysis",
    "reasoning": "Comprehensive explanation covering demand drivers, sourcing strategy, risk factors, and why THIS specific product beats alternatives",
    "dataPoints": {
      "averageSoldPrice": 50,
      "soldCount30Days": 200,
      "activeListings": 45,
      "trendingScore": 87
    },
    "recommended": true,
    "sourcingTips": "Specific store types, departments, price ranges to look for",
    "timestamp": "${new Date().toISOString()}"
  }
]

Prioritize opportunities that someone can ACTUALLY find and flip within 30 days. Be ruthlessly specific - no generic categories.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    });

    // Handle both thinking and text content blocks from Opus
    let jsonText = '';
    let thinkingContent = '';

    for (const block of response.content) {
      if (block.type === 'thinking') {
        thinkingContent = block.thinking;
      } else if (block.type === 'text') {
        jsonText = block.text;
      }
    }

    // Extract JSON from the text response
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const opportunities = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        opportunities,
        thinking: thinkingContent // Include AI's reasoning process
      });
    }

    return NextResponse.json({
      error: 'Failed to parse AI response',
      rawResponse: jsonText,
      thinking: thinkingContent
    }, { status: 500 });

  } catch (error: any) {
    console.error('AI Research Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to run AI research',
        details: error.message
      },
      { status: 500 }
    );
  }
}
