import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SevicesChild = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-700 mb-2">What We Offer</h2>
            <div className="mt-2">
              <span className="text-[#ff8460] font-medium">SERVICES</span>
            </div>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
            <img 
              src="/images/features/pc4.jpg" 
              className="h-56 w-full object-cover"
              alt="Egg Donor"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4">Egg Donor and Surrogacy</h3>
              <p className="text-gray-600 mb-4">
                At our center we have comprehensive knowledge and experience in the field of egg donor 
                and surrogacy. We have a booming base of 1,000 donors.
              </p>
              <Link to="/service/egg-donor" className="text-[#ff8460] font-medium hover:text-[#ff6b40] inline-block">
                <span className="mr-1">+</span> More Info
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
            <img 
              src="/images/features/pc6.jpg" 
              className="h-56 w-full object-cover"
              alt="Egg Freezing"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4">Egg Freezing / Preservation</h3>
              <p className="text-gray-600 mb-4">
                Fertility preservation in general, and egg freezing in particular, is quickly becoming a more popular 
                procedure for women all over the world each year.
              </p>
              <Link to="/service/egg-freezing" className="text-[#ff8460] font-medium hover:text-[#ff6b40] inline-block">
                <span className="mr-1">+</span> More Info
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
            <img 
              src="/images/features/iui-vs-ivf.jpg" 
              className="h-56 w-full object-cover"
              alt="Gender Selection"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4">Gender Selection</h3>
              <p className="text-gray-600 mb-4">
                Sex selection can be done either before or after the fertilisation of the egg. Gender selection is the 
                attempt to control the gender of human offspring.
              </p>
              <Link to="/service/gender-selection" className="text-[#ff8460] font-medium hover:text-[#ff6b40] inline-block">
                <span className="mr-1">+</span> More Info
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/services')}
            className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-8 rounded transition duration-300 ease-in-out"
          >
            More Programs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SevicesChild; 