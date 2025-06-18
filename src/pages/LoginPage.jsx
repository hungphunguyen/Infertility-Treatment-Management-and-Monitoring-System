import React, { useContext, useState } from "react";
import signInAnimation from "./../assets/animation/Animation - 1744810564155.json";
import { useLottie } from "lottie-react";
import InputCustom from "../components/Input/InputCustom";
import { Link, useNavigate } from "react-router-dom";
import { path } from "../common/path";
import { useFormik } from "formik";
import * as yup from "yup";
import { authService } from "../service/auth.service";
import { getLocgetlStorage, setLocalStorage } from "../utils/util";
import GoogleLogin from "../components/GoogleLogin";
import { NotificationContext } from "../App";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotification } = useContext(NotificationContext);

  const options = {
    animationData: signInAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  const [isResend, setIsResend] = useState();

  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      onSubmit: (values) => {
        // gọi hàm sử lí bên authService
        authService
          .signIn(values)
          .then((res) => {
            console.log(res);
            //thực hiện lưu trự dưới localStorage
            setLocalStorage("token", res.data.result.token);
            dispatch(setToken(res.data.result.token));

            // thực hiên thông báo chuyển hướng người dùng
            showNotification("Đăng nhập thành công", "success");
            
            // Kiểm tra xem có URL redirect không
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
              localStorage.removeItem('redirectAfterLogin'); // Xóa URL redirect
              setTimeout(() => {
                navigate(redirectUrl);
              }, 1000);
            } else {
              setTimeout(() => {
                navigate("/");
              }, 1000);
            }
          })
          .catch((error) => {
            if (error.response.data.code == 1014) {
              setIsResend(true);
              showNotification(
                "Nếu bạn muốn xác nhận otp lại, hãy nhấn vào đây",
                "warning"
              );
            }
            showNotification(error.response.data.message, "error"); // coi lai respone tu be tra ve
          });
      },
      validationSchema: yup.object({
        username: yup
          .string()
          .trim("Vui lòng không để trống tài khoản")
          .required("Vui lòng không để trống tài khoản"),
        password: yup
          .string()
          .trim("Vui lòng không để trống mật khẩu")
          .required("Vui lòng không để trống mật khẩu"),
      }),
    });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-red-700 to-orange-600 overflow-hidden">
      {/* Lớp phủ glass effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

      <div className="relative z-10 flex flex-col items-center text-white w-full max-w-md px-6 py-12 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl">
        {/* Logo + Title */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center mb-2 shadow-md">
            <span className="text-orange-500 font-bold text-2xl">⬢</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Đăng nhập</h1>
        </div>

        {/* Form */}
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-orange-600">
              <i className="fas fa-user"></i>
            </span>
            <InputCustom
              name="username"
              onChange={handleChange}
              value={values.username}
              placeholder="Vui lòng nhập tài khoản"
              labelContent={null}
              error={errors.username}
              touched={touched.username}
              onBlur={handleBlur}
              className="pl-10 bg-orange-200 text-black"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-orange-600">
              <i className="fas fa-lock"></i>
            </span>
            <InputCustom
              name="password"
              onChange={handleChange}
              value={values.password}
              placeholder="Vui lòng nhập mật khẩu"
              labelContent={null}
              typeInput="password"
              error={errors.password}
              touched={touched.password}
              onBlur={handleBlur}
              className="pl-10 bg-orange-200 text-black"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between text-sm text-white">
            <Link to={path.forgotPassword} className="hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 rounded bg-[#7c2d12] hover:bg-[#5a1f0e] text-white font-semibold transition duration-300"
          >
            Đăng nhập
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 w-full border-t border-orange-300 text-center text-sm text-white relative">
          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white/10 px-2 backdrop-blur">
            Hoặc đăng nhập với
          </span>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin />
        </div>

        {/* Sign up */}
        <div className="mt-6 text-sm text-white">
          Không có tài khoản?{" "}
          <Link to={path.signUp} className="underline hover:text-orange-100">
            Đăng kí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
