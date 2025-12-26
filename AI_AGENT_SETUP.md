# AI Agent Setup Guide

This guide will help you set up the fully autonomous AI business agent with real Claude API and eBay API integrations.

## Overview

The AI agent can:
- **Research products** using Claude AI and eBay market data
- **Make purchase decisions** autonomously based on your budget and strategy
- **Create eBay listings** automatically with optimized titles and descriptions
- **Optimize pricing** dynamically based on market conditions
- **Learn from results** and improve strategy over time
- **Predict trends** for upcoming opportunities
- **Optimize inventory** to maximize turnover and profit

## Prerequisites

1. **Claude API Key** (from Anthropic)
2. **eBay Developer Account** (free to create)
3. Node.js 18+ installed

## Step 1: Get Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

**Cost**: Claude API is pay-per-use. Typical agent research costs $0.05-0.20 per analysis.

## Step 2: Get eBay API Credentials

1. Go to https://developer.ebay.com/
2. Create a developer account (free)
3. Create a new application:
   - Go to "My Account" → "Application Keys"
   - Click "Create an Application Key Set"
   - Fill in application details
4. You'll receive:
   - App ID (Client ID)
   - Dev ID
   - Cert ID (Client Secret)

**Note**: Start with Sandbox environment for testing.

## Step 3: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your keys:
```env
# Claude API
ANTHROPIC_API_KEY=sk-ant-your-key-here

# eBay API
EBAY_APP_ID=your-app-id-here
EBAY_CERT_ID=your-cert-id-here
EBAY_DEV_ID=your-dev-id-here
EBAY_ENVIRONMENT=sandbox
```

3. For production eBay (real listings), change:
```env
EBAY_ENVIRONMENT=production
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start the Application

```bash
npm run dev
```

Open http://localhost:3000 and go to the AI Agent tab.

## Using the AI Agent

### 1. Configure Your Agent

Set your parameters:
- **Daily Budget**: Maximum to spend per day (e.g., $50)
- **Per Item Limit**: Maximum cost per item (e.g., $20)
- **Total Budget**: Overall budget cap (e.g., $500)
- **Strategy**: Conservative, Balanced, or Aggressive
- **Target Margin**: Minimum profit margin % (e.g., 40%)
- **Risk Tolerance**: Low, Medium, or High

### 2. Run Product Research

Click **"Run AI Research"** to:
- Analyze current eBay market data
- Use Claude AI to identify profitable opportunities
- Score products by demand, competition, and profit potential
- Get detailed reasoning for each recommendation

### 3. Enable Autonomous Features

**Auto-Purchase** (⚠️ Use with caution):
- Agent will make actual purchase decisions
- Respects all budget limits
- Only buys items meeting your criteria
- **Requires manual setup of purchasing workflow**

**Auto-Listing**:
- Agent creates eBay listings automatically
- Generates optimized titles (80 chars)
- Writes compelling descriptions
- Calculates optimal pricing
- **Requires eBay OAuth token for real listings**

### 4. Monitor Performance

The agent tracks:
- Decision history
- Success rate
- ROI and profit margins
- Learning patterns
- Strategy adjustments

## Advanced Features

### Inventory Optimizer

Analyzes your inventory and recommends:
- Price adjustments for stale listings
- Items to relist with new photos
- Bundle opportunities
- Items to remove

### Trend Predictor

Identifies:
- Upcoming seasonal opportunities
- Trending categories
- Best time to buy/sell
- Market shifts

### Learning System

The AI improves over time by:
- Tracking outcomes of every decision
- Identifying successful patterns
- Adjusting strategy based on results
- Recommending configuration changes

## Safety Features

### Budget Controls
- Daily spending limit
- Per-item cost limit
- Total budget cap
- All purchases require available budget

### Risk Management
- Confidence scoring on all decisions
- Risk assessment (low/medium/high)
- Manual override capability
- Transaction logging

### Manual Overrides
- Start/stop agent anytime
- Disable auto-purchase/auto-listing
- Review all decisions before execution
- Emergency stop button

## Cost Management

### Claude API Costs
- Product research: ~$0.10 per analysis
- Listing generation: ~$0.05 per listing
- Decision making: ~$0.03 per decision
- Daily cost (active agent): $2-5

### eBay Fees
- Listing fees: Usually $0
- Final value fee: 12.9% of sale price
- Payment processing: 2.35% + $0.30

## Troubleshooting

### "API Key Invalid"
- Check `.env.local` file exists
- Verify ANTHROPIC_API_KEY is correct
- Restart dev server after changing env

### "eBay API Error"
- Verify all three eBay credentials
- Check environment (sandbox vs production)
- Ensure dev account is activated

### "Agent Not Making Decisions"
- Check budget limits aren't set to $0
- Verify Auto-Purchase is enabled
- Review decision logs for errors
- Ensure API keys are valid

## Best Practices

### Starting Out
1. Use **sandbox mode** for eBay
2. Set **low budget limits** ($10-20 daily)
3. Use **conservative strategy**
4. **Manually review** decisions initially
5. Gradually increase autonomy

### Scaling Up
1. Monitor for 2-4 weeks
2. Analyze success patterns
3. Adjust budget based on ROI
4. Enable full autonomy gradually
5. Reinvest profits

### Ongoing Management
- Review decisions daily
- Check learning insights weekly
- Adjust strategy monthly
- Monitor API costs
- Update eBay inventory

## Legal & Compliance

⚠️ **Important Disclaimers**:

1. **eBay Policies**: Ensure all listings comply with eBay's policies
2. **Authenticity**: Only sell authentic products
3. **Tax Obligations**: Track income for tax reporting
4. **Business License**: May be required in your jurisdiction
5. **AI Decisions**: You are responsible for all agent actions

## Support

For issues:
1. Check troubleshooting section
2. Review decision logs in agent dashboard
3. Check browser console for errors
4. Verify API credentials

## Next Steps

Once setup:
1. Run first product research
2. Review AI recommendations
3. Manually verify first few opportunities
4. Enable auto-listing for proven products
5. Gradually increase autonomy
6. Monitor and optimize

---

**Remember**: This AI makes probabilistic decisions. Not every recommendation will be profitable. Start small, learn from data, and scale what works.

**Your goal**: Build a self-running business that generates profit while you sleep. This agent is your foundation.
