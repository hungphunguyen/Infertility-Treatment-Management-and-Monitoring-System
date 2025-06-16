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
    return http.put(`/doctors/${id}`, data);
  },
  getInfoDoctor: (id) => {
    return http.get(`/doctors/${id}`);
  },

  getDoctorForCard: async () => {
    return http.get("doctors/rating");
  },
  // Lấy danh sách rating của bác sĩ
  getDoctorRatings: async () => {
    try {
      const response = await http.get("doctors/rating");
      return response;
    } catch (error) {
      throw error;
    }
  },
  getDoctorFeedback: async (doctorId, isApproval) => {
    try {
      const response = await http.get(
        `feedback/for-doctor/${isApproval}/${doctorId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getDashboardStatics: (doctorId) => {
    return http.get(`/doctors/dashboard/statics/${doctorId}`);
  },
  // Lấy thống kê số bệnh nhân đã khám theo ngày
  getDoctorStatistics: async (date) => {
    try {
      const response = await http.get(`doctors/statistics/${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lịch làm việc của bác sĩ theo ngày
  getDoctorSchedulesByDate: async (date) => {
    try {
      const response = await http.get(`doctors/schedules/${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách bác sĩ và lịch làm việc
  getDoctorSchedules: async () => {
    try {
      const response = await http.get("doctors");
      return response;
    } catch (error) {
      throw error;
    }
  },
  // Lấy danh sách bác sĩ có lịch trống theo ngày và ca
  getAvailableDoctors: async (date, shift) => {
    try {
      const response = await http.get("doctors/available", {
        params: {
          date: date,
          shift: shift,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
