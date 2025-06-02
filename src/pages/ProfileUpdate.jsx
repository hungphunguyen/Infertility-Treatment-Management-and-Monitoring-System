import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { authService } from "../service/auth.service";
import { NotificationContext } from "../App";
import InputCustom from "../components/Input/InputCustom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user info when component mounts
    const fetchUserInfo = async () => {
      try {
        const response = await authService.getMyInfo(token);
        setUserInfo(response.data.result);
      } catch (error) {
        showNotification("Không thể lấy thông tin người dùng", "error");
      }
    };
    fetchUserInfo();
  }, [token]);

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
          setLoading(true);
          await authService.updateUser(userInfo.id, values, token);
          showNotification("Cập nhật thông tin thành công", "success");
          // Refresh user info after update
          const response = await authService.getMyInfo(token);
          setUserInfo(response.data.result);
          navigate("/profile");
        } catch (err) {
          showNotification(err.response?.data?.message || "Cập nhật thông tin thất bại", "error");
        } finally {
          setLoading(false);
        }
      },
      validationSchema: yup.object({
        fullName: yup.string().required("Vui lòng nhập họ và tên"),
        email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        phoneNumber: yup
          .string()
          .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
          .required("Vui lòng nhập số điện thoại"),
        gender: yup.string().required("Vui lòng chọn giới tính"),
        dateOfBirth: yup.string().required("Vui lòng nhập ngày sinh"),
        address: yup.string().required("Vui lòng nhập địa chỉ"),
      }),
    });

  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src="/images/features/pc8.jpg" 
          alt="Cập nhật thông tin cá nhân" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Cập Nhật Thông Tin Cá Nhân</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">THÔNG TIN CÁ NHÂN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Cập Nhật Thông Tin</h2>
            <span className="text-[#ff8460] font-medium">GIỮ THÔNG TIN CỦA BẠN LUÔN ĐƯỢC CẬP NHẬT</span>
            <p className="text-lg mt-6 max-w-3xl mx-auto">
              Vui lòng cập nhật thông tin cá nhân của bạn để chúng tôi có thể liên hệ và hỗ trợ bạn tốt hơn.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
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
              <InputCustom
                labelContent="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
              />
              <InputCustom
                labelContent="Số điện thoại"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phoneNumber}
                touched={touched.phoneNumber}
              />

              {/* Gender (select) */}
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
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
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
                  disabled={loading}
                  className="bg-[#ff8460] text-white px-6 py-2 rounded hover:bg-[#ff6b40] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default ProfileUpdate; 