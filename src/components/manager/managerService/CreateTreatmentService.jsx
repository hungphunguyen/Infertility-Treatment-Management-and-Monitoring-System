import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../../App";
import { managerService } from "../../../service/manager.service";
import { path } from "../../../common/path";
import { useFormik } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import InputCustom from "../../Input/InputCustom";

const CreateTreatmentService = () => {
  const { showNotification } = useContext(NotificationContext);
  const [treatmentType, setTreatmentType] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getTreatmentType = async () => {
      try {
        const res = await managerService.getTreatmentType();
        setTreatmentType(res.data.result || []);
      } catch (error) {
        console.log(error);
      }
    };
    getTreatmentType();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      treatmentTypeId: treatmentType?.id || "",
      name: "",
      description: "",
      price: "",
      duration: "",
    },
    onSubmit: (values) => {
      if (!treatmentType) {
        showNotification("Không có danh sách treatment type", "error");
        return;
      }
      managerService
        .createTreatService(values)
        .then((res) => {
          console.log(res);
          showNotification("Tạo dịch vụ thành công", "success");
          setTimeout(() => {
            navigate(path.managerServices);
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          showNotification(err.response.data.message, "error");
          console.log(err);
        });
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

  if (!treatmentType.length) {
    return (
      <p className="text-center mt-8">Đang tải dữ liệu loại điều trị...</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-10 py-8 mt-10">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Create Treatment Service
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="typeId">
            Chọn loại điều trị
          </label>
          <select
            id="treatmentTypeId"
            name="treatmentTypeId"
            value={values.treatmentTypeId} // Formik sẽ lưu id
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn loại điều trị --</option>
            {treatmentType.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          {touched.typeId && errors.typeId && (
            <p className="text-sm text-red-500 mt-1">{errors.typeId}</p>
          )}
        </div>

        <InputCustom
          labelContent="Tên dịch vụ điều trị"
          placeholder="Nhập tên dịch vụ"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
        />

        <InputCustom
          labelContent="Miêu tả dịch vụ điều trị"
          placeholder="Nhập miêu tả dịch vụ"
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.description}
          touched={touched.description}
        />

        <InputCustom
          labelContent="Giá tiền"
          name="price"
          placeholder="Nhập giá tiền"
          typeInput="number"
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.price}
          touched={touched.price}
        />

        <InputCustom
          labelContent="Thời gian điều trị của dịch vụ"
          name="duration"
          placeholder="Nhập thời gian (tháng)"
          typeInput="number"
          value={values.duration}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.duration}
          touched={touched.duration}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Xác nhận
        </button>
      </form>
    </div>
  );
};

export default CreateTreatmentService;
