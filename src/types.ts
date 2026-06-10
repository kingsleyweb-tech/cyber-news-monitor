export type ThreatCategory =
  | 'Data Breach'
  | 'Malware'
  | 'Ransomware'
  | 'Phishing'
  | 'Fraud & Scams'
  | 'Government Advisory';

export type GhanaRegion =
  | 'Greater Accra' | 'Ashanti' | 'Central' | 'Eastern' | 'Western'
  | 'Northern' | 'Volta' | 'Oti' | 'Bono' | 'Bono East' | 'Ahafo'
  | 'Savannah' | 'North East' | 'Upper East' | 'Upper West' | 'Western North';

export interface ThreatReport {
  id: string;
  title: string;
  source: 'CSA Ghana' | 'NCSC Ghana' | 'Graphic Online' | 'MyJoyOnline' | 'Citi Newsroom' | 'GNA' | 'B&FT Ghana' | 'AlienVault OTX' | 'AbuseIPDB' | 'CVE Database';
  link: string;
  pubDate: string; // ISO String
  category: ThreatCategory;
  region?: GhanaRegion; // Optional since technical CVEs/IPDB logs might not have a local region
  description: string;
}

export interface DashboardStats {
  reportsToday: number;
  reportsThisWeek: number;
  mostCommonCategory: ThreatCategory;
  mostAffectedRegion: GhanaRegion;
  activeSourcesCount: number;
}

export interface MonitoredFeed {
  name: string;
  url: string;
  type: 'Government Agency' | 'News Outlet' | 'Threat Intel Platform';
  description: string;
}