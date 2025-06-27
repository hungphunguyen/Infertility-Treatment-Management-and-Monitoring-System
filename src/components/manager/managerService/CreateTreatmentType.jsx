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
  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    handleBlur,
    setValues,
  } = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  useEffect(() => {
    const fetchTreatmentType = async (page = 0) => {
      try {
        const res = await managerService.getTreatmentTypePagination(page, 5);
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
        setValues({
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
        <div className="mb-6">
          <span className="font-semibold text-gray-700 mr-4">
            Chọn cách tạo:
          </span>
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={!isReuse}
              onChange={() => setIsReuse(false)}
            />
            <span className="ml-2 text-gray-700">Tạo mới</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={isReuse}
              onChange={() => setIsReuse(true)}
            />
            <span className="ml-2 text-gray-700">Sử dụng phương pháp cũ</span>
          </label>
        </div>

        {isReuse && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800 text-base">
              Danh sách phương pháp điều trị đã có
            </h3>
            <div className="overflow-x-auto shadow border border-gray-200 rounded-md">
              <table className="min-w-full text-sm bg-blue-50 rounded-md">
                <thead className="bg-green-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-green-900">
                      Tên
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-green-900">
                      Miêu tả
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-orange-600">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {treatmentType.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-6 text-gray-400"
                      >
                        Không có phương pháp điều trị nào.
                      </td>
                    </tr>
                  ) : (
                    treatmentType.map((item) => (
                      <tr
                        key={item.id}
                        className={`transition-all ${
                          selectedId === item.id
                            ? "bg-blue-100"
                            : "hover:bg-blue-100"
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-gray-700 align-top max-w-[600px]">
                          <div className="line-2-truncate">
                            {item.description}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedId(item.id)}
                            className="px-4 py-1 border border-blue-600 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          >
                            Sử dụng
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isReuse && (
            <>
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
            </>
          )}

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
