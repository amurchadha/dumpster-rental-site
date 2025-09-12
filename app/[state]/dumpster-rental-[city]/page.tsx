import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import { getState, generateCityData } from '@/lib/data';

export default async function CityPage({ 
  params 
}: { 
  params: { state: string; city: string } 
}) {
  const state = getState(params.state);
  
  if (!state) {
    notFound();
  }
  
  const city = generateCityData(params.state, params.city);
  
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
            <li>Estate cleanouts</li>
            <li>Construction and demolition</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Available Dumpster Sizes</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="border p-3 rounded">
              <strong>10 Yard</strong>
              <p className="text-sm">Small projects</p>
            </div>
            <div className="border p-3 rounded">
              <strong>20 Yard</strong>
              <p className="text-sm">Medium renovations</p>
            </div>
            <div className="border p-3 rounded">
              <strong>30 Yard</strong>
              <p className="text-sm">Large cleanouts</p>
            </div>
            <div className="border p-3 rounded">
              <strong>40 Yard</strong>
              <p className="text-sm">Major construction</p>
            </div>
          </div>
          
          <p className="mb-4">
            <strong>Call (800) 682-5062</strong> today for immediate dumpster delivery 
            in {city.name}. Our friendly staff will help you choose the right size and 
            schedule convenient delivery and pickup times.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">
            Why Choose Dumpster Rental Direct in {city.name}?
          </h3>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Local knowledge and expertise</li>
            <li>Competitive, transparent pricing</li>
            <li>Flexible rental periods</li>
            <li>Same-day delivery available</li>
            <li>Professional, courteous service</li>
            <li>Environmentally responsible disposal</li>
          </ul>
        </div>
        
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}