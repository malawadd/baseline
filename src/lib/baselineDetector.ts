import { features } from 'web-features';
import * as cheerio from 'cheerio';
import { BaselineFeature } from '@/types';

// HTML elements to detect
const HTML_FEATURES = [
  { selector: 'dialog', name: 'dialog-element' },
  { selector: 'details', name: 'details-element' },
  { selector: 'summary', name: 'details-element' },
  { selector: 'picture', name: 'picture-element' },
  { selector: 'source', name: 'picture-element' },
  { selector: 'video', name: 'video' },
  { selector: 'audio', name: 'audio' },
  { selector: 'canvas', name: 'canvas' },
  { selector: 'svg', name: 'svg' },
  { selector: 'input[type="date"]', name: 'input-date' },
  { selector: 'input[type="color"]', name: 'input-color' },
  { selector: 'input[type="range"]', name: 'input-range' },
];

// CSS properties to detect
const CSS_FEATURES = [
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

function detectHtmlFeatures(html: string): Set<string> {
  const $ = cheerio.load(html);
  const detectedFeatures = new Set<string>();

  HTML_FEATURES.forEach(({ selector, name }) => {
    if ($(selector).length > 0) {
      detectedFeatures.add(name);
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

function getBaselineStatus(featureName: string): BaselineFeature | null {
  const feature = features[featureName];
  if (!feature) return null;

  let status = 'Unknown';
  if (feature.status?.baseline === 'high') {
    status = 'Widely available';
  } else if (feature.status?.baseline === 'low') {
    status = 'Newly available';
  } else if (feature.status?.baseline === false) {
    status = 'Limited availability';
  }

  return {
    name: feature.name || featureName,
    status,
    description: feature.description_html || feature.description,
  };
}

export function detectBaselineFeatures(html: string, css: string): BaselineFeature[] {
  const htmlFeatures = detectHtmlFeatures(html);
  const cssFeatures = detectCssFeatures(css);
  
  const allDetectedFeatures = new Set([...htmlFeatures, ...cssFeatures]);
  const baselineFeatures: BaselineFeature[] = [];

  allDetectedFeatures.forEach(featureName => {
    const baselineInfo = getBaselineStatus(featureName);
    if (baselineInfo) {
      baselineFeatures.push(baselineInfo);
    }
  });

  return baselineFeatures.sort((a, b) => a.name.localeCompare(b.name));
}