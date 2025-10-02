import { useState } from 'react';
import { BaselineFeature } from '@/types';
import FeatureDetailModal from './FeatureDetailModal';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, Info, Search, ListFilter as Filter, ChevronDown, ChevronUp, Circle as HelpCircle } from 'lucide-react';

interface BaselineFeaturesDisplayProps {
  features: BaselineFeature[];
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Widely available':
      return <CheckCircle className="w-6 h-6 text-[#001858]" />;
    case 'Newly available':
      return <AlertCircle className="w-6 h-6 text-[#001858]" />;
    case 'Limited availability':
      return <XCircle className="w-6 h-6 text-[#001858]" />;
    default:
      return <Info className="w-6 h-6 text-[#001858]" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Widely available':
      return 'bg-[#d4f4dd] border-[#00e0b0]';
    case 'Newly available':
      return 'bg-[#fff9db] border-[#ffd803]';
    case 'Limited availability':
      return 'bg-[#ffe5eb] border-[#ff5470]';
    default:
      return 'bg-white border-[#001858]';
  }
}

function getFilterButtonStyle(status: string, selectedFilter: string) {
  const isSelected = selectedFilter === status;
  
  if (isSelected) {
    return 'bg-[#001858] text-white';
  }
  
  switch (status) {
    case 'Widely available':
      return 'bg-[#d4f4dd] text-[#001858]';
    case 'Newly available':
      return 'bg-[#fff9db] text-[#001858]';
    case 'Limited availability':
      return 'bg-[#ffe5eb] text-[#001858]';
    case 'all':
      return 'bg-white text-[#001858]';
    default:
      return 'bg-white text-[#001858]';
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

// Tooltip component for status explanations - Neobrutalism style
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
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-4 bg-[#001858] text-white text-xs border-4 border-[#001858] shadow-[4px_4px_0px_rgba(0,24,88,0.3)]">
          <div className="font-black mb-2 uppercase">{explanation.title}</div>
          <div className="mb-2 font-bold">{explanation.description}</div>
          <div className="font-black text-[#ffd803]">{explanation.recommendation}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#001858]"></div>
        </div>
      )}
    </div>
  );
}

export default function BaselineFeaturesDisplay({ features }: BaselineFeaturesDisplayProps) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<BaselineFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFeatureClick = (feature: BaselineFeature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeature(null);
  };

  if (features.length === 0) {
    return (
      <div className="bg-[#f3d2c1] border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-[#001858] uppercase">
            Detected Baseline Features
          </h3>
          <div className="flex items-center gap-4">
            <div className="group relative">
              <HelpCircle className="w-6 h-6 text-[#001858] cursor-help hover:scale-110 transition-transform" />
              <div className="absolute right-0 bottom-full mb-2 w-72 p-4 bg-[#001858] text-white text-xs border-4 border-[#001858] shadow-[4px_4px_0px_rgba(0,24,88,0.3)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="font-black mb-3 uppercase">Understanding Feature Status</div>
                <div className="space-y-2 font-bold">
                  <div><span className="text-[#00e0b0]">●</span> <strong>Widely Available:</strong> Safe for production use</div>
                  <div><span className="text-[#ffd803]">●</span> <strong>Newly Available:</strong> Recently supported everywhere</div>
                  <div><span className="text-[#ff5470]">●</span> <strong>Limited:</strong> Incomplete browser support</div>
                </div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#001858]"></div>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="neo-brutalism-button px-4 py-2 bg-[#8bd3dd] text-[#001858] text-sm"
            >
              {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {!isCollapsed && (
          <p className="text-[#001858] font-bold mt-4">No recognized web platform features detected.</p>
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
    <div className="bg-white border-4 border-[#001858] shadow-[8px_8px_0px_#001858] p-8">
      {/* Header with Collapse Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Info className="w-8 h-8 text-[#001858]" />
            <h3 className="text-2xl font-black text-[#001858] uppercase">
              Detected Features
            </h3>
            <div className="bg-[#ffd803] border-3 border-[#001858] px-4 py-2 shadow-[3px_3px_0px_#001858]">
              <span className="text-[#001858] font-black">{features.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-sm">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2 bg-[#fef6e4] border-2 border-[#001858] px-3 py-1 shadow-[2px_2px_0px_#001858]">
                  {getStatusIcon(status)}
                  <span className="text-[#001858] font-black">{count}</span>
                </div>
              ))}
            </div>
            <div className="group relative">
              <HelpCircle className="w-6 h-6 text-[#001858] cursor-help hover:scale-110 transition-transform" />
              <div className="absolute right-0 bottom-full mb-2 w-80 p-4 bg-[#001858] text-white text-xs border-4 border-[#001858] shadow-[4px_4px_0px_rgba(0,24,88,0.3)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="font-black mb-3 uppercase">Baseline Feature Categories</div>
                <div className="space-y-2 font-bold">
                  <div><span className="text-[#00e0b0]">●</span> <strong>Widely Available:</strong> Supported everywhere for 2.5+ years. Safe to use without fallbacks.</div>
                  <div><span className="text-[#ffd803]">●</span> <strong>Newly Available:</strong> Recently achieved cross-browser support. Generally safe but consider your audience.</div>
                  <div><span className="text-[#ff5470]">●</span> <strong>Limited Availability:</strong> Incomplete browser support. Use progressive enhancement or polyfills.</div>
                </div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#001858]"></div>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="neo-brutalism-button px-4 py-2 bg-[#8bd3dd] text-[#001858] text-sm"
            >
              {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
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
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#001858]" />
              <input
                type="text"
                placeholder="SEARCH FEATURES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neo-brutalism-input w-full pl-12 pr-4 py-4 bg-[#fef6e4] text-[#001858] font-bold placeholder:text-[#001858] placeholder:opacity-50 uppercase"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#001858]" />
                <span className="text-sm font-black text-[#001858] uppercase">Filter:</span>
              </div>
              {filterOptions.map(({ key, label, count }) => (
                <StatusTooltip key={key} status={key}>
                  <button
                    onClick={() => setSelectedStatusFilter(key)}
                    className={`neo-brutalism-button px-4 py-2 text-sm font-black uppercase transition-all ${getFilterButtonStyle(key, selectedStatusFilter)}`}
                  >
                    {label} ({count})
                  </button>
                </StatusTooltip>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 p-3 bg-[#f3d2c1] border-3 border-[#001858] shadow-[3px_3px_0px_#001858]">
            <p className="text-sm text-[#001858] font-black uppercase">
              Showing {filteredFeatures.length} of {features.length} features
              {searchTerm && (
                <span> matching &quot;{searchTerm}&quot;</span>
              )}
              {selectedStatusFilter !== 'all' && (
                <span> with status &quot;{selectedStatusFilter}&quot;</span>
              )}
            </p>
          </div>

          {/* Features Display */}
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-12 bg-[#f3d2c1] border-4 border-[#001858] shadow-[4px_4px_0px_#001858]">
              <Info className="w-12 h-12 mx-auto mb-4 text-[#001858]" />
              <p className="text-[#001858] font-black text-lg uppercase mb-4">No features match your filters</p>
              <button
                onClick={() => {
                  setSelectedStatusFilter('all');
                  setSearchTerm('');
                }}
                className="neo-brutalism-button px-6 py-3 bg-[#ffd803] text-[#001858] text-sm"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-lg font-black text-[#001858] uppercase">{category}</h4>
                    <span className="bg-[#8bd3dd] text-[#001858] font-black text-xs px-3 py-1 border-2 border-[#001858] shadow-[2px_2px_0px_#001858]">
                      {categoryFeatures.length}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {categoryFeatures.map((feature, index) => (
                      <div
                        key={`${category}-${index}`}
                        className={`p-4 border-4 shadow-[4px_4px_0px_#001858] cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#001858] transition-all ${getStatusColor(feature.status)}`}
                        onClick={() => handleFeatureClick(feature)}
                      >
                        <div className="flex items-start gap-4">
                          {getStatusIcon(feature.status)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-black text-[#001858] uppercase text-base">{feature.name}</h5>
                              <span className="text-xs px-3 py-1 bg-white border-2 border-[#001858] shadow-[2px_2px_0px_#001858] font-black uppercase">
                                {feature.status}
                              </span>
                            </div>
                            {feature.description && (
                              <p className="text-sm text-[#001858] font-bold line-clamp-2 leading-relaxed mb-2">
                                {feature.description.replace(/<[^>]*>/g, '')}
                              </p>
                            )}
                            {STATUS_EXPLANATIONS[feature.status as keyof typeof STATUS_EXPLANATIONS] && (
                              <div className="text-xs text-[#001858] font-black">
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

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}