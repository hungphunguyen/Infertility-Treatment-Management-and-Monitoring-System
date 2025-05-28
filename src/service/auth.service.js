import { data } from "react-router-dom";
import { getLocgetlStorage } from "../utils/util";
import { http } from "./config";

export const authService = {
  // chua phuong thuc cua axios
  signIn: (data) => {
    return http.post("auth/login", data); // đường dẫn endpoint để hoàn thành request url
  },
  signInByGoogle: (data) => {
    return http.post("auth/login-google", data); // đường dẫn endpoint để hoàn thành request url
  },
  getMyInfo: (token) => {
    return http.get("user/myInfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  signUp: (data) => {
    return http.post("auth/register", data); // đường dẫn endpoint để hoàn thành request url
  },
  verify: (data) => {
    return http.post("auth/verify-otp", data); // đường dẫn endpoint để hoàn thành request url
  },
  forgotPassword: (data) => {
    return http.post("auth/forgot-password", data); // gửi email để nhận OTP
  },
  resetPassword: (data) => {
    return http.post("auth/reset-password", data); // reset password với OTP
  },
};
