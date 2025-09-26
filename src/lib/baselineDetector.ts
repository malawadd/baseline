import { features } from 'web-features';
import * as cheerio from 'cheerio';
import { BaselineFeature } from '@/types';

// Type guard to check if feature is FeatureData (has status property)
function isFeatureData(feature: any): feature is { status?: { baseline?: string | boolean }; name?: string; description_html?: string; description?: string } {
  return feature && typeof feature === 'object' && 'status' in feature;
}

// HTML elements to detect
const HTML_FEATURES = [
  { selector: 'dialog', name: 'dialog-element', featureKey: 'dialog-element' },
  { selector: 'details', name: 'details-element', featureKey: 'details-element' },
  { selector: 'summary', name: 'details-element', featureKey: 'details-element' },
  { selector: 'picture', name: 'picture-element', featureKey: 'picture-element' },
  { selector: 'source', name: 'picture-element', featureKey: 'picture-element' },
  { selector: 'video', name: 'video', featureKey: 'video' },
  { selector: 'audio', name: 'audio', featureKey: 'audio' },
  { selector: 'canvas', name: 'canvas', featureKey: 'canvas' },
  { selector: 'svg', name: 'svg', featureKey: 'svg' },
  { selector: 'input[type="date"]', name: 'input-date', featureKey: 'input-date' },
  { selector: 'input[type="color"]', name: 'input-color', featureKey: 'input-color' },
  { selector: 'input[type="range"]', name: 'input-range', featureKey: 'input-range' },
];

// CSS properties to detect
const CSS_FEATURES: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /display:\s*grid/i, name: 'css-grid' },
  { pattern: /display:\s*flex/i, name: 'flexbox' },
  { pattern: /gap:/i, name: 'css-gap' },
  { pattern: /grid-template/i, name: 'css-grid' },
  { pattern: /transform:/i, name: 'css-transforms' },
  { pattern: /transition:/i, name: 'css-transitions' },
  { pattern: /animation:/i, name: 'css-animations' },
  { pattern: /@media.*prefers-color-scheme/i, name: 'prefers-color-scheme' },
  { pattern: /position:\s*sticky/i, name: 'css-sticky' },
  { pattern: /backdrop-filter:/i, name: 'css-backdrop-filter' },
  { pattern: /scroll-snap/i, name: 'css-scroll-snap' },
];

function detectHtmlFeatures(html: string): BaselineFeature[] {
  const $ = cheerio.load(html);
  const detectedFeatures: BaselineFeature[] = [];

  HTML_FEATURES.forEach(({ selector, name, featureKey }) => {
    if ($(selector).length > 0) {
      const baselineInfo = getBaselineStatus(featureKey);
      if (baselineInfo) {
        detectedFeatures.push({
          ...baselineInfo,
          selector,
        });
      }
    }
  });

  return detectedFeatures;
}

function detectCssFeatures(css: string): Set<string> {
  const detectedFeatures = new Set<string>();

  CSS_FEATURES.forEach(({ pattern, name }) => {
    if (pattern.test(css)) {
      detectedFeatures.add(name);
    }
  });

  return detectedFeatures;
}

function getBaselineStatus(featureName: string): Omit<BaselineFeature, 'selector'> | null {
  const feature = features[featureName];
  if (!feature || !isFeatureData(feature)) return null;

  let status = 'Unknown';
  let highlightClass = '';
  
  if (feature.status?.baseline === 'high') {
    status = 'Widely available';
    highlightClass = 'highlight-widely-available';
  } else if (feature.status?.baseline === 'low') {
    status = 'Newly available';
    highlightClass = 'highlight-newly-available';
  } else if (feature.status?.baseline === false) {
    status = 'Limited availability';
    highlightClass = 'highlight-limited-availability';
  }

  return {
    name: feature.name || featureName,
    status,
    description: feature.description_html || feature.description,
    highlightClass,
  };
}

export function detectBaselineFeatures(html: string, css: string): BaselineFeature[] {
  const htmlFeatures = detectHtmlFeatures(html);
  const cssFeatures = detectCssFeatures(css);
  
  // Combine HTML features (with selectors) and CSS features (without selectors)
  const cssBaselineFeatures: BaselineFeature[] = [];
  cssFeatures.forEach(featureName => {
    const baselineInfo = getBaselineStatus(featureName);
    if (baselineInfo) {
      cssBaselineFeatures.push(baselineInfo);
    }
  });
  
  const baselineFeatures: BaselineFeature[] = [];
  const seenFeatures = new Set<string>();

  // Add HTML features
  htmlFeatures.forEach(feature => {
    if (!seenFeatures.has(feature.name)) {
      baselineFeatures.push(feature);
      seenFeatures.add(feature.name);
    }
  });

  // Add CSS features
  cssBaselineFeatures.forEach(feature => {
    if (!seenFeatures.has(feature.name)) {
      baselineFeatures.push(feature);
      seenFeatures.add(feature.name);
    }
  });

  return baselineFeatures.sort((a, b) => a.name.localeCompare(b.name));
}