import React from "react";
import { Link } from "react-router-dom";
import { path } from "../common/path";

const UserHeader = () => {
  return (
    <header style={{ borderBottom: '1px solid #f2f2f2' }}>
      {/* Top row: Logo + Sign In/Sign Up */}
      <div className="container flex justify-between items-center py-4">
        {/* Logo and Center Name */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-orange-100 flex items-center justify-center w-20 h-20">
            {/* Placeholder for logo icon */}
            <span style={{ fontSize: 40 }}>👤</span>
          </div>
          <div>
            <div className="text-3xl font-bold">FPT</div>
            <div className="text-gray-400 text-sm font-semibold">FPT CENTER</div>
          </div>
        </div>
        {/* Sign In / Sign Up buttons */}
        <nav className="flex gap-4">
          <Link
            to={path.signIn}
            className="py-2 px-4 border border-red-500 rounded-md hover:bg-red-500 duration-300"
          >
            sign in
          </Link>
          <Link
            to={path.signUp}
            className="py-2 px-4 border border-green-500 rounded-md hover:bg-green-600 duration-300"
          >
            sign up
          </Link>
        </nav>
      </div>
      {/* Navigation Bar + Search Bar */}
      <div className="container flex justify-between items-center py-2">
        <nav className="flex gap-8 text-orange-400 font-bold text-lg">
          <Link to={path.homePage} className="text-orange-400 hover:text-gray-400">Home</Link>
          <Link to={path.aboutCenter} className= "text-orange-400 hover:text-gray-400">About Center</Link>
          <Link to={path.services} className="text-orange-400 hover:text-gray-400">Services</Link>
          <Link to={path.ourStaff} className="text-orange-400 hover:text-gray-400">Our Staff</Link>
          <Link to={path.features} className="text-orange-400 hover:text-gray-400">Features</Link>
          <Link to={path.blog} className="text-orange-400 hover:text-gray-400">Blog</Link>
          <Link to={path.contacts} className="text-orange-400 hover:text-gray-400">Contacts</Link>
        </nav>
        {/* Search Bar */}
        <form className="flex items-center border rounded-full px-4 py-1 bg-white">
          <input
            type="text"
            placeholder="Search"
            className="outline-none px-2 py-1 bg-transparent"
          />
          <button type="submit" className="text-xl text-gray-400 ml-2">🔍</button>
        </form>
      </div>
    </header>
  );
};

export default UserHeader;
