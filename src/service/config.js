import axios from "axios";
import { getLocgetlStorage } from "../utils/util";

// Setup axios cho dự án
const http = axios.create({
  baseURL: "http://www.infertilitymonitoring.unaux.com/infertility-system-api/",
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token nếu có
http.interceptors.request.use(
  (config) => {
    const token = getLocgetlStorage("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export { http };
