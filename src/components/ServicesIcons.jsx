import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServicesIcons = () => {
  const navigate = useNavigate();

  const services = [
    { icon: "🧬", title: "NƠI ƯƠM MẦM BÉ", action: () => navigate('/services') },
    { icon: "⚤", title: "KIỂM TRA KHẢ NĂNG SINH SẢN", action: () => navigate('/service/diagnostic-testing') },
    { icon: "👶", title: "CHĂM SÓC RẠNG RỠ", action: () => navigate('/services') },
    { icon: "👨‍👩‍👧", title: "HÀNH TRÌNH LÀM CHA MẸ", action: () => navigate('/services') },
    { icon: "👩", title: "TƯ VẤN SỨC KHỎE PHỤ NỮ", action: () => navigate('/service/consultation') }
  ];

  return (
    <div className="w-full bg-[#c2da5c] py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={service.action}
            >
              <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <span style={{ fontSize: '40px' }}>{service.icon}</span>
              </div>
              <h3 className="text-center font-semibold text-white hover:text-gray-100 transition-colors">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesIcons;