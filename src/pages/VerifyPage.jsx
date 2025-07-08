import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../App";
import { authService } from "../service/auth.service";
import InputCustom from "../components/Input/InputCustom";

const VerifyPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const [step, setStep] = useState(1); // step = 1: nhập email, step = 2: nhập otp

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      otp:
        step === 2
          ? yup.string().required("Vui lòng nhập mã OTP")
          : yup.string(),
    }),
    onSubmit: async (values) => {
      if (step === 1) {
        // Bước gửi OTP
        try {
          await authService.resendOtp(values.email);
          showNotification("Đã gửi mã OTP đến email", "success");
          setStep(2);
        } catch (error) {
          showNotification(
            error?.response?.data?.message || "Lỗi gửi OTP",
            "error"
          );
        }
      } else {
        // Bước xác thực OTP
        try {
          await authService.verify({
            email: values.email,
            otp: values.otp,
          });
          showNotification("Xác thực thành công", "success");
          setTimeout(() => {
            localStorage.clear();
            navigate("/dang-nhap");
            window.location.reload();
          }, 1000);
        } catch (error) {
          showNotification(
            error?.response?.data?.message || "OTP không đúng",
            "error"
          );
        }
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">
        {step === 1 ? "Nhập Email để nhận OTP" : "Xác nhận mã OTP"}
      </h2>

      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <InputCustom
          labelContent="Email"
          id="email"
          name="email"
          placeholder="Nhập email"
          typeInput="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
          disabled={step === 2}
        />

        {step === 2 && (
          <InputCustom
            labelContent="Mã xác thực OTP"
            id="otp"
            name="otp"
            placeholder="Nhập mã OTP"
            typeInput="text"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.otp}
            touched={formik.touched.otp}
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {step === 1 ? "Gửi mã OTP" : "Xác nhận"}
        </button>

        {step === 2 && (
          <button
            type="button"
            onClick={async () => {
              await authService.resendOtp(formik.values.email);
              showNotification("Đã gửi otp đến email của bạn", "success");
            }}
            className="text-sm mt-2 text-blue-500 hover:underline"
          >
            Gửi lại mã OTP
          </button>
        )}
      </form>
    </div>
  );
};

export default VerifyPage;
