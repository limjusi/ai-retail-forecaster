'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import PlatformFilter from './PlatformFilter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function IndustryPeaks() {
  const [peaksData, setPeaksData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    fetchPeaksData();
  }, [selectedPlatform]);

  const fetchPeaksData = async () => {
    setLoading(true);
    try {
      const url = selectedPlatform === 'all'
        ? '/api/peaks/industry'
        : `/api/peaks/industry?platform=${selectedPlatform}`;
      const response = await fetch(url);
      const data = await response.json();
      setPeaksData(data);
    } catch (error) {
      console.error('Error fetching peaks data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 md:h-96 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!peaksData) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Industry Peaks by Month</h2>
        <div className="text-center py-12 text-gray-400">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: peaksData.categories?.map((cat: any, idx: number) => ({
      label: cat.name,
      data: cat.monthlyData,
      backgroundColor: `hsla(${idx * 60}, 70%, 60%, 0.8)`,
    })) || [],
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
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}x multiplier`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales Multiplier',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Industry Peaks by Month</h2>
        <p className="text-sm md:text-base text-gray-400">ASEAN e-commerce seasonal patterns by category</p>
      </div>

      <div className="mb-4 md:mb-6">
        <PlatformFilter 
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
        />
      </div>

      <div className="h-64 md:h-96 mb-6 md:mb-8">
        <Bar data={chartData} options={options} />
      </div>

      <div className="space-y-3 md:space-y-4">
        <h3 className="text-base md:text-lg font-semibold text-white">Category Insights</h3>
        {peaksData.insights?.map((insight: any, idx: number) => (
          <div key={idx} className="border-l-4 border-indigo-500 bg-indigo-600 bg-opacity-20 p-3 md:p-4 rounded border border-indigo-500 border-opacity-30">
            <h4 className="font-semibold text-indigo-400 mb-1 text-sm md:text-base capitalize">{insight.category}</h4>
            <p className="text-xs md:text-sm text-gray-300 mb-2">{insight.reason}</p>
            <p className="text-xs text-gray-400">
              Peak months: <span className="font-medium text-indigo-300">{insight.peaks.join(', ')}</span>
            </p>
          </div>
        ))}
      </div>

      {peaksData.aiInsights && (
        <div className="mt-4 md:mt-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-opacity-20 p-4 md:p-6 rounded-lg border border-purple-500 border-opacity-30">
          <h3 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2 text-white">
            <span>🤖</span> AI-Powered Insights
          </h3>
          <p className="text-sm md:text-base text-gray-300 whitespace-pre-line">{peaksData.aiInsights}</p>
        </div>
      )}
    </div>
  );
}
