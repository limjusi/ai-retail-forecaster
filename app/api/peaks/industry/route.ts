import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { normalizeCategory } from '@/lib/utils';
import { getCategoryPeaksInsights } from '@/lib/ai';
import aseanPeaks from '@/data/asean-peaks.json';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform');
    
    let categorySalesQuery;
    let categorySales;
    
    if (platform && platform !== 'all') {
      categorySalesQuery = db.prepare(`
        SELECT 
          p.category_name,
          strftime('%m', s.sale_date) as month,
          SUM(s.units_sold) as units
        FROM sales s
        JOIN products p ON s.product_id = p.id
        WHERE p.category_name IS NOT NULL AND s.platform = ?
        GROUP BY p.category_name, month
        ORDER BY p.category_name, month
      `);
      categorySales = categorySalesQuery.all(platform);
    } else {
      categorySalesQuery = db.prepare(`
        SELECT 
          p.category_name,
          strftime('%m', s.sale_date) as month,
          SUM(s.units_sold) as units
        FROM sales s
        JOIN products p ON s.product_id = p.id
        WHERE p.category_name IS NOT NULL
        GROUP BY p.category_name, month
        ORDER BY p.category_name, month
      `);
      categorySales = categorySalesQuery.all();
    }
    
    const categoryData: Record<string, number[]> = {};
    
    if (categorySales && categorySales.length > 0) {
      categorySales.forEach((row: any) => {
        const normalized = normalizeCategory(row.category_name);
        if (!categoryData[normalized]) {
          categoryData[normalized] = Array(12).fill(0);
        }
        const monthIndex = parseInt(row.month) - 1;
        categoryData[normalized][monthIndex] += row.units;
      });
    }
    
    const categories = Object.keys(categoryData).length > 0 
      ? Object.keys(categoryData).map(cat => ({
          name: cat,
          monthlyData: categoryData[cat],
        }))
      : Object.keys(aseanPeaks).slice(0, 5).map(cat => ({
          name: cat,
          monthlyData: Array(12).fill(0).map((_, i) => {
            const peakMonths = (aseanPeaks as any)[cat].peaks.map((p: string) => {
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                 'July', 'August', 'September', 'October', 'November', 'December'];
              return monthNames.indexOf(p);
            });
            return peakMonths.includes(i) ? (aseanPeaks as any)[cat].multiplier : 1;
          }),
        }));

    const insights = Object.entries(aseanPeaks).slice(0, 6).map(([category, data]: [string, any]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      peaks: data.peaks,
      reason: data.reason,
    }));

    let aiInsights = '';
    if (Object.keys(categoryData).length > 0) {
      const topCategory = Object.keys(categoryData)[0];
      const monthlySales = categoryData[topCategory].map((units, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        units,
      }));
      
      try {
        aiInsights = await getCategoryPeaksInsights(topCategory, monthlySales);
      } catch (error) {
        console.error('AI insights error:', error);
      }
    }

    return NextResponse.json({
      categories,
      insights,
      aiInsights,
    });
  } catch (error) {
    console.error('Industry peaks error:', error);
    return NextResponse.json({ error: 'Failed to fetch peaks data' }, { status: 500 });
  }
}
