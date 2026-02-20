'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Package, Sparkles, ShoppingBag } from 'lucide-react';
import SalesChart from '@/components/SalesChart';
import IndustryPeaks from '@/components/IndustryPeaks';
import StockSuggestions from '@/components/StockSuggestions';
import ConnectAccounts from '@/components/ConnectAccounts';
import PromoIdeas from '@/components/PromoIdeas';
import SyncButton from '@/components/SyncButton';
import PlatformComparison from '@/components/PlatformComparison';
import CSVImport from '@/components/CSVImport';
import GrowthMetrics from '@/components/GrowthMetrics';

type TabType = 'overview' | 'platforms' | 'peaks' | 'stock' | 'promos' | 'import' | 'connect' | 'analytics';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Sales Overview', icon: TrendingUp },
    { id: 'analytics' as TabType, label: 'Growth Analytics', icon: BarChart3 },
    { id: 'platforms' as TabType, label: 'Platform Comparison', icon: BarChart3 },
    { id: 'peaks' as TabType, label: 'Industry Peaks', icon: BarChart3 },
    { id: 'stock' as TabType, label: 'Stock Suggestions', icon: Package },
    { id: 'promos' as TabType, label: 'Promo Ideas', icon: Sparkles },
    { id: 'import' as TabType, label: 'Import CSV', icon: Package },
    { id: 'connect' as TabType, label: 'Connect Accounts', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 shadow-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            AI Retail Forecaster
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            Powered by AI • Multi-platform analytics
          </p>
        </div>
      </header>

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
        <div className="bg-slate-800 rounded-lg shadow-lg mb-4 md:mb-6 border border-slate-700">
          <div className="flex border-b border-slate-700 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 md:px-6 py-3 md:py-4 font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab.id
                      ? 'border-b-2 border-indigo-500 text-indigo-400 bg-slate-700 bg-opacity-50'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700 hover:bg-opacity-30'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <SyncButton />
              <SalesChart />
            </>
          )}
          {activeTab === 'analytics' && <GrowthMetrics />}
          {activeTab === 'platforms' && <PlatformComparison />}
          {activeTab === 'peaks' && <IndustryPeaks />}
          {activeTab === 'stock' && <StockSuggestions />}
          {activeTab === 'promos' && <PromoIdeas />}
          {activeTab === 'import' && <CSVImport />}
          {activeTab === 'connect' && <ConnectAccounts />}
        </div>
      </div>
    </div>
  );
}
