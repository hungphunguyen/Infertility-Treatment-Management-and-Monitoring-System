import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Spin,
  message,
  Button,
} from "antd";
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";
import { customerService } from "../../service/customer.service";
import { path } from "../../common/path";

const { Title, Text } = Typography;

const MyServices = () => {
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

  const fetchTreatmentRecords = async () => {
    try {
      setLoading(true);
      const userResponse = await authService.getMyInfo();
      console.log("User Info Response:", userResponse);

      if (!userResponse?.data?.result?.id) {
        message.error("Không tìm thấy thông tin người dùng");
        return;
      }

      const customerId = userResponse.data.result.id;
      const response = await treatmentService.getTreatmentRecordsByCustomer(
        customerId
      );
      console.log("Treatment Records Response:", response);
      console.log("Treatment Records Data:", response?.data?.result);

      if (response?.data?.result) {
        const records = response.data.result;
        console.log(
          "First Record Full Structure:",
          JSON.stringify(records[0], null, 2)
        );
        // check trạng thái của record chỉ cho feedback khi đã hoàn thành
        const enrichedRecords = records.map((record) => ({
          ...record,
          canFeedback: record.status === "COMPLETED", // chỉ cho feedback khi đã hoàn thành
        }));
        setTreatmentRecords(enrichedRecords);

        // Tính toán thống kê
        const stats = {
          totalServices: records.length,
          cancelledServices: records.filter(
            (r) => r.status === "Cancelled" || r.status === "CANCELLED"
          ).length,
          inProgressServices: records.filter(
            (r) => r.status === "InProgress" || r.status === "INPROGRESS"
          ).length,
        };
        setStatistics(stats);
      }
    } catch (error) {
      console.error("Error fetching treatment records:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "COMPLETED":
        return <Tag color="success">Hoàn thành</Tag>;
      case "INPROGRESS":
        return <Tag color="#1890ff">Đang điều trị</Tag>;
      case "PENDING":
        return <Tag color="warning">Đang chờ điều trị</Tag>;
      case "CANCELLED":
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const handleCancelTreatment = async (record) => {
    if (!userId) return;
    setCancelLoading((l) => ({ ...l, [record.id]: true }));
    try {
      await treatmentService.cancelTreatmentRecord(record.id, userId);
      message.success("Yêu cầu hủy hồ sơ điều trị đã được gửi.");
      fetchTreatmentRecords();
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Không thể hủy hồ sơ điều trị này."
      );
    } finally {
      setCancelLoading((l) => ({ ...l, [record.id]: false }));
    }
  };

  const handleOpenFeedbackForm = (record) => {
    if (!record.canFeedback) return;
    navigate(path.customerFeedback, {
      state: {
        recordId: record.id,
        customerId: userId,
        doctorName: record.doctorName,
        treatmentServiceName: record.treatmentServiceName,
      },
    });
  };

  const handleViewTreatmentProgress = (record) => {
    // Chuyển đến trang TreatmentProgress với thông tin dịch vụ cụ thể
    navigate(path.customerTreatment, {
      state: {
        treatmentRecord: record,
        treatmentId: record.id,
      },
    });
  };

  const columns = [
    {
      title: "Gói điều trị",
      dataIndex: "treatmentServiceName",
      key: "treatmentServiceName",
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
      render: (status, record) => getStatusTag(status),
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      render: (_, record) => {
        const totalSteps = record.treatmentSteps?.length || 0;
        if (!totalSteps) return "0%";

        const completedSteps =
          record.treatmentSteps?.filter((step) => step.status === "COMPLETED")
            .length || 0;
        const progress = Math.round((completedSteps / totalSteps) * 100);

        if (record.status === "CANCELLED") {
          return "Đã hủy";
        } else if (record.status === "COMPLETED") {
          return "100%";
        } else if (record.status === "INPROGRESS") {
          return `${progress}%`;
        } else {
          return "0%";
        }
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
            handleViewTreatmentProgress(record);
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
          disabled={!userId || record.status === "Cancelled"}
        >
          Hủy tuyến trình
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
      <Title
        level={4}
        style={{
          marginBottom: 24,
          color: "#1890ff",
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Dịch vụ của tôi
      </Title>

      {/* Thống kê */}
      <Row gutter={32} style={{ marginBottom: 32, justifyContent: "center" }}>
        <Col xs={24} sm={8}>
          <Card
            variant="outlined"
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(24,144,255,0.08)",
              background: "#fff",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#1890ff", fontWeight: 600 }}>
                  Tổng số dịch vụ
                </span>
              }
              value={statistics.totalServices}
              prefix={<ExperimentOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ fontSize: 32, color: "#1890ff", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            variant="outlined"
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(255,77,79,0.08)",
              background: "#fff",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#ff4d4f", fontWeight: 600 }}>
                  Đã hủy
                </span>
              }
              value={statistics.cancelledServices}
              prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ fontSize: 32, color: "#ff4d4f", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            variant="outlined"
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(24,144,255,0.08)",
              background: "#fff",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#1890ff", fontWeight: 600 }}>
                  Đang thực hiện
                </span>
              }
              value={statistics.inProgressServices}
              prefix={<CheckCircleOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ fontSize: 32, color: "#1890ff", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng dịch vụ */}
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
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Tổng số ${total} dịch vụ`,
          }}
          bordered
          style={{ borderRadius: 12, overflow: "hidden" }}
        />
      </Card>
    </div>
  );
};

export default MyServices;
