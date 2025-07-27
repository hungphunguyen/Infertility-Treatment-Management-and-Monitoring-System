import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Tag,
  Space,
  Divider,
  Progress,
  Collapse,
  Spin,
  message,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Alert,
  Table,
  Timeline,
} from "antd";
import {
  HeartOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined as TestTubeIcon,
  ArrowLeftOutlined,
  EditOutlined,
  RightOutlined,
  FileTextOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationContext } from "../../App";

const { Title, Text } = Typography;
const {} = Collapse;
const { Option } = Select;

const TreatmentProgress = () => {
  const [loading, setLoading] = useState(true);
  const [treatmentData, setTreatmentData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [changeStep, setChangeStep] = useState(null);
  const [changeAppointment, setChangeAppointment] = useState(null);
  const [changeForm] = Form.useForm();
  const [changeLoading, setChangeLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const location = useLocation();
  const [viewMode, setViewMode] = useState("list");
  const [treatments, setTreatments] = useState([]);
  const { showNotification } = useContext(NotificationContext);
  const [stepAppointments, setStepAppointments] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // backend page = 0-based
  const [totalPages, setTotalPages] = useState(1);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleStep, setScheduleStep] = useState(null);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  useEffect(() => {
    if (location.state?.treatmentRecord && location.state?.treatmentId) {
      setViewMode("detail");
    }

    fetchData();
  }, []);

  const fetchData = async (page = 0) => {
    try {
      setLoading(true);

      const treatmentRecord = location.state?.treatmentRecord;
      const treatmentId = location.state?.treatmentId;

      if (treatmentRecord && treatmentId) {
        const detailResponse = await treatmentService.getTreatmentRecordById(
          treatmentId
        );
        const detailData = detailResponse?.data?.result;

        if (detailData) {
          const totalSteps = detailData.treatmentSteps?.length || 0;
          const completedSteps =
            detailData.treatmentSteps?.filter(
              (step) => step.status === "COMPLETED"
            ).length || 0;
          const overallProgress =
            totalSteps > 0
              ? Math.round((completedSteps / totalSteps) * 100)
              : 0;

          setTreatmentData({
            id: detailData.id,
            type: detailData.treatmentServiceName,
            startDate: detailData.startDate,
            currentPhase:
              detailData.treatmentSteps?.findIndex(
                (step) => step.status === "COMPLETED"
              ) + 1 || 1,
            doctor: detailData.doctorName,
            status: detailData.status.toLowerCase(),
            estimatedCompletion:
              detailData.endDate ||
              dayjs(detailData.startDate).add(45, "days").format("YYYY-MM-DD"),
            nextAppointment: null,
            overallProgress: overallProgress,
            customerId: detailData.customerId,
            result: detailData.result, // <--- Bổ sung dòng này
            notes: detailData.notes || "", // <--- Bổ sung dòng này
            phases:
              detailData.treatmentSteps?.map((step, index) => ({
                id: step.id,
                name: step.name,
                statusRaw: step.status,
                status: step.status,
                displayDate: step.scheduledDate || null,
                hasDate: !!step.scheduledDate,
                startDate: step.scheduledDate,
                endDate: step.actualDate,
                notes: step.notes || "",
                appointment: null,
                activities: [
                  {
                    name: step.name,
                    date: step.scheduledDate,
                    status: step.status,
                    notes: step.notes || "",
                  },
                ],
              })) || [],
          });
        }
      } else {
        const userResponse = await authService.getMyInfo();

        if (!userResponse?.data?.result?.id) {
          message.error(
            "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
          );
          return;
        }

        const customerId = userResponse.data.result.id;

        // Tạm thời cho phép sử dụng test data
        if (!customerId) {
          message.error("ID người dùng không hợp lệ. Vui lòng đăng nhập lại.");
          return;
        }

        // Cảnh báo nếu đang sử dụng test data
        // (Đã xóa thông báo demo, chỉ dùng dữ liệu thật)

        const response = await treatmentService.getTreatmentRecords({
          customerId: customerId,
          page,
          size: 10,
        });
        setCurrentPage(page);
        setTotalPages(response.data.result.totalPages);
        if (response?.data?.code === 1000 && response.data.result?.content) {
          const treatmentRecords = response.data.result.content
            .filter((treatment) => treatment.status !== "CANCELLED")
            .sort(
              (a, b) =>
                new Date(b.createdDate || b.startDate) -
                new Date(a.createdDate || a.startDate)
            );

          setTreatments(
            treatmentRecords.map((treatment) => {
              const totalSteps = treatment.totalSteps || 0;
              const completedSteps = treatment.completedSteps || 0;
              const progress =
                totalSteps > 0
                  ? Math.round((completedSteps / totalSteps) * 100)
                  : 0;

              return {
                key: treatment.id,
                id: treatment.id,
                serviceName: treatment.serviceName,
                doctorName: treatment.doctorName,
                startDate: treatment.startDate,
                status: treatment.status,
                progress: progress,
                totalSteps: treatment.totalSteps,
                completedSteps: treatment.completedSteps,
                customerId: customerId,
                result: treatment.result, // <--- Bổ sung dòng này
                notes: treatment.notes, // <--- Thêm dòng này
              };
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChangeModal = async (step) => {
    setChangeStep(step);
    setChangeAppointment(null);
    setChangeModalVisible(true);
    setChangeLoading(true);

    try {
      // Lấy appointments thật cho step này bằng API mới
      const appointmentsResponse =
        await treatmentService.getAppointmentsByStepId(step.id);
      const appointments = appointmentsResponse?.data?.result || [];
      setChangeAppointment(appointments);
    } catch (error) {
      console.error("Lỗi khi mở modal đổi lịch:", error);
      message.error("Không thể mở form đổi lịch hẹn");
      setChangeAppointment([]);
    } finally {
      setChangeLoading(false);
    }
  };

  const handleSubmitChange = async () => {
    if (!selectedAppointment) {
      showNotification("Vui lòng chọn lịch hẹn để thay đổi", "error");
      return;
    }

    try {
      setChangeLoading(true);
      const values = await changeForm.validateFields();

      console.log("=== CHANGE REQUEST DEBUG ===");
      console.log("Selected appointment:", selectedAppointment);
      console.log(
        "Appointment ID:",
        selectedAppointment.id,
        "Type:",
        typeof selectedAppointment.id
      );
      console.log("Appointment status:", selectedAppointment.status);
      console.log("Appointment customer:", selectedAppointment.customerName);
      console.log("Form values:", values);
      console.log(
        "Sending change request for appointment ID:",
        selectedAppointment.id
      );
      console.log("Request data:", {
        requestedDate: values.requestedDate.format("YYYY-MM-DD"),
        requestedShift: values.requestedShift,
        notes: values.notes || "",
      });

      const response = await treatmentService.requestChangeAppointment(
        selectedAppointment.id,
        {
          requestedDate: values.requestedDate.format("YYYY-MM-DD"),
          requestedShift: values.requestedShift,
          notes: values.notes || "",
        }
      );

      console.log("Change request response:", response);

      if (response?.data?.code === 1000 || response?.status === 200) {
        showNotification("Đã gửi yêu cầu thay đổi lịch hẹn!", "success");
        setChangeModalVisible(false);
        setSelectedAppointment(null);
        changeForm.resetFields();
        // Reload lại lịch hẹn cho step vừa đổi
        try {
          const res = await treatmentService.getAppointmentsByStepId(
            changeStep.id
          );
          setStepAppointments((prev) => ({
            ...prev,
            [changeStep.id]: res?.data?.result || [],
          }));
        } catch (error) {
          setStepAppointments((prev) => ({ ...prev, [changeStep.id]: [] }));
        }
        // Cập nhật trực tiếp trạng thái appointment trong treatmentData
        setTreatmentData((prev) => {
          if (!prev) return prev;
          const newPhases = prev.phases.map((phase) => {
            if (
              phase.appointment &&
              phase.appointment.id === selectedAppointment.id
            ) {
              return {
                ...phase,
                appointment: {
                  ...phase.appointment,
                  status: "PENDING_CHANGE",
                  requestedDate: values.requestedDate.format("YYYY-MM-DD"),
                  requestedShift: values.requestedShift,
                  notes: values.notes || "",
                },
              };
            }
            return phase;
          });
          return { ...prev, phases: newPhases };
        });
      } else {
        showNotification(
          response?.data?.message ||
            response?.message ||
            "Không thể gửi yêu cầu.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error submitting change request:", err);
      console.error("Error details:", {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message,
      });

      if (err?.response?.status === 404) {
        showNotification(
          "Không tìm thấy lịch hẹn với ID: " + selectedAppointment.id,
          "error"
        );
      } else if (err?.response?.status === 400) {
        showNotification(
          "Dữ liệu không hợp lệ: " +
            (err?.response?.data?.message || err?.message),
          "error"
        );
      } else {
        showNotification(
          err?.response?.data?.message ||
            err?.message ||
            "Không thể gửi yêu cầu.",
          "error"
        );
      }
    } finally {
      setChangeLoading(false);
    }
  };

  const handleExpandPhase = async (phase) => {
    if (!stepAppointments[phase.id]) {
      try {
        const res = await treatmentService.getAppointmentsByStepId(phase.id);
        setStepAppointments((prev) => ({
          ...prev,
          [phase.id]: res?.data?.result || [],
        }));
      } catch (error) {
        setStepAppointments((prev) => ({ ...prev, [phase.id]: [] }));
      }
    }
  };

  const getStatusTag = (status) => {
    switch ((status || "").toUpperCase()) {
      case "COMPLETED":
        return <Tag color="success">Hoàn thành</Tag>;
      case "INPROGRESS":
        return <Tag color="processing">Đang thực hiện</Tag>;
      case "CONFIRMED":
        return <Tag color="processing">Đã xác nhận</Tag>;
      case "PENDING":
      case "PLANED":
        return <Tag color="warning">Đã đặt lịch</Tag>;
      case "CANCELLED":
        return <Tag color="error">Đã hủy</Tag>;
      case "PENDING_CHANGE":
        return <Tag color="purple">Chờ duyệt đổi lịch</Tag>;
      case "REJECTED_CHANGE":
        return <Tag color="red">Từ chối đổi lịch</Tag>;
      case "REJECTED":
        return <Tag color="error">Từ chối thay đổi lịch hẹn</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getStepStatusTag = (status) => {
    switch (status) {
      case "COMPLETED":
        return <Tag color="success">Hoàn thành</Tag>;
      case "INPROGRESS":
        return <Tag color="orange">Đang điều trị</Tag>;
      case "CONFIRMED":
        return <Tag color="processing">Đã xác nhận</Tag>;
      case "CANCELLED":
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "processing";
      case "PLANED":
        return "warning";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      case "INPROGRESS":
        return "orange";
      default:
        return "processing";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PLANED":
        return "Chờ xếp lịch";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      case "INPROGRESS":
        return "Đang điều trị";
      case "PENDING_CHANGE":
        return "Chờ duyệt đổi lịch";
      default:
        return status;
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "CONFIRMED":
        return "blue";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      case "PLANED":
        return "yellow";
      case "PENDING_CHANGE":
        return "gold";
      default:
        return "default";
    }
  };

  const getAppointmentStatusText = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "COMPLETED":
        return "Hoàn thành";
      case "INPROGRESS":
        return "Đang thực hiện";
      case "PLANED":
        return "Đã lên lịch";
      case "CANCELLED":
        return "Đã hủy";
      case "PENDING_CHANGE":
        return "Chờ duyệt đổi lịch";
      case "REJECTED_CHANGE":
        return "Từ chối đổi lịch";
      case "REJECTED":
        return "Từ chối yêu cầu đổi lịch";
      default:
        return status;
    }
  };

  const getCurrentPhase = () => {
    if (!treatmentData?.phases) return null;

    const currentPhase = treatmentData.phases.find(
      (phase) => phase.statusRaw !== "COMPLETED"
    );

    if (currentPhase) {
      return {
        name: currentPhase.name,
        status: currentPhase.statusRaw,
        notes: currentPhase.notes || "",
      };
    }

    const lastPhase = treatmentData.phases[treatmentData.phases.length - 1];
    return {
      name: lastPhase.name,
      status: lastPhase.statusRaw,
      notes: "Đã hoàn thành",
    };
  };

  const renderPhases = () => {
    return (
      treatmentData &&
      treatmentData.phases &&
      treatmentData.phases.map((phase, idx) => ({
        key: phase.id,
        label: (
          <Space>
            <Text strong>{phase.name}</Text>
            {getStepStatusTag(phase.statusRaw)}
          </Space>
        ),
        children: (
          <div>
            <Descriptions size="small" column={3} bordered>
              <Descriptions.Item label="Ngày bắt đầu">
                {phase.startDate
                  ? dayjs(phase.startDate).format("DD/MM/YYYY")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hoàn thành">
                {phase.endDate
                  ? dayjs(phase.endDate).format("DD/MM/YYYY")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {phase.notes || "-"}
              </Descriptions.Item>
            </Descriptions>

            {/* Nút gửi yêu cầu đổi lịch hẹn: chỉ 1 nút trên mỗi phase, không phụ thuộc status */}
            {phase.statusRaw !== "COMPLETED" && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                style={{
                  marginBottom: 12,
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                }}
                onClick={() => handleOpenChangeModal(phase)}
              >
                Gửi yêu cầu thay đổi lịch hẹn
              </Button>
            )}
            {/* Danh sách lịch hẹn */}
            {Array.isArray(stepAppointments[phase.id]) &&
              stepAppointments[phase.id].length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <Text strong>Lịch hẹn:</Text>
                  {stepAppointments[phase.id].map((appointment, idx) => (
                    <div
                      key={appointment.id || idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background:
                            appointment.status === "CONFIRMED"
                              ? "#1890ff"
                              : appointment.status === "PENDING"
                              ? "#faad14"
                              : appointment.status === "COMPLETED"
                              ? "#52c41a"
                              : appointment.status === "CANCELLED"
                              ? "#ff4d4f"
                              : "#d9d9d9",
                          marginRight: 4,
                        }}
                      />
                      <span style={{ fontWeight: 500 }}>
                        {appointment.purpose || phase.name}
                      </span>
                      {getStatusTag(appointment.status)}
                      <CalendarOutlined
                        style={{ marginLeft: 8, marginRight: 4 }}
                      />
                      <span>
                        {dayjs(appointment.appointmentDate).format(
                          "DD/MM/YYYY"
                        )}
                      </span>
                      <span style={{ marginLeft: 8 }}>
                        - Ca:{" "}
                        {appointment.shift === "MORNING" ? "Sáng" : "Chiều"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            {phase.activities.length === 0 && (
              <div style={{ marginTop: 16, color: "#666" }}>
                Chưa có hoạt động được lên lịch
              </div>
            )}
          </div>
        ),
        onClick: () => handleExpandPhase(phase),
      }))
    );
  };

  const totalSteps =
    treatmentData && treatmentData.phases ? treatmentData.phases.length : 0;
  const completedSteps =
    treatmentData && treatmentData.phases
      ? treatmentData.phases.filter((phase) => phase.statusRaw === "COMPLETED")
          .length
      : 0;
  const progress =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const currentPhaseIdx =
    treatmentData && typeof treatmentData.currentPhase === "number"
      ? treatmentData.currentPhase - 1
      : -1;
  const currentPhase = getCurrentPhase();

  const handleStepClick = (phase) => {
    setSelectedPhase(phase);
    setModalOpen(true);
  };

  // Thêm hàm mở modal xem lịch hẹn của bước
  const handleShowScheduleModal = async (step) => {
    setScheduleStep(step);
    setShowScheduleModal(true);
    setShowAllAppointments(false); // Reset về hiển thị 3 lịch hẹn đầu
    try {
      const response = await treatmentService.getAppointmentsByStepId(step.id);
      // Lấy đúng mảng appointments (paginated hoặc không)
      let appointments = [];
      if (response?.data?.result?.content) {
        appointments = response.data.result.content;
      } else if (Array.isArray(response?.data?.result)) {
        appointments = response.data.result;
      } else if (Array.isArray(response)) {
        appointments = response;
      }
      // Reset showAll state cho tất cả appointments
      const appointmentsWithState = appointments.map((app) => ({
        ...app,
        showAll: false,
      }));
      setStepAppointments((prev) => ({
        ...prev,
        [step.id]: appointmentsWithState,
      }));
    } catch (error) {
      setStepAppointments((prev) => ({ ...prev, [step.id]: [] }));
    }
  };

  const getOverallStatus = (status, progress) => {
    if (status === "CANCELLED") {
      return { text: "Đã hủy", color: "error" };
    }
    if (status === "COMPLETED") {
      return { text: "Hoàn thành", color: "success" };
    }
    if (status === "INPROGRESS") {
      return { text: "Đang điều trị", color: "processing" };
    }
    if (status === "PENDING") {
      return { text: "Đang chờ điều trị", color: "warning" };
    }
    return { text: "Đang chờ điều trị", color: "warning" };
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return "#faad14";
    if (progress === 100) return "#52c41a";
    return "#1890ff";
  };

  // Thêm hàm chuyển đổi result sang tiếng Việt
  const getResultText = (result) => {
    switch ((result || "").toUpperCase()) {
      case "SUCCESS":
        return "Thành công";
      case "FAILURE":
        return "Thất bại";
      case "UNDETERMINED":
        return "Chưa xác định";
      default:
        return "Chưa có";
    }
  };

  const renderTreatmentOverview = () => (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
      }}
      hoverable
      styles={{ body: { padding: "24px" } }}
    >
      <Row gutter={[24, 16]}>
        <Col xs={24} md={24}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space>
                <Text strong style={{ fontSize: 16 }}>
                  Gói điều trị:
                </Text>
                <Text style={{ fontSize: 16 }}>{treatmentData.type}</Text>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space>
                <Text strong>Bác sĩ:</Text>
                <Text>{treatmentData.doctor}</Text>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space>
                <Text strong>Ngày bắt đầu:</Text>
                <Text>
                  {dayjs(treatmentData.startDate).format("DD/MM/YYYY")}
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space>
                <Text strong>Trạng thái:</Text>
                <Tag
                  color={getStatusColor(treatmentData.status)}
                  style={{ fontSize: 15, padding: "4px 16px" }}
                >
                  {getStatusText(treatmentData.status)}
                </Tag>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space>
                <Text strong>Kết quả:</Text>
                <Tag
                  color={
                    treatmentData.result === "SUCCESS"
                      ? "green"
                      : treatmentData.result === "FAILURE"
                      ? "red"
                      : treatmentData.result === "UNDETERMINED"
                      ? "orange"
                      : "default"
                  }
                  style={{ fontSize: 15, padding: "4px 16px" }}
                >
                  {getResultText(treatmentData.result)}
                </Tag>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space>
                <Text strong>Ghi chú:</Text>
                <Text>{treatmentData.notes || "Không có ghi chú"}</Text>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );

  const renderTreatmentProgress = () => (
    <Card
      title={
        <span style={{ fontWeight: 700, fontSize: 20, color: "#1890ff" }}>
          Các bước điều trị
        </span>
      }
      style={{
        marginBottom: 32,
        borderRadius: 18,
        boxShadow: "0 4px 16px rgba(24,144,255,0.08)",
        background: "#fff",
      }}
      styles={{ body: { padding: 32 } }}
    >
      <Timeline style={{ marginLeft: 16 }}>
        {treatmentData.phases.map((step, index) => (
          <Timeline.Item
            key={step.id}
            color={getStatusColor(step.statusRaw)}
            dot={
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background:
                    getStatusColor(step.statusRaw) === "success"
                      ? "#e6fffb"
                      : getStatusColor(step.statusRaw) === "error"
                      ? "#fff1f0"
                      : getStatusColor(step.statusRaw) === "processing"
                      ? "#e6f7ff"
                      : getStatusColor(step.statusRaw) === "orange"
                      ? "#fff7e6"
                      : "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `3px solid ${
                    getStatusColor(step.statusRaw) === "success"
                      ? "#52c41a"
                      : getStatusColor(step.statusRaw) === "error"
                      ? "#ff4d4f"
                      : getStatusColor(step.statusRaw) === "processing"
                      ? "#1890ff"
                      : getStatusColor(step.statusRaw) === "orange"
                      ? "#fa8c16"
                      : "#d9d9d9"
                  }`,
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    color:
                      getStatusColor(step.statusRaw) === "success"
                        ? "#52c41a"
                        : getStatusColor(step.statusRaw) === "error"
                        ? "#ff4d4f"
                        : getStatusColor(step.statusRaw) === "processing"
                        ? "#1890ff"
                        : getStatusColor(step.statusRaw) === "orange"
                        ? "#fa8c16"
                        : "#bfbfbf",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </span>
              </div>
            }
          >
            <Card
              size="small"
              style={{
                marginBottom: 24,
                borderRadius: 16,
                boxShadow: "0 2px 8px rgba(24,144,255,0.08)",
                background: index === 0 ? "#fafdff" : "#fff",
                transition: "box-shadow 0.2s",
                border: `1.5px solid ${
                  getStatusColor(step.statusRaw) === "success"
                    ? "#52c41a"
                    : getStatusColor(step.statusRaw) === "error"
                    ? "#ff4d4f"
                    : getStatusColor(step.statusRaw) === "processing"
                    ? "#1890ff"
                    : getStatusColor(step.statusRaw) === "orange"
                    ? "#fa8c16"
                    : "#d9d9d9"
                }`,
              }}
              styles={{ body: { padding: 24 } }}
              hoverable
            >
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={16}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
                      Bước {index + 1}: {step.name}
                    </Text>
                    <Tag
                      color={getStatusColor(step.statusRaw)}
                      style={{ fontSize: 15, padding: "4px 16px" }}
                    >
                      {getStatusText(step.statusRaw)}
                    </Tag>
                  </div>
                  <Descriptions
                    column={2}
                    size="small"
                    style={{ background: "transparent" }}
                  >
                    <Descriptions.Item label="Ngày bắt đầu">
                      {step.startDate
                        ? dayjs(step.startDate).format("DD/MM/YYYY")
                        : "Chưa có lịch"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc">
                      {step.endDate
                        ? dayjs(step.endDate).format("DD/MM/YYYY")
                        : "Chưa thực hiện"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">
                      {step.notes || "Không có ghi chú"}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: "right" }}>
                  <Space direction="vertical" size="small">
                    <Button
                      type="primary"
                      ghost
                      icon={<FileTextOutlined />}
                      style={{
                        borderRadius: 8,
                        fontWeight: 600,
                        minWidth: 140,
                      }}
                      onClick={() => handleShowScheduleModal(step)}
                    >
                      Xem lịch hẹn
                    </Button>
                    {step.statusRaw !== "COMPLETED" && (
                      <Button
                        type="default"
                        icon={<EditOutlined />}
                        style={{
                          borderRadius: 8,
                          fontWeight: 600,
                          minWidth: 140,
                        }}
                        onClick={() => handleOpenChangeModal(step)}
                      >
                        Gửi yêu cầu đổi hẹn
                      </Button>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );

  const columns = [
    {
      title: "Gói điều trị",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text) => (
        <Space>
          <MedicineBoxOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Bác sĩ phụ trách",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {dayjs(date).format("DD/MM/YYYY")}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (result) => (
        <Tag
          color={
            result === "SUCCESS"
              ? "green"
              : result === "FAILURE"
              ? "red"
              : result === "UNDETERMINED"
              ? "orange"
              : "default"
          }
        >
          {getResultText(result)}
        </Tag>
      ),
    },
    // Thêm cột Ghi chú
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "Không có ghi chú",
    },

    {
      title: "Chi tiết dịch vụ",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<RightOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleViewDetail = async (record) => {
    try {
      setLoading(true);

      // Lấy chi tiết treatment record bằng API mới
      const detailResponse = await treatmentService.getTreatmentRecordById(
        record.id
      );
      const detailData = detailResponse?.data?.result;

      if (!detailData) {
        message.error("Không tìm thấy thông tin chi tiết điều trị");
        return;
      }

      // Format dữ liệu để hiển thị
      const treatmentSteps = detailData.treatmentSteps || [];
      const totalSteps = treatmentSteps.length;
      const completedSteps = treatmentSteps.filter(
        (step) => step.status === "COMPLETED"
      ).length;
      const overallProgress =
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

      // Lấy appointments cho từng step (dùng API get-by-step/{stepId})
      const stepsWithAppointments = await Promise.all(
        treatmentSteps.map(async (step) => {
          try {
            const appointmentsResponse =
              await treatmentService.getAppointmentsByStepId(step.id);
            const appointments = appointmentsResponse?.data?.result || [];
            return {
              ...step,
              appointments: appointments,
            };
          } catch (error) {
            console.warn(
              `Không thể lấy appointments cho step ${step.id}:`,
              error
            );
            return {
              ...step,
              appointments: [],
            };
          }
        })
      );

      setTreatmentData({
        id: detailData.id,
        type: detailData.treatmentServiceName || detailData.serviceName,
        startDate: detailData.startDate,
        currentPhase:
          treatmentSteps.findIndex((step) => step.status !== "COMPLETED") + 1 ||
          1,
        doctor: detailData.doctorName,
        status: detailData.status,
        estimatedCompletion:
          detailData.endDate ||
          dayjs(detailData.startDate).add(45, "days").format("YYYY-MM-DD"),
        nextAppointment: null,
        overallProgress: overallProgress,
        customerId: detailData.customerId,
        result: detailData.result, // <--- Bổ sung dòng này
        notes: detailData.notes || "", // <--- Bổ sung dòng này
        phases: stepsWithAppointments.map((step, index) => ({
          id: step.id,
          name: step.name,
          statusRaw: step.status,
          status: step.status,
          startDate: step.startDate,
          endDate: step.endDate,
          notes: step.notes || "",
          appointment: step.appointments[0] || null,
          activities: [
            {
              name: step.name,
              date: step.startDate,
              status: step.status,
              notes: step.notes || "",
            },
          ],
        })),
      });

      setViewMode("detail");
      setSelectedPhase(null);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết điều trị:", error);
      message.error("Không thể lấy thông tin chi tiết điều trị");
    } finally {
      setLoading(false);
    }
  };

  const renderListView = () => (
    <div style={{ padding: "24px" }}>
      <Card>
        <Table
          columns={columns}
          dataSource={treatments}
          loading={loading}
          pagination={false}
        />
        <div className="flex justify-end mt-4">
          <Button
            disabled={currentPage === 0}
            onClick={() => fetchData(currentPage - 1)}
            className="mr-2"
          >
            Trang trước
          </Button>
          <span className="px-4 py-1 bg-gray-100 rounded text-sm">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <Button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => fetchData(currentPage + 1)}
            className="ml-2"
          >
            Trang tiếp
          </Button>
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  if (viewMode === "list") {
    return renderListView();
  }

  if (!treatmentData || !treatmentData.phases) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Text type="secondary">Không có thông tin điều trị</Text>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          background: "white",
          padding: "16px 24px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setViewMode("list");
              setTreatmentData(null); // dọn data chi tiết
            }}
            style={{ border: "none", boxShadow: "none" }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Tiến độ điều trị
          </Title>
        </div>
      </div>

      {renderTreatmentOverview()}
      {renderTreatmentProgress()}

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title={selectedPhase ? selectedPhase.name : ""}
        destroyOnHidden
      >
        {selectedPhase && (
          <div>
            <p>
              <b>Trạng thái:</b> {getStepStatusTag(selectedPhase.statusRaw)}
            </p>
            {selectedPhase.displayDate && (
              <p>
                <b>Ngày dự kiến:</b>{" "}
                {dayjs(selectedPhase.displayDate).format("DD/MM/YYYY")}
              </p>
            )}
            {selectedPhase.endDate && (
              <p>
                <b>Ngày thực hiện:</b>{" "}
                {dayjs(selectedPhase.endDate).format("DD/MM/YYYY")}
              </p>
            )}
            {selectedPhase.notes && (
              <p>
                <b>Ghi chú:</b> {selectedPhase.notes}
              </p>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title={`Gửi yêu cầu thay đổi lịch hẹn: ${changeStep?.name || ""}`}
        open={changeModalVisible}
        onCancel={() => setChangeModalVisible(false)}
        onOk={handleSubmitChange}
        okText="Gửi yêu cầu"
        confirmLoading={changeLoading}
        destroyOnHidden
        width={800}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={changeLoading}
            onClick={handleSubmitChange}
          >
            Gửi yêu cầu
          </Button>,
        ]}
      >
        {changeLoading ? (
          <Spin />
        ) : changeAppointment && Array.isArray(changeAppointment) ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Chọn lịch hẹn muốn thay đổi:</Text>
            </div>
            <Table
              dataSource={changeAppointment}
              columns={[
                {
                  title: "Ngày hẹn",
                  dataIndex: "appointmentDate",
                  key: "appointmentDate",
                  render: (date) => dayjs(date).format("DD/MM/YYYY"),
                },
                {
                  title: "Ca khám",
                  dataIndex: "shift",
                  key: "shift",
                  render: (shift) => (shift === "MORNING" ? "Sáng" : "Chiều"),
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => {
                    switch ((status || "").toUpperCase()) {
                      case "CONFIRMED":
                        return <Tag color="#1890ff">Đã xác nhận</Tag>;
                      case "PENDING":
                        return <Tag color="orange">Đang chờ</Tag>;
                      case "PLANED":
                        return <Tag color="orange">Đã đặt lịch</Tag>;
                      case "PENDING_CHANGE":
                        return <Tag color="purple">Chờ duyệt đổi lịch</Tag>;
                      case "REJECTED_CHANGE":
                        return <Tag color="red">Từ chối đổi lịch</Tag>;
                      case "REJECTED":
                        return <Tag color="red">Đã từ chối</Tag>;
                      case "COMPLETED":
                        return <Tag color="green">Đã hoàn thành</Tag>;
                      case "CANCELLED":
                        return <Tag color="error">Đã hủy</Tag>;
                      case "INPROGRESS":
                        return <Tag color="#1890ff">Đang thực hiện</Tag>;
                      default:
                        return <Tag color="default">{status}</Tag>;
                    }
                  },
                },
                {
                  title: "Ghi chú",
                  dataIndex: "notes",
                  key: "notes",
                  render: (notes) => notes || "-",
                },
                {
                  title: "Chọn",
                  key: "select",
                  render: (_, record) => (
                    <Button
                      type={
                        selectedAppointment?.id === record.id
                          ? "primary"
                          : "default"
                      }
                      size="small"
                      onClick={() => {
                        setSelectedAppointment(record);
                        changeForm.setFieldsValue({
                          requestedDate: record.appointmentDate
                            ? dayjs(record.appointmentDate)
                            : null,
                          requestedShift: record.shift || undefined,
                          notes: record.notes || "",
                        });
                      }}
                    >
                      {selectedAppointment?.id === record.id
                        ? "Đã chọn"
                        : "Chọn"}
                    </Button>
                  ),
                },
              ]}
              pagination={false}
              size="small"
              rowKey="id"
            />

            {selectedAppointment && (
              <div style={{ marginTop: 16 }}>
                <Divider />
                <Text strong>Thông tin lịch hẹn mới:</Text>
                <Form
                  form={changeForm}
                  layout="vertical"
                  style={{ marginTop: 16 }}
                >
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
                    <Input.TextArea
                      rows={2}
                      placeholder="Ghi chú thêm (nếu có)"
                    />
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        ) : (
          <Alert
            type="warning"
            message="Không tìm thấy lịch hẹn tương ứng cho bước này!"
          />
        )}
      </Modal>

      {/* Modal xem lịch hẹn của bước điều trị */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>Lịch hẹn của bước điều trị</div>
        }
        open={showScheduleModal}
        onCancel={() => {
          setShowScheduleModal(false);
          setScheduleStep(null);
        }}
        footer={null}
        width={700}
        centered
      >
        <div style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 16 }}>
            Các lần hẹn đã đăng ký cho bước này:
          </div>
          {!stepAppointments[scheduleStep?.id] ||
          stepAppointments[scheduleStep?.id].length === 0 ? (
            <div
              style={{
                color: "#888",
                textAlign: "center",
                padding: 20,
                background: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              Chưa có lịch hẹn nào cho bước này.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  justifyContent: "center",
                }}
              >
                {stepAppointments[scheduleStep?.id]
                  ?.slice(0, 3)
                  .map((appointment, idx) => {
                    const statusColor = getAppointmentStatusColor(
                      appointment.status
                    );
                    const statusIcon = (() => {
                      switch (appointment.status) {
                        case "COMPLETED":
                          return (
                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                          );
                        case "CONFIRMED":
                          return (
                            <ClockCircleOutlined style={{ color: "#1890ff" }} />
                          );
                        case "CANCELLED":
                          return <CloseOutlined style={{ color: "#ff4d4f" }} />;
                        case "PENDING":
                          return (
                            <ExclamationCircleOutlined
                              style={{ color: "#faad14" }}
                            />
                          );
                        case "PENDING_CHANGE":
                          return <SwapOutlined style={{ color: "#faad14" }} />;
                        default:
                          return (
                            <ClockCircleOutlined style={{ color: "#d9d9d9" }} />
                          );
                      }
                    })();
                    return (
                      <Card
                        key={appointment.id}
                        size="small"
                        style={{
                          width: 200,
                          border: `2px solid ${
                            statusColor === "default" ? "#d9d9d9" : statusColor
                          }`,
                          borderRadius: 14,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                          position: "relative",
                          marginBottom: 8,
                          background: "#fff",
                          minHeight: 180,
                        }}
                        styles={{ body: { padding: 16 } }}
                      >
                        <div
                          style={{ position: "absolute", top: 10, right: 10 }}
                        >
                          {statusIcon}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Ngày hẹn:</Text>
                          <br />
                          <Text>
                            {dayjs(appointment.appointmentDate).format(
                              "DD/MM/YYYY"
                            )}
                          </Text>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Ca khám:</Text>
                          <br />
                          <Tag color="cyan">
                            {appointment.shift === "MORNING"
                              ? "Sáng"
                              : appointment.shift === "AFTERNOON"
                              ? "Chiều"
                              : appointment.shift}
                          </Tag>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Trạng thái:</Text>
                          <br />
                          <Tag color={statusColor}>
                            {getAppointmentStatusText(appointment.status)}
                          </Tag>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Ghi chú:</Text>
                          <br />
                          <Tag
                            color="blue"
                            style={{
                              maxWidth: "100%",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              display: "inline-block",
                              verticalAlign: "top",
                            }}
                            title={appointment.notes} // tooltip đầy đủ khi hover
                          >
                            {appointment.notes}
                          </Tag>
                        </div>
                        {appointment.purpose && (
                          <div style={{ marginTop: 8 }}>
                            <Text strong>Mục đích:</Text>
                            <br />
                            <Text>{appointment.purpose}</Text>
                          </div>
                        )}
                      </Card>
                    );
                  })}
              </div>

              {/* Hiển thị thêm các lịch hẹn còn lại khi đã click "Xem thêm" */}
              {stepAppointments[scheduleStep?.id]?.some(
                (app) => app.showAll
              ) && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    justifyContent: "center",
                    marginTop: 16,
                  }}
                >
                  {stepAppointments[scheduleStep?.id]
                    ?.slice(3)
                    .map((appointment, idx) => {
                      const statusColor = getAppointmentStatusColor(
                        appointment.status
                      );
                      const statusIcon = (() => {
                        switch (appointment.status) {
                          case "COMPLETED":
                            return (
                              <CheckCircleOutlined
                                style={{ color: "#52c41a" }}
                              />
                            );
                          case "CONFIRMED":
                            return (
                              <ClockCircleOutlined
                                style={{ color: "#1890ff" }}
                              />
                            );
                          case "CANCELLED":
                            return (
                              <CloseOutlined style={{ color: "#ff4d4f" }} />
                            );
                          case "PENDING":
                            return (
                              <ExclamationCircleOutlined
                                style={{ color: "#faad14" }}
                              />
                            );
                          case "PENDING_CHANGE":
                            return (
                              <SwapOutlined style={{ color: "#faad14" }} />
                            );
                          default:
                            return (
                              <ClockCircleOutlined
                                style={{ color: "#d9d9d9" }}
                              />
                            );
                        }
                      })();
                      return (
                        <Card
                          key={appointment.id}
                          size="small"
                          style={{
                            width: 200,
                            border: `2px solid ${
                              statusColor === "default"
                                ? "#d9d9d9"
                                : statusColor
                            }`,
                            borderRadius: 14,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                            position: "relative",
                            marginBottom: 8,
                            background: "#fff",
                            minHeight: 180,
                          }}
                          styles={{ body: { padding: 16 } }}
                        >
                          <div
                            style={{ position: "absolute", top: 10, right: 10 }}
                          >
                            {statusIcon}
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>Ngày hẹn:</Text>
                            <br />
                            <Text>
                              {dayjs(appointment.appointmentDate).format(
                                "DD/MM/YYYY"
                              )}
                            </Text>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>Ca khám:</Text>
                            <br />
                            <Tag color="cyan">
                              {appointment.shift === "MORNING"
                                ? "Sáng"
                                : appointment.shift === "AFTERNOON"
                                ? "Chiều"
                                : appointment.shift}
                            </Tag>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>Trạng thái:</Text>
                            <br />
                            <Tag color={statusColor}>
                              {getAppointmentStatusText(appointment.status)}
                            </Tag>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>Ghi chú:</Text>
                            <br />
                            <Tag
                              color="blue"
                              style={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                display: "inline-block",
                                verticalAlign: "top",
                              }}
                              title={appointment.notes} // tooltip đầy đủ khi hover
                            >
                              {appointment.notes}
                            </Tag>
                          </div>
                          {appointment.purpose && (
                            <div style={{ marginTop: 8 }}>
                              <Text strong>Mục đích:</Text>
                              <br />
                              <Text>{appointment.purpose}</Text>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                </div>
              )}

              {/* Nút "Xem thêm" hoặc "Ẩn bớt" ở cuối */}
              {stepAppointments[scheduleStep?.id]?.length > 3 && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  {stepAppointments[scheduleStep?.id]?.some(
                    (app) => app.showAll
                  ) ? (
                    <Button
                      type="default"
                      icon={<FileTextOutlined />}
                      onClick={() => {
                        setStepAppointments((prev) => {
                          if (prev[scheduleStep?.id]) {
                            return {
                              ...prev,
                              [scheduleStep?.id]: prev[scheduleStep?.id].map(
                                (app) => ({ ...app, showAll: false })
                              ),
                            };
                          }
                          return prev;
                        });
                      }}
                      style={{ borderRadius: 8, minWidth: 140 }}
                    >
                      Ẩn bớt
                    </Button>
                  ) : (
                    <Button
                      type="default"
                      icon={<FileTextOutlined />}
                      onClick={() => {
                        setStepAppointments((prev) => {
                          if (prev[scheduleStep?.id]) {
                            return {
                              ...prev,
                              [scheduleStep?.id]: prev[scheduleStep?.id].map(
                                (app) => ({ ...app, showAll: true })
                              ),
                            };
                          }
                          return prev;
                        });
                      }}
                      style={{ borderRadius: 8, minWidth: 140 }}
                    >
                      Xem thêm ({stepAppointments[scheduleStep?.id]?.length - 3}
                      )
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TreatmentProgress;
