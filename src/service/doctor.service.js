import { http } from "./config";

export const doctorService = {
  // Lấy danh sách tất cả bác sĩ
  getAllDoctors: () => {
    return http.get("doctors");
  },
  
  // Lấy thông tin chi tiết một bác sĩ
  getDoctorById: (id) => {
    return http.get(`doctors/${id}`);
  },
  
  // Cập nhật thông tin bác sĩ
  updateDoctor: (id, data) => {
    return http.put("doctors", data, {
      params: { id }
    });
  }
}; 