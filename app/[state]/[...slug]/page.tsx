import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getState, generateCityData, states } from '@/lib/data';
import { generateCitiesForState, generateAllCityParams } from '@/lib/city-generator';

// Generate static params - SMART BATCHING FOR CLOUDFLARE
export async function generateStaticParams() {
  // Get environment variable for batch size (default to all cities if not set)
  const MAX_CITIES_PER_STATE = process.env.MAX_CITIES_PER_STATE ? parseInt(process.env.MAX_CITIES_PER_STATE) : 999999;
  const TOTAL_CITY_LIMIT = process.env.TOTAL_CITY_LIMIT ? parseInt(process.env.TOTAL_CITY_LIMIT) : 999999;
  
  console.log(`🚀 BUILDING WITH LIMITS: ${MAX_CITIES_PER_STATE} cities per state, ${TOTAL_CITY_LIMIT} total`);
  
  const allParams: Array<{ state: string; city: string }> = [];
  const validStates = states.filter(s => s && s.slug);
  
  console.log(`Processing ${validStates.length} states`);
  
  for (const state of validStates) {
    if (state.slug) {
      const cities = generateCitiesForState(state.slug, MAX_CITIES_PER_STATE);
      console.log(`Got ${cities.length} cities for ${state.slug}`);
      
      cities.forEach(city => {
        if (city && typeof city === 'string' && allParams.length < TOTAL_CITY_LIMIT) {
          allParams.push({
            state: state.slug,
            city: city
          });
        }
      });
    }
    
    // Break if we hit the total limit
    if (allParams.length >= TOTAL_CITY_LIMIT) {
      console.log(`🛑 Hit total limit of ${TOTAL_CITY_LIMIT} cities`);
      break;
    }
  }
  
  console.log(`📊 Final count: ${allParams.length} city params`);
  
  // Convert to catch-all slug format
  const slugParams = allParams.map(param => ({
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
    <>
      <div id="leftcontent">
        <div id="leftcontenttext">
          <p>
            <a href="/">Home</a> &gt;&gt; <a href={`/${stateSlug}/`}>{state.name}</a> &gt;&gt; <a href={`/${stateSlug}/dumpster-rental-${citySlug}/`}>{city.name} dumpsters</a>
          </p>
          
          <h1>Dumpster Rental in {city.name}, {state.abbreviation}</h1>
          
          <p>
            Finally, dumpster rental in {city.name} is easy, reliable, and affordable thanks to the efforts of 
            Dumpster Rental Direct! At Dumpster Rental Direct, we work hard to provide a high quality dumpster 
            rental and roll off services at affordable rates and with the utmost level of customer service. All 
            too often, local residents in {city.name} have been let down when they require dumpster rental in {city.name}. 
            If you choose an unreliable dumpster company in {city.name} you will quickly learn that you have made a 
            costly and aggravating mistake. Finding a reliable source for dumpsters in {city.name} is essential to 
            completing construction, renovation, demolition, landscaping, drywall, electrical, or clean out projects. 
            There are many different types of jobs that call for dumpster rental in {city.name}, but no matter your need, 
            Dumpster Rental Direct has the can for you.
          </p>
          
          <p>
            Some dumpster companies in {city.name} have a reputation for overpromising and under delivering. 
            Often this is done by guaranteeing a delivery time, and then showing up late, or not showing at 
            all without any explanation. This can leave customers high and dry, while if they were simply 
            informed of the delay, they could have made alternate arrangements. Also, some companies that 
            provide <strong>dumpster rental in {city.name}</strong> have been known to quote low prices over 
            the phone, only to make up for it with additional fees and overages at the end of your dumpster rental. 
            Often times you are not even made aware of these charges until you see them on your credit card statement. 
            For straight forward pricing on dumpsters in {city.name} call the professionals at Dumpster Rental Direct today, 
            and the next time you need a roll off dumpster it will be taken care of.
          </p>
          
          <h2>Dumpster Rentals {city.name}, {state.abbreviation}</h2>
          
          <p>
            Why would anyone need {city.name} roll off dumpsters? A better question to ask may be when would 
            someone need {city.name} roll off dumpsters? The answer is quite simple; whenever you are generating 
            more waste material than you can handle with your regular garbage pickup. Will a regular waste management 
            or garbage collection company be able to supply <em>{city.name} roll off dumpsters</em>? Sometimes they 
            can but not always. Dumpster Rental Direct, however, will always be able to deliver the {city.name} roll off 
            dumpsters that your task at hand calls for and always at a price that you can afford.
          </p>

          <p>
            At Dumpster Rental Direct we specialize in providing {city.name} roll off dumpsters. Our roll off 
            and construction dumpster dispatch staff is well trained to answer all of your questions courteously 
            and professionally. Gone are the days of rude roll off dumpster phone attendants and answering service. 
            When you call Dumpster Rental Direct you will be instantly connected to an expert who thoroughly understands 
            {city.name} roll off dumpsters. At Dumpster Rental Direct, our pride is our people, and we strive for 
            excellence in everything we do. Don't place your trust in any other dumpster company when you need the best 
            {city.name} roll off dumpsters. Dumpster Rental Direct can handle any job, large or small. When you order 
            {city.name} roll off dumpsters from Dumpster Rental Direct, you can rest assured that your order will be 
            handled expediently and with great care.
          </p>
          
          <h3>Dumpster Sizes Offered in {city.name}, {state.abbreviation}</h3>
          
          <table width="590" border={0}>
            <tr>
              <td width="290">10 Yard Dumpsters</td>
              <td width="290">20 Yard Dumpsters</td>
            </tr>
            <tr>
              <td>
                <img 
                  src="http://www.dumpsterrentaldirect.com/images/10-yard-dumpster.jpg" 
                  alt={`10 Yard Dumpster in ${city.name}`} 
                />
              </td>
              <td>
                <img 
                  src="http://www.dumpsterrentaldirect.com/images/20-yard-dumpster.jpg" 
                  title={`20 Yard Dumpster in ${city.name}`} 
                />
              </td>
            </tr>
            <tr>
              <td>30 Yard Dumpsters</td>
              <td>40 Yard Dumpsters</td>
            </tr>
            <tr>
              <td>
                <img src="http://www.dumpsterrentaldirect.com/images/30-yard-dumpster.jpg" />
              </td>
              <td>
                <img src="http://www.dumpsterrentaldirect.com/images/40-yard-dumpster.jpg" />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <h5>Other cities we service in {state.name}</h5>
                <ul className="sidecities">
                  {otherCitiesInState.map((otherCity, index) => (
                    <li key={index}>
                      <a href={otherCity.url}>
                        Dumpster Rental in {otherCity.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          </table>
        </div>
      </div>
      
      <div id="rightcontent">
        <div id="form">
          <h3 style={{textAlign: 'center'}}>Rent A Dumpster in {city.name}, {state.name}</h3>
          <form action="" encType="multipart/form-data" method="POST">
            <table style={{fontWeight: 'bolder', color: 'black'}} border={0} width="100%">
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td><input name="Name:" defaultValue="" type="text" /></td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td>
                    <input name="Phone:" defaultValue="" type="text" />
                  </td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>
                    <input name="Email:" defaultValue="" type="text" />
                  </td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td><textarea name="Address" cols={15} rows={3}></textarea></td>
                </tr>
                <tr>
                  <td>Container Size:</td>
                  <td>
                    <select name="Container Size:">
                      <option>10 Yard Dumpster</option>
                      <option>20 Yard Dumpster</option>
                      <option>30 Yard Dumpster</option>
                      <option>40 Yard Dumpster</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Delivery Date:</td>
                  <td><input name="Delivery Date:" defaultValue="" type="text" /></td>
                </tr>
                <tr>
                  <td colSpan={2} style={{textAlign: 'center'}}>
                    <input name="submit" value="Request Quote" type="submit" />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
          
          <div style={{textAlign: 'center', marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0'}}>
            <h4>Call Now: (800) 682-5062</h4>
            <p>Same-day delivery available in {city.name}!</p>
          </div>
        </div>
      </div>
    </>
  );
}