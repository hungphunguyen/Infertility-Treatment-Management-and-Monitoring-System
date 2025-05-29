import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { NotificationContext } from "../App";
import InputCustom from "../components/Input/InputCustom";
import * as yup from "yup";
import { authService } from "../service/auth.service";
import { useNavigate } from "react-router-dom";

const ResendOtpPage = () => {
  const { showNotification } = useContext(NotificationContext);
  const [step = "email", setStep] = useState();
  const navigate = useNavigate();

  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        email: "",
        otp: "",
      },
      onSubmit: async (values) => {
        try {
          if (step == "email") {
            await authService.resendOtp(values);
            showNotification("OTP code sent, check email!", "success");
            setStep("otp");
          } else {
            await authService.verify(values);
            showNotification("OTP check successful", "success");
            setTimeout(() => {
              navigate("/sign-in");
              window.location.reload();
            }, 1000);
          }
        } catch (errors) {
          showNotification(errors.response.data.message, "error");
        }
      },
      validationSchema:
        step === "email"
          ? yup.object({
              email: yup
                .string()
                .email("Invalid email")
                .required("Email is required"),
            })
          : yup.object({
              otp: yup.string().required("Please do not leave blank"),
            }),
    });

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-10 py-8 mt-10">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {step === "email" ? "Nhập email" : "Xác minh tài khoản"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="">
            {step === "email" && (
              <InputCustom
                labelContent="Email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
              />
            )}
            {step === "otp" && (
              <>
                <InputCustom
                  labelContent="Your code verify"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  typeInput="text"
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.otp}
                  touched={touched.otp}
                />
              </>
            )}
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              {step === "email" ? "Gửi mã" : "Xác nhận"}
            </button>{" "}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResendOtpPage;
