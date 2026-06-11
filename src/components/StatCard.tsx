import React from 'react';

// creates a reusable component called "StatCard"
export function StatCard({ label, value, icon: Icon, accent, alert = false }: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  alert?: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl p-4 space-y-2 border ${alert ? 'border-red-200 shadow-sm shadow-red-100' : 'border-gray-100 shadow-sm'}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${alert ? 'bg-red-50' : 'bg-gray-50'}`}>
          <Icon className={`w-3.5 h-3.5 ${accent}`} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}