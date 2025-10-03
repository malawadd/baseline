'use client';

import { Globe } from 'lucide-react';
import UrlScanInput from '@/components/UrlScanInput';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#fef6e4' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6 p-4 bg-[#8bd3dd] border-4 border-[#001858] shadow-[8px_8px_0px_#001858] transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#001858] transition-all">
              <div className="flex items-center justify-center">
                <Globe className="w-16 h-16 text-[#001858] mr-4" />
                <h1 className="text-5xl font-black text-[#001858] uppercase tracking-tight">
                  Web Baseline<br/>Scanner
                </h1>
              </div>
            </div>
            <p className="text-[#001858] text-xl font-bold mb-4">
              ANALYZE WEBSITE BASELINE FEATURES
            </p>
            <p className="text-[#001858] text-lg font-semibold max-w-2xl mx-auto">
              Discover which modern web platform features your site uses and their cross-browser support status
            </p>
          </div>

          {/* Input Section */}
          <UrlScanInput />

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#d4f4dd] border-4 border-[#001858] p-6 shadow-[6px_6px_0px_#001858]">
              <div className="text-3xl mb-2 text-[#44f175]">✓</div>
              <h3 className="font-black text-[#001858] uppercase mb-2">Widely Available</h3>
              <p className="text-[#001858] font-semibold text-sm">Features supported for 2.5+ years across all major browsers</p>
            </div>
            <div className="bg-[#fff9db] border-4 border-[#001858] p-6 shadow-[6px_6px_0px_#001858]">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-black text-[#001858] uppercase mb-2">Newly Available</h3>
              <p className="text-[#001858] font-semibold text-sm">Recently achieved cross-browser support</p>
            </div>
            <div className="bg-[#ffe5eb] border-4 border-[#001858] p-6 shadow-[6px_6px_0px_#001858]">
              <div className="text-3xl mb-2 text-[#f03964]">⚠</div>
              <h3 className="font-black text-[#001858] uppercase mb-2">Limited Support</h3>
              <p className="text-[#001858] font-semibold text-sm">Incomplete browser support - use with caution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}