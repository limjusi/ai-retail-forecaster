import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Overall metrics
    const overall = db.prepare(`
      SELECT 
        SUM(revenue) as totalRevenue,
        COUNT(DISTINCT order_id) as totalOrders,
        SUM(units_sold) as totalUnits
      FROM sales
    `).get() as any;

    const avgOrderValue = overall.totalOrders > 0 
      ? overall.totalRevenue / overall.totalOrders 
      : 0;

    const avgUnitsPerOrder = overall.totalOrders > 0 
      ? overall.totalUnits / overall.totalOrders 
      : 0;

    const revenuePerUnit = overall.totalUnits > 0 
      ? overall.totalRevenue / overall.totalUnits 
      : 0;

    // Top selling category
    const topCategory = db.prepare(`
      SELECT p.category_name as category, SUM(s.revenue) as revenue
      FROM sales s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.category_name
      ORDER BY revenue DESC
      LIMIT 1
    `).get() as any;

    // Top selling platform
    const topPlatform = db.prepare(`
      SELECT platform, SUM(revenue) as revenue
      FROM sales
      GROUP BY platform
      ORDER BY revenue DESC
      LIMIT 1
    `).get() as any;

    return NextResponse.json({
      totalRevenue: overall.totalRevenue || 0,
      totalOrders: overall.totalOrders || 0,
      totalUnits: overall.totalUnits || 0,
      avgOrderValue,
      avgUnitsPerOrder,
      revenuePerUnit,
      topSellingCategory: topCategory?.category || 'N/A',
      topSellingPlatform: topPlatform?.platform || 'N/A',
    });
  } catch (error) {
    console.error('Error fetching key metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch key metrics' }, { status: 500 });
  }
}
