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
      return <CheckCircle className="w-8 h-8 text-[#001858]" />;
    case 'Newly available':
      return <AlertCircle className="w-8 h-8 text-[#001858]" />;
    case 'Limited availability':
      return <XCircle className="w-8 h-8 text-[#001858]" />;
    default:
      return <Info className="w-8 h-8 text-[#001858]" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Widely available':
      return 'bg-[#d4f4dd] text-[#001858] border-[#00e0b0]';
    case 'Newly available':
      return 'bg-[#fff9db] text-[#001858] border-[#ffd803]';
    case 'Limited availability':
      return 'bg-[#ffe5eb] text-[#001858] border-[#ff5470]';
    default:
      return 'bg-white text-[#001858] border-[#001858]';
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
    <div className="fixed inset-0 bg-[#001858] bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#fef6e4] border-4 border-[#001858] shadow-[12px_12px_0px_#001858] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-[#001858] bg-white">
          <div className="flex items-center gap-4">
            {getStatusIcon(feature.status)}
            <div>
              <h2 className="text-2xl font-black text-[#001858] uppercase mb-2">{feature.name}</h2>
              <span className={`inline-block px-4 py-2 text-sm font-black uppercase border-4 shadow-[3px_3px_0px_#001858] ${getStatusColor(feature.status)}`}>
                {feature.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-brutalism-button p-3 bg-[#ff5470] text-white hover:bg-[#ff5470]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {feature.description && (
            <div>
              <h3 className="text-lg font-black text-[#001858] mb-3 uppercase">Description</h3>
              <p className="text-[#001858] leading-relaxed font-bold">
                {feature.description.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          )}

          {/* Implementation Guidance */}
          <div>
            <h3 className="text-lg font-black text-[#001858] mb-3 uppercase">Implementation Guidance</h3>
            <div className={`p-5 border-4 shadow-[4px_4px_0px_#001858] ${getStatusColor(feature.status)}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-black text-lg">{guidance.recommendation}</span>
              </div>
              <p className="text-sm mb-4 font-bold">{guidance.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-black uppercase">Key considerations:</p>
                <ul className="text-sm space-y-2 font-bold">
                  {guidance.considerations.map((consideration, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-[#001858] mt-1.5 flex-shrink-0"></span>
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
              <h3 className="text-lg font-black text-[#001858] mb-3 uppercase">CSS Selector</h3>
              <code className="block bg-white border-4 border-[#001858] shadow-[4px_4px_0px_#001858] p-4 text-sm font-mono font-black text-[#001858]">
                {feature.selector}
              </code>
            </div>
          )}

          {/* Documentation Links */}
          <div>
            <h3 className="text-lg font-black text-[#001858] mb-3 uppercase">Learn More</h3>
            <div className="grid gap-3">
              {documentationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border-4 border-[#001858] bg-white shadow-[4px_4px_0px_#001858] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#001858] transition-all group"
                >
                  <div>
                    <div className="font-black text-[#001858] uppercase mb-1">
                      {link.title}
                    </div>
                    <div className="text-sm text-[#001858] font-bold">
                      {link.description}
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-[#001858]" />
                </a>
              ))}
            </div>
          </div>

          {/* Baseline Information */}
          <div className="bg-[#8bd3dd] border-4 border-[#001858] shadow-[4px_4px_0px_#001858] p-5">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-[#001858] mt-0.5 flex-shrink-0" />
              <div className="text-sm text-[#001858]">
                <p className="font-black mb-2 uppercase">About Web Platform Baseline</p>
                <p className="font-bold mb-3">
                  Baseline represents web features that are interoperable across all major evergreen browsers. 
                  Features marked as &quot;Widely available&quot; have been supported for at least 2.5 years, while 
                  &quot;Newly available&quot; features have recently achieved cross-browser support.
                </p>
                <a 
                  href="https://web.dev/baseline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#001858] font-black underline hover:translate-x-1 transition-transform uppercase text-xs"
                >
                  Learn more about Baseline →
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t-4 border-[#001858] bg-white">
          <button
            onClick={onClose}
            className="neo-brutalism-button px-8 py-4 bg-[#ffd803] text-[#001858] text-lg"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}