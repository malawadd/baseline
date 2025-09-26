import { BaselineFeature, BaselineSummary } from '@/types';

export function computeBaselineSummary(features: BaselineFeature[]): BaselineSummary {
  const summary: BaselineSummary = {
    widelyAvailable: 0,
    newlyAvailable: 0,
    limitedAvailability: 0,
    total: features.length,
  };

  features.forEach(feature => {
    switch (feature.status) {
      case 'Widely available':
        summary.widelyAvailable++;
        break;
      case 'Newly available':
        summary.newlyAvailable++;
        break;
      case 'Limited availability':
        summary.limitedAvailability++;
        break;
    }
  });

  return summary;
}