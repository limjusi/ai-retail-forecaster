import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const now = new Date();
    
    // Current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Previous month
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Current year (last 12 months)
    const currentYearStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    
    // Previous year (12 months before that)
    const previousYearStart = new Date(now.getFullYear(), now.getMonth() - 23, 1);
    const previousYearEnd = new Date(now.getFullYear(), now.getMonth() - 11, 0);
    
    // Format dates
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    // Current month data
    const currentMonth = db.prepare(`
      SELECT 
        SUM(revenue) as revenue,
        SUM(units_sold) as units,
        COUNT(DISTINCT order_id) as orders
      FROM sales
      WHERE sale_date >= ? AND sale_date <= ?
    `).get(formatDate(currentMonthStart), formatDate(currentMonthEnd)) as any;
    
    // Previous month data
    const previousMonth = db.prepare(`
      SELECT 
        SUM(revenue) as revenue,
        SUM(units_sold) as units,
        COUNT(DISTINCT order_id) as orders
      FROM sales
      WHERE sale_date >= ? AND sale_date <= ?
    `).get(formatDate(previousMonthStart), formatDate(previousMonthEnd)) as any;
    
    // Current year data (last 12 months)
    const currentYear = db.prepare(`
      SELECT 
        SUM(revenue) as revenue,
        SUM(units_sold) as units
      FROM sales
      WHERE sale_date >= ?
    `).get(formatDate(currentYearStart)) as any;
    
    // Previous year data (12 months before current year)
    const previousYear = db.prepare(`
      SELECT 
        SUM(revenue) as revenue,
        SUM(units_sold) as units
      FROM sales
      WHERE sale_date >= ? AND sale_date <= ?
    `).get(formatDate(previousYearStart), formatDate(previousYearEnd)) as any;
    
    return NextResponse.json({
      currentMonth: {
        revenue: currentMonth?.revenue || 0,
        units: currentMonth?.units || 0,
        orders: currentMonth?.orders || 0,
      },
      previousMonth: {
        revenue: previousMonth?.revenue || 0,
        units: previousMonth?.units || 0,
        orders: previousMonth?.orders || 0,
      },
      currentYear: {
        revenue: currentYear?.revenue || 0,
        units: currentYear?.units || 0,
      },
      previousYear: {
        revenue: previousYear?.revenue || 0,
        units: previousYear?.units || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching growth data:', error);
    return NextResponse.json({ error: 'Failed to fetch growth data' }, { status: 500 });
  }
}
