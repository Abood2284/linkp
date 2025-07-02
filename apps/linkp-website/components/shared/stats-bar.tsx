import React from "react";
import { Card } from "../ui/card";

interface StatItemProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

function StatItem({ value, label, icon }: StatItemProps) {
  return (
    <div className="flex flex-col items-center">
      {icon && <div className="mb-1 text-linkp-blue">{icon}</div>}
      <div className="text-linkp-blue-dark font-bold text-lg">{value}</div>
      <div className="text-xs text-linkp-blue-dark/60 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

interface StatsBarProps {
  stats: {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
  }[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <Card className="glass-effect mx-auto animate-fade-in-up">
      <div className="grid grid-cols-3 divide-x divide-white/10 py-3 px-1">
        {stats.map((stat, index) => (
          <div key={index} className="px-4 py-1.5">
            <StatItem value={stat.value} label={stat.label} icon={stat.icon} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default StatsBar;
