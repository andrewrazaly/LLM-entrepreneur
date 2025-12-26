# Resale Business Dashboard

A comprehensive business management tool for running your resale business - from eBay flipping to building your own brand.

## Features

### 1. Dashboard
- Real-time business metrics (revenue, profit, ROI, margins)
- Inventory status overview
- Active goals tracking
- Quick insights into business performance

### 2. Inventory Management
- Add and track items with detailed information (brand, size, condition, etc.)
- Automatic profit calculations with eBay fee structure
- Filter by status (In Stock, Listed, Sold)
- Visual status tracking

### 3. Supplier Management
- Research and track overseas manufacturers
- Calculate landed costs (including shipping, duties, fees)
- Compare multiple suppliers
- Store contact information and product details
- MOQ (Minimum Order Quantity) tracking

### 4. Listing Optimizer
- Generate optimized eBay titles (up to 80 characters)
- Create compelling product descriptions
- Calculate suggested pricing to hit target profit
- Real-time profit analysis with fee breakdown
- Copy listings to clipboard

### 5. Goals Tracking
- Set revenue, profit, and sales targets
- Auto-tracking for business metrics
- Visual progress bars
- Deadline tracking
- Suggested goals for beginners

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A web browser

### Installation

1. Open terminal and navigate to the project folder:
```bash
cd resale-business-dashboard
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to:
```
http://localhost:3000
```

## Usage Guide

### Starting Your eBay Flipping Business

#### Step 1: Add Your Inventory
1. Go to the "Inventory" tab
2. Click "+ Add Item"
3. Fill in details:
   - Item name (e.g., "Vintage Nike Hoodie")
   - Category, brand, size, color
   - Condition (be honest - buyers appreciate it)
   - Purchase price (what you paid)
   - Estimated sell price (research eBay completed listings)
4. Click "Add Item"

#### Step 2: Create eBay Listings
1. Go to "Listing Optimizer" tab
2. Enter your item details
3. Add purchase price and target profit
4. Click "Generate Listing"
5. Copy the optimized title and description
6. Use these on eBay when creating your listing

#### Step 3: Mark Items as Listed
1. Go back to "Inventory"
2. Change item status from "In Stock" to "Listed"
3. Optionally add the eBay listing URL

#### Step 4: Track Sales
1. When item sells, go to "Inventory"
2. Change status to "Sold"
3. The dashboard will automatically update your metrics

#### Step 5: Set Goals
1. Go to "Goals" tab
2. Click "+ Add Goal"
3. Set targets for:
   - Monthly revenue (e.g., $1,000)
   - Monthly profit (e.g., $400)
   - Items sold (e.g., 20 items)

### Planning Your Brand

#### Research Suppliers
1. Go to "Suppliers" tab
2. Visit sourcing platforms:
   - Alibaba.com
   - Made-in-China.com
   - Global Sources
   - IndiaMART
3. Add promising suppliers with:
   - MOQ (Minimum Order Quantity)
   - Unit prices
   - Shipping costs
   - Lead times
4. Compare landed costs to find best deals

#### Calculate Your Investment
The dashboard automatically calculates:
- Cost per unit (including shipping and duties)
- Total investment needed for MOQ
- Allows you to compare suppliers side-by-side

## Key Business Metrics Explained

### eBay Fee Structure (Built into Calculator)
- **Insertion Fee**: $0 (for most listings)
- **Final Value Fee**: 12.9% of sale price (varies by category)
- **Payment Processing Fee**: 2.35% + $0.30 per transaction

### Landed Cost Components
- **Unit Price**: What supplier charges per item
- **Shipping**: Total shipping cost for order
- **Duties**: ~6.25% for clothing from China to US
- **Landed Cost Per Unit**: Total cost ÷ quantity

### Important Ratios
- **Profit Margin**: (Net Profit ÷ Revenue) × 100
- **ROI**: (Net Profit ÷ Cost) × 100
- **Turn Rate**: Items Sold ÷ Total Items

## Tips for Success

### eBay Flipping Strategy
1. **Source Smart**: Thrift stores, garage sales, clearance racks
2. **Research First**: Check eBay completed listings for pricing
3. **Take Great Photos**: Natural light, multiple angles, show details
4. **Price to Sell**: Factor in ALL fees, aim for 40-50% margins
5. **Ship Fast**: Good feedback = more sales

### Building Your Brand
1. **Validate First**: Use eBay to learn what sells
2. **Start Small**: Order minimum MOQ initially
3. **Quality Matters**: Always order samples first
4. **Build Reputation**: Start with one product, perfect it
5. **Reinvest Profits**: Use eBay profits to fund first order

### Financial Discipline
1. **Track Everything**: Use this dashboard religiously
2. **Separate Finances**: Keep business money separate
3. **Reinvest Wisely**: 70% back into inventory, 30% saved
4. **Set Milestones**: Hit $1k profit before scaling
5. **Calculate True Costs**: Include your time

## Data Storage

Your data is stored locally in your browser's localStorage. This means:
- Privacy: Your data never leaves your computer
- Speed: Instant access, no internet needed
- Important: Clear browser data = lose everything
- Backup: Export data regularly (feature coming soon)

## Deployment

### Deploy to Vercel (Free, Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"
6. Your app will be live at: `your-project.vercel.app`

### Deploy to Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the project folder
3. Or connect your GitHub repo
4. Your app will be live instantly

### Build for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Framework**: Next.js 15 (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Storage**: Browser localStorage
- **Deployment**: Vercel/Netlify ready

## Roadmap

Future features being considered:
- Data export/import (backup)
- Multi-user support
- Mobile app version
- Expense tracking
- Photo upload for inventory
- Integration with eBay API
- Sales analytics charts
- Tax calculation tools

## Support

Questions or issues? This is a standalone tool, so you have full control. The code is yours to modify and customize as needed.

## License

This project is yours to use however you want. Good luck on your journey to financial freedom!

---

**Remember**: Getting rich through reselling is about consistency, smart decisions, and reinvesting profits. This dashboard gives you the tools - you provide the hustle. Let's get it!
