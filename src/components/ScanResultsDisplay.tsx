import { useState } from 'react';
import { ScanResult } from '@/types';
import BaselineFeaturesDisplay from './BaselineFeaturesDisplay';
import HighlightedHtmlDisplay from './HighlightedHtmlDisplay';
import BaselineSummaryCard from './BaselineSummaryCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ScanResultsDisplayProps {
  result: ScanResult;
}

export default function ScanResultsDisplay({ result }: ScanResultsDisplayProps) {
  const [isJsonCollapsed, setIsJsonCollapsed] = useState<boolean>(false);
  const [isCssCollapsed, setIsCssCollapsed] = useState<boolean>(false);

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Scan Results (JSON)</h3>
          <button
            onClick={() => setIsJsonCollapsed(!isJsonCollapsed)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isJsonCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
        {!isJsonCollapsed && (
          <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm text-red-700">
            <code>{JSON.stringify(result, null, 2)}</code>
          </pre>
        )}
      </div>

      {/* CSS Snippet */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">CSS Preview (First 400 chars)</h3>
          <button
            onClick={() => setIsCssCollapsed(!isCssCollapsed)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isCssCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
        {!isCssCollapsed && (
          <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
            <code className="text-purple-600">{result.cssSnippet || 'No CSS found'}</code>
          </pre>
        )}
      </div>
    </div>
  );
}