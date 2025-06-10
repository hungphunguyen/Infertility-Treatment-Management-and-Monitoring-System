import React, { useContext } from "react";
import InputCustom from "../../Input/InputCustom";
import { managerService } from "../../../service/manager.service";
import { useFormik } from "formik";
import { NotificationContext } from "../../../App";
import { Link } from "react-router-dom";
import { path } from "../../../common/path";

const CreateTreatmentType = ({ onSuccess }) => {
  const { showNotification } = useContext(NotificationContext);
  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
      },
      onSubmit: (values) => {
        managerService
          .createTreatType(values)
          .then((res) => {
            console.log(res);
            showNotification("Tạo loại điều trị thành công", "success");
            onSuccess(res.data.result.typeId);
          })
          .catch((err) => {
            console.log(err);
          });
      },
    });

  return (
    <div className="">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-10 py-8 mt-10">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Tạo phương pháp điều trị
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* name of type */}
          <InputCustom
            name={"name"}
            onChange={handleChange}
            value={values.name}
            placeholder={"Please enter name of treatment type"}
            labelContent={"Name"}
            error={errors.name}
            touched={touched.name}
            onBlur={handleBlur}
          />
          {/* description */}
          <InputCustom
            name={"description"}
            onChange={handleChange}
            value={values.description}
            placeholder={"Please enter description"}
            labelContent={"Description"}
            error={errors.description}
            touched={touched.description}
            onBlur={handleBlur}
          />
          <div>
            <button
              type="submit"
              className="inline-block w-full bg-black text-white py-2 px-5 rounded-md"
            >
              Xác nhận
            </button>
            <Link
              to={path.managerServices}
              className="text-blue-500 hover:underline duration-300"
            >
              Trở lại trang dịch vụ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTreatmentType;
