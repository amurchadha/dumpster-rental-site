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
  
  // Convert to catch-all slug format
  const slugParams = params.map(param => ({
    state: param.state,
    slug: [`dumpster-rental-${param.city}`]
  }));
  
  console.log(`✅ Converted to ${slugParams.length} slug params`);
  console.log('Sample slug params:', slugParams.slice(0, 3));
  return slugParams;
}

// Generate metadata for each city page
export async function generateMetadata({ params }: { params: Promise<{ state: string; slug: string[] }> }): Promise<Metadata> {
  console.log('generateMetadata called with params:', params);
  const resolvedParams = await params;
  const { state: stateSlug, slug } = resolvedParams;
  
  // Extract city from slug array
  const fullSlug = slug[0]; // "dumpster-rental-houston"
  if (!fullSlug || !fullSlug.startsWith('dumpster-rental-')) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    };
  }
  
  const citySlug = fullSlug.replace('dumpster-rental-', ''); // "houston"
  console.log('Extracted city from slug:', { stateSlug, citySlug });
  
  const state = getState(stateSlug);
  
  if (!state) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    };
  }
  
  const city = generateCityData(stateSlug, citySlug);
  
  return {
    title: `Dumpster Rentals ${city.name}, ${state.abbreviation} | Dumpsters ${city.name}, ${state.abbreviation} | Roll Off Dumpster Rental ${city.name}, ${state.abbreviation}`,
    description: `Dumpster Rental Direct provides the premiere dumpster rental in ${city.name}. Call us today and get the ${city.name} dumpster rentals you need.`,
    keywords: `dumpster rental ${city.name}, dumpster rentals ${city.name}, roll off dumpsters ${city.name}, dumpsters ${city.name}`,
  };
}

export default async function CityPage({ 
  params 
}: { 
  params: Promise<{ state: string; slug: string[] }> 
}) {
  console.log('CityPage received params:', JSON.stringify(params));
  
  const resolvedParams = await params;
  const { state: stateSlug, slug } = resolvedParams;
  
  // Extract city from slug array
  const fullSlug = slug[0]; // "dumpster-rental-houston"
  if (!fullSlug || !fullSlug.startsWith('dumpster-rental-')) {
    notFound();
  }
  
  const citySlug = fullSlug.replace('dumpster-rental-', ''); // "houston"
  
  console.log('Extracted from catch-all route:', { stateSlug, citySlug });
  
  const state = getState(stateSlug);
  
  if (!state) {
    console.error('State not found:', stateSlug);
    notFound();
  }
  
  let city;
  try {
    city = generateCityData(stateSlug, citySlug);
  } catch (error) {
    console.error('Error generating city data:', error);
    notFound();
  }
  
  // Generate other cities in the same state for internal linking
  const otherCitiesInState = generateAllCityParams()
    .filter(p => p.state === stateSlug && p.city !== citySlug)
    .slice(0, 8) // Show 8 other cities
    .map(p => ({
      name: generateCityData(p.state, p.city).name,
      slug: p.city,
      url: `/${p.state}/dumpster-rental-${p.city}/`
    }));

  // Generate top cities for the state  
  const topCitiesInState = generateAllCityParams()
    .filter(p => p.state === stateSlug)
    .slice(0, 8) // Show top 8 cities
    .map(p => ({
      name: generateCityData(p.state, p.city).name,
      slug: p.city,
      url: `/${p.state}/dumpster-rental-${p.city}/`
    }));

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4 text-sm">
              <a href="/" className="text-blue-600 hover:underline">Home</a> 
              <span className="mx-2">&gt;&gt;</span>
              <a href={`/${stateSlug}`} className="text-blue-600 hover:underline">{state.name}</a>
              <span className="mx-2">&gt;&gt;</span>
              <span>{city.name} dumpsters</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-6">
              Dumpster Rental in {city.name}, {state.abbreviation}
            </h1>
            
            <p className="mb-4 text-gray-700 leading-relaxed">
              Finally, dumpster rental in {city.name} is easy, reliable, and affordable thanks to the efforts of 
              Dumpster Rental Direct! At Dumpster Rental Direct, we work hard to provide a high quality dumpster 
              rental and roll off services at affordable rates and with the utmost level of customer service. All 
              too often, local residents in {city.name} have been let down when they require dumpster rental in {city.name}. 
              If you choose an unreliable dumpster company in {city.name} you will quickly learn that you have made a 
              costly and aggravating mistake.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              Finding a reliable source for dumpsters in {city.name} is essential to completing construction, renovation, 
              demolition, landscaping, drywall, electrical, or clean out projects. There are many different types of jobs 
              that call for dumpster rental in {city.name}, but no matter your need, Dumpster Rental Direct has the can for you.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                📞 Call Now: (800) 682-5062
              </h2>
              <p className="text-blue-700">
                Same-day delivery available in {city.name}! Get your free quote in minutes.
              </p>
            </div>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              Some dumpster companies in {city.name} have a reputation for overpromising and under delivering. 
              Often this is done by guaranteeing a delivery time, and then showing up late, or not showing at 
              all without any explanation. This can leave customers high and dry, while if they were simply 
              informed of the delay, they could have made alternate arrangements. Also, some companies that 
              provide <strong>dumpster rental in {city.name}</strong> have been known to quote low prices over 
              the phone, only to make up for it with additional fees and overages at the end of your dumpster rental.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              Dumpster Rentals {city.name}, {state.abbreviation}
            </h2>
            
            <p className="mb-4 text-gray-700 leading-relaxed">
              Why would anyone need {city.name} roll off dumpsters? A better question to ask may be when would 
              someone need {city.name} roll off dumpsters? The answer is quite simple; whenever you are generating 
              more waste material than you can handle with your regular garbage pickup.
            </p>
            
            <p className="mb-6 text-gray-700 leading-relaxed">
              At Dumpster Rental Direct we specialize in providing {city.name} roll off dumpsters. Our roll off 
              and construction dumpster dispatch staff is well trained to answer all of your questions courteously 
              and professionally. When you call Dumpster Rental Direct you will be instantly connected to an expert 
              who thoroughly understands {city.name} roll off dumpsters.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Dumpster Sizes Offered in {city.name}, {state.abbreviation}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-300 p-4 rounded-lg">
                <strong className="text-lg text-blue-600">10 Yard Dumpsters</strong>
                <p className="text-sm text-gray-600 mt-1">Perfect for small cleanouts</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• 3-5 pickup truck loads</li>
                  <li>• Bathroom remodels</li>
                  <li>• Small deck removal</li>
                </ul>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-lg">
                <strong className="text-lg text-blue-600">20 Yard Dumpsters</strong>
                <p className="text-sm text-gray-600 mt-1">Most popular size</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• 6-8 pickup truck loads</li>
                  <li>• Kitchen remodels</li>
                  <li>• Flooring removal</li>
                </ul>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-lg">
                <strong className="text-lg text-blue-600">30 Yard Dumpsters</strong>
                <p className="text-sm text-gray-600 mt-1">Large renovation projects</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• 9-12 pickup truck loads</li>
                  <li>• Whole house cleanouts</li>
                  <li>• Large deck removal</li>
                </ul>
              </div>
              
              <div className="border border-gray-300 p-4 rounded-lg">
                <strong className="text-lg text-blue-600">40 Yard Dumpsters</strong>
                <p className="text-sm text-gray-600 mt-1">Major construction</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• 12-16 pickup truck loads</li>
                  <li>• Commercial projects</li>
                  <li>• Major renovations</li>
                </ul>
              </div>
            </div>

            {/* Internal Linking Section - Top Cities */}
            <h3 className="text-xl font-bold mt-8 mb-4">
              Top Cities in {state.name}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {topCitiesInState.map((topCity, index) => (
                  <a 
                    key={index}
                    href={topCity.url} 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Dumpster Rental in {topCity.name}, {state.abbreviation}
                  </a>
                ))}
              </div>
            </div>

            {/* Internal Linking Section - Other Cities */}
            <h3 className="text-xl font-bold mt-6 mb-4">
              Other cities we service in {state.name}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {otherCitiesInState.map((otherCity, index) => (
                  <a 
                    key={index}
                    href={otherCity.url} 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Dumpster Rental in {otherCity.name}
                  </a>
                ))}
              </div>
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