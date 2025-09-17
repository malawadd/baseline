export async function fetchStylesheet(url: string, crossOrigin = false): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebsiteScanner/1.0)',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stylesheet: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/css') && !contentType.includes('text/plain')) {
      // Still try to fetch it, might be CSS without proper content-type
    }

    return await response.text();
  } catch (error) {
    if (crossOrigin) {
      // Silently fail for cross-origin requests that might not have CORS
      return '';
    }
    throw error;
  }
}