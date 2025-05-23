import React from 'react';

const ServicesIcons = () => {
  return (
    <div className="w-full bg-[#c2da5c] py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            { icon: "🧬", title: "BABY NEST" },
            { icon: "⚤", title: "FERTILITY TESTING" },
            { icon: "👶", title: "GLOW CARE" },
            { icon: "👨‍👩‍👧", title: "PARENT PATH" },
            { icon: "👩", title: "WOMEN'S CONSULTATION" }
          ].map((service, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center mb-4 shadow-md">
                <span style={{ fontSize: '40px' }}>{service.icon}</span>
              </div>
              <h3 className="text-center font-semibold text-white">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesIcons; 