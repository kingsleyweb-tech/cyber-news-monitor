import type { Article, ThreatCategory, DateRange } from '../types';

// fmtDate — formats an ISO date string into a readable Ghanaian date label.
// new Date(iso) converts the string to a JavaScript Date object.
export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GH', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  
// Returns true if the article should be shown, false if it should be hidden.
export function isInDateRange(articleDate: string, range: DateRange): boolean {
  if (range === 'all') return true;
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // midnight today
  const date  = new Date(articleDate);

  if (range === 'yesterday') {
    return date >= new Date(today.getTime() - 86400000) && date < today;
  }

  const offsets: Record<string, number> = { today: 0, '3days': 2, '7days': 6 };
  return date >= new Date(today.getTime() - (offsets[range] ?? 0) * 86400000);
}

// countArticlesBy — creates a function that counts articles based on a selected field.
export function countArticlesBy<K extends keyof Article>(
  articles: Article[],
  key: K,
): [string, number][] {
  const counts: Record<string, number> = {};  // creates an empty object to store counts
  articles.forEach(a => {
    const v = String(a[key]);
    counts[v] = (counts[v] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}


// reclassifyArticle — creates a function that takes an article and returns a new updated article with the corrected category based on keyword scanning.
export function reclassifyArticle(article: Article): Article {
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
    correctedCategory = 'Non-Threat News';
  }

  // Only update if the category actually needs changing
  if (correctedCategory === article.category) return article;
  return { ...article, category: correctedCategory };
}