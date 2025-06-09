import React, { useContext, useEffect, useState } from "react";
import { Card, Typography } from "antd";
import { useFormik } from "formik";
import InputCustom from "../Input/InputCustom";
import { blogService } from "../../service/blog.service";
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationContext } from "../../App";
import * as yup from "yup";
import { FileTextOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { authService } from "../../service/auth.service";

const { Title } = Typography;

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useContext(NotificationContext);
  const token = useSelector((state) => state.authSlice);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (token?.token) {
          const response = await authService.getMyInfo(token.token);
          setCurrentUser(response.data.result);
        }
      } catch (error) {
        console.error("Error loading user info:", error);
        showNotification("Vui lòng đăng nhập để tạo bài viết", "error");
        navigate("/sign-in");
      }
    };
    loadUserInfo();
  }, [token, navigate, showNotification]);

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    handleBlur,
  } = useFormik({
    initialValues: {
      title: "",
      summary: "",
      content: "",
      category: "",
      tags: "",
      readTime: "",
    },
    onSubmit: async (values) => {
      try {
        if (!currentUser) {
          showNotification("Vui lòng đăng nhập để tạo bài viết", "error");
          navigate("/sign-in");
          return;
        }

        const data = {
          ...values,
          userId: currentUser.id,
          author: currentUser.fullName || currentUser.username,
          tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
          status: 'pending'
        };

        const response = await blogService.createBlog(data, token.token);
        if (response.data) {
          showNotification("Bài viết đã được gửi, chờ quản lý duyệt!", "success");
          navigate("/blog");
        }
      } catch (error) {
        console.error("Blog create error:", error);
        if (error.response?.data?.message) {
          showNotification(error.response.data.message, "error");
        } else {
          showNotification("Tạo bài viết thất bại. Vui lòng thử lại!", "error");
        }
      }
    },
    validationSchema: yup.object({
      title: yup.string().required("Vui lòng nhập tiêu đề!"),
      summary: yup.string().required("Vui lòng nhập tóm tắt!"),
      content: yup.string().required("Vui lòng nhập nội dung!"),
      category: yup.string().required("Vui lòng nhập danh mục!"),
      readTime: yup.string().required("Vui lòng nhập thời gian đọc!"),
    }),
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card
        bordered
        title={
          <div className="flex items-center space-x-2">
            <FileTextOutlined className="text-blue-600 text-xl" />
            <Title level={4} className="!mb-0">
              Tạo Bài Viết Blog
            </Title>
          </div>
        }
        className="shadow-lg border border-gray-200"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputCustom
            labelContent="Tiêu đề bài viết"
            name="title"
            placeholder="Nhập tiêu đề bài viết"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.title}
            touched={touched.title}
          />

          <InputCustom
            labelContent="Tóm tắt"
            name="summary"
            typeInput="textarea"
            placeholder="Nhập tóm tắt bài viết"
            value={values.summary}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.summary}
            touched={touched.summary}
          />

          <InputCustom
            labelContent="Nội dung"
            name="content"
            typeInput="textarea"
            placeholder="Nhập nội dung bài viết"
            value={values.content}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.content}
            touched={touched.content}
          />

          <InputCustom
            labelContent="Danh mục"
            name="category"
            placeholder="Nhập danh mục"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.category}
            touched={touched.category}
          />

          <InputCustom
            labelContent="Tags (phân cách bằng dấu phẩy)"
            name="tags"
            placeholder="VD: IVF, Thai kỳ, Sức khỏe"
            value={values.tags}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <InputCustom
            labelContent="Thời gian đọc"
            name="readTime"
            placeholder="VD: 5 phút đọc"
            value={values.readTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.readTime}
            touched={touched.readTime}
          />

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Gửi bài viết
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateBlogPage; 