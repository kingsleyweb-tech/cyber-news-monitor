export interface SourceEntry {
  name: string;
  url: string;
  type: 'Government' | 'News';
  note: string;
}

export const SOURCES: SourceEntry[] = [
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