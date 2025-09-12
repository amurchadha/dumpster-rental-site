async function debug() {
  const response = await fetch('https://www.dumpsterrentaldirect.com/by-state.html');
  const html = await response.text();
  
  // Save a snippet to see what we're working with
  const snippet = html.substring(html.indexOf('<body'), html.indexOf('<body') + 5000);
  console.log('HTML snippet:', snippet);
  
  // Look for any Alabama link as a test
  const alabamaIndex = html.indexOf('alabama');
  if (alabamaIndex > -1) {
    console.log('\nFound Alabama at index:', alabamaIndex);
    console.log('Context:', html.substring(alabamaIndex - 50, alabamaIndex + 100));
  }
  
  // Look for the actual link pattern
  const linkMatches = html.match(/<a[^>]+href="[^"]*alabama[^"]*"[^>]*>[^<]*<\/a>/i);
  if (linkMatches) {
    console.log('\nAlabama link found:', linkMatches[0]);
  }
}

debug();