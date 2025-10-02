import { useState } from 'react';
import { BaselineFeature } from '@/types';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, Info, Search, ListFilter as Filter, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface BaselineFeaturesDisplayProps {
  features: BaselineFeature[];
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Widely available':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'Newly available':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'Limited availability':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
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

function getFilterButtonStyle(status: string, selectedFilter: string) {
  const isSelected = selectedFilter === status;
  
  switch (status) {
    case 'Widely available':
      return isSelected 
        ? 'bg-green-100 text-green-800 border-green-300' 
        : 'bg-white text-green-700 border-green-200 hover:bg-green-50';
    case 'Newly available':
      return isSelected 
        ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
        : 'bg-white text-yellow-700 border-yellow-200 hover:bg-yellow-50';
    case 'Limited availability':
      return isSelected 
        ? 'bg-red-100 text-red-800 border-red-300' 
        : 'bg-white text-red-700 border-red-200 hover:bg-red-50';
    case 'all':
      return isSelected 
        ? 'bg-indigo-100 text-indigo-800 border-indigo-300' 
        : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50';
    default:
      return 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50';
  }
}

// Status explanations for tooltips
const STATUS_EXPLANATIONS = {
  'Widely available': {
    title: 'Widely Available',
    description: 'Supported in all major evergreen browsers for at least 2.5 years. Safe to use without polyfills or feature detection.',
    recommendation: '✅ Safe to implement'
  },
  'Newly available': {
    title: 'Newly Available', 
    description: 'Recently achieved Baseline status across all major evergreen browsers. Generally safe to use but consider your audience.',
    recommendation: '⚠️ Consider your users'
  },
  'Limited availability': {
    title: 'Limited Availability',
    description: 'Not yet supported across all major evergreen browsers. Use with caution and consider polyfills or progressive enhancement.',
    recommendation: '🚨 Use with caution'
  }
};

// Tooltip component for status explanations
function StatusTooltip({ status, children }: { status: string; children: React.ReactNode }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const explanation = STATUS_EXPLANATIONS[status as keyof typeof STATUS_EXPLANATIONS];
  
  if (!explanation) return <>{children}</>;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
          <div className="font-semibold mb-1">{explanation.title}</div>
          <div className="mb-2 opacity-90">{explanation.description}</div>
          <div className="font-medium text-yellow-300">{explanation.recommendation}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

export default function BaselineFeaturesDisplay({ features }: BaselineFeaturesDisplayProps) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (features.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Detected Baseline Features
          </h3>
          <div className="flex items-center gap-2">
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              <div className="absolute right-0 bottom-full mb-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="font-semibold mb-2">Understanding Feature Status</div>
                <div className="space-y-2">
                  <div><span className="text-green-400">●</span> <strong>Widely Available:</strong> Safe for production use</div>
                  <div><span className="text-yellow-400">●</span> <strong>Newly Available:</strong> Recently supported everywhere</div>
                  <div><span className="text-red-400">●</span> <strong>Limited:</strong> Incomplete browser support</div>
                </div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {!isCollapsed && (
          <p className="text-gray-600 mt-4">No recognized web platform features detected.</p>
        )}
      </div>
    );
  }

  // Calculate status counts for the original unfiltered list
  const statusCounts = features.reduce((acc, feature) => {
    acc[feature.status] = (acc[feature.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter features based on selected status and search term
  const filteredFeatures = features.filter(feature => {
    const matchesStatus = selectedStatusFilter === 'all' || feature.status === selectedStatusFilter;
    const matchesSearch = searchTerm === '' || 
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feature.description && feature.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Group filtered features by category for better organization
  const groupedFeatures = filteredFeatures.reduce((acc, feature) => {
    let category = 'Other';
    
    if (feature.description?.includes('CSS feature:')) {
      if (feature.description.includes('css.properties')) {
        category = 'CSS Properties';
      } else if (feature.description.includes('css.at-rules')) {
        category = 'CSS At-Rules';
      } else if (feature.description.includes('css.selectors')) {
        category = 'CSS Selectors';
      } else {
        category = 'CSS Features';
      }
    } else if (feature.selector) {
      category = 'HTML Elements';
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, BaselineFeature[]>);

  const filterOptions = [
    { key: 'all', label: 'All Features', count: features.length },
    { key: 'Widely available', label: 'Widely Available', count: statusCounts['Widely available'] || 0 },
    { key: 'Newly available', label: 'Newly Available', count: statusCounts['Newly available'] || 0 },
    { key: 'Limited availability', label: 'Limited Availability', count: statusCounts['Limited availability'] || 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header with Collapse Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-gray-800">
            Detected Baseline Features ({features.length})
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex gap-4 text-sm">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-1">
                  {getStatusIcon(status)}
                  <span className="text-gray-600">{count}</span>
                </div>
              ))}
            </div>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
              <div className="absolute right-0 bottom-full mb-2 w-80 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="font-semibold mb-3">Baseline Feature Categories</div>
                <div className="space-y-2">
                  <div><span className="text-green-400">●</span> <strong>Widely Available:</strong> Supported everywhere for 2.5+ years. Safe to use without fallbacks.</div>
                  <div><span className="text-yellow-400">●</span> <strong>Newly Available:</strong> Recently achieved cross-browser support. Generally safe but consider your audience.</div>
                  <div><span className="text-red-400">●</span> <strong>Limited Availability:</strong> Incomplete browser support. Use progressive enhancement or polyfills.</div>
                </div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <>
          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 mr-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              </div>
              {filterOptions.map(({ key, label, count }) => (
                <StatusTooltip key={key} status={key}>
                  <button
                  onClick={() => setSelectedStatusFilter(key)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${getFilterButtonStyle(key, selectedStatusFilter)}`}
                >
                  {label} ({count})
                  </button>
                </StatusTooltip>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredFeatures.length} of {features.length} features
            {searchTerm && (
              <span> matching &ldquo;{searchTerm}&rdquo;</span>
            )}
            {selectedStatusFilter !== 'all' && (
              <span> with status &ldquo;{selectedStatusFilter}&rdquo;</span>
            )}
          </div>

          {/* Features Display */}
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No features match your current filters.</p>
              <button
                onClick={() => {
                  setSelectedStatusFilter('all');
                  setSearchTerm('');
                }}
                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    {category}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {categoryFeatures.length}
                    </span>
                  </h4>
                  <div className="grid gap-2">
                    {categoryFeatures.map((feature, index) => (
                      <div
                        key={`${category}-${index}`}
                        className={`p-3 rounded-lg border ${getStatusColor(feature.status)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getStatusIcon(feature.status)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{feature.name}</h5>
                              <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                                {feature.status}
                              </span>
                            </div>
                            {feature.description && (
                              <p className="text-xs opacity-90 line-clamp-2 leading-relaxed">
                                {feature.description.replace(/<[^>]*>/g, '')}
                              </p>
                            )}
                           {STATUS_EXPLANATIONS[feature.status as keyof typeof STATUS_EXPLANATIONS] && (
                             <div className="mt-2 text-xs opacity-75">
                               {STATUS_EXPLANATIONS[feature.status as keyof typeof STATUS_EXPLANATIONS].recommendation}
                             </div>
                           )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}