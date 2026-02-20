'use client';

import { useEffect, useState } from 'react';
import { Package, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import PlatformFilter from './PlatformFilter';

interface Suggestion {
  productName: string;
  sku: string;
  currentStock: number;
  daysRemaining: number;
  recommendedOrder: number;
  urgency: 'urgent' | 'soon' | 'ok' | 'overstocked';
  message: string;
}

export default function StockSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    fetchSuggestions();
  }, [selectedPlatform]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const url = selectedPlatform === 'all'
        ? '/api/forecast/stock-suggestions'
        : `/api/forecast/stock-suggestions?platform=${selectedPlatform}`;
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-24 bg-slate-700 rounded"></div>
          <div className="h-24 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'border-red-500 bg-red-600 bg-opacity-20';
      case 'soon': return 'border-orange-500 bg-orange-600 bg-opacity-20';
      case 'ok': return 'border-green-500 bg-green-600 bg-opacity-20';
      case 'overstocked': return 'border-blue-500 bg-blue-600 bg-opacity-20';
      default: return 'border-gray-500 bg-gray-600 bg-opacity-20';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-400" />;
      case 'soon': return <Package className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />;
      case 'ok': return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />;
      case 'overstocked': return <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />;
      default: return <Package className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Stock Suggestions</h2>
        <p className="text-sm md:text-base text-gray-400">AI-powered inventory recommendations based on forecasts</p>
      </div>

      <div className="mb-4 md:mb-6">
        <PlatformFilter 
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
        />
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-600" />
          <p className="mb-2 text-sm md:text-base">No stock suggestions available</p>
          <p className="text-xs md:text-sm text-gray-500">Connect your accounts and sync products to get started</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className={`border-l-4 p-3 md:p-4 rounded-lg ${getUrgencyColor(suggestion.urgency)} border-opacity-50`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-2 md:gap-3 flex-1">
                  {getUrgencyIcon(suggestion.urgency)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm md:text-base truncate">{suggestion.productName}</h3>
                    <p className="text-xs md:text-sm text-gray-400 mb-2">SKU: {suggestion.sku}</p>
                    <p className="text-xs md:text-sm text-gray-300">{suggestion.message}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="text-xs md:text-sm text-gray-400">Current Stock</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{suggestion.currentStock}</p>
                  {suggestion.daysRemaining > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      ~{suggestion.daysRemaining} days left
                    </p>
                  )}
                </div>
              </div>
              {suggestion.recommendedOrder > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-xs md:text-sm font-medium text-gray-300">
                    Recommended order: <span className="text-indigo-400 font-bold">{suggestion.recommendedOrder} units</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
