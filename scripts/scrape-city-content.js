const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeCityPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    console.log(`Scraping: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Extract content from the city page
    const content = await page.evaluate(() => {
      // Get the main content area
      const mainContent = document.querySelector('main') || document.querySelector('.content') || document.querySelector('#content') || document.body;
      
      // Extract key elements
      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const phoneNumbers = Array.from(document.querySelectorAll('a[href^="tel:"]')).map(el => el.textContent.trim());
      
      // Get all text content, organized by sections
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
        level: h.tagName.toLowerCase(),
        text: h.textContent.trim()
      }));
      
      const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()).filter(text => text.length > 0);
      
      const lists = Array.from(document.querySelectorAll('ul, ol')).map(list => ({
        type: list.tagName.toLowerCase(),
        items: Array.from(list.querySelectorAll('li')).map(li => li.textContent.trim())
      }));
      
      return {
        title,
        metaDescription,
        phoneNumbers,
        headings,
        paragraphs,
        lists,
        rawHtml: mainContent.innerHTML
      };
    });
    
    await browser.close();
    return content;
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    await browser.close();
    return null;
  }
}

async function scrapeSampleCityPages() {
  // Sample city pages to scrape for content structure
  const sampleUrls = [
    'https://www.dumpsterrentaldirect.com/texas/dumpster-rental-houston/',
    'https://www.dumpsterrentaldirect.com/texas/dumpster-rental-dallas/',
    'https://www.dumpsterrentaldirect.com/california/dumpster-rental-los-angeles/',
    'https://www.dumpsterrentaldirect.com/florida/dumpster-rental-miami/',
    'https://www.dumpsterrentaldirect.com/new-york/dumpster-rental-buffalo/'
  ];
  
  const scrapedContent = {};
  
  for (const url of sampleUrls) {
    const content = await scrapeCityPage(url);
    if (content) {
      // Extract city and state from URL
      const urlParts = url.split('/');
      const state = urlParts[urlParts.length - 3];
      const cityPart = urlParts[urlParts.length - 2];
      const city = cityPart.replace('dumpster-rental-', '');
      
      scrapedContent[`${state}-${city}`] = content;
    }
    
    // Add delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Save the scraped content
  const outputPath = path.join(__dirname, '..', 'data', 'city-content.json');
  fs.writeFileSync(outputPath, JSON.stringify(scrapedContent, null, 2));
  
  console.log(`Scraped content saved to: ${outputPath}`);
  console.log(`Scraped ${Object.keys(scrapedContent).length} city pages`);
  
  return scrapedContent;
}

// Run if called directly
if (require.main === module) {
  scrapeSampleCityPages().catch(console.error);
}

module.exports = { scrapeCityPage, scrapeSampleCityPages };