import { http } from "./config";

export const treatmentService = {
  getTreatmentRecordsForManager: async () => {
    try {
      const response = await http.get("treatment-records/find-all/manager");
      console.log("Treatment records response:", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching treatment records:", error);
      throw error;
    }
  },

  getTreatmentRecordsByCustomer: async (customerId) => {
    try {
      const response = await http.get(`treatment-records/find-all/customer/${customerId}`);
      console.log("Customer treatment records:", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching customer treatment records:", error);
      throw error;
    }
  },

  getTreatmentRecordsByDoctor: async (doctorId) => {
    try {
      const response = await http.get(`treatment-records/find-all/doctor/${doctorId}`);
      console.log("Doctor treatment records:", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching doctor treatment records:", error);
      throw error;
    }
  },

  getTreatmentRecordById: async (id) => {
    try {
      const response = await http.get(`treatment-records/find-by-id/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching treatment record:", error);
      throw error;
    }
  },

  createTreatmentRecord: async (data) => {
    try {
      const response = await http.post("treatment-records", data);
      return response;
    } catch (error) {
      console.error("Error creating treatment record:", error);
      throw error;
    }
  },

  updateTreatmentRecord: async (id, data) => {
    try {
      const response = await http.put(`treatment-records/${id}`, data);
      return response;
    } catch (error) {
      console.error("Error updating treatment record:", error);
      throw error;
    }
  },

  deleteTreatmentRecord: async (id) => {
    try {
      const response = await http.delete(`treatment-records/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting treatment record:", error);
      throw error;
    }
  },

  calculateTreatmentProgress: (treatmentRecords) => {
    try {
      if (!treatmentRecords || !Array.isArray(treatmentRecords)) {
        return {
          totalPatients: 0,
          completedPatients: 0,
          inProgressPatients: 0,
          pendingPatients: 0,
          cancelledPatients: 0,
          completionRate: 0
        };
      }

      const stats = treatmentRecords.reduce((acc, record) => {
        // Tăng tổng số bệnh nhân
        acc.totalPatients++;

        // Phân loại theo trạng thái
        switch (record.status) {
          case 'Completed':
            acc.completedPatients++;
            break;
          case 'InProgress':
            acc.inProgressPatients++;
            break;
          case 'Pending':
            acc.pendingPatients++;
            break;
          case 'Cancelled':
            acc.cancelledPatients++;
            break;
          default:
            break;
        }

        return acc;
      }, {
        totalPatients: 0,
        completedPatients: 0,
        inProgressPatients: 0,
        pendingPatients: 0,
        cancelledPatients: 0
      });

      // Tính tỷ lệ hoàn thành
      stats.completionRate = stats.totalPatients > 0 
        ? Math.round((stats.completedPatients / stats.totalPatients) * 100) 
        : 0;

      return stats;
    } catch (error) {
      console.error("Error calculating treatment progress:", error);
      return {
        totalPatients: 0,
        completedPatients: 0,
        inProgressPatients: 0,
        pendingPatients: 0,
        cancelledPatients: 0,
        completionRate: 0
      };
    }
  },

  getDoctorPatientStats: (treatmentRecords, doctorName) => {
    try {
      if (!treatmentRecords || !Array.isArray(treatmentRecords)) {
        return {
          totalPatients: 0,
          completedPatients: 0,
          inProgressPatients: 0,
          pendingPatients: 0,
          cancelledPatients: 0,
          completionRate: 0
        };
      }

      // Lọc hồ sơ theo doctorName
      const doctorRecords = treatmentRecords.filter(record => record.doctorName === doctorName);

      const stats = doctorRecords.reduce((acc, record) => {
        acc.totalPatients++;

        switch (record.status) {
          case 'Completed':
            acc.completedPatients++;
            break;
          case 'InProgress':
            acc.inProgressPatients++;
            break;
          case 'Pending':
            acc.pendingPatients++;
            break;
          case 'Cancelled':
            acc.cancelledPatients++;
            break;
          default:
            break;
        }

        return acc;
      }, {
        totalPatients: 0,
        completedPatients: 0,
        inProgressPatients: 0,
        pendingPatients: 0,
        cancelledPatients: 0
      });

      // Tính tỷ lệ hoàn thành
      stats.completionRate = stats.totalPatients > 0 
        ? Math.round((stats.completedPatients / stats.totalPatients) * 100) 
        : 0;

      return stats;
    } catch (error) {
      console.error("Error calculating doctor patient stats:", error);
      return {
        totalPatients: 0,
        completedPatients: 0,
        inProgressPatients: 0,
        pendingPatients: 0,
        cancelledPatients: 0,
        completionRate: 0
      };
    }
  },

  getTreatmentRecordsByManager: async () => {
    try {
      const response = await http.get("treatment-records/find-all/manager");
      return response;
    } catch (error) {
      console.error("Error fetching treatment records by manager:", error);
      throw error;
    }
  }
};