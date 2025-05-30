import { http } from "./config";
import { getLocgetlStorage } from "../utils/util";

// Setup interceptors cho doctor service
const setupDoctorInterceptors = () => {
  // Request interceptor - thêm token nếu có
  http.interceptors.request.use(
    (config) => {
      const token = getLocgetlStorage("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['Content-Type'] = 'application/json';
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
      console.error("Doctor API Error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
      return Promise.reject(error);
    }
  );
};

// Setup interceptors khi service được import
setupDoctorInterceptors();

export const doctorService = {
  // Lấy danh sách tất cả bác sĩ
  getAllDoctors: async () => {
    try {
      const response = await http.get("doctors");
      
      // Log để debug
      console.log("📦 Doctor API Response:", response.data);
      
      return response;
    } catch (error) {
      console.error("💥 Error getting doctors:", error);
      throw error;
    }
  },
  
  // Lấy thông tin chi tiết một bác sĩ
  getDoctorById: async (id) => {
    try {
      const response = await http.get(`doctors/${id}`);
      console.log(`📦 Doctor ${id} details:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error getting doctor ${id}:`, error);
      throw error;
    }
  },
  
  // Cập nhật thông tin bác sĩ
  updateDoctor: async (id, data) => {
    try {
      const response = await http.put("doctors", data, {
        params: { id }
      });
      console.log(`✅ Doctor ${id} updated:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error updating doctor ${id}:`, error);
      throw error;
    }
  }
}; 