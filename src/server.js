const express = require('express');  //framework for creating a web server and API's
const axios   = require('axios');    // used to fetch data from websites & API's
const cors    = require('cors');       // allow  front-end and back-end to talk to each other
const xml2js  = require('xml2js');     // used to convert XML to JSON

const app = express();
app.use(cors());
app.use(express.json());

const GHANA_FEEDS = [
  {
    name: 'MyJoyOnline',
    urls: [
      'https://www.myjoyonline.com/feed/',
      'https://myjoyonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Citi Newsroom',
    urls: [
      'https://citinewsroom.com/feed/',
      'https://citifmonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Graphic Online',
    urls: [
      'https://www.graphic.com.gh/feed/',
      'https://graphic.com.gh/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Ghana News Agency',
    urls: [
      'https://www.ghananewsagency.org/rss.xml',
      'https://ghananewsagency.org/rss.xml',
    ],
    type: 'Government',
  },
  {
    name: 'Adom Online',
    urls: [
      'https://www.adomonline.com/feed/',
      'https://adomonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: '3News (TV3)',
    urls: [
      'https://3news.com/feed/',
      'https://www.3news.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'GBC Ghana Online',
    urls: [
      'https://gbcghanaonline.com/feed/',
      'https://www.gbcghanaonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Pulse Ghana',
    urls: [
      'https://www.pulse.com.gh/rss',
      'https://pulse.com.gh/rss',
    ],
    type: 'News',
  },
  {
    name: 'Modern Ghana',
    urls: [
      'https://www.modernghana.com/rss/news.aspx',
      'https://modernghana.com/rss/news.aspx',
    ],
    type: 'News',
  },
  {
    name: 'Business & Financial Times',
    urls: [
      'https://thebftonline.com/feed/',
      'https://www.thebftonline.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'Daily Guide Network',
    urls: [
      'https://www.dailyguideafrica.com/feed/',
      'https://dailyguideafrica.com/feed/',
    ],
    type: 'News',
  },
  {
    name: 'GhanaWeb',
    urls: [
      'https://www.ghanaweb.com/GhanaHomePage/rss/Ghana.xml',
      'https://ghanaweb.com/GhanaHomePage/rss/Ghana.xml',
    ],
    type: 'News',
  },
];

const DEMO_INCIDENTS = [
  {
    id:        'DEMO-001',
    title:     'CSA Ghana Issues Alert on SIM Swap Fraud Targeting MoMo Users',
    summary:   'The Cyber Security Authority has issued a public advisory warning Ghanaian mobile money users about a rise in SIM swap attacks. Fraudsters are impersonating victims at telco offices to take over phone numbers and drain MoMo wallets. Users are urged to set a SIM PIN with their provider immediately.',
    source:    'Cyber Security Authority Ghana',
    sourceUrl: 'https://csa.gov.gh',
    category:  'Fraud & Scams',
    level:     'Critical',
    region:    'National',
    date:      new Date().toISOString().slice(0, 10),
    tags:      ['momo', 'sim swap', 'fraud', 'csa ghana'],
    feedType:  'Government',
    isDemo:    true,
  },
  {
    id:        'DEMO-002',
    title:     'Phishing Campaign Spoofs Ghana Revenue Authority — GRA Warns Public',
    summary:   'A sophisticated phishing campaign is targeting Ghanaian taxpayers with fake SMS messages and emails claiming to be from the Ghana Revenue Authority (GRA). The messages ask recipients to enter their TIN numbers and bank details. GRA confirms these communications are fraudulent.',
    source:    'Ghana Revenue Authority',
    sourceUrl: 'https://gra.gov.gh',
    category:  'Phishing',
    level:     'High',
    region:    'National',
    date:      new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    tags:      ['phishing', 'gra', 'tax fraud', 'scam'],
    feedType:  'Government',
    isDemo:    true,
  },
];

function guessThreatLevel(text = '') {
  const t = text.toLowerCase();
  // Critical: active confirmed attacks — ransomware, breaches, arrests, MoMo theft
  if (t.includes('ransomware') || t.includes('data breach') || t.includes('critical') ||
      t.includes('arrested') || t.includes('stolen') || t.includes('momo fraud')) return 'Critical';
  // High: ongoing threats — phishing, malware, hacking, fraud in progress
  if (t.includes('phishing') || t.includes('malware') || t.includes('hack') ||
      t.includes('fraud') || t.includes('scam') || t.includes('sim swap')) return 'High';
  // Medium: warnings and advisories about potential threats
  if (t.includes('warning') || t.includes('alert') || t.includes('advisory') ||
      t.includes('vulnerability')) return 'Medium';
  // Low: general news, non-cyber articles, informational reports
  return 'Low';
}

function guessCategory(text = '') {
  const t = text.toLowerCase();

  // Ransomware: software that locks your files and demands payment
  if (t.includes('ransomware')) return 'Ransomware';

  // Phishing: fake messages/sites designed to steal your login or money
  if (
    t.includes('phishing') ||
    t.includes('spoofed') ||
    t.includes('impersonat') ||
    t.includes('fake sms') ||
    t.includes('fake email') ||
    t.includes('credential')
  ) return 'Phishing';

  // Data Breach: when private data (passwords, records) is stolen or exposed
  if (
    t.includes('data breach') ||
    t.includes('data leak') ||
    t.includes('leaked') ||
    t.includes('exposed database') ||
    t.includes('personal data')
  ) return 'Data Breach';

  // Malware: any malicious software (viruses, spyware, keyloggers, etc.)
  if (
    t.includes('malware') ||
    t.includes('trojan') ||
    t.includes('virus') ||
    t.includes('spyware') ||
    t.includes('keylogger') ||
    t.includes('botnet')
  ) return 'Malware';

  // Fraud & Scams: financial crime, hacking, MoMo theft, SIM swap, cybercrime
  if (
    t.includes('fraud') ||
    t.includes('scam') ||
    t.includes('momo') ||
    t.includes('mobile money') ||
    t.includes('sim swap') ||
    t.includes('cybercrime') ||
    t.includes('hack') ||
    t.includes('identity theft') ||
    t.includes('ponzi') ||
    t.includes('pyramid scheme')
  ) return 'Fraud & Scams';

  // Government Advisory: official warnings or policies from security/gov bodies
  if (
    t.includes('advisory') ||
    t.includes('csa') ||
    t.includes('ncsc') ||
    t.includes('bank of ghana') ||
    t.includes('cyber security authority') ||
    t.includes('cybersecurity policy') ||
    t.includes('digital security') ||
    t.includes('government cyber')
  ) return 'Government Advisory';
  return 'Non-Threat News';
}

function guessRegion(text = '') {
  const t = text.toLowerCase();
  if (t.includes('accra') || t.includes('greater accra') || t.includes('tema')) return 'Greater Accra';
  if (t.includes('kumasi') || t.includes('ashanti')) return 'Ashanti';
  if (t.includes('tamale') || t.includes('northern region')) return 'Northern';
  if (t.includes('volta') || t.includes('ho ')) return 'Volta';
  if (t.includes('eastern region') || t.includes('koforidua')) return 'Eastern';
  if (t.includes('takoradi') || t.includes('sekondi') || t.includes('western region')) return 'Western';
  if (t.includes('cape coast') || t.includes('central region')) return 'Central';
  if (t.includes('upper east') || t.includes('bolgatanga')) return 'Upper East';
  if (t.includes('upper west') || t.includes('wa ')) return 'Upper West';
  if (t.includes('bono') || t.includes('sunyani')) return 'Bono';
  return 'National';
}

const TAG_KEYWORDS = [
  'ransomware','phishing','malware','fraud','scam','data breach',
  'momo','sim swap','hack','cybercrime','deepfake','csa ghana',
  'mobile money','bank of ghana','mtn','telecel','airtel',
  'social engineering','crypto','bitcoin','gra','ncsc','digital',
];

function extractTags(text = '') {
  const lower = text.toLowerCase();
  return TAG_KEYWORDS.filter(tag => lower.includes(tag)).slice(0, 5);
}

// Safely extract a string from any xml2js value shape
const str = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.length > 0 ? str(val[0]) : '';
  if (typeof val === 'object' && val._) return val._;
  return String(val);
};


async function tryFetchUrl(url) {
  // We make the request with a real browser User-Agent string.
  // Some news servers block requests that look like bots.
  return axios.get(url, {
    timeout: 10000,
    maxRedirects: 5,
    headers: {
      'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept':          'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control':   'no-cache',
    },
  });
}

async function fetchRSSFeed(feed) {
  let lastError = null;

  // Try each URL for this feed until one succeeds
  for (const url of feed.urls) {
    try {
      const response = await tryFetchUrl(url);

      // Parse XML → JavaScript object
      const parsed = await xml2js.parseStringPromise(response.data, {
        explicitArray: false,
        ignoreAttrs:   false,
        explicitRoot:  true,
      });

      // Handle RSS 2.0 (<item>) and Atom (<entry>) formats
      const root     = parsed?.rss?.channel || parsed?.feed || parsed?.['rdf:RDF'] || parsed;
      let   rawItems = root?.item || root?.entry || [];
      if (!rawItems || rawItems === '') rawItems = [];
      const allItems = Array.isArray(rawItems) ? rawItems : [rawItems];

      const mapped = allItems.map((item, index) => {
        if (!item) return null;

        const title = str(item.title);
        const summaryRaw = item.description || item.summary || item['content:encoded'] || '';
        const summary    = str(summaryRaw).replace(/<[^>]+>/g, '').trim().slice(0, 400);

        let link = '';
        if (item.link) {
          if (typeof item.link === 'string')         link = item.link;
          else if (item.link.$ && item.link.$.href)  link = item.link.$.href;
          else if (Array.isArray(item.link))         link = item.link[0]?.$?.href || str(item.link[0]);
          else                                       link = str(item.link);
        }
        if (!link) link = url;

        const pubDate = str(item.pubDate || item.published || item.updated || '');
        const combined = `${title} ${summary}`;

        return {
          id:        `${feed.name.replace(/\s/g,'-')}-${index}-${Date.now()}`,
          title:     title || 'Untitled Article',
          summary:   summary || 'No description available.',
          source:    feed.name,
          sourceUrl: link,
          category:  guessCategory(combined),
          level:     guessThreatLevel(combined),
          region:    guessRegion(combined),
          // Parse the date — fall back to today if parsing fails
          date:      pubDate
            ? (() => { try { return new Date(pubDate).toISOString().slice(0, 10); } catch { return new Date().toISOString().slice(0, 10); } })()
            : new Date().toISOString().slice(0, 10),
          tags:      extractTags(combined),
          feedType:  feed.type,
          isDemo:    false,
        };
      }).filter(Boolean);

      console.log(`  ✓ ${feed.name}: ${mapped.length} articles (${url})`);
      return { articles: mapped, activeUrl: url, success: true };

    } catch (err) {
      console.warn(`  ✗ ${feed.name} [${url}]: ${err.message}`);
      lastError = err.message;
      // Try the next URL in the list
    }
  }

  // All URLs for this feed failed
  return { articles: [], activeUrl: null, success: false, error: lastError };
}

// GET /api/threats
// Returns all articles from all Ghana feeds + always includes demo incidents.
app.get('/api/threats', async (req, res) => {
  console.log('\n📡 /api/threats — fetching Ghana RSS feeds…');
  const startTime = Date.now();

  // Optional date filter
  const daysParam = parseInt(req.query.days);
  const cutoff    = isNaN(daysParam) ? null : new Date(Date.now() - daysParam * 86400000);
  if (cutoff) console.log(`   Date filter: last ${daysParam} day(s) (since ${cutoff.toISOString().slice(0,10)})`);

  try {
    // Fetch ALL feeds simultaneously using Promise.allSettled.
    // allSettled means: even if 9 feeds fail, the 1 that succeeds still returns.
    const results = await Promise.allSettled(
      GHANA_FEEDS.map(feed => fetchRSSFeed(feed))
    );

    // Collect articles from every feed that returned something
    const allArticles = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value.articles);

    console.log(`   Total raw articles before dedup: ${allArticles.length}`);

    // Remove exact duplicate headlines (same title from different feed formats)
    const seen   = new Set();
    const unique = allArticles.filter(article => {
      const key = article.title.toLowerCase().trim().slice(0, 70);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Apply optional date range filter
    const dateFiltered = cutoff
      ? unique.filter(a => {
          try { return new Date(a.date) >= cutoff; } catch { return true; }
        })
      : unique;

    // Sort newest first
    dateFiltered.sort((a, b) => {
      try { return new Date(b.date).getTime() - new Date(a.date).getTime(); }
      catch { return 0; }
    });

    // Always attach demo incidents — they go at the END after live articles
    // so real news appears first when available
    const finalArticles = [...dateFiltered, ...DEMO_INCIDENTS];

    const elapsed = Date.now() - startTime;
    console.log(`✓ Returning ${finalArticles.length} total (${dateFiltered.length} live + ${DEMO_INCIDENTS.length} demo) in ${elapsed}ms\n`);

    res.json({
      results:     finalArticles,
      count:       finalArticles.length,
      liveCount:   dateFiltered.length,
      demoCount:   DEMO_INCIDENTS.length,
      fetchTimeMs: elapsed,
      fetchedAt:   new Date().toISOString(),
      source:      'Ghana RSS feeds + Demo data',
    });

  } catch (error) {
    // Even a catastrophic server error still returns the demo incidents
    console.error('FATAL /api/threats error:', error.message);
    res.json({
      results:     DEMO_INCIDENTS,
      count:       DEMO_INCIDENTS.length,
      liveCount:   0,
      demoCount:   DEMO_INCIDENTS.length,
      fetchTimeMs: Date.now() - startTime,
      fetchedAt:   new Date().toISOString(),
      source:      'Demo data only (server error)',
      error:       error.message,
    });
  }
});

// Checks which feeds are reachable right now.
app.get('/api/feed-status', async (req, res) => {
  console.log('🔍 /api/feed-status — pinging all feeds…');

  const checks = await Promise.allSettled(
    GHANA_FEEDS.map(async feed => {
      // Try each URL for this feed
      for (const url of feed.urls) {
        try {
          await axios.get(url, {
            timeout: 6000,
            maxRedirects: 5,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; GhanaCyberMonitor/1.0)',
              'Accept':     'application/rss+xml, application/xml, text/xml, */*',
            },
          });
          // First URL that responds = Active
          return { name: feed.name, url, type: feed.type, status: 'Active',  checkedAt: new Date().toISOString() };
        } catch (_) {
          // Try next URL
        }
      }
      // All URLs failed = Offline
      return { name: feed.name, url: feed.urls[0], type: feed.type, status: 'Offline', checkedAt: new Date().toISOString() };
    })
  );

  const statuses = checks.map(r =>
    r.status === 'fulfilled' ? r.value : {
      name: 'Unknown', url: '', type: 'News', status: 'Error', checkedAt: new Date().toISOString(),
    }
  );

  const activeCount = statuses.filter(s => s.status === 'Active').length;
  console.log(`✓ Feed health: ${activeCount}/${statuses.length} active`);

  res.json({
    feeds:        statuses,
    activeCount,
    offlineCount: statuses.length - activeCount,
    totalCount:   statuses.length,
    checkedAt:    new Date().toISOString(),
  });
});

// GET /health  — quick server liveness check
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    service:   'Ghana Cyber Monitor API',
    feeds:     GHANA_FEEDS.length,
    demoItems: DEMO_INCIDENTS.length,
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🇬🇭  Ghana Cyber Monitor API — http://localhost:${PORT}`);
  console.log(`📰  Watching ${GHANA_FEEDS.length} Ghana RSS feeds`);
  console.log(`🔒  ${DEMO_INCIDENTS.length} demo incidents always available\n`);
  console.log('Endpoints:');
  console.log(`  GET /api/threats          → All articles (live + demo)`);
  console.log(`  GET /api/threats?days=1   → Today only`);
  console.log(`  GET /api/threats?days=7   → Last 7 days`);
  console.log(`  GET /api/feed-status      → Live feed health check`);
  console.log(`  GET /health               → Server status\n`);
});