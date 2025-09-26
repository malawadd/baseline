import { BaselineFeature } from '@/types';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

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

export default function BaselineFeaturesDisplay({ features }: BaselineFeaturesDisplayProps) {
  if (features.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Web Platform Baseline Features
        </h3>
        <p className="text-gray-600">No recognized web platform features detected.</p>
      </div>
    );
  }

  const statusCounts = features.reduce((acc, feature) => {
    acc[feature.status] = (acc[feature.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Web Platform Baseline Features ({features.length})
        </h3>
        <div className="flex gap-4 text-sm">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1">
              {getStatusIcon(status)}
              <span className="text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getStatusColor(feature.status)}`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(feature.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{feature.name}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                    {feature.status}
                  </span>
                </div>
                {feature.description && (
                  <p className="text-xs opacity-80 line-clamp-2">
                    {feature.description.replace(/<[^>]*>/g, '')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}