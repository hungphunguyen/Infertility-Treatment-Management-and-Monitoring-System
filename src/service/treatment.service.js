import { http } from "./config";
import axios from "axios";

export const treatmentService = {
  getTreatmentRecordsByDoctor: async (doctorId) => {
    return await http.get(`v1/treatment-records?doctorId=${doctorId}`);
  },

  getTreatmentRecordById: async (id) => {
    return await http.get(`v1/treatment-records/${id}`);
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

  getAppointmentBycustomer: (customerId, page, size) => {
    return http.get(`v1/appointments`, {
      params: {
        customerId,
        page,
        size,
      },
    });
  },

  getAppointmentBycustomerDetail: (appointmentId) => {
    return http.get(`v1/appointments/${appointmentId}`);
  },

  getDoctorAppointmentsByDate: async (doctorId, date) => {
    return await http.get(`v1/appointments?doctorId=${doctorId}&date=${date}`);
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    // Sử dụng format giống như confirmAppointmentChange
    const response = await http.put(
      `v1/appointments/${appointmentId}/status`,
      {
        status: status,
        note: "Cập nhật trạng thái từ doctor dashboard",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response;
  },

  updateTreatmentStep: async (id, data) => {
    try {
      // Luôn truyền đủ stageId, startDate, endDate, status, notes
      const params = {
        stageId: data.stageId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        notes: data.notes,
      };
      const response = await http.put(`v1/treatment-steps/${id}`, null, {
        params,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Error updating treatment step:", error);
      throw error;
    }
  },

  // API cập nhật trạng thái treatment step theo format mới
  updateTreatmentStepStatus: async (stepId, statusData) => {
    try {
      console.log("🔍 Updating treatment step status:", { stepId, statusData });

      const response = await http.put(
        `v1/treatment-steps/${stepId}`,
        statusData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response;
    } catch (error) {}
  },

  createAppointment: (data) => {
    // Thử API mới trước
    return http.post("v1/appointments", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  },

  getAppointmentsByStepId: async (stepId) => {
    return await http.get(`v1/appointments?stepId=${stepId}`);
  },

  updateTreatmentStatus: async (recordId, status) => {
    try {
      console.log("🔍 Updating treatment status:", { recordId, status });

      // Thử API mới trước
      try {
        const response = await http.put(
          `v1/treatment-records/${recordId}/status`,
          { status },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("✅ API mới thành công:", response);
        return response;
      } catch (newApiError) {
        console.warn(
          "❌ API mới không hoạt động, thử format khác:",
          newApiError.response?.data
        );

        // Thử API mới với query params
        try {
          const response = await http.put(
            `v1/treatment-records/${recordId}/status?status=${status}`,
            null,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          console.log("✅ API mới với query params thành công:", response);
          return response;
        } catch (queryError) {
          console.warn(
            "❌ API mới với query params cũng không hoạt động:",
            queryError.response?.data
          );

          // Thử API mới với body khác
          try {
            const response = await http.put(
              `v1/treatment-records/${recordId}/status`,
              {
                recordId: recordId,
                status: status,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );
            console.log("✅ API mới với body khác thành công:", response);
            return response;
          } catch (bodyError) {}
        }
      }
    } catch (error) {
      console.error("❌ Error updating treatment status:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },

  // Gửi yêu cầu đổi lịch hẹn (customer)
  requestChangeAppointment: async (appointmentId, data) => {
    const response = await http.put(
      `v1/appointments/${appointmentId}/customer-change`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response;
  },

  getDoctorChangeRequests: async (doctorId) => {
    const response = await http.get(
      `v1/appointments?doctorId=${doctorId}&status=PENDING_CHANGE`
    );
    return response;
  },

  // Xác nhận thay đổi lịch hẹn - API mới
  confirmAppointmentChange: async (appointmentId, data) => {
    const response = await http.put(
      `v1/appointments/${appointmentId}/status`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log("✅ New API success:", response);
    return response;
  },

  // Lấy tất cả treatment records của một bác sĩ
  getAllTreatmentRecordsByDoctor: async (doctorId) => {
    const response = await http.get(
      `v1/treatment-records?doctorId=${doctorId}&size=1000`
    );
    return response;
  },

  // Lấy tất cả appointments của một bác sĩ
  getAllAppointmentsByDoctor: async (doctorId) => {
    const response = await http.get(
      `v1/appointments?doctorId=${doctorId}&size=1000`
    );
    return response;
  },

  // ===== API MỚI CHO CUSTOMER COMPONENTS =====

  // Đăng ký dịch vụ điều trị - API mới
  registerTreatmentService: async (data) => {
    try {
      const response = await http.post("v1/treatment-records/register", data);
      return response;
    } catch (error) {
      console.error("Error registering treatment service:", error);
      throw error;
    }
  },

  // Lấy danh sách treatment records - API mới
  getTreatmentRecords: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.customerId)
        queryParams.append("customerId", params.customerId);
      if (params.doctorId) queryParams.append("doctorId", params.doctorId);
      if (params.status) queryParams.append("status", params.status);
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      // Thử API mới trước
      const url = `v1/treatment-records?${queryParams.toString()}`;
      try {
        const response = await http.get(url);
        return response;
      } catch (newApiError) {}
    } catch (error) {
      console.error("❌ Error fetching treatment records:", error);
      throw error;
    }
  },

  // Cập nhật ngày CD1 - API mới
  updateCd1Date: async (recordId, cd1Date) => {
    try {
      const response = await http.put(
        `v1/treatment-records/${recordId}/cd1?cd1=${cd1Date}`
      );
      return response;
    } catch (error) {}
  },

  // Hủy treatment record - API mới
  cancelTreatmentRecord: async (recordId) => {
    try {
      const response = await http.delete(`v1/treatment-records/${recordId}/cancel`);
      return response;
    } catch (error) {
      console.error("Error cancelling treatment record:", error);
      throw error;
    }
  },

  // Lấy chi tiết appointment theo ID - API mới
  getAppointmentById: async (appointmentId) => {
    try {
      const response = await http.get(`v1/appointments/${appointmentId}`);
      return response;
    } catch (error) {
      console.error("Error fetching appointment by id:", error);
      throw error;
    }
  },

  // Lấy appointments với các tham số lọc - API mới
  getAppointments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.stepId) queryParams.append("stepId", params.stepId);
      if (params.customerId)
        queryParams.append("customerId", params.customerId);
      if (params.doctorId) queryParams.append("doctorId", params.doctorId);
      if (params.date) queryParams.append("date", params.date);
      if (params.status) queryParams.append("status", params.status);
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      const url = `v1/appointments?${queryParams.toString()}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },

  // ===== API MỚI CHO DOCTOR =====

  // Tạo lịch hẹn cho treatment step - API mới
  createAppointmentForStep: async (data) => {
    try {
      const response = await http.post("v1/appointments", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Error creating appointment for step:", error);
      throw error;
    }
  },

  // Lấy danh sách treatment services - API mới
  getTreatmentServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      if (params.name) queryParams.append("name", params.name);
      if (params.typeId) queryParams.append("typeId", params.typeId);
      const url = `v1/treatment-services?${queryParams.toString()}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error("Error fetching treatment services:", error);
      throw error;
    }
  },

  // Lấy danh sách treatment types - API mới
  getTreatmentTypes: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      if (params.name) queryParams.append("name", params.name);
      const url = `v1/treatment-types?${queryParams.toString()}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error("Error fetching treatment types:", error);
      throw error;
    }
  },

  // Lấy treatment stages theo type ID - API mới
  getTreatmentStagesByType: async (typeId) => {
    try {
      const response = await http.get(
        `v1/treatment-stages/${typeId}/find-by-type`
      );
      return response;
    } catch (error) {
      console.error("Error fetching treatment stages by type:", error);
      throw error;
    }
  },

  // Lấy chi tiết treatment service - API mới
  getTreatmentServiceById: async (serviceId) => {
    try {
      const response = await http.get(`v1/treatment-services/${serviceId}`);
      return response;
    } catch (error) {
      console.error("Error fetching treatment service by id:", error);
      throw error;
    }
  },

  // Lấy chi tiết treatment type - API mới
  getTreatmentTypeById: async (typeId) => {
    try {
      const response = await http.get(`v1/treatment-types/${typeId}`);
      return response;
    } catch (error) {
      console.error("Error fetching treatment type by id:", error);
      throw error;
    }
  },

  // Lấy danh sách doctors - API mới
  getDoctors: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      if (params.name) queryParams.append("name", params.name);
      if (params.specialization)
        queryParams.append("specialization", params.specialization);

      const url = `v1/doctors?${queryParams.toString()}`;
      const response = await http.get(url);
      return response;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  },

  // Lấy chi tiết doctor - API mới
  getDoctorById: async (doctorId) => {
    try {
      const response = await http.get(`v1/doctors/${doctorId}`);
      return response;
    } catch (error) {
      console.error("Error fetching doctor by id:", error);
      throw error;
    }
  },

  // Lấy lịch làm việc của bác sĩ - API mới
  getDoctorWorkSchedule: async (doctorId, date) => {
    try {
      const response = await http.get(
        `v1/doctors/${doctorId}/work-schedule?date=${date}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching doctor work schedule:", error);
      throw error;
    }
  },

  // Lấy thống kê tổng quan lịch làm việc của bác sĩ hôm nay (manager dashboard)
  getManagerWorkScheduleStatistics: async () => {
    try {
      const response = await http.get(
        "v1/dashboard/manager/work-schedules/statistics"
      );
      return response;
    } catch (error) {
      console.error("Error fetching manager work schedule statistics:", error);
      throw error;
    }
  },

  // Lấy danh sách bác sĩ làm việc hôm nay (manager dashboard)
  getManagerDoctorsToday: async () => {
    try {
      const response = await http.get(
        "v1/dashboard/manager/work-schedules/doctor-today"
      );
      return response;
    } catch (error) {
      console.error("Error fetching manager doctors today:", error);
      throw error;
    }
  },
  getAppointmentsV1: async (params) => {
    // params: { doctorId, date, page, size, ... }
    try {
      const response = await http.get("v1/appointments", { params });
      return response;
    } catch (error) {
      console.error("Error fetching appointments v1:", error);
      throw error;
    }
  },

  // Lấy danh sách dịch vụ điều trị cho select (API mới)
  getAllServicesForSelect: async () => {
    try {
      const response = await http.get("v1/treatment-services/select");
      return response;
    } catch (error) {
      console.error("Error fetching all services for select:", error);
      throw error;
    }
  },

  // Đổi dịch vụ điều trị cho treatment record (API mới)
  updateTreatmentRecordService: async (recordId, serviceId) => {
    try {
      const response = await http.put(`v1/treatment-records/${recordId}`, { serviceId });
      return response;
    } catch (error) {
      console.error("Error updating treatment record service:", error);
      throw error;
    }
  },

  // Lấy danh sách stage theo serviceId (API mới)
  getStagesByServiceId: async (serviceId) => {
    try {
      const response = await http.get(`v1/treatment-stages/${serviceId}/find-by-service`);
      return response;
    } catch (error) {
      console.error("Error fetching stages by serviceId:", error);
      throw error;
    }
  },

  // Tạo bước điều trị mới (API mới)
  createTreatmentStep: async (data) => {
    try {
      const response = await http.post("v1/treatment-steps", data);
      return response;
    } catch (error) {
      console.error("Error creating treatment step:", error);
      throw error;
    }
  },

  // Lấy danh sách stage cho select khi tạo bước điều trị
  getSelectableStagesByServiceId: async (serviceId) => {
    try {
      const response = await http.get(`v1/treatment-stages/${serviceId}/select`);
      return response;
    } catch (error) {
      console.error("Error fetching selectable stages by serviceId:", error);
      throw error;
    }
  },

  // Lấy chi tiết step theo id (lấy treatmentStageId)
  getTreatmentStepById: async (stepId) => {
    try {
      const response = await http.get(`v1/treatment-steps/${stepId}`);
      return response;
    } catch (error) {
      console.error("Error fetching treatment step by id:", error);
      throw error;
    }
  },
};
