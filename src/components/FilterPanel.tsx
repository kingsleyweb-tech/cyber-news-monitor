import React from 'react';
import {
  Search, Calendar, Zap, XCircle, ChevronDown,
} from 'lucide-react';
import type { ThreatCategory, ThreatLevel, GhanaRegion, DateRange } from '../types';
import { CATEGORIES, LEVELS, REGIONS } from '../constants';

interface FilterPanelProps {
  search: string;
  setSearch: (v: string) => void;
  dateRange: DateRange;
  setDateRange: (v: DateRange) => void;
  category: ThreatCategory | 'All';
  setCategory: (v: ThreatCategory | 'All') => void;
  level: ThreatLevel | 'All';
  setLevel: (v: ThreatLevel | 'All') => void;
  region: GhanaRegion | 'All';
  setRegion: (v: GhanaRegion | 'All') => void;
  showDemoOnly: boolean;
  setShowDemoOnly: (v: boolean) => void;
  setShowAllNews: (v: boolean) => void;
  hasFilters: boolean;
  clearFilters: () => void;
  visibleCount: number;
  filteredCount: number;
  totalCount: number;
  showAllNews: boolean;
  hasMore: boolean;
}

export function FilterPanel({
  search, setSearch,
  dateRange, setDateRange,
  category, setCategory,
  level, setLevel,
  region, setRegion,
  showDemoOnly, setShowDemoOnly,
  setShowAllNews,
  hasFilters, clearFilters,
  visibleCount, filteredCount, totalCount,
  showAllNews, hasMore,
}: FilterPanelProps) {

  // FilterSelect — a small inline helper component for the dropdown selects.
  // It wraps a <select> with an optional icon and a down-arrow indicator.
  const FilterSelect = ({
    icon: Icon, value, onChange, children,
  }: {
    icon?: React.ComponentType<{ className?: string }>;
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
  }) => (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none bg-gray-50 border border-gray-200 text-xs text-gray-700 rounded-lg ${Icon ? 'pl-8' : 'pl-2.5'} pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          type="text"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setShowAllNews(false);
          }}
          placeholder="Search articles by title or keyword…"
          className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
        />
      </div>

      {/* Filter dropdowns row */}
      <div className="flex flex-wrap gap-2 items-center">

        <FilterSelect
          icon={Calendar}
          value={dateRange}
          onChange={v => { setDateRange(v as DateRange); setShowAllNews(false); }}
        >
          {(['all', 'today', 'yesterday', '3days', '7days'] as const).map(v => (
            <option key={v} value={v}>
              {v === 'all'    ? 'All Dates'
               : v === '3days' ? 'Last 3 Days'
               : v === '7days' ? 'Last 7 Days'
               : v.charAt(0).toUpperCase() + v.slice(1)}
            </option>
          ))}
        </FilterSelect>
        
        {([
          { opts: CATEGORIES, value: category, set: (v: string) => { setCategory(v as ThreatCategory | 'All'); setShowAllNews(false); }, label: 'Categories' },
          { opts: LEVELS,     value: level,    set: (v: string) => { setLevel(v as ThreatLevel | 'All');       setShowAllNews(false); }, label: 'Levels'     },
          { opts: REGIONS,    value: region,   set: (v: string) => { setRegion(v as GhanaRegion | 'All');      setShowAllNews(false); }, label: 'Regions'    },
        ] as const).map(({ opts, value, set, label }) => (
          <FilterSelect key={label} value={value} onChange={set as (v: string) => void}>
            {(opts as readonly string[]).map(o => (
              <option key={o} value={o}>{o === 'All' ? `All ${label}` : o}</option>
            ))}
          </FilterSelect>
        ))}

        <button
          onClick={() => { setShowDemoOnly(!showDemoOnly); setShowAllNews(false); }}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
            showDemoOnly
              ? 'bg-purple-100 text-purple-700 border-purple-200'
              : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          <Zap className="w-3 h-3" /> Demo Only
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-red-500 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Article count display */}
      <p className="text-xs text-gray-400">
        Showing{' '}
        <span className="text-gray-700 font-semibold">{visibleCount}</span>
        {!showAllNews && hasMore && (
          <span> of <span className="font-semibold">{filteredCount}</span></span>
        )}{' '}
        {showAllNews || !hasMore ? (
          <span>of <span className="font-semibold">{totalCount}</span></span>
        ) : null}{' '}
        articles
      </p>
    </div>
  );
}