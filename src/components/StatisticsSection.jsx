import React from 'react';

const StatisticsSection = () => {
  return (
    <div className="py-16 bg-cover bg-center text-white" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/features/pc7.jpg')"}}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="rounded-full border-4 border-white p-6 w-64 h-64 flex flex-col items-center justify-center shadow-lg">
              <span className="text-white opacity-80 text-sm">OVER</span>
              <div className="text-6xl font-bold text-white">1250</div>
              <span className="text-[#ff8460] text-sm">Happy Families</span>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-2">People Recommend Us</h2>
            <span className="text-[#ff8460] font-medium block mb-4">WHY CHOOSE US</span>
            <p className="mb-6 text-lg">
              We provide individualized care and attention for every client during their journey to parenthood. 
              We offer comprehensive testing to determine the causes of male and female infertility, 
              and we specialize in IUI and in IVF.
            </p>
            <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-6 rounded transition duration-300 ease-in-out">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection; 