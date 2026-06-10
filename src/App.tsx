import React, { useState, useMemo, useEffect, useCallback } from 'react';
// useMemo    — caches expensive calculations so they don't re-run needlessly.
// useEffect  — runs side-effects (e.g. fetching data) after a render.
// useCallback — caches a function reference so it isn't re-created every render.

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts';

import {
  Shield, Search, AlertTriangle, Activity, BarChart3,
  Database, MapPin, Clock, ExternalLink, CheckCircle,
  XCircle, RefreshCw, Radio, Loader2, Newspaper,
  ChevronDown, AlertCircle, WifiOff, Calendar, Tag,
  Globe, Filter, Zap, ChevronUp, Leaf,
} from 'lucide-react';

type ThreatLevel    = 'Critical' | 'High' | 'Medium' | 'Low';
type ThreatCategory = 'Data Breach' | 'Malware' | 'Ransomware' | 'Phishing' | 'Fraud & Scams' | 'Government Advisory' | 'Non-Threat News';
type GhanaRegion    = 'Greater Accra' | 'Ashanti' | 'Northern' | 'Volta' | 'Eastern' | 'Western' | 'Central' | 'National' | 'Upper East' | 'Upper West' | 'Bono';
type FeedType       = 'News' | 'Government';
type Tab            = 'news' | 'analytics' | 'regions' | 'health' | 'sources';
type DateRange      = 'all' | 'today' | 'yesterday' | '3days' | '7days';

// An interface describes the "shape" of an object — its field names and their types. 
interface Article {
  id: string; 
  title: string;      
  summary: string; 
  source: string; 
  sourceUrl: string; 
  category: ThreatCategory;  
  level: ThreatLevel; 
  region: GhanaRegion; 
  date: string; 
  tags: string[];       // Keywords like ["ransomware", "banking"]
  feedType: FeedType; 
  isDemo: boolean;      // true = example data, false = real live feed data
}

// Shape of a single RSS feed's health status
interface FeedStatus {
  name: string;
  url: string;
  type: FeedType;
  status: 'Active' | 'Offline' | 'Error';
  checkedAt: string;
}

// Shape of the JSON response from our backend API
interface ApiResponse {
  results: Article[];
  count: number;
  liveCount: number;
  demoCount: number;
  fetchTimeMs: number;
  fetchedAt: string;
  source: string;
}

//It allows us to reuse the server address throughout the application and makes it easier to update if the backend URL changes.
const API_BASE = 'http://localhost:3001';

// Auto-refresh interval: 5 minutes expressed in milliseconds
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

//How many articles to show before the user clicks "View All News"
const INITIAL_ARTICLES_SHOWN = 12;

const LEVEL_STYLE: Record<ThreatLevel, { badge: string; border: string; dot: string; text: string; bg: string }> = {
  Critical: { badge: 'bg-red-100 text-red-700 border border-red-200',        border: 'border-l-red-500',     dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50' },
  High:     { badge: 'bg-orange-100 text-orange-700 border border-orange-200', border: 'border-l-orange-400', dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
  Medium:   { badge: 'bg-amber-100 text-amber-700 border border-amber-200',    border: 'border-l-amber-400',  dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50' },
  Low:      { badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', border: 'border-l-emerald-400', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
};

const CATEGORY_COLORS: Record<ThreatCategory, string> = {
  'Data Breach': '#3b82f6', 'Malware': '#8b5cf6', 'Ransomware': '#ef4444',
  'Phishing': '#f97316', 'Fraud & Scams': '#eab308', 'Government Advisory': '#06b6d4',
  'Non-Threat News': '#10b981',  // emerald green — calm, non-alarming colour
};

// Arrays used to populate the filter dropdowns
const CATEGORIES: Array<ThreatCategory | 'All'> = ['All', 'Data Breach', 'Malware', 'Ransomware', 'Phishing', 'Fraud & Scams', 'Government Advisory', 'Non-Threat News'];
const LEVELS:     Array<ThreatLevel | 'All'>    = ['All', 'Critical', 'High', 'Medium', 'Low'];
const REGIONS:    Array<GhanaRegion | 'All'>    = ['All', 'Greater Accra', 'Ashanti', 'Northern', 'Volta', 'Eastern', 'Western', 'Central', 'National', 'Upper East', 'Upper West', 'Bono'];


//new Date(iso) converts the string to a JavaScript Date object.
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' });

//isInDateRange — Decides whether an article falls within the selected date filter
function isInDateRange(articleDate: string, range: DateRange): boolean {
  if (range === 'all') return true;
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // midnight today
  const date  = new Date(articleDate);
  if (range === 'yesterday') return date >= new Date(today.getTime() - 86400000) && date < today;
  const offsets: Record<string, number> = { today: 0, '3days': 2, '7days': 6 };
  return date >= new Date(today.getTime() - (offsets[range] ?? 0) * 86400000);
}

// Shared style object passed to all Recharts <Tooltip> components
const TOOLTIP_STYLE = {
  contentStyle: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11, color: '#374151' },
};

// LevelBadge — Displays a coloured pill showing threat level 
function LevelBadge({ level }: { level: ThreatLevel }) {
  const s = LEVEL_STYLE[level]; 
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot} ${level === 'Critical' ? 'animate-pulse' : ''}`} />
      {level}
    </span>
  );
}

// PillBadge — A generic coloured pill; used as a base for DemoBadge and LiveBadge
function PillBadge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}>
      {children}
    </span>
  );
}

function DemoBadge() {
  return (
    <PillBadge className="bg-purple-100 text-purple-700 border border-purple-200">
      <Zap className="w-2.5 h-2.5" /> Demo
    </PillBadge>
  );
}

// LiveBadge — Green pill with animated dot shown on real RSS feed articles
function LiveBadge() {
  return (
    <PillBadge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
        <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      Live
    </PillBadge>
  );
}

// creates a reusable component called "StatCard"
function StatCard({ label, value, icon: Icon, accent, alert = false }: {
  label: string; value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; alert?: boolean;
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

// creates a component called "NewsCard"
  // it receives an article and its index as props
function NewsCard({ article, index }: { article: Article; index: number }) {
  const s = LEVEL_STYLE[article.level]; // colour set for this threat level

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

      {/*Badges*/}
      <div className="flex flex-wrap gap-1 items-center">
        {article.isDemo ? <DemoBadge /> : <LiveBadge />}
        <LevelBadge level={article.level} />
        {/* Category badge */}
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 truncate max-w-[120px]">
          {article.category}
        </span>
      </div>

      {/*Title*/}
      {titleEl}

      {/* Summary — clamped to 2 lines */}
      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{article.summary}</p>

      {/* Meta info row (date, region, source) */}
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

      {/*  Read Full Article button */}
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

// creates a function that counts articles based on a selected field 
function countArticlesBy<K extends keyof Article>(articles: Article[], key: K): [string, number][] {
  const counts: Record<string, number> = {};  // creates an empty object to store counts
  articles.forEach(a => { const v = String(a[key]); counts[v] = (counts[v] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

const LEVEL_COLORS: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };

 // creates a component called "AnalyticsTab" that receives a list of articles
function AnalyticsTab({ articles }: { articles: Article[] }) {
 
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

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pie chart — category distribution */}
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

function RegionsTab({ articles }: { articles: Article[] }) {
  // null means no region is open; a string means that region is expanded
  const [openRegion, setOpenRegion] = useState<string | null>('National');

  // Group articles by their region field — runs only when `articles` changes
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

      {/* Regional bar chart */}
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

// creates a component called "FeedHealthTab" and receives data called articlesBySource
function FeedHealthTab({ articlesBySource }: { articlesBySource: Record<string, number> }) {
  const [feeds,   setFeeds]   = useState<FeedStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Fetch feed health status once when the component mounts
  useEffect(() => {
    fetch(`${API_BASE}/api/feed-status`)
      .then(r => r.json())
      .then(d => { setFeeds(d.feeds || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []); // ← empty array = run once on mount

  const activeCount  = feeds.filter(f => f.status === 'Active').length;
  const offlineCount = feeds.filter(f => f.status !== 'Active').length;

  // Small inline component for the status icon — returns different icons per status
  const StatusIcon = ({ status }: { status: string }) =>
    status === 'Active'  ? <CheckCircle className="w-4 h-4 text-emerald-500" />
    : status === 'Offline' ? <XCircle    className="w-4 h-4 text-red-400" />
    :                        <AlertCircle className="w-4 h-4 text-amber-400" />;

  return (
    <div className="space-y-5">

      {/* Summary counts — online / offline / total */}
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

      {/* Feed list */}
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

const SOURCES = [
  { name: 'Cyber Security Authority Ghana', url: 'https://csa.gov.gh',              type: 'Government', note: 'Official national cybersecurity authority' },
  { name: 'MyJoyOnline',                    url: 'https://www.myjoyonline.com',      type: 'News',       note: "Multimedia Group — Ghana's leading news platform" },
  { name: 'Citi Newsroom',                  url: 'https://citinewsroom.com',         type: 'News',       note: 'Citi FM & Citi TV — trusted news broadcaster' },
  { name: 'Graphic Online',                 url: 'https://www.graphic.com.gh',       type: 'News',       note: 'Daily Graphic — oldest national daily newspaper' },
  { name: 'Ghana News Agency',              url: 'https://www.ghananewsagency.org',  type: 'Government', note: 'State-owned wire service — official government news' },
  { name: 'Adom Online',                    url: 'https://www.adomonline.com',       type: 'News',       note: 'Adom FM & TV — major Akan-language broadcaster' },
  { name: 'Pulse Ghana',                    url: 'https://www.pulse.com.gh',         type: 'News',       note: 'Pan-African digital media covering Ghana' },
  { name: 'Modern Ghana',                   url: 'https://www.modernghana.com',      type: 'News',       note: 'Independent online news aggregator' },
  { name: 'Business & Financial Times',     url: 'https://thebftonline.com',         type: 'News',       note: "Ghana's leading business and finance newspaper" },
  { name: 'Daily Guide Network',            url: 'https://www.dailyguideafrica.com', type: 'News',       note: 'Daily Guide — independent national newspaper' },
  { name: 'GhanaWeb',                       url: 'https://www.ghanaweb.com',         type: 'News',       note: "One of Ghana's oldest online news portals" },
];

export default function App() {    // // creates and exports the main React component called "App"

  //  Data state
  const [articles,    setArticles]    = useState<Article[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [meta,        setMeta]        = useState<{ liveCount: number; demoCount: number; fetchTimeMs: number } | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // UI / filter state 
  const [tab,          setTab]          = useState<Tab>('news');
  const [search,       setSearch]       = useState('');
  const [dateRange,    setDateRange]    = useState<DateRange>('all');
  const [category,     setCategory]     = useState<ThreatCategory | 'All'>('All');
  const [level,        setLevel]        = useState<ThreatLevel | 'All'>('All');
  const [region,       setRegion]       = useState<GhanaRegion | 'All'>('All');
  const [showDemoOnly, setShowDemoOnly] = useState(false);

  
  const [showAllNews, setShowAllNews] = useState(false); 

  // creates a function that takes an article and returns a new updated article
  const reclassifyArticle = (article: Article): Article => {   
    if (article.isDemo) return article;

    const t = (article.title + ' ' + article.summary).toLowerCase();

    // Determine the correct category using the same logic as server.js
    let correctedCategory: ThreatCategory;

    if (t.includes('ransomware')) {
      correctedCategory = 'Ransomware';
    } else if (
      t.includes('phishing') || t.includes('spoofed') || t.includes('impersonat') ||
      t.includes('fake sms') || t.includes('fake email') || t.includes('credential')
    ) {
      correctedCategory = 'Phishing';
    } else if (
      t.includes('data breach') || t.includes('data leak') || t.includes('leaked') ||
      t.includes('exposed database') || t.includes('personal data')
    ) {
      correctedCategory = 'Data Breach';
    } else if (
      t.includes('malware') || t.includes('trojan') || t.includes('virus') ||
      t.includes('spyware') || t.includes('keylogger') || t.includes('botnet')
    ) {
      correctedCategory = 'Malware';
    } else if (
      t.includes('fraud') || t.includes('scam') || t.includes('momo') ||
      t.includes('mobile money') || t.includes('sim swap') || t.includes('cybercrime') ||
      t.includes('hack') || t.includes('identity theft') || t.includes('ponzi') ||
      t.includes('pyramid scheme')
    ) {
      correctedCategory = 'Fraud & Scams';
    } else if (
      t.includes('advisory') || t.includes('csa') || t.includes('ncsc') ||
      t.includes('bank of ghana') || t.includes('cyber security authority') ||
      t.includes('cybersecurity policy') || t.includes('digital security') ||
      t.includes('government cyber')
    ) {
      correctedCategory = 'Government Advisory';
    } else {
      // No cybersecurity keywords found — this is general news, not a threat
      correctedCategory = 'Non-Threat News';
    }

    // Only update if the category actually needs changing
    if (correctedCategory === article.category) return article;
    return { ...article, category: correctedCategory };
  };

  const fetchArticles = useCallback(() => {
    setLoading(true);
    setError(null);  // clears previous error
    fetch(`${API_BASE}/api/threats`)  // sends a request to the backend API
      .then(r => {
        if (!r.ok) throw new Error(`Server returned error ${r.status}`);
        return r.json() as Promise<ApiResponse>;   // converts the response into JSON data
      })
      .then(data => {

        const reclassified = (data.results || []).map(reclassifyArticle);  // takes API results and converts each item using "reclassifyArticle"
        setArticles(reclassified);    
        setMeta({ liveCount: data.liveCount, demoCount: data.demoCount, fetchTimeMs: data.fetchTimeMs });
        setLastRefresh(new Date());
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []); //  no dependencies: fetchArticles is created once and never recreated

  // Initial data load
  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  useEffect(() => {
    const id = setInterval(fetchArticles, REFRESH_INTERVAL_MS);  // runs fetchArticles every few seconds (auto refresh)
    return () => clearInterval(id);
  }, [fetchArticles]);

  const filtered = useMemo(() => {     // creates "filtered" and only updates it when the data it depends on changes 
    const q = search.toLowerCase();
    return articles.filter(a => {            // filters articles based on multiple conditions
      if (showDemoOnly && !a.isDemo) return false;  //if demo mode is on, only show demo articles
      if (q && !a.title.toLowerCase().includes(q) && !a.summary.toLowerCase().includes(q)) return false; 
      if (!isInDateRange(a.date, dateRange)) return false; // only show articles within selected date range
      if (category !== 'All' && a.category !== category) return false; // filters by category if one is selected
      if (level    !== 'All' && a.level    !== level)    return false; 
      if (region   !== 'All' && a.region   !== region)   return false; 
      return true; // if all filters pass, keep the article
    });
  }, [articles, search, dateRange, category, level, region, showDemoOnly]);

// creates visibleArticles and shows all news if showAllNews is true, otherwise shows only the first few articles
  const visibleArticles = showAllNews ? filtered : filtered.slice(0, INITIAL_ARTICLES_SHOWN);
  const hasMore = filtered.length > INITIAL_ARTICLES_SHOWN; // true if there are hidden articles

  // creates a variable "stats" and only recalculates it when dependencies change
  const stats = useMemo(() => {      
    const today     = new Date().toISOString().slice(0, 10); // "2024-06-01"
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const topOf = (key: keyof Article) => {
      const counts: Record<string, number> = {};
      articles.forEach(a => { const v = String(a[key]); counts[v] = (counts[v] || 0) + 1; });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    };
    return {
      total:       articles.length,
      today:       articles.filter(a => a.date === today).length,
      yesterday:   articles.filter(a => a.date === yesterday).length,
      critical:    articles.filter(a => a.level === 'Critical').length,
      // Count articles that are general news, not cybersecurity threats
      nonThreat:   articles.filter(a => a.category === 'Non-Threat News').length,
      topSource:   topOf('source'),
      topCategory: topOf('category'),
    };
  }, [articles]);

  // Article count per source — used by Feed Health and Sources tabs
  const articlesBySource = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.filter(a => !a.isDemo).forEach(a => { counts[a.source] = (counts[a.source] || 0) + 1; });
    return counts;
  }, [articles]);

  // This variable checks if the user has applied any filter.
  const hasFilters = search || dateRange !== 'all' || category !== 'All' || level !== 'All' || region !== 'All' || showDemoOnly;

  //resets every filter to its default "show all" state
  const clearFilters = () => {
    setSearch('');
    setDateRange('all');
    setCategory('All');
    setLevel('All');
    setRegion('All');
    setShowDemoOnly(false);
    setShowAllNews(false); // also collapse back to 12 when filters are cleared
  };

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
    <div className="min-h-screen bg-gray-50 text-gray-900">

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">

          {/* Logo */}
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>

          {/* Brand name — hidden on very small screens*/}
          <div className="leading-none hidden sm:block">
            <p className="text-sm font-black text-gray-900 tracking-tight">Ghana Cyber Monitor</p>
            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest">National Cybersecurity Dashboard</p>
          </div>

          {/* Critical alert pill — only shows when there are critical articles */}
          {stats.critical > 0 && !loading && (
            <div className="hidden md:flex items-center gap-1.5 ml-3 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-red-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs text-red-700 font-bold">{stats.critical} Critical</span>
            </div>
          )}

          {/* Live feed stats — only visible on large screens */}
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

      {/*Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Page title block */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {/* Decorative Ghana flag colour bars */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-5 rounded-full bg-red-500" />
                <span className="w-1 h-5 rounded-full bg-yellow-400" />
                <span className="w-1 h-5 rounded-full bg-green-600" />
                <h1 className="text-xl font-black text-gray-900">Ghana Cybersecurity News Dashboard</h1>
              </div>
              <p className="text-sm text-gray-400">
                Monitoring live cybersecurity news from Ghanaian sources · Auto-refreshes every 5 minutes ·
                Last updated:{' '}
                <span className="text-gray-600 font-medium">
                  {lastRefresh.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
            </div>
            <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg font-semibold shrink-0">
              🇬🇭 Ghana-Only
            </span>
          </div>
        </div>

        {/*Stats Row */}
        {/*
          STAT CARDS — quick summary numbers at a glance.
          The grid changes from 2 columns on mobile → 4 on tablet → 7 on desktop.
          Each StatCard shows one number from the `stats` object computed above.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="Total Articles"    value={loading ? '…' : stats.total}       icon={Activity}      accent="text-blue-600" />
          <StatCard label="Today"             value={loading ? '…' : stats.today}       icon={Calendar}      accent="text-indigo-600" />
          <StatCard label="Yesterday"         value={loading ? '…' : stats.yesterday}   icon={Clock}         accent="text-violet-600" />
          <StatCard label="Critical"          value={loading ? '…' : stats.critical}    icon={AlertTriangle} accent="text-red-600" alert={stats.critical > 0} />
          {/*
            Non-Threat News stat card — shows how many articles are general (non-cyber) news.
            Uses a Leaf icon and emerald colour to signal "safe / not a threat".
          */}
          <StatCard label="Non-Threat News"   value={loading ? '…' : stats.nonThreat}  icon={Leaf}          accent="text-emerald-600" />
          <StatCard label="Top Source"        value={loading ? '…' : stats.topSource}  icon={Newspaper}     accent="text-emerald-600" />
          <StatCard label="Top Category"      value={loading ? '…' : stats.topCategory} icon={Tag}           accent="text-orange-600" />
        </div>

        {/*Tab Navigation*/}
        <nav className="flex gap-1 bg-white border border-gray-100 p-1 rounded-xl shadow-sm overflow-x-auto">
          {([
            { id: 'news',      label: 'Latest News',    icon: Newspaper },
            { id: 'analytics', label: 'Analytics',      icon: BarChart3 },
            { id: 'regions',   label: 'News by Region', icon: MapPin    },
            { id: 'health',    label: 'Feed Health',    icon: Activity  },
            { id: 'sources',   label: 'Sources',        icon: Database  },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                tab === id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {tab === 'news' && (
          <section className="space-y-4">

            {/*Filter Panel*/}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setShowAllNews(false); // collapse to 12 when search changes
                  }}
                  placeholder="Search articles by title or keyword…"
                  className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
                />
              </div>

              {/* Filter dropdowns row */}
              <div className="flex flex-wrap gap-2 items-center">

                {/* Date range picker */}
                <FilterSelect
                  icon={Calendar}
                  value={dateRange}
                  onChange={v => { setDateRange(v as DateRange); setShowAllNews(false); }}
                >
                  {(['all', 'today', 'yesterday', '3days', '7days'] as const).map(v => (
                    <option key={v} value={v}>
                      {v === 'all'  ? 'All Dates'
                        : v === '3days' ? 'Last 3 Days'
                        : v === '7days' ? 'Last 7 Days'
                        : v.charAt(0).toUpperCase() + v.slice(1)}
                    </option>
                  ))}
                </FilterSelect>

                {/* Category / Level / Region dropdowns */}
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
                <span className="text-gray-700 font-semibold">{visibleArticles.length}</span>
                {!showAllNews && hasMore && (
                  <span> of <span className="font-semibold">{filtered.length}</span></span>
                )}{' '}
                {showAllNews || !hasMore ? (
                  <span>of <span className="font-semibold">{articles.length}</span></span>
                ) : null}{' '}
                articles
              </p>
            </div>

            {/*Show a loading indicator while data is being fetched*/}
            {loading && (
              <div className="bg-white border border-gray-100 rounded-xl p-14 text-center shadow-sm">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-700 font-semibold">Fetching live Ghana news feeds…</p>
                <p className="text-xs text-gray-400 mt-1">Pulling from 10 Ghanaian RSS sources simultaneously</p>
              </div>
            )}

            {/*Show an error message only after loading has finished and an error is present.*/}
            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center shadow-sm">
                <WifiOff className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-sm text-red-700 font-semibold mb-1">Could not connect to the news backend</p>
                <p className="text-xs text-gray-500 mb-1">{error}</p>
                <p className="text-xs text-gray-400 mb-4">
                  Make sure the backend is running:{' '}
                  <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-green-700">node server.js</code>
                </p>
                <button
                  onClick={fetchArticles}
                  className="text-sm bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                  Try Again
                </button>
              </div>
            )}

           {/* Show the content only when loading is complete, there are no errors, and there are articles to display*/}
            {!loading && !error && visibleArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {visibleArticles.map((a, i) => (
                  <NewsCard key={a.id} article={a} index={i} />
                ))}
              </div>
            )}

          {/*It tells React to show something only when data has finished loading, there are no errors, and more data is available*/}
            {!loading && !error && hasMore && (
              <div className="flex justify-center pt-2 pb-1">
                <button
                  onClick={() => {
                    if (showAllNews) {
                      // Collapse: scroll back up to the top of the news section
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    setShowAllNews(!showAllNews);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-white border border-green-200 hover:bg-green-50 hover:border-green-400 px-6 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  {showAllNews ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      View All News ({filtered.length} articles)
                    </>
                  )}
                </button>
              </div>
            )}

            {/*Empty: Filters too narrow */}
            {!loading && !error && articles.length > 0 && filtered.length === 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-14 text-center shadow-sm">
                <Filter className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-semibold mb-1">No articles match your filters</p>
                <p className="text-xs text-gray-400 mb-4">Try widening your date range or removing some filters</p>
                <button
                  onClick={clearFilters}
                  className="text-sm bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Empty: No feed articles at all */}
            {!loading && !error && articles.length === 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-14 text-center shadow-sm">
                <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-semibold">No articles returned from feeds</p>
                <p className="text-xs text-gray-400 mt-1">The RSS feeds may be temporarily unavailable. Try refreshing.</p>
              </div>
            )}
          </section>
        )}

        {/* Other tabs — pass the articles array so they can do their own calculations */}
        {tab === 'analytics' && <AnalyticsTab articles={articles} />}
        {tab === 'regions'   && <RegionsTab   articles={articles} />}
        {tab === 'health'    && <FeedHealthTab articlesBySource={articlesBySource} />}
        {tab === 'sources' && (
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
                      ? <Shield className="w-4 h-4 text-cyan-600" />
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
        )}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer className="border-t border-gray-100 pt-5 pb-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">
            Ghana Cyber Monitor · Live RSS feeds from verified Ghanaian sources
          </p>
          <div className="flex gap-4">
            {[['CSA Ghana', 'https://csa.gov.gh'], ['TV3 Ghana', 'https://3news.com'], ['MyJoyOnline', 'https://myjoyonline.com']].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-green-600 flex items-center gap-0.5 transition-colors">
                {label} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </footer>

      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* line-clamp truncates text to N lines; the -webkit prefix is needed
           for broad browser support even in 2024 */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}