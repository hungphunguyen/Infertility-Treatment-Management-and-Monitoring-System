import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { path } from "../common/path";
import { useSelector } from "react-redux";
import { Avatar, Dropdown, Menu } from "antd";
import { NotificationContext } from "../App";
import { authService } from "../service/auth.service";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

const UserHeader = () => {
  const token = useSelector((state) => state.authSlice);
  const location = useLocation();
  const [infoUser, setInfoUser] = useState();

  useEffect(() => {
    if (!token) return;
    authService
      .getMyInfo(token.token)
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {});
  }, [token]);

  const handleMenuClick = ({ key }) => {
    if (key === "update") {
      // Chuyển hướng sang trang cập nhật thông tin (bạn có thể thay đổi đường dẫn)
      window.location.href = "/update-profile";
    } else if (key === "logout") {
      // Xử lý logout
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const accountMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="update" icon={<SettingOutlined />}>
        Cập nhật thông tin
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const isActive = (pathname) => {
    return (
      location.pathname === pathname ||
      location.pathname.startsWith(`${pathname}/`)
    );
  };

  const checkUserLogin = () => {
    return infoUser ? (
      <Dropdown
        overlay={accountMenu}
        trigger={["click"]}
        placement="bottomRight"
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold   hover:border-4 hover:border-orange-400 transition-all duration-300 cursor-pointer">
          <Avatar>
            {infoUser.fullName !== null ? (
              infoUser.fullName.charAt(0).toUpperCase()
            ) : (
              <UserOutlined />
            )}
          </Avatar>
          <span className="text-sm font-medium text-gray-700">
            {infoUser.fullName}
          </span>
        </div>
      </Dropdown>
    ) : (
      <div className="flex gap-3">
        <Link
          to={path.signIn}
          className="py-2 px-4 font-medium border border-orange-500 rounded-md hover:bg-orange-500 hover:text-white duration-300"
        >
          Đăng nhập
        </Link>
        <Link
          to={path.signUp}
          className="py-2 px-4 font-medium border border-lime-300 rounded-md hover:bg-lime-300 hover:text-white duration-300"
        >
          Đăng ký
        </Link>
      </div>
    );
  };

  const checkUserRole = () => {
    if (infoUser) {
      switch (infoUser.roleName.name) {
        case "ADMIN":
          return (
            <Link
              to={path.admin}
              className="py-2 px-4 font-medium border border-red-500 rounded-md hover:bg-red-500 hover:text-white duration-300"
            >
              ADMIN DASHBOARD
            </Link>
          );
        case "DOCTOR":
          return null;
        case "MANAGER":
          return null;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <header
      style={{ borderBottom: "1px solid #f2f2f2" }}
      className="sticky top-0 bg-white z-50"
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        {/* Logo and Center Name - Left */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-full bg-white flex items-center justify-center w-16 h-16 overflow-hidden border-2"
            style={{ borderColor: "#FF8460" }}
          >
            <img
              src="https://res.cloudinary.com/di6hi1r0g/image/upload/v1748582429/z6652986046151_c5b2b5d42778ea78c6b4c3ad7a01fbab_gd14jx.jpg"
              alt="Logo Bệnh viện Sinh sản NewLife"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              NewLife
            </div>
            <div className="text-gray-600 text-sm font-medium">
              Bệnh viện Sinh sản
            </div>
          </div>
        </div>

        {/* Navigation Menu - Center */}
        <nav className="flex gap-8 text-xl">
          <Link
            to={path.homePage}
            className={`hover:text-orange-400 transition-colors ${
              isActive(path.homePage) && location.pathname === "/"
                ? "text-orange-400 font-bold text-2xl"
                : "text-gray-600"
            }`}
          >
            Trang chủ
          </Link>
          <Link
            to={path.services}
            className={`hover:text-orange-400 transition-colors ${
              isActive(path.services)
                ? "text-orange-400 font-bold text-2xl"
                : "text-gray-600"
            }`}
          >
            Dịch vụ
          </Link>
          <Link
            to={path.ourStaff}
            className={`hover:text-orange-400 transition-colors ${
              isActive(path.ourStaff)
                ? "text-orange-400 font-bold text-2xl"
                : "text-gray-600"
            }`}
          >
            Bác sĩ
          </Link>
          <Link
            to={path.blog}
            className={`hover:text-orange-400 transition-colors ${
              isActive(path.blog)
                ? "text-orange-400 font-bold text-2xl"
                : "text-gray-600"
            }`}
          >
            Blogs
          </Link>
          <Link
            to={path.contacts}
            className={`hover:text-orange-400 transition-colors ${
              isActive(path.contacts)
                ? "text-orange-400 font-bold text-2xl"
                : "text-gray-600"
            }`}
          >
            Liên hệ
          </Link>
        </nav>

        {/* Login/Signup or User Info - Right */}
        <div className="flex items-center">
          <div className="mr-4">{checkUserLogin()}</div>
          {checkUserRole()}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
