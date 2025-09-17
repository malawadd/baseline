'use client';

import { Globe } from 'lucide-react';
import UrlScanInput from '@/components/UrlScanInput';

export default function Home() {
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
          <UrlScanInput />
        </div>
      </div>
    </div>
  );
}