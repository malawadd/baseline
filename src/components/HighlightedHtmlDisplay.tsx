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

  // Inline styles for baseline highlighting to ensure they work in the rendered content
  const baselineStyles = `
    <style>
      /* Reset some styles to prevent conflicts */
      .baseline-highlight-container * {
        position: relative;
      }
      
      /* Baseline Feature Highlighting */
      .highlight-widely-available {
        background-color: rgba(34, 197, 94, 0.15) !important;
        outline: 3px solid rgba(34, 197, 94, 0.5) !important;
        outline-offset: 2px;
        border-radius: 4px !important;
        position: relative !important;
        margin: 4px 0 !important;
        padding: 4px !important;
      }

      .highlight-newly-available {
        background-color: rgba(234, 179, 8, 0.15) !important;
        outline: 3px solid rgba(234, 179, 8, 0.5) !important;
        outline-offset: 2px;
        border-radius: 4px !important;
        position: relative !important;
        margin: 4px 0 !important;
        padding: 4px !important;
      }

      .highlight-limited-availability {
        background-color: rgba(239, 68, 68, 0.15) !important;
        outline: 3px solid rgba(239, 68, 68, 0.5) !important;
        outline-offset: 2px;
        border-radius: 4px !important;
        position: relative !important;
        margin: 4px 0 !important;
        padding: 4px !important;
      }

      /* Status badges */
      .highlight-widely-available::before {
        content: "✓ Widely Available";
        position: absolute;
        top: -12px;
        left: 0px;
        background: rgba(34, 197, 94, 0.95);
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 4px;
        z-index: 10000;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .highlight-newly-available::before {
        content: "⚡ Newly Available";
        position: absolute;
        top: -12px;
        left: 0px;
        background: rgba(234, 179, 8, 0.95);
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 4px;
        z-index: 10000;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .highlight-limited-availability::before {
        content: "⚠ Limited Availability";
        position: absolute;
        top: -12px;
        left: 0px;
        background: rgba(239, 68, 68, 0.95);
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 4px;
        z-index: 10000;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    </style>
  `;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Rendered Page with Baseline Highlights
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
                  <div className="w-3 h-3 bg-green-200 border-2 border-green-500 rounded"></div>
                  <span><strong>Green outline</strong> - Widely Available (safe to use without polyfills)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-200 border-2 border-yellow-500 rounded"></div>
                  <span><strong>Yellow outline</strong> - Newly Available (recently achieved cross-browser support)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-200 border-2 border-red-500 rounded"></div>
                  <span><strong>Red outline</strong> - Limited Availability (use progressive enhancement)</span>
                </div>
              </div>
              <p className="mt-2 text-xs opacity-80">
                This shows how the page renders with visual indicators on elements using modern baseline features.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-auto max-h-[600px]">
        {showHighlighted ? (
          <div 
            className="baseline-highlight-container"
            dangerouslySetInnerHTML={{ 
              __html: baselineStyles + highlightedHtmlContent 
            }}
          />
        ) : (
          <div className="bg-gray-50 p-4">
            <pre className="text-sm text-blue-600 whitespace-pre-wrap">
              <code>{originalSnippet}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}