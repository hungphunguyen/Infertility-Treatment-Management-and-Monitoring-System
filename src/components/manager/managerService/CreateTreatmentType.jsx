import React, { useContext, useEffect, useState } from "react";
import InputCustom from "../../Input/InputCustom";
import { managerService } from "../../../service/manager.service";
import { useFormik } from "formik";
import { NotificationContext } from "../../../App";
import { Link, useNavigate } from "react-router-dom";
import { path } from "../../../common/path";

const CreateTreatmentType = ({ defaultValues, onNext }) => {
  const { showNotification } = useContext(NotificationContext);
  const [treatmentType, setTreatmentType] = useState([]);
  const [isReuse, setIsReuse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: defaultValues,
      onSubmit: (values) => {
        onNext(values);
      },
    });

  useEffect(() => {
    const fetchTreatmentType = () => {
      try {
        const res = managerService.getTreatmentType();
        setTreatmentType(res.data.result.content || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTreatmentType();
  }, []);

  useEffect(() => {
    if (selectedId) {
      const selected = treatmentType.find((item) => item.id === selectedId);
      if (selected) {
        formik.setValues({
          name: selected.name,
          description: selected.description,
        });
      }
    }
  }, [selectedId]);

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
            placeholder={"Hãy nhập tên phương pháp điều trị"}
            labelContent={"Tên phương pháp"}
            error={errors.name}
            touched={touched.name}
            onBlur={handleBlur}
          />
          {/* description */}
          <InputCustom
            name={"description"}
            onChange={handleChange}
            value={values.description}
            placeholder={"Hãy viết miêu tả"}
            labelContent={"Miêu tả"}
            error={errors.description}
            touched={touched.description}
            onBlur={handleBlur}
          />
          <div>
            <button
              type="submit"
              className="inline-block w-full bg-blue-500 text-white py-2 px-5 rounded-md"
            >
              Tiếp tục
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
