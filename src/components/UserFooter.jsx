import React from "react";

const UserFooter = () => {
  return (
    <footer className="bg-gray-50 pt-8 border-t border-gray-200">
      {/* Top section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center py-8 gap-8">
        {/* Logo & Description */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-4 mb-2">
            <div className="rounded-full border-4 border-orange-300 flex items-center justify-center w-20 h-20">
              <span style={{ fontSize: 40, color: '#ff914d' }}>👤</span>
            </div>
            <div>
              <div className="text-3xl font-bold">FPT</div>
              <div className="text-gray-400 text-sm font-semibold">FPT CENTER</div>
            </div>
          </div>
          <div className="text-gray-400 max-w-xs">
            We are a brand-new reproductive center. We offer our clients the latest fertility technology and comfort. Our goal is to make our clients happy parents.
          </div>
        </div>
        {/* Location & Contact */}
        <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
          <div className="font-bold text-lg mb-1">Our Location</div>
          <div className="text-gray-500">D1,Long Thạnh Mỹ,Thủ Đức,Hồ Chí Minh<br /></div>
          <div className="font-bold text-lg mt-4 mb-1">Call Us Toll Free</div>
          <div className="text-orange-400 text-lg font-semibold">123-456-7890</div>
          <div className="font-bold text-lg mt-4 mb-1">Email us</div>
          <div className="text-gray-400">info@yoursite.com</div>
        </div>
        {/* Opening Hours */}
        <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
          <div className="font-bold text-lg mb-1">Opening Hours</div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-4"><span className="text-gray-400">Monday</span><span className="text-lime-500 font-semibold">09:00-17:00</span></div>
            <div className="flex justify-between gap-4"><span className="text-gray-400">Tuesday</span><span className="text-lime-500 font-semibold">09:00-17:00</span></div>
            <div className="flex justify-between gap-4"><span className="text-gray-400">Wednesday</span><span className="text-lime-500 font-semibold">09:00-17:00</span></div>
            <div className="flex justify-between gap-4"><span className="text-gray-400">Thursday</span><span className="text-lime-500 font-semibold">09:00-17:00</span></div>
            <div className="flex justify-between gap-4"><span className="text-gray-400">Friday</span><span className="text-lime-500 font-semibold">09:00-17:00</span></div>
          </div>
        </div>
      </div>
      {/* Bottom section */}
      <div className="border-t border-gray-200 py-4 mt-4 flex flex-col md:flex-row justify-between items-center container mx-auto">
        <div className="text-gray-400 text-sm mb-2 md:mb-0">
          AncoraThemes © 2025. All rights reserved.
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold mr-2">Follow Us</span>
          <a href="#" className="bg-lime-200 rounded-full w-8 h-8 flex items-center justify-center text-xl text-gray-600 hover:bg-lime-300">X</a>
          <a href="#" className="bg-lime-200 rounded-full w-8 h-8 flex items-center justify-center text-xl text-gray-600 hover:bg-lime-300">f</a>
          <a href="#" className="bg-lime-200 rounded-full w-8 h-8 flex items-center justify-center text-xl text-gray-600 hover:bg-lime-300">📷</a>
          <a href="#" className="bg-lime-200 rounded-full w-8 h-8 flex items-center justify-center text-xl text-gray-600 hover:bg-lime-300">🟢</a>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
