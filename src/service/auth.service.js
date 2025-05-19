import { http } from "./config";

export const authService = {
  // chua phuong thuc cua axios
  signIn: (data) => {
    return http.post("auth/login", data); // đường dẫn endpoint để hoàn thành request url
  },
};
