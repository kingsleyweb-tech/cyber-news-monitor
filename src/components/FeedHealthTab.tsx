import React, { useState, useEffect } from 'react';

import {
  CheckCircle, XCircle, AlertCircle, Radio, Loader2,
} from 'lucide-react';
import type { FeedStatus } from '../types';
import { fetchFeedStatus } from '../services/api';

export function FeedHealthTab({ articlesBySource }: { articlesBySource: Record<string, number> }) {
  const [feeds,   setFeeds]   = useState<FeedStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Fetch feed health status once when the component mounts
  useEffect(() => {
    fetchFeedStatus()
      .then(data => { setFeeds(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []); 

  const activeCount  = feeds.filter(f => f.status === 'Active').length;
  const offlineCount = feeds.filter(f => f.status !== 'Active').length;

  // Small inline component for the status icon — returns different icons per status
  const StatusIcon = ({ status }: { status: string }) =>
    status === 'Active'  ? <CheckCircle  className="w-4 h-4 text-emerald-500" />
    : status === 'Offline' ? <XCircle    className="w-4 h-4 text-red-400" />
    :                        <AlertCircle className="w-4 h-4 text-amber-400" />;

  return (
    <div className="space-y-5">

      {!loading && !error && (
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Online',      activeCount,  'text-emerald-600'],
            ['Offline',     offlineCount, 'text-red-500'    ],
            ['Total Feeds', feeds.length, 'text-blue-600'   ],
          ].map(([label, val, cls]) => (
            <div key={String(label)} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
              <p className={`text-2xl font-bold ${cls}`}>{val}</p>
              <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
          <Radio className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-800">Ghana RSS Feed Sources</h3>
        </div>

        {loading && (
          <div className="p-10 text-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-400">Checking feed health…</p>
          </div>
        )}

        {/* Display error messages if there's an error*/}
        {!loading && error && (
          <div className="p-8 text-center">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Could not check feed status: {error}</p>
          </div>
        )}

        {/* shows content only when loading is finished and there is no error*/}
        {!loading && !error && (
          <div className="divide-y divide-gray-50">
            {feeds.map(feed => (
              <div key={feed.name} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <StatusIcon status={feed.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{feed.name}</span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${feed.type === 'Government' ? 'bg-cyan-50 text-cyan-600' : 'bg-blue-50 text-blue-600'}`}>
                      {feed.type}
                    </span>
                  </div>
                  <a href={feed.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-blue-500 truncate block transition-colors max-w-xs">
                    {feed.url}
                  </a>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-semibold ${feed.status === 'Active' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {feed.status}
                  </span>
                  {articlesBySource[feed.name] !== undefined && (
                    <p className="text-[10px] text-gray-400">{articlesBySource[feed.name]} articles</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}