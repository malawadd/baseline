import * as cheerio from 'cheerio';
import { BaselineFeature } from '@/types';

export function highlightHtmlFeatures(
  htmlContent: string, 
  baselineFeatures: BaselineFeature[]
): string {
  const $ = cheerio.load(htmlContent);
  
  // Group features by selector to avoid duplicate processing
  const selectorMap = new Map<string, BaselineFeature>();
  
  baselineFeatures.forEach(feature => {
    if (feature.selector && feature.highlightClass) {
      // Use the first feature found for each selector
      if (!selectorMap.has(feature.selector)) {
        selectorMap.set(feature.selector, feature);
      }
    }
  });
  
  // Apply highlighting to matching elements
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
  
  return $.html();
}