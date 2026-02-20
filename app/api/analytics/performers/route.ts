import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Top 10 products by revenue
    const topProducts = db.prepare(`
      SELECT 
        p.name,
        p.category_name as category,
        s.platform,
        SUM(s.revenue) as totalRevenue,
        SUM(s.units_sold) as totalUnits,
        AVG(s.revenue / s.units_sold) as avgPrice
      FROM sales s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.id, s.platform
      ORDER BY totalRevenue DESC
      LIMIT 10
    `).all();

    // Bottom 5 products by revenue (excluding zero sales)
    const bottomProducts = db.prepare(`
      SELECT 
        p.name,
        p.category_name as category,
        s.platform,
        SUM(s.revenue) as totalRevenue,
        SUM(s.units_sold) as totalUnits,
        AVG(s.revenue / s.units_sold) as avgPrice
      FROM sales s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.id, s.platform
      HAVING totalRevenue > 0
      ORDER BY totalRevenue ASC
      LIMIT 5
    `).all();

    // Top categories by revenue
    const topCategories = db.prepare(`
      SELECT 
        p.category_name as category,
        SUM(s.revenue) as revenue,
        SUM(s.units_sold) as units
      FROM sales s
      JOIN products p ON s.product_id = p.id
      GROUP BY p.category_name
      ORDER BY revenue DESC
    `).all();

    return NextResponse.json({
      topProducts,
      bottomProducts,
      topCategories,
    });
  } catch (error) {
    console.error('Error fetching performers data:', error);
    return NextResponse.json({ error: 'Failed to fetch performers data' }, { status: 500 });
  }
}
