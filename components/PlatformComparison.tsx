'use client';

import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function PlatformComparison() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisonData();
  }, []);

  const fetchComparisonData = async () => {
    try {
      const response = await fetch('/api/platforms/comparison');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || !data.platformMetrics) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-4">Platform Comparison</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const platformColors: Record<string, string> = {
    shopee: 'rgb(238, 77, 45)',
    tiktok: 'rgb(0, 0, 0)',
    lazada: 'rgb(13, 92, 223)',
  };

  const platformNames: Record<string, string> = {
    shopee: 'Shopee',
    tiktok: 'TikTok Shop',
    lazada: 'Lazada',
  };

  // Overall performance chart
  const overallChart = {
    labels: data.platformMetrics.map((p: any) => platformNames[p.platform] || p.platform),
    datasets: [
      {
        label: 'Total Units Sold',
        data: data.platformMetrics.map((p: any) => p.totalUnits),
        backgroundColor: data.platformMetrics.map((p: any) => platformColors[p.platform]),
      },
    ],
  };

  // Revenue comparison
  const revenueChart = {
    labels: data.platformMetrics.map((p: any) => platformNames[p.platform] || p.platform),
    datasets: [
      {
        label: 'Total Revenue (SGD)',
        data: data.platformMetrics.map((p: any) => p.totalRevenue),
        backgroundColor: data.platformMetrics.map((p: any) => platformColors[p.platform]),
      },
    ],
  };

  // Market share (by units)
  const marketShareChart = {
    labels: data.platformMetrics.map((p: any) => platformNames[p.platform] || p.platform),
    datasets: [
      {
        data: data.platformMetrics.map((p: any) => p.totalUnits),
        backgroundColor: data.platformMetrics.map((p: any) => platformColors[p.platform]),
      },
    ],
  };

  // Category performance comparison
  const categoriesSet = new Set(
    Object.values(data.categoryByPlatform).flat().map((c: any) => c.category)
  );
  const categories = Array.from(categoriesSet);

  const categoryChart = {
    labels: categories,
    datasets: Object.keys(data.categoryByPlatform).map(platform => ({
      label: platformNames[platform] || platform,
      data: categories.map(cat => {
        const catData = data.categoryByPlatform[platform]?.find((c: any) => c.category === cat);
        return catData ? catData.units : 0;
      }),
      backgroundColor: platformColors[platform],
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Platform Performance Comparison</h2>
        
        {/* Key Metrics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {data.platformMetrics.map((platform: any) => (
            <div
              key={platform.platform}
              className="border-2 rounded-lg p-6 bg-slate-700 bg-opacity-50"
              style={{ borderColor: platformColors[platform.platform] }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {platformNames[platform.platform] || platform.platform}
                </h3>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platformColors[platform.platform] }}
                ></div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Total Orders</p>
                    <p className="text-lg font-bold text-white">{platform.totalOrders.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Units Sold</p>
                    <p className="text-lg font-bold text-white">{platform.totalUnits.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Revenue</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(platform.totalRevenue)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Avg Order Value</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(platform.avgOrderValue)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-700 bg-opacity-50 p-6 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold mb-4 text-white">Units Sold by Platform</h3>
            <div style={{ height: '300px' }}>
              <Bar data={overallChart} options={chartOptions} />
            </div>
          </div>

          <div className="bg-slate-700 bg-opacity-50 p-6 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold mb-4 text-white">Revenue by Platform</h3>
            <div style={{ height: '300px' }}>
              <Bar data={revenueChart} options={chartOptions} />
            </div>
          </div>

          <div className="bg-slate-700 bg-opacity-50 p-6 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold mb-4 text-white">Market Share (Units)</h3>
            <div style={{ height: '300px' }}>
              <Doughnut 
                data={marketShareChart} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-slate-700 bg-opacity-50 p-6 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold mb-4 text-white">Performance by Category</h3>
            <div style={{ height: '300px' }}>
              <Bar data={categoryChart} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Best Platform per Category */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-white">Best Performing Platform by Category</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.categoryPerformance.map((cat: any) => (
            <div key={cat.category} className="border border-slate-600 rounded-lg p-4 bg-slate-700 bg-opacity-50">
              <h4 className="font-semibold capitalize mb-2 text-white">{cat.category}</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platformColors[cat.bestPlatform] }}
                ></div>
                <span className="text-sm font-medium text-white">
                  {platformNames[cat.bestPlatform] || cat.bestPlatform}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {cat.bestUnits.toLocaleString()} units sold
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
