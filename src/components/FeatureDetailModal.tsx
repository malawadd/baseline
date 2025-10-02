import { X, ExternalLink, Info, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle } from 'lucide-react';
import { BaselineFeature } from '@/types';

interface FeatureDetailModalProps {
  feature: BaselineFeature | null;
  isOpen: boolean;
  onClose: () => void;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Widely available':
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case 'Newly available':
      return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    case 'Limited availability':
      return <XCircle className="w-6 h-6 text-red-500" />;
    default:
      return <Info className="w-6 h-6 text-gray-500" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Widely available':
      return 'bg-green-50 text-green-800 border-green-200';
    case 'Newly available':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'Limited availability':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
}

function getImplementationGuidance(status: string) {
  switch (status) {
    case 'Widely available':
      return {
        recommendation: '✅ Safe to implement',
        description: 'This feature is supported across all major evergreen browsers for at least 2.5 years. You can use it confidently without polyfills or feature detection.',
        considerations: [
          'No polyfills needed',
          'Safe for production use',
          'Excellent cross-browser support',
          'No progressive enhancement required'
        ]
      };
    case 'Newly available':
      return {
        recommendation: '⚠️ Consider your audience',
        description: 'This feature has recently achieved Baseline status across all major evergreen browsers. Generally safe to use but consider your target audience.',
        considerations: [
          'Recently supported everywhere',
          'Consider your user base',
          'May need fallbacks for older browsers',
          'Monitor usage analytics'
        ]
      };
    case 'Limited availability':
      return {
        recommendation: '🚨 Use with caution',
        description: 'This feature is not yet supported across all major evergreen browsers. Use progressive enhancement or provide fallbacks.',
        considerations: [
          'Incomplete browser support',
          'Requires progressive enhancement',
          'Consider polyfills or fallbacks',
          'Test thoroughly across browsers'
        ]
      };
    default:
      return {
        recommendation: '❓ Unknown status',
        description: 'The baseline status of this feature is unclear.',
        considerations: ['Research browser support', 'Test before implementing']
      };
  }
}

function generateDocumentationLinks(feature: BaselineFeature) {
  const links = [];
  
  // Extract feature name for search
  const featureName = feature.name.toLowerCase().replace(/\s+/g, '-');
  
  // MDN Web Docs link
  links.push({
    title: 'MDN Web Docs',
    url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(feature.name)}`,
    description: 'Comprehensive documentation and examples'
  });
  
  // Can I Use link
  links.push({
    title: 'Can I Use',
    url: `https://caniuse.com/?search=${encodeURIComponent(feature.name)}`,
    description: 'Browser compatibility tables'
  });
  
  // Web.dev link
  links.push({
    title: 'web.dev',
    url: `https://web.dev/search/?q=${encodeURIComponent(feature.name)}`,
    description: 'Articles and best practices'
  });
  
  // If it's a CSS feature, add CSS-specific resources
  if (feature.description?.includes('CSS feature:')) {
    links.push({
      title: 'CSS Reference',
      url: `https://cssreference.io/?search=${encodeURIComponent(feature.name)}`,
      description: 'Visual CSS property reference'
    });
  }
  
  return links;
}

export default function FeatureDetailModal({ feature, isOpen, onClose }: FeatureDetailModalProps) {
  if (!isOpen || !feature) return null;

  const guidance = getImplementationGuidance(feature.status);
  const documentationLinks = generateDocumentationLinks(feature);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {getStatusIcon(feature.status)}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{feature.name}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(feature.status)}`}>
                {feature.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {feature.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          )}

          {/* Implementation Guidance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Guidance</h3>
            <div className={`p-4 rounded-lg border ${getStatusColor(feature.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{guidance.recommendation}</span>
              </div>
              <p className="text-sm mb-3 opacity-90">{guidance.description}</p>
              <div className="space-y-1">
                <p className="text-sm font-medium opacity-90">Key considerations:</p>
                <ul className="text-sm space-y-1 opacity-80">
                  {guidance.considerations.map((consideration, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-current rounded-full"></span>
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Selector Information */}
          {feature.selector && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CSS Selector</h3>
              <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono text-gray-800">
                {feature.selector}
              </code>
            </div>
          )}

          {/* Documentation Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Learn More</h3>
            <div className="grid gap-3">
              {documentationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                >
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-indigo-900">
                      {link.title}
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-indigo-700">
                      {link.description}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                </a>
              ))}
            </div>
          </div>

          {/* Baseline Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About Web Platform Baseline</p>
                <p className="opacity-90">
                  Baseline represents web features that are interoperable across all major evergreen browsers. 
                  Features marked as &quot;Widely available&quot; have been supported for at least 2.5 years, while 
                  &quot;Newly available&quot; features have recently achieved cross-browser support.
                </p>
                <a 
                  href="https://web.dev/baseline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Learn more about Baseline
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}