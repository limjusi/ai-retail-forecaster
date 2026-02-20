'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/sync/shopee', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      setResult(data);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-6 border border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-1 text-white">Shopee Data Sync</h3>
          <p className="text-xs md:text-sm text-gray-400">
            Pull latest products, orders, and inventory from your Shopee shop
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {result && (
        <div className="mt-4 bg-green-600 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-400 text-sm md:text-base">Sync Successful!</p>
              <p className="text-xs md:text-sm text-green-300 mt-1">
                {result.products?.message} • {result.orders?.message}
              </p>
              <p className="text-xs text-green-400 mt-1">
                Page will refresh in 2 seconds...
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-600 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-400 text-sm md:text-base">Sync Failed</p>
              <p className="text-xs md:text-sm text-red-300 mt-1">{error}</p>
              {error.includes('not connected') && (
                <p className="text-xs text-red-400 mt-2">
                  Go to "Connect Accounts" tab to link your Shopee shop first
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
