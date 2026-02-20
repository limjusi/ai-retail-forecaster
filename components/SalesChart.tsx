'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import PlatformFilter from './PlatformFilter';
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

export default function SalesChart() {
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    fetchSalesData();
  }, [selectedPlatform]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const url = selectedPlatform === 'all' 
        ? '/api/sales/overview'
        : `/api/sales/overview?platform=${selectedPlatform}`;
      const response = await fetch(url);
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!salesData || salesData.labels?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-4">Sales Overview</h2>
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No sales data available yet</p>
          <p className="text-sm">Connect your accounts to start tracking sales</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: salesData.labels || [],
    datasets: [
      {
        label: 'Actual Sales',
        data: salesData.actual || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Forecast',
        data: salesData.forecast || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units Sold',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Sales Overview & Forecast</h2>
        <p className="text-sm md:text-base text-gray-400">Historical sales with AI-powered predictions</p>
      </div>

      <div className="mb-4 md:mb-6">
        <PlatformFilter 
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-blue-600 bg-opacity-20 p-3 md:p-4 rounded-lg border border-blue-500 border-opacity-30">
          <p className="text-xs md:text-sm text-gray-400 mb-1">Total Sales (30d)</p>
          <p className="text-xl md:text-2xl font-bold text-blue-400">
            {salesData.totalSales || 0} <span className="text-sm md:text-base">units</span>
          </p>
        </div>
        <div className="bg-green-600 bg-opacity-20 p-3 md:p-4 rounded-lg border border-green-500 border-opacity-30">
          <p className="text-xs md:text-sm text-gray-400 mb-1">Avg Daily Sales</p>
          <p className="text-xl md:text-2xl font-bold text-green-400">
            {salesData.avgDaily || 0} <span className="text-sm md:text-base">units</span>
          </p>
        </div>
        <div className="bg-purple-600 bg-opacity-20 p-3 md:p-4 rounded-lg border border-purple-500 border-opacity-30">
          <p className="text-xs md:text-sm text-gray-400 mb-1">Trend</p>
          <p className="text-xl md:text-2xl font-bold text-purple-400">
            {salesData.trend > 0 ? '↑' : '↓'} {Math.abs(salesData.trend || 0)}%
          </p>
        </div>
      </div>

      <div className="h-64 md:h-96">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
