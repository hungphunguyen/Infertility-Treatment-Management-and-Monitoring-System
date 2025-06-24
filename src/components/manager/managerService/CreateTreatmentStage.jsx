import React, { useContext, useEffect, useState } from "react";
import InputCustom from "../../Input/InputCustom";
import { managerService } from "../../../service/manager.service";
import { NotificationContext } from "../../../App";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { path } from "../../../common/path";

const CreateTreatmentStage = ({ onSuccess }) => {
  const [treatmentStagesList, setTreatmentStagesList] = useState([]);
  const [treatmentType, setTreatmentType] = useState([]);
  const { showNotification } = useContext(NotificationContext);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(1);
  const [selectedTypeId, setSelectedTypeId] = useState("");

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
      typeId: "",
      name: "",
      description: "",
      expectedDayRange: "",
      orderIndex: currentOrderIndex,
    },
    onSubmit: async (values) => {
      if (!values.name || !values.description || !values.orderIndex) {
        showNotification("Vui lòng điền đầy đủ thông tin stage", "error");
        return;
      }
      const stage = {
        name: values.name,
        description: values.description,
        expectedDayRange: values.expectedDayRange,
        orderIndex: Number(values.orderIndex),
      };

      setTreatmentStagesList((prev) => [...prev, stage]);
      formik.setFieldValue("name", "");
      formik.setFieldValue("description", "");
      formik.setFieldValue("expectedDayRange", "");
      formik.setFieldValue("orderIndex", currentOrderIndex + 1);
      setCurrentOrderIndex((prev) => prev + 1);
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

  const handleSendAllStages = async () => {
    if (treatmentStagesList.length === 0) {
      showNotification(
        "Chưa chọn phương pháp điều trị hoặc chưa có stage nào",
        "error"
      );
      return;
    }

    const payload = {
      typeId: Number(selectedTypeId),
      treatmentStages: treatmentStagesList,
    };
    console.log(payload);
    try {
      await managerService.createTreatStage(payload);
      showNotification("Tạo liệu trình thành công", "success");
      setTreatmentStagesList([]);
      setCurrentOrderIndex(1);
      onSuccess?.();
    } catch (err) {
      showNotification(
        err?.response?.data?.message || "Lỗi không xác định",
        "error"
      );
      console.log(err);
    }
  };

  const handleRemoveStage = (indexToRemove) => {
    setTreatmentStagesList((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove)
    );
  };

  if (treatmentType.length === 0) {
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
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
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
          labelContent="Bước điều trị"
          name="orderIndex"
          placeholder="Nhập bước hiện tại"
          typeInput="number"
          value={values.orderIndex}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.orderIndex}
          touched={touched.orderIndex}
        />
        <button>
          <Link
            to={path.managerServices}
            className="text-blue-500 hover:underline duration-300"
          >
            Trở lại trang dịch vụ
          </Link>
        </button>
        <div className="flex gap-4 justify-end mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Thêm Stage
          </button>
          <button
            type="button"
            onClick={handleSendAllStages}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Gửi tất cả
          </button>
        </div>
      </form>
      {treatmentStagesList.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Danh sách stage đã thêm:
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Tên tiến trình</th>
                  <th className="border px-4 py-2 text-left">Bước</th>
                  <th className="border px-4 py-2 text-left">Miêu tả</th>
                  <th className="border px-4 py-2 text-left">
                    Thời gian dự kiến
                  </th>
                  <th className="border px-4 py-2 text-left w-20">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {treatmentStagesList.map((stage, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{stage.name}</td>
                    <td className="border px-4 py-2">{stage.orderIndex}</td>
                    <td className="border px-4 py-2">{stage.description}</td>
                    <td className="border px-4 py-2">
                      {stage.expectedDayRange}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveStage(idx)}
                        className="text-red-600 hover:text-red-800"
                        title="Xoá stage này"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTreatmentStage;
