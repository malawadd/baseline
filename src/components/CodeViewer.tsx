import { useEffect, useState } from 'react';
import { createStarryNight } from '@wooorm/starry-night';
import { toHtml } from 'hast-util-to-html';
import { BaselineFeature } from '@/types';

interface CodeViewerProps {
  code: string;
  language: 'html' | 'css';
  className?: string;
  baselineFeatures?: BaselineFeature[];
}

export default function CodeViewer({ code, language, className = '', baselineFeatures }: CodeViewerProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Import grammars dynamically
        const [htmlGrammar, cssGrammar] = await Promise.all([
          import('@wooorm/starry-night/text.html.basic'),
          import('@wooorm/starry-night/source.css')
        ]);

        // Create starry-night instance
        const starryNight = await createStarryNight([
          htmlGrammar.default,
          cssGrammar.default
        ]);

        // Get the appropriate scope for the language
        const scope = language === 'html' ? 'text.html.basic' : 'source.css';
        
        // Highlight the code
        const tree = starryNight.highlight(code, scope);
        
        // Convert to HTML string
        let highlighted = toHtml(tree);
        
        // If we have baseline features, annotate the code
        if (baselineFeatures && baselineFeatures.length > 0) {
          highlighted = annotateWithBaselineFeatures(highlighted, code, baselineFeatures);
        }
        
        setHighlightedCode(highlighted);
      } catch (err) {
        console.error('Failed to highlight code:', err);
        setError('Failed to highlight code');
        // Fallback to plain text
        setHighlightedCode(`<code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`);
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      highlightCode();
    }
  }, [code, language, baselineFeatures]);

  if (isLoading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Highlighting code...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="text-red-600 text-sm mb-2">{error}</div>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 overflow-x-auto ${className}`}>
      <pre className="text-sm">
        <div 
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className="starry-night"
        />
      </pre>
    </div>
  );
}

// Helper function to annotate code with baseline feature indicators
function annotateWithBaselineFeatures(
  highlightedHtml: string, 
  originalCode: string, 
  features: BaselineFeature[]
): string {
  // Split the code into lines for line-by-line annotation
  const lines = originalCode.split('\n');
  const highlightedLines = highlightedHtml.split('\n');
  
  // Map to track which lines contain which features
  const lineFeatures = new Map<number, BaselineFeature[]>();
  
  // Find features in the code
  features.forEach(feature => {
    if (feature.selector || feature.name) {
      const searchTerm = feature.selector || feature.name.toLowerCase().replace(/\s+/g, '-');
      
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(searchTerm)) {
          if (!lineFeatures.has(index)) {
            lineFeatures.set(index, []);
          }
          lineFeatures.get(index)!.push(feature);
        }
      });
    }
  });
  
  // Add annotations to lines with features
  const annotatedLines = highlightedLines.map((line, index) => {
    const featuresOnLine = lineFeatures.get(index);
    
    if (featuresOnLine && featuresOnLine.length > 0) {
      // Determine the most significant baseline status
      const status = featuresOnLine.some(f => f.status === 'Limited availability') 
        ? 'limited' 
        : featuresOnLine.some(f => f.status === 'Newly available')
        ? 'newly'
        : 'widely';
      
      const bgClass = status === 'widely' 
        ? 'baseline-line-widely' 
        : status === 'newly'
        ? 'baseline-line-newly'
        : 'baseline-line-limited';
      
      const indicator = status === 'widely' 
        ? '✓' 
        : status === 'newly'
        ? '⚡'
        : '⚠';
      
      return `<div class="${bgClass}" style="display: flex; align-items: center; padding: 2px 4px; margin: 1px 0; border-radius: 2px;">
        <span style="margin-right: 8px; font-weight: bold; opacity: 0.7;">${indicator}</span>
        <span style="flex: 1;">${line}</span>
      </div>`;
    }
    
    return `<div style="padding: 2px 4px;">${line}</div>`;
  });
  
  return annotatedLines.join('\n');
}