import Link from 'next/link';
import { states } from '@/lib/data';
import ContactForm from '@/components/ContactForm';

export default function ByState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">Dumpsters By State</h1>
          
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {states.map((state) => (
              <li key={state.slug}>
                <Link 
                  href={`/${state.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {state.name} ({state.abbreviation})
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}