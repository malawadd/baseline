'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Globe, ArrowRight } from 'lucide-react';

interface UrlScanInputProps {
  currentUrl?: string;
  showCurrentUrl?: boolean;
}

export default function UrlScanInput({ currentUrl, showCurrentUrl = false }: UrlScanInputProps) {
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleScan = async () => {
    if (!newUrl.trim()) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    
    // Navigate to the scan results page with new URL
    const encodedNewUrl = encodeURIComponent(newUrl.trim());
    router.push(`/scan/${encodedNewUrl}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleScan();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {showCurrentUrl && currentUrl && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">Currently analyzing:</span>
          </div>
          <p className="text-indigo-700 break-all font-mono text-sm bg-white px-3 py-2 rounded border">
            {currentUrl}
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="newUrl" className="block text-sm font-medium text-gray-700 mb-2">
            {showCurrentUrl ? 'Scan a different website' : 'Website URL'}
          </label>
          <input
            id="newUrl"
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            disabled={loading}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleScan}
            disabled={loading || !newUrl.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                {showCurrentUrl ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Scan New
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    Scan
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}