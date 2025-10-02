import { useState } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';

interface HighlightedHtmlDisplayProps {
  highlightedHtmlContent: string;
  originalSnippet: string;
}

export default function HighlightedHtmlDisplay({ 
  highlightedHtmlContent, 
  originalSnippet 
}: HighlightedHtmlDisplayProps) {
  const [showHighlighted, setShowHighlighted] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          HTML Content with Baseline Highlights
        </h3>
        <button
          onClick={() => setShowHighlighted(!showHighlighted)}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
        >
          {showHighlighted ? (
            <>
              <EyeOff className="w-4 h-4" />
              Show Original
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Highlights
            </>
          )}
        </button>
      </div>

      {showHighlighted && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Baseline Feature Highlighting Guide:</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
                  <span><strong>Widely Available</strong> - Safe to use without polyfills (2.5+ years of support)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded"></div>
                  <span><strong>Newly Available</strong> - Recently achieved cross-browser support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-200 border border-red-400 rounded"></div>
                  <span><strong>Limited Availability</strong> - Incomplete browser support, use progressive enhancement</span>
                </div>
              </div>
              <p className="mt-2 text-xs opacity-80">
                Highlighted elements and styles use modern web features. Check individual feature details for implementation guidance.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
        {showHighlighted ? (
          <div 
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: highlightedHtmlContent }}
          />
        ) : (
          <pre className="text-sm text-blue-600 whitespace-pre-wrap">
            <code>{originalSnippet}</code>
          </pre>
        )}
      </div>
    </div>
  );
}