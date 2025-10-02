import { BaselineSummary } from '@/types';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, TrendingUp, ExternalLink } from 'lucide-react';

interface BaselineSummaryCardProps {
  summary: BaselineSummary;
}

export default function BaselineSummaryCard({ summary }: BaselineSummaryCardProps) {
  if (summary.total === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-gray-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-800">
            Baseline Feature Summary
          </h3>
        </div>
        <p className="text-gray-600">No modern web features detected on this page.</p>
      </div>
    );
  }

  const compatibilityScore = Math.round(
    (summary.widelyAvailable / summary.total) * 100
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendingUp className="w-6 h-6 text-indigo-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-800">
            Web Platform Baseline Summary
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{compatibilityScore}%</div>
          <div className="text-xs text-gray-500">Compatibility Score</div>
        </div>
      </div>

      {/* Educational Introduction */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Web Platform Baseline</strong> represents web features that are interoperable 
          across all major evergreen browsers. This analysis helps you understand your website's 
          adoption of stable, widely-supported features.
        </p>
        <a 
          href="https://web.dev/baseline" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Learn more about Baseline
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-800">{summary.widelyAvailable}</div>
          <div className="text-xs text-green-600 font-medium">Widely Available</div>
          <div className="text-xs text-green-600 mt-1 opacity-80">Safe to use everywhere</div>
        </div>

        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertCircle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-800">{summary.newlyAvailable}</div>
          <div className="text-xs text-yellow-600 font-medium">Newly Available</div>
          <div className="text-xs text-yellow-600 mt-1 opacity-80">Recently supported</div>
        </div>

        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-800">{summary.limitedAvailability}</div>
          <div className="text-xs text-red-600 font-medium">Limited Availability</div>
          <div className="text-xs text-red-600 mt-1 opacity-80">Use with caution</div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>{summary.total}</strong> web platform features detected. 
          Higher compatibility scores indicate better cross-browser support and safer implementation choices.
        </p>
      </div>
    </div>
  );
}