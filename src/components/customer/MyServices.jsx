import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Timeline,
  Modal,
  Descriptions,
  Spin,
  message,
  Button,
  Select,
  Form,
  Alert,
} from "antd";
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";
import { customerService } from "../../service/customer.service";
import { path } from "../../common/path";

const { Title, Text } = Typography;
const { Option } = Select;

const MyServices = () => {
  const [loading, setLoading] = useState(true);
  const [treatmentRecords, setTreatmentRecords] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statistics, setStatistics] = useState({
    totalServices: 0,
    cancelledServices: 0,
    inProgressServices: 0,
  });
  const [cancelLoading, setCancelLoading] = useState({});
  const [userId, setUserId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [changeStep, setChangeStep] = useState(null);
  const [changeAppointment, setChangeAppointment] = useState(null);
  const [changeForm] = Form.useForm();
  const [changeLoading, setChangeLoading] = useState(false);

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

        // Gọi API check cho từng record
        const enrichedRecords = await Promise.all(
          records.map(async (record) => {
            console.log("👉 Before enrich:", record);
            try {
              const res = await customerService.checkIsValid(record.id);
              console.log("checkIsValid", record.id, res.data.result);
              return { ...record, canFeedback: res.data.result === true };
            } catch (err) {
              return { ...record, canFeedback: false }; // fallback nếu lỗi
            }
          })
        );

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

  const calculateEstimatedEndDate = (startDate, treatmentSteps) => {
    if (!startDate) return null;

    // Nếu có endDate từ API thì sử dụng
    if (selectedService?.endDate) {
      return selectedService.endDate;
    }

    // Nếu không có endDate, tính toán dựa trên ngày bắt đầu
    // Thêm 45 ngày cho toàn bộ quá trình điều trị
    return dayjs(startDate).add(45, "days").format("YYYY-MM-DD");
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
    console.log(record);
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

  const handleViewDetails = async (record) => {
    setSelectedService(record);
    setModalVisible(true);
    // Lấy lịch hẹn thực tế cho customerId
    if (record.customerId) {
      try {
        const res = await treatmentService.getCustomerAppointments(
          record.customerId
        );
        if (res?.data?.result) {
          setAppointments(res.data.result);
        } else {
          setAppointments([]);
        }
      } catch {
        setAppointments([]);
      }
    } else {
      setAppointments([]);
    }
  };

  // Function to open change modal for a step
  const handleOpenChangeModal = async (step) => {
    if (!selectedService?.customerId) return;
    setChangeStep(step);
    setChangeAppointment(null);
    setChangeModalVisible(true);
    setChangeLoading(true);
    try {
      const res = await treatmentService.getCustomerAppointments(
        selectedService.customerId
      );
      if (res?.data?.result) {
        // Tìm appointment đúng với step (purpose)
        const found = res.data.result.find((app) => app.purpose === step.name);
        setChangeAppointment(found);
        if (found) {
          changeForm.setFieldsValue({
            requestedDate: found.appointmentDate
              ? dayjs(found.appointmentDate)
              : null,
            requestedShift: found.shift || undefined,
            notes: found.notes || "",
          });
        }
      }
    } catch {
      setChangeAppointment(null);
    } finally {
      setChangeLoading(false);
    }
  };

  // Function to handle submit change request
  const handleSubmitChange = async () => {
    if (!changeAppointment) return;
    try {
      setChangeLoading(true);
      const values = await changeForm.validateFields();
      await treatmentService.requestChangeAppointment(changeAppointment.id, {
        requestedDate: values.requestedDate.format("YYYY-MM-DD"),
        requestedShift: values.requestedShift,
        notes: values.notes || "",
      });
      message.success("Đã gửi yêu cầu thay đổi lịch hẹn!");
      setChangeModalVisible(false);
    } catch (err) {
      message.error(err?.response?.data?.message || "Không thể gửi yêu cầu.");
    } finally {
      setChangeLoading(false);
    }
  };

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
          onRow={(record) => ({
            onClick: () => handleViewDetails(record),
            style: { cursor: "pointer" },
          })}
          bordered
          style={{ borderRadius: 12, overflow: "hidden" }}
        />
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết dịch vụ"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedService && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Gói điều trị" span={2}>
                {selectedService.treatmentServiceName}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ phụ trách">
                {selectedService.doctorName}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {(() => {
                  const totalSteps =
                    selectedService.treatmentSteps?.length || 0;
                  if (
                    !totalSteps ||
                    selectedService.treatmentSteps[0]?.status !== "COMPLETED"
                  ) {
                    return getStatusTag(selectedService.status);
                  }
                  const completedSteps =
                    selectedService.treatmentSteps?.filter(
                      (step) => step.status === "COMPLETED"
                    ).length || 0;
                  const progress = Math.round(
                    (completedSteps / totalSteps) * 100
                  );
                  return getStatusTag(selectedService.status);
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {selectedService.startDate
                  ? new Date(selectedService.startDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {selectedService.createdDate
                  ? new Date(selectedService.createdDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                {selectedService.paid ? "Đã thanh toán" : "Chưa thanh toán"}
              </Descriptions.Item>
            </Descriptions>

            {/* Treatment Timeline */}
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Tiến trình điều trị:</Title>
              <Timeline>
                {selectedService.treatmentSteps?.map((step, index) => {
                  const statusMap = {
                    CONFIRMED: { color: "blue", text: "Đã xác nhận" },
                    PLANNED: { color: "orange", text: "Chờ thực hiện" },
                    COMPLETED: { color: "green", text: "Hoàn thành" },
                    CANCELLED: { color: "red", text: "Đã hủy" },
                    INPROGRESS: { color: "blue", text: "Đang thực hiện" },
                  };
                  const s = statusMap[step.status] || {
                    color: "default",
                    text: step.status,
                  };
                  return (
                    <Timeline.Item key={index} color={s.color}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text strong>
                          {step.scheduledDate
                            ? new Date(step.scheduledDate).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa lên lịch"}{" "}
                          - {step.name}
                        </Text>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleOpenChangeModal(step)}
                        >
                          Gửi yêu cầu thay đổi lịch hẹn
                        </Button>
                      </div>
                      <Text type="secondary">{s.text}</Text>
                      {step.notes && (
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">Ghi chú: {step.notes}</Text>
                        </div>
                      )}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal đổi lịch hẹn */}
      <Modal
        title={`Gửi yêu cầu thay đổi lịch hẹn: ${changeStep?.name || ""}`}
        open={changeModalVisible}
        onCancel={() => setChangeModalVisible(false)}
        onOk={handleSubmitChange}
        okText="Gửi yêu cầu"
        confirmLoading={changeLoading}
        destroyOnClose
      >
        {changeLoading ? (
          <Spin />
        ) : changeAppointment ? (
          <Form form={changeForm} layout="vertical">
            <Form.Item
              label="Ngày hẹn mới"
              name="requestedDate"
              rules={[{ required: true, message: "Chọn ngày mới" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Ca khám mới"
              name="requestedShift"
              rules={[{ required: true, message: "Chọn ca khám" }]}
            >
              <Select placeholder="Chọn ca">
                <Option value="MORNING">Sáng</Option>
                <Option value="AFTERNOON">Chiều</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ghi chú" name="notes">
              <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" />
            </Form.Item>
          </Form>
        ) : (
          <Alert
            type="warning"
            message="Không tìm thấy lịch hẹn tương ứng cho bước này!"
          />
        )}
      </Modal>
    </div>
  );
};

export default MyServices;
