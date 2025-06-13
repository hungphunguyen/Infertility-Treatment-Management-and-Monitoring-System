import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../App";
import { authService } from "../../service/auth.service";
import { doctorService } from "../../service/doctor.service";
import { customerService } from "../../service/customer.service";

const FeedbackCustomer = () => {
  const [infoUser, setInfoUser] = useState();
  const { showNotification } = useContext(NotificationContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});

  useEffect(() => {
    authService
      .getMyInfo()
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {});
  }, []);

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

  return (
    <div className="container mt-4">
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
    </div>
  );
};

export default FeedbackCustomer;
