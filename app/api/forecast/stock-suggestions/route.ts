import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { forecastNextDays, generateStockSuggestion } from '@/lib/forecasting';
import { subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform');
    
    let productsQuery;
    let products;
    
    if (platform && platform !== 'all') {
      productsQuery = db.prepare(`
        SELECT 
          p.id,
          p.name,
          p.sku,
          p.stock,
          p.category_name,
          p.platform
        FROM products p
        WHERE p.stock IS NOT NULL AND p.platform = ?
        LIMIT 20
      `);
      products = productsQuery.all(platform);
    } else {
      productsQuery = db.prepare(`
        SELECT 
          p.id,
          p.name,
          p.sku,
          p.stock,
          p.category_name,
          p.platform
        FROM products p
        WHERE p.stock IS NOT NULL
        LIMIT 20
      `);
      products = productsQuery.all();
    }
    
    if (!products || products.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = [];
    const thirtyDaysAgo = subDays(new Date(), 30);

    for (const product of products as any[]) {
      const salesQuery = db.prepare(`
        SELECT 
          DATE(sale_date) as date,
          SUM(units_sold) as units,
          SUM(revenue) as revenue
        FROM sales
        WHERE product_id = ? AND sale_date >= ?
        GROUP BY DATE(sale_date)
        ORDER BY sale_date ASC
      `);
      
      const salesData = salesQuery.all(product.id, format(thirtyDaysAgo, 'yyyy-MM-dd'));
      
      if (!salesData || salesData.length === 0) continue;

      const forecastData = forecastNextDays(
        salesData.map((d: any) => ({ date: d.date, units: d.units, revenue: d.revenue })),
        30,
        product.category_name
      );

      const avgDaily = forecastData.reduce((sum, f) => sum + f.predictedUnits, 0) / forecastData.length;
      const daysRemaining = avgDaily > 0 ? Math.floor(product.stock / avgDaily) : 999;
      
      let urgency: 'urgent' | 'soon' | 'ok' | 'overstocked' = 'ok';
      if (daysRemaining < 7) urgency = 'urgent';
      else if (daysRemaining < 14) urgency = 'soon';
      else if (daysRemaining > 60) urgency = 'overstocked';

      const message = generateStockSuggestion(product.name, product.stock, forecastData);
      const recommendedOrder = urgency === 'urgent' || urgency === 'soon' 
        ? Math.ceil(avgDaily * 21) 
        : 0;

      suggestions.push({
        productName: product.name,
        sku: product.sku || 'N/A',
        currentStock: product.stock,
        daysRemaining,
        recommendedOrder,
        urgency,
        message,
      });
    }

    suggestions.sort((a, b) => {
      const urgencyOrder = { urgent: 0, soon: 1, ok: 2, overstocked: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Stock suggestions error:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
