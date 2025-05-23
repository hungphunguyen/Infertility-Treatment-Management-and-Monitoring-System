import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { path } from "../common/path";
import { useSelector } from "react-redux";
import { Avatar } from "antd";
import { authService } from "../service/auth.service";

const UserHeader = () => {
  const { token } = useSelector((state) => state.authSlice);
  const [fullName, setFullName] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        try {
          const res = await authService.getMyInfo(token);
          setFullName(res.data.result.fullName);
        } catch (error) {
          console.error("Không lấy được thông tin user:", error);
        }
      }
    };

    fetchUserInfo();
  }, [token]);

  return (
    <header>
      <div className="container">
        <div className="header_logo">
          <Link to={path.homePage}>Logo here</Link>
        </div>
        <nav className="header_navigate">
          {token && fullName ? (
            <div className="flex items-center gap-2">
              <Avatar>{fullName.charAt(0)}</Avatar>
            </div>
          ) : (
            <>
              <Link
                to={path.signIn}
                className="py-2 px-4 border border-red-500 rounded-md hover:bg-red-500 duration-300"
              >
                Sign in
              </Link>
              <Link
                to={path.signUp}
                className="py-2 px-4 border border-green-500 rounded-md hover:bg-green-600 duration-300"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default UserHeader;
