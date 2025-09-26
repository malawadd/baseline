export interface ScanResult {
  htmlLength: number;
  cssLength: number;
  stylesheets: number;
  inlineBlocks: number;
  snippet: string;
  cssSnippet: string;
  baselineFeatures: BaselineFeature[];
  highlightedHtmlContent: string;
}

export interface BaselineFeature {
  name: string;
  status: string;
  description?: string;
  selector?: string;
  highlightClass?: string;
}