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
    <div className="bg-[#f582ae] border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8 mb-8">
      {showCurrentUrl && currentUrl && (
        <div className="mb-6 p-4 bg-[#8bd3dd] border-4 border-[#001858] shadow-[4px_4px_0px_#001858]">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-[#001858]" />
            <span className="text-sm font-black text-[#001858] uppercase">Currently Analyzing:</span>
          </div>
          <p className="text-[#001858] break-all font-mono text-sm bg-[#fef6e4] px-4 py-3 border-3 border-[#001858] font-bold">
            {currentUrl}
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="newUrl" className="block text-sm font-black text-[#001858] mb-3 uppercase tracking-wide">
            {showCurrentUrl ? '🔄 Scan Different Website' : '🌐 Website URL'}
          </label>
          <input
            id="newUrl"
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com"
            className="neo-brutalism-input text-[#001858] w-full px-4 py-4 bg-[#fef6e4] font-bold text-lg placeholder:text-[#001858] placeholder:opacity-50"
            disabled={loading}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleScan}
            disabled={loading || !newUrl.trim()}
            className="neo-brutalism-button px-8 py-4 bg-[#ffd803] text-[#001858] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 min-w-[160px] justify-center text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                SCANNING...
              </>
            ) : (
              <>
                {showCurrentUrl ? (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    SCAN NEW
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    SCAN
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