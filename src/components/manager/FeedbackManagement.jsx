import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Select,
  Input,
  Rate,
  Modal,
} from "antd";
import { CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { managerService } from "../../service/manager.service";
import { authService } from "../../service/auth.service";
import { NotificationContext } from "../../App";
import { doctorService } from "../../service/doctor.service";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [infoUser, setInfoUser] = useState();
  const { showNotification } = useContext(NotificationContext);
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
  });
  const [loadingIds, setLoadingIds] = useState([]);
  const noteRef = useRef("");

  const [modalVisible, setModalVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // backend page = 0-based
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    authService
      .getMyInfo()
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {});
  }, []);

  const getAllFeedBack = async (page = 0) => {
    try {
      const res = await managerService.getAllFeedback(page, 5);
      console.log(res);
      if (res?.data?.result?.content) {
        setFeedbacks(res.data.result.content);
        setTotalPages(res.data.result.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFeedBack();
  }, []);

  // nút từ chối và update
  const openApprovalModal = (id, status) => {
    setCurrentId(id);
    setCurrentStatus(status);
    setModalVisible(true);
  };

  // search
  const filteredFeedbacks = feedbacks.filter((item) => {
    const doctorName = item.doctorFullName?.toLowerCase() || "";
    const customerName = item.customerName?.toLowerCase() || "";

    const matchKeyword =
      filters.keyword === "" ||
      customerName.includes(filters.keyword) ||
      doctorName.includes(filters.keyword);

    const matchStatus = filters.status === "" || item.status === filters.status;

    return matchKeyword && matchStatus;
  });

  // 🎯 Thống kê số liệu
  const totalFeedback = feedbacks.length;
  const pendingFeedback = feedbacks.filter(
    (fb) => fb.status === "PENDING"
  ).length;
  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) /
          feedbacks.length
        ).toFixed(1)
      : "0.0";

  const openDetailModal = (feedback) => {
    setSelectedFeedback(feedback);
    setDetailModalVisible(true);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPROVED":
        return "Đã chấp nhận";
      case "REJECTED":
        return "Đã từ chối";
      case "HIDDEN":
        return "Đã ẩn";
      case "PENDING":
      default:
        return "Chờ duyệt";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      case "HIDDEN":
        return "gray";
      case "PENDING":
      default:
        return "orange";
    }
  };

  return (
    <div>
      {/* 🔢 Box thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-6 rounded shadow text-center border border-blue-100">
          <p className="text-blue-700 font-semibold text-sm uppercase">
            Tổng feedback
          </p>
          <h2 className="text-4xl font-bold text-blue-600">{totalFeedback}</h2>
        </div>
        <div className="bg-orange-50 p-6 rounded shadow text-center border border-orange-100">
          <p className="text-red-600 font-semibold text-sm uppercase">
            Chờ duyệt
          </p>
          <h2 className="text-4xl font-bold text-red-500">{pendingFeedback}</h2>
        </div>
        <div className="bg-green-50 p-6 rounded shadow text-center border border-green-100">
          <p className="text-green-700 font-semibold text-sm uppercase">
            Đánh giá TB
          </p>
          <h2 className="text-4xl font-bold text-green-600">{averageRating}</h2>
        </div>
      </div>

      <Card title="Danh sách phản hồi khách hàng">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Input
            placeholder="Tìm theo tên bệnh nhân hoặc bác sĩ"
            allowClear
            className="w-full md:w-1/3"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                keyword: e.target.value.toLowerCase(),
              }))
            }
          />

          <Select
            placeholder="Lọc trạng thái"
            allowClear
            className="w-full md:w-1/4"
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <Select.Option value="">Tất cả trạng thái</Select.Option>
            <Select.Option value="APPROVED">Đã duyệt</Select.Option>
            <Select.Option value="PENDING">Chờ duyệt</Select.Option>
            <Select.Option value="REJECTED">Đã từ chối</Select.Option>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Bệnh nhân</th>
                <th className="px-4 py-3">Bác sĩ</th>
                <th className="px-4 py-3">Đánh giá</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFeedbacks.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.customerFullName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.doctorFullName || "..."}
                  </td>
                  <td className="px-4 py-3">
                    <Rate disabled value={item.rating} />
                  </td>
                  <td className="px-4 py-3">
                    <Tag color={getStatusColor(item.status)}>
                      {getStatusLabel(item.status)}
                    </Tag>
                  </td>

                  <td className="px-4 py-3">
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => openDetailModal(item)}
                    >
                      Xem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Button
              disabled={currentPage === 0}
              onClick={() => getAllFeedBack(currentPage - 1)}
              className="mr-2"
            >
              Trang trước
            </Button>
            <span className="px-4 py-1 bg-gray-100 rounded text-sm">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => getAllFeedBack(currentPage + 1)}
              className="ml-2"
            >
              Trang tiếp
            </Button>
          </div>
        </div>
        <Modal
          title="Chi tiết phản hồi"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            // selectedFeedback?.status !== "HIDDEN" && (
            <>
              <Button
                key="hide"
                style={{
                  backgroundColor: "#6c757d", // Bootstrap secondary
                  borderColor: "#6c757d",
                  color: "#fff",
                }}
                onClick={() => openApprovalModal(selectedFeedback.id, "HIDDEN")}
              >
                Ẩn
              </Button>
              {/* {selectedFeedback?.status === "PENDING" ||
                selectedFeedback?.status === "REJECTED" ? ( */}
              <>
                <Button
                  key="reject"
                  danger
                  onClick={() =>
                    openApprovalModal(selectedFeedback.id, "REJECTED")
                  }
                >
                  Từ chối
                </Button>
                <Button
                  key="approve"
                  type="primary"
                  onClick={() =>
                    openApprovalModal(selectedFeedback.id, "APPROVED")
                  }
                >
                  Duyệt
                </Button>
              </>
              {/* ) : null} */}
            </>,
            // ),
          ]}
        >
          {selectedFeedback && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Bệnh nhân:</strong> {selectedFeedback.customerName}
              </p>
              <p>
                <strong>Bác sĩ:</strong>{" "}
                {selectedFeedback.doctorFullName || "Không rõ"}
              </p>
              <p>
                <strong>Đánh giá:</strong>{" "}
                <Rate disabled value={selectedFeedback.rating} />
              </p>
              <p>
                <strong>Bình luận:</strong> {selectedFeedback.comment}
              </p>
              <p>
                <strong>Ngày gửi:</strong>{" "}
                {selectedFeedback.submitDate
                  ? dayjs(selectedFeedback.submitDate).format("DD/MM/YYYY")
                  : ""}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {getStatusLabel(selectedFeedback.status)}
              </p>
              <p>
                <strong>Note:</strong> {selectedFeedback.note}
              </p>
              <p>
                <strong>Người duyệt:</strong>{" "}
                {selectedFeedback.approvedBy || "Chưa có"}
              </p>
            </div>
          )}
        </Modal>

        <Modal
          title={
            currentStatus === "APPROVED"
              ? "Duyệt phản hồi?"
              : "Từ chối phản hồi?"
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={async () => {
            if (!infoUser?.id || !currentId) return;

            setLoadingIds((prev) => [...prev, currentId]);

            try {
              await managerService.confirmFeedback(currentId, {
                note: noteRef.current || "",
                status: currentStatus,
              });

              showNotification("Cập nhật phản hồi thành công", "success");
              getAllFeedBack();
            } catch (err) {
              console.error(err);
              showNotification(err.response.data.message, "error");
            } finally {
              setModalVisible(false);
              setLoadingIds((prev) => prev.filter((id) => id !== currentId));
              noteRef.current = "";
            }
          }}
          okText="Xác nhận"
          cancelText="Huỷ"
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập ghi chú"
            onChange={(e) => (noteRef.current = e.target.value)}
          />
        </Modal>
      </Card>
    </div>
  );
};

export default FeedbackManagement;
