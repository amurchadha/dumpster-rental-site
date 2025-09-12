import ContactForm from '@/components/ContactForm';

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">
            Contact Us For Nationwide Dumpster Rentals
          </h1>
          
          <p className="mb-4">
            Fill out the form to the right and someone will contact you shortly.
          </p>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-3">Call Us Directly</h2>
            <p className="text-3xl font-bold text-orange-600">(800) 682-5062</p>
            <p className="mt-2">Available Monday-Friday, 8am-6pm EST</p>
          </div>
        </div>
        
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}