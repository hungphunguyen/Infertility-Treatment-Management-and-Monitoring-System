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
      content: "",
      sourceReference: "",
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
          userId: currentUser.id
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
      content: yup.string().required("Vui lòng nhập nội dung!"),
      sourceReference: yup.string().required("Vui lòng nhập nguồn tham khảo!"),
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
            labelContent="Nguồn tham khảo"
            name="sourceReference"
            placeholder="Nhập nguồn tham khảo"
            value={values.sourceReference}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.sourceReference}
            touched={touched.sourceReference}
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