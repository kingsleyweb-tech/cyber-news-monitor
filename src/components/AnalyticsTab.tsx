import React, { useMemo } from 'react';
// imports useMemo to store calculated values and only update them when data changes
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { BarChart3, AlertTriangle, Database } from 'lucide-react';
import type { Article, ThreatCategory } from '../types';
import { CATEGORY_COLORS, LEVEL_COLORS, TOOLTIP_STYLE } from '../constants';
import { countArticlesBy } from '../utils';

// It wraps each chart in a white card with a heading and icon.
const ChartCard = ({
  title, icon: Icon, iconClass, children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <Icon className={`w-4 h-4 ${iconClass}`} />
      {title}
    </h3>
    {children}
  </div>
);

// creates a component called "AnalyticsTab" that receives a list of articles
export function AnalyticsTab({ articles }: { articles: Article[] }) {

  const categoryData = useMemo(() =>
    countArticlesBy(articles, 'category').map(([name, value]) => ({
      name, value, color: CATEGORY_COLORS[name as ThreatCategory] || '#9ca3af',
    })), [articles]);

  // creates "levelData" and only recalculates it when "articles" change
  const levelData = useMemo(() => {
    const counts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    articles.forEach(a => { if (counts[a.level] !== undefined) counts[a.level]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: LEVEL_COLORS[name] }));
  }, [articles]);

  const sourceData = useMemo(() =>
    countArticlesBy(articles, 'source').slice(0, 8).map(([name, value]) => ({ name, value })),
  [articles]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pie chart, category distribution */}
        <ChartCard title="Threat Category Distribution" icon={BarChart3} iconClass="text-blue-500">
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={85}
                    paddingAngle={3} dataKey="value"
                  >
                    {categoryData.map((e, i) => <Cell key={i} fill={e.color} stroke="white" strokeWidth={2} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend below the chart */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {categoryData.map(d => (
                  <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    {d.name} ({d.value})
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data yet</div>
          )}
        </ChartCard>

        {/* Bar chart — severity levels */}
        <ChartCard title="Severity Breakdown" icon={AlertTriangle} iconClass="text-orange-500">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={levelData} barSize={44}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {levelData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Horizontal bar chart — top sources */}
      <ChartCard title="Top Sources by Article Count" icon={Database} iconClass="text-violet-500">
        {sourceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceData} layout="vertical" barSize={14}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-sm text-gray-400">No source data</div>
        )}
      </ChartCard>
    </div>
  );
}