async function test() {
  const response = await fetch('https://www.dumpsterrentaldirect.com/by-state.html');
  const html = await response.text();
  
  // Find all state links
  const matches = html.match(/href="[^"]*\/[a-z-]+\/"[^>]*>[^<]*Dumpster Rental[^<]*/g);
  
  if (matches) {
    console.log('Found', matches.length, 'potential state links');
    console.log('First 5:', matches.slice(0, 5));
  }
  
  // Try a simpler pattern for just the links
  const linkPattern = /href="(\/[a-z-]+\/)"[^>]*title="([^"]+Dumpster Rental[^"]+)"/g;
  let match;
  const states = [];
  
  while ((match = linkPattern.exec(html)) !== null) {
    states.push({
      href: match[1],
      title: match[2]
    });
  }
  
  console.log('States found:', states.length);
  if (states.length > 0) {
    console.log('First 5 states:', states.slice(0, 5));
  }
}

test();