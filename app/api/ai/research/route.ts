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

    const prompt = `You are an expert eBay reseller with years of experience. Your job is to find the MOST profitable products to resell right now.

CONTEXT:
- Budget: $${budget || 50}
- Target Margin: ${targetMargin || 40}%
- Strategy: ${strategy || 'balanced'}

TASK: Analyze the current market and identify 5 specific product opportunities.

CRITERIA FOR EACH PRODUCT:
1. HIGH DEMAND - Currently selling well on eBay
2. GOOD MARGINS - At least ${targetMargin || 40}% profit after eBay fees (12.9% + 2.35% + $0.30)
3. EASY TO SOURCE - Available at thrift stores, clearance sales, or wholesale
4. QUICK TURNOVER - Sells within 30 days
5. LOW RISK - Not oversaturated, authentic products

RETURN JSON ARRAY with exactly 5 opportunities:
[
  {
    "id": "1",
    "name": "Specific product name",
    "category": "clothing|shoes|accessories|other",
    "estimatedCost": 15,
    "estimatedSellPrice": 50,
    "projectedProfit": 32,
    "profitMargin": 64,
    "demandScore": 85,
    "competitionScore": 35,
    "confidenceScore": 82,
    "source": "AI Market Analysis",
    "reasoning": "Detailed explanation of why this is profitable",
    "dataPoints": {
      "averageSoldPrice": 50,
      "soldCount30Days": 200,
      "activeListings": 45,
      "trendingScore": 87
    },
    "recommended": true,
    "sourcingTips": "Where to find these items",
    "timestamp": "${new Date().toISOString()}"
  }
]

Focus on REAL, ACTIONABLE opportunities someone can source TODAY. Be specific with brands and product types.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
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
        const opportunities = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ opportunities });
      }
    }

    return NextResponse.json({
      error: 'Failed to parse AI response',
      rawResponse: content
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
