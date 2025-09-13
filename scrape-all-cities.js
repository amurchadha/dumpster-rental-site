const fs = require('fs');
const https = require('https');
const states = require('./data/all-states.json');

// Function to scrape cities from a state page
async function scrapeCitiesFromState(stateSlug) {
  return new Promise((resolve, reject) => {
    const url = `https://www.dumpsterrentaldirect.com/${stateSlug}/`;
    
    console.log(`Scraping cities from: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Extract city links using regex - match full URLs
          const cityRegex = /href="http:\/\/www\.dumpsterrentaldirect\.com\/[^"]*\/dumpster-rental-([^\/]+)\/"/g;
          const cities = new Set();
          let match;
          
          while ((match = cityRegex.exec(data)) !== null) {
            cities.add(match[1]); // City slug from the URL
          }
          
          const cityList = Array.from(cities).sort();
          console.log(`Found ${cityList.length} cities for ${stateSlug}`);
          resolve(cityList);
        } catch (error) {
          console.error(`Error parsing ${stateSlug}:`, error);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.error(`Error fetching ${stateSlug}:`, err);
      resolve([]);
    });
  });
}

// Main function to scrape all states
async function scrapeAllStates() {
  const allCities = {};
  
  // Process each state
  for (const state of states) { // Get ALL states
    if (state && state.slug) {
      try {
        const cities = await scrapeCitiesFromState(state.slug);
        if (cities.length > 0) {
          allCities[state.slug] = cities;
        }
        // Add delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to scrape ${state.slug}:`, error);
      }
    }
  }
  
  // Save to file
  const outputFile = './scraped-cities.json';
  fs.writeFileSync(outputFile, JSON.stringify(allCities, null, 2));
  console.log(`\nSaved scraped cities to ${outputFile}`);
  console.log(`Total states processed: ${Object.keys(allCities).length}`);
  
  // Show sample
  Object.entries(allCities).forEach(([state, cities]) => {
    console.log(`${state}: ${cities.length} cities (sample: ${cities.slice(0, 5).join(', ')})`);
  });
}

// Run the scraper
scrapeAllStates().catch(console.error);