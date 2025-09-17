import { useState, useEffect } from 'react';
import { ScanResult } from '@/types';

interface UseScanDataReturn {
  result: ScanResult | null;
  loading: boolean;
  error: string;
}

export function useScanData(url: string): UseScanDataReturn {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) {
      setError('No URL provided');
      setLoading(false);
      return;
    }

    const fetchScanData = async () => {
      setLoading(true);
      setError('');
      setResult(null);

      try {
        const response = await fetch(`/api/scan?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Scan failed');
        }

        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchScanData();
  }, [url]);

  return { result, loading, error };
}