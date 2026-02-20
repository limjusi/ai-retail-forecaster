import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '90d';
    
    const now = new Date();
    let startDate: Date;
    let groupBy: 'day' | 'week' | 'month';
    
    switch (timeframe) {
      case '30d':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        groupBy = 'day';
        break;
      case '90d':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
        groupBy = 'week';
        break;
      case '12m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        groupBy = 'month';
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
        groupBy = 'week';
    }
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    let query: string;
    
    if (groupBy === 'day') {
      query = `
        SELECT 
          sale_date as period,
          SUM(revenue) as revenue,
          SUM(units_sold) as units,
          COUNT(DISTINCT order_id) as orders
        FROM sales
        WHERE sale_date >= ?
        GROUP BY sale_date
        ORDER BY sale_date ASC
      `;
    } else if (groupBy === 'week') {
      query = `
        SELECT 
          strftime('%Y-W%W', sale_date) as period,
          SUM(revenue) as revenue,
          SUM(units_sold) as units,
          COUNT(DISTINCT order_id) as orders
        FROM sales
        WHERE sale_date >= ?
        GROUP BY strftime('%Y-W%W', sale_date)
        ORDER BY period ASC
      `;
    } else {
      query = `
        SELECT 
          strftime('%Y-%m', sale_date) as period,
          SUM(revenue) as revenue,
          SUM(units_sold) as units,
          COUNT(DISTINCT order_id) as orders
        FROM sales
        WHERE sale_date >= ?
        GROUP BY strftime('%Y-%m', sale_date)
        ORDER BY period ASC
      `;
    }
    
    const results = db.prepare(query).all(formatDate(startDate)) as any[];
    
    const labels = results.map(r => {
      if (groupBy === 'day') {
        const date = new Date(r.period);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (groupBy === 'week') {
        return `Week ${r.period.split('-W')[1]}`;
      } else {
        const [year, month] = r.period.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
    });
    
    const revenue = results.map(r => r.revenue || 0);
    const units = results.map(r => r.units || 0);
    const avgOrderValue = results.map(r => 
      r.orders > 0 ? (r.revenue || 0) / r.orders : 0
    );
    
    return NextResponse.json({
      labels,
      revenue,
      units,
      avgOrderValue,
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}
