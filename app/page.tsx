import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

const popularCities = [
  { name: 'Atlanta, GA', href: '/georgia/dumpster-rental-atlanta' },
  { name: 'Houston, TX', href: '/texas/dumpster-rental-houston' },
  { name: 'Miami, FL', href: '/florida/dumpster-rental-miami' },
  { name: 'Phoenix, AZ', href: '/arizona/dumpster-rental-phoenix' },
  { name: 'Chicago, IL', href: '/illinois/dumpster-rental-chicago' },
  { name: 'Los Angeles, CA', href: '/california/dumpster-rental-los-angeles' },
  { name: 'New York City, NY', href: '/new-york/dumpster-rental-new-york' },
  { name: 'Philadelphia, PA', href: '/pennsylvania/dumpster-rental-philadelphia' },
];

const topStates = [
  { name: 'Arizona', href: '/arizona' },
  { name: 'California', href: '/california' },
  { name: 'Colorado', href: '/colorado' },
  { name: 'Florida', href: '/florida' },
  { name: 'Georgia', href: '/georgia' },
  { name: 'Texas', href: '/texas' },
  { name: 'New York', href: '/new-york' },
  { name: 'Illinois', href: '/illinois' },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">
            Dumpster Rental Direct - (800) 682-5062
          </h1>
          
          <p className="mb-4">
            Welcome to the home of Dumpster Rental Direct – America's premier source for 
            dumpster rentals. We work with homeowners, businesses and construction sites to 
            supply dumpsters for every waste disposal need. No matter where you are located 
            in the country, Dumpster Rental Direct will get you the dumpsters that you need 
            to deal with the rubbish that's piling up from your construction, renovation or 
            cleanup projects.
          </p>
          
          <p className="mb-4">
            As we offer a wide range of <strong>roll off dumpsters</strong> in sizes from 
            three to fifty yards in volume, our dumpsters are able to tackle every waste 
            disposal job, large or small. When you're facing more waste and trash than you 
            are capable of hauling on your own, it's time to give Dumpster Rental Direct a 
            call to get a dumpster delivered that will take care of your waste.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">
            Get Delivery of Dumpster Rentals Direct to Your Home
          </h2>
          
          <p className="mb-4">
            There are few things that make a roof replacement, new deck construction or other 
            renovation or cleanup project around the house go as smoothly as having a dumpster 
            on hand to collect all of the trash and waste. Household renovation and maintenance 
            projects can generate large amounts of rubbish that may end up being ignored or 
            refused if you leave it out on the curb for the regular trash pickup.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">
            Popular Cities We Serve
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {popularCities.map(city => (
              <Link 
                key={city.href} 
                href={city.href}
                className="text-blue-600 hover:underline text-sm"
              >
                {city.name}
              </Link>
            ))}
          </div>
          
          <h3 className="text-xl font-bold mt-6 mb-3">
            Dumpster Rentals Direct Works with Construction Sites
          </h3>
          
          <p className="mb-4">
            Contractors and construction site operators love working with us at Dumpster 
            Rental Direct as we are experienced in providing roll off dumpster and other 
            waste disposal solutions that cater to the specific needs involved with building 
            construction and demolition.
          </p>
        </div>
        
        <div>
          <ContactForm />
          
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3">Top Dumpster Rental States</h3>
            <ul className="space-y-1">
              {topStates.map(state => (
                <li key={state.href}>
                  <Link 
                    href={state.href}
                    className="text-blue-600 hover:underline"
                  >
                    Dumpster Rental {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}