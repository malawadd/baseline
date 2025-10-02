import { LucideIcon } from 'lucide-react';

interface ScanResultCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

export default function ScanResultCard({ icon: Icon, label, value, color }: ScanResultCardProps) {
  return (
    <div className={`${color} border-4 border-[#001858] shadow-[6px_6px_0px_#001858] p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#001858] transition-all`}>
      <div className="flex items-center">
        <Icon className="w-10 h-10 text-[#001858]" />
        <div className="ml-4">
          <p className="text-xs font-black text-[#001858] uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-black text-[#001858]">{value}</p>
        </div>
      </div>
    </div>
  );
}