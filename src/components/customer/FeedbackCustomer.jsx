import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../App";
import { authService } from "../../service/auth.service";
import { customerService } from "../../service/customer.service";
import { Card, Modal, Rate } from "antd";
import Title from "antd/es/skeleton/Title";
import { UserAddOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";

const FeedbackCustomer = () => {
  const [infoUser, setInfoUser] = useState();
  const { showNotification } = useContext(NotificationContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackInfo, setFeedbackInfo] = useState(null);
  const { state } = useLocation();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  useEffect(() => {
    authService
      .getMyInfo()
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch(() => {});
  }, []);

  const getAllFeedBack = async (page = 0) => {
    try {
      const res = await customerService.getAllFeedback(infoUser.id, page, 5);
      if (res?.data?.result?.content) {
        setFeedbacks(res.data.result.content);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFeedbackDetails = async (id) => {
    try {
      const res = await customerService.getFeedbackById(id);
      setFeedbackDetails(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (infoUser?.id) {
      getAllFeedBack();
    }
  }, [infoUser]);

  // tạo feedback
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

        await customerService.createFeedback(values);
        await getAllFeedBack();
        showNotification("Gửi phản hồi thành công!", "success");
        resetForm(); // ✅ Reset lại tất cả value
        setFeedbackInfo(null);
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
    resetForm,
  } = formik;

  useEffect(() => {
    const id = state?.recordId;
    if (!id) return;
    const fetchFeedbackInfo = async () => {
      try {
        const res = await customerService.getFeedbackInfoToCreate(id);
        const { doctorId, customerId, serviceId, doctorFullName, serviceName } =
          res.data.result;
        // Lưu đầy đủ info vào state để render UI
        setFeedbackInfo({
          recordId: id,
          doctorId,
          customerId,
          serviceId,
          doctorFullName,
          serviceName,
        });

        // Gán cho Formik
        setFieldValue("recordId", id);
        setFieldValue("doctorId", doctorId);
        setFieldValue("customerId", customerId);
        setFieldValue("serviceId", Number(serviceId));
      } catch (error) {
        showNotification(error?.response?.data?.message, "error");
      }
    };
    fetchFeedbackInfo();
  }, [state, setFieldValue]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {feedbackInfo ? (
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
              <span className="text-black">{feedbackInfo.doctorFullName}</span>
            </p>
            <p>
              <span className="text-gray-600">💉 Dịch vụ:</span>{" "}
              <span className="text-black">{feedbackInfo.serviceName}</span>
            </p>
            <p>
              <span className="text-gray-600">📁 Hồ sơ:</span>{" "}
              <span className="text-black">{feedbackInfo.recordId}</span>
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
          Vui lòng chọn một dịch vụ điều trị để gửi phản hồi.
        </div>
      )}
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-3 text-gray-700">
          Danh sách phản hồi
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
                <th className="py-2 px-3 font-semibold">Trạng thái</th>
                <th className="py-2 px-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, index) => (
                <tr key={fb.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{fb.customerFullName}</td>
                  <td className="py-2 px-3">{fb.doctorFullName}</td>
                  <td className="py-2 px-3">
                    <Rate disabled defaultValue={fb.rating} />
                  </td>
                  <td className="py-2 px-3">{fb.comment}</td>
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
                        getFeedbackDetails(fb.id);
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
        {feedbackDetails && (
          <div className="space-y-4">
            <div>
              <strong>Rating:</strong>{" "}
              <Rate disabled defaultValue={feedbackDetails.rating} />
            </div>

            <div>
              <strong>Comment:</strong> <span>{feedbackDetails.comment}</span>
            </div>

            <div>
              <strong>Note:</strong> <span>{feedbackDetails.note}</span>
            </div>

            <div>
              <strong>Status: </strong>
              <span
                className={`text-sm font-medium ${
                  feedbackDetails.status === "APPROVED"
                    ? "text-green-600"
                    : feedbackDetails.status === "REJECTED"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {feedbackDetails.status === "APPROVED"
                  ? "Đã chấp nhận"
                  : feedbackDetails.status === "REJECTED"
                  ? "Đã từ chối"
                  : "Chờ duyệt"}
              </span>
            </div>

            <div>
              <strong>Ngày duyệt:</strong>{" "}
              <span>{feedbackDetails.submitDate}</span>
            </div>

            <hr />

            <label className="block font-semibold mt-4">
              <strong>Cập nhật đánh giá</strong>
            </label>
            <Rate
              value={feedbackDetails.rating}
              onChange={(value) =>
                setFeedbackDetails((prev) => ({ ...prev, rating: value }))
              }
            />
            <textarea
              value={feedbackDetails.comment}
              onChange={(e) =>
                setFeedbackDetails((prev) => ({
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
                    feedbackDetails.id,
                    {
                      rating: feedbackDetails.rating,
                      comment: feedbackDetails.comment,
                      recordId: feedbackDetails.id,
                    }
                  );

                  showNotification("Cập nhật thành công", "success");
                  await getAllFeedBack(); // refresh list
                  setViewModalOpen(false);
                } catch (err) {
                  console.error(err);
                  console.log(feedbackDetails.rating);
                  console.log(feedbackDetails.comment);
                  console.log(feedbackDetails.id);
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
