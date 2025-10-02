export interface ScanResult {
  htmlLength: number;
  cssLength: number;
  stylesheets: number;
  inlineBlocks: number;
  snippet: string;
  cssSnippet: string;
  baselineFeatures: BaselineFeature[];
  highlightedHtmlContent: string;
  baselineSummary: BaselineSummary;
  htmlContent?: string;
  cssContent?: string;
}

export interface BaselineFeature {
  name: string;
  status: string;
  description?: string;
  selector?: string;
  highlightClass?: string;
}

export interface BaselineSummary {
  widelyAvailable: number;
  newlyAvailable: number;
  limitedAvailability: number;
  total: number;
}