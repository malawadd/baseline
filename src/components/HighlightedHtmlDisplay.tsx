import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';

interface HighlightedHtmlDisplayProps {
  highlightedHtmlContent: string;
  originalSnippet: string;
  cssContent?: string;
}

export default function HighlightedHtmlDisplay({ 
  highlightedHtmlContent, 
  originalSnippet,
  cssContent 
}: HighlightedHtmlDisplayProps) {
  const [showHighlighted, setShowHighlighted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Inline styles for baseline highlighting to ensure they work in the rendered content
  const baselineStyles = `
    <style>
      /* Reset some styles to prevent conflicts */
      .baseline-highlight-container * {
        position: relative;
      }
      
      /* Baseline Feature Highlighting - Neobrutalism */
      .highlight-widely-available {
        background-color: #d4f4dd !important;
        border: 4px solid #00e0b0 !important;
        box-shadow: 4px 4px 0px #00e0b0 !important;
        position: relative !important;
        margin: 8px 0 !important;
        padding: 8px !important;
      }

      .highlight-newly-available {
        background-color: #fff9db !important;
        border: 4px solid #ffd803 !important;
        box-shadow: 4px 4px 0px #ffd803 !important;
        position: relative !important;
        margin: 8px 0 !important;
        padding: 8px !important;
      }

      .highlight-limited-availability {
        background-color: #ffe5eb !important;
        border: 4px solid #ff5470 !important;
        box-shadow: 4px 4px 0px #ff5470 !important;
        position: relative !important;
        margin: 8px 0 !important;
        padding: 8px !important;
      }

      /* Status badges - Neobrutalism */
      .highlight-widely-available::before {
        content: "✓ WIDELY AVAILABLE";
        position: absolute;
        top: -16px;
        left: 8px;
        background: #00e0b0;
        color: #001858;
        font-size: 11px;
        font-weight: 900;
        padding: 4px 10px;
        border: 3px solid #001858;
        box-shadow: 3px 3px 0px #001858;
        z-index: 10000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .highlight-newly-available::before {
        content: "⚡ NEWLY AVAILABLE";
        position: absolute;
        top: -16px;
        left: 8px;
        background: #ffd803;
        color: #001858;
        font-size: 11px;
        font-weight: 900;
        padding: 4px 10px;
        border: 3px solid #001858;
        box-shadow: 3px 3px 0px #001858;
        z-index: 10000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .highlight-limited-availability::before {
        content: "⚠ LIMITED AVAILABILITY";
        position: absolute;
        top: -16px;
        left: 8px;
        background: #ff5470;
        color: white;
        font-size: 11px;
        font-weight: 900;
        padding: 4px 10px;
        border: 3px solid #001858;
        box-shadow: 3px 3px 0px #001858;
        z-index: 10000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    </style>
  `;

  // Combine the original CSS with baseline highlighting styles
  const originalPageStyles = cssContent ? `<style>${cssContent}</style>` : '';
  
  // Create complete HTML document for iframe
  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${baselineStyles}
        ${originalPageStyles}
      </head>
      <body class="baseline-highlight-container">
        ${highlightedHtmlContent}
      </body>
    </html>
  `;

  // Update iframe content when it changes
  useEffect(() => {
    if (iframeRef.current && showHighlighted) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(iframeContent);
        iframeDoc.close();
      }
    }
  }, [iframeContent, showHighlighted]);

  return (
    <div className="bg-white border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-[#001858] uppercase">
          Rendered Page Preview
        </h3>
        <button
          onClick={() => setShowHighlighted(!showHighlighted)}
          className="neo-brutalism-button flex items-center gap-2 px-6 py-3 bg-[#f582ae] text-[#001858]"
        >
          {showHighlighted ? (
            <>
              <EyeOff className="w-5 h-5" />
              SHOW ORIGINAL
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              SHOW HIGHLIGHTS
            </>
          )}
        </button>
      </div>

      {showHighlighted && (
        <div className="mb-6 p-4 bg-[#8bd3dd] border-4 border-[#001858] shadow-[4px_4px_0px_#001858]">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-[#001858] mt-0.5 flex-shrink-0" />
            <div className="text-sm text-[#001858]">
              <p className="font-black mb-3 uppercase">Baseline Feature Highlighting Guide:</p>
              <div className="space-y-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#d4f4dd] border-3 border-[#00e0b0] shadow-[2px_2px_0px_#00e0b0]"></div>
                  <span><strong className="font-black">GREEN</strong> - Widely Available (safe to use)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#fff9db] border-3 border-[#ffd803] shadow-[2px_2px_0px_#ffd803]"></div>
                  <span><strong className="font-black">YELLOW</strong> - Newly Available (recently supported)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#ffe5eb] border-3 border-[#ff5470] shadow-[2px_2px_0px_#ff5470]"></div>
                  <span><strong className="font-black">RED</strong> - Limited Availability (use with caution)</span>
                </div>
              </div>
              <p className="mt-3 text-xs font-bold">
                This shows how the page renders with its original styling plus visual indicators on baseline features.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-4 border-[#001858] shadow-[4px_4px_0px_#001858] overflow-auto">
        {showHighlighted ? (
          <iframe
            ref={iframeRef}
            title="Rendered Page Preview"
            className="w-full min-h-[600px] border-0"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="bg-[#fef6e4] p-4">
            <pre className="text-sm text-[#001858] font-bold whitespace-pre-wrap">
              <code>{originalSnippet}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}