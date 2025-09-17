'use client';

import { useState } from 'react';
import { Loader2, Globe, Code, FileText, Palette } from 'lucide-react';
import { ScanResult } from '@/types';
import ErrorMessage from '@/components/ErrorMessage';
import ScanResultCard from '@/components/ScanResultCard';
import ScanResultsDisplay from '@/components/ScanResultsDisplay';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/scan?url=${encodeURIComponent(url.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleScan();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-12 h-12 text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">Website Scanner</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Analyze any website&apos;s HTML and CSS content
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://example.com"
                  className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      Scan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <ErrorMessage error={error} />
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ScanResultCard
                  icon={FileText}
                  label="HTML Size"
                  value={`${(result.htmlLength / 1024).toFixed(1)}KB`}
                  color="text-blue-500"
                />
                <ScanResultCard
                  icon={Palette}
                  label="CSS Size"
                  value={`${(result.cssLength / 1024).toFixed(1)}KB`}
                  color="text-purple-500"
                />
                <ScanResultCard
                  icon={Code}
                  label="Stylesheets"
                  value={result.stylesheets}
                  color="text-green-500"
                />
                <ScanResultCard
                  icon={FileText}
                  label="Inline Blocks"
                  value={result.inlineBlocks}
                  color="text-orange-500"
                />
              </div>

              <ScanResultsDisplay result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}