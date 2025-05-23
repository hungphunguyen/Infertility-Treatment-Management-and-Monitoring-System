import { useFormik } from "formik";
import React, { useContext } from "react";
import InputCustom from "../components/Input/InputCustom";
import { authService } from "../service/auth.service";
import { NotificationContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { path } from "../common/path";
import { useDispatch } from "react-redux";
import { setLocalStorage } from "../utils/util";
import { getInforUser } from "../redux/authSlice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { showNotification } = useContext(NotificationContext);

  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        address: "",
      },
      onSubmit: (values) => {
        console.log(values);
        authService
          .signUp(values)
          .then((res) => {
            dispatch(getInforUser(values.email));
            showNotification("Register successful", "success");
            setTimeout(() => {
              navigate("/verify-otp");
            }, 1000);
          })
          .catch((errors) => {
            console.log(errors.response);
            showNotification(errors.response.data.message, "error");
          });
      },
      validationSchema: yup.object({
        username: yup.string().required("Please do not leave blank"),
        password: yup.string().required("Please do not leave blank"),
        fullName: yup.string().required("Full name is required"),
        email: yup
          .string()
          .email("Invalid email")
          .required("Email is required"),
        phoneNumber: yup.string().required("Phone is required"),
        gender: yup.string().required("Please choose your gender"),
        dateOfBirth: yup.date().required("Date of birth is required"),
        address: yup.string().required("Address is required"),
      }),
    });

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-10 py-8 mt-10">
        <h2 className="text-2xl font-bold mb-8 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* LEFT COLUMN */}
            <InputCustom
              labelContent="Username"
              id="username"
              name="username"
              placeholder="Enter username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              touched={touched.username}
            />

            <InputCustom
              labelContent="Password"
              id="password"
              name="password"
              placeholder="Enter password"
              typeInput="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
            />

            <InputCustom
              labelContent="Full Name"
              id="fullName"
              name="fullName"
              placeholder="Enter full name"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              touched={touched.fullName}
            />

            <InputCustom
              labelContent="Email"
              id="email"
              name="email"
              placeholder="Enter email"
              typeInput="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
            />

            <InputCustom
              labelContent="Phone Number"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phoneNumber}
              touched={touched.phoneNumber}
            />

            <InputCustom
              labelContent="Address"
              id="address"
              name="address"
              placeholder="Enter your address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
              touched={touched.address}
            />

            {/* Gender (select) */}
            <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && touched.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <InputCustom
              labelContent="Date of Birth"
              id="dateOfBirth"
              name="dateOfBirth"
              typeInput="date"
              value={values.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dateOfBirth}
              touched={touched.dateOfBirth}
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Register
            </button>{" "}
            <Link
              to={path.signIn}
              className="mt-3 text-blue-600 hover:underline duration-300"
            >
              Already have account, click here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
