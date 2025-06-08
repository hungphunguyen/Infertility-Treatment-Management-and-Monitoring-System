import { http } from "./config";

export const blogService = {
  // Lấy tất cả blog
  getAllBlogs: () => {
    return http.get("blogs");
  },

  // Lấy blog theo id
  getBlogById: (id) => {
    return http.get(`blogs/${id}`);
  },

  // Lấy blog theo status
  getBlogsByStatus: (status) => {
    return http.get(`blogs/status/${status}`);
  },

  // Lấy blog theo author
  getBlogsByAuthor: (authorId) => {
    return http.get(`blogs/author/${authorId}`);
  },

  // Tạo blog mới
  createBlog: (data, token) => {
    return http.post("blogs", data);
  },

  // Cập nhật blog
  updateBlog: (blogId, userId, data) => {
    return http.put(`blogs/${blogId}/${userId}`, data);
  },

  // Submit blog
  submitBlog: (blogId, userId) => {
    return http.post(`blogs/submit/${blogId}/${userId}`);
  },

  // Duyệt blog (approve)
  approveBlog: (blogId, token) => {
    return http.post(`blogs/approve/${blogId}`);
  },

  // Từ chối blog (reject)
  rejectBlog: (blogId, token) => {
    return http.post(`blogs/reject/${blogId}`);
  },
}; 