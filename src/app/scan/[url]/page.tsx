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
    <div className="min-h-screen" style={{ background: '#fef6e4' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header - Matching Main Page */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6 p-4 bg-[#8bd3dd] border-4 border-[#001858] shadow-[8px_8px_0px_#001858] transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#001858] transition-all">
              <div className="flex items-center justify-center">
                <Globe className="w-16 h-16 text-[#001858] mr-4" />
                <h1 className="text-5xl font-black text-[#001858] uppercase tracking-tight">
                  Web Baseline<br/>Scanner
                </h1>
              </div>
            </div>
            <p className="text-[#001858] text-xl font-bold mb-2">
              SCAN RESULTS
            </p>
          </div>

          {/* URL Scan Input Section with Current URL */}
          <UrlScanInput currentUrl={decodedUrl} showCurrentUrl={true} />
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12 bg-white border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
              <Loader2 className="w-12 h-12 animate-spin text-[#001858] mr-4" />
              <p className="text-2xl text-[#001858] font-black uppercase">Scanning...</p>
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
                  color="bg-[#8bd3dd]"
                />
                <ScanResultCard
                  icon={Palette}
                  label="CSS Size"
                  value={`${(result.cssLength / 1024).toFixed(1)}KB`}
                  color="bg-[#f582ae]"
                />
                <ScanResultCard
                  icon={Code}
                  label="Stylesheets"
                  value={result.stylesheets}
                  color="bg-[#d4f4dd]"
                />
                <ScanResultCard
                  icon={FileText}
                  label="Inline Blocks"
                  value={result.inlineBlocks}
                  color="bg-[#fff9db]"
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