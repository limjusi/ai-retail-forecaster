import { startOfMonth, endOfMonth, eachDayOfInterval, format, addDays, differenceInDays } from 'date-fns';

export interface SalesDataPoint {
  date: string;
  units: number;
  revenue: number;
}

export interface ForecastResult {
  date: string;
  predictedUnits: number;
  confidence: number;
  factors: string[];
}

export interface HolidayFactor {
  name: string;
  date: string;
  impact: number;
  category?: string[];
}

const SINGAPORE_HOLIDAYS_2024_2025: HolidayFactor[] = [
  { name: 'Chinese New Year', date: '2024-02-10', impact: 2.5, category: ['fashion', 'beauty', 'home-living', 'groceries'] },
  { name: 'Chinese New Year', date: '2024-02-11', impact: 2.5, category: ['fashion', 'beauty', 'home-living', 'groceries'] },
  { name: 'Good Friday', date: '2024-03-29', impact: 1.3 },
  { name: 'Hari Raya Puasa', date: '2024-04-10', impact: 2.0, category: ['fashion', 'groceries', 'home-living'] },
  { name: 'Labour Day', date: '2024-05-01', impact: 1.4 },
  { name: 'Vesak Day', date: '2024-05-22', impact: 1.2 },
  { name: 'Hari Raya Haji', date: '2024-06-17', impact: 1.5, category: ['fashion', 'groceries'] },
  { name: 'National Day', date: '2024-08-09', impact: 1.6 },
  { name: 'Deepavali', date: '2024-11-01', impact: 1.8, category: ['fashion', 'beauty', 'home-living'] },
  { name: 'Christmas', date: '2024-12-25', impact: 2.2, category: ['toys', 'electronics', 'fashion'] },
  { name: 'Chinese New Year', date: '2025-01-29', impact: 2.5, category: ['fashion', 'beauty', 'home-living', 'groceries'] },
  { name: 'Chinese New Year', date: '2025-01-30', impact: 2.5, category: ['fashion', 'beauty', 'home-living', 'groceries'] },
];

export function calculateVelocity(salesData: SalesDataPoint[]): number {
  if (salesData.length === 0) return 0;
  
  const totalUnits = salesData.reduce((sum, d) => sum + d.units, 0);
  return totalUnits / salesData.length;
}

export function calculateTrend(salesData: SalesDataPoint[]): number {
  if (salesData.length < 2) return 0;
  
  const recentData = salesData.slice(-30);
  const olderData = salesData.slice(0, Math.min(30, salesData.length - 30));
  
  if (olderData.length === 0) return 0;
  
  const recentAvg = recentData.reduce((sum, d) => sum + d.units, 0) / recentData.length;
  const olderAvg = olderData.reduce((sum, d) => sum + d.units, 0) / olderData.length;
  
  if (olderAvg === 0) return 0;
  
  return (recentAvg - olderAvg) / olderAvg;
}

export function getHolidayImpact(date: Date, category?: string): { factor: number; holidays: string[] } {
  const dateStr = format(date, 'yyyy-MM-dd');
  const holidays: string[] = [];
  let maxImpact = 1.0;
  
  for (const holiday of SINGAPORE_HOLIDAYS_2024_2025) {
    const holidayDate = new Date(holiday.date);
    const daysDiff = Math.abs(differenceInDays(date, holidayDate));
    
    if (daysDiff <= 7) {
      if (!category || !holiday.category || holiday.category.includes(category)) {
        const impactDecay = 1 - (daysDiff / 7) * 0.5;
        const adjustedImpact = 1 + (holiday.impact - 1) * impactDecay;
        
        if (adjustedImpact > maxImpact) {
          maxImpact = adjustedImpact;
          holidays.push(holiday.name);
        }
      }
    }
  }
  
  return { factor: maxImpact, holidays };
}

export function forecastNextDays(
  salesData: SalesDataPoint[],
  days: number = 30,
  category?: string
): ForecastResult[] {
  if (salesData.length === 0) {
    return [];
  }
  
  const baseVelocity = calculateVelocity(salesData);
  const trend = calculateTrend(salesData);
  
  const lastDate = new Date(salesData[salesData.length - 1].date);
  const forecasts: ForecastResult[] = [];
  
  for (let i = 1; i <= days; i++) {
    const forecastDate = addDays(lastDate, i);
    const { factor: holidayFactor, holidays } = getHolidayImpact(forecastDate, category);
    
    const trendAdjustment = 1 + (trend * (i / days));
    const predictedUnits = Math.max(0, baseVelocity * trendAdjustment * holidayFactor);
    
    const factors: string[] = [];
    if (Math.abs(trend) > 0.1) {
      factors.push(trend > 0 ? 'Upward trend' : 'Downward trend');
    }
    if (holidayFactor > 1.1) {
      factors.push(...holidays.map(h => `${h} boost`));
    }
    
    const confidence = Math.max(0.3, Math.min(0.95, 0.8 - (i / days) * 0.3));
    
    forecasts.push({
      date: format(forecastDate, 'yyyy-MM-dd'),
      predictedUnits: Math.round(predictedUnits * 10) / 10,
      confidence,
      factors,
    });
  }
  
  return forecasts;
}

export function calculateRestockDate(
  currentStock: number,
  dailyVelocity: number,
  leadTimeDays: number = 7
): Date | null {
  if (dailyVelocity <= 0) return null;
  
  const daysUntilStockout = currentStock / dailyVelocity;
  const restockDate = addDays(new Date(), Math.max(0, daysUntilStockout - leadTimeDays));
  
  return restockDate;
}

export function generateStockSuggestion(
  productName: string,
  currentStock: number,
  forecastData: ForecastResult[],
  leadTimeDays: number = 7
): string {
  const totalPredicted = forecastData.reduce((sum, f) => sum + f.predictedUnits, 0);
  const avgDaily = totalPredicted / forecastData.length;
  
  const daysOfStock = avgDaily > 0 ? currentStock / avgDaily : 999;
  
  if (daysOfStock < leadTimeDays) {
    const recommendedOrder = Math.ceil(avgDaily * (leadTimeDays + 14));
    return `⚠️ URGENT: Reorder ${recommendedOrder} units of ${productName} immediately (only ${Math.floor(daysOfStock)} days of stock left)`;
  } else if (daysOfStock < 14) {
    const recommendedOrder = Math.ceil(avgDaily * 21);
    const restockDate = format(addDays(new Date(), Math.max(0, daysOfStock - leadTimeDays)), 'MMM dd');
    return `📦 Reorder ${recommendedOrder} units of ${productName} by ${restockDate}`;
  } else if (daysOfStock < 30) {
    return `✅ Stock levels adequate for ${productName} (${Math.floor(daysOfStock)} days remaining)`;
  } else {
    return `💰 Consider promotion for ${productName} (high stock levels)`;
  }
}
