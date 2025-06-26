import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../App";
import { authService } from "../../service/auth.service";
import { doctorService } from "../../service/doctor.service";
import { customerService } from "../../service/customer.service";
import { Card, Modal, Rate } from "antd";
import Title from "antd/es/skeleton/Title";
import { UserAddOutlined } from "@ant-design/icons";
import { serviceService } from "../../service/service.service";
import { treatmentService } from "../../service/treatment.service";
import { useFormik } from "formik";
import InputCustom from "../Input/InputCustom";
import { useLocation } from "react-router-dom";

const FeedbackCustomer = () => {
  const [infoUser, setInfoUser] = useState();
  const { showNotification } = useContext(NotificationContext);
  const [service, setService] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});

  const [treatment, setTreatment] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { state } = useLocation();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  useEffect(() => {
    authService
      .getMyInfo()
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    doctorService.getAllDoctors().then((res) => {
      setDoctors(res.data.result);
    });
  }, []);

  useEffect(() => {
    serviceService
      .getAllNonRemovedServices()
      .then((res) => {
        console.log(res.data.result);
        setService(res.data.result);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (infoUser?.id) {
      treatmentService
        .getTreatmentRecordsByCustomer(infoUser.id)
        .then((res) => setTreatment(res.data.result))
        .catch((err) => console.log(err));
    }
  }, [infoUser]);

  // format lại id doctor -> doctor name
  const getDoctorNames = async (feedbackList) => {
    const uniqueDoctorIds = [...new Set(feedbackList.map((fb) => fb.doctorId))];
    const newMap = {};
    await Promise.all(
      uniqueDoctorIds.map(async (id) => {
        try {
          const res = await doctorService.getDoctorById(id);
          newMap[id] = res?.data?.result?.fullName || "Không rõ";
        } catch (err) {
          newMap[id] = "Không rõ";
        }
      })
    );

    setDoctorMap(newMap);
  };

  const getAllFeedBack = async () => {
    try {
      const res = await customerService.getFeedbackCustomer(infoUser.id);
      if (res?.data?.result) {
        setFeedbacks(res.data.result);
        getDoctorNames(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (infoUser?.id) {
      getAllFeedBack();
    }
  }, [infoUser]);

  const formik = useFormik({
    initialValues: {
      customerId: "",
      doctorId: "",
      serviceId: "",
      rating: "",
      comment: "",
      recordId: "",
    },
    onSubmit: async (values) => {
      try {
        console.log(values);

        const res = await customerService.createFeedback(values);

        getAllFeedBack();
        // gắn get vô
        console.log(res);
        showNotification("Gửi phản hồi thành công!", "success");
      } catch (err) {
        console.log(err);
        showNotification(err.response.data.message, "error");
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    setFieldValue,
  } = formik;

  useEffect(() => {
    const isReady =
      state &&
      state.recordId &&
      state.customerId &&
      state.doctorName &&
      state.treatmentServiceName &&
      doctors.length &&
      service.length;

    if (isReady) {
      const normalize = (str) => (str || "").trim().toLowerCase();

      const matchedDoctor = doctors.find(
        (doc) => normalize(doc.fullName) === normalize(state.doctorName)
      );

      const matchedService = service.find(
        (sv) => normalize(sv.name) === normalize(state.treatmentServiceName)
      );

      setFieldValue("recordId", state.recordId);
      setFieldValue("customerId", state.customerId);
      setFieldValue("doctorId", matchedDoctor?.id || "");
      setFieldValue("serviceId", matchedService?.id || "");

      console.log("🧾 Trying to map service name:", state.treatmentServiceName);
      console.log("🎯 Found matchedService:", matchedService);

      if (!matchedDoctor || !matchedService) {
        console.warn("⚠️ Không map được doctor/service từ state:", {
          state,
          matchedDoctor,
          matchedService,
          allServiceNames: service.map((s) => s.name),
        });
      }
    }
  }, [state, doctors, service, setFieldValue]);

  const getDoctorName = (id) =>
    doctors.find((doc) => doc.id === id)?.fullName || "Đang tải...";

  const getServiceName = (id) =>
    service.find((sv) => sv.id === id)?.name || "Đang tải...";

  const getRecordCode = (id) =>
    treatment.find((rec) => rec.id === id)?.code || `Hồ sơ ${id}`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {state ? (
        <Card bordered className="shadow-md border rounded-xl bg-white">
          <div className="flex items-center gap-3 mb-4">
            <UserAddOutlined className="text-blue-500 text-2xl" />
            <Title level={4} className="!mb-0 !text-blue-600 !font-bold">
              Gửi đánh giá dịch vụ
            </Title>
          </div>

          {/* Thông tin hồ sơ */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md mb-6 text-sm font-medium">
            <p>
              <span className="text-gray-600">👨‍⚕️ Bác sĩ:</span>{" "}
              <span className="text-black">{state.doctorName}</span>
            </p>
            <p>
              <span className="text-gray-600">💉 Dịch vụ:</span>{" "}
              <span className="text-black">{state.treatmentServiceName}</span>
            </p>
            <p>
              <span className="text-gray-600">📁 Hồ sơ:</span>{" "}
              <span className="text-black">
                {getRecordCode(state.recordId)}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Đánh giá chất lượng
              </label>
              <Rate
                value={Number(values.rating)}
                onChange={(value) => setFieldValue("rating", value)}
                tooltips={["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"]}
                className="text-xl"
              />
              {touched.rating && errors.rating && (
                <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block font-semibold mb-1 text-gray-700"
              >
                Ghi chú chi tiết
              </label>
              <textarea
                name="comment"
                rows={5}
                placeholder="Viết nhận xét chi tiết của bạn tại đây..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={values.comment}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.comment && errors.comment && (
                <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
              )}
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Gửi phản hồi
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="text-center text-gray-500 italic py-6">
          ⚠️ Vui lòng chọn một dịch vụ điều trị để gửi phản hồi.
        </div>
      )}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-3 text-gray-700">
          📋 Danh sách phản hồi
        </h3>
        <div className="overflow-x-auto rounded-xl border bg-white shadow-md">
          <table className="min-w-full text-sm text-gray-700 ">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-2 px-3 font-semibold">#</th>
                <th className="py-2 px-3 font-semibold">Khách hàng</th>
                <th className="py-2 px-3 font-semibold">Bác sĩ</th>
                <th className="py-2 px-3 font-semibold">Đánh giá</th>
                <th className="py-2 px-3 font-semibold">Bình luận</th>
                <th className="py-2 px-3 font-semibold">Ngày duyệt</th>
                <th className="py-2 px-3 font-semibold">Trạng thái</th>
                <th className="py-2 px-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, index) => (
                <tr key={fb.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{infoUser?.fullName || "..."}</td>
                  <td className="py-2 px-3">{doctorMap[fb.doctorId]}</td>
                  <td className="py-2 px-3">
                    <Rate disabled defaultValue={fb.rating} />
                  </td>
                  <td className="py-2 px-3">{fb.comment}</td>
                  <td className="py-2 px-3">{fb.submitDate}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-sm font-medium ${
                        fb.status === "APPROVED"
                          ? "text-green-600"
                          : fb.status === "REJECTED"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {fb.status === "APPROVED"
                        ? "Đã chấp nhận"
                        : fb.status === "REJECTED"
                        ? "Đã từ chối"
                        : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => {
                        setSelectedFeedback(fb);
                        setViewModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        open={viewModalOpen}
        title="Chi tiết phản hồi"
        onCancel={() => setViewModalOpen(false)}
        footer={null}
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <div>
              <strong>Rating:</strong>{" "}
              <Rate disabled defaultValue={selectedFeedback.rating} />
            </div>

            <div>
              <strong>Comment:</strong> <span>{selectedFeedback.comment}</span>
            </div>

            <div>
              <strong>Note:</strong> <span>{selectedFeedback.note}</span>
            </div>

            <div>
              <strong>Status:</strong> <span>{selectedFeedback.status}</span>
            </div>

            <div>
              <strong>Ngày duyệt:</strong>{" "}
              <span>{selectedFeedback.submitDate}</span>
            </div>

            <hr />

            <label className="block font-semibold mt-4">
              Cập nhật đánh giá
            </label>
            <Rate
              value={selectedFeedback.rating}
              onChange={(value) =>
                setSelectedFeedback((prev) => ({ ...prev, rating: value }))
              }
            />
            <textarea
              value={selectedFeedback.comment}
              onChange={(e) =>
                setSelectedFeedback((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              rows={4}
              className="w-full border rounded p-2"
            />

            <button
              onClick={async () => {
                try {
                  const res = await customerService.updateFeedback(
                    selectedFeedback.id,
                    {
                      rating: selectedFeedback.rating,
                      comment: selectedFeedback.comment,
                      recordId: selectedFeedback.recordId,
                    }
                  );

                  showNotification("Cập nhật thành công", "success");
                  await getAllFeedBack(); // refresh list
                  setViewModalOpen(false);
                } catch (err) {
                  console.error(err);
                  console.log(selectedFeedback.rating);
                  console.log(selectedFeedback.comment);
                  console.log(selectedFeedback.recordId);
                  showNotification("Cập nhật thất bại", "error");
                }
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Cập nhật
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackCustomer;
