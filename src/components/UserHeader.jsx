import React from "react";
import { Link } from "react-router-dom";
import { path } from "../common/path";

const UserHeader = () => {
  return (
    <header style={{ borderBottom: '1px solid #f2f2f2' }}>
      {/* Top row: Logo + Sign In/Sign Up */}
      <div className="container flex justify-between items-center py-4">
        {/* Logo and Center Name */}
        <div className="flex items-center gap-5">
          <div className="rounded-full bg-white flex items-center justify-center w-24 h-24 overflow-hidden border-2" style={{ borderColor: '#15A1AC' }}>
            <img src="/images/logo/logo.jpg" alt="Logo Bệnh viện Sinh sản NewLife" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">NewLife</div>
            <div className="text-gray-600 text-lg font-medium">Bệnh viện Sinh sản</div>
          </div>
        </div>
        {/* Sign In / Sign Up buttons */}
        <nav className="flex gap-4">
          <Link
            to={path.signIn}
            className="py-2 px-4 border border-red-500 rounded-md hover:bg-red-500 hover:text-white duration-300"
          >
              Sign in
          </Link>
          <Link
            to={path.signUp}
            className="py-2 px-4 border border-green-500 rounded-md hover:bg-green-600 hover:text-white duration-300"
          >
            Sign up
          </Link>
        </nav>
      </div>
      {/* Navigation Bar + Search Bar */}
      <div className="container flex justify-between items-center py-2">
        <nav className="flex gap-8 text-orange-400 font-bold text-lg">
          <Link to={path.homePage} className="text-orange-400 hover:text-gray-400">Trang chủ</Link>
          <Link to={path.aboutCenter} className="text-orange-400 hover:text-gray-400">Giới thiệu Trung tâm</Link>
          <Link to={path.services} className="text-orange-400 hover:text-gray-400">Dịch vụ</Link>
          <Link to={path.ourStaff} className="text-orange-400 hover:text-gray-400">Bác sĩ</Link>
          <Link to={path.blog} className="text-orange-400 hover:text-gray-400">Blogs</Link>
          <Link to={path.contacts} className="text-orange-400 hover:text-gray-400">Liên hệ</Link>
        </nav>
        {/* Search Bar */}
       
      </div>
    </header>
  );
};

export default UserHeader;