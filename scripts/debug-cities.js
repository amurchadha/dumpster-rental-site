async function debug() {
  const response = await fetch('https://www.dumpsterrentaldirect.com/texas/');
  const html = await response.text();
  
  // Look for city links
  const cityPattern = /<a href="\/texas\/dumpster-rental-[^"]+">([^<]+)<\/a>/g;
  let match;
  let count = 0;
  const samples = [];
  
  while ((match = cityPattern.exec(html)) !== null && count < 5) {
    samples.push(match[0]);
    count++;
  }
  
  console.log('Sample city links:', samples);
  
  // Try a simpler pattern
  const simplePattern = /dumpster-rental-([a-z-]+)\//g;
  const cities = new Set();
  
  while ((match = simplePattern.exec(html)) !== null) {
    cities.add(match[1]);
  }
  
  console.log('\nTotal unique cities found:', cities.size);
  console.log('First 10 cities:', Array.from(cities).slice(0, 10));
}

debug();