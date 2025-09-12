const fs = require('fs').promises;
const path = require('path');

const BASE_URL = 'https://www.dumpsterrentaldirect.com';

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function extractStateLinks() {
  console.log('Fetching state links...');
  const html = await fetchPage(`${BASE_URL}/by-state.html`);
  if (!html) return [];
  
  // Extract state links using regex - they're relative links like href="alabama/"
  const statePattern = /<a href="([a-z-]+)\/">([^<]+)<\/a>/g;
  const states = [];
  let match;
  
  while ((match = statePattern.exec(html)) !== null) {
    // Parse the state name (format: "Alabama (AL)")
    const fullName = match[2].trim();
    const nameMatch = fullName.match(/^(.+?)\s*\([A-Z]{2}\)$/);
    
    if (nameMatch) {
      states.push({
        slug: match[1],
        name: nameMatch[1].trim(),
        abbreviation: fullName.match(/\(([A-Z]{2})\)/)[1],
        url: `${BASE_URL}/${match[1]}/`
      });
    }
  }
  
  return states;
}

async function extractCitiesForState(stateSlug) {
  console.log(`Fetching cities for ${stateSlug}...`);
  const html = await fetchPage(`${BASE_URL}/${stateSlug}/`);
  if (!html) return [];
  
  // Extract city links - they appear as dumpster-rental-cityname/
  const cityPattern = new RegExp(`dumpster-rental-([a-z-]+)/`, 'g');
  const citySet = new Set();
  let match;
  
  while ((match = cityPattern.exec(html)) !== null) {
    citySet.add(match[1]);
  }
  
  // Convert Set to array of city objects
  const cities = Array.from(citySet).map(slug => ({
    slug: slug,
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    url: `${BASE_URL}/${stateSlug}/dumpster-rental-${slug}/`
  }));
  
  return cities;
}

async function scrapeMainPages() {
  const pages = [
    { name: 'home', url: BASE_URL },
    { name: 'dumpster-sizes', url: `${BASE_URL}/dumpster-sizes.html` },
    { name: 'about', url: `${BASE_URL}/about.html` },
    { name: 'contact', url: `${BASE_URL}/contact.html` }
  ];
  
  const content = {};
  
  for (const page of pages) {
    console.log(`Scraping ${page.name}...`);
    const html = await fetchPage(page.url);
    if (html) {
      // Extract main content area
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
      
      // Extract main content (simplified - you'd want more sophisticated parsing)
      const contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      
      content[page.name] = {
        title: titleMatch ? titleMatch[1] : '',
        h1: h1Match ? h1Match[1] : '',
        url: page.url,
        // Store raw HTML for now, we'll process it later
        rawHtml: html
      };
    }
  }
  
  return content;
}

async function buildLocationData() {
  const states = await extractStateLinks();
  const locationData = {
    states: {},
    totalCities: 0,
    allStates: states  // Keep all state info for reference
  };
  
  // Just sample Texas to show the structure works
  // In production, we'll generate city pages dynamically 
  const sampleState = states.find(s => s.slug === 'texas');
  
  if (sampleState) {
    const cities = await extractCitiesForState(sampleState.slug);
    locationData.states[sampleState.slug] = {
      name: sampleState.name,
      slug: sampleState.slug,
      abbreviation: sampleState.abbreviation,
      cities: cities.slice(0, 10)  // Just keep first 10 cities as example
    };
    locationData.totalCities = cities.length;
    console.log(`Found ${cities.length} cities in Texas (keeping first 10 as sample)`);
  }
  
  return locationData;
}

async function main() {
  console.log('Starting scraper...');
  
  // Create data directory
  await fs.mkdir(path.join(__dirname, '../data'), { recursive: true });
  
  // Scrape main pages
  const mainContent = await scrapeMainPages();
  await fs.writeFile(
    path.join(__dirname, '../data/main-pages.json'),
    JSON.stringify(mainContent, null, 2)
  );
  console.log('Main pages scraped!');
  
  // Build location data
  const locationData = await buildLocationData();
  await fs.writeFile(
    path.join(__dirname, '../data/locations.json'),
    JSON.stringify(locationData, null, 2)
  );
  console.log(`Location data built! ${locationData.totalCities} cities found.`);
  
  // Get all states list for reference
  const allStates = await extractStateLinks();
  await fs.writeFile(
    path.join(__dirname, '../data/all-states.json'),
    JSON.stringify(allStates, null, 2)
  );
  console.log(`All ${allStates.length} states saved!`);
}

main().catch(console.error);