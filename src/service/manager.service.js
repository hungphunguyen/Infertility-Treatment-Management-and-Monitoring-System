import { http } from "./config";

export const managerService = {
  getWorkScheduleMonth: (id) => {
    return http.get(`work-schedule/this-month/${id}`);
  },

  getTreatmentType: () => {
    return http.get("treatment-type");
  },

  getTreatmentService: () => {
    return http.get("treatment-service");
  },

  getTreatmentServiceDetail: (id) => {
    return http.get(`treatment-service/${id}`);
  },

  getAllFeedback: () => {
    return http.get("feedback/get-all");
  },

  createWorkScheduleBulk: (payload) => {
    return http.post("work-schedule/bulk-create", payload);
  },

  createWorkScheduleByDay: (data) => {
    return http.post("work-schedule", data);
  },

  createTreatStage: (data) => {
    return http.post("treatment-stages", data);
  },

  createTreatType: (data) => {
    return http.post("treatment-type", data);
  },

  createTreatService: (data) => {
    return http.post("treatment-service", data);
  },

  deleteWorkSchedule: (date, doctorId) => {
    return http.delete(`work-schedule/${date}/${doctorId}`);
  },

  updateWorkSchedule: (doctorId, data) => {
    return http.put(`work-schedule/${doctorId}`, data);
  },

  updateTreatmentService: (id, data) => {
    return http.put(`treatment-service/${id}`, data);
  },

  deleteTreatmentService: (id) => {
    return http.delete(`treatment-service/${id}`);
  },

  restoreTreatmentService: (id) => {
    return http.put(`treatment-service/restore/${id}`, null);
  },

  managerStatistic: () => {
    return http.get("managers/dashboard/statistic");
  },

  managerChart: () => {
    return http.get("managers/dashboard/chart");
  },

  managerDashboardService: () => {
    return http.get("managers/dashboard/service");
  },

  confirmFeedback: (id, data) => {
    return http.put(`feedback/${id}`, data);
  },

  getWorkScheduleStatics: () => {
    return http.get("managers/dashboard/work-schedules/statics/");
  },
};
