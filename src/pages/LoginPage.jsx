import React, { useContext } from "react";
import signInAnimation from "./../assets/animation/signIn_Animation.json";
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
import { getInforUser } from "../redux/authSlice";
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotification } = useContext(NotificationContext);

  const options = {
    animationData: signInAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      onSubmit: (values) => {
        console.log(values);
        // gọi hàm sử lí bên authService
        authService
          .signIn(values)
          .then((res) => {
            console.log("res.data");
            console.log(res);
            //thực hiện lưu trự dưới localStorage
            setLocalStorage("token", res.data.result.token);
            // coi lai phia be tra du lieu theo format nao
            let infoUser;
            authService.getMyInfo(getLocgetlStorage("token")).then((res) => {
              infoUser = res.data.result;
              console.log(res.data.result);
              setLocalStorage("user", JSON.stringify(infoUser));
            });

            dispatch(getInforUser(infoUser));

            // thực hiên thông báo chuyển hướng người dùng
            showNotification("Login successful", "success");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
            showNotification(error.response.data.message, "error"); // coi lai respone tu be tra ve
          });
      },
      validationSchema: yup.object({
        username: yup.string().required("Please do not leave blank"),
        password: yup
          .string()
          .required("Please do not leave blank")
          .min(6, "Please enter at least 6 characters"),
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
              {/* username */}
              <InputCustom
                name={"username"}
                onChange={handleChange}
                value={values.username}
                placeholder={"Please enter user name"}
                labelContent={"User Name"}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
