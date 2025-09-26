import { ScanResult } from '@/types';
import BaselineFeaturesDisplay from './BaselineFeaturesDisplay';
import HighlightedHtmlDisplay from './HighlightedHtmlDisplay';
import BaselineSummaryCard from './BaselineSummaryCard';

interface ScanResultsDisplayProps {
  result: ScanResult;
}

export default function ScanResultsDisplay({ result }: ScanResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Baseline Summary */}
      <BaselineSummaryCard summary={result.baselineSummary} />

      {/* Baseline Features */}
      <BaselineFeaturesDisplay features={result.baselineFeatures} />

      {/* Highlighted HTML Content */}
      <HighlightedHtmlDisplay 
        highlightedHtmlContent={result.highlightedHtmlContent}
        originalSnippet={result.snippet}
      />

      {/* JSON Output */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Scan Results (JSON)</h3>
        <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm text-red-700">
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      </div>

      {/* CSS Snippet */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">CSS Preview (First 400 chars)</h3>
        <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
          <code className="text-purple-600">{result.cssSnippet || 'No CSS found'}</code>
        </pre>
      </div>
    </div>
  );
}