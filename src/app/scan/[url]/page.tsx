'use client';

import { useParams } from 'next/navigation';
import { useScanData } from '@/hooks/useScanData';
import { Loader2, Globe, Code, FileText, Palette } from 'lucide-react';
import ErrorMessage from '@/components/ErrorMessage';
import ScanResultCard from '@/components/ScanResultCard';
import ScanResultsDisplay from '@/components/ScanResultsDisplay';
import UrlScanInput from '@/components/UrlScanInput';

export default function ScanResultPage() {
  const params = useParams();
  const encodedUrl = Array.isArray(params.url) ? params.url[0] : params.url;
  const decodedUrl = encodedUrl ? decodeURIComponent(encodedUrl) : '';

  const { result, loading, error } = useScanData(decodedUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-12 h-12 text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">Scan Results</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Website analysis and scanning tool
            </p>
          </div>

          {/* URL Scan Input Section with Current URL */}
          <UrlScanInput currentUrl={decodedUrl} showCurrentUrl={true} />
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
              <p className="text-xl text-gray-700">Scanning...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <ErrorMessage error={error} />
          )}

          {/* Results */}
          {!loading && !error && result && (
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