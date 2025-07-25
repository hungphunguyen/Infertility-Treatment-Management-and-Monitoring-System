import { data } from "react-router-dom";
import { getLocgetlStorage } from "../utils/util";
import { http } from "./config";

export const authService = {
  // chua phuong thuc cua axios
  signIn: (data) => {
    return http.post("v1/auth/login", data, {
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
    }); // đường dẫn endpoint để hoàn thành request url
  },
  signInByGoogle: (accessToken, provider, data) => {
    return http.post(`v1/auth/login/${accessToken}`, null, {
      params: { provider },
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
    }); // đường dẫn endpoint để hoàn thành request url
  },
  getMyInfo: () => {
    return http.get("v1/users/myInfo", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  signUp: (data) => {
    return http.post("v1/auth/sign-up", data, {
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
    }); // đường dẫn endpoint để hoàn thành request url
  },
  verify: (data) => {
    return http.post("v1/auth/opt/verify", data, {
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
    }); // đường dẫn endpoint để hoàn thành request url
  },
  forgotPassword: (data) => {
    return http.post("v1/auth/password/forgot", data, {
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
    }); // gửi email để nhận OTP
  },
  resetPassword: (data) => {
    return http.post("v1/auth/password/reset", data, {
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
    }); // reset password với OTP
  },
  resendOtp: (data) => {
    return http.post("v1/auth/otp/resend", data, {
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
    }); // resend OTP
  },
  checkIntrospect: (data) => {
    return http.post("v1/auth/introspect", data, {
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  },

  refreshToken: (data) => {
    return http.post(`v1/auth/refresh-token`, data, {
      skipAuth: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  },
  updateUser: (userId, data) => {
    return http.put(`v1/users/${userId}`, data);
  },

  uploadAvatar: (userId, payload) => {
    return http.put(`v1/users/${userId}/upload-avatar`, payload);
  },
};
