# Website Scanner

A Next.js application that analyzes websites by extracting and examining their HTML and CSS content.

## Technical Overview

### Architecture

The application uses a client-server architecture built with Next.js 14+ (App Router):

- **Frontend**: React components with TypeScript for type safety
- **Backend**: Next.js API routes for server-side processing
- **Styling**: Tailwind CSS for responsive design

### How Website Scanning Works

For detailed technical documentation about the scanning functionality, including library choices, implementation details, and architecture, see **[SCANNING.md](./SCANNING.md)**.

#### 1. URL Processing
- User submits a target URL through the `UrlScanInput` component
- URL is encoded and passed to the scan route: `/scan/[encodedUrl]`
- The encoded URL is decoded server-side for processing

#### 2. Content Extraction (`/api/scan/route.ts`)
The scanning process involves several steps:

1. **HTTP Request**: Fetch the target website's HTML content using the Fetch API
2. **HTML Parsing**: Extract the raw HTML content and calculate its size
3. **CSS Extraction**: Parse HTML to find:
   - External stylesheets (`<link rel="stylesheet">`)
   - Inline CSS blocks (`<style>` tags)
   - Fetch external CSS files and combine with inline styles
4. **Analysis**: Calculate metrics including:
   - HTML content length
   - Total CSS content length
   - Number of external stylesheets
   - Number of inline style blocks

#### 3. Data Flow
```
User Input → URL Encoding → API Route → HTTP Fetch → Content Parsing → Analysis → Response
```

#### 4. Response Format
```typescript
interface ScanResult {
  url: string;
  htmlContent: string;
  cssContent: string;
  htmlLength: number;
  cssLength: number;
  stylesheets: number;
  inlineBlocks: number;
}
```

### Key Components

- **UrlScanInput**: Handles URL input and navigation, shows current scan context
- **ScanResultsDisplay**: Renders extracted HTML and CSS with syntax highlighting
- **ScanResultCard**: Displays scan metrics in card format
- **useScanData**: Custom hook for API data fetching and state management

### Error Handling

- Network request failures
- Invalid URL formats
- CORS restrictions from target websites
- Large content size limits

## Setup Instructions

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/malawadd/baseline.git
cd baseline
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page with URL input
│   ├── scan/[url]/page.tsx   # Scan results display
│   └── api/scan/route.ts     # Server-side scanning logic
├── components/
│   ├── UrlScanInput.tsx      # URL input component
│   ├── ScanResultsDisplay.tsx # Results visualization
│   ├── ScanResultCard.tsx    # Metric cards
│   └── ErrorMessage.tsx     # Error handling UI
├── hooks/
│   └── useScanData.ts        # Data fetching hook
└── types/
    └── index.ts              # TypeScript type definitions
```

## Technical Limitations

1. **CORS Restrictions**: Some websites block cross-origin requests
2. **Rate Limiting**: No built-in rate limiting for API requests
3. **Content Size**: Large websites may cause memory or timeout issues
4. **JavaScript Rendering**: Only static HTML/CSS is analyzed (no JS execution)
5. **Authentication**: Cannot scan websites requiring authentication

## Dependencies

### Core
- Next.js 14+
- React 18+
- TypeScript 5+

### UI/Styling
- Tailwind CSS
- Lucide React (icons)

### Development
- ESLint
- PostCSS

## API Endpoints

### `POST /api/scan`
Analyzes a website and returns extracted content and metrics.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "htmlContent": "<!DOCTYPE html>...",
  "cssContent": "body { margin: 0; }...",
  "htmlLength": 2048,
  "cssLength": 512,
  "stylesheets": 2,
  "inlineBlocks": 1
}
```
