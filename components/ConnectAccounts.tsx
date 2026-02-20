'use client';

import { useState } from 'react';
import { ShoppingBag, ExternalLink } from 'lucide-react';

export default function ConnectAccounts() {
  const [connecting, setConnecting] = useState<string | null>(null);

  const platforms = [
    {
      id: 'shopee',
      name: 'Shopee',
      color: 'from-orange-500 to-red-500',
      description: 'Connect your Shopee seller account',
    },
    {
      id: 'tiktok',
      name: 'TikTok Shop',
      color: 'from-black to-gray-700',
      description: 'Connect your TikTok Shop seller account',
    },
    {
      id: 'lazada',
      name: 'Lazada',
      color: 'from-blue-600 to-purple-600',
      description: 'Connect your Lazada seller account',
    },
  ];

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    try {
      const response = await fetch(`/api/auth/${platformId}/authorize`);
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error(`Error connecting to ${platformId}:`, error);
      alert(`Failed to connect to ${platformId}. Please check your API credentials.`);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Connect Your Accounts</h2>
        <p className="text-sm md:text-base text-gray-400">Link your seller accounts to start tracking and forecasting</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="border border-slate-600 rounded-lg p-4 md:p-6 hover:border-slate-500 transition-all bg-slate-700 bg-opacity-50"
          >
            <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center mb-4`}>
              <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{platform.name}</h3>
            <p className="text-xs md:text-sm text-gray-400 mb-4">{platform.description}</p>
            <button
              onClick={() => handleConnect(platform.id)}
              disabled={connecting === platform.id}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
            >
              <ExternalLink className="w-4 h-4" />
              {connecting === platform.id ? 'Connecting...' : 'Connect Account'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 md:mt-8 bg-blue-600 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg p-4 md:p-6">
        <h3 className="font-semibold text-blue-400 mb-2 text-sm md:text-base">Setup Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm text-gray-300">
          <li>Ensure you have API credentials from each platform's developer portal</li>
          <li>Add credentials to your <code className="bg-blue-100 px-1 rounded">.env</code> file</li>
          <li>Click "Connect Account" to authorize via OAuth</li>
          <li>Once connected, data will sync automatically</li>
        </ol>
      </div>

      <div className="mt-4 md:mt-6 bg-yellow-600 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg p-3 md:p-4">
        <p className="text-xs md:text-sm text-yellow-300">
          <strong>Note:</strong> This is an MVP. Make sure to configure your API keys in the <code className="bg-yellow-900 bg-opacity-50 px-1 rounded text-yellow-200">.env</code> file before connecting accounts.
        </p>
      </div>
    </div>
  );
}
