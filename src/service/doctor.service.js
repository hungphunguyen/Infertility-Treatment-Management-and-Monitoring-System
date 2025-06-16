import { http } from "./config";
import { getLocgetlStorage } from "../utils/util";

// Đặt biến API_URL dùng cho fetch
const API_URL = import.meta.env.VITE_API_URL || 'http://18.183.187.237/infertility-system-api';

export const doctorService = {
  // Lấy danh sách tất cả bác sĩ
  getAllDoctors: async () => {
    try {
      const response = await http.get("doctors");
      
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
        params: { id }
      });
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
          shift: shift
        }
      });
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

  // Lấy lịch làm việc của bác sĩ theo ngày
  getDoctorSchedulesByDate: async (date) => {
    try {
      const response = await http.get(`doctors/schedules/${date}`);
      return response;
    } catch (error) {
      throw error;
    }
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

  getDashboardStatics: (doctorId) => {
    return http.get(`/doctors/dashboard/statics/${doctorId}`);
  },

  getDoctorFeedback: async (doctorId, isApproval) => {
    try {
      const response = await http.get(`feedback/for-doctor/${isApproval}/${doctorId}`);
      return response;
    } catch (error) {
      throw error;
    }
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

  // Lấy danh sách các appointment có yêu cầu đổi lịch (pending change) cho bác sĩ
  getAppointmentsWithPendingChange: async (doctorId) => {
    try {
      const response = await http.get(`appointments/with-status-pending-change/${doctorId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Duyệt hoặc hủy yêu cầu đổi lịch (PUT)
  confirmAppointmentChange: async (appointmentId, data) => {
    try {
      const response = await fetch(
        `${API_URL}/appointments/confirm-appointment/${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
}; 