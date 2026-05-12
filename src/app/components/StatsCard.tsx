import { TrendingUp, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export function StatsCard({ title, value, change, trend, icon, iconBg, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconBg} ${iconColor} p-3 rounded-lg`}>
          {icon}
        </div>
        {trend === "up" && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <TrendingUp className="w-3 h-3" />
          </div>
        )}
        {trend === "neutral" && (
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Minus className="w-3 h-3" />
          </div>
        )}
      </div>
      <div className="text-2xl text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-900 mb-2">{title}</div>
      <div className="text-xs text-gray-500">{change}</div>
    </div>
  );
}
