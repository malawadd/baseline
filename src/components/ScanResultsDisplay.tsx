import { useState } from 'react';
import { ScanResult } from '@/types';
import BaselineFeaturesDisplay from './BaselineFeaturesDisplay';
import HighlightedHtmlDisplay from './HighlightedHtmlDisplay';
import BaselineSummaryCard from './BaselineSummaryCard';
import CodeViewer from './CodeViewer';
import { ChevronDown, ChevronUp, Code2, FileText } from 'lucide-react';

interface ScanResultsDisplayProps {
  result: ScanResult;
}

export default function ScanResultsDisplay({ result }: ScanResultsDisplayProps) {
  const [isJsonCollapsed, setIsJsonCollapsed] = useState<boolean>(false);
  const [isCssCollapsed, setIsCssCollapsed] = useState<boolean>(false);
  const [isFullHtmlCollapsed, setIsFullHtmlCollapsed] = useState<boolean>(true);
  const [isFullCssCollapsed, setIsFullCssCollapsed] = useState<boolean>(true);

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

      {/* Full HTML Source Code */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Complete HTML Source</h3>
            <span className="text-sm text-gray-500">
              ({(result.htmlLength / 1024).toFixed(1)}KB)
            </span>
          </div>
          <button
            onClick={() => setIsFullHtmlCollapsed(!isFullHtmlCollapsed)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isFullHtmlCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {isFullHtmlCollapsed ? 'Show' : 'Hide'}
          </button>
        </div>
        {!isFullHtmlCollapsed && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-medium text-blue-800 mb-1">📋 Full HTML Source with Baseline Highlighting</p>
              <p className="text-blue-700">
                This view shows the complete HTML source code with Baseline features highlighted. 
                Green borders indicate widely available features, yellow for newly available, and red for limited availability.
              </p>
            </div>
            <CodeViewer 
              code={result.highlightedHtmlContent} 
              language="html"
              className="max-h-96 overflow-y-auto"
            />
          </div>
        )}
      </div>

      {/* Full CSS Source Code */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Complete CSS Source</h3>
            <span className="text-sm text-gray-500">
              ({(result.cssLength / 1024).toFixed(1)}KB)
            </span>
          </div>
          <button
            onClick={() => setIsFullCssCollapsed(!isFullCssCollapsed)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isFullCssCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {isFullCssCollapsed ? 'Show' : 'Hide'}
          </button>
        </div>
        {!isFullCssCollapsed && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="font-medium text-purple-800 mb-1">🎨 Complete CSS Source</p>
              <p className="text-purple-700">
                This view shows all CSS content found on the page, including both inline styles and external stylesheets. 
                Modern CSS features detected are highlighted in the Baseline Features section above.
              </p>
            </div>
            <CodeViewer 
              code={result.cssContent || 'No CSS content found'} 
              language="css"
              className="max-h-96 overflow-y-auto"
            />
          </div>
        )}
      </div>

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

      {/* CSS Snippet (Legacy - keeping for backward compatibility) */}
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