import React from 'react';
import { Shield, RefreshCw, Activity } from 'lucide-react';

interface HeaderProps {
  stats: { critical: number };
  loading: boolean;
  meta: { liveCount: number; demoCount: number; fetchTimeMs: number } | null;
  // Callback: called when the user clicks the Refresh button
  fetchArticles: () => void;
}

export function Header({ stats, loading, meta, fetchArticles }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">

        <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>

        <div className="leading-none hidden sm:block">
          <p className="text-sm font-black text-gray-900 tracking-tight">Ghana Cyber Monitor</p>
          <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest">National Cybersecurity Dashboard</p>
        </div>

        {stats.critical > 0 && !loading && (
          <div className="hidden md:flex items-center gap-1.5 ml-3 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-red-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs text-red-700 font-bold">{stats.critical} Critical</span>
          </div>
        )}

        {meta && !loading && (
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 ml-1">
            <Activity className="w-3 h-3 text-green-500" />
            {meta.liveCount} live articles · {meta.fetchTimeMs}ms
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={fetchArticles}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 bg-white border border-gray-200 hover:border-green-300 px-3 py-2 rounded-lg transition-all disabled:opacity-40 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline font-medium">{loading ? 'Refreshing…' : 'Refresh'}</span>
        </button>

      </div>
    </header>
  );
}