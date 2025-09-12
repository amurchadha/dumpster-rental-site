import ContactForm from '@/components/ContactForm';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">About Dumpster Rental Direct</h1>
          
          <p className="mb-4">
            Dumpster Rental Direct has the experience necessary to provide you the dumpster 
            rental service you need. Our team of experts has been in the dumpster rental 
            industry for many years and we can set you up with the right dumpster for your 
            project. We utilize some of the best haulers in the country and make sure that 
            your project stays on schedule.
          </p>
          
          <p className="mb-4">
            Dumpster Rental Direct has done all of the work as far as screening providers 
            all across the US. Give us a call and we will take care of your dumpster rental 
            and roll off dumpster rental needs no matter where you are. Our trained dumpster 
            technicians are experts in the field of sourcing waste management dumpsters no 
            matter if you are doing a small garage clean out or a long term construction project.
          </p>
        </div>
        
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}