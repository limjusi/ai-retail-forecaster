'use client';

import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function CSVImport() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const template = `date,product_name,category,platform,units_sold,price,sku
2024-01-15,Wireless Earbuds,electronics,shopee,5,89.90,SKU-001
2024-01-16,Cotton T-Shirt,fashion,tiktok,3,25.00,SKU-002
2024-01-17,Face Serum,beauty,lazada,2,45.50,SKU-003`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-8 border border-slate-700">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Import Sales Data</h2>
        <p className="text-sm md:text-base text-gray-400">Upload your sales data from any platform via CSV</p>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 md:p-8 text-center hover:border-indigo-500 transition-colors bg-slate-700 bg-opacity-50">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mb-4" />
            <p className="text-base md:text-lg font-semibold mb-2 text-white">
              {uploading ? 'Uploading...' : 'Click to Upload CSV'}
            </p>
            <p className="text-xs md:text-sm text-gray-400">
              or drag and drop your sales data file
            </p>
          </label>
        </div>

        {/* Template Section */}
        <div className="border border-slate-600 rounded-lg p-6 md:p-8 bg-slate-700 bg-opacity-50">
          <FileText className="w-10 h-10 md:w-12 md:h-12 text-indigo-400 mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2 text-white">Download Template</h3>
          <p className="text-xs md:text-sm text-gray-400 mb-4">
            Get a sample CSV file with the correct format
          </p>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>

      {/* Success Message */}
      {result && (
        <div className="mt-4 md:mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900 text-sm md:text-base">Import Successful!</p>
              <p className="text-xs md:text-sm text-green-700 mt-1">
                Imported {result.productsCreated} products and {result.salesCreated} sales records
              </p>
              <p className="text-xs text-green-600 mt-1">
                Page will refresh in 2 seconds...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 md:mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900 text-sm md:text-base">Import Failed</p>
              <p className="text-xs md:text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 md:mt-6 bg-blue-600 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg p-4 md:p-6">
        <h3 className="font-semibold text-blue-400 mb-3 text-sm md:text-base">CSV Format Requirements</h3>
        <ul className="space-y-2 text-xs md:text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>date</strong>: Format YYYY-MM-DD (e.g., 2024-01-15)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>product_name</strong>: Name of the product</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>category</strong>: electronics, fashion, beauty, home-living, toys, groceries, etc.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>platform</strong>: shopee, tiktok, or lazada</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>units_sold</strong>: Number of units (integer)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>price</strong>: Price per unit (decimal, e.g., 29.90)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>sku</strong>: Product SKU (optional)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
