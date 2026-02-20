'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendData {
  labels: string[];
  revenue: number[];
  units: number[];
  avgOrderValue: number[];
}

export default function RevenueTrends() {
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '12m'>('90d');

  useEffect(() => {
    fetchTrends();
  }, [timeframe]);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/trends?timeframe=${timeframe}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-80 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const revenueChartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.revenue,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const unitsChartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Units Sold',
        data: data.units,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const aovChartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Average Order Value',
        data: data.avgOrderValue,
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(71, 85, 105, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('Revenue') || label.includes('Value')) {
              return `${label}: ${formatCurrency(value)}`;
            }
            return `${label}: ${value.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.2)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.2)',
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value: any) {
            return value.toLocaleString();
          }
        },
      },
    },
  };

  const totalRevenue = data.revenue.reduce((sum, val) => sum + val, 0);
  const totalUnits = data.units.reduce((sum, val) => sum + val, 0);
  const avgAOV = data.avgOrderValue.reduce((sum, val) => sum + val, 0) / data.avgOrderValue.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 md:p-6 border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm text-gray-400">Total Revenue ({timeframe})</h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
        </div>
        
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 md:p-6 border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-sm text-gray-400">Total Units ({timeframe})</h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{totalUnits.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 md:p-6 border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm text-gray-400">Avg Order Value ({timeframe})</h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{formatCurrency(avgAOV)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Revenue & Performance Trends</h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === '30d'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeframe('90d')}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === '90d'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeframe('12m')}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === '12m'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
            >
              12 Months
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Revenue Chart */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Over Time</h3>
            <div style={{ height: '300px' }}>
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          {/* Units Chart */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Units Sold Over Time</h3>
            <div style={{ height: '300px' }}>
              <Line data={unitsChartData} options={chartOptions} />
            </div>
          </div>

          {/* AOV Chart */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Average Order Value Trend</h3>
            <div style={{ height: '300px' }}>
              <Line data={aovChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
