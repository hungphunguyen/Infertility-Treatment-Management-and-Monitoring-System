import { http } from "./config";

export const adminService = {
  getUsers: (token) => {
    return http.get("admin/get-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getRemovedUsers: (token) => {
    return http.get("admin/get-users-removed", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteUser: (data, token) => {
    return http.delete(`admin/remove-user/${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  restoreUser: (data, token) => {
    console.log(token);
    return http.put(`admin/restore-user/${data}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateRoleUser: (id, roleName, token) => {
    return http.put(`admin/update-role/${id}?roleName=${roleName}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createUser: (data, token) => {
    return http.post("admin/create-user", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
