import { http } from "./config";
import { getLocgetlStorage } from "../utils/util";

export const doctorService = {
  // Lấy danh sách tất cả bác sĩ
  getAllDoctors: async () => {
    try {
      const response = await http.get("doctors");

      // Log để debug
      console.log("📦 Doctor API Response:", response.data);

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin chi tiết một bác sĩ theo ID
  getDoctorById: async (id) => {
    try {
      const response = await http.get(`doctors/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin bác sĩ (alias cho getDoctorById)
  getDoctorInfo: async (doctorId) => {
    try {
      const response = await http.get(`doctors/${doctorId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin bác sĩ
  updateDoctor: async (id, data) => {
    try {
      const response = await http.put("doctors", data, {
        params: { id },
      });
      console.log(`✅ Doctor ${id} updated:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error updating doctor ${id}:`, error);
      throw error;
    }
  },
  getInfoDoctor: (id) => {
    return http.get(`/doctors/${id}`);
  },

  getDoctorForCard: async () => {
    return http.get("doctors/rating");
  },
};
