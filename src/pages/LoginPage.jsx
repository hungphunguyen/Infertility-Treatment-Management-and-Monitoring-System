import React, { useContext } from "react";
import signInAnimation from "./../assets/animation/signIn_Animation.json";
import { useLottie } from "lottie-react";
import InputCustom from "../components/Input/InputCustom";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const dispatch = useDispatch();
  const { showNotification } = useContext(NotificationContext);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    // Kiểm tra nếu có thông tin từ trang reset password
    if (location.state?.message) {
      setResetMessage(location.state.message);
      showNotification(location.state.message, "success");
    }
  }, [location.state, showNotification]);

  const options = {
    animationData: signInAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  const [isResend, setIsResend] = useState();

  const { handleSubmit, handleChange, values, errors, touched, handleBlur, setFieldValue } =
    useFormik({
      initialValues: {
        username: location.state?.username || "",
        password: "",
      },
      onSubmit: (values) => {
        console.log(values);
        // gọi hàm sử lí bên authService
        authService
          .signIn(loginData)
          .then((res) => {
            console.log("res.data");
            console.log(res);
            //thực hiện lưu trự dưới localStorage
            setLocalStorage("token", res.data.result.token);
            dispatch(setToken(res.data.result.token));

            // thực hiên thông báo chuyển hướng người dùng
            showNotification("Login successful", "success");
            setTimeout(() => {
              navigate("/");
              window.location.reload();
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
            // showNotification(error.response.data.message, "error"); // coi lai respone tu be tra ve
          });
      },
      validationSchema: yup.object({
        username: yup.string().required("Please do not leave blank"),
        password: yup.string().required("Please do not leave blank"),
      }),
    });

  return (
    <div className="">
      <div className="container">
        <div className="loginPage_content flex items-center h-screen">
          <div className="loginPage_img w-1/2">{View}</div>
          <div className="loginPage_form w-1/2">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <h1 className="text-center text-4xl font-medium">LOGIN</h1>
              
              {resetMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {resetMessage}
                </div>
              )}
              
              {/* username or email */}
              <InputCustom
                name={"username"}
                onChange={handleChange}
                value={values.username}
                placeholder={"Enter username or email"}
                labelContent={"Username or Email"}
                error={errors.username}
                touched={touched.username}
                onBlur={handleBlur}
              />
              <InputCustom
                name={"password"}
                onChange={handleChange}
                value={values.password}
                labelContent={"Password"}
                placeholder={"Please enter password"}
                typeInput="password"
                error={errors.password}
                touched={touched.password}
                onBlur={handleBlur}
              />

              <div>
                <button
                  type="submit"
                  className="inline-block w-full bg-black text-white py-2 px-5 rounded-md"
                >
                  Sign In
                </button>
                <GoogleLogin />
                <Link
                  to={path.signUp}
                  className="mt-3 text-blue-600 hover:underline duration-300"
                >
                  If you do not have an account, click here
                </Link>
              </div>
              {isResend && (
                <Link to={path.resendOtp}>
                  <button className="py-2 px-4 font-medium border border-orange-500 rounded-md hover:bg-orange-500 hover:text-white  duration-300">
                    Resend OTP
                  </button>
                </Link>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
