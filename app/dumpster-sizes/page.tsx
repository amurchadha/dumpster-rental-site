import ContactForm from '@/components/ContactForm';

export default function DumpsterSizes() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">
            Dumpster Rental Direct — The Right Dumpster Sizes for Your Needs
          </h1>
          
          <p className="mb-4">
            Whether you need dumpsters for removal of construction debris or waste from your 
            home or business, or whether you are looking for short term dumpster rental for 
            some sort of an outdoor occasion, Dumpster Rental Direct is the place to get the 
            right receptacle for your project or function.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">Different dumpster rental sizes</h2>
          
          <p className="mb-4">
            We specialize in larger dumpster sizes, ranging from 3-50 cubic yards. There are 
            seven different sizes of dumpster available:
          </p>
          
          <ul className="space-y-3 mb-6">
            <li>
              <strong>3 yard</strong> — the smallest type and perfect for residential use. 
              Best applied in small-scale construction such as roofing, siding or remodeling.
            </li>
            <li>
              <strong>10 yard</strong> — appropriate for larger scale cleanup or construction 
              project. Concrete, sand, woodchips, gravel and bricks can easily be loaded.
            </li>
            <li>
              <strong>15 yard</strong> — will easily accommodate 7-9 loads that would fit in 
              a pick-up. Ideal for landscape architecture and roofing jobs on large houses.
            </li>
            <li>
              <strong>20 yard</strong> — for cleanup in natural disasters, fires, demolition 
              and construction of small office buildings.
            </li>
            <li>
              <strong>30 yard</strong> — can be used to relocate furniture or for huge 
              renovation projects in homes or offices.
            </li>
            <li>
              <strong>40 yard</strong> — usually the largest size available, huge renovation 
              projects can be achieved with this one.
            </li>
            <li>
              <strong>50 yard</strong> — we also carry a monster sized dumpster for customers 
              who really need the biggest one on the market!
            </li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">
            Different types of projects you may need a dumpster for
          </h3>
          
          <p className="mb-4">
            There is a huge variety of projects where you may need a dumpster. For instance, 
            if you want to remove large blocks of concrete or asphalt that has been broken up, 
            clearing gardens and woods on your land, building new structures, or demolition jobs.
          </p>
          
          <p className="mb-4">
            Choose Dumpster Rental Direct for your waste and trash hauling needs!
          </p>
        </div>
        
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}