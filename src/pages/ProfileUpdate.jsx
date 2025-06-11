import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { authService } from "../service/auth.service";
import { NotificationContext } from "../App";
import InputCustom from "../components/Input/InputCustom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { Layout } from "antd";
import ManagerSidebar from "../components/manager/ManagerSidebar";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const token = useSelector((state) => state.authSlice);

  const [userInfo, setUserInfo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("update-profile");

  useEffect(() => {
    // Fetch user info when component mounts
    const fetchUserInfo = async () => {
      try {
        const response = await authService.getMyInfo();
        setUserInfo(response.data.result);
      } catch (error) {
        showNotification("Không thể lấy thông tin người dùng", "error");
      }
    };
    fetchUserInfo();
  }, [token]);

  const handleSelectFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result); // preview base64
    };
  };

  // ✅ Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // ✅ Handle Upload Avatar
  const handleUploadAvatar = async () => {
    if (!selectedFile || !userInfo?.id) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userInfo.id);

    try {
      const res = await authService.uploadAvatar(formData);
      showNotification("Upload avatar thành công", "success");

      setUserInfo((prev) => ({
        ...prev,
        avatarUrl: res.data.result.avatarUrl,
      }));

      // Reset trạng thái
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      showNotification(err.response.data.message, "error");
    }
  };

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        fullName: userInfo?.fullName || "",
        email: userInfo?.email || "",
        phoneNumber: userInfo?.phoneNumber || "",
        gender: userInfo?.gender || "",
        dateOfBirth: userInfo?.dateOfBirth || "",
        address: userInfo?.address || "",
      },
      onSubmit: async (values) => {
        if (!userInfo?.id) {
          showNotification("Không thể lấy thông tin người dùng", "error");
          return;
        }
        try {
          const res = await authService.updateUser(userInfo.id, values);
          console.log(res);
          showNotification("Cập nhật thông tin thành công", "success");
        } catch (err) {
          console.log(err);
          showNotification(err.response?.data?.message, "error");
        }
      },
      validationSchema: yup.object({
        fullName: yup.string().required("Vui lòng nhập họ và tên"),
        email: yup
          .string()
          .email("Email không hợp lệ")
          .required("Vui lòng nhập email"),
        phoneNumber: yup.string().required("Vui lòng nhập số điện thoại"),
        gender: yup.string().required("Vui lòng chọn giới tính"),
        dateOfBirth: yup.string().required("Vui lòng nhập ngày sinh"),
        address: yup.string().required("Vui lòng nhập địa chỉ"),
      }),
    });

  return (
    <div className="min-h-screen">
      <Layout style={{ minHeight: "100vh" }}>
        <ManagerSidebar
          collapsed={false} // Bạn có thể điều khiển trạng thái collapsed nếu cần
          onCollapse={() => {}}
          selectedMenu={selectedMenu}
          onMenuSelect={(menuKey) => setSelectedMenu(menuKey)}
        />

        <Layout style={{ marginLeft: 250 }}>
          {/* Form Section */}
          <div className="py-20">
            <div className="container mx-auto px-4">
              {/* 👉 Flex layout trái/phải */}
              <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row gap-10">
                {/* Trái: Avatar */}
                <div className="md:w-1/3 flex flex-col items-center">
                  <h3 className="text-xl font-semibold mb-4">Ảnh đại diện</h3>
                  <img
                    src={
                      preview || userInfo?.avatarUrl || "/default-avatar.png"
                    }
                    alt="Avatar Preview"
                    className="w-32 h-32 rounded-full object-cover border mb-4"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelectFile}
                    className="text-sm mb-2"
                  />
                  <button
                    onClick={handleUploadAvatar}
                    disabled={!selectedFile}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lưu ảnh đại diện
                  </button>
                </div>

                {/* Phải: Form cập nhật */}
                <div className="md:w-2/3">
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-6"
                  >
                    <InputCustom
                      labelContent="Username"
                      name="username"
                      value={userInfo?.username}
                      onChange={() => {}}
                      classWrapper="opacity-60 pointer-events-none"
                    />
                    <InputCustom
                      labelContent="Vai trò"
                      name="role"
                      value={userInfo?.roleName?.name}
                      onChange={() => {}}
                      classWrapper="opacity-60 pointer-events-none"
                    />
                    <InputCustom
                      labelContent="Họ và tên"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.fullName}
                      touched={touched.fullName}
                    />
                    {userInfo &&
                    !userInfo.phoneNumber &&
                    userInfo.roleName.name !== "CUSTOMER" ? (
                      <InputCustom
                        labelContent="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                      />
                    ) : (
                      <InputCustom
                        labelContent="Email"
                        name="email"
                        value={values.email}
                        onChange={() => {}}
                        error={errors.email}
                        touched={touched.email}
                        classWrapper="opacity-60 pointer-events-none"
                      />
                    )}
                    <InputCustom
                      labelContent="Số điện thoại"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.phoneNumber}
                      touched={touched.phoneNumber}
                    />

                    {/* Gender */}
                    <div>
                      <label
                        htmlFor="gender"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Giới tính
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      {errors.gender && touched.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    <InputCustom
                      labelContent="Ngày sinh"
                      name="dateOfBirth"
                      typeInput="date"
                      value={values.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.dateOfBirth}
                      touched={touched.dateOfBirth}
                    />
                    <InputCustom
                      labelContent="Địa chỉ"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.address}
                      touched={touched.address}
                    />

                    <div className="col-span-2 flex justify-end mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </Layout>
    </div>
  );
};

export default ProfileUpdate;
