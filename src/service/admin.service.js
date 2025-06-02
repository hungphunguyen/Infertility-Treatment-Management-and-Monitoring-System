import { http } from "./config";

export const adminService = {
  getUsers: () => {
    return http.get("admin/get-users");
  },

  getUserId: (id) => {
    return http.get(`admin/get-user/${id}`);
  },

  getRemovedUsers: () => {
    return http.get("admin/get-users-removed");
  },

  deleteUser: (data) => {
    return http.delete(`admin/remove-user/${data}`);
  },
  restoreUser: (data) => {
    return http.put(`admin/restore-user/${data}`, null);
  },

  updatePasswordUser: (id, password) => {
    return http.put(`admin/update-user-password/${id}`, { password });
  },

  updateUserById: (id, data) => {
    return http.put(`admin/update-user/${id}`, data);
  },

  createUser: (data) => {
    return http.post("admin/create-user", data);
  },
};
