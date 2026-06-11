import React from 'react';
import { ExternalLink, Calendar, MapPin, Newspaper } from 'lucide-react';
import type { Article } from '../types';
import { LEVEL_STYLE } from '../constants';
import { fmtDate } from '../utils';
import { LevelBadge, DemoBadge, LiveBadge } from './Badges';

// creates a component called "NewsCard" and it receives an article and its index as props
export function NewsCard({ article, index }: { article: Article; index: number }) {
  const s = LEVEL_STYLE[article.level]; 

  // If the article has a URL, make the title a clickable link; otherwise plain text
  const titleEl = article.sourceUrl
    ? (
      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-xs font-semibold text-gray-900 hover:text-blue-700 leading-snug transition-colors group line-clamp-2"
      >
        {article.title}
        <ExternalLink className="inline-block w-3 h-3 ml-1 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </a>
    )
    : <h3 className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">{article.title}</h3>;

  return (
    <div
      className={`bg-white border border-gray-100 border-l-4 ${s.border} rounded-xl p-3 space-y-2 shadow-sm hover:shadow-md transition-shadow`}
      style={{ animation: 'fadeIn 0.3s ease both', animationDelay: `${Math.min(index, 20) * 20}ms` }}
    >

      <div className="flex flex-wrap gap-1 items-center">
        {article.isDemo ? <DemoBadge /> : <LiveBadge />}
        <LevelBadge level={article.level} />
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 truncate max-w-[120px]">
          {article.category}
        </span>
      </div>
      {titleEl}

      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{article.summary}</p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          {fmtDate(article.date)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {article.region}
        </span>
        <span className="flex items-center gap-1 truncate">
          <Newspaper className="w-3 h-3 flex-shrink-0" />
          {article.source}
        </span>
      </div>

      {article.sourceUrl && (
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${s.bg} ${s.text} border ${s.border.replace('border-l-', 'border-')}`}
        >
          Read Full Article <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}