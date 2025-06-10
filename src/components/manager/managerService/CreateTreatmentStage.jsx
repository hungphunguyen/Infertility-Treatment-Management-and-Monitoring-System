import React, { useContext, useEffect, useState } from "react";
import InputCustom from "../../Input/InputCustom";
import { managerService } from "../../../service/manager.service";
import { NotificationContext } from "../../../App";
import { useFormik } from "formik";

const CreateTreatmentStage = ({ onSuccess }) => {
  const [treatmentType, setTreatmentType] = useState();
  const { showNotification } = useContext(NotificationContext);

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

  const handleNext = () => {
    if (
      formik.values.name ||
      formik.values.description ||
      formik.values.orderIndex
    ) {
      const confirm = window.confirm(
        "Bạn chưa lưu stage hiện tại. Qua bước tiếp?"
      );
      if (!confirm) return;
    }

    onSuccess();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      typeId: treatmentType?.id || "",
      name: "",
      description: "",
      expectedDayRange: "",
      orderIndex: "",
    },
    onSubmit: async (values, { resetForm }) => {
      if (!treatmentType) {
        showNotification("Không có danh sách treatment type", "error");
        return;
      }
      try {
        const res = await managerService.createTreatStage(values);
        showNotification("tạo treatment type", "success");
        resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

  if (!treatmentType) {
    return (
      <p className="text-center mt-8">Đang tải dữ liệu loại điều trị...</p>
    );
  }
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-10 py-8 mt-10">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Tạo liệu trình điều trị
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="typeId">
            Chọn phương pháp điều trị
          </label>
          <select
            id="typeId"
            name="typeId"
            value={values.typeId} // Formik sẽ lưu id
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
          labelContent="Tên tiến trình điều trị"
          placeholder="Nhập tên tiến trình"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
        />

        <InputCustom
          labelContent="Miêu tả tiến trình điều trị"
          placeholder="Nhập miêu tả tiến trình"
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.description}
          touched={touched.description}
        />
        <InputCustom
          labelContent="Thời gian dự kiến"
          placeholder="Nhập thời gian dự kiến"
          name="expectedDayRange"
          value={values.expectedDayRange}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.expectedDayRange}
          touched={touched.expectedDayRange}
        />

        <InputCustom
          labelContent="Bước thứ mấy"
          name="orderIndex"
          placeholder="Nhập bước hiện tại"
          typeInput="number"
          value={values.orderIndex}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.orderIndex}
          touched={touched.orderIndex}
        />
        <div className="flex gap-4 justify-end mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Thêm Stage
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tiếp theo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTreatmentStage;
