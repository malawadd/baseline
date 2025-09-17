# Website Scanning Technical Documentation

## Overview

The website scanning functionality extracts and analyzes HTML and CSS content from target websites using a combination of web standards APIs and specialized parsing libraries.

## Core Libraries and Technologies

### 1. Cheerio - HTML/XML Server-Side Parsing

**Library**: `cheerio` (jQuery-like server-side HTML manipulation)

**Why Cheerio?**
- **Server-side DOM manipulation**: Provides jQuery-like syntax for parsing HTML on the Node.js server
- **Memory efficient**: Unlike browser DOM, it doesn't load images, scripts, or render the page
- **CSS selector support**: Enables precise element selection using familiar CSS selectors
- **Fast parsing**: Built on parse5, one of the fastest HTML parsers for Node.js

**How it works in our implementation**:
```typescript
const $ = cheerio.load(html);

// Extract inline CSS blocks
$('style').each((_, element) => {
  const styleContent = $(element).html();
  if (styleContent) {
    inlineStyles.push(styleContent);
  }
});

// Extract linked stylesheets
$('link[rel="stylesheet"]').each((_, element) => {
  const href = $(element).attr('href');
  // Process stylesheet URLs
});
```

### 2. Web Fetch API - HTTP Content Retrieval

**API**: Native `fetch()` (Node.js 18+)

**Why Fetch API?**
- **Native support**: Built into Node.js 18+, no external dependencies
- **Promise-based**: Modern async/await compatibility
- **Request customization**: Headers, timeouts, and signal control
- **Stream support**: Efficient for large content handling

**Implementation details**:
```typescript
const response = await fetch(targetUrl.toString(), {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; WebsiteScanner/1.0)',
  },
  signal: AbortSignal.timeout(10000), // 10-second timeout
});
```

**User-Agent Strategy**: We use a custom User-Agent to identify our scanner while maintaining compatibility with most websites.

### 3. URL API - URL Processing and Validation

**API**: Native `URL` constructor

**Why URL API?**
- **Built-in validation**: Automatically validates URL format
- **Origin resolution**: Handles relative-to-absolute URL conversion
- **Protocol support**: Ensures HTTPS/HTTP compliance
- **Same-origin detection**: Critical for CORS handling

**Implementation**:
```typescript
// Validation
let targetUrl: URL;
try {
  targetUrl = new URL(url);
} catch {
  return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
}

// Relative URL resolution
const stylesheetUrl = new URL(href, targetUrl.toString());
```

### 4. Buffer API - Accurate Byte Size Calculation

**API**: Node.js `Buffer.byteLength()`

**Why Buffer.byteLength?**
- **UTF-8 accuracy**: String.length counts characters, not bytes
- **Memory precision**: Accounts for multi-byte Unicode characters
- **Standards compliance**: Matches HTTP Content-Length calculations

```typescript
const result: ScanResult = {
  htmlLength: Buffer.byteLength(html, 'utf8'),
  cssLength: Buffer.byteLength(allCss, 'utf8'),
  // ...
};
```

## Scanning Process Architecture

### Phase 1: URL Validation and HTTP Request

1. **URL Parsing**: Validate and normalize the target URL
2. **HTTP Request**: Fetch HTML content with proper headers and timeout
3. **Response Validation**: Check HTTP status and content availability

### Phase 2: HTML Parsing and CSS Discovery

1. **DOM Loading**: Parse HTML into queryable DOM structure using Cheerio
2. **Inline CSS Extraction**: Find all `<style>` blocks and extract content
3. **External CSS Discovery**: Locate all `<link rel="stylesheet">` elements

### Phase 3: CSS Aggregation

1. **URL Resolution**: Convert relative CSS URLs to absolute URLs
2. **Same-Origin Check**: Determine CORS requirements for external stylesheets
3. **Parallel Fetching**: Use `Promise.allSettled()` for concurrent CSS downloads
4. **Error Handling**: Gracefully handle failed CSS requests

### Phase 4: Content Analysis

1. **Size Calculation**: Measure byte length of HTML and combined CSS
2. **Metadata Extraction**: Count stylesheets and inline blocks
3. **Content Snippets**: Extract preview snippets for display

## CORS and Security Handling

### Same-Origin Policy Implementation

```typescript
if (stylesheetUrl.origin === targetUrl.origin) {
  stylesheetPromises.push(fetchStylesheet(stylesheetUrl.toString()));
} else {
  // Try cross-origin with graceful failure
  stylesheetPromises.push(fetchStylesheet(stylesheetUrl.toString(), true));
}
```

### Cross-Origin Resource Sharing (CORS)

**Challenge**: External stylesheets may block cross-origin requests
**Solution**: Attempt to fetch with graceful degradation

```typescript
export async function fetchStylesheet(url: string, crossOrigin = false): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebsiteScanner/1.0)' },
      signal: AbortSignal.timeout(5000),
    });
    return await response.text();
  } catch (error) {
    if (crossOrigin) {
      return ''; // Silent failure for CORS-blocked resources
    }
    throw error;
  }
}
```

## Error Handling Strategies

### 1. Network-Level Errors
- **Timeout handling**: 10-second limit for main page, 5-second for stylesheets
- **HTTP status validation**: Check response.ok before processing
- **DNS/Connection failures**: Catch and report network errors

### 2. Content-Level Errors
- **Invalid HTML**: Cheerio handles malformed HTML gracefully
- **Missing CSS**: Continue processing when stylesheets fail to load
- **Content-Type validation**: Accept CSS even without proper MIME type

### 3. Memory and Performance Limits
- **Content size limits**: Implicit through timeout mechanisms
- **Concurrent request limits**: Controlled by Promise.allSettled()
- **Resource cleanup**: Automatic garbage collection of parsed content

## Performance Optimizations

### 1. Concurrent Processing
```typescript
const stylesheetResults = await Promise.allSettled(stylesheetPromises);
```
All external stylesheets are fetched in parallel rather than sequentially.

### 2. Early Termination
- Requests timeout after reasonable periods
- Failed stylesheets don't block overall scanning
- Invalid URLs are caught early in the process

### 3. Memory Efficiency
- Only essential content is stored in memory
- Large stylesheets are processed as streams
- DOM structures are garbage collected after processing

## Data Types and Interfaces

```typescript
interface ScanResult {
  htmlLength: number;      // Byte length of HTML content
  cssLength: number;       // Combined byte length of all CSS
  stylesheets: number;     // Count of successfully loaded external CSS files
  inlineBlocks: number;    // Count of <style> blocks in HTML
  snippet: string;         // First 400 characters of HTML
  cssSnippet: string;      // First 400 characters of combined CSS
}
```

## Limitations and Constraints

### Technical Limitations
1. **Static Content Only**: No JavaScript execution or dynamic content loading
2. **CORS Restrictions**: Some external stylesheets may be inaccessible
3. **Timeout Constraints**: Large websites may hit timeout limits
4. **Memory Limits**: Very large pages may cause memory issues

### Security Considerations
1. **User-Agent Identification**: Transparent identification as a scanner
2. **No Authentication**: Cannot access protected content
3. **Rate Limiting**: No built-in protection against rapid requests
4. **Content Validation**: No validation of malicious content

This scanning implementation provides a robust foundation for website analysis while respecting web standards and handling edge cases gracefully.