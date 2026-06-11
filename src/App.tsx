import React, { useState, useMemo } from 'react';
// useMemo    — caches expensive calculations so they don't re-run needlessly.

import {
  Shield, AlertTriangle, Activity, BarChart3,
  Database, MapPin, Clock, Newspaper,
  WifiOff, Loader2, Filter,
  AlertCircle, Calendar, Tag, ChevronDown, ChevronUp,
} from 'lucide-react';

import type { ThreatCategory, ThreatLevel, GhanaRegion, DateRange, Tab } from './types';
import { INITIAL_ARTICLES_SHOWN } from './constants';
import { isInDateRange } from './utils';
import { useArticles } from './hooks/useArticles';
import { Header }         from './components/Header';
import { StatCard }       from './components/StatCard';
import { FilterPanel }    from './components/FilterPanel';
import { NewsCard }       from './components/NewsCard';
import { AnalyticsTab }   from './components/AnalyticsTab';
import { RegionsTab }     from './components/RegionsTab';
import { FeedHealthTab }  from './components/FeedHealthTab';
import { SourcesTab }     from './components/SourcesTab';

const GLOBAL_STYLES = `
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
`;

// creates and exports the main React component called "App"
export default function App() {

  // All fetching logic lives in the useArticles custom hook.
  const { articles, loading, error, meta, lastRefresh, fetchArticles } = useArticles();
  const [tab,          setTab]          = useState<Tab>('news');
  const [search,       setSearch]       = useState('');
  const [dateRange,    setDateRange]    = useState<DateRange>('all');
  const [category,     setCategory]     = useState<ThreatCategory | 'All'>('All');
  const [level,        setLevel]        = useState<ThreatLevel | 'All'>('All');
  const [region,       setRegion]       = useState<GhanaRegion | 'All'>('All');
  const [showDemoOnly, setShowDemoOnly] = useState(false);
  const [showAllNews,  setShowAllNews]  = useState(false);

  // creates "filtered" and only updates it when the data it depends on changes.
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return articles.filter(a => {
      if (showDemoOnly && !a.isDemo) return false;  // if demo mode is on, only show demo articles
      if (q && !a.title.toLowerCase().includes(q) && !a.summary.toLowerCase().includes(q)) return false;
      if (!isInDateRange(a.date, dateRange)) return false; // only show articles within selected date range
      if (category !== 'All' && a.category !== category) return false; 
      if (level    !== 'All' && a.level    !== level)    return false;
      if (region   !== 'All' && a.region   !== region)   return false;
      return true; // if all filters pass, keep the article
    });
  }, [articles, search, dateRange, category, level, region, showDemoOnly]);

  // creates visibleArticles and shows all news if showAllNews is true,
  const visibleArticles = showAllNews ? filtered : filtered.slice(0, INITIAL_ARTICLES_SHOWN);
  const hasMore = filtered.length > INITIAL_ARTICLES_SHOWN; // true if there are hidden articles

  // creates a variable "stats" and only recalculates it when dependencies change
  const stats = useMemo(() => {
    const today     = new Date().toISOString().slice(0, 10); 
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const topOf = (key: keyof typeof articles[0]) => {
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
  const hasFilters = !!(search || dateRange !== 'all' || category !== 'All' || level !== 'All' || region !== 'All' || showDemoOnly);

  // resets every filter to its default "show all" state
  const clearFilters = () => {
    setSearch('');
    setDateRange('all');
    setCategory('All');
    setLevel('All');
    setRegion('All');
    setShowDemoOnly(false);
    setShowAllNews(false); // also collapse back to 12 when filters are cleared
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Sticky top header bar */}
      <Header
        stats={stats}
        loading={loading}
        meta={meta}
        fetchArticles={fetchArticles}
      />

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
                <span className="w-1 h-5 rounded-full bg-green-600" />
              </div>
              <div className="flex items-center gap-2 mb-1">
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

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="Total Articles"    value={loading ? '…' : stats.total}        icon={Activity}      accent="text-blue-600" />
          <StatCard label="Today"             value={loading ? '…' : stats.today}        icon={Calendar}      accent="text-indigo-600" />
          <StatCard label="Yesterday"         value={loading ? '…' : stats.yesterday}    icon={Clock}         accent="text-violet-600" />
          <StatCard label="Critical"          value={loading ? '…' : stats.critical}     icon={AlertTriangle} accent="text-red-600" alert={stats.critical > 0} />
          <StatCard label="Non-Threat News"   value={loading ? '…' : stats.nonThreat}   icon={Shield}        accent="text-emerald-600" />
          <StatCard label="Top Source"        value={loading ? '…' : stats.topSource}   icon={Newspaper}     accent="text-emerald-600" />
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

        {/*Latest News Tab  */}
        {tab === 'news' && (
          <section className="space-y-4">

            <FilterPanel
              search={search}             setSearch={setSearch}
              dateRange={dateRange}       setDateRange={setDateRange}
              category={category}         setCategory={setCategory}
              level={level}               setLevel={setLevel}
              region={region}             setRegion={setRegion}
              showDemoOnly={showDemoOnly} setShowDemoOnly={setShowDemoOnly}
              setShowAllNews={setShowAllNews}
              hasFilters={hasFilters}     clearFilters={clearFilters}
              visibleCount={visibleArticles.length}
              filteredCount={filtered.length}
              totalCount={articles.length}
              showAllNews={showAllNews}
              hasMore={hasMore}
            />

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

        {tab === 'analytics' && <AnalyticsTab  articles={articles} />}
        {tab === 'regions'   && <RegionsTab    articles={articles} />}
        {tab === 'health'    && <FeedHealthTab articlesBySource={articlesBySource} />}
        {tab === 'sources'   && <SourcesTab    articlesBySource={articlesBySource} />}

        <footer className="border-t border-gray-100 pt-5 pb-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">
            Ghana Cyber Monitor · Live RSS feeds from verified Ghanaian sources
          </p>
          <div className="flex gap-4">
            {[['CSA Ghana', 'https://csa.gov.gh'], ['TV3 Ghana', 'https://3news.com'], ['MyJoyOnline', 'https://myjoyonline.com']].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-green-600 flex items-center gap-0.5 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </footer>

      </main>
      <style>{GLOBAL_STYLES}</style>
    </div>
  );
}