import { http } from "./config";
import axios from "axios";

export const treatmentService = {
  getTreatmentRecordsForManager: async () => {
    try {
      const response = await http.get("treatment-records/find-all/manager");
      return response;
    } catch (error) {
      console.error("Error fetching treatment records:", error);
      throw error;
    }
  },

  getTreatmentRecordsByCustomer: async (customerId) => {
    try {
      const response = await http.get(
        `treatment-records/find-all/customer/${customerId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getTreatmentRecordsByDoctor: async (doctorId) => {
    try {
      const response = await http.get(
        `/treatment-records/find-all/doctor/${doctorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Doctor treatment records raw response:", response);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching treatment records:", error);
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
          completionRate: 0,
        };
      }

      const stats = treatmentRecords.reduce(
        (acc, record) => {
          acc.totalPatients++;

          switch (record.status) {
            case "Completed":
              acc.completedPatients++;
              break;
            case "InProgress":
              acc.inProgressPatients++;
              break;
            case "Pending":
              acc.pendingPatients++;
              break;
            case "Cancelled":
              acc.cancelledPatients++;
              break;
            default:
              break;
          }

          return acc;
        },
        {
          totalPatients: 0,
          completedPatients: 0,
          inProgressPatients: 0,
          pendingPatients: 0,
          cancelledPatients: 0,
        }
      );

      stats.completionRate =
        stats.totalPatients > 0
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
        completionRate: 0,
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
          completionRate: 0,
        };
      }

      const doctorRecords = treatmentRecords.filter(
        (record) => record.doctorName === doctorName
      );

      const stats = doctorRecords.reduce(
        (acc, record) => {
          acc.totalPatients++;

          switch (record.status) {
            case "Completed":
              acc.completedPatients++;
              break;
            case "InProgress":
              acc.inProgressPatients++;
              break;
            case "Pending":
              acc.pendingPatients++;
              break;
            case "Cancelled":
              acc.cancelledPatients++;
              break;
            default:
              break;
          }

          return acc;
        },
        {
          totalPatients: 0,
          completedPatients: 0,
          inProgressPatients: 0,
          pendingPatients: 0,
          cancelledPatients: 0,
        }
      );

      stats.completionRate =
        stats.totalPatients > 0
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
        completionRate: 0,
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
  },

  getAllAppointments: async () => {
    try {
      const response = await http.get("appointments/get-all");
      return response;
    } catch (error) {
      console.error("Error fetching all appointments:", error);
      throw error;
    }
  },

  getDoctorAppointmentsByDate: async (doctorId, date) => {
    try {
      const response = await http.get(
        `appointments/doctor/${doctorId}/${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
      throw error;
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await http.put(
        `/appointments/update-status/${appointmentId}/${status}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  },

  updateTreatmentStep: async (id, data) => {
    try {
      const response = await http.put(`treatment-step/${id}`, null, {
        params: {
          scheduledDate: data.scheduledDate,
          actualDate: data.actualDate,
          status: data.status,
          notes: data.notes,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating treatment step:", error);
      throw error;
    }
  },

  createAppointment: async (data) => {
    try {
      const response = await http.post("appointments", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  cancelTreatmentRecord: async (recordId, customerId) => {
    try {
      const response = await http.delete(
        `treatment-service/cancel/${recordId}/${customerId}`
      );
      return response;
    } catch (error) {
      console.error("Error cancelling treatment record:", error);
      throw error;
    }
  },

  getAppointmentsByStepId: (stepId) => {
    return http.get(`/appointments/get-by-step-id/${stepId}`);
  },

  // Lấy danh sách appointment của customer
  getCustomerAppointments: async (customerId) => {
    try {
      const response = await http.get(`/appointments/customer/${customerId}`);
      return response;
    } catch (error) {
      console.error("Error fetching customer appointments:", error);
      throw error;
    }
  },

  getTreatmentRecordsByCustomerId: (customerId) => {
    return http.get(`/treatment-records/find-all/customer/${customerId}`);
  },

  updateTreatmentRecordStatus: async (recordId, status) => {
    try {
      const response = await http.put(
        `/treatment-records/update-status/${recordId}/${status}`
      );
      return response;
    } catch (error) {
      console.error("Error updating treatment record status:", error);
      throw error;
    }
  },
  updateTreatmentStatus: async (recordId, status) => {
    return await http.put(
      `/treatment-records/update-status/${recordId}/${status}`
    );
  },
  // Gửi yêu cầu đổi lịch hẹn (customer)

  requestChangeAppointment: async (appointmentId, data) => {
    return await fetch(
      `${
        process.env.REACT_APP_API_URL ||
        "http://35.76.121.154/infertility-system-api"
      }/appointments/request-change/${appointmentId}`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      }
    ).then((res) => res.json());
  },
};
