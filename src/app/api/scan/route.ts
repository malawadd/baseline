import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { ScanResult } from '@/types';
import { fetchStylesheet } from '@/lib/utils';
import { detectBaselineFeatures } from '@/lib/baselineDetector';
import { highlightHtmlFeatures } from '@/lib/htmlHighlighter';
import { computeBaselineSummary } from '@/lib/baselineSummary';

// Configure for Vercel serverless
export const maxDuration = 60; // Maximum allowed on Pro plan, 10 on Hobby
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch (e) {
      console.error('Invalid URL:', e);
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the target page with a compatible timeout
    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      response = await fetch(targetUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WebsiteScanner/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (e) {
      console.error('Fetch error:', e);
      if (e instanceof Error && e.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - the website took too long to respond' },
          { status: 408 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch page: ${e instanceof Error ? e.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch page: ${response.status} ${response.statusText}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    
    // Limit HTML size to prevent memory issues
    const MAX_HTML_SIZE = 5 * 1024 * 1024; // 5MB
    if (html.length > MAX_HTML_SIZE) {
      console.warn('HTML too large, truncating:', html.length);
      return NextResponse.json(
        { error: 'Page is too large to scan (>5MB)' },
        { status: 400 }
      );
    }

    const $ = cheerio.load(html);

    // Extract inline style blocks
    const inlineStyles: string[] = [];
    $('style').each((_, element) => {
      const styleContent = $(element).html();
      if (styleContent) {
        inlineStyles.push(styleContent);
      }
    });

    // Extract linked stylesheets
    const linkedStylesheets: string[] = [];
    const stylesheetPromises: Promise<string>[] = [];

    $('link[rel="stylesheet"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          // Resolve relative URLs to absolute
          const stylesheetUrl = new URL(href, targetUrl.toString());
          
          // Only fetch same-origin stylesheets or those with CORS headers
          if (stylesheetUrl.origin === targetUrl.origin) {
            stylesheetPromises.push(fetchStylesheet(stylesheetUrl.toString()));
          } else {
            // Try to fetch cross-origin stylesheets (they might have CORS=*)
            stylesheetPromises.push(fetchStylesheet(stylesheetUrl.toString(), true));
          }
        } catch (error) {
          console.warn('Invalid stylesheet URL:', href, error);
        }
      }
    });

    // Fetch all stylesheets with timeout
    const stylesheetResults = await Promise.allSettled(stylesheetPromises);
    let successfulStylesheets = 0;

    stylesheetResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        linkedStylesheets.push(result.value);
        successfulStylesheets++;
      } else if (result.status === 'rejected') {
        console.warn('Stylesheet fetch failed:', result.reason);
      }
    });

    // Concatenate all CSS with size limit
    const allCss = [...inlineStyles, ...linkedStylesheets].join('\n');
    const MAX_CSS_SIZE = 5 * 1024 * 1024; // 5MB
    const truncatedCss = allCss.length > MAX_CSS_SIZE ? allCss.substring(0, MAX_CSS_SIZE) : allCss;
    
    if (allCss.length > MAX_CSS_SIZE) {
      console.warn('CSS too large, truncated:', allCss.length);
    }

    // Detect Baseline features
    console.log('Detecting baseline features...');
    const baselineFeatures = detectBaselineFeatures(html, truncatedCss);

    // Highlight HTML features
    console.log('Highlighting HTML features...');
    const highlightedHtmlContent = highlightHtmlFeatures(html, baselineFeatures);

    // Compute baseline summary
    console.log('Computing baseline summary...');
    const baselineSummary = computeBaselineSummary(baselineFeatures);

    // Prepare result
    const result: ScanResult = {
      htmlLength: Buffer.byteLength(html, 'utf8'),
      cssLength: Buffer.byteLength(allCss, 'utf8'),
      stylesheets: successfulStylesheets,
      inlineBlocks: inlineStyles.length,
      snippet: html.substring(0, 400),
      cssSnippet: truncatedCss.substring(0, 400),
      baselineFeatures,
      highlightedHtmlContent,
      baselineSummary,
      htmlContent: html,
      cssContent: truncatedCss,
    };

    console.log('Scan completed successfully');
    return NextResponse.json(result);

  } catch (error) {
    console.error('Scan error:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - the website took too long to respond' },
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        { error: `Scan failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}