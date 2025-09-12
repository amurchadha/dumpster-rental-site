import { states } from './data';

// Expanded common city types found across all states
const commonCityNames = [
  // Major metro areas
  'capital-city', 'downtown', 'metro-area', 'city-center', 'central-district',
  'financial-district', 'business-district', 'arts-district', 'warehouse-district',
  
  // Geographic directions
  'north-side', 'south-side', 'east-side', 'west-side', 'northside', 'southside',
  'northeast', 'southeast', 'northwest', 'southwest', 'north-central', 'south-central',
  'east-central', 'west-central', 'upper-north', 'lower-south',
  
  // Presidential/Historical names
  'springfield', 'franklin', 'clinton', 'georgetown', 'madison', 'washington',
  'jefferson', 'lincoln', 'jackson', 'monroe', 'adams', 'hamilton', 'harrison',
  'cleveland', 'wilson', 'roosevelt', 'kennedy', 'johnson', 'truman', 'eisenhower',
  
  // Common surnames as city names
  'davis', 'miller', 'brown', 'jones', 'smith', 'williams', 'taylor', 'anderson',
  'thomas', 'martinez', 'garcia', 'rodriguez', 'lewis', 'walker', 'hall', 'allen',
  'young', 'king', 'wright', 'lopez', 'hill', 'scott', 'green', 'baker',
  
  // Geographic features
  'riverside', 'lakeside', 'hillside', 'valley', 'heights', 'park', 'gardens',
  'grove', 'hills', 'creek', 'river-crossing', 'lake-view', 'mountain-view',
  'forest', 'meadows', 'springs', 'falls', 'bridge', 'crossing', 'pine-valley',
  'oak-hill', 'maple-grove', 'cedar-heights', 'elm-street', 'birch-woods',
  
  // Size/type descriptors
  'central', 'suburban', 'industrial', 'commercial', 'residential', 'historic',
  'old-town', 'new-town', 'midtown', 'uptown', 'downtown-east', 'downtown-west',
  'metro-north', 'metro-south', 'inner-city', 'outer-ring',
  
  // Directional combinations
  'north-hills', 'south-hills', 'east-hills', 'west-hills', 'north-park',
  'south-park', 'east-park', 'west-park', 'north-valley', 'south-valley',
  
  // Common endings/suffixes
  'town', 'ville', 'burg', 'field', 'wood', 'dale', 'ridge', 'port', 'mount',
  'glen', 'brook', 'ford', 'ton', 'ham', 'view', 'side', 'land', 'worth',
  'shire', 'haven', 'point', 'crest', 'mesa', 'plaza', 'center',
  
  // Business/Industrial areas
  'tech-center', 'business-park', 'industrial-park', 'commerce-center',
  'trade-center', 'corporate-plaza', 'office-district', 'innovation-district'
];

// State-specific city patterns
const stateSpecificCities: Record<string, string[]> = {
  'texas': [
    'houston', 'dallas', 'austin', 'san-antonio', 'fort-worth',
    'el-paso', 'arlington', 'corpus-christi', 'plano', 'lubbock',
    'laredo', 'irving', 'garland', 'frisco', 'mckinney', 'amarillo',
    'grand-prairie', 'brownsville', 'pasadena', 'mesquite',
    'killeen', 'carrollton', 'midland', 'denton', 'abilene',
    'beaumont', 'round-rock', 'odessa', 'waco', 'richardson',
    'tyler', 'college-station', 'pearland', 'league-city'
  ],
  'california': [
    'los-angeles', 'san-diego', 'san-jose', 'san-francisco', 'fresno',
    'sacramento', 'long-beach', 'oakland', 'bakersfield', 'anaheim',
    'santa-ana', 'riverside', 'stockton', 'irvine', 'chula-vista',
    'fremont', 'san-bernardino', 'modesto', 'fontana', 'oxnard',
    'moreno-valley', 'huntington-beach', 'glendale', 'santa-clarita',
    'garden-grove', 'oceanside', 'rancho-cucamonga', 'santa-rosa',
    'ontario', 'lancaster', 'elk-grove', 'corona', 'palmdale',
    'salinas', 'pomona', 'hayward', 'escondido', 'torrance'
  ],
  'florida': [
    'jacksonville', 'miami', 'tampa', 'orlando', 'st-petersburg',
    'hialeah', 'tallahassee', 'fort-lauderdale', 'port-st-lucie',
    'cape-coral', 'pembroke-pines', 'hollywood', 'miramar',
    'gainesville', 'coral-springs', 'clearwater', 'miami-gardens',
    'brandon', 'west-palm-beach', 'lakeland', 'pompano-beach',
    'davie', 'miami-beach', 'sunrise', 'plantation', 'boca-raton',
    'deltona', 'palm-bay', 'largo', 'melbourne', 'boynton-beach',
    'fort-myers', 'kissimmee', 'homestead', 'deerfield-beach'
  ],
  'new-york': [
    'new-york', 'buffalo', 'rochester', 'yonkers', 'syracuse',
    'albany', 'new-rochelle', 'mount-vernon', 'schenectady',
    'utica', 'white-plains', 'troy', 'niagara-falls', 'binghamton',
    'freeport', 'valley-stream', 'long-beach', 'rome', 'watertown',
    'ithaca', 'middletown', 'spring-valley', 'kiryas-joel',
    'newburgh', 'poughkeepsie', 'jamestown', 'elmira', 'saratoga-springs'
  ]
};

// Generate cities for a specific state
export function generateCitiesForState(stateSlug: string, maxCities: number = 100): string[] {
  const cities = new Set<string>();
  
  // Validate input
  if (!stateSlug || typeof stateSlug !== 'string') {
    console.error('Invalid stateSlug in generateCitiesForState:', stateSlug);
    return [];
  }
  
  // Add state-specific cities first
  const specific = stateSpecificCities[stateSlug] || [];
  specific.slice(0, Math.min(specific.length, maxCities / 2)).forEach(city => {
    if (city && typeof city === 'string' && city.trim()) {
      cities.add(city.trim());
    }
  });
  
  // Fill remaining slots with common city names
  const remaining = maxCities - cities.size;
  const shuffled = [...commonCityNames].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < remaining && i < shuffled.length; i++) {
    const city = shuffled[i];
    if (city && typeof city === 'string' && city.trim()) {
      cities.add(city.trim());
    }
  }
  
  return Array.from(cities).filter(city => city && city.trim());
}

// Generate all static params for city pages (optimized for build performance)
export function generateAllCityParams() {
  const params: Array<{ state: string; city: string }> = [];
  
  // Prioritize major states with more cities
  const majorStates = ['texas', 'california', 'florida', 'new-york', 'illinois', 'pennsylvania'];
  const regularStates = states.filter(s => s && s.slug && !majorStates.includes(s.slug)).map(s => s.slug);
  
  console.log(`Processing ${majorStates.length} major states and ${regularStates.length} regular states`);
  
  // Major states get 50 cities each (maximum scale)
  majorStates.forEach(stateSlug => {
    if (!stateSlug || typeof stateSlug !== 'string') {
      console.error('Invalid major state slug:', stateSlug);
      return;
    }
    
    const cities = generateCitiesForState(stateSlug, 50);
    console.log(`Generated ${cities.length} cities for major state: ${stateSlug}`);
    
    cities.forEach(citySlug => {
      if (citySlug && typeof citySlug === 'string' && citySlug.trim()) {
        const param = { state: stateSlug, city: citySlug.trim() };
        params.push(param);
      } else {
        console.error('Invalid city generated:', { stateSlug, citySlug });
      }
    });
  });
  
  // Regular states get 30 cities each (maximum scale)
  regularStates.forEach(stateSlug => {
    if (!stateSlug || typeof stateSlug !== 'string') {
      console.error('Invalid regular state slug:', stateSlug);
      return;
    }
    
    const cities = generateCitiesForState(stateSlug, 30);
    console.log(`Generated ${cities.length} cities for regular state: ${stateSlug}`);
    
    cities.forEach(citySlug => {
      if (citySlug && typeof citySlug === 'string' && citySlug.trim()) {
        params.push({ state: stateSlug, city: citySlug.trim() });
      } else {
        console.error('Invalid city generated:', { stateSlug, citySlug });
      }
    });
  });
  
  console.log(`Generated ${params.length} total city params`);
  console.log('Sample params:', params.slice(0, 5));
  
  // Final validation
  const validParams = params.filter(param => 
    param && 
    param.state && 
    param.city && 
    typeof param.state === 'string' && 
    typeof param.city === 'string' &&
    param.state.trim() !== '' && 
    param.city.trim() !== ''
  );
  
  console.log(`Final valid params: ${validParams.length}`);
  return validParams;
}

// Calculate total expected pages
export function getTotalExpectedPages(): { cityPages: number; totalPages: number } {
  const majorStatesCount = 6;
  const regularStatesCount = states.length - majorStatesCount;
  
  const cityPages = (majorStatesCount * 75) + (regularStatesCount * 35);
  const mainPages = 6; // home, about, contact, etc.
  const statePages = states.length;
  
  return {
    cityPages,
    totalPages: cityPages + mainPages + statePages
  };
}