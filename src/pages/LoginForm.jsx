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
import PulleyAnimation from "./PulleyAnimation";
import { useContext, useState } from "react";
import InputCustom from "../components/Input/InputCustom";

const LoginForm = ({ switchToRegister }) => {
  // Copy toàn bộ logic useFormik từ LoginPage

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotification } = useContext(NotificationContext);
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
            setTimeout(() => {
              navigate("/");
            }, 1000);
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
    <div className="bg-orange-50 w-full h-full px-8 py-10 text-gray-800 ">
      {/* Header logo + text */}
      {/* Form đăng nhập y hệt LoginPage.jsx */}
      {/* Left animation */}

      {/* Right form */}
      <div className="w-full px-8 py-12 text-gray-800 flex flex-col justify-center">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-2 ring-2 ring-orange-400 shadow-lg">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/di6hi1r0g/image/upload/v1748665959/icon_pch2gc.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Chào mừng đến đây</h2>
          <p className="text-sm text-gray-500">
            Vui lòng đăng nhập để tiếp tục
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
              <i className="fas fa-user" />
            </span>
            <InputCustom
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.username}
              error={errors.username}
              placeholder="Tài khoản"
              labelContent={null}
              className="pl-10 bg-white/90 text-black"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
              <i className="fas fa-lock" />
            </span>
            <InputCustom
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.password}
              error={errors.password}
              placeholder="Mật khẩu"
              typeInput="password"
              labelContent={null}
              className="pl-10 bg-white/90 text-black"
            />
          </div>

          <div className="text-right text-sm">
            <Link
              to={path.forgotPassword}
              className="text-white/80 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-orange-600 hover:brightness-110 hover:scale-[1.02] transition-all duration-200 ease-in-out rounded-md text-white font-semibold"
          >
            Đăng nhập
          </button>
        </form>

        <div className="my-1 text-sm flex items-center gap-4">
          <hr className="flex-grow border-white/30" />
          <span className="text-white/70">Hoặc</span>
          <hr className="flex-grow border-white/30" />
        </div>

        <p className="text-sm mt-3 text-center">
          Chưa có tài khoản?{" "}
          <button
            onClick={switchToRegister}
            className="text-orange-500 underline"
          >
            Đăng ký ngay
          </button>
        </p>

        <GoogleLogin />

        {isResend && (
          <div className="mt-4 text-yellow-300 text-center text-sm">
            Nếu bạn muốn xác nhận OTP lại, hãy nhấn vào đây.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
