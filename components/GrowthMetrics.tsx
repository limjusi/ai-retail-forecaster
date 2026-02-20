'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import TopPerformers from './TopPerformers';
import RevenueTrends from './RevenueTrends';
import KeyMetrics from './KeyMetrics';

interface GrowthData {
  currentMonth: {
    revenue: number;
    units: number;
    orders: number;
  };
  previousMonth: {
    revenue: number;
    units: number;
    orders: number;
  };
  currentYear: {
    revenue: number;
    units: number;
  };
  previousYear: {
    revenue: number;
    units: number;
  };
}

export default function GrowthMetrics() {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      const response = await fetch('/api/analytics/growth');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching growth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading || !data) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const momRevenueGrowth = calculateGrowth(data.currentMonth.revenue, data.previousMonth.revenue);
  const momUnitsGrowth = calculateGrowth(data.currentMonth.units, data.previousMonth.units);
  const yoyRevenueGrowth = calculateGrowth(data.currentYear.revenue, data.previousYear.revenue);
  const yoyUnitsGrowth = calculateGrowth(data.currentYear.units, data.previousYear.units);

  const MetricCard = ({ title, current, previous, growth, icon: Icon, format = 'number' }: any) => {
    const isPositive = growth >= 0;
    const formattedCurrent = format === 'currency' ? formatCurrency(current) : current.toLocaleString();
    
    return (
      <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 md:p-6 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <Icon className="w-5 h-5 text-gray-400" />
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
        </div>
        <h3 className="text-xs md:text-sm text-gray-400 mb-1">{title}</h3>
        <p className="text-xl md:text-2xl font-bold text-white mb-2">{formattedCurrent}</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs md:text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{growth.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-500">vs previous</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <KeyMetrics />
      
      {/* Revenue Trends */}
      <RevenueTrends />
      
      {/* Top Performers Section */}
      <TopPerformers />
      
      {/* Month-over-Month */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white">Month-over-Month Growth</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Revenue (MoM)"
            current={data.currentMonth.revenue}
            previous={data.previousMonth.revenue}
            growth={momRevenueGrowth}
            icon={DollarSign}
            format="currency"
          />
          <MetricCard
            title="Units Sold (MoM)"
            current={data.currentMonth.units}
            previous={data.previousMonth.units}
            growth={momUnitsGrowth}
            icon={TrendingUp}
          />
          <MetricCard
            title="Orders (MoM)"
            current={data.currentMonth.orders}
            previous={data.previousMonth.orders}
            growth={calculateGrowth(data.currentMonth.orders, data.previousMonth.orders)}
            icon={Calendar}
          />
        </div>
      </div>

      {/* Year-over-Year */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white">Year-over-Year Growth</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            title="Revenue (YoY)"
            current={data.currentYear.revenue}
            previous={data.previousYear.revenue}
            growth={yoyRevenueGrowth}
            icon={DollarSign}
            format="currency"
          />
          <MetricCard
            title="Units Sold (YoY)"
            current={data.currentYear.units}
            previous={data.previousYear.units}
            growth={yoyUnitsGrowth}
            icon={TrendingUp}
          />
        </div>
      </div>
    </div>
  );
}
