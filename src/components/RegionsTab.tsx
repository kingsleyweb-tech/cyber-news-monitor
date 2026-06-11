import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { MapPin, ChevronDown, ExternalLink } from 'lucide-react';
import type { Article } from '../types';
import { TOOLTIP_STYLE } from '../constants';
import { fmtDate } from '../utils';
import { LevelBadge } from './Badges';

export function RegionsTab({ articles }: { articles: Article[] }) {
  const [openRegion, setOpenRegion] = useState<string | null>('National');
  const byRegion = useMemo(() => {
    const map: Record<string, Article[]> = {};
    articles.forEach(a => {
      // If this region hasn't been seen yet, create an empty array first
      (map[a.region] = map[a.region] || []).push(a);
    });
    // Sort regions by number of articles
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [articles]);

  const chartData = byRegion.map(([name, arts]) => ({ name, value: arts.length }));

  return (
    <div className="space-y-5">

      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500" /> Incidents by Ghana Region
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.slice(0, 8)} layout="vertical" barSize={14}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">No regional data</div>
        )}
      </div>

      <div className="space-y-2">
        {byRegion.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
            <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No regional data available</p>
          </div>
        )}

        {byRegion.map(([region, arts]) => (
          <div key={region} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

            {/* Accordion header — clicking toggles this region */}
            <button
              onClick={() => setOpenRegion(openRegion === region ? null : region)}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-800">{region}</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                  {arts.length} article{arts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openRegion === region ? 'rotate-180' : ''}`} />
            </button>

            {/* shows this content only when the selected/open region matches the current region */}
            {openRegion === region && (
              <div className="border-t border-gray-50 divide-y divide-gray-50">
                {arts.slice(0, 5).map(art => (
                  <div key={art.id} className="px-5 py-3 flex items-start gap-3">
                    <LevelBadge level={art.level} />
                    <div className="flex-1 min-w-0">
                      {art.sourceUrl
                        ? <a href={art.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gray-800 hover:text-blue-700 line-clamp-2 transition-colors">{art.title}</a>
                        : <p className="text-xs font-semibold text-gray-800 line-clamp-2">{art.title}</p>
                      }
                      <p className="text-[11px] text-gray-400 mt-0.5">{art.source} · {fmtDate(art.date)}</p>
                    </div>
                  </div>
                ))}
                {arts.length > 5 && (
                  <p className="px-5 py-2.5 text-[11px] text-gray-400 italic">
                    +{arts.length - 5} more articles in this region
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}