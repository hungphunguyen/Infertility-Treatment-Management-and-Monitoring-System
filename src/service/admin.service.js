import { http } from "./config";

export const adminService = {
  getUsers: (token) => {
    return http.get("admin/get-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
