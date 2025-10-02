import { BaselineSummary } from '@/types';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, TrendingUp, ExternalLink } from 'lucide-react';

interface BaselineSummaryCardProps {
  summary: BaselineSummary;
}

export default function BaselineSummaryCard({ summary }: BaselineSummaryCardProps) {
  if (summary.total === 0) {
    return (
      <div className="bg-[#f3d2c1] border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-8 h-8 text-[#001858] mr-3" />
          <h3 className="text-xl font-black text-[#001858] uppercase">
            Baseline Feature Summary
          </h3>
        </div>
        <p className="text-[#001858] font-bold">No modern web features detected on this page.</p>
      </div>
    );
  }

  const compatibilityScore = Math.round(
    (summary.widelyAvailable / summary.total) * 100
  );

  return (
    <div className="bg-white border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="w-8 h-8 text-[#001858] mr-3" />
          <h3 className="text-2xl font-black text-[#001858] uppercase">
            Baseline Summary
          </h3>
        </div>
        <div className="text-right bg-[#8bd3dd] border-4 border-[#001858] p-4 shadow-[4px_4px_0px_#001858]">
          <div className="text-4xl font-black text-[#001858]">{compatibilityScore}%</div>
          <div className="text-xs text-[#001858] font-bold uppercase tracking-wide">Score</div>
        </div>
      </div>

      {/* Educational Introduction */}
      <div className="mb-6 p-4 bg-[#8bd3dd] border-4 border-[#001858] shadow-[4px_4px_0px_#001858]">
        <p className="text-sm text-[#001858] mb-2 font-bold">
          <strong className="font-black">WEB PLATFORM BASELINE:</strong> Features interoperable 
          across all major evergreen browsers. This analysis helps you understand your website&apos;s 
          adoption of stable, widely-supported features.
        </p>
        <a 
          href="https://web.dev/baseline" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[#001858] font-black underline hover:translate-x-1 transition-transform uppercase"
        >
          Learn More →
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-6 bg-[#d4f4dd] border-4 border-[#001858] shadow-[4px_4px_0px_#001858] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#001858] transition-all">
          <CheckCircle className="w-10 h-10 text-[#001858] mx-auto mb-2" />
          <div className="text-4xl font-black text-[#001858]">{summary.widelyAvailable}</div>
          <div className="text-xs text-[#001858] font-black uppercase mt-2">Widely Available</div>
          <div className="text-xs text-[#001858] mt-1 font-bold">✓ Safe to use</div>
        </div>

        <div className="text-center p-6 bg-[#fff9db] border-4 border-[#001858] shadow-[4px_4px_0px_#001858] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#001858] transition-all">
          <AlertCircle className="w-10 h-10 text-[#001858] mx-auto mb-2" />
          <div className="text-4xl font-black text-[#001858]">{summary.newlyAvailable}</div>
          <div className="text-xs text-[#001858] font-black uppercase mt-2">Newly Available</div>
          <div className="text-xs text-[#001858] mt-1 font-bold">⚡ Recently supported</div>
        </div>

        <div className="text-center p-6 bg-[#ffe5eb] border-4 border-[#001858] shadow-[4px_4px_0px_#001858] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#001858] transition-all">
          <XCircle className="w-10 h-10 text-[#001858] mx-auto mb-2" />
          <div className="text-4xl font-black text-[#001858]">{summary.limitedAvailability}</div>
          <div className="text-xs text-[#001858] font-black uppercase mt-2">Limited</div>
          <div className="text-xs text-[#001858] mt-1 font-bold">⚠ Use with caution</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#fef6e4] border-3 border-[#001858] text-sm text-[#001858] font-bold">
        <strong className="font-black">{summary.total} FEATURES DETECTED.</strong> Higher scores = better cross-browser support!
      </div>
    </div>
  );
}