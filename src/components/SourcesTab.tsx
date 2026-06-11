import React from 'react';
import { Globe, Shield, Newspaper, ExternalLink } from 'lucide-react';
import { SOURCES } from '../data/sources';

interface SourcesTabProps {
  // How many live (non-demo) articles came from each source
  articlesBySource: Record<string, number>;
}

export function SourcesTab({ articlesBySource }: SourcesTabProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Globe className="w-4 h-4 text-green-600" /> Ghana News &amp; Cybersecurity Sources
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          All sources are verified Ghanaian news and government organisations.
          No international cybersecurity feeds are used.
        </p>
      </div>
      <div className="divide-y divide-gray-50">
        {SOURCES.map(src => (
          <div key={src.name} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
              {src.type === 'Government'
                ? <Shield    className="w-4 h-4 text-cyan-600" />
                : <Newspaper className="w-4 h-4 text-blue-500" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-800">{src.name}</span>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${src.type === 'Government' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                  {src.type}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{src.note}</p>
              <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-0.5 mt-0.5 w-fit">
                {src.url} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-gray-700">{articlesBySource[src.name] ?? 0}</span>
              <p className="text-[10px] text-gray-400">articles</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}