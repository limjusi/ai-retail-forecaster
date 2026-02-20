'use client';

import { useEffect, useState } from 'react';
import { Trophy, TrendingDown, Package, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Product {
  name: string;
  category: string;
  platform: string;
  totalRevenue: number;
  totalUnits: number;
  avgPrice: number;
}

interface PerformersData {
  topProducts: Product[];
  bottomProducts: Product[];
  topCategories: { category: string; revenue: number; units: number }[];
}

export default function TopPerformers() {
  const [data, setData] = useState<PerformersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformers();
  }, []);

  const fetchPerformers = async () => {
    try {
      const response = await fetch('/api/analytics/performers');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching performers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const platformColors: Record<string, string> = {
    shopee: '#EE4D2D',
    tiktok: '#000000',
    lazada: '#0F156D',
  };

  return (
    <div className="space-y-6">
      {/* Top Products */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white">Top 10 Best Selling Products</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">#</th>
                <th className="text-left py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Product</th>
                <th className="text-left py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Platform</th>
                <th className="text-right py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Units Sold</th>
                <th className="text-right py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data.topProducts || []).map((product, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700 hover:bg-opacity-30 transition-colors">
                  <td className="py-3 px-2">
                    <span className="text-sm md:text-base font-bold text-yellow-400">#{index + 1}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <p className="text-sm md:text-base font-medium text-white truncate max-w-xs">{product.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span 
                      className="inline-block px-2 py-1 rounded text-xs font-semibold text-white capitalize"
                      style={{ backgroundColor: platformColors[product.platform] }}
                    >
                      {product.platform}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm md:text-base font-semibold text-white">{product.totalUnits.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm md:text-base font-semibold text-green-400">{formatCurrency(product.totalRevenue)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Products */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <TrendingDown className="w-5 h-5 text-red-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white">Bottom 5 Products (Need Attention)</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Product</th>
                <th className="text-left py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Platform</th>
                <th className="text-right py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Units Sold</th>
                <th className="text-right py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Revenue</th>
                <th className="text-left py-3 px-2 text-xs md:text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {(data.bottomProducts || []).map((product, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700 hover:bg-opacity-30 transition-colors">
                  <td className="py-3 px-2">
                    <div>
                      <p className="text-sm md:text-base font-medium text-white truncate max-w-xs">{product.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span 
                      className="inline-block px-2 py-1 rounded text-xs font-semibold text-white capitalize"
                      style={{ backgroundColor: platformColors[product.platform] }}
                    >
                      {product.platform}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm md:text-base font-semibold text-white">{product.totalUnits.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm md:text-base font-semibold text-gray-400">{formatCurrency(product.totalRevenue)}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-xs md:text-sm text-red-400 font-medium">Consider discount/promotion</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white">Top Categories by Revenue</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.topCategories || []).map((category, index) => (
            <div key={index} className="bg-slate-700 bg-opacity-50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base md:text-lg font-semibold text-white capitalize">{category.category}</h3>
                <span className="text-xl font-bold text-indigo-400">#{index + 1}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-400">Revenue</span>
                  <span className="text-sm md:text-base font-semibold text-green-400">{formatCurrency(category.revenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-400">Units Sold</span>
                  <span className="text-sm md:text-base font-semibold text-white">{category.units.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
