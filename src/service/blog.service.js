import { http } from "./config";

export const blogService = {
  // Lấy tất cả blog (API mới)
  getAllBlogs: ({ status, keyword, page, size, authorId }) => {
    return http.get("/v1/blogs", {
      params: {
        status,
        keyword,
        page,
        size,
        authorId,
      },
    });
  },

  // Lấy blog theo id (API mới)
  getBlogById: (id) => {
    return http.get(`/v1/blogs/${id}`);
  },

  // Lấy blog theo status (trang public)
  getBlogsByStatus: (status) => {
    return http.get(`blogs/status/${status}`);
  },

  // Lấy blog theo author
  getBlogsByAuthor: (authorId) => {
    return http.get(`blogs/author/${authorId}`);
  },

  // Tạo blog mới (API mới)
  createBlog: (data) => {
    // data: { title, content, sourceReference }
    return http.post("/v1/blogs", data);
  },

  // Cập nhật blog (API mới)
  updateBlog: (blogId, data) => {
    // data: { title, content, sourceReference }
    return http.put(`/v1/blogs/${blogId}`, data);
  },

  // Upload/cập nhật ảnh blog (API mới)
  uploadBlogImage: (blogId, formData) => {
    return http.put(`/v1/blogs/${blogId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  // Gửi blog chờ duyệt (API mới)
  submitBlog: (blogId, data) => {
    // data: { title, content, sourceReference }
    return http.post(`/v1/blogs/${blogId}/submit`, data);
  },

  // Cập nhật trạng thái blog (API mới)
  updateBlogStatus: (blogId, status, comment) => {
    return http.put(`/v1/blogs/${blogId}/updateStatus`, { 
      status: status,
      comment: comment || "" 
    });
  },

  deleteBlog: (blogId, token) => {
    return http.delete(`blogs/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getBlogPublic: (keyWord, page, size) => {
    return http.get(`/v1/public/blogs`, {
      params: {
        keyWord,
        page,
        size,
      },
    });
  },

  // Ẩn blog (API mới)
  hiddenBlog: (blogId) => {
    return http.post(`/v1/blogs/${blogId}/hidden`);
  },
};
