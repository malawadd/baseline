import { useState } from 'react';
import { ScanResult } from '@/types';
import BaselineFeaturesDisplay from './BaselineFeaturesDisplay';
import HighlightedHtmlDisplay from './HighlightedHtmlDisplay';
import BaselineSummaryCard from './BaselineSummaryCard';
import CodeViewer from './CodeViewer';
import { ChevronDown, ChevronUp, Code as Code2, FileText } from 'lucide-react';

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
        cssContent={result.cssContent}
      />

      {/* Full HTML Source Code */}
      <div className="bg-white border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#001858]" />
            <h3 className="text-2xl font-black text-[#001858] uppercase">Complete HTML Source</h3>
            <span className="bg-[#8bd3dd] border-3 border-[#001858] px-3 py-1 shadow-[2px_2px_0px_#001858] text-sm font-black text-[#001858]">
              {(result.htmlLength / 1024).toFixed(1)}KB
            </span>
          </div>
          <button
            onClick={() => setIsFullHtmlCollapsed(!isFullHtmlCollapsed)}
            className="neo-brutalism-button flex items-center gap-2 px-5 py-3 bg-[#ffd803] text-[#001858] text-sm"
          >
            {isFullHtmlCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            {isFullHtmlCollapsed ? 'SHOW' : 'HIDE'}
          </button>
        </div>
        {!isFullHtmlCollapsed && (
          <div className="space-y-4">
            <div className="text-sm text-[#001858] bg-[#d4f4dd] border-4 border-[#001858] shadow-[4px_4px_0px_#001858] p-4">
              <p className="font-black mb-2 uppercase">📋 Full HTML Source with Baseline Annotations</p>
              <p className="font-bold mb-3">
                This view shows the complete HTML source code with syntax highlighting.
                Lines containing baseline features are annotated with colored backgrounds:
              </p>
              <div className="space-y-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">✓</span>
                  <span><strong className="font-black">GREEN</strong> - Widely available features (safe to use)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">⚡</span>
                  <span><strong className="font-black">YELLOW</strong> - Newly available features (recently standardized)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">⚠</span>
                  <span><strong className="font-black">RED</strong> - Limited availability (use with caution)</span>
                </div>
              </div>
            </div>
            
            <CodeViewer 
              code={result.htmlContent || result.highlightedHtmlContent} 
              language="html"
              className="max-h-96 overflow-y-auto"
              baselineFeatures={result.baselineFeatures}
            />
          </div>
        )}
      </div>

      {/* Full CSS Source Code */}
      <div className="bg-white border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code2 className="w-8 h-8 text-[#001858]" />
            <h3 className="text-2xl font-black text-[#001858] uppercase">Complete CSS Source</h3>
            <span className="bg-[#f582ae] border-3 border-[#001858] px-3 py-1 shadow-[2px_2px_0px_#001858] text-sm font-black text-[#001858]">
              {(result.cssLength / 1024).toFixed(1)}KB
            </span>
          </div>
          <button
            onClick={() => setIsFullCssCollapsed(!isFullCssCollapsed)}
            className="neo-brutalism-button flex items-center gap-2 px-5 py-3 bg-[#ffd803] text-[#001858] text-sm"
          >
            {isFullCssCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            {isFullCssCollapsed ? 'SHOW' : 'HIDE'}
          </button>
        </div>
        {!isFullCssCollapsed && (
          <div className="space-y-4">
            <div className="text-sm text-[#001858] bg-[#fff9db] border-4 border-[#001858] shadow-[4px_4px_0px_#001858] p-4">
              <p className="font-black mb-2 uppercase">🎨 Complete CSS Source with Baseline Annotations</p>
              <p className="font-bold mb-3">
                This view shows all CSS content found on the page, including both inline styles and external stylesheets.
                Lines containing modern CSS features are annotated with colored backgrounds indicating their baseline status.
              </p>
              <div className="space-y-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">✓</span>
                  <span><strong className="font-black">GREEN</strong> - Widely available CSS features</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">⚡</span>
                  <span><strong className="font-black">YELLOW</strong> - Newly available CSS features</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">⚠</span>
                  <span><strong className="font-black">RED</strong> - Limited availability CSS features</span>
                </div>
              </div>
            </div>
            <CodeViewer 
              code={result.cssContent || result.cssSnippet || 'No CSS content found'} 
              language="css"
              className="max-h-96 overflow-y-auto"
              baselineFeatures={result.baselineFeatures}
            />
          </div>
        )}
      </div>

      {/* JSON Output */}
      <div className="bg-white border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-[#001858] uppercase">Scan Results (JSON)</h3>
          <button
            onClick={() => setIsJsonCollapsed(!isJsonCollapsed)}
            className="neo-brutalism-button flex items-center gap-2 px-5 py-3 bg-[#8bd3dd] text-[#001858] text-sm"
          >
            {isJsonCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            {isJsonCollapsed ? 'SHOW' : 'HIDE'}
          </button>
        </div>
        {!isJsonCollapsed && (
          <pre className="bg-[#fef6e4] border-4 border-[#001858] shadow-[4px_4px_0px_#001858] p-4 overflow-x-auto text-sm text-[#001858] font-mono font-bold">
            <code>{JSON.stringify(result, null, 2)}</code>
          </pre>
        )}
      </div>

      {/* CSS Snippet (Legacy - keeping for backward compatibility) */}
      <div className="bg-white border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-[#001858] uppercase">CSS Preview (First 400 chars)</h3>
          <button
            onClick={() => setIsCssCollapsed(!isCssCollapsed)}
            className="neo-brutalism-button flex items-center gap-2 px-5 py-3 bg-[#f582ae] text-[#001858] text-sm"
          >
            {isCssCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            {isCssCollapsed ? 'SHOW' : 'HIDE'}
          </button>
        </div>
        {!isCssCollapsed && (
          <pre className="bg-[#fef6e4] border-4 border-[#001858] shadow-[4px_4px_0px_#001858] p-4 overflow-x-auto text-sm font-mono font-bold">
            <code className="text-[#001858]">{result.cssSnippet || 'No CSS found'}</code>
          </pre>
        )}
      </div>
    </div>
  );
}