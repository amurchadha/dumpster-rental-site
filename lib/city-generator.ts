import { states } from './data';
import * as fs from 'fs';
import * as path from 'path';

// Load the scraped cities data
let scrapedCities: Record<string, string[]> = {};

try {
  const scrapedData = fs.readFileSync(path.join(process.cwd(), 'scraped-cities.json'), 'utf8');
  scrapedCities = JSON.parse(scrapedData);
  console.log('✅ Loaded real scraped cities from original website');
  console.log(`📊 Total cities loaded: ${Object.values(scrapedCities).reduce((sum, cities) => sum + cities.length, 0)}`);
} catch (error) {
  console.warn('⚠️  Could not load scraped cities, falling back to basic cities:', error);
  // Fallback to basic cities for key states
  scrapedCities = {
    'pennsylvania': ['philadelphia', 'pittsburgh', 'allentown'],
    'texas': ['houston', 'dallas', 'austin'],
    'california': ['los-angeles', 'san-francisco', 'san-diego']
  };
}

// Major cities that should always be included first
const priorityCities = [
  'philadelphia', 'pittsburgh', 'houston', 'dallas', 'austin', 'san-antonio',
  'los-angeles', 'san-francisco', 'san-diego', 'miami', 'tampa', 'orlando',
  'new-york', 'buffalo', 'rochester', 'chicago', 'atlanta', 'boston',
  'detroit', 'cleveland', 'phoenix', 'tucson', 'denver', 'las-vegas',
  'seattle', 'portland', 'minneapolis', 'milwaukee', 'st-louis', 'kansas-city'
];

// Generate cities for a specific state using scraped data with priority ordering
export function generateCitiesForState(stateSlug: string, maxCities: number = 100): string[] {
  // Validate input
  if (!stateSlug || typeof stateSlug !== 'string') {
    console.error('Invalid stateSlug in generateCitiesForState:', stateSlug);
    return [];
  }

  // Use scraped cities if available
  if (scrapedCities[stateSlug] && scrapedCities[stateSlug].length > 0) {
    const allStateCities = scrapedCities[stateSlug];
    console.log(`Using ${allStateCities.length} real cities for ${stateSlug}`);
    
    // Put priority cities first, then the rest
    const priorityForState = priorityCities.filter(city => allStateCities.includes(city));
    const otherCities = allStateCities.filter(city => !priorityCities.includes(city));
    
    const orderedCities = [...priorityForState, ...otherCities];
    console.log(`🎯 Priority cities for ${stateSlug}: ${priorityForState.join(', ')}`);
    
    return orderedCities.slice(0, maxCities);
  }

  console.warn(`No scraped cities found for ${stateSlug}, using fallback`);
  return ['capital-city', 'downtown', 'metro-area'];
}

// Generate city data with proper formatting
export function generateCityData(stateSlug: string, citySlug: string) {
  console.log('generateCityData called with:', { stateSlug, citySlug });
  
  // Convert slug to display name
  const cityName = citySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    slug: citySlug,
    name: cityName,
    stateSlug: stateSlug
  };
}

// Generate all city parameters for static generation
export function generateAllCityParams(): Array<{ state: string; city: string }> {
  const allParams: Array<{ state: string; city: string }> = [];
  
  // Get all valid states
  const validStates = states.filter(s => s && s.slug);
  
  console.log(`Processing ${validStates.length} states`);
  
  validStates.forEach(state => {
    if (state.slug) {
      const cities = generateCitiesForState(state.slug, 999999); // Get ALL scraped cities - no limit!
      console.log(`Generated ${cities.length} cities for ${state.slug}`);
      
      cities.forEach(city => {
        if (city && typeof city === 'string') {
          allParams.push({
            state: state.slug,
            city: city
          });
        }
      });
    }
  });

  console.log(`Generated ${allParams.length} total city params`);
  console.log('Sample params:', allParams.slice(0, 5));
  console.log(`Final valid params: ${allParams.length}`);
  
  return allParams;
}