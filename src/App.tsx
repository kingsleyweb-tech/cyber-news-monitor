import React, { useState } from 'react';
import { 
  Search,     
  RefreshCw, 
  TrendingUp, 
  Shield,     
  AlertCircle,
  ExternalLink,
  Filter,      
  Calendar, 
  Newspaper, 
  Globe,   
  ChevronRight, 
  Activity,  
  BarChart3, 
  Database, 
  Bug,   
  Skull,  
  Mail, 
  Award,  
  Eye          
} from 'lucide-react';

// This "interface" defines the shape of a single cybersecurity threat item.
interface Threat {
  id: string;               // A unique identifier for the threat, e.g. '1', '2'
  title: string;
  link: string; 
  pubDate: string;
  content: string; 
  category: ThreatCategory;
  source: string;      
  country?: string; 
}

type ThreatCategory = 
  | 'Data Breach'
  | 'Malware'
  | 'Ransomware'
  | 'Phishing'
  | 'Government Advisory';
// This App component is the ROOT — it contains everything.
function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // Stores which category the user has selected from the filter.
  const [selectedCategory, setSelectedCategory] = useState<ThreatCategory | 'All'>('All');
  const realThreats: Threat[] = [
    {
      id: '1',
      title: 'CISA Urges Stronger Security for Automatic Tank Gauge Systems',
      link: 'https://www.cisa.gov/news-events/news/cisa-urges-stronger-security-automatic-tank-gauge-systems',
      pubDate: new Date().toISOString(), // toISOString() converts the date to a standard text format
      content: 'WASHINGTON – The Cybersecurity and Infrastructure Security Agency (CISA) and government partners published a joint fact sheet today with recommended mitigations to protect automatic tank gauge (ATG) systems from being compromised by cyber threat actors targeting U.S.-based ATG systems. ',
      category: 'Government Advisory',
      source: 'CISA',
      country: 'USA'
    },
    {
      id: '2',
      title: 'IronWorm and New Miasma Worm Variant Hit npm in Supply Chain Attacks',
      link: 'https://thehackernews.com/2026/06/ironworm-and-new-miasma-worm-variant.html',
      pubDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      content: 'Multiple software supply chain attacks have hit the npm ecosystem, with threat actors using both malicious and poisoned versions of over 50 legitimate packages to distribute a Rust-based information stealer and a self-spreading worm, respectively.',
      category: 'Malware',
      source: 'The Hacker News',
      country: 'Global'
    },
    {
      id: '3',
      title: 'Netherlands Seizes 800 Servers, Arrests 2 for Aiding Cyberattacks',
      link: 'https://krebsonsecurity.com/2026/05/netherlands-seizes-800-servers-arrests-2-for-aiding-cyberattacks/',
      pubDate: new Date(Date.now() - 7200000).toISOString(), 
      content: 'Authorities in the Netherlands have arrested the co-owners of two related Internet hosting companies for operating IT infrastructure used by Russia to carry out cyberattacks, influence operations and disinformation campaigns inside the European Union.',
      category: 'Government Advisory',
      source: 'Krebs on Security',
      country: 'Netherlands'
    },
    {
      id: '4',
      title: 'CISA Admin Leaked AWS GovCloud Keys on Github',
      link: 'https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/',
      pubDate: new Date(Date.now() - 10800000).toISOString(), 
      content: 'Until this past weekend, a contractor for the Cybersecurity & Infrastructure Security Agency (CISA) maintained a public GitHub repository that exposed credentials to several highly privileged AWS GovCloud accounts and a large number of internal CISA systems.',
      category: 'Data Breach',
      source: 'Krebs on Security',
      country: 'USA'
    },
    {
      id: '5',
      title: 'Hackers Exploit Critical Everest Forms Pro WordPress Plugin Flaw to Take Over Sites',
      link: 'https://thehackernews.com/2026/06/hackers-exploit-critical-everest-forms.html',
      pubDate: new Date(Date.now() - 14400000).toISOString(),
      content: 'Threat actors are actively exploiting a critical security flaw in Everest Forms Pro, a WordPress plugin with about 4,000 active installations, to execute arbitrary code, leading to a complete site compromise.',
      category: 'Ransomware',
      source: 'The Hacker News',
      country: 'Global'
    },
    {
      id: '6',
      title: 'New HTTP/2 Bomb DoS attack crashes web servers in under a minute',
      link: 'https://www.bleepingcomputer.com/news/security/new-http-2-bomb-dos-attack-crashes-web-servers-in-under-a-minute/',
      pubDate: new Date(Date.now() - 18000000).toISOString(),
      content: 'A new denial-of-service (DoS) attack dubbed HTTP/2 Bomb can be launched from a single machine to take down web servers within seconds.',
      category: 'Phishing',
      source: 'Bleeping Computer',
      country: 'Global'
    },
  ];

  // This is a list of the 4 cybersecurity websites we monitor.
  const feedSources = [
    {
      name: 'The Hacker News',
      url: 'https://thehackernews.com',
      category: 'General Security',
      description: 'Breaking cybersecurity news and analysis',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Krebs on Security',
      url: 'https://krebsonsecurity.com',
      category: 'Security Blog',
      description: 'In-depth security investigations',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'CISA Advisories',
      url: 'https://www.cisa.gov',
      category: 'Government',
      description: 'Official US government alerts',
      color: 'from-green-500 to-green-600'  
    },
    {
      name: 'Bleeping Computer',
      url: 'https://www.bleepingcomputer.com',
      category: 'Tech News',
      description: 'Technical security news',
      color: 'from-orange-500 to-orange-600' 
    }
  ];
  const filteredThreats = realThreats.filter(threat => {
    // Check if the threat matches the search box input.
    // If searchTerm is empty (''), all threats should be shown
    const matchesSearch = searchTerm === '' || 
      threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||  //checks if the threats title match the search box input
      threat.content.toLowerCase().includes(searchTerm.toLowerCase()); 
    
    // If 'All' is selected, every threat should show.
    const matchesCategory = selectedCategory === 'All' || threat.category === selectedCategory; 
    return matchesSearch && matchesCategory; // It returns the conditions, True if both matchs the search txt and category
  });

  // Simply counts how many items are in the realThreats array (answer: 6).
  const totalThreats = realThreats.length;
  const categories = ['Data Breach', 'Malware', 'Ransomware', 'Phishing', 'Government Advisory'];

  // .map() goes through each category name and transforms it into an object with count + percentage.
  const categoryCounts = categories.map(cat => ({
    name: cat,
    // Count threats where the category exactly matches the current category name
    count: realThreats.filter(t => t.category === cat).length,
    // Calculate what percentage of the total this category makes up
    percentage: (realThreats.filter(t => t.category === cat).length / totalThreats) * 100
  }));
  
  //Starts with the first category.
  //Checks every other category.
  //Keeps the one with the highest count.
  //Stores the result in mostCommonCategory
  const mostCommonCategory = categoryCounts.reduce((max, curr) => 
    curr.count > max.count ? curr : max, categoryCounts[0]
  );

  //Create a function that accepts a category name (as a string) and checks its value so it can return the appropriate style for that category.
  const getCategoryStyle = (category: string) => {     
    switch (category) {
      case 'Data Breach':
        return { icon: Database, bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-200' };
      case 'Malware':
        return { icon: Bug, bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' };
      case 'Ransomware':
        return { icon: Skull, bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-200' };
      case 'Phishing':
        return { icon: Mail, bgColor: 'bg-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-200' };
      case 'Government Advisory':
        return { icon: Shield, bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-200' };
      default:
        return { icon: AlertCircle, bgColor: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-200' };
    }
  };
  // This function takes a date string (like "2026-06-06T10:00:00.000Z")and converts it into a  format like "2 hours ago".
  // How it works step by step:
  //   1. Convert the date string into a real Date object
  //   2. Get the current time using "new Date()"
  //   3. Calculate the difference in hours between now and the article date
  //   4. Return the right label based on the difference
const formatDate = (dateString: string) => {
    const date = new Date(dateString);   //Convert the raw date string into a JavaScript Date object

    // Get the current date and time
    const now = new Date();

    // Calculate how many hours have passed since the article was published.
    // Math.floor() rounds down to the nearest whole numbe
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
    
    // If less than 1 hour has passed, show "Just now"
    if (diffHours < 1) return 'Just now';

    //If the time difference is less than 24 hours, return a message like '1 hour ago'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    // If 24 or more hours have passed, convert to days and show "X day(s) ago"
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
  };

  // Everything inside "return ( ... )" is what gets displayed on screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
    {/* Header section */}    
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-white-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8" /> 
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Cyber News & Threat Monitor</h1>
                  <p className="text-sm text-green-100 mt-1">Real-time cybersecurity threat intelligence dashboard</p>
                </div>
              </div>
              {/* Sub-info row below the title — shows current time and total threat count */}
              <div className="flex items-center gap-4 mt-3 text-xs text-red-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {/*it displays the current time in the user's local format */}
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Total threats: {totalThreats}
                </span>
              </div>
            </div>
            
            {/* Refresh button — clicking it reloads the entire page to get fresh data */}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-black/10 hover:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        
        {/* ── STATS CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          {/* Card 1: Total Threats*/}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Threats</p>
                {/* Display the totalThreats variable — the total count of all news items */}
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalThreats}</p>
                <p className="text-xs text-green-600 mt-2">Active reports</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* Card 2: Most Common — shows which threat category has the highest count */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Most Common</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{mostCommonCategory.name}</p>
                <p className="text-xs text-gray-600 mt-2">{mostCommonCategory.count} reports</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          {/* Card 3: Categories — shows how many distinct threat types we track (5) */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{categories.length}</p>
                <p className="text-xs text-gray-600 mt-2">Threat types</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          {/* Card 4: Feed Sources — shows how many news sources we monitor (4) */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Feed Sources</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{feedSources.length}</p>
                <p className="text-xs text-gray-600 mt-2">Monitored</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search input box */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search threats by keyword... (e.g., ransomware, breach, malware)"
                value={searchTerm}
                // "onChange" Runs whenever the input value changes.
                // Whenever the user types in the input box, get the current text and save it into the searchTerm state variable.
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              {/* Category dropdown filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  // "value" binds this dropdown to the selectedCategory state
                  value={selectedCategory}

//"When the user selects a category, get the selected value and save it in selectedCategory. Tell TypeScript that the value is either a valid ThreatCategory or 'All'."
                  onChange={(e) => setSelectedCategory(e.target.value as ThreatCategory | 'All')}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Data Breach">Data Breach</option>
                  <option value="Malware">Malware</option>
                  <option value="Ransomware">Ransomware</option>
                  <option value="Phishing">Phishing</option>
                  <option value="Government Advisory">Government Advisory</option>
                </select>
              </div>

              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');           // Clear the search box
                    setSelectedCategory('All');  // Reset category to 'All'
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        
          <div className="flex flex-wrap gap-2 mt-4">
            {/* Loop through each category name and create a button for it */}
            {['All', 'Data Breach', 'Malware', 'Ransomware', 'Phishing', 'Government Advisory'].map((cat) => (
              <button
                // "key" is required by React when rendering lists — it helps React track each item efficiently
                key={cat}
                // When clicked, update selectedCategory to this category's value
                onClick={() => setSelectedCategory(cat as ThreatCategory | 'All')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-md'   // Active/selected state — red background
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Inactive state — gray background
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {searchTerm && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700">
                {/* Show count of results — adds 's' for plural (e.g. "1 threat" vs "2 threats") */}
                Found {filteredThreats.length} threat{filteredThreats.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
        
        {/* ── CATEGORY DISTRIBUTION CHART */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">Threat Distribution by Category</h3>
          </div>
          <div className="space-y-4">
            {/* Loop through each category count object and render a bar */}
            {categoryCounts.map(cat => {
              // Get the icon and color for this category using our getCategoryStyle function
              const Icon = getCategoryStyle(cat.name).icon;
              const color = getCategoryStyle(cat.name).textColor;
              return (
                <div key={cat.name}> {/* key is required for list items in React */}
                  {/* Row showing the category name and count/percentage on the right */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="font-medium text-gray-700">{cat.name}</span>
                    </div>
                    {/* Show count and percentage — toFixed(0) rounds to 0 decimal places */}
                    <span className="text-sm text-gray-600">{cat.count} reports ({cat.percentage.toFixed(0)}%)</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        cat.name === 'Data Breach' ? 'bg-blue-500' :
                        cat.name === 'Malware' ? 'bg-yellow-500' :
                        cat.name === 'Ransomware' ? 'bg-red-500' :
                        cat.name === 'Phishing' ? 'bg-purple-500' :
                        'bg-green-500' 
                      }`}
                      // Inline style sets the exact width of the bar as a percentage
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* ── FEED SOURCES SECTION */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">Monitored Feed Sources</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Loop through each feed source and create a clickable card */}
            {feedSources.map((feed) => (
              <a
                key={feed.name}
                href={feed.url}
                target="_blank"           // Open in a new browser tab
                rel="noopener noreferrer" // Security: prevent the new tab from accessing this page
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feed.color} opacity-10 rounded-bl-full`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {feed.name}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{feed.category}</p>
                  <p className="text-xs text-gray-400">{feed.description}</p>
                  {/* "Visit website" text — hidden by default, fades in when the user hovers */}
                  <div className="mt-3 flex items-center gap-1 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Visit website</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* LATEST THREATS LIST */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Latest Security Threats</h2>
          </div>
          
          {/* Ternary operator: if there are filtered threats, show them; otherwise show empty state */}
          {filteredThreats.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {/* Loop through filteredThreats and render one card per threat */}
              {filteredThreats.map((threat, index) => {
                const style = getCategoryStyle(threat.category);  // Get the visual style (icon + colors) for this threat's category
                const IconComponent = style.icon;   // Save the icon from style.icon into IconComponent so it can be displayed in React.
                
                return (
                  <div 
                    key={threat.id} // Required unique key for list rendering in React
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    // Stagger the animation: each card fades in slightly after the previous one
                    // index * 0.05 = card 0 starts at 0s, card 1 at 0.05s, card 2 at 0.1s, etc.
                    style={{ animationDelay: `${index * 0.05}s`, animation: 'fadeInUp 0.5s ease-out' }}
                  >
                    <div className="p-6">
                      {/* ── TOP ROW: Category badge, source, country, time ── */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">

                        {/* Category badge — shows the icon and category name with matching colors */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${style.bgColor} ${style.textColor}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                          {threat.category}
                        </span>

                        {/* Source name — shows which website the article came from */}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {threat.source}
                        </span>

                        {/* Country badge */}
                        {threat.country && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {threat.country}
                          </span>
                        )}

                        {/* Timestamp — shows how long ago the article was published */}
                        <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                          <Calendar className="w-3 h-3" />
                          {formatDate(threat.pubDate)}
                        </span>
                      </div>
                      
                      <a 
                        href={threat.link}   //clicking it opens the original article in a new tab 
                        target="_blank"           // Open in new tab
                        rel="noopener noreferrer" // Security best practice
                        className="block group-hover:text-blue-600 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {threat.title}
                        </h3>
                      </a>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {threat.content}
                      </p>
                    
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-400">Trending in cybersecurity</span>
                        </div>
                        <a 
                          href={threat.link}  //opens the original article in a new tab
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                        >
                          Read full article
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-gray-400 mb-3">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No threats found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search term or category filter</p>
              <button //to clear all filters and show all threats again 
                onClick={() => {
                  setSearchTerm('');           // Clear the search input
                  setSelectedCategory('All');  
                }}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold">About This Dashboard</h4>
              </div>
              <p className="text-sm text-gray-300">
                Aggregates real-time cybersecurity threat intelligence from trusted sources including The Hacker News, Krebs on Security, CISA, and Bleeping Computer.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold">How to Use</h4>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Search for specific threats using keywords</li>
                <li>• Filter by threat category to focus on specific risks</li>
                <li>• Click on any feed source to visit the original website</li>
                <li>• Refresh data for latest updates</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <h4 className="font-semibold">Threat Categories</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-900/50 px-2 py-1 rounded">Data Breach</span>
                <span className="text-xs bg-yellow-900/50 px-2 py-1 rounded">Malware</span>
                <span className="text-xs bg-red-900/50 px-2 py-1 rounded">Ransomware</span>
                <span className="text-xs bg-purple-900/50 px-2 py-1 rounded">Phishing</span>
                <span className="text-xs bg-green-900/50 px-2 py-1 rounded">Government Advisory</span>
              </div>
            </div>
          </div>
        </div>
        
      </main>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;              /* Start invisible */
            transform: translateY(20px); /* Start 20px below the final position */
          }
          to {
            opacity: 1; /* End fully visible */
            transform: translateY(0);    /* End at the normal position */
          }
        }
      `}</style>
    </div>
  );
}

// This line makes the App component available to be used by other files.
export default App;