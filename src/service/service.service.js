import { http } from "./config";
import { getLocgetlStorage } from "../utils/util";

export const serviceService = {
  // Lấy danh sách tất cả dịch vụ
  getAllServices: async () => {
    try {
      const response = await http.get("treatment-service");
      console.log("📦 Services API response:", response.data);
      return response;
    } catch (error) {
      console.error("💥 Error fetching services:", error);
      throw error;
    }
  },
  
  // Lấy danh sách dịch vụ chưa bị xóa
  getAllNonRemovedServices: async () => {
    try {
      const response = await http.get("treatment-service/not-removed");
      console.log("📦 Non-removed services API response:", response.data);
      return response;
    } catch (error) {
      console.error("💥 Error fetching non-removed services:", error);
      throw error;
    }
  },
  
  // Lấy chi tiết dịch vụ theo ID
  getServiceById: async (serviceId) => {
    try {
      const response = await http.get(`treatment-service/${serviceId}`);
      console.log(`📦 Service ${serviceId} details:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error fetching service ${serviceId}:`, error);
      throw error;
    }
  },
  
  // Lấy danh sách loại điều trị
  getAllTreatmentTypes: async () => {
    try {
      const response = await http.get("treatment-type");
      console.log("📦 Treatment types:", response.data);
      return response;
    } catch (error) {
      console.error("💥 Error fetching treatment types:", error);
      throw error;
    }
  },
  
  // Tìm loại điều trị theo tên
  getTreatmentTypeByName: async (name) => {
    try {
      const response = await http.get(`treatment-type/find-by-name/${name}`);
      console.log(`📦 Treatment type ${name}:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error fetching treatment type ${name}:`, error);
      throw error;
    }
  },
  
  // Lấy danh sách các giai đoạn điều trị
  getAllTreatmentStages: async () => {
    try {
      const response = await http.get("treatment-stages");
      console.log("📦 Treatment stages:", response.data);
      return response;
    } catch (error) {
      console.error("💥 Error fetching treatment stages:", error);
      throw error;
    }
  },
  
  // Lấy giai đoạn điều trị theo loại
  getTreatmentStagesByTypeId: async (typeId) => {
    try {
      const response = await http.get(`treatment-stages/find-by-type/${typeId}`);
      console.log(`📦 Treatment stages for type ${typeId}:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error fetching treatment stages for type ${typeId}:`, error);
      throw error;
    }
  },

  // Đăng ký dịch vụ điều trị
  registerTreatmentService: async (data) => {
    try {
      const token = getLocgetlStorage("token");
      const response = await http.post("treatment-service/register", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("✅ Treatment service registered:", response.data);
      return response;
    } catch (error) {
      console.error("💥 Error registering treatment service:", error);
      throw error;
    }
  },

  // Tạo dịch vụ mới (yêu cầu xác thực)
  createTreatmentService: async (data) => {
    try {
      const token = getLocgetlStorage("token");
      const response = await http.post("treatment-service", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("✅ Service created:", response.data);
      return response;
    } catch (error) {
      console.error("💥 Error creating service:", error);
      throw error;
    }
  },

  // Cập nhật dịch vụ (yêu cầu xác thực)
  updateTreatmentService: async (serviceId, data) => {
    try {
      const token = getLocgetlStorage("token");
      const response = await http.put(`treatment-service/${serviceId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`✅ Service ${serviceId} updated:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error updating service ${serviceId}:`, error);
      throw error;
    }
  },

  // Xóa dịch vụ (yêu cầu xác thực)
  deleteTreatmentService: async (serviceId) => {
    try {
      const token = getLocgetlStorage("token");
      const response = await http.delete(`treatment-service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`✅ Service ${serviceId} deleted:`, response.data);
      return response;
    } catch (error) {
      console.error(`💥 Error deleting service ${serviceId}:`, error);
      throw error;
    }
  }
}; 