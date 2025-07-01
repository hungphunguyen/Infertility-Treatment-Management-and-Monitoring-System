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
      // Thử API mới trước
      try {
        const response = await http.get(`v1/treatment-records?doctorId=${doctorId}`);
        console.log('🔍 New API response for treatment records:', response.data);
        return response.data.result?.content || response.data.result || [];
      } catch (newApiError) {
        console.warn('API mới không hoạt động, thử API cũ:', newApiError);
        // Fallback to old API
        const oldResponse = await http.get(
          `/treatment-records/find-all/doctor/${doctorId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("🔍 Old API response for treatment records:", oldResponse.data);
        return oldResponse.data.result;
      }
    } catch (error) {
      console.error("Error fetching treatment records:", error);
      throw error;
    }
  },

  getTreatmentRecordById: async (id) => {
    try {
      console.log('🔍 Calling getTreatmentRecordById with id:', id);
      try {
        const response = await http.get(`v1/treatment-records/${id}`);
        console.log('✅ New API response for treatment record by id:', response.data);
        return response;
      } catch (newApiError) {
        console.warn('❌ New API failed, trying old API:', newApiError);
        // Fallback to old API
        const oldResponse = await http.get(`treatment-records/find-by-id/${id}`);
        console.log('✅ Old API response for treatment record by id:', oldResponse.data);
        return oldResponse;
      }
    } catch (error) {
      console.error("❌ Error fetching treatment record by id:", error);
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
      // Thử API mới trước
      try {
        const response = await http.get(`v1/appointments?doctorId=${doctorId}&date=${date}`);
        console.log('🔍 New API response for appointments:', response.data);
        return response;
      } catch (newApiError) {
        console.warn('API mới không hoạt động, thử API cũ:', newApiError);
        // Fallback to old API
        const oldResponse = await http.get(
          `appointments/doctor/${doctorId}/${date}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("🔍 Old API response for appointments:", oldResponse.data);
        return oldResponse;
      }
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
      throw error;
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      console.log('🔍 Updating appointment status:', { appointmentId, status });
      
      // Sử dụng format giống như confirmAppointmentChange
      try {
        const response = await http.put(`v1/appointments/${appointmentId}/status`, { 
          status: status,
          note: "Cập nhật trạng thái từ doctor dashboard"
        }, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        console.log('✅ API thành công:', response);
        return response;
      } catch (newApiError) {
        console.warn('❌ API mới không hoạt động, thử API cũ:', newApiError.response?.data);
        
        // Fallback to old API
        const oldResponse = await http.put(
          `/appointments/update-status/${appointmentId}/${status}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log('✅ API cũ thành công:', oldResponse);
        return oldResponse;
      }
    } catch (error) {
      console.error("❌ Error updating appointment status:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },

  updateTreatmentStep: async (id, data) => {
    try {
      console.log('🔍 Updating treatment step:', { id, data });
      
      // Sử dụng query parameters như curl command
      const response = await http.put(`v1/treatment-steps/${id}`, null, {
        params: {
          scheduledDate: data.scheduledDate,
          actualDate: data.actualDate,
          status: data.status,
          notes: data.notes,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      
      console.log('✅ Treatment step updated successfully:', response);
      return response;
    } catch (error) {
      console.error("❌ Error updating treatment step:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },

  // API cập nhật trạng thái treatment step theo format mới
  updateTreatmentStepStatus: async (stepId, statusData) => {
    try {
      console.log('🔍 Updating treatment step status:', { stepId, statusData });
      
      const response = await http.put(`v1/treatment-steps/${stepId}`, statusData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      
      console.log('✅ Treatment step status updated successfully:', response);
      return response;
    } catch (error) {
      console.error("❌ Error updating treatment step status:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },

  createAppointment: async (data) => {
    try {
      // Thử API mới trước
      try {
        const response = await http.post("v1/appointments", data, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        return response;
      } catch (newApiError) {
        console.warn('API mới không hoạt động, thử API cũ:', newApiError);
        // Fallback to old API
        const oldResponse = await http.post("appointments", data, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        return oldResponse;
      }
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

  getAppointmentsByStepId: async (stepId) => {
    try {
      // Thử API mới trước
      try {
        const response = await http.get(`v1/appointments?stepId=${stepId}`);
        return response;
      } catch (newApiError) {
        console.warn('API mới không hoạt động, thử API cũ:', newApiError);
        // Fallback to old API
        const oldResponse = await http.get(`appointments/get-by-step-id/${stepId}`);
        return oldResponse;
      }
    } catch (error) {
      console.error("Error fetching appointments by step id:", error);
      throw error;
    }
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
    try {
      console.log('🔍 Updating treatment status:', { recordId, status });
      
      // Thử API mới trước
      try {
        const response = await http.put(`v1/treatment-records/${recordId}/status`, { status }, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        console.log('✅ API mới thành công:', response);
        return response;
      } catch (newApiError) {
        console.warn('❌ API mới không hoạt động, thử format khác:', newApiError.response?.data);
        
        // Thử API mới với query params
        try {
          const response = await http.put(`v1/treatment-records/${recordId}/status?status=${status}`, null, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
          console.log('✅ API mới với query params thành công:', response);
          return response;
        } catch (queryError) {
          console.warn('❌ API mới với query params cũng không hoạt động:', queryError.response?.data);
          
          // Thử API mới với body khác
          try {
            const response = await http.put(`v1/treatment-records/${recordId}/status`, { 
              recordId: recordId,
              status: status 
            }, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });
            console.log('✅ API mới với body khác thành công:', response);
            return response;
          } catch (bodyError) {
            console.warn('❌ API mới với body khác cũng không hoạt động:', bodyError.response?.data);
            
            // Fallback to old API
            const oldResponse = await http.put(
              `/treatment-records/update-status/${recordId}/${status}`,
              null,
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );
            console.log('✅ API cũ thành công:', oldResponse);
            return oldResponse;
          }
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
    try {
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
    } catch (error) {
      console.error("Error requesting appointment change:", error);
      throw error;
    }
  },

  getDoctorChangeRequests: async (doctorId) => {
    try {
      // Thử API mới trước
      try {
        const response = await http.get(`v1/appointments?doctorId=${doctorId}&status=PENDING_CHANGE`);
        return response;
      } catch (newApiError) {
        console.warn('API mới không hoạt động, thử API cũ:', newApiError);
        // Fallback to old API
        const oldResponse = await http.get(
          `/appointments/with-status-pending-change/${doctorId}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        return oldResponse;
      }
    } catch (error) {
      console.error("Error fetching doctor change requests:", error);
      throw error;
    }
  },

  // Xác nhận thay đổi lịch hẹn - API mới
  confirmAppointmentChange: async (appointmentId, data) => {
    try {
      // Thử API mới trước
      try {
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
        console.log('✅ New API success:', response);
        return response;
      } catch (newApiError) {
        console.warn('❌ New API failed, trying old API:', newApiError);
        // Fallback to old API
        const oldResponse = await http.put(
          `appointments/confirm-appointment/${appointmentId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log('✅ Old API success:', oldResponse);
        return oldResponse;
      }
    } catch (error) {
      console.error("❌ Error confirming appointment change:", error);
      throw error;
    }
  },

  // Lấy tất cả treatment records của một bác sĩ
  getAllTreatmentRecordsByDoctor: async (doctorId) => {
    try {
      // Thử API mới trước
      try {
        const response = await http.get(`v1/treatment-records?doctorId=${doctorId}&size=1000`);
        return response;
      } catch (newApiError) {
        console.warn('API mới không hoạt động, thử API cũ:', newApiError);
        // Fallback to old API
        const oldResponse = await http.get(`treatment-records/find-all/doctor/${doctorId}`);
        return oldResponse;
      }
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả appointments của một bác sĩ
  getAllAppointmentsByDoctor: async (doctorId) => {
    try {
      // Thử API mới trước
      try {
        const response = await http.get(`v1/appointments?doctorId=${doctorId}&size=1000`);
        return response;
      } catch (newApiError) {
        console.warn('API mới không hoạt động, thử API cũ:', newApiError);
        // Fallback to old API
        const oldResponse = await http.get(`appointments/get-all-for-doctor/${doctorId}`);
        return oldResponse;
      }
    } catch (error) {
      throw error;
    }
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
      if (params.customerId) queryParams.append('customerId', params.customerId);
      if (params.doctorId) queryParams.append('doctorId', params.doctorId);
      if (params.status) queryParams.append('status', params.status);
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      // Thử API mới trước
      const url = `v1/treatment-records?${queryParams.toString()}`;
      try {
        const response = await http.get(url);
        return response;
      } catch (newApiError) {
        // Fallback to old API
        if (params.customerId) {
          const oldUrl = `treatment-records/find-all/customer/${params.customerId}`;
          const oldResponse = await http.get(oldUrl);
          return oldResponse;
        } else {
          throw newApiError;
        }
      }
    } catch (error) {
      console.error("❌ Error fetching treatment records:", error);
      throw error;
    }
  },

  // Cập nhật ngày CD1 - API mới
  updateCd1Date: async (recordId, cd1Date) => {
    try {
      const response = await http.put(`v1/treatment-records/${recordId}/cd1?cd1=${cd1Date}`);
      return response;
    } catch (error) {
      console.error("Error updating CD1 date:", error);
      throw error;
    }
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
      if (params.stepId) queryParams.append('stepId', params.stepId);
      if (params.customerId) queryParams.append('customerId', params.customerId);
      if (params.doctorId) queryParams.append('doctorId', params.doctorId);
      if (params.date) queryParams.append('date', params.date);
      if (params.status) queryParams.append('status', params.status);
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
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
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.name) queryParams.append('name', params.name);
      if (params.typeId) queryParams.append('typeId', params.typeId);
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
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.name) queryParams.append('name', params.name);
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
      const response = await http.get(`v1/treatment-stages/${typeId}/find-by-type`);
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
      
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.name) queryParams.append('name', params.name);
      if (params.specialization) queryParams.append('specialization', params.specialization);

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
      const response = await http.get(`v1/doctors/${doctorId}/work-schedule?date=${date}`);
      return response;
    } catch (error) {
      console.error("Error fetching doctor work schedule:", error);
      throw error;
    }
  },

  // Lấy thống kê tổng quan lịch làm việc của bác sĩ hôm nay (manager dashboard)
  getManagerWorkScheduleStatistics: async () => {
    try {
      const response = await http.get('v1/dashboard/manager/work-schedules/statistics');
      return response;
    } catch (error) {
      console.error('Error fetching manager work schedule statistics:', error);
      throw error;
    }
  },

  // Lấy danh sách bác sĩ làm việc hôm nay (manager dashboard)
  getManagerDoctorsToday: async () => {
    try {
      const response = await http.get('v1/dashboard/manager/work-schedules/doctor-today');
      return response;
    } catch (error) {
      console.error('Error fetching manager doctors today:', error);
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
};