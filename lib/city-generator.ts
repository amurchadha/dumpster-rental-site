import { states } from './data';

// Common city types found across all states
const commonCityNames = [
  // Major metro areas
  'capital-city', 'downtown', 'metro-area', 'city-center',
  
  // Geographic directions
  'north-side', 'south-side', 'east-side', 'west-side',
  'northeast', 'southeast', 'northwest', 'southwest',
  
  // Common US city names
  'springfield', 'franklin', 'clinton', 'georgetown', 'madison',
  'washington', 'jefferson', 'lincoln', 'jackson', 'monroe',
  'adams', 'hamilton', 'harrison', 'cleveland', 'wilson',
  'roosevelt', 'kennedy', 'johnson', 'davis', 'miller',
  'brown', 'jones', 'smith', 'williams', 'taylor',
  
  // Geographic features
  'riverside', 'lakeside', 'hillside', 'valley', 'heights',
  'park', 'gardens', 'grove', 'hills', 'creek',
  'river-crossing', 'lake-view', 'mountain-view', 'forest',
  'meadows', 'springs', 'falls', 'bridge', 'crossing',
  
  // Size/type descriptors
  'central', 'suburban', 'industrial', 'commercial', 'residential',
  'historic', 'old-town', 'new-town', 'midtown', 'uptown',
  
  // Common endings
  'town', 'ville', 'burg', 'field', 'wood', 'dale', 'ridge',
  'port', 'mount', 'glen', 'brook', 'ford', 'ton', 'ham'
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
  
  // Add state-specific cities first
  const specific = stateSpecificCities[stateSlug] || [];
  specific.slice(0, Math.min(specific.length, maxCities / 2)).forEach(city => cities.add(city));
  
  // Fill remaining slots with common city names
  const remaining = maxCities - cities.size;
  const shuffled = [...commonCityNames].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < remaining && i < shuffled.length; i++) {
    cities.add(shuffled[i]);
  }
  
  return Array.from(cities);
}

// Generate all static params for city pages (optimized for build performance)
export function generateAllCityParams() {
  const params: Array<{ state: string; city: string }> = [];
  
  // Prioritize major states with more cities
  const majorStates = ['texas', 'california', 'florida', 'new-york', 'illinois', 'pennsylvania'];
  const regularStates = states.filter(s => !majorStates.includes(s.slug)).map(s => s.slug);
  
  // Major states get 50 cities each
  majorStates.forEach(stateSlug => {
    const cities = generateCitiesForState(stateSlug, 50);
    cities.forEach(citySlug => {
      if (citySlug && citySlug.trim()) {
        params.push({ state: stateSlug, city: citySlug });
      }
    });
  });
  
  // Regular states get 25 cities each
  regularStates.forEach(stateSlug => {
    const cities = generateCitiesForState(stateSlug, 25);
    cities.forEach(citySlug => {
      if (citySlug && citySlug.trim()) {
        params.push({ state: stateSlug, city: citySlug });
      }
    });
  });
  
  console.log('Generated params sample:', params.slice(0, 5));
  return params;
}

// Calculate total expected pages
export function getTotalExpectedPages(): { cityPages: number; totalPages: number } {
  const majorStatesCount = 6;
  const regularStatesCount = states.length - majorStatesCount;
  
  const cityPages = (majorStatesCount * 50) + (regularStatesCount * 25);
  const mainPages = 6; // home, about, contact, etc.
  const statePages = states.length;
  
  return {
    cityPages,
    totalPages: cityPages + mainPages + statePages
  };
}