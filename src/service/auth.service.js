import { data } from "react-router-dom";
import { getLocgetlStorage } from "../utils/util";
import { http } from "./config";

export const authService = {
  // chua phuong thuc cua axios
  signIn: (data) => {
    return http.post("v1/auth/login", data); // đường dẫn endpoint để hoàn thành request url
  },
  signInByGoogle: (data) => {
    return http.post("v1/auth/login/google", data); // đường dẫn endpoint để hoàn thành request url
  },
  getMyInfo: (token) => {
    return http.get("v1/users/myInfo");
  },
  signUp: (data) => {
    return http.post("v1/auth/sign-up", data); // đường dẫn endpoint để hoàn thành request url
  },
  verify: (data) => {
    return http.post("v1/auth/opt/verify", data); // đường dẫn endpoint để hoàn thành request url
  },
  forgotPassword: (data) => {
    return http.post("v1/auth/password/forgot", data); // gửi email để nhận OTP
  },
  resetPassword: (data) => {
    return http.post("v1/auth/password/reset", data); // reset password với OTP
  },
  resendOtp: (data) => {
    return http.post("v1/auth/otp/resend", data); // resend OTP
  },
  checkIntrospect: (data) => {
    return http.post("v1/auth/introspect", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  },
  updateUser: (id, data) => {
    return http.put(`user/update/${id}`, data);
  },

  uploadAvatar: (userId, payload) => {
    return http.put(`v1/users/${userId}/upload-avatar`, payload);
  },
};
