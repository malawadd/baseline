import { LucideIcon } from 'lucide-react';

interface ScanResultCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

export default function ScanResultCard({ icon: Icon, label, value, color }: ScanResultCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <Icon className={`w-8 h-8 ${color}`} />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}