import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { path } from "../common/path";
import { useSelector } from "react-redux";
import { Avatar } from "antd";
import { NotificationContext } from "../App";
import { authService } from "../service/auth.service";

const UserHeader = () => {
  const token = useSelector((state) => state.authSlice);
  console.log("Token hiện tại:", token); // log ra xem token có chưa

  const [infoUser, setInfoUser] = useState();

  useEffect(() => {
    if (!token) return;
    authService
      .getMyInfo(token.token)
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {
      });
  }, [token]);

  const checkUserLogin = () => {
    return infoUser ? (
      <div className="text-center">
        {/* .charAt(0).toUpperCase() */}
        <Avatar>{infoUser.fullName}</Avatar> <br />
        <span className="text-sm font-medium text-gray-700">
          {infoUser.fullName}
        </span>
      </div>
    ) : (
      <>
        <Link
          to={path.signIn}
          className="py-2 px-4 font-medium border border-orange-500 rounded-md hover:bg-orange-500 hover:text-white  duration-300"
        >
          sign in
        </Link>
        <Link
          to={path.signUp}
          className="py-2 px-4 font-medium border border-lime-300 rounded-md hover:bg-lime-300 hover:text-white  duration-300"
        >
          sign up
        </Link>
      </>
    );
  };

  const checkUserRole = () => {
    if (infoUser) {
      switch (infoUser.roleName.name) {
        case "ADMIN":
          return (
            <Link
              to={path.admin}
              className="py-2 px-4 font-medium border border-red-500 rounded-md hover:bg-red-500 hover:text-white  duration-300"
            >
              ADMIN DASHBOARD
            </Link>
          );
        case "DOCTOR":
          return;
        case "MANAGER":
          return;
      }
    }
  };

  return (
    <header style={{ borderBottom: "1px solid #f2f2f2" }}>
      {/* Top row: Logo + Sign In/Sign Up */}
      <div className="container flex justify-between items-center py-4">
        {/* Logo and Center Name */}
        <div className="flex items-center gap-5">
          <div
            className="rounded-full bg-white flex items-center justify-center w-24 h-24 overflow-hidden border-2"
            style={{ borderColor: "#15A1AC" }}
          >
            <img
              src="/images/logo/logo.jpg"
              alt="Logo Bệnh viện Sinh sản NewLife"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              NewLife
            </div>
            <div className="text-gray-600 text-lg font-medium">
              Bệnh viện Sinh sản
            </div>
          </div>
        </div>
        <nav className="header_navigate text-end ">{checkUserLogin()}</nav>
      </div>
      {/* Navigation Bar + Search Bar */}
      <div className="container flex justify-between items-center py-2">
        <nav className="flex gap-8 text-orange-400 font-bold text-lg">
          <Link
            to={path.homePage}
            className="text-orange-400 hover:text-gray-400"
          >
            Trang chủ
          </Link>
          <Link
            to={path.services}
            className="text-orange-400 hover:text-gray-400"
          >
            Dịch vụ
          </Link>
          <Link
            to={path.ourStaff}
            className="text-orange-400 hover:text-gray-400"
          >
            Bác sĩ
          </Link>
          <Link to={path.blog} className="text-orange-400 hover:text-gray-400">
            Blogs
          </Link>
          <Link
            to={path.contacts}
            className="text-orange-400 hover:text-gray-400"
          >
            Liên hệ
          </Link>
        </nav>
        {/* Sign In / Sign Up buttons */}
        <nav className="dashboar">{checkUserRole()}</nav>
      </div>
    </header>
  );
};

export default UserHeader;
