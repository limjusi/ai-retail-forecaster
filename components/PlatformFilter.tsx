'use client';

import { Filter } from 'lucide-react';

interface PlatformFilterProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export default function PlatformFilter({ selectedPlatform, onPlatformChange }: PlatformFilterProps) {
  const platforms = [
    { value: 'all', label: 'All Platforms', color: 'bg-gray-500' },
    { value: 'shopee', label: 'Shopee', color: 'bg-orange-500' },
    { value: 'tiktok', label: 'TikTok Shop', color: 'bg-black' },
    { value: 'lazada', label: 'Lazada', color: 'bg-blue-600' },
  ];

  return (
    <div className="bg-slate-800 p-3 md:p-4 rounded-lg border border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          <span className="text-xs md:text-sm font-medium text-gray-300">Filter:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.value}
              onClick={() => onPlatformChange(platform.value)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                selectedPlatform === platform.value
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className={`w-2 h-2 rounded-full ${platform.color}`}></div>
                <span className="whitespace-nowrap">{platform.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
