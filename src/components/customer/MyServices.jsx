import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Spin,
  Button,
  Modal,
  Descriptions,
  Collapse,
  Progress,
  Space,
  Input,
} from "antd";
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";
import { path } from "../../common/path";
import { NotificationContext } from "../../App";

const { Title, Text } = Typography;

const MyServices = () => {
  const { showNotification } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [treatmentRecords, setTreatmentRecords] = useState([]);
  const [statistics, setStatistics] = useState({
    totalServices: 0,
    cancelledServices: 0,
    inProgressServices: 0,
  });
  const [cancelLoading, setCancelLoading] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTreatmentDetail, setSelectedTreatmentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // backend page = 0-based
  const [totalPages, setTotalPages] = useState(1);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [cancelLoadingRecord, setCancelLoadingRecord] = useState(false);

  useEffect(() => {
    fetchTreatmentRecords();
    const fetchUser = async () => {
      try {
        const res = await authService.getMyInfo();
        setUserId(res?.data?.result?.id);
      } catch {}
    };
    fetchUser();
  }, []);

  const fetchTreatmentRecords = async (page = 0) => {
    try {
      setLoading(true);
      const userResponse = await authService.getMyInfo();

      if (!userResponse?.data?.result?.id) {
        showNotification("Không tìm thấy thông tin người dùng", "error");
        return;
      }

      const customerId = userResponse.data.result.id;

      // Tạm thời cho phép sử dụng test data
      if (!customerId) {
        showNotification(
          "ID người dùng không hợp lệ. Vui lòng đăng nhập lại.",
          "error"
        );
        return;
      }

      // Cảnh báo nếu đang sử dụng test data
      // (Đã xóa thông báo demo, chỉ dùng dữ liệu thật)

      const response = await treatmentService.getTreatmentRecords({
        customerId: customerId,
        page,
        size: 10,
      });

      if (response?.data?.result?.content) {
        const records = response.data.result.content;
        console.log(records);

        // chỉ cho nhấn feedback khi đã hoàn thành hồ sơ điều trị
        const enrichedRecords = records.map((record) => ({
          ...record,
          canFeedback: record.status === "COMPLETED",
        }));
        setTreatmentRecords(enrichedRecords);
        setCurrentPage(page);
        setTotalPages(response.data.result.totalPages);
        const stats = {
          totalServices: records.length,
          cancelledServices: records.filter((r) => r.status === "CANCELLED")
            .length,
          inProgressServices: records.filter((r) => r.status === "INPROGRESS")
            .length,
        };
        setStatistics(stats);
      }
    } catch (error) {
      console.error("Error fetching treatment records:", error);
      showNotification("Có lỗi xảy ra khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "COMPLETED":
        return <Tag color="success">Hoàn thành</Tag>;
      case "INPROGRESS":
        return <Tag color="processing">Đang điều trị</Tag>;
      case "PENDING":
        return <Tag color="warning">Đang chờ điều trị</Tag>;
      case "CANCELLED":
        return <Tag color="error">Đã hủy</Tag>;
      case "PLANED":
        return <Tag color="warning">Đã lên lịch</Tag>;
      case "CONFIRMED":
        return <Tag color="processing">Đã xác nhận</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getStepStatusTag = (status) => {
    switch ((status || "").toUpperCase()) {
      case "COMPLETED":
        return <Tag color="success">Hoàn thành</Tag>;
      case "INPROGRESS":
        return <Tag color="processing">Đang thực hiện</Tag>;
      case "CONFIRMED":
        return <Tag color="processing">Đã xác nhận</Tag>;
      case "PENDING":
      case "PLANED":
        return <Tag color="warning">Đang chờ điều trị</Tag>;
      case "CANCELLED":
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // const handleCancelTreatment = async (record) => {
  //   if (!userId) return;
  //   setCancelLoading((l) => ({ ...l, [record.id]: true }));
  //   try {
  //     const res = await treatmentService.cancelTreatmentRecord(record.id);
  //     showNotification(
  //       res?.data?.message || "Hủy hồ sơ điều trị thành công.",
  //       "success"
  //     );
  //     fetchTreatmentRecords();
  //   } catch (err) {
  //     showNotification(err?.response?.data?.message, "error");
  //   } finally {
  //     setCancelLoading((l) => ({ ...l, [record.id]: false }));
  //   }
  // };

  const handleCancelTreatment = (treatment) => {
    setSelectedTreatment(treatment);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!cancelReason.trim()) {
      showNotification("Vui lòng nhập lý do huỷ!", "warning");
      return;
    }
    setCancelLoadingRecord(true);
    try {
      await treatmentService.cancelTreatmentRecord(
        selectedTreatment.id,
        cancelReason
      );
      showNotification("Hủy hồ sơ thành công!", "success");
      setIsModalVisible(false);
      setCancelReason("");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      showNotification(err.response?.data?.message, "error");
    } finally {
      setCancelLoadingRecord(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCancelReason("");
  };

  const handleOpenFeedbackForm = (record) => {
    if (!record.canFeedback) return;
    navigate(path.customerFeedback, {
      state: {
        recordId: record.id,
      },
    });
  };

  const handleViewTreatmentDetail = async (record) => {
    setDetailLoading(true);
    setDetailModalVisible(true);
    try {
      const res = await treatmentService.getTreatmentRecordById(record.id);
      setSelectedTreatmentDetail(res?.data?.result || record);
    } catch (err) {
      setSelectedTreatmentDetail(record);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: "Gói điều trị",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Bác sĩ phụ trách",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => (
        <span>{text ? new Date(text).toLocaleDateString("vi-VN") : "N/A"}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      render: (_, record) => {
        const totalSteps = record.totalSteps || 0;
        const completedSteps = record.completedSteps || 0;

        if (!totalSteps) return "0%";
        const percentage = Math.round((completedSteps / totalSteps) * 100);
        return `${completedSteps}/${totalSteps} (${percentage}%)`;
      },
    },
    {
      title: "Chi tiết dịch vụ",
      key: "details",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          style={{
            backgroundColor: "#ff6b35",
            borderColor: "#ff6b35",
            color: "#fff",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleViewTreatmentDetail(record);
          }}
        >
          Xem
        </Button>
      ),
    },
    {
      title: "Yêu cầu hủy",
      key: "cancel",
      render: (_, record) => (
        <Button
          danger
          loading={!!cancelLoading[record.id]}
          onClick={(e) => {
            e.stopPropagation();
            handleCancelTreatment(record);
          }}
          disabled={!userId || record.status === "CANCELLED"}
          style={
            record.status === "CANCELLED"
              ? { opacity: 0.5, cursor: "not-allowed" }
              : {}
          }
        >
          Hủy dịch vụ
        </Button>
      ),
    },
    {
      title: "Tạo feedback",
      key: "feedback",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenFeedbackForm(record);
            console.log(record.id);
          }}
          disabled={!record.canFeedback}
        >
          Feedback
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        variant="outlined"
        style={{
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(24,144,255,0.06)",
          background: "#fff",
        }}
      >
        <Table
          columns={columns}
          dataSource={treatmentRecords}
          rowKey="id"
          pagination={false}
          bordered
          style={{ borderRadius: 12, overflow: "hidden" }}
        />
        <div className="flex justify-end mt-4">
          <Button
            disabled={currentPage === 0}
            onClick={() => fetchTreatmentRecords(currentPage - 1)}
            className="mr-2"
          >
            Trang trước
          </Button>
          <span className="px-4 py-1 bg-gray-100 rounded text-sm">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <Button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => fetchTreatmentRecords(currentPage + 1)}
            className="ml-2"
          >
            Trang tiếp
          </Button>
        </div>
      </Card>
      <Modal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        title="Chi tiết quá trình điều trị"
        width={900}
      >
        {detailLoading ? (
          <Spin />
        ) : selectedTreatmentDetail ? (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Gói điều trị">
                {selectedTreatmentDetail.treatmentServiceName ||
                  selectedTreatmentDetail.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ">
                {selectedTreatmentDetail.doctorName}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {selectedTreatmentDetail.startDate
                  ? dayjs(selectedTreatmentDetail.startDate).format(
                      "DD/MM/YYYY"
                    )
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedTreatmentDetail.status)}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ margin: "24px 0" }}>
              <Progress
                percent={(() => {
                  const steps = selectedTreatmentDetail.treatmentSteps || [];
                  const total = steps.length;
                  const completed = steps.filter(
                    (s) => s.status === "COMPLETED"
                  ).length;
                  return total > 0 ? Math.round((completed / total) * 100) : 0;
                })()}
                status="active"
              />
            </div>
            <Collapse
              items={(selectedTreatmentDetail.treatmentSteps || []).map(
                (step, idx) => ({
                  key: step.id || idx,
                  label: (
                    <Space>
                      <b>{step.name}</b> {getStepStatusTag(step.status)}
                    </Space>
                  ),
                  children: (
                    <div>
                      <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label="Ngày bắt đầu">
                          {step.startDate
                            ? dayjs(step.startDate).format("DD/MM/YYYY")
                            : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày hoàn thành">
                          {step.endDate
                            ? dayjs(step.endDate).format("DD/MM/YYYY")
                            : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">
                          {step.notes || "-"}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  ),
                })
              )}
            />
          </div>
        ) : (
          <Text type="secondary">Không có dữ liệu chi tiết</Text>
        )}
      </Modal>
      {/* Modal hủy hồ sơ */}
      <Modal
        title="Bạn có chắc chắn muốn hủy hồ sơ/dịch vụ này?"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={cancelLoadingRecord}
        okText="Hủy hồ sơ"
        okType="danger"
        cancelText="Không"
      >
        <div>Bệnh nhân: {selectedTreatment?.customerName}</div>
        <Input.TextArea
          rows={3}
          placeholder="Nhập lý do huỷ"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );
};

export default MyServices;
