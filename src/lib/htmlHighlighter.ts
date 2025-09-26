import * as cheerio from 'cheerio';
import * as csstree from 'css-tree';
import { getStatus } from 'compute-baseline';
import { BaselineFeature } from '@/types';

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

// Helper function to find matching baseline feature by name
function findMatchingFeature(baselineFeatures: BaselineFeature[], featureName: string): BaselineFeature | null {
  return baselineFeatures.find(feature => feature.name === featureName) || null;
}

// Helper function to highlight CSS within a string
function highlightCssFeatures(cssContent: string, baselineFeatures: BaselineFeature[]): Set<string> {
  const appliedClasses = new Set<string>();
  
  if (!cssContent.trim()) {
    return appliedClasses;
  }

  try {
    // Parse CSS into AST
    const ast = csstree.parse(cssContent, {
      onParseError: () => {
        // Ignore parse errors and continue with what we can parse
      }
    });

    // Walk through the AST to find declarations
    csstree.walk(ast, (node) => {
      if (node.type === 'Declaration') {
        const property = node.property;
        
        // Check property-level baseline status
        const propertyBcdKey = `css.properties.${property}`;
        try {
          const propertyStatus = getStatus(null, propertyBcdKey);
          if (propertyStatus) {
            const baselineFeature = convertComputeBaselineToFeature(propertyBcdKey, propertyStatus);
            if (baselineFeature) {
              const matchingFeature = findMatchingFeature(baselineFeatures, baselineFeature.name);
              if (matchingFeature && matchingFeature.highlightClass) {
                appliedClasses.add(matchingFeature.highlightClass);
              }
            }
          }
        } catch (error) {
          // BCD key doesn't exist, skip silently
        }

        // Check property-value pairs for specific values
        if (node.value && node.value.children) {
          csstree.walk(node.value, (valueNode) => {
            if (valueNode.type === 'Identifier') {
              const value = valueNode.name;
              const propertyValueBcdKey = `css.properties.${property}.${value}`;
              
              try {
                const valueStatus = getStatus(null, propertyValueBcdKey);
                if (valueStatus) {
                  const baselineFeature = convertComputeBaselineToFeature(propertyValueBcdKey, valueStatus);
                  if (baselineFeature) {
                    const matchingFeature = findMatchingFeature(baselineFeatures, baselineFeature.name);
                    if (matchingFeature && matchingFeature.highlightClass) {
                      appliedClasses.add(matchingFeature.highlightClass);
                    }
                  }
                }
              } catch (error) {
                // BCD key doesn't exist, skip silently
              }
            }
          });
        }
      }

      // Handle at-rules like @media, @keyframes, @container
      if (node.type === 'Atrule') {
        const atRuleName = node.name;
        const atRuleBcdKey = `css.at-rules.${atRuleName}`;
        
        try {
          const atRuleStatus = getStatus(null, atRuleBcdKey);
          if (atRuleStatus) {
            const baselineFeature = convertComputeBaselineToFeature(atRuleBcdKey, atRuleStatus);
            if (baselineFeature) {
              const matchingFeature = findMatchingFeature(baselineFeatures, baselineFeature.name);
              if (matchingFeature && matchingFeature.highlightClass) {
                appliedClasses.add(matchingFeature.highlightClass);
              }
            }
          }
        } catch (error) {
          // BCD key doesn't exist, skip silently
        }
      }

      // Handle pseudo-classes and pseudo-elements
      if (node.type === 'PseudoClassSelector' || node.type === 'PseudoElementSelector') {
        const pseudoName = node.name;
        const pseudoType = node.type === 'PseudoClassSelector' ? 'pseudo-classes' : 'pseudo-elements';
        const pseudoBcdKey = `css.selectors.${pseudoType}.${pseudoName}`;
        
        try {
          const pseudoStatus = getStatus(null, pseudoBcdKey);
          if (pseudoStatus) {
            const baselineFeature = convertComputeBaselineToFeature(pseudoBcdKey, pseudoStatus);
            if (baselineFeature) {
              const matchingFeature = findMatchingFeature(baselineFeatures, baselineFeature.name);
              if (matchingFeature && matchingFeature.highlightClass) {
                appliedClasses.add(matchingFeature.highlightClass);
              }
            }
          }
        } catch (error) {
          // BCD key doesn't exist, skip silently
        }
      }
    });

  } catch (error) {
    console.warn('CSS parsing failed in highlighter:', error);
  }

  return appliedClasses;
}

export function highlightHtmlFeatures(
  htmlContent: string, 
  baselineFeatures: BaselineFeature[]
): string {
  const $ = cheerio.load(htmlContent);
  
  // 1. Handle HTML element highlighting (existing logic)
  const selectorMap = new Map<string, BaselineFeature>();
  
  baselineFeatures.forEach(feature => {
    if (feature.selector && feature.highlightClass) {
      // Use the first feature found for each selector
      if (!selectorMap.has(feature.selector)) {
        selectorMap.set(feature.selector, feature);
      }
    }
  });
  
  // Apply highlighting to matching HTML elements
  selectorMap.forEach((feature, selector) => {
    try {
      $(selector).each((_, element) => {
        const $element = $(element);
        
        // Ensure highlightClass is defined before using it
        if (!feature.highlightClass) return;
        
        // Add the highlight class
        const existingClass = $element.attr('class') || '';
        const newClass = existingClass 
          ? `${existingClass} ${feature.highlightClass}`
          : feature.highlightClass;
        
        $element.attr('class', newClass);
        
        // Add a data attribute for identification
        $element.attr('data-baseline-feature', feature.name);
        $element.attr('data-baseline-status', feature.status);
      });
    } catch (error) {
      // Silently continue if selector is invalid
      console.warn(`Invalid selector: ${selector}`, error);
    }
  });

  // 2. Handle CSS within <style> tags
  $('style').each((_, element) => {
    const $element = $(element);
    const cssContent = $element.html() || '';
    
    if (cssContent.trim()) {
      const appliedClasses = highlightCssFeatures(cssContent, baselineFeatures);
      
      if (appliedClasses.size > 0) {
        const existingClass = $element.attr('class') || '';
        const newClasses = Array.from(appliedClasses).join(' ');
        const combinedClass = existingClass 
          ? `${existingClass} ${newClasses}`
          : newClasses;
        
        $element.attr('class', combinedClass);
        $element.attr('data-baseline-css-features', Array.from(appliedClasses).length.toString());
      }
    }
  });

  // 3. Handle inline CSS in style attributes
  $('[style]').each((_, element) => {
    const $element = $(element);
    const inlineStyle = $element.attr('style') || '';
    
    if (inlineStyle.trim()) {
      try {
        // Parse inline styles as declaration list
        const ast = csstree.parse(inlineStyle, {
          context: 'declarationList',
          onParseError: () => {
            // Ignore parse errors
          }
        });

        const appliedClasses = new Set<string>();

        csstree.walk(ast, (node) => {
          if (node.type === 'Declaration') {
            const property = node.property;
            
            // Check property-level baseline status
            const propertyBcdKey = `css.properties.${property}`;
            try {
              const propertyStatus = getStatus(null, propertyBcdKey);
              if (propertyStatus) {
                const baselineFeature = convertComputeBaselineToFeature(propertyBcdKey, propertyStatus);
                if (baselineFeature) {
                  const matchingFeature = findMatchingFeature(baselineFeatures, baselineFeature.name);
                  if (matchingFeature && matchingFeature.highlightClass) {
                    appliedClasses.add(matchingFeature.highlightClass);
                  }
                }
              }
            } catch (error) {
              // BCD key doesn't exist, skip silently
            }

            // Check property-value pairs
            if (node.value && node.value.children) {
              csstree.walk(node.value, (valueNode) => {
                if (valueNode.type === 'Identifier') {
                  const value = valueNode.name;
                  const propertyValueBcdKey = `css.properties.${property}.${value}`;
                  
                  try {
                    const valueStatus = getStatus(null, propertyValueBcdKey);
                    if (valueStatus) {
                      const baselineFeature = convertComputeBaselineToFeature(propertyValueBcdKey, valueStatus);
                      if (baselineFeature) {
                        const matchingFeature = findMatchingFeature(baselineFeatures, baselineFeature.name);
                        if (matchingFeature && matchingFeature.highlightClass) {
                          appliedClasses.add(matchingFeature.highlightClass);
                        }
                      }
                    }
                  } catch (error) {
                    // BCD key doesn't exist, skip silently
                  }
                }
              });
            }
          }
        });

        if (appliedClasses.size > 0) {
          const existingClass = $element.attr('class') || '';
          const newClasses = Array.from(appliedClasses).join(' ');
          const combinedClass = existingClass 
            ? `${existingClass} ${newClasses}`
            : newClasses;
          
          $element.attr('class', combinedClass);
          $element.attr('data-baseline-inline-features', Array.from(appliedClasses).length.toString());
        }

      } catch (error) {
        // Silently continue if inline CSS parsing fails
        console.warn('Inline CSS parsing failed:', error);
      }
    }
  });
  
  return $.html();
}