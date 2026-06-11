export type ThreatLevel = 'Critical' | 'High' | 'Medium' | 'Low'
export type ThreatCategory =
  | 'Data Breach'
  | 'Malware'
  | 'Ransomware'
  | 'Phishing'
  | 'Fraud & Scams'
  | 'Government Advisory'
  | 'Non-Threat News';
export type GhanaRegion =
  | 'Greater Accra'
  | 'Ashanti'
  | 'Northern'
  | 'Volta'
  | 'Eastern'
  | 'Western'
  | 'Central'
  | 'National'
  | 'Upper East'
  | 'Upper West'
  | 'Bono';

export type FeedType = 'News' | 'Government';

export type Tab = 'news' | 'analytics' | 'regions' | 'health' | 'sources';

export type DateRange = 'all' | 'today' | 'yesterday' | '3days' | '7days';

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: ThreatCategory;
  level: ThreatLevel;
  region: GhanaRegion;
  date: string;
  tags: string[];      
  feedType: FeedType;
  isDemo: boolean;     
}

// Shape of a single RSS feed's health status
export interface FeedStatus {
  name: string;
  url: string;
  type: FeedType;
  status: 'Active' | 'Offline' | 'Error';
  checkedAt: string;
}

// Shape of the JSON response from our backend API
export interface ApiResponse {
  results: Article[];
  count: number;
  liveCount: number;
  demoCount: number;
  fetchTimeMs: number;
  fetchedAt: string;
  source: string;
}