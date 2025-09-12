import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              Dumpster Rental Direct
            </div>
          </Link>
          
          <div className="text-xl font-semibold text-orange-600">
            (800) 682-5062
          </div>
        </div>
        
        <nav className="py-2 border-t">
          <ul className="flex space-x-6 text-sm">
            <li><Link href="/" className="hover:text-blue-600">Dumpster Rental</Link></li>
            <li><Link href="/dumpster-sizes" className="hover:text-blue-600">Dumpster Sizes</Link></li>
            <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
            <li><Link href="/by-state" className="hover:text-blue-600">By State</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}