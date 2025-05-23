import React from "react";

const UserFooter = () => {
  return (
    <footer className="bg-[#F5F5F5] pt-12 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full flex items-center justify-center w-16 h-16 overflow-hidden border-2" style={{ borderColor: '#15A1AC' }}>
                <img src="/images/logo/logo.jpg" alt="NewLife Fertility Hospital Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">NewLife</div>
                <div className="text-gray-600 text-sm font-medium">Fertility Hospital</div>
              </div>
            </div>
            <div className="text-gray-500 text-sm mt-3 pr-4">
              We are a brand-new reproductive center. We offer our clients the latest fertility technology and comfort. Our goal is to make our clients happy parents.
            </div>
          </div>
          
          {/* Location */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-700 mb-4">Our Location</h3>
            <p className="text-gray-500 text-sm">
              D1, Long Thạnh Mỹ<br />
              Thủ Đức, Hồ Chí Minh<br />
              Việt Nam
            </p>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-700 mb-4">Call Us Toll Free</h3>
            <p className="text-[#ff8460] text-lg font-semibold mb-4">123-456-7890</p>
            
            <h3 className="font-bold text-gray-700 mb-2">Email us</h3>
            <p className="text-gray-500 text-sm">info@yoursite.com</p>
          </div>
          
          {/* Opening Hours */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-700 mb-4">Opening Hours</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500 text-sm">Monday</div>
              <div className="text-lime-500 text-sm font-semibold text-right">09:00-17:00</div>
              
              <div className="text-gray-500 text-sm">Tuesday</div>
              <div className="text-lime-500 text-sm font-semibold text-right">09:00-17:00</div>
              
              <div className="text-gray-500 text-sm">Wednesday</div>
              <div className="text-lime-500 text-sm font-semibold text-right">09:00-17:00</div>
              
              <div className="text-gray-500 text-sm">Thursday</div>
              <div className="text-lime-500 text-sm font-semibold text-right">09:00-17:00</div>
              
              <div className="text-gray-500 text-sm">Friday</div>
              <div className="text-lime-500 text-sm font-semibold text-right">09:00-17:00</div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            NewLife Fertility Hospital © 2025. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-sm mr-2">Follow Us</span>
            <a href="#" className="bg-lime-200 rounded-full w-8 h-8 flex items-center justify-center text-sm text-gray-600 hover:bg-lime-300">X</a>
            <a href="#" className="bg-lime-200 rounded-full w-8 h-8 flex items-center justify-center text-sm text-gray-600 hover:bg-lime-300">f</a>
            <a href="#" className="bg-lime-200 rounded-full w-8 h-8 flex items-center justify-center text-sm text-gray-600 hover:bg-lime-300">📷</a>
            <a href="#" className="bg-lime-200 rounded-full w-8 h-8 flex items-center justify-center text-sm text-gray-600 hover:bg-lime-300">🟢</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
