import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { subDays, format } from 'date-fns';

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);
    
    // Get sales by platform
    const platformSalesQuery = db.prepare(`
      SELECT 
        s.platform,
        SUM(s.units_sold) as total_units,
        SUM(s.revenue) as total_revenue,
        COUNT(DISTINCT s.order_id) as total_orders,
        COUNT(DISTINCT s.product_id) as unique_products
      FROM sales s
      WHERE s.sale_date >= ?
      GROUP BY s.platform
    `);
    
    const platformSales = platformSalesQuery.all(format(thirtyDaysAgo, 'yyyy-MM-dd'));

    // Get sales by platform and category
    const categorySalesQuery = db.prepare(`
      SELECT 
        s.platform,
        p.category_name,
        SUM(s.units_sold) as units,
        SUM(s.revenue) as revenue,
        COUNT(DISTINCT s.order_id) as orders
      FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE s.sale_date >= ? AND p.category_name IS NOT NULL
      GROUP BY s.platform, p.category_name
      ORDER BY s.platform, units DESC
    `);
    
    const categorySales = categorySalesQuery.all(format(thirtyDaysAgo, 'yyyy-MM-dd'));

    // Get daily sales by platform for trend chart
    const dailySalesQuery = db.prepare(`
      SELECT 
        s.platform,
        DATE(s.sale_date) as date,
        SUM(s.units_sold) as units,
        SUM(s.revenue) as revenue
      FROM sales s
      WHERE s.sale_date >= ?
      GROUP BY s.platform, DATE(s.sale_date)
      ORDER BY s.platform, date ASC
    `);
    
    const dailySales = dailySalesQuery.all(format(thirtyDaysAgo, 'yyyy-MM-dd'));

    // Get product count by platform
    const productCountQuery = db.prepare(`
      SELECT 
        platform,
        COUNT(*) as product_count
      FROM products
      GROUP BY platform
    `);
    
    const productCounts = productCountQuery.all();

    // Transform data for frontend
    const platformMetrics = (platformSales as any[]).map(p => ({
      platform: p.platform,
      totalUnits: p.total_units,
      totalRevenue: p.total_revenue,
      totalOrders: p.total_orders,
      uniqueProducts: p.unique_products,
      avgOrderValue: p.total_orders > 0 ? p.total_revenue / p.total_orders : 0,
      avgUnitsPerOrder: p.total_orders > 0 ? p.total_units / p.total_orders : 0,
    }));

    // Group category sales by platform
    const categoryByPlatform: Record<string, any[]> = {};
    (categorySales as any[]).forEach(row => {
      if (!categoryByPlatform[row.platform]) {
        categoryByPlatform[row.platform] = [];
      }
      categoryByPlatform[row.platform].push({
        category: row.category_name,
        units: row.units,
        revenue: row.revenue,
        orders: row.orders,
      });
    });

    // Group daily sales by platform
    const dailyByPlatform: Record<string, any[]> = {};
    (dailySales as any[]).forEach(row => {
      if (!dailyByPlatform[row.platform]) {
        dailyByPlatform[row.platform] = [];
      }
      dailyByPlatform[row.platform].push({
        date: row.date,
        units: row.units,
        revenue: row.revenue,
      });
    });

    // Calculate best performing platform per category
    const categoryPerformance: Record<string, any> = {};
    (categorySales as any[]).forEach(row => {
      if (!categoryPerformance[row.category_name]) {
        categoryPerformance[row.category_name] = {
          category: row.category_name,
          platforms: {},
          bestPlatform: '',
          bestUnits: 0,
        };
      }
      
      categoryPerformance[row.category_name].platforms[row.platform] = {
        units: row.units,
        revenue: row.revenue,
        orders: row.orders,
      };

      if (row.units > categoryPerformance[row.category_name].bestUnits) {
        categoryPerformance[row.category_name].bestPlatform = row.platform;
        categoryPerformance[row.category_name].bestUnits = row.units;
      }
    });

    return NextResponse.json({
      platformMetrics,
      categoryByPlatform,
      dailyByPlatform,
      categoryPerformance: Object.values(categoryPerformance),
      productCounts,
    });
  } catch (error) {
    console.error('Platform comparison error:', error);
    return NextResponse.json({ error: 'Failed to fetch comparison data' }, { status: 500 });
  }
}
