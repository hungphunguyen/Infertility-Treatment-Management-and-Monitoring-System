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
      console.error("💥 Error getting doctors:", error);
      throw error;
    }
  },
  
  // Lấy thông tin chi tiết một bác sĩ theo ID
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

  // Lấy thông tin bác sĩ (alias cho getDoctorById)
  getDoctorInfo: async (doctorId) => {
    try {
      const response = await http.get(`doctors/${doctorId}`);
      console.log(`📋 Doctor info for ID ${doctorId}:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error fetching doctor info ${doctorId}:`, error);
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
  },
  
  // Lấy danh sách bác sĩ có lịch trống theo ngày và ca
  getAvailableDoctors: async (date, shift) => {
    try {
      const response = await http.get("doctors/available", {
        params: {
          date: date,
          shift: shift
        }
      });
      console.log(`📅 Available doctors for ${date} (${shift}):`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error getting available doctors:`, error);
      throw error;
    }
  },

  // Lấy danh sách bác sĩ và lịch làm việc
  getDoctorSchedules: async () => {
    try {
      const response = await http.get("doctors");
      console.log("📅 Doctor schedules:", response.data);
      return response;
    } catch (error) {
      console.error("💥 Error getting doctor schedules:", error);
      throw error;
    }
  },

  // Lấy lịch làm việc của bác sĩ theo ngày
  getDoctorSchedulesByDate: async (date) => {
    try {
      const response = await http.get(`doctors/schedules/${date}`);
      console.log(`📅 Doctor schedules for ${date}:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error getting doctor schedules for ${date}:`, error);
      throw error;
    }
  },

  // Lấy thống kê số bệnh nhân đã khám theo ngày
  getDoctorStatistics: async (date) => {
    try {
      const response = await http.get(`doctors/statistics/${date}`);
      console.log(`📊 Doctor statistics for ${date}:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error getting doctor statistics for ${date}:`, error);
      throw error;
    }
  }
}; 