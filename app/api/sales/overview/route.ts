import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { forecastNextDays } from '@/lib/forecasting';
import { subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform');
    
    const thirtyDaysAgo = subDays(new Date(), 30);
    
    let salesQuery;
    let salesData;
    
    if (platform && platform !== 'all') {
      salesQuery = db.prepare(`
        SELECT 
          DATE(sale_date) as date,
          SUM(units_sold) as units,
          SUM(revenue) as revenue
        FROM sales
        WHERE sale_date >= ? AND platform = ?
        GROUP BY DATE(sale_date)
        ORDER BY sale_date ASC
      `);
      salesData = salesQuery.all(format(thirtyDaysAgo, 'yyyy-MM-dd'), platform);
    } else {
      salesQuery = db.prepare(`
        SELECT 
          DATE(sale_date) as date,
          SUM(units_sold) as units,
          SUM(revenue) as revenue
        FROM sales
        WHERE sale_date >= ?
        GROUP BY DATE(sale_date)
        ORDER BY sale_date ASC
      `);
      salesData = salesQuery.all(format(thirtyDaysAgo, 'yyyy-MM-dd'));
    }
    
    if (!salesData || salesData.length === 0) {
      return NextResponse.json({
        labels: [],
        actual: [],
        forecast: [],
        totalSales: 0,
        avgDaily: 0,
        trend: 0,
      });
    }

    const labels = salesData.map((d: any) => format(new Date(d.date), 'MMM dd'));
    const actual = salesData.map((d: any) => d.units);
    
    const forecastData = forecastNextDays(
      salesData.map((d: any) => ({ date: d.date, units: d.units, revenue: d.revenue })),
      7
    );
    
    const forecastLabels = forecastData.map(f => format(new Date(f.date), 'MMM dd'));
    const forecastValues = forecastData.map(f => f.predictedUnits);
    
    const totalSales = actual.reduce((sum: number, val: number) => sum + val, 0);
    const avgDaily = Math.round(totalSales / actual.length);
    
    const firstHalf = actual.slice(0, Math.floor(actual.length / 2));
    const secondHalf = actual.slice(Math.floor(actual.length / 2));
    const firstAvg = firstHalf.reduce((sum: number, val: number) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum: number, val: number) => sum + val, 0) / secondHalf.length;
    const trend = firstAvg > 0 ? Math.round(((secondAvg - firstAvg) / firstAvg) * 100) : 0;

    return NextResponse.json({
      labels: [...labels, ...forecastLabels],
      actual: [...actual, ...Array(forecastLabels.length).fill(null)],
      forecast: [...Array(labels.length).fill(null), ...forecastValues],
      totalSales,
      avgDaily,
      trend,
    });
  } catch (error) {
    console.error('Sales overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales data' }, { status: 500 });
  }
}
