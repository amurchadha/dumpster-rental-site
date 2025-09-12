// Static data imported from scraping
import statesData from '../data/all-states.json';
import mainPages from '../data/main-pages.json';
import locationSample from '../data/locations.json';

export interface State {
  slug: string;
  name: string;
  abbreviation: string;
  url: string;
}

export interface City {
  slug: string;
  name: string;
  url: string;
}

export const states: State[] = statesData;

export const getState = (slug: string): State | undefined => {
  return states.find(s => s.slug === slug);
};

export const getMainPageContent = (pageName: string) => {
  return (mainPages as any)[pageName];
};

// For production, we'd dynamically fetch cities
// For now, return empty array or sample data
export const getCitiesForState = async (stateSlug: string): Promise<City[]> => {
  // Check if we have sample data for this state
  const sampleData = (locationSample as any).states[stateSlug];
  if (sampleData) {
    return sampleData.cities;
  }
  
  // In production, you'd fetch this from an API or generate dynamically
  // For now, return empty array
  return [];
};

// Generate city data on-demand (for SEO purposes)
export const generateCityData = (stateSlug: string, citySlug: string): City => {
  console.log('generateCityData called with:', { stateSlug, citySlug });
  
  if (!citySlug || typeof citySlug !== 'string') {
    console.error('Invalid city slug received:', { stateSlug, citySlug });
    throw new Error(`Invalid city slug: ${citySlug} (type: ${typeof citySlug})`);
  }
  
  if (!stateSlug || typeof stateSlug !== 'string') {
    console.error('Invalid state slug received:', { stateSlug, citySlug });  
    throw new Error(`Invalid state slug: ${stateSlug} (type: ${typeof stateSlug})`);
  }
  
  return {
    slug: citySlug,
    name: citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    url: `/${stateSlug}/${citySlug}/`
  };
};