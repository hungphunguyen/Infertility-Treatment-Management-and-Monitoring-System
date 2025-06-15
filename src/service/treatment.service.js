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
};
