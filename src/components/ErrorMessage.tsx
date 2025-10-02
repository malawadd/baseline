import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="bg-[#ffe5eb] border-4 border-[#ff5470] shadow-[8px_8px_0px_#ff5470] p-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-12 h-12 text-[#001858]" />
        </div>
        <div>
          <p className="text-lg font-black text-[#001858] uppercase mb-2">⚠ Error Occurred</p>
          <p className="text-sm font-bold text-[#001858]">{error}</p>
        </div>
      </div>
    </div>
  );
}