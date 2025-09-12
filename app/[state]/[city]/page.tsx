import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { getState, generateCityData } from '@/lib/data';
import { generateAllCityParams } from '@/lib/city-generator';

// Generate static params for all city pages - MAXIMUM SCALE
export async function generateStaticParams() {
  const params = generateAllCityParams();
  console.log(`🚀 GOING FULL SCALE: Generating ${params.length} city pages!`);
  console.log('💪 Major states getting 50 cities each, regular states getting 30 each');
  
  // Filter out any invalid params and log them
  const validParams = params.filter(param => {
    const isValid = param && param.state && param.city && 
                   typeof param.state === 'string' && 
                   typeof param.city === 'string' &&
                   param.state.trim() !== '' && 
                   param.city.trim() !== '';
    
    if (!isValid) {
      console.error('Invalid param filtered out:', param);
    }
    return isValid;
  });
  
  console.log(`✅ Filtered to ${validParams.length} valid params`);
  return validParams;
}

// Generate metadata for each city page
export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  console.log('generateMetadata called with params:', params);
  const { state: stateSlug, city: citySlug } = await params;
  const state = getState(stateSlug);
  
  if (!state) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    };
  }
  
  const city = generateCityData(stateSlug, citySlug);
  
  return {
    title: `Dumpster Rental ${city.name}, ${state.abbreviation} - Fast Delivery & Pickup`,
    description: `Professional dumpster rental service in ${city.name}, ${state.name}. Roll-off containers 10-40 yards. Same-day delivery available. Call (800) 682-5062 for free quote.`,
    keywords: `dumpster rental ${city.name}, ${city.name} dumpster, roll off dumpster ${city.name}, waste management ${city.name}, ${state.name} dumpster rental`,
  };
}

export default async function CityPage({ 
  params 
}: { 
  params: Promise<{ state: string; city: string }> 
}) {
  console.log('CityPage received params:', JSON.stringify(params));
  
  const { state: stateSlug, city: citySlug } = await params;
  
  console.log('Destructured params:', { stateSlug, citySlug });
  
  // Simple validation with detailed logging
  if (!params) {
    console.error('No params received');
    return <div>Error: No parameters received</div>;
  }
  
  if (!stateSlug) {
    console.error('No state slug in params:', params);
    return <div>Error: No state parameter found</div>;
  }
  
  if (!citySlug) {
    console.error('No city slug in params:', params);
    return <div>Error: No city parameter found</div>;
  }
  
  const state = getState(stateSlug);
  
  if (!state) {
    console.error('State not found:', stateSlug);
    return <div>Error: State {stateSlug} not found</div>;
  }
  
  let city;
  try {
    city = generateCityData(stateSlug, citySlug);
  } catch (error) {
    console.error('Error generating city data:', error);
    return <div>Error: Could not generate city data for {citySlug}</div>;
  }
  
  // SEO-optimized title and description
  const pageTitle = `Dumpster Rental ${city.name}, ${state.abbreviation} - Fast Delivery & Pickup`;
  const pageDescription = `Professional dumpster rental service in ${city.name}, ${state.name}. Roll-off containers 10-40 yards. Same-day delivery available. Call (800) 682-5062 for free quote.`;
  
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">
              Dumpster Rental {city.name}, {state.abbreviation}
            </h1>
            
            <p className="mb-4">
              Need a dumpster rental in {city.name}, {state.name}? Dumpster Rental Direct 
              is your local solution for all waste management needs. We provide fast, reliable 
              service with transparent pricing and no hidden fees.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                📞 Call Now: (800) 682-5062
              </h2>
              <p className="text-blue-700">
                Same-day delivery available in {city.name}! Get your free quote in minutes.
              </p>
            </div>
            
            <h2 className="text-2xl font-bold mt-6 mb-3">
              Local Dumpster Rental Services in {city.name}
            </h2>
            
            <p className="mb-4">
              Our {city.name} customers trust us for:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Home renovation and remodeling projects</li>
              <li>Roof replacement and repair</li>
              <li>Garage and basement cleanouts</li>
              <li>Yard waste and landscaping debris</li>
              <li>Estate cleanouts and downsizing</li>
              <li>Construction and demolition projects</li>
              <li>Commercial waste management</li>
              <li>Industrial cleanup services</li>
            </ul>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Available Dumpster Sizes in {city.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-300 p-4 rounded-lg">
                <strong className="text-lg text-blue-600">10 Yard Dumpster</strong>
                <p className="text-sm text-gray-600 mt-1">Perfect for small cleanouts</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• 3-5 pickup truck loads</li>
                  <li>• Bathroom remodels</li>
                  <li>• Small deck removal</li>
                </ul>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-lg">
                <strong className="text-lg text-blue-600">20 Yard Dumpster</strong>
                <p className="text-sm text-gray-600 mt-1">Most popular size</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• 6-8 pickup truck loads</li>
                  <li>• Kitchen remodels</li>
                  <li>• Flooring removal</li>
                </ul>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-lg">
                <strong className="text-lg text-blue-600">30 Yard Dumpster</strong>
                <p className="text-sm text-gray-600 mt-1">Large renovation projects</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• 9-12 pickup truck loads</li>
                  <li>• Whole house cleanouts</li>
                  <li>• Large deck removal</li>
                </ul>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-lg">
                <strong className="text-lg text-blue-600">40 Yard Dumpster</strong>
                <p className="text-sm text-gray-600 mt-1">Major construction</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• 12-16 pickup truck loads</li>
                  <li>• Commercial projects</li>
                  <li>• Major renovations</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mt-6 mb-3">
              Why Choose Dumpster Rental Direct in {city.name}?
            </h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <ul className="list-disc pl-6 space-y-2 text-green-800">
                <li><strong>Local Expertise:</strong> We know {city.name} and {state.name}</li>
                <li><strong>Transparent Pricing:</strong> No hidden fees or surprises</li>
                <li><strong>Flexible Terms:</strong> Rental periods that work for you</li>
                <li><strong>Fast Delivery:</strong> Same-day service when available</li>
                <li><strong>Professional Service:</strong> Courteous, reliable team</li>
                <li><strong>Eco-Friendly:</strong> Responsible disposal practices</li>
              </ul>
            </div>
            
            <div className="mt-8 p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
              <p className="mb-3">
                Don't let waste pile up in {city.name}! Call Dumpster Rental Direct today 
                for fast, professional dumpster rental service.
              </p>
              <div className="text-center">
                <a 
                  href="tel:8006825062" 
                  className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg text-xl font-bold hover:bg-orange-600 transition-colors"
                >
                  📞 Call (800) 682-5062 Now
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <ContactForm />
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-2">Service Area</h4>
              <p className="text-yellow-700 text-sm">
                We proudly serve {city.name} and surrounding areas in {state.name}. 
                Contact us to confirm delivery to your specific location.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}