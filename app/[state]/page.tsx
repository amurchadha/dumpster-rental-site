import { notFound } from 'next/navigation';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import { getState, states } from '@/lib/data';

export async function generateStaticParams() {
  return states.map((state) => ({
    state: state.slug,
  }));
}

export default async function StatePage({ params }: { params: { state: string } }) {
  const state = getState(params.state);
  
  if (!state) {
    notFound();
  }
  
  // In production, you'd fetch actual cities here
  // For now, we'll generate a sample list
  const sampleCities = [
    'capital-city',
    'major-city',
    'downtown',
    'northside',
    'southside',
    'eastside',
    'westside',
    'suburbs',
    'metro-area',
    'industrial-district'
  ].map(slug => ({
    slug,
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    href: `/${params.state}/dumpster-rental-${slug}`
  }));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">
            Dumpster Rental {state.name}
          </h1>
          
          <p className="mb-4">
            Looking for reliable dumpster rental services in {state.name}? Dumpster Rental 
            Direct provides comprehensive waste management solutions throughout the state. 
            Whether you're in a major city or rural area, we've got you covered.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">
            Cities We Serve in {state.name}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {sampleCities.map(city => (
              <Link 
                key={city.slug}
                href={city.href}
                className="text-blue-600 hover:underline text-sm"
              >
                {city.name}
              </Link>
            ))}
          </div>
          
          <p className="mb-4">
            Call us today at <strong>(800) 682-5062</strong> to get a free quote for 
            dumpster rental anywhere in {state.name}.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Our Services</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Residential dumpster rental</li>
            <li>Commercial waste management</li>
            <li>Construction site cleanup</li>
            <li>Roll-off dumpsters (3-50 yards)</li>
            <li>Same-day delivery available</li>
            <li>Flexible rental periods</li>
          </ul>
        </div>
        
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}