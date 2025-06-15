import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../App";
import { authService } from "../../service/auth.service";
import { doctorService } from "../../service/doctor.service";
import { customerService } from "../../service/customer.service";
import { Card } from "antd";
import Title from "antd/es/skeleton/Title";
import { UserAddOutlined } from "@ant-design/icons";
import { serviceService } from "../../service/service.service";
import { treatmentService } from "../../service/treatment.service";
import { useFormik } from "formik";
import InputCustom from "../Input/InputCustom";

const FeedbackCustomer = () => {
  const [infoUser, setInfoUser] = useState();
  const { showNotification } = useContext(NotificationContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});
  const [service, setService] = useState([]);
  const [treatment, setTreatment] = useState([]);
  const [doctors, setDoctors] = useState([]);

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

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      customerId: infoUser?.id || "",
      doctorId: "",
      treatmentServiceId: "",
      rating: "",
      comment: "",
      recordId: "",
    },
    onSubmit: (values) => {
      customerService
        .createFeedback(values)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card
        bordered
        title={
          <div className="flex items-center space-x-2">
            <UserAddOutlined className="text-blue-600 text-xl" />
            <Title level={4} className="!mb-0">
              Tạo Tài Khoản Mới
            </Title>
          </div>
        }
        className="shadow-lg border border-gray-200"
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          <select
            name="doctorId"
            value={values.doctorId}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border rounded-md px-3 py-2"
          >
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.fullName}
              </option>
            ))}
          </select>

          <select
            name="serviceId"
            value={values.treatmentServiceId}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border rounded-md px-3 py-2"
          >
            <option value="">-- Chọn dịch vụ --</option>
            {service.map((sv) => (
              <option key={sv.id} value={sv.id}>
                {sv.name}
              </option>
            ))}
          </select>

          <InputCustom
            labelContent="rating"
            name="rating"
            typeInput="number"
            placeholder="Nhập cấp độ đánh giá từ 1-5"
            value={values.rating}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.rating}
            touched={touched.rating}
          />
          <InputCustom
            labelContent="comment"
            name="comment"
            placeholder="Comment"
            value={values.comment}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.comment}
            touched={touched.comment}
          />

          <select
            name="recordId"
            value={values.recordId}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border rounded-md px-3 py-2"
          >
            <option value="">-- Chọn hồ sơ điều trị --</option>
            {treatment.map((rec) => (
              <option key={rec.id} value={rec.id}>
                {rec.code || `Hồ sơ ${rec.id}`}
              </option>
            ))}
          </select>
          <div className="col-span-2 flex justify-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Đăng ký
            </button>
          </div>
        </form>

        {/* <div className="container mt-4">
          <h2 className="mb-4">Danh sách phản hồi</h2>

          {feedbacks.length === 0 ? (
            <p>Chưa có phản hồi nào.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Khách hàng</th>
                  <th>Bác sĩ</th>
                  <th>Đánh giá</th>
                  <th>Bình luận</th>
                  <th>Ngày gửi</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb, index) => (
                  <tr key={fb.id}>
                    <td>{index + 1}</td>
                    <td>{fb.customerName}</td>
                    <td>{doctorMap[fb.doctorId] || "Đang tải..."}</td>
                    <td>{fb.rating}</td>
                    <td>{fb.comment}</td>
                    <td>{moment(fb.submitDate).format("DD/MM/YYYY")}</td>
                    <td>
                      {fb.approved ? (
                        <span className="badge bg-success">Đã duyệt</span>
                      ) : (
                        <span className="badge bg-secondary">Chưa duyệt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div> */}
      </Card>
    </div>
  );
};

export default FeedbackCustomer;
