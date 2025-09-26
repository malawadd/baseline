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

function detectCssFeatures(css: string): BaselineFeature[] {
  const detectedFeatures: BaselineFeature[] = [];
  const seenBcdKeys = new Set<string>();

  if (!css.trim()) {
    return detectedFeatures;
  }

  try {
    // Parse CSS into AST
    const ast = csstree.parse(css, {
      onParseError: () => {
        // Ignore parse errors and continue with what we can parse
      }
    });

    // Walk through the AST to find declarations
    csstree.walk(ast, (node) => {
      if (node.type === 'Declaration') {
        const property = node.property;
        
        // Construct BCD key for the property
        const propertyBcdKey = `css.properties.${property}`;
        
        // Check property-level baseline status
        if (!seenBcdKeys.has(propertyBcdKey)) {
          try {
            const propertyStatus = getStatus(null, propertyBcdKey);
            if (propertyStatus) {
              const baselineFeature = convertComputeBaselineToFeature(propertyBcdKey, propertyStatus);
              if (baselineFeature) {
                detectedFeatures.push(baselineFeature);
                seenBcdKeys.add(propertyBcdKey);
              }
            }
          } catch (error) {
            // BCD key doesn't exist, skip silently
          }
        }

        // Check property-value pairs for specific values
        if (node.value && node.value.children) {
          csstree.walk(node.value, (valueNode) => {
            if (valueNode.type === 'Identifier') {
              const value = valueNode.name;
              const propertyValueBcdKey = `${propertyBcdKey}.${value}`;
              
              if (!seenBcdKeys.has(propertyValueBcdKey)) {
                try {
                  const valueStatus = getStatus(null, propertyValueBcdKey);
                  if (valueStatus) {
                    const baselineFeature = convertComputeBaselineToFeature(propertyValueBcdKey, propertyStatus);
                    if (baselineFeature) {
                      detectedFeatures.push(baselineFeature);
                      seenBcdKeys.add(propertyValueBcdKey);
                    }
                  }
                } catch (error) {
                  // BCD key doesn't exist, skip silently
                }
              }
            }
          });
        }
      }

      // Handle at-rules like @media, @keyframes, @container
      if (node.type === 'Atrule') {
        const atRuleName = node.name;
        const atRuleBcdKey = `css.at-rules.${atRuleName}`;
        
        if (!seenBcdKeys.has(atRuleBcdKey)) {
          try {
            const atRuleStatus = getStatus(null, atRuleBcdKey);
            if (atRuleStatus) {
              const baselineFeature = convertComputeBaselineToFeature(atRuleBcdKey, atRuleStatus);
              if (baselineFeature) {
                detectedFeatures.push(baselineFeature);
                seenBcdKeys.add(atRuleBcdKey);
              }
            }
          } catch (error) {
            // BCD key doesn't exist, skip silently
          }
        }
      }

      // Handle pseudo-classes and pseudo-elements
      if (node.type === 'PseudoClassSelector' || node.type === 'PseudoElementSelector') {
        const pseudoName = node.name;
        const pseudoType = node.type === 'PseudoClassSelector' ? 'pseudo-classes' : 'pseudo-elements';
        const pseudoBcdKey = `css.selectors.${pseudoType}.${pseudoName}`;
        
        if (!seenBcdKeys.has(pseudoBcdKey)) {
          try {
            const pseudoStatus = getStatus(null, pseudoBcdKey);
            if (pseudoStatus) {
              const baselineFeature = convertComputeBaselineToFeature(pseudoBcdKey, pseudoStatus);
              if (baselineFeature) {
                detectedFeatures.push(baselineFeature);
                seenBcdKeys.add(pseudoBcdKey);
              }
            }
          } catch (error) {
            // BCD key doesn't exist, skip silently
          }
        }
      }
    });

  } catch (error) {
    console.warn('CSS parsing failed:', error);
    // Return empty array if parsing completely fails
    return [];
  }

  return detectedFeatures;
}

// Helper function to convert compute-baseline output to our BaselineFeature format
function convertComputeBaselineToFeature(bcdKey: string, status: any): BaselineFeature | null {
  if (!status || !status.baseline) {
    return null;
  }

  let baselineStatus = 'Unknown';
  let highlightClass = '';
  
  if (status.baseline === 'high') {
    baselineStatus = 'Widely available';
    highlightClass = 'highlight-widely-available';
  } else if (status.baseline === 'low') {
    baselineStatus = 'Newly available';
    highlightClass = 'highlight-newly-available';
  } else if (status.baseline === false) {
    baselineStatus = 'Limited availability';
    highlightClass = 'highlight-limited-availability';
  }

  // Create a human-readable name from the BCD key
  const name = bcdKey.split('.').pop() || bcdKey;
  
  return {
    name: formatFeatureName(name),
    status: baselineStatus,
    description: `CSS feature: ${bcdKey}`,
    highlightClass,
  };
}

// Helper function to format feature names for better readability
function formatFeatureName(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase());
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
  
  // Combine HTML and CSS features, removing duplicates
  const allFeatures: BaselineFeature[] = [...htmlFeatures, ...cssFeatures];
  const seenFeatures = new Set<string>();
  const uniqueFeatures: BaselineFeature[] = [];

  allFeatures.forEach(feature => {
    if (!seenFeatures.has(feature.name)) {
      uniqueFeatures.push(feature);
      seenFeatures.add(feature.name);
    }
  });

  return uniqueFeatures.sort((a, b) => a.name.localeCompare(b.name));
}