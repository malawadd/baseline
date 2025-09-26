import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { ScanResult } from '@/types';
import { fetchStylesheet } from '@/lib/utils';
import { detectBaselineFeatures } from '@/lib/baselineDetector';

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
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the target page
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebsiteScanner/1.0)',
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch page: ${response.status} ${response.statusText}` },
        { status: 400 }
      );
    }

    const html = await response.text();
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

    // Fetch all stylesheets
    const stylesheetResults = await Promise.allSettled(stylesheetPromises);
    let successfulStylesheets = 0;

    stylesheetResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        linkedStylesheets.push(result.value);
        successfulStylesheets++;
      }
    });

    // Concatenate all CSS
    const allCss = [...inlineStyles, ...linkedStylesheets].join('\n');

    // Detect Baseline features
    const baselineFeatures = detectBaselineFeatures(html, allCss);

    // Prepare result
    const result: ScanResult = {
      htmlLength: Buffer.byteLength(html, 'utf8'),
      cssLength: Buffer.byteLength(allCss, 'utf8'),
      stylesheets: successfulStylesheets,
      inlineBlocks: inlineStyles.length,
      snippet: html.substring(0, 400),
      cssSnippet: allCss.substring(0, 400),
      baselineFeatures,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Scan error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
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