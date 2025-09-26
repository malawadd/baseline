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
  // HTML5 Semantic Elements
  { selector: 'main', name: 'main-element', featureKey: 'main-element' },
  { selector: 'header', name: 'header-element', featureKey: 'header-element' },
  { selector: 'footer', name: 'footer-element', featureKey: 'footer-element' },
  { selector: 'nav', name: 'nav-element', featureKey: 'nav-element' },
  { selector: 'section', name: 'section-element', featureKey: 'section-element' },
  { selector: 'article', name: 'article-element', featureKey: 'article-element' },
  { selector: 'aside', name: 'aside-element', featureKey: 'aside-element' },
  { selector: 'figure', name: 'figure-element', featureKey: 'figure-element' },
  { selector: 'figcaption', name: 'figcaption-element', featureKey: 'figcaption-element' },
  { selector: 'time', name: 'time-element', featureKey: 'time-element' },
  { selector: 'mark', name: 'mark-element', featureKey: 'mark-element' },
  // Form Elements
  { selector: 'input[type="email"]', name: 'input-email', featureKey: 'input-email' },
  { selector: 'input[type="url"]', name: 'input-url', featureKey: 'input-url' },
  { selector: 'input[type="tel"]', name: 'input-tel', featureKey: 'input-tel' },
  { selector: 'input[type="search"]', name: 'input-search', featureKey: 'input-search' },
  { selector: 'input[type="number"]', name: 'input-number', featureKey: 'input-number' },
  { selector: 'input[type="datetime-local"]', name: 'input-datetime-local', featureKey: 'input-datetime-local' },
  { selector: 'input[type="month"]', name: 'input-month', featureKey: 'input-month' },
  { selector: 'input[type="week"]', name: 'input-week', featureKey: 'input-week' },
  { selector: 'input[type="time"]', name: 'input-time', featureKey: 'input-time' },
  { selector: 'datalist', name: 'datalist-element', featureKey: 'datalist-element' },
  { selector: 'output', name: 'output-element', featureKey: 'output-element' },
  { selector: 'progress', name: 'progress-element', featureKey: 'progress-element' },
  { selector: 'meter', name: 'meter-element', featureKey: 'meter-element' },
  // Interactive Elements
  { selector: 'template', name: 'template-element', featureKey: 'template-element' },
  { selector: 'slot', name: 'slot-element', featureKey: 'slot-element' },
  // Media Elements
  { selector: 'track', name: 'track-element', featureKey: 'track-element' },
  // Attributes
  { selector: '[contenteditable]', name: 'contenteditable', featureKey: 'contenteditable' },
  { selector: '[draggable]', name: 'drag-and-drop', featureKey: 'drag-and-drop' },
  { selector: '[hidden]', name: 'hidden-attribute', featureKey: 'hidden-attribute' },
  { selector: '[role]', name: 'aria-roles', featureKey: 'aria-roles' },
  { selector: '[aria-label]', name: 'aria-label', featureKey: 'aria-label' },
  { selector: '[aria-describedby]', name: 'aria-describedby', featureKey: 'aria-describedby' },
  { selector: '[loading="lazy"]', name: 'lazy-loading', featureKey: 'lazy-loading' },
  { selector: '[decoding="async"]', name: 'async-decoding', featureKey: 'async-decoding' },
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
  // Layout & Positioning
  { pattern: /display:\s*inline-flex/i, name: 'flexbox' },
  { pattern: /display:\s*inline-grid/i, name: 'css-grid' },
  { pattern: /position:\s*fixed/i, name: 'css-position-fixed' },
  { pattern: /position:\s*absolute/i, name: 'css-position-absolute' },
  { pattern: /position:\s*relative/i, name: 'css-position-relative' },
  { pattern: /z-index:/i, name: 'css-z-index' },
  { pattern: /flex-direction:/i, name: 'flexbox' },
  { pattern: /flex-wrap:/i, name: 'flexbox' },
  { pattern: /justify-content:/i, name: 'flexbox' },
  { pattern: /align-items:/i, name: 'flexbox' },
  { pattern: /align-self:/i, name: 'flexbox' },
  { pattern: /grid-area:/i, name: 'css-grid' },
  { pattern: /grid-column:/i, name: 'css-grid' },
  { pattern: /grid-row:/i, name: 'css-grid' },
  { pattern: /place-items:/i, name: 'css-grid' },
  { pattern: /place-content:/i, name: 'css-grid' },
  // Modern CSS Properties
  { pattern: /border-radius:/i, name: 'css-border-radius' },
  { pattern: /box-shadow:/i, name: 'css-box-shadow' },
  { pattern: /text-shadow:/i, name: 'css-text-shadow' },
  { pattern: /linear-gradient/i, name: 'css-gradients' },
  { pattern: /radial-gradient/i, name: 'css-gradients' },
  { pattern: /conic-gradient/i, name: 'css-gradients' },
  { pattern: /rgba\(/i, name: 'css-rgba' },
  { pattern: /hsla\(/i, name: 'css-hsla' },
  { pattern: /var\(/i, name: 'css-custom-properties' },
  { pattern: /calc\(/i, name: 'css-calc' },
  { pattern: /clamp\(/i, name: 'css-clamp' },
  { pattern: /min\(/i, name: 'css-min-max' },
  { pattern: /max\(/i, name: 'css-min-max' },
  // Typography
  { pattern: /@font-face/i, name: 'css-font-face' },
  { pattern: /font-display:/i, name: 'css-font-display' },
  { pattern: /font-variation-settings:/i, name: 'css-variable-fonts' },
  { pattern: /text-decoration-color:/i, name: 'css-text-decoration-color' },
  { pattern: /text-decoration-style:/i, name: 'css-text-decoration-style' },
  { pattern: /text-decoration-thickness:/i, name: 'css-text-decoration-thickness' },
  { pattern: /text-underline-offset:/i, name: 'css-text-underline-offset' },
  { pattern: /line-height-step:/i, name: 'css-line-height-step' },
  // Responsive & Media Queries
  { pattern: /@media.*min-width/i, name: 'css-media-queries' },
  { pattern: /@media.*max-width/i, name: 'css-media-queries' },
  { pattern: /@media.*orientation/i, name: 'css-media-queries' },
  { pattern: /@media.*prefers-reduced-motion/i, name: 'prefers-reduced-motion' },
  { pattern: /@media.*prefers-contrast/i, name: 'prefers-contrast' },
  { pattern: /vw|vh|vmin|vmax/i, name: 'css-viewport-units' },
  { pattern: /rem|em/i, name: 'css-relative-units' },
  // Animations & Transitions
  { pattern: /@keyframes/i, name: 'css-animations' },
  { pattern: /animation-name:/i, name: 'css-animations' },
  { pattern: /animation-duration:/i, name: 'css-animations' },
  { pattern: /animation-timing-function:/i, name: 'css-animations' },
  { pattern: /transition-property:/i, name: 'css-transitions' },
  { pattern: /transition-duration:/i, name: 'css-transitions' },
  { pattern: /transition-timing-function:/i, name: 'css-transitions' },
  { pattern: /ease-in-out|ease-in|ease-out/i, name: 'css-easing-functions' },
  { pattern: /cubic-bezier/i, name: 'css-cubic-bezier' },
  // Visual Effects
  { pattern: /filter:/i, name: 'css-filters' },
  { pattern: /blur\(/i, name: 'css-filters' },
  { pattern: /brightness\(/i, name: 'css-filters' },
  { pattern: /contrast\(/i, name: 'css-filters' },
  { pattern: /saturate\(/i, name: 'css-filters' },
  { pattern: /opacity:/i, name: 'css-opacity' },
  { pattern: /mix-blend-mode:/i, name: 'css-blend-modes' },
  { pattern: /background-blend-mode:/i, name: 'css-blend-modes' },
  { pattern: /clip-path:/i, name: 'css-clip-path' },
  { pattern: /mask:/i, name: 'css-masks' },
  // Container Queries & Modern Layout
  { pattern: /@container/i, name: 'css-container-queries' },
  { pattern: /container-type:/i, name: 'css-container-queries' },
  { pattern: /container-name:/i, name: 'css-container-queries' },
  { pattern: /aspect-ratio:/i, name: 'css-aspect-ratio' },
  { pattern: /object-fit:/i, name: 'css-object-fit' },
  { pattern: /object-position:/i, name: 'css-object-position' },
  // Scroll & Interaction
  { pattern: /scroll-behavior:/i, name: 'css-scroll-behavior' },
  { pattern: /scroll-margin/i, name: 'css-scroll-margin' },
  { pattern: /scroll-padding/i, name: 'css-scroll-padding' },
  { pattern: /overscroll-behavior:/i, name: 'css-overscroll-behavior' },
  { pattern: /touch-action:/i, name: 'css-touch-action' },
  { pattern: /user-select:/i, name: 'css-user-select' },
  { pattern: /pointer-events:/i, name: 'css-pointer-events' },
  // CSS Logical Properties
  { pattern: /margin-inline/i, name: 'css-logical-properties' },
  { pattern: /margin-block/i, name: 'css-logical-properties' },
  { pattern: /padding-inline/i, name: 'css-logical-properties' },
  { pattern: /padding-block/i, name: 'css-logical-properties' },
  { pattern: /border-inline/i, name: 'css-logical-properties' },
  { pattern: /border-block/i, name: 'css-logical-properties' },
  { pattern: /inset-inline/i, name: 'css-logical-properties' },
  { pattern: /inset-block/i, name: 'css-logical-properties' },
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