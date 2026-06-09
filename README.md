# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


# Cyber News & Threat Monitor

> A real-time cybersecurity threat intelligence dashboard built with React and TypeScript.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Objectives](#project-objectives)
3. [Development Journey](#development-journey)
4. [Technologies Used](#technologies-used)
5. [Packages Installed](#packages-installed)
6. [Project Structure](#project-structure)
7. [How the Application Works](#how-the-application-works)
8. [Data Flow](#data-flow)
9. [RSS Feeds](#rss-feeds)
10. [CORS](#cors)
11. [Proxy Server Explanation](#proxy-server-explanation)
12. [Code Explanation](#code-explanation)
13. [Important Terms and Abbreviations](#important-terms-and-abbreviations)
14. [Challenges Faced](#challenges-faced)
15. [Features Implemented](#features-implemented)
16. [How To Run The Project](#how-to-run-the-project)
17. [Supervisor Presentation Guide](#supervisor-presentation-guide)
18. [Possible Supervisor Questions and Answers](#possible-supervisor-questions-and-answers)
19. [Lessons Learned](#lessons-learned)
20. [Future Improvements](#future-improvements)

---

## Project Overview

### What is this application?

The **Cyber News & Threat Monitor** is a web-based dashboard that collects, displays, and organizes the latest cybersecurity news and threat reports from well-known and trusted security websites. It gives users a single place to view and understand what kinds of cyber threats are happening around the world right now.

Think of it like a **news aggregator**, but instead of showing general news, it focuses only on cybersecurity threats such as data breaches, malware attacks, ransomware, phishing, and government security advisories.

### Why was it built?

Cybersecurity threats are increasing every day. Security professionals, IT teams, students, and everyday users need to stay updated. However, finding this information usually means visiting many different websites one by one. This application solves that problem by bringing all the important information together into one organized, easy-to-read dashboard.

### The Problem It Solves

- **Problem:** Cybersecurity news is scattered across many websites, making it hard to monitor all at once.
- **Solution:** This dashboard collects articles from multiple trusted cybersecurity sources and presents them in one clean interface, organized by category, searchable, and filterable.

### Who is this for? (Target Users)

- Cybersecurity students and researchers
- IT professionals and system administrators
- Software developers who need to stay aware of current threats
- Business owners who want to protect their digital assets
- Anyone who wants to stay informed about online threats

---

## Project Objectives

The goals of this project are:

1. **Aggregate Cybersecurity News** – Collect threat news from multiple reliable sources in one place.
2. **Categorize Threats** – Automatically label threats as Data Breach, Malware, Ransomware, Phishing, or Government Advisory.
3. **Enable Filtering** – Allow users to filter threats by category or search by keyword.
4. **Visualize Data** – Show a bar chart of threat distribution by category so users can see patterns at a glance.
5. **Display Statistics** – Show summary cards including total threats, most common threat type, number of categories, and number of feed sources.
6. **Link to Original Articles** – Let users click through to read full articles on the source website.
7. **Show Feed Sources** – Display where the data comes from with links to visit those websites.
8. **Use a Proxy Server** – Solve the CORS problem that prevents a browser from directly fetching RSS data from other websites.
9. **Build with Modern Technology** – Practice using React, TypeScript, and Tailwind CSS in a real-world project.

---

## Development Journey

Here is a step-by-step explanation of how this project was built, based on the actual project files.

### Step 1: Created the React Project with TypeScript

The project was started using the official Create React App tool with the TypeScript template. This command was used in the terminal:

```bash
npx create-react-app cyber-news-monitor --template typescript
```

This command:
- Created a new folder called `cyber-news-monitor`
- Set up React automatically
- Configured TypeScript so the project uses `.tsx` and `.ts` files instead of `.js`
- Created the default files: `App.tsx`, `index.tsx`, `App.css`, `index.css`, `App.test.tsx`

Evidence in files: `package.json` shows `"react-scripts": "^5.0.1"` and TypeScript as a dependency. The `tsconfig.json` confirms TypeScript is configured. `index.tsx` and `App.tsx` exist as TypeScript/React files.

---

### Step 2: Installed Required Packages

After creating the project, extra packages were installed. Looking at `package.json`, the following were added:

```bash
npm install @tanstack/react-query date-fns lucide-react recharts rss-parser axios
npm install --save-dev tailwindcss postcss autoprefixer @types/node
```

Each package serves a specific role in the application (explained in detail in the [Packages Installed](#packages-installed) section).

---

### Step 3: Configured Tailwind CSS

Tailwind CSS was set up for styling the dashboard. Three files were created or modified:

**`tailwind.config.js`** – Tells Tailwind where to look for class names:
```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**`postcss.config.js`** – Tells PostCSS to use Tailwind and Autoprefixer:
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**`index.css`** – The three Tailwind directives were added at the top of the global CSS file:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Step 4: Built the Dashboard UI in App.tsx

The main application interface was built inside `App.tsx`. This includes:

- The top navigation header with the project name and refresh button
- Four summary stat cards (Total Threats, Most Common, Categories, Feed Sources)
- A search bar and category dropdown filter
- Category pill buttons for quick filtering
- A threat distribution bar chart
- A feed sources section showing the 4 monitored websites
- A list of threat news cards with category icons, source names, country badges, and links

---

### Step 5: Added Hardcoded Real Cybersecurity News Data

Because direct RSS fetching from a browser causes CORS issues (explained later), the application uses hardcoded real-world cybersecurity news items inside `App.tsx`. These are stored as an array called `realThreats`. The 6 news entries contain real titles, real links to the actual articles, real content summaries, real source names, and realistic publication times calculated from `Date.now()`.

---

### Step 6: Added Filtering Logic

Two filtering features were implemented:
- **Keyword search** – Users type in the search box and the list filters in real time
- **Category filter** – Users choose a category from a dropdown or click a category pill button

The filtering logic runs in a variable called `filteredThreats` which re-calculates every time the user changes the search term or selected category.

---

### Step 7: Added Category Distribution Chart

A visual progress-bar style chart was built using plain HTML and Tailwind CSS. For each of the 5 threat categories, it shows:
- The category icon
- The category name
- The count of threats and percentage
- A colored horizontal progress bar

Note: While `recharts` is listed in `package.json` as a dependency, the actual chart rendered in the current version of `App.tsx` uses custom HTML/CSS progress bars, not the Recharts library components.

---

### Step 8: Created the Proxy Server

A file called `proxy-server.js` was created separately from React. This is a simple Node.js/Express server that runs alongside the React app and helps the browser fetch RSS data from external websites without getting blocked by CORS restrictions.

---

### Step 9: Typed the Project with TypeScript

TypeScript interfaces and types were defined in `App.tsx`:
- `Threat` interface – Describes the shape of each threat news item
- `ThreatCategory` type – Lists all allowed category values as a union type

This gives the project type safety and makes it easier to catch bugs during development.

---

## Technologies Used

### 1. React (v19.2.7)

- **Full Name:** React
- **What it is:** React is a JavaScript library created by Facebook (now Meta) for building user interfaces. It allows developers to build web pages as a collection of reusable pieces called **components**.
- **Why it was used:** React makes it easy to create dynamic, interactive dashboards. When the user types in the search box, the list updates immediately without reloading the page. This is called a **Single Page Application (SPA)** behavior.
- **How it helps:** It handles all the UI rendering. Every button, card, chart, and input field on the dashboard is a React component.

---

### 2. TypeScript (v4.9.5)

- **Full Name:** TypeScript
- **What it is:** TypeScript is a programming language that adds **type safety** to JavaScript. It was created by Microsoft. TypeScript code is compiled (converted) into plain JavaScript before running in the browser.
- **Why it was used:** It prevents common mistakes. For example, if you accidentally try to pass a number where a string is expected, TypeScript will show an error immediately during development, before you even run the app.
- **How it helps:** The `Threat` interface and `ThreatCategory` type in `App.tsx` ensure all threat data has the correct structure, reducing bugs.

---

### 3. Tailwind CSS (v3.4.19)

- **Full Name:** Tailwind CSS
- **What it is:** Tailwind CSS is a utility-first CSS framework. Instead of writing custom CSS rules in a separate file, you apply small pre-built CSS classes directly in your HTML/JSX code.
- **Why it was used:** It speeds up styling dramatically. Classes like `bg-white`, `rounded-xl`, `shadow-md`, `text-gray-800`, `hover:shadow-xl` are applied directly to elements.
- **How it helps:** The entire dashboard visual design — colors, spacing, shadows, rounded corners, hover effects — is achieved using Tailwind classes without writing a single line of custom CSS (apart from a fade animation in the style tag).

---

### 4. Node.js

- **Full Name:** Node.js
- **What it is:** Node.js is a runtime environment that allows JavaScript to run on a server (outside of a browser). Normally, JavaScript only runs inside web browsers. Node.js allows it to run on your computer like Python or Java.
- **Why it was used:** The proxy server (`proxy-server.js`) is a Node.js script. It runs as a separate backend server on your computer.
- **How it helps:** Without Node.js, you cannot run `proxy-server.js`.

---

### 5. Express.js

- **Full Name:** Express.js
- **What it is:** Express is a Node.js framework that makes it simple to create web servers and define URL routes (paths that the server responds to).
- **Why it was used:** The proxy server uses Express to listen for incoming requests from the React app and respond with RSS feed data.
- **How it helps:** The single line `app.get('/api/rss', ...)` defines the route that the React app calls to get RSS feed content.

---

### 6. Axios (v1.17.0)

- **Full Name:** Axios
- **What it is:** Axios is a JavaScript library used to make HTTP requests (fetching data from URLs).
- **Why it was used:** The proxy server uses Axios to fetch the RSS feed from external websites. It was chosen because it is simple to use and handles errors gracefully.
- **How it helps:** When the proxy server receives a request with a URL, Axios fetches that URL and sends the content back to the React app.

---

### 7. Lucide React (v1.17.0)

- **Full Name:** Lucide React
- **What it is:** Lucide React is a collection of clean, open-source icons designed specifically for use in React applications.
- **Why it was used:** The dashboard uses many icons to make the interface more visual and intuitive — a shield icon for security, a bug icon for malware, a skull for ransomware, etc.
- **How it helps:** Icons like `Shield`, `Bug`, `Skull`, `Mail`, `Database`, `Search`, `RefreshCw`, `TrendingUp`, `ExternalLink`, `Filter`, `Globe`, `Calendar`, `BarChart3`, `Activity`, `ChevronRight`, `AlertCircle`, `Newspaper`, `Award`, and `Eye` are all used throughout the dashboard.

---

### 8. React Query / TanStack Query (v5.101.0)

- **Full Name:** TanStack React Query (formerly React Query)
- **What it is:** React Query is a library for managing how your React app fetches, caches, and updates data from a server or API.
- **Why it was installed:** It was installed as part of the project setup in preparation for live RSS data fetching.
- **How it helps:** While the current version uses hardcoded data in `App.tsx`, React Query is ready to be used when the app is upgraded to fetch live data from the proxy server.

---

### 9. date-fns (v4.4.0)

- **Full Name:** date-fns (Date Functions)
- **What it is:** date-fns is a JavaScript library for working with dates easily — formatting, comparing, calculating differences between dates.
- **Why it was installed:** It was installed in preparation for formatting publication dates from RSS feed entries.
- **How it helps:** The current date formatting logic in `App.tsx` uses a custom `formatDate()` function (plain JavaScript), but date-fns provides more powerful and reliable date utilities that can be used in future versions.

---

### 10. rss-parser (v3.13.0)

- **Full Name:** rss-parser
- **What it is:** rss-parser is a Node.js library that takes raw RSS XML data (the format that news websites publish their articles in) and converts it into a clean JavaScript object that is easy to work with.
- **Why it was installed:** It is required for reading and processing RSS feeds from cybersecurity news websites.
- **How it helps:** When the proxy server fetches RSS content from a site like The Hacker News, rss-parser will convert the raw XML into organized JavaScript objects with fields like `title`, `link`, `pubDate`, and `content`.

---

### 11. PostCSS (v8.5.15) + Autoprefixer (v10.5.0)

- **Full Name:** PostCSS (Post CSS) and Autoprefixer
- **What it is:** PostCSS is a tool that processes CSS files and transforms them using plugins. Autoprefixer is one such plugin — it automatically adds browser-specific CSS prefixes (like `-webkit-` or `-moz-`) so your styles work across all browsers.
- **Why it was used:** Tailwind CSS requires PostCSS to work. Autoprefixer ensures styles display correctly in older browsers.
- **How it helps:** Without these, Tailwind CSS would not compile into actual CSS that browsers can read.

---

## Packages Installed

This section lists every package from `package.json` with a full explanation.

### Production Dependencies (`dependencies`)

| Package | Version | What it does | Where it is used |
|---|---|---|---|
| `react` | ^19.2.7 | The core React library for building UI components | `App.tsx`, `index.tsx` |
| `react-dom` | ^19.2.7 | Allows React to render components into the real HTML DOM | `index.tsx` |
| `typescript` | ^4.9.5 | Adds type safety to JavaScript | All `.tsx` files |
| `react-scripts` | ^5.0.1 | Build tools for Create React App (start, build, test) | `package.json` scripts |
| `@tanstack/react-query` | ^5.101.0 | Data fetching and caching for React | Installed, ready for live RSS fetching |
| `axios` | ^1.17.0 | Makes HTTP requests to fetch URLs | `proxy-server.js` |
| `lucide-react` | ^1.17.0 | Icon components for React | `App.tsx` – 18 different icons used |
| `recharts` | ^3.8.1 | Chart library for React | Installed, bar progress chart uses custom HTML |
| `rss-parser` | ^3.13.0 | Parses RSS XML feeds into JavaScript objects | Ready for live RSS parsing |
| `date-fns` | ^4.4.0 | Date formatting and manipulation | Installed, custom `formatDate()` in `App.tsx` |
| `web-vitals` | ^2.1.4 | Measures web performance (loading speed, etc.) | Default Create React App inclusion |
| `@testing-library/react` | ^16.3.2 | Utilities for testing React components | `App.test.tsx` |
| `@testing-library/jest-dom` | ^6.9.1 | Custom matchers for testing DOM elements | `App.test.tsx` |
| `@testing-library/dom` | ^10.4.1 | Core DOM testing utilities | Used by react testing library |
| `@testing-library/user-event` | ^13.5.0 | Simulates user interactions in tests | Available for testing |
| `@types/react` | ^19.2.16 | TypeScript type definitions for React | Enables TypeScript in `.tsx` files |
| `@types/react-dom` | ^19.2.3 | TypeScript type definitions for React DOM | Enables TypeScript with ReactDOM |
| `@types/jest` | ^27.5.2 | TypeScript type definitions for Jest testing | `App.test.tsx` |

### Development Dependencies (`devDependencies`)

| Package | Version | What it does | Where it is used |
|---|---|---|---|
| `tailwindcss` | ^3.4.19 | CSS framework using utility classes | All styling in `App.tsx` |
| `postcss` | ^8.5.15 | CSS processing pipeline | `postcss.config.js` |
| `autoprefixer` | ^10.5.0 | Adds browser-vendor CSS prefixes automatically | `postcss.config.js` |
| `@types/node` | ^25.9.1 | TypeScript types for Node.js | `proxy-server.js`, project config |

> Note: `express` and `cors` packages are used in `proxy-server.js` but are not listed in `package.json`. They need to be installed separately with: `npm install express cors`

---

## Project Structure

```
cyber-news-monitor/
│
├── public/                        # Static files served directly to browser
│   └── index.html                 # The single HTML file React loads into
│
├── src/                           # All React source code lives here
│   ├── App.tsx                    # ⭐ MAIN FILE – The entire dashboard UI and logic
│   ├── App.css                    # Basic CSS (mostly unused, Tailwind handles styling)
│   ├── App.test.tsx               # Automated tests for App component
│   ├── index.tsx                  # Entry point – mounts React into the HTML page
│   └── index.css                  # Global CSS with Tailwind directives
│
├── proxy-server.js                # 🔌 Separate Node.js server to bypass CORS
├── package.json                   # Project info, dependencies, and scripts
├── package-lock.json              # Exact locked versions of all installed packages
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration (required for Tailwind)
├── tsconfig.json                  # TypeScript compiler configuration
└── README.md                      # This documentation file
```

### Explanation of Important Files and Folders

**`src/App.tsx`** – This is the most important file in the project. It contains:
- All TypeScript type definitions
- All hardcoded threat data
- All filtering logic
- All chart calculation logic
- The entire rendered user interface

**`src/index.tsx`** – This is the entry point of the React application. It takes the `App` component and "mounts" it into the HTML element with `id="root"` in `public/index.html`. This is how React takes control of the web page.

**`src/index.css`** – Contains the three Tailwind CSS import lines (`@tailwind base; @tailwind components; @tailwind utilities;`) plus basic font styling for the whole app.

**`src/App.css`** – Contains the default Create React App styles. These are mostly unused because Tailwind handles all styling, but the file is kept from the original project setup.

**`src/App.test.tsx`** – Contains one automated test. It checks whether the words "learn react" appear on the screen. This is the default test from Create React App and would need to be updated to test the actual dashboard.

**`proxy-server.js`** – A completely separate Node.js server. It is NOT part of React. It runs as its own process on port 3001 and acts as a middleman between the React app and external RSS feed websites.

**`package.json`** – The project's identity card. It lists the project name (`cyber-news-monitor`), version, all dependencies, and available commands (`npm start`, `npm run build`, etc.).

**`package-lock.json`** – Automatically generated by npm. It records the exact version of every package and sub-package installed. This ensures that if someone else installs the project on a different computer, they get the exact same package versions.

**`tailwind.config.js`** – Tells Tailwind to scan all `.ts`, `.tsx`, `.js`, and `.jsx` files in the `src/` folder for Tailwind class names.

**`postcss.config.js`** – Tells PostCSS to process CSS using the Tailwind and Autoprefixer plugins.

**`tsconfig.json`** – Configures how TypeScript compiles the code. Important settings include targeting ES5 output, enabling strict type checking, allowing JSX in `.tsx` files, and including the `src/` directory.

---

## How the Application Works

Here is the complete workflow from start to finish:

```
User opens the browser and goes to http://localhost:3000
            ↓
Browser loads public/index.html (the single HTML page)
            ↓
index.html loads the React JavaScript bundle
            ↓
src/index.tsx runs
            ↓
ReactDOM.createRoot() finds the <div id="root"> element in index.html
            ↓
The App component from App.tsx is rendered inside that div
            ↓
App() function runs:
  - realThreats array is defined (6 cybersecurity news items)
  - feedSources array is defined (4 source websites)
  - useState hooks set up: searchTerm = '', selectedCategory = 'All'
  - filteredThreats is calculated (all 6 threats initially)
  - Statistics are calculated (totalThreats, categoryCounts, mostCommonCategory)
            ↓
The JSX (UI code) is rendered:
  - Header with title, timestamp, total threats count, and Refresh button
  - 4 Stats Cards (Total Threats, Most Common, Categories, Feed Sources)
  - Search bar + Category dropdown filter + Category pill buttons
  - Threat Distribution chart (progress bars per category)
  - Feed Sources grid (4 clickable source cards)
  - Latest Security Threats list (filtered threat cards)
  - Footer information panel
            ↓
User interacts:
  - Types in search → searchTerm state updates → filteredThreats recalculates → UI re-renders
  - Clicks category pill → selectedCategory state updates → filteredThreats recalculates → UI re-renders
  - Clicks "Refresh Data" → window.location.reload() → page reloads
  - Clicks "Read full article" → opens original article in a new browser tab
  - Clicks a feed source card → opens the source website in a new browser tab
  - Clears filters → both states reset to '' and 'All' → all 6 threats show again
```

---

## Data Flow

```
[Hardcoded Data in App.tsx]
        ↓
realThreats array (6 Threat objects)
        ↓
filteredThreats = realThreats.filter(...)
  - Checks: does title or content include searchTerm?
  - Checks: does category match selectedCategory?
        ↓
categoryCounts = computed from realThreats (not filteredThreats)
  - For each category: count how many threats belong to it
  - Calculate percentage of total
        ↓
mostCommonCategory = the category with the highest count
        ↓
React renders UI using all this processed data:
  - Stats cards use: totalThreats, mostCommonCategory, categories.length, feedSources.length
  - Chart uses: categoryCounts array
  - Feed sources section uses: feedSources array
  - Threats list uses: filteredThreats array
```

### How the Proxy Server Fits Into the Data Flow

The proxy server (`proxy-server.js`) is a separate service that was created to support live RSS fetching. Here is how it fits in:

```
[React App (port 3000)]
        ↓  sends HTTP GET request to:
        ↓  http://localhost:3001/api/rss?url=https://feeds.feedburner.com/TheHackersNews
        ↓
[Proxy Server (port 3001)]
        ↓  receives the request
        ↓  extracts the ?url parameter
        ↓  uses Axios to fetch that URL directly (server-to-server, no CORS block)
        ↓  receives the RSS XML response
        ↓  sends the XML back to React
        ↓
[React App]
        ↓  receives the XML
        ↓  rss-parser converts XML to JavaScript object
        ↓  data is displayed in the dashboard
```

---

## RSS Feeds

### What does RSS stand for?

**RSS** stands for **Really Simple Syndication** (sometimes also called **Rich Site Summary**).

### What is RSS?

RSS is a standard format that websites use to automatically share their latest published content. When a news website publishes a new article, it is automatically added to that site's RSS feed. The RSS feed is a special file in XML format (a structured text format) that is publicly available at a specific URL.

Think of RSS like a **subscription newspaper delivery service**. Instead of going to the newspaper stand every day to check for new editions, the latest edition is automatically delivered to you.

### How RSS works:

1. A website (e.g., The Hacker News) publishes a new article.
2. The article is automatically added to the RSS feed file at a URL like: `https://feeds.feedburner.com/TheHackersNews`
3. Any application that knows this URL can fetch it to get the latest articles.
4. The RSS feed contains structured data: article title, link, publication date, summary.

### How this application uses RSS feeds

The application was designed to fetch RSS feeds from 4 trusted cybersecurity sources. The `feedSources` array in `App.tsx` defines the 4 monitored sources:

1. **The Hacker News** – `https://thehackernews.com` – Breaking cybersecurity news and analysis
2. **Krebs on Security** – `https://krebsonsecurity.com` – In-depth security investigations by journalist Brian Krebs
3. **CISA Advisories** – `https://www.cisa.gov` – Official U.S. Government cybersecurity alerts from the Cybersecurity and Infrastructure Security Agency
4. **Bleeping Computer** – `https://www.bleepingcomputer.com` – Technical security news

In the current version of the app, the news data is hardcoded directly in the `realThreats` array with content taken from actual articles on these websites. The proxy server exists to enable live RSS fetching in a future version.

---

## CORS

### What does CORS stand for?

**CORS** stands for **Cross-Origin Resource Sharing**.

### What is an "origin"?

An **origin** is the combination of three things: the **protocol** (http or https), the **domain** (like thehackernews.com), and the **port** (like 3000 or 443).

For example:
- `http://localhost:3000` is one origin (your React app)
- `https://thehackernews.com` is a different origin

### Why does CORS exist?

CORS is a security policy built into web browsers. It prevents a web page from making requests to a different domain without permission. This protects users from malicious websites that might try to secretly read data from banking sites or other services they are logged into.

**Example:** A malicious website cannot silently send a request to your bank's server using your login session. The browser's CORS policy blocks it.

### Why did this project encounter CORS issues?

When the React app (running at `http://localhost:3000`) tries to directly fetch an RSS feed from `https://thehackernews.com`, the browser blocks the request. This is because `localhost:3000` and `thehackernews.com` are different origins, and The Hacker News does not grant cross-origin permission to random websites.

The browser checks: *"Does thehackernews.com allow requests from localhost:3000?"* — The answer is **no**. So the browser blocks the request and shows a CORS error in the console.

### How proxy-server.js solves the problem

The proxy server bypasses CORS because CORS is a **browser restriction**, not a **server restriction**. When two servers communicate with each other (server-to-server), CORS does not apply.

Here is the logic:

- **Browser → Browser:** Blocked by CORS ❌
- **Browser → Your Proxy Server:** Allowed ✅ (same localhost, CORS headers set)
- **Your Proxy Server → External Website:** Allowed ✅ (server-to-server, no CORS)

So the solution is: the React app asks the proxy server (which is on the same computer, `localhost:3001`), and the proxy server fetches the external website on behalf of the React app.

---

## Proxy Server Explanation

### The file: `proxy-server.js`

```js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/rss', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});
```

### Line-by-line explanation:

- `const express = require('express');` – Imports the Express framework.
- `const cors = require('cors');` – Imports the `cors` package that will add the permission headers to the response.
- `const axios = require('axios');` – Imports Axios to make HTTP requests to external websites.
- `const app = express();` – Creates the Express application.
- `app.use(cors());` – Allows all origins to make requests to this server. This means the React app at `localhost:3000` is allowed to call `localhost:3001`.
- `app.get('/api/rss', ...)` – Defines a route: when someone makes a GET request to `/api/rss`, run this function.
- `const url = req.query.url;` – Reads the `url` query parameter from the request (e.g., `?url=https://...`).
- `if (!url) return res.status(400).json(...)` – If no URL was provided, send back an error.
- `const response = await axios.get(url);` – Uses Axios to fetch the RSS feed from the provided URL.
- `res.send(response.data);` – Sends the fetched RSS content back to whoever made the request (the React app).
- `app.listen(3001, ...)` – Starts the server on port 3001 and prints a confirmation message.

### Why it is needed

Without the proxy server, the browser blocks direct RSS fetches due to CORS. The proxy server is the middleman that solves this problem.

---

## Code Explanation

### App.tsx – Complete Analysis

#### Imports (Lines 1–7)

```tsx
import React, { useState } from 'react';
import { Search, RefreshCw, TrendingUp, Shield, AlertCircle,
  ExternalLink, Filter, Calendar, Newspaper, Globe,
  ChevronRight, Activity, BarChart3, Database, Bug,
  Skull, Mail, Award, Eye } from 'lucide-react';
```

- `React` – Required to write JSX (HTML-like code in JavaScript).
- `useState` – A React **hook** that creates a state variable. When a state variable changes, React re-renders the component automatically.
- The long list of icon names from `lucide-react` – These are all the icons used in the dashboard.

---

#### TypeScript Type Definitions (Lines 9–26)

```tsx
interface Threat {
  id: string;
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
```

**`interface Threat`** – This is a TypeScript blueprint. It says: "Every threat object MUST have an `id` (string), `title` (string), `link` (string), `pubDate` (string), `content` (string), `category` (a ThreatCategory), and `source` (string). It may optionally have a `country` (string) — the `?` means it is optional."

**`type ThreatCategory`** – This is a **union type**. It means the `category` field can only be one of these 5 exact values. If you try to use any other string like `'Virus'`, TypeScript will give you an error.

---

#### State Variables (Lines 30–31)

```tsx
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState<ThreatCategory | 'All'>('All');
```

- `searchTerm` – Stores what the user has typed in the search box. Starts as an empty string `''`.
- `setSearchTerm` – A function that updates `searchTerm`. Called every time the user types.
- `selectedCategory` – Stores which category the user has selected. Starts as `'All'`.
- `setSelectedCategory` – A function that updates `selectedCategory`.

Every time `setSearchTerm` or `setSelectedCategory` is called, React automatically re-renders the component with the new values, updating what is shown on screen.

---

#### Threat Data (Lines 34–95)

The `realThreats` array contains 6 hardcoded `Threat` objects. Each represents a real cybersecurity news story with:
- A unique `id`
- A real `title`
- A real `link` to the original article
- A `pubDate` calculated from `Date.now()` minus hours (to simulate news published recently)
- A `content` summary
- A `category` (one of the 5 ThreatCategory values)
- A `source` name
- A `country` where the threat originated or was reported

---

#### Feed Sources (Lines 97–127)

The `feedSources` array defines the 4 monitored cybersecurity news websites. Each has:
- `name` – Display name
- `url` – The website URL (used to link to the site when clicked)
- `category` – Type of source
- `description` – Brief description
- `color` – Tailwind gradient class for the card's visual accent

---

#### Filtering Logic (Lines 129–138)

```tsx
const filteredThreats = realThreats.filter(threat => {
  const matchesSearch = searchTerm === '' ||
    threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    threat.content.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory = selectedCategory === 'All' || threat.category === selectedCategory;

  return matchesSearch && matchesCategory;
});
```

This creates a new array of only the threats that match both conditions:
- **matchesSearch:** If the search box is empty, all threats pass. If not empty, the threat must have the search term in its title or content (case-insensitive using `.toLowerCase()`).
- **matchesCategory:** If 'All' is selected, all threats pass. Otherwise, only threats matching the selected category pass.
- **Both must be true** (`&&`) for a threat to appear in the filtered list.

---

#### Statistics Calculations (Lines 140–151)

```tsx
const totalThreats = realThreats.length; // 6
const categories = ['Data Breach', 'Malware', 'Ransomware', 'Phishing', 'Government Advisory'];
const categoryCounts = categories.map(cat => ({
  name: cat,
  count: realThreats.filter(t => t.category === cat).length,
  percentage: (realThreats.filter(t => t.category === cat).length / totalThreats) * 100
}));

const mostCommonCategory = categoryCounts.reduce((max, curr) =>
  curr.count > max.count ? curr : max, categoryCounts[0]
);
```

- `totalThreats` – Simply the length of the `realThreats` array.
- `categoryCounts` – For each of the 5 categories, calculates how many threats belong to it and what percentage of the total that represents.
- `mostCommonCategory` – Uses `reduce()` to find whichever category object has the highest `count`. Displayed in the second stats card.

---

#### getCategoryStyle Function (Lines 153–169)

This function takes a category name and returns an object with:
- `icon` – The icon component to use (e.g., `Bug` for Malware)
- `bgColor` – Background color Tailwind class
- `textColor` – Text color Tailwind class
- `borderColor` – Border color Tailwind class

This is used both in the chart section and in each threat card to give each category its own visual identity.

---

#### formatDate Function (Lines 171–179)

```tsx
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
};
```

Takes an ISO date string and converts it to a human-readable relative time:
- Less than 1 hour → "Just now"
- Less than 24 hours → "X hours ago"
- 24+ hours → "X days ago"

---

#### JSX (Rendered UI) – Lines 182–575

The `return` statement contains all the HTML-like JSX code that React will render. Key sections:

1. **Header** – Dashboard title, shield icon, last updated time, total threats count, Refresh button.
2. **Stats Cards Grid** – 4 cards: Total Threats, Most Common Category, Number of Categories, Number of Feed Sources.
3. **Search and Filter Section** – Text input box (updates `searchTerm`), category dropdown (updates `selectedCategory`), category pill buttons, a results count message when searching.
4. **Category Distribution Chart** – Progress bars for each of the 5 categories using `categoryCounts` data.
5. **Feed Sources Grid** – 4 clickable cards that open the source website in a new tab.
6. **Latest Threats List** – Maps over `filteredThreats` to render one card per threat. Shows category badge with icon, source name, country, time, title (as a link), content summary, and "Read full article" link. If no results, shows a friendly empty state with a "Clear All Filters" button.
7. **Footer Panel** – Three-column info section: About the dashboard, how to use it, and a list of threat categories.
8. **Animation Style** – A `<style>` tag injects the `fadeInUp` CSS animation used on threat cards.

---

## Important Terms and Abbreviations

| Term | Full Meaning | Definition | Importance in this Project |
|---|---|---|---|
| **RSS** | Really Simple Syndication | A standard format for websites to publish their content as a feed | Used to collect cybersecurity news from multiple sources |
| **CORS** | Cross-Origin Resource Sharing | A browser security policy that restricts requests to different domains | The main reason the proxy server was built |
| **API** | Application Programming Interface | A set of rules for how two applications talk to each other | The proxy server exposes an API endpoint at `/api/rss` |
| **HTTP** | HyperText Transfer Protocol | The protocol for transferring data on the web | Used by the React app to call the proxy server |
| **HTTPS** | HTTP Secure | HTTP with encryption for secure data transfer | Used by the proxy server to fetch external RSS feeds |
| **URL** | Uniform Resource Locator | A web address (e.g., https://thehackernews.com) | RSS feed URLs are passed to the proxy server |
| **JSON** | JavaScript Object Notation | A lightweight format for storing and transporting data | Used in proxy-server.js error responses |
| **XML** | eXtensible Markup Language | A structured text format used by RSS feeds | RSS feeds are delivered as XML, parsed by rss-parser |
| **JSX** | JavaScript XML | A syntax extension for JavaScript that allows HTML-like code inside JavaScript | Used throughout App.tsx to write the UI |
| **TSX** | TypeScript XML | JSX but in TypeScript files | App.tsx and index.tsx use TSX |
| **DOM** | Document Object Model | The browser's representation of an HTML page as a tree structure | React manipulates the DOM to update the UI |
| **UI** | User Interface | What the user sees and interacts with | The entire visual dashboard |
| **UX** | User Experience | How the user feels when using the application | Considered through hover effects, transitions, loading states |
| **SPA** | Single Page Application | A web app that loads one HTML page and dynamically updates content | This React app is an SPA |
| **NPM** | Node Package Manager | A tool for installing JavaScript packages/libraries | Used to install all project dependencies |
| **NPX** | Node Package Execute | Runs a Node.js package without installing it permanently | Used in `npx create-react-app` |
| **Node.js** | Node JavaScript Runtime | JavaScript runtime for running JS on a server | Runs proxy-server.js |
| **React Query** | (No acronym) | Library for data fetching and state management in React | Installed for future live RSS fetching |
| **TypeScript** | (No acronym) | JavaScript with static type definitions | Used throughout the project |
| **Props** | Properties | Data passed from a parent component to a child component | Used throughout JSX to pass data |
| **State** | (No acronym) | Dynamic data inside a component that causes re-renders when changed | `searchTerm` and `selectedCategory` are state variables |
| **Hook** | (No acronym) | Special React functions that let you use features like state inside function components | `useState` is a hook used in App.tsx |
| **CISA** | Cybersecurity and Infrastructure Security Agency | U.S. government agency that publishes official security advisories | One of the 4 monitored feed sources |
| **DoS** | Denial of Service | A cyber attack that overwhelms a server until it crashes | Category: Phishing (HTTP/2 Bomb story in the data) |
| **ATG** | Automatic Tank Gauge | Industrial control system for fuel tank monitoring | Referenced in the CISA advisory news item |
| **AWS** | Amazon Web Services | Cloud computing platform by Amazon | Referenced in the CISA credential leak news item |
| **npm** | Node Package Manager | Tool that installs packages listed in package.json | `npm install`, `npm start` |

---

## Challenges Faced

### Challenge 1: CORS Restrictions

**Problem:** When the React app tried to directly fetch RSS feeds from external websites (like The Hacker News), the browser blocked the request with a CORS error. The browser does not allow a web page at `localhost:3000` to fetch resources from `thehackernews.com` unless that site explicitly permits it.

**Solution:** A separate Node.js + Express proxy server (`proxy-server.js`) was built. The React app sends its request to `localhost:3001/api/rss?url=...`, and the proxy server fetches the actual RSS feed server-to-server (which has no CORS restriction) and returns the data to React.

---

### Challenge 2: RSS Parsing – Converting XML to Usable Data

**Problem:** RSS feeds are delivered as XML — a structured but complex text format. JavaScript does not natively understand XML in the same clean way it handles JSON.

**Solution:** The `rss-parser` library was installed. It takes raw RSS XML text and converts it into a clean JavaScript object with named properties like `title`, `link`, `pubDate`, `content`, and `items`. This makes it easy to display each article.

---

### Challenge 3: TypeScript Typing

**Problem:** TypeScript requires every variable, function parameter, and return value to have a clearly defined type. This can feel restrictive for beginners but is actually very helpful.

**Solution:** The `Threat` interface and `ThreatCategory` union type were defined at the top of `App.tsx`. The `useState` hook was typed with generics (e.g., `useState<ThreatCategory | 'All'>('All')`). `tsconfig.json` was configured with `"strict": true` to enforce full type checking.

---

### Challenge 4: Category Classification

**Problem:** RSS feed articles do not come with cybersecurity category labels. A news article about a bank hack does not say "Data Breach" — you have to figure that out from the content.

**Solution:** In the current version, threat categories are assigned manually when the data is hardcoded in `realThreats`. For a live RSS version, a keyword-matching algorithm would be needed to automatically classify articles (e.g., if the title contains "ransomware" → category is "Ransomware").

---

### Challenge 5: Date Formatting

**Problem:** RSS feeds provide dates in ISO 8601 format (e.g., `2026-06-05T10:30:00.000Z`), which is not human-friendly.

**Solution:** A custom `formatDate()` function was written to calculate the difference between the article date and the current time, and return a friendly string like "2 hours ago" or "1 day ago".

---

### Challenge 6: Tailwind CSS Configuration

**Problem:** Tailwind CSS requires PostCSS and Autoprefixer to compile and must be told which files to scan for class names. Without proper configuration, Tailwind classes have no effect.

**Solution:** `tailwind.config.js` and `postcss.config.js` were properly configured. The three Tailwind directives were added to `index.css`.

---

## Features Implemented

1. **Dashboard Header** – Shows the application title ("Cyber News & Threat Monitor"), a Shield icon, the last updated time, total threat count, and a Refresh button.

2. **Summary Statistics Cards** – Four cards at the top:
   - Total Threats (total count of all threat items)
   - Most Common Threat (shows the category with the highest count)
   - Categories (number of distinct threat types tracked: 5)
   - Feed Sources (number of monitored news sources: 4)

3. **Keyword Search** – A search input box that filters threats in real time as the user types. Searches both the title and content of each threat.

4. **Category Filter Dropdown** – A dropdown menu allowing users to filter threats by a specific category (All, Data Breach, Malware, Ransomware, Phishing, Government Advisory).

5. **Category Pill Buttons** – Quick-click buttons below the search bar for each category. The active/selected category is highlighted in red.

6. **Clear Filters** – A "Clear Filters" button appears when a search term or category filter is active. Clicking it resets both filters. Also available inside each empty-state message.

7. **Search Results Count** – When a search term is active, a blue info box shows: "Found X threats matching 'keyword'".

8. **Threat Distribution Chart** – A visual bar chart showing how many threats belong to each category with colored progress bars and percentage labels.

9. **Feed Sources Section** – A grid of 4 clickable cards, each representing a monitored cybersecurity news source. Clicking opens the source website in a new browser tab.

10. **Latest Threats List** – A list of threat news cards, each displaying:
    - Category badge with color and icon
    - Source name with an Activity icon
    - Country badge (if available)
    - Time ago (using the `formatDate` function)
    - Article title (clickable link to original article)
    - Content summary
    - "Read full article" link

11. **Fade-In Animation** – Threat cards animate into view with a `fadeInUp` effect when the page loads.

12. **Empty State** – When no threats match the search/filter criteria, a friendly message is shown with a Search icon and a "Clear All Filters" button.

13. **Footer Information Panel** – Three-column footer with information about the dashboard, usage instructions, and a list of threat categories.

14. **Proxy Server (Backend)** – A Node.js/Express server that accepts RSS URLs and fetches them on behalf of the React app, solving the CORS problem.

15. **Responsive Design** – The layout adapts to different screen sizes. Stats cards stack on mobile and form a 4-column grid on larger screens. The header switches between stacked and side-by-side layout.

---

## How To Run The Project

Follow these steps carefully to run the project on your computer.

### Prerequisites

Make sure you have these installed on your computer:
- **Node.js** (version 14 or higher) – Download from: https://nodejs.org
- **npm** (comes with Node.js automatically)

### Step 1: Open Terminal / Command Prompt

Navigate to your project folder:

```bash
cd cyber-news-monitor
```

### Step 2: Install All Project Dependencies

```bash
npm install
```

This reads `package.json` and installs all listed packages into a `node_modules` folder. This may take a few minutes the first time.

### Step 3: Install Proxy Server Dependencies

The `proxy-server.js` uses `express` and `cors` which are not in the main `package.json`. Install them:

```bash
npm install express cors
```

### Step 4: Start the Proxy Server

Open a **new/separate terminal window** (keep this one running):

```bash
node proxy-server.js
```

You should see:
```
Proxy server running on http://localhost:3001
```

### Step 5: Start the React Application

In your **original terminal window**:

```bash
npm start
```

This will:
- Start the React development server
- Automatically open `http://localhost:3000` in your default browser
- Show the Cyber News & Threat Monitor dashboard

### Step 6: Use the Application

- The dashboard should load with all 6 threat items visible.
- Type in the search box to filter by keyword.
- Click a category pill or use the dropdown to filter by type.
- Click "Read full article" to open the original news article.
- Click any feed source card to visit that website.
- Click "Refresh Data" to reload the page.

### Other Available Commands

| Command | What it does |
|---|---|
| `npm start` | Starts the development server at localhost:3000 |
| `npm run build` | Creates an optimized production build in the `build/` folder |
| `npm test` | Runs the automated tests in `App.test.tsx` |
| `npm run eject` | (Irreversible) Exposes all Create React App config files |
| `node proxy-server.js` | Starts the proxy server at localhost:3001 |

---

## Supervisor Presentation Guide

### How I Can Explain This Project To My Supervisor

#### Simple One-Sentence Explanation

"I built a web-based cybersecurity dashboard that collects and displays the latest security threat news from four major cybersecurity websites, allowing users to search and filter threats by category in real time."

---

#### How data is collected

The application contains six real cybersecurity news items taken from trusted sources: The Hacker News, Krebs on Security, CISA, and Bleeping Computer. These news items are stored directly in the application as an array of JavaScript objects. Each item has a title, a link to the original article, a summary, a category, a source name, a country, and a publication date.

For the live version (with the proxy server), the application would send a request to a small helper server I built called a proxy server, which fetches the RSS feed from each website and returns the raw news data to the dashboard.

---

#### How the dashboard works

The dashboard is divided into sections:

- At the **top**, a header shows the application name, last updated time, and a refresh button.
- Below that, **four summary cards** show: total threats, the most common threat type, the number of categories, and the number of sources monitored.
- A **search box and filter controls** allow users to narrow down the news by typing a keyword or selecting a category.
- A **threat distribution chart** shows visually how the threats are spread across categories.
- A **feed sources section** shows which websites are being monitored, with links to visit each.
- The **main news list** shows each threat as a card with the article title, summary, source, and a "Read full article" button that opens the original article.

---

#### Why React was used

React is the industry standard for building interactive web dashboards. It re-renders only the parts of the page that change, which makes filtering and searching instant and smooth. React also uses components — reusable pieces of UI — which makes the code organized and maintainable.

---

#### Why TypeScript was used

TypeScript was used to make the code safer and more reliable. It enforces that every piece of data has the right shape. For example, the `Threat` interface guarantees that every news item always has a title, a link, a category, and other required fields. Without TypeScript, a small typo or missing field might only be discovered when the app crashes for a user.

---

#### Why a proxy server was needed

Web browsers have a built-in security rule called CORS — Cross-Origin Resource Sharing. This rule prevents a web page from directly fetching data from a different website without that website's permission. Since cybersecurity news sites like The Hacker News don't grant permission to random apps, the browser blocks the request.

The proxy server solves this by acting as a middleman. The React app asks the proxy server (which is on the same computer), and the proxy server fetches the external RSS feed on its behalf. There is no CORS restriction between two servers, so this works perfectly.



## Lessons Learned

A student who builds this project will learn:

1. **How to create a React project** using Create React App with TypeScript.
2. **How to use TypeScript interfaces and types** to define data structures and prevent bugs.
3. **How to use React hooks** — specifically `useState` — to manage dynamic, interactive state.
4. **How to filter and process arrays** using JavaScript's `filter()`, `map()`, and `reduce()` methods.
5. **What CORS is and why it exists** — a fundamental concept in web development.
6. **How to build a proxy server** using Node.js and Express to bypass CORS.
7. **How RSS feeds work** and how to programmatically access news from websites.
8. **How to style a dashboard with Tailwind CSS** including responsive layout, hover effects, and color utilities.
9. **How to configure PostCSS and Tailwind CSS** in a React project.
10. **How to format dates** and create human-readable relative time strings.
11. **How to organize a real-world project** with multiple technologies working together.
12. **How to link frontend (React) and backend (Node.js) applications** through HTTP API calls.
13. **How to use icon libraries** like Lucide React to improve UI design.
14. **How to build a responsive layout** that works on both mobile and desktop screens.
15. **How category classification logic works** and how to dynamically compute statistics from a data set.

---

## Future Improvements

The following improvements would make the application more powerful:

1. **Live RSS Fetching** – Connect the React app to the proxy server using React Query to fetch and display real-time news instead of hardcoded data.

2. **Automatic Category Detection** – Write a keyword-matching algorithm that reads the article title and content and automatically assigns the correct threat category (e.g., articles mentioning "ransom" → Ransomware).

3. **More Feed Sources** – Add more cybersecurity RSS feeds such as SecurityWeek, Dark Reading, Threatpost, and Schneier on Security.

4. **Real Recharts Integration** – Replace the custom HTML progress bar chart with a proper Recharts `BarChart` or `PieChart` component for richer data visualization.

5. **Pagination** – When the news list grows beyond 20 items, add pagination or infinite scrolling to keep the page manageable.

6. **Threat Severity Levels** – Add a severity score (Critical, High, Medium, Low) to each threat based on keyword analysis of the content.

7. **Dark Mode** – Add a dark/light mode toggle using Tailwind's `dark:` variant classes.

8. **Bookmarking / Saved Articles** – Allow users to bookmark threat articles they want to read later.

9. **Email Alerts** – Allow users to subscribe to email alerts when a new threat in their chosen category is detected.

10. **Deployment** – Deploy the React app to a hosting service like Vercel or Netlify, and the proxy server to a cloud platform like Railway or Render, so the dashboard is accessible from anywhere on the internet without needing to run it locally.

11. **Unit Testing** – Write proper tests in `App.test.tsx` to test the filtering logic, date formatting function, and category statistics calculations.

12. **Country Filter** – Add a filter by country/region to let users see threats specific to their geography.

13. **Auto Refresh** – Automatically refresh the data every 5–10 minutes using `setInterval` or React Query's `refetchInterval` option.

14. **Article Read Tracking** – Mark articles as "Read" when the user clicks them, using `localStorage` to persist the state across page reloads.
