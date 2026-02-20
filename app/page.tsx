'use client';

import { Store, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 px-2">
            AI Retail Inventory & Trend Forecaster
          </h1>
          <p className="text-base md:text-xl text-gray-300 mb-8 px-4">
            Smart forecasting for Shopee, TikTok Shop & Lazada sellers in Singapore
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700">
            <div className="w-12 h-12 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">Multi-Platform</h3>
            <p className="text-sm md:text-base text-gray-300">
              Connect Shopee, TikTok Shop, and Lazada accounts in one dashboard
            </p>
          </div>

          <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700">
            <div className="w-12 h-12 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">AI Forecasting</h3>
            <p className="text-sm md:text-base text-gray-300">
              Predict sales trends with AI-powered analysis and holiday factors
            </p>
          </div>

          <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">Industry Peaks</h3>
            <p className="text-sm md:text-base text-gray-300">
              Discover monthly peak patterns for your product categories
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-16 bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto border border-slate-700">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Features</h2>
          <ul className="space-y-3 text-sm md:text-base text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Category-agnostic: Handle ALL product types (fashion, electronics, toys, groceries, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Per-SKU forecasting with Singapore/ASEAN holiday factors (CNY, Hari Raya, Christmas)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Industry peaks dashboard showing monthly sales patterns by category</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Smart stock suggestions: Know when and how much to reorder</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>AI-generated promo ideas tailored to your product categories</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
