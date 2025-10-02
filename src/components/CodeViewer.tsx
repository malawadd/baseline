import { useEffect, useState } from 'react';
import { createStarryNight } from '@wooorm/starry-night';
import { toHtml } from 'hast-util-to-html';

interface CodeViewerProps {
  code: string;
  language: 'html' | 'css';
  className?: string;
}

export default function CodeViewer({ code, language, className = '' }: CodeViewerProps) {
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
        const highlighted = toHtml(tree);
        
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
  }, [code, language]);

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