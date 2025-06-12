import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { authService } from "../service/auth.service";
import { NotificationContext } from "../App";
import InputCustom from "../components/Input/InputCustom";
import { Layout } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import ManagerSidebar from "../components/manager/ManagerSidebar";
import { doctorService } from "../service/doctor.service";
import DoctorSidebar from "../components/doctor/DoctorSidebar";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import EducationTimeline from "../components/doctor/EducationTimeline";
import SpecialtyTimeline from "../components/doctor/SpecialtyTimeline";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const token = useSelector((state) => state.authSlice);

  const [userInfo, setUserInfo] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("update-profile");
  const role = userInfo?.roleName?.name || "";
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    if (!userInfo?.id || role !== "DOCTOR") return;
    const doctorId = userInfo.id;
    const fetchInfoDoctor = async () => {
      try {
        const res = await doctorService.getInfoDoctor(doctorId);
        setDoctorInfo(res.data.result);
      } catch (error) {
        console.log(error);
        showNotification("Không thể lấy thông tin người dùng", "error");
      }
    };
    fetchInfoDoctor();
  }, [userInfo?.id]);

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

  const getInitialValues = () => {
    if (userInfo?.roleName.name === "DOCTOR" && doctorInfo) {
      return {
        fullName: doctorInfo.fullName || "",
        email: doctorInfo.email || "",
        phoneNumber: doctorInfo.phoneNumber || "",
        gender: doctorInfo.gender || "",
        dateOfBirth: doctorInfo.dateOfBirth || "",
        address: doctorInfo.address || "",
        qualifications: doctorInfo.qualifications || "",
        graduationYear: doctorInfo.graduationYear || "",
        experienceYears: doctorInfo.experienceYears || "",
        specialty: doctorInfo.specialty || "",
      };
    }

    return {
      fullName: userInfo?.fullName || "",
      email: userInfo?.email || "",
      phoneNumber: userInfo?.phoneNumber || "",
      gender: userInfo?.gender || "",
      dateOfBirth: userInfo?.dateOfBirth || "",
      address: userInfo?.address || "",
    };
  };

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    useFormik({
      enableReinitialize: true,
      initialValues: getInitialValues(),
      onSubmit: async (values) => {
        if (!userInfo?.id) {
          showNotification("Không thể lấy thông tin người dùng", "error");
          return;
        }
        if (userInfo?.roleName.name === "DOCTOR") {
          try {
            const res = await doctorService.updateDoctor(doctorInfo.id, values);
            setIsEditing(false);

            console.log(res);
            showNotification("Cập nhật thông tin thành công", "success");
          } catch (error) {
            console.log(err);
            showNotification(err.response?.data?.message, "error");
          }
        } else {
          try {
            const res = await authService.updateUser(userInfo.id, values);
            setIsEditing(false);

            showNotification("Cập nhật thông tin thành công", "success");
          } catch (err) {
            console.log(err);
            showNotification(err.response?.data?.message, "error");
          }
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

  if (userInfo?.roleName.name === "DOCTOR" && !doctorInfo) {
    return (
      <p className="text-center py-10">Đang tải dữ liệu hồ sơ bác sĩ...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Layout style={{ minHeight: "100vh" }}>
        {role === "MANAGER" && (
          <ManagerSidebar
            collapsed={false}
            onCollapse={() => {}}
            selectedMenu={selectedMenu}
            onMenuSelect={(menuKey) => setSelectedMenu(menuKey)}
          />
        )}

        {/* {role === "DOCTOR" && (
          <DoctorSidebar
            collapsed={false}
            onCollapse={() => {}}
            selectedMenu={selectedMenu}
            onMenuSelect={(menuKey) => setSelectedMenu(menuKey)}
          />
        )} */}

        {role === "CUSTOMER" && (
          <CustomerSidebar
            collapsed={false}
            onCollapse={() => {}}
            selectedMenu={selectedMenu}
            onMenuSelect={(menuKey) => setSelectedMenu(menuKey)}
          />
        )}

        <Layout style={{ marginLeft: 250 }}>
          <div className="py-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CỘT TRÁI: Avatar + Học vấn + Chuyên ngành */}
              <div className="space-y-6">
                {/* Avatar Card */}
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Ảnh đại diện</h3>
                  <img
                    src={
                      preview || userInfo?.avatarUrl || "/default-avatar.png"
                    }
                    alt="Avatar Preview"
                    className="w-32 h-32 rounded-full object-cover border mx-auto mb-4"
                  />
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 transition inline-block"
                  >
                    Chọn ảnh
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleSelectFile}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedFile ? selectedFile.name : "Chưa chọn ảnh nào"}
                  </p>
                  <button
                    onClick={handleUploadAvatar}
                    disabled={!selectedFile}
                    className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lưu ảnh đại diện
                  </button>
                </div>

                {/* Học vấn */}
                {userInfo?.roleName.name === "DOCTOR" && (
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-3">Học vấn</h4>
                    <EducationTimeline
                      educationList={
                        doctorInfo?.qualifications
                          ? Array.isArray(doctorInfo.qualifications)
                            ? doctorInfo.qualifications
                            : [doctorInfo.qualifications]
                          : []
                      }
                    />
                  </div>
                )}

                {/* Chuyên ngành */}
                {userInfo?.roleName.name === "DOCTOR" && (
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-3">Chuyên ngành</h4>
                    <SpecialtyTimeline
                      specialtyList={
                        doctorInfo?.specialty
                          ? Array.isArray(doctorInfo.specialty)
                            ? doctorInfo.specialty
                            : [doctorInfo.specialty]
                          : []
                      }
                    />
                  </div>
                )}
              </div>

              {/* CỘT PHẢI: Form thông tin */}
              <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Thông tin cá nhân
                </h2>
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
                    disabled={!isEditing}
                    classWrapper={
                      !isEditing ? "opacity-60 pointer-events-none" : ""
                    }
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
                    disabled={!isEditing}
                    classWrapper={
                      !isEditing ? "opacity-60 pointer-events-none" : ""
                    }
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
                      disabled={!isEditing}
                      classWrapper={
                        !isEditing ? "opacity-60 pointer-events-none" : ""
                      }
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
                    disabled={!isEditing}
                    classWrapper={
                      !isEditing ? "opacity-60 pointer-events-none" : ""
                    }
                  />
                  <InputCustom
                    labelContent="Địa chỉ"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.address}
                    touched={touched.address}
                    disabled={!isEditing}
                    classWrapper={
                      !isEditing ? "opacity-60 pointer-events-none" : ""
                    }
                  />

                  {/* { khung input riêng cho bác sĩ} */}

                  {userInfo && userInfo.roleName.name === "DOCTOR" && (
                    <>
                      <InputCustom
                        labelContent="Bằng cấp"
                        name="qualifications"
                        value={values.qualifications}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.qualifications}
                        touched={touched.qualifications}
                        disabled={!isEditing}
                        classWrapper={
                          !isEditing ? "opacity-60 pointer-events-none" : ""
                        }
                      />
                      <InputCustom
                        labelContent="Năm tốt nghiệp"
                        name="graduationYear"
                        value={values.graduationYear}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.graduationYear}
                        touched={touched.graduationYear}
                        disabled={!isEditing}
                        classWrapper={
                          !isEditing ? "opacity-60 pointer-events-none" : ""
                        }
                      />
                      <InputCustom
                        labelContent="Năm kinh nghiệm"
                        name="experienceYears"
                        value={values.experienceYears}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.experienceYears}
                        touched={touched.experienceYears}
                        disabled={!isEditing}
                        classWrapper={
                          !isEditing ? "opacity-60 pointer-events-none" : ""
                        }
                      />
                      <InputCustom
                        labelContent="Chuyên ngành"
                        name="specialty"
                        value={values.specialty}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.specialty}
                        touched={touched.specialty}
                        disabled={!isEditing}
                        classWrapper={
                          !isEditing ? "opacity-60 pointer-events-none" : ""
                        }
                      />
                    </>
                  )}

                  <div className="col-span-2 flex justify-end mt-4">
                    {isEditing && (
                      <div className="col-span-2 flex justify-end mt-4">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckOutlined />
                          <span>Cập nhật</span>
                        </button>
                      </div>
                    )}
                    {!isEditing && (
                      <div className="flex justify-end mb-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          <EditOutlined />
                          <span>Chỉnh sửa</span>
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Layout>
      </Layout>
    </div>
  );
};

export default ProfileUpdate;
