import React from "react";
import { Link } from "react-router-dom";
import { path } from "../common/path";

const UserHeader = () => {
  return (
    <header>
      <div className="container">
        <div className="header_logo ">
          <Link to={path.homePage}>Logo here</Link>
        </div>
        <nav className="header_navigate">
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
    </header>
  );
};

export default UserHeader;
