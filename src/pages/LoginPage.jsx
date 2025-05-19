import React from "react";
import signInAnimation from "./../assets/animation/signIn_Animation.json";
import { useLottie } from "lottie-react";
import InputCustom from "../components/Input/InputCustom";
import { Link } from "react-router-dom";
import { path } from "../common/path";
import { useFormik } from "formik";
import * as yup from "yup";
import { authService } from "../service/auth.service";
import { setLocalStorage } from "../utils/util";
import GoogleLogin from "../components/GoogleLogin";
const LoginPage = () => {
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
            console.log(res);
            //thực hiện lưu trự dưới localStorage
            // setLocalStorage
          })
          .catch((error) => {
            console.log(error);
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
