import { http } from "./config";

export const managerService = {
  getWorkScheduleMonth: (id) => {
    return http.get(`work-schedule/this-month/${id}`);
  },

  createWorkScheduleBulk: (payload) => {
    return http.post("work-schedule/bulk-create", payload);
  },

  createWorkScheduleByDay: (data) => {
    return http.post("work-schedule", data);
  },

  deleteWorkSchedule: (date, doctorId) => {
    return http.delete(`work-schedule/${date}/${doctorId}`);
  },

  updateWorkSchedule: (doctorId, data) => {
    return http.put(`work-schedule/${doctorId}`, data);
  },
};
