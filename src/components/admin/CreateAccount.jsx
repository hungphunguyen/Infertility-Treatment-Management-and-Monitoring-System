import React, { useContext } from "react";
import { Card, Select } from "antd";
import { useFormik } from "formik";
import InputCustom from "../Input/InputCustom";
import { adminService } from "../../service/admin.service";
import { useSelector } from "react-redux";
import { NotificationContext } from "../../App";
import * as yup from "yup";

const { Option } = Select;

const CreateAccount = () => {
  const token = useSelector((state) => state.authSlice);
  const { showNotification } = useContext(NotificationContext);

  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
        roleName: "",
      },
      onSubmit: (values) => {
        adminService
          .createUser(values, token.token)
          .then((res) => {
            showNotification("Create user successful", "success");
          })
          .catch((errors) => {
            showNotification(errors.response.data.message, "error");
          });
      },
      validationSchema: yup.object({
        username: yup.string().required("Please do not leave blank"),
        password: yup.string().required("Please do not leave blank"),
        roleName: yup.string().required("Please choose type role"),
      }),
    });

  return (
    <Card title="Tạo Tài Khoản Mới">
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

          <div>
            <label
              htmlFor="roleName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Role Name
            </label>
            <select
              id="roleName"
              name="roleName"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select role --</option>
              <option value="admin">ADMIN</option>
              <option value="manager">MANAGER</option>
              <option value="doctor">DOCTOR</option>
              <option value="customer">CUSTOMER</option>
            </select>
            {errors.role && touched.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Register
            </button>{" "}
          </div>
        </div>
      </form>
    </Card>
  );
};

export default CreateAccount;
