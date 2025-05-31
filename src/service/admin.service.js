import { http } from "./config";

export const adminService = {
  getUsers: (token) => {
    return http.get("admin/get-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getUserId: (id, token) => {
    return http.get(`admin/get-user/${id}`, {
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

  updatePasswordUser: (id, password, token) => {
    return http.put(
      `admin/update-user-password/${id}`,
      { password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  updateUserById: (id, data, token) => {
    return http.put(`admin/update-user/${id}`, data, {
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
