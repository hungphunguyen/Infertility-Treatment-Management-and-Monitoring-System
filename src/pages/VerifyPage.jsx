import { useFormik } from "formik";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import InputCustom from "../components/Input/InputCustom";
import { authService } from "../service/auth.service";
import { NotificationContext } from "../App";

const VerifyPage = () => {
  const { infoUser } = useSelector((state) => state.authSlice);
  const { showNotification } = useContext(NotificationContext);

  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        otp: "",
        email: infoUser.email,
      },
      onSubmit: (values) => {
        console.log(values);
        authService
          .verify(values)
          .then((res) => {
            console.log(res);
            console.log("res.data");

            showNotification("OTP check successful", "success");
            setTimeout(() => {
              localStorage.clear();
              navigate("/sign-in");
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
            showNotification(errors.response.data.message, "error");
          });
      },
      validationSchema: yup.object({
        code: yup.string().required("Please do not leave blank"),
      }),
    });

  return (
    <div>
      <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-sm bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Verify your account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter the verification code that we sent to <br />
          <span className="font-medium text-gray-900">{infoUser.email}</span> in
          order to activate your account.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
          <button className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition">
            Confirm code
          </button>

          <p className="text-center text-sm mt-4 text-blue-500 cursor-pointer hover:underline">
            Resend code
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
