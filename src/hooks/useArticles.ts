import { useState, useEffect, useCallback } from 'react';

import type { Article } from '../types';
import { REFRESH_INTERVAL_MS } from '../constants';
import { fetchThreats } from '../services/api';
import { reclassifyArticle } from '../utils';

// The shape of the object returned by useArticles()
interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  meta: { liveCount: number; demoCount: number; fetchTimeMs: number } | null;
  lastRefresh: Date;
  fetchArticles: () => void;
}

// useArticles — custom hook that manages article fetching and auto-refresh.
export function useArticles(): UseArticlesResult {

  //  Data state
  const [articles,    setArticles]    = useState<Article[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [meta,        setMeta]        = useState<{ liveCount: number; demoCount: number; fetchTimeMs: number } | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // fetchArticles — fetches all articles from the backend and updates state.
  // useCallback ensures this function is only re-created if dependencies change.
  const fetchArticles = useCallback(() => {
    setLoading(true);
    setError(null);  // clears previous error

    fetchThreats()
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
  }, []); 
  // Initial data load — runs once when the component first mounts
  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  // Auto-refresh — runs fetchArticles every milliseconds
  useEffect(() => {
    const id = setInterval(fetchArticles, REFRESH_INTERVAL_MS);  // runs fetchArticles every few seconds (auto refresh)
    return () => clearInterval(id);
  }, [fetchArticles]);

  return { articles, loading, error, meta, lastRefresh, fetchArticles };
}