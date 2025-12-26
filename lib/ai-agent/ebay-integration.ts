// eBay API Integration for Market Data and Listings

export class EbayAPI {
  private appId: string;
  private certId: string;
  private devId: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;

  constructor(config: {
    appId: string;
    certId: string;
    devId: string;
    environment?: 'sandbox' | 'production';
  }) {
    this.appId = config.appId;
    this.certId = config.certId;
    this.devId = config.devId;
    this.environment = config.environment || 'sandbox';
    this.baseUrl = this.environment === 'production'
      ? 'https://api.ebay.com'
      : 'https://api.sandbox.ebay.com';
  }

  /**
   * Search completed listings to get market data
   */
  async searchCompletedListings(query: string, options: {
    category?: string;
    limit?: number;
  } = {}): Promise<{
    items: any[];
    averagePrice: number;
    soldCount: number;
    medianPrice: number;
  }> {
    // eBay Finding API - searchCompletedListings
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findCompletedItems',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': this.appId,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      'keywords': query,
      'paginationInput.entriesPerPage': (options.limit || 50).toString(),
      'itemFilter(0).name': 'SoldItemsOnly',
      'itemFilter(0).value': 'true',
      'sortOrder': 'EndTimeSoonest'
    });

    if (options.category) {
      params.append('categoryId', options.category);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/services/search/FindingService/v1?${params.toString()}`
      );

      const data = await response.json();

      const items = data.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item || [];

      // Calculate stats
      const prices = items
        .filter((item: any) => item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__)
        .map((item: any) => parseFloat(item.sellingStatus[0].currentPrice[0].__value__));

      const averagePrice = prices.length > 0
        ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length
        : 0;

      const sortedPrices = prices.sort((a: number, b: number) => a - b);
      const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)] || 0;

      return {
        items,
        averagePrice,
        soldCount: items.length,
        medianPrice
      };
    } catch (error) {
      console.error('eBay API Error:', error);
      return {
        items: [],
        averagePrice: 0,
        soldCount: 0,
        medianPrice: 0
      };
    }
  }

  /**
   * Get active listings count for competition analysis
   */
  async getActiveListingsCount(query: string): Promise<number> {
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findItemsByKeywords',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': this.appId,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      'keywords': query,
      'paginationInput.entriesPerPage': '1'
    });

    try {
      const response = await fetch(
        `${this.baseUrl}/services/search/FindingService/v1?${params.toString()}`
      );

      const data = await response.json();
      const count = data.findItemsByKeywordsResponse?.[0]?.paginationOutput?.[0]?.totalEntries?.[0] || '0';

      return parseInt(count);
    } catch (error) {
      console.error('eBay API Error:', error);
      return 0;
    }
  }

  /**
   * Research a product on eBay
   */
  async researchProduct(productName: string): Promise<{
    averageSoldPrice: number;
    soldCount30Days: number;
    activeListings: number;
    demandScore: number;
    competitionScore: number;
    recentSales: any[];
  }> {
    // Get sold items
    const soldData = await this.searchCompletedListings(productName, { limit: 100 });

    // Get active listings
    const activeCount = await this.getActiveListingsCount(productName);

    // Calculate demand score (based on sales velocity)
    const demandScore = Math.min(100, Math.floor((soldData.soldCount / 30) * 10));

    // Calculate competition score (based on active listings vs sold)
    const competitionRatio = activeCount / (soldData.soldCount || 1);
    const competitionScore = Math.min(100, Math.floor(competitionRatio * 20));

    return {
      averageSoldPrice: soldData.averagePrice,
      soldCount30Days: soldData.soldCount,
      activeListings: activeCount,
      demandScore,
      competitionScore,
      recentSales: soldData.items.slice(0, 10)
    };
  }

  /**
   * Create a listing on eBay
   */
  async createListing(listing: {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    photos?: string[];
  }): Promise<{
    success: boolean;
    listingId?: string;
    url?: string;
    error?: string;
  }> {
    // This requires OAuth token and Trading API
    // For now, return mock success
    console.log('Creating eBay listing:', listing);

    // In production, use eBay Trading API:
    // POST to /ws/api.dll with AddItem call

    return {
      success: true,
      listingId: `mock-${Date.now()}`,
      url: `https://www.ebay.com/itm/mock-${Date.now()}`,
    };
  }

  /**
   * Update listing price
   */
  async updatePrice(listingId: string, newPrice: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log(`Updating listing ${listingId} to $${newPrice}`);

    // In production, use eBay Trading API ReviseItem
    return {
      success: true
    };
  }

  /**
   * Get trending categories
   */
  async getTrendingCategories(): Promise<{
    category: string;
    categoryId: string;
    trendScore: number;
  }[]> {
    // Mock trending data
    // In production, analyze recent sales data across categories

    return [
      { category: 'Vintage Clothing', categoryId: '175759', trendScore: 95 },
      { category: 'Sneakers', categoryId: '15709', trendScore: 92 },
      { category: 'Workwear', categoryId: '1059', trendScore: 88 },
      { category: 'Athletic Apparel', categoryId: '137084', trendScore: 85 },
      { category: 'Collectibles', categoryId: '1', trendScore: 82 }
    ];
  }

  /**
   * Analyze category performance
   */
  async analyzeCategoryPerformance(categoryId: string, days: number = 30): Promise<{
    totalSales: number;
    averagePrice: number;
    velocity: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    // Mock implementation
    // In production, query sales data for category

    return {
      totalSales: Math.floor(Math.random() * 10000),
      averagePrice: Math.floor(Math.random() * 100) + 20,
      velocity: Math.floor(Math.random() * 100),
      trend: 'up'
    };
  }
}

/**
 * Initialize eBay API from environment variables
 */
export function initEbayAPI(): EbayAPI | null {
  if (typeof window === 'undefined') return null;

  const appId = process.env.NEXT_PUBLIC_EBAY_APP_ID;
  const certId = process.env.NEXT_PUBLIC_EBAY_CERT_ID;
  const devId = process.env.NEXT_PUBLIC_EBAY_DEV_ID;
  const environment = (process.env.NEXT_PUBLIC_EBAY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';

  if (!appId || !certId || !devId) {
    console.warn('eBay API credentials not configured');
    return null;
  }

  return new EbayAPI({
    appId,
    certId,
    devId,
    environment
  });
}
