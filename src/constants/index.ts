import type { ThreatLevel, ThreatCategory, GhanaRegion } from '../types';


// It allows us to reuse the server address throughout the application
export const API_BASE = 'https://cyber-news-monitor.onrender.com';

// Auto-refresh interval: 5 minutes expressed in milliseconds
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

// How many articles to show before the user clicks "View All News"
export const INITIAL_ARTICLES_SHOWN = 12;

export const LEVEL_STYLE: Record<ThreatLevel, { badge: string; border: string; dot: string; text: string; bg: string }> = {
  Critical: { badge: 'bg-red-100 text-red-700 border border-red-200',           border: 'border-l-red-500',     dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50' },
  High:     { badge: 'bg-orange-100 text-orange-700 border border-orange-200',  border: 'border-l-orange-400',  dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
  Medium:   { badge: 'bg-amber-100 text-amber-700 border border-amber-200',     border: 'border-l-amber-400',   dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50' },
  Low:      { badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', border: 'border-l-emerald-400', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
};

export const CATEGORY_COLORS: Record<ThreatCategory, string> = {
  'Data Breach':         '#3b82f6',
  'Malware':             '#8b5cf6',
  'Ransomware':          '#ef4444',
  'Phishing':            '#f97316',
  'Fraud & Scams':       '#eab308',
  'Government Advisory': '#06b6d4',
  'Non-Threat News':     '#10b981',
};

export const LEVEL_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High:     '#f97316',
  Medium:   '#eab308',
  Low:      '#22c55e',
};

// Arrays used to populate the filter dropdowns
export const CATEGORIES: Array<ThreatCategory | 'All'> = [
  'All', 'Data Breach', 'Malware', 'Ransomware',
  'Phishing', 'Fraud & Scams', 'Government Advisory', 'Non-Threat News',
];

export const LEVELS: Array<'Critical' | 'High' | 'Medium' | 'Low' | 'All'> = [
  'All', 'Critical', 'High', 'Medium', 'Low',
];

export const REGIONS: Array<GhanaRegion | 'All'> = [
  'All', 'Greater Accra', 'Ashanti', 'Northern', 'Volta',
  'Eastern', 'Western', 'Central', 'National', 'Upper East', 'Upper West', 'Bono',
];

// Shared style object passed to all Recharts <Tooltip> components
export const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 11,
    color: '#374151',
  },
};