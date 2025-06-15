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
  createBlog: (userId, data) => {
    return http.post(`blogs/${userId}`, {
      title: data.title,
      content: data.content,
      sourceReference: data.sourceReference
    });
  },

  // Cập nhật blog
  updateBlog: (blogId, userId, data) => {
    return http.put(`blogs/${blogId}/${userId}`, data);
  },

  // Tải ảnh blog
  uploadBlogImage: (data, blogId, token) => {
    return http.put(`blogs/update/img?blogId=${blogId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Gửi duyệt blog
  submitBlog: (blogId, userId, token, data) => {
    return http.post(`blogs/submit/${blogId}/${userId}`, {
      title: data.title,
      content: data.content,
      sourceReference: data.sourceReference
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  },

  // Duyệt blog (approve)
  approveBlog: (blogId, managerId, token) => {
    return http.post(`blogs/${blogId}/${managerId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  updateBlogStatus: (blogId, status, token) => {
    return http.put(`blogs/${blogId}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteBlog: (blogId, token) => {
    return http.delete(`blogs/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
}; 