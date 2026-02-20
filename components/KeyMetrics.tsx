'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Users, DollarSign, TrendingUp, Package, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface MetricsData {
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  avgOrderValue: number;
  avgUnitsPerOrder: number;
  topSellingCategory: string;
  topSellingPlatform: string;
  revenuePerUnit: number;
}

export default function KeyMetrics() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/key-metrics');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching key metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-24 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400 bg-opacity-10',
    },
    {
      title: 'Total Orders',
      value: (data.totalOrders || 0).toLocaleString(),
      icon: ShoppingCart,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400 bg-opacity-10',
    },
    {
      title: 'Units Sold',
      value: (data.totalUnits || 0).toLocaleString(),
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400 bg-opacity-10',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(data.avgOrderValue || 0),
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400 bg-opacity-10',
    },
    {
      title: 'Avg Units/Order',
      value: (data.avgUnitsPerOrder || 0).toFixed(1),
      icon: TrendingUp,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400 bg-opacity-10',
    },
    {
      title: 'Revenue per Unit',
      value: formatCurrency(data.revenuePerUnit || 0),
      icon: Percent,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400 bg-opacity-10',
    },
    {
      title: 'Top Category',
      value: data.topSellingCategory || 'N/A',
      icon: Package,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400 bg-opacity-10',
      capitalize: true,
    },
    {
      title: 'Top Platform',
      value: data.topSellingPlatform || 'N/A',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400 bg-opacity-10',
      capitalize: true,
    },
  ];

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Key Business Metrics</h2>
        <p className="text-sm md:text-base text-gray-400">Overall performance across all platforms</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-slate-700 bg-opacity-50 rounded-lg p-3 md:p-4 border border-slate-600 hover:border-slate-500 transition-all"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${metric.bgColor} flex items-center justify-center mb-3`}>
              <metric.icon className={`w-5 h-5 md:w-6 md:h-6 ${metric.color}`} />
            </div>
            <h3 className="text-xs md:text-sm text-gray-400 mb-1">{metric.title}</h3>
            <p className={`text-base md:text-xl font-bold text-white ${metric.capitalize ? 'capitalize' : ''}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-600 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">💡 Insight</h3>
          <p className="text-xs md:text-sm text-gray-300">
            Your average order value is <strong className="text-white">{formatCurrency(data.avgOrderValue)}</strong>. 
            Consider upselling or bundling to increase this metric by 10-20%.
          </p>
        </div>
        
        <div className="bg-green-600 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-400 mb-2">🎯 Opportunity</h3>
          <p className="text-xs md:text-sm text-gray-300">
            <strong className="text-white capitalize">{data.topSellingCategory}</strong> is your top category. 
            Focus marketing efforts here to maximize ROI.
          </p>
        </div>
      </div>
    </div>
  );
}
