import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Spin,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  DatePicker,
  Input,
  Select,
  Row,
  Col,
  Avatar,
  Tooltip,
  Badge,
  Switch,
  Radio,
  Dropdown,
  Timeline,
  Descriptions,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  SwapOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import dayjs from "dayjs";
import { NotificationContext } from "../../App";

const { Title, Text } = Typography;
const { TextArea } = Input;

const TreatmentStageDetails = () => {
  console.log("🚀 TreatmentStageDetails component loaded");

  const [loading, setLoading] = useState(true);
  const [treatmentData, setTreatmentData] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [form] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const [scheduleStep, setScheduleStep] = useState(null);
  const [stepAppointments, setStepAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showStepDetailModal, setShowStepDetailModal] = useState(false);
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] =
    useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [addStepForm] = Form.useForm();
  const [showChangeServiceModal, setShowChangeServiceModal] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const dataLoadedRef = React.useRef(false);
  const [addStepAuto, setAddStepAuto] = useState(false);
  const [addStepLoading, setAddStepLoading] = useState(false);
  const [stageOptions, setStageOptions] = useState([]);
  const [editingStepStageId, setEditingStepStageId] = useState(null);
  // 1. Thêm state cho modal chọn kết quả
  const [showResultModal, setShowResultModal] = useState(false);
  const [pendingCompleteStatus, setPendingCompleteStatus] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null); // { appointmentId, newStatus }
  const [note, setNote] = useState(""); // note nhập từ modal

  const statusOptions = [
    { value: "PLANED", label: "Đã đặt lịch" },
    { value: "PENDING_CHANGE", label: "Chờ duyệt đổi lịch" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "INPROGRESS", label: "Đang điều trị" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await authService.getMyInfo();
        const id = res?.data?.result?.id;
        if (id) {
          setDoctorId(id);
        } else {
          showNotification("Không thể lấy thông tin bác sĩ", "error");
          navigate(-1);
        }
      } catch (error) {
        showNotification("Không thể lấy thông tin bác sĩ", "error");
        navigate(-1);
      }
    };
    fetchDoctorInfo();
  }, [navigate, showNotification]);

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId || dataLoadedRef.current) return;

      dataLoadedRef.current = true;

      try {
        const {
          patientInfo,
          treatmentData: passedTreatmentData,
          appointmentData,
        } = location.state || {};
        if (!patientInfo) {
          showNotification("Không tìm thấy thông tin bệnh nhân", "warning");
          navigate(-1);
          return;
        }

        console.log("📋 Received data from PatientList:", {
          patientInfo,
          treatmentData: passedTreatmentData,
          appointmentData,
        });

        // Chỉ sử dụng treatmentData được truyền từ PatientList
        if (passedTreatmentData && passedTreatmentData.id) {
          // Nếu đã có đủ steps thì dùng luôn
          if (
            passedTreatmentData.treatmentSteps &&
            passedTreatmentData.treatmentSteps.length > 0
          ) {
            setTreatmentData(passedTreatmentData);
            setLoading(false);
            return;
          } else {
            // Gọi API lấy chi tiết để có steps
            console.log(
              "⚠️ TreatmentData missing steps, calling API to get details..."
            );
            const detailedResponse =
              await treatmentService.getTreatmentRecordById(
                passedTreatmentData.id
              );
            const detailedData = detailedResponse?.data?.result;
            if (detailedData) {
              setTreatmentData(detailedData);
              setLoading(false);
              return;
            } else {
              setTreatmentData(passedTreatmentData);
              setLoading(false);
              return;
            }
          }
        }

        // Nếu không có treatmentData từ PatientList, báo lỗi
        showNotification(
          "Không nhận được dữ liệu điều trị từ danh sách bệnh nhân",
          "error"
        );
        navigate(-1);
      } catch (error) {
        showNotification("Không thể lấy thông tin điều trị", "error");
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]); // Chỉ phụ thuộc vào doctorId

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
        return "blue";
      default:
        return "processing";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PLANNED":
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
        return "Đang điều trị";
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

  const handleUpdateStep = async (values) => {
    if (!editingStep) return;
    try {
      const updateData = {
        stageId: editingStepStageId,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : undefined,
        endDate: values.endDate
          ? values.endDate.format("YYYY-MM-DD")
          : undefined,
        status: values.status,
        notes: values.notes,
      };
      const response = await treatmentService.updateTreatmentStep(
        editingStep.id,
        updateData
      );
      console.log("🔍 Update response:", response);
      console.log("🔍 Response code:", response?.code || response?.data?.code);

      if (response?.code === 1000 || response?.data?.code === 1000) {
        console.log("✅ Update successful, refreshing data...");

        // Thử lấy treatment record với steps để refresh data
        try {
          const detailedResponse =
            await treatmentService.getTreatmentRecordById(treatmentData.id);
          const detailedData = detailedResponse?.data?.result;

          console.log("🔍 Detailed response after update:", detailedResponse);
          console.log("🔍 Detailed data after update:", detailedData);

          if (detailedData && detailedData.treatmentSteps) {
            console.log("✅ Setting updated treatment data:", detailedData);
            setTreatmentData(detailedData);
          } else {
            console.warn("❌ Treatment record không có steps sau khi update");
            // Fallback to old method
            const updatedResponse =
              await treatmentService.getTreatmentRecordsByDoctor(doctorId);

            // Đảm bảo updatedResponse là array
            let treatmentRecords = [];
            if (Array.isArray(updatedResponse)) {
              treatmentRecords = updatedResponse;
            } else if (updatedResponse?.data?.result) {
              if (Array.isArray(updatedResponse.data.result)) {
                treatmentRecords = updatedResponse.data.result;
              } else if (
                updatedResponse.data.result.content &&
                Array.isArray(updatedResponse.data.result.content)
              ) {
                treatmentRecords = updatedResponse.data.result.content;
              }
            }

            if (treatmentRecords && treatmentRecords.length > 0) {
              const updatedRecord = treatmentRecords.find(
                (record) => record.id === treatmentData.id
              );
              if (updatedRecord) {
                console.log(
                  "✅ Setting updated record from list:",
                  updatedRecord
                );
                setTreatmentData(updatedRecord);
              }
            }
          }
        } catch (refreshError) {
          console.warn("❌ Không thể refresh data:", refreshError);
          // Fallback to old method
          const updatedResponse =
            await treatmentService.getTreatmentRecordsByDoctor(doctorId);

          // Đảm bảo updatedResponse là array
          let treatmentRecords = [];
          if (Array.isArray(updatedResponse)) {
            treatmentRecords = updatedResponse;
          } else if (updatedResponse?.data?.result) {
            if (Array.isArray(updatedResponse.data.result)) {
              treatmentRecords = updatedResponse.data.result;
            } else if (
              updatedResponse.data.result.content &&
              Array.isArray(updatedResponse.data.result.content)
            ) {
              treatmentRecords = updatedResponse.data.result.content;
            }
          }

          if (treatmentRecords && treatmentRecords.length > 0) {
            const updatedRecord = treatmentRecords.find(
              (record) => record.id === treatmentData.id
            );
            if (updatedRecord) {
              console.log(
                "✅ Setting updated record from fallback:",
                updatedRecord
              );
              setTreatmentData(updatedRecord);
            }
          }
        }

        setEditingStep(null);
        form.resetFields();
        setEditingStepStageId(null);
        showNotification("Cập nhật thành công", "success");
      } else {
        console.warn(
          "❌ Update failed - invalid response code:",
          response?.code || response?.data?.code
        );
        showNotification("Cập nhật thất bại", "error");
      }
    } catch (error) {
      showNotification(error.response?.data.message, "error");
    }
  };

  const handleScheduleAppointment = async (values) => {
    try {
      // Lấy đúng step object từ treatmentData dựa vào id
      const stepObj = treatmentData.treatmentSteps.find(
        (step) => String(step.id) === String(values.treatmentStepId)
      );

      const appointmentData = {
        customerId: treatmentData.customerId,
        doctorId: doctorId,
        appointmentDate: values.appointmentDate.format("YYYY-MM-DD"),
        shift: values.shift,
        purpose: values.purpose, // Lấy từ form
        notes: values.notes,
        treatmentStepId: values.treatmentStepId,
      };
      const response = await treatmentService.createAppointment(
        appointmentData
      );
      if (response?.data?.code === 1000) {
        showNotification("Tạo lịch hẹn thành công", "success");

        // Đóng modal tạo lịch hẹn và reset form
        setShowCreateAppointmentModal(false);
        scheduleForm.resetFields();

        // Không mở lại modal xem lịch hẹn nữa, chỉ hiển thị thông báo thành công
      } else {
        showNotification(
          response?.data?.message || "Tạo lịch hẹn thất bại",
          "error"
        );
      }
    } catch (error) {
      showNotification(error.response.data.message, "error");
    }
  };

  const showEditModal = async (step) => {
    setEditingStep(step);
    // Lấy treatmentStageId từ API
    try {
      const res = await treatmentService.getTreatmentStepById(step.id);
      const detail = res?.data?.result;
      setEditingStepStageId(detail?.treatmentStageId);
      form.setFieldsValue({
        startDate: detail?.startDate ? dayjs(detail.startDate) : null,
        endDate: detail?.endDate ? dayjs(detail.endDate) : null,
        status: detail?.status === "CONFIRMED" ? undefined : detail?.status,
        notes: detail?.notes,
      });
    } catch {
      setEditingStepStageId(step.stageId);
      form.setFieldsValue({
        startDate: step.startDate ? dayjs(step.startDate) : null,
        endDate: step.endDate ? dayjs(step.endDate) : null,
        status: step.status === "CONFIRMED" ? undefined : step.status,
        notes: step.notes,
      });
    }
  };

  const handleCompleteTreatment = async () => {
    try {
      console.log("🔍 handleCompleteTreatment called:", {
        treatmentId: treatmentData.id,
        status: "COMPLETED",
      });

      const response = await treatmentService.updateTreatmentStatus(
        treatmentData.id,
        "COMPLETED"
      );

      console.log("🔍 Complete treatment response:", response);
      console.log("🔍 Response code:", response?.code || response?.data?.code);

      if (response?.data?.code === 1000 || response?.code === 1000) {
        console.log("✅ Treatment completed successfully, refreshing data...");
        showNotification("Hoàn thành điều trị thành công", "success");

        // Thử lấy treatment record với steps để refresh data
        try {
          const detailedResponse =
            await treatmentService.getTreatmentRecordById(treatmentData.id);
          const detailedData = detailedResponse?.data?.result;

          console.log(
            "🔍 Detailed response after completion:",
            detailedResponse
          );
          console.log("🔍 Detailed data after completion:", detailedData);

          if (detailedData && detailedData.treatmentSteps) {
            console.log(
              "✅ Setting updated treatment data after completion:",
              detailedData
            );
            setTreatmentData(detailedData);
          } else {
            console.warn("❌ Treatment record không có steps sau khi complete");
            // Fallback to old method
            const updatedResponse =
              await treatmentService.getTreatmentRecordsByDoctor(doctorId);

            // Đảm bảo updatedResponse là array
            let treatmentRecords = [];
            if (Array.isArray(updatedResponse)) {
              treatmentRecords = updatedResponse;
            } else if (updatedResponse?.data?.result) {
              if (Array.isArray(updatedResponse.data.result)) {
                treatmentRecords = updatedResponse.data.result;
              } else if (
                updatedResponse.data.result.content &&
                Array.isArray(updatedResponse.data.result.content)
              ) {
                treatmentRecords = updatedResponse.data.result.content;
              }
            }

            if (treatmentRecords && treatmentRecords.length > 0) {
              const updatedRecord = treatmentRecords.find(
                (record) => record.id === treatmentData.id
              );
              if (updatedRecord) {
                console.log(
                  "✅ Setting updated record from list after completion:",
                  updatedRecord
                );
                setTreatmentData(updatedRecord);
              }
            }
          }
        } catch (refreshError) {
          console.warn(
            "❌ Không thể refresh data after completion:",
            refreshError
          );
          // Fallback to old method
          const updatedResponse =
            await treatmentService.getTreatmentRecordsByDoctor(doctorId);

          // Đảm bảo updatedResponse là array
          let treatmentRecords = [];
          if (Array.isArray(updatedResponse)) {
            treatmentRecords = updatedResponse;
          } else if (updatedResponse?.data?.result) {
            if (Array.isArray(updatedResponse.data.result)) {
              treatmentRecords = updatedResponse.data.result;
            } else if (
              updatedResponse.data.result.content &&
              Array.isArray(updatedResponse.data.result.content)
            ) {
              treatmentRecords = updatedResponse.data.result.content;
            }
          }

          if (treatmentRecords && treatmentRecords.length > 0) {
            const updatedRecord = treatmentRecords.find(
              (record) => record.id === treatmentData.id
            );
            if (updatedRecord) {
              console.log(
                "✅ Setting updated record from fallback after completion:",
                updatedRecord
              );
              setTreatmentData(updatedRecord);
            }
          }
        }
      } else {
        console.warn(
          "❌ Treatment completion failed - invalid response code:",
          response?.code || response?.data?.code
        );
        showNotification("Hoàn thành điều trị thất bại", "error");
      }
    } catch (error) {
      showNotification(error.response?.data.message, "error");
    }
  };

  const isAllStepsCompleted = () => {
    if (!treatmentData?.treatmentSteps) return false;
    const activeSteps = treatmentData.treatmentSteps.filter(
      (step) => step.status !== "CANCELLED"
    );
    return (
      activeSteps.length > 0 &&
      activeSteps.every((step) => step.status === "COMPLETED")
    );
  };

  const calculateProgress = () => {
    if (!treatmentData?.treatmentSteps) return 0;
    const completedSteps = treatmentData.treatmentSteps.filter(
      (step) => step.status === "COMPLETED"
    ).length;
    return Math.round(
      (completedSteps / treatmentData.treatmentSteps.length) * 100
    );
  };

  const handleStepClick = async (step) => {
    console.log("🎯 Step clicked:", step);
    console.log("🎯 Step ID:", step.id);
    setSelectedStep(step);
    setShowStepDetailModal(true);
    setShowCreateAppointmentModal(false);
    setLoadingAppointments(true);
    try {
      const response = await treatmentService.getAppointmentsByStepId(step.id);

      // Lấy content array từ paginated response
      const appointments = response?.data?.result || [];

      setStepAppointments(appointments);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      console.error("❌ Error details:", error.response?.data);
      setStepAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleShowCreateAppointment = () => {
    console.log(
      "🔍 handleShowCreateAppointment called with selectedStep:",
      selectedStep
    );
    setShowStepDetailModal(false);
    setShowCreateAppointmentModal(true);
    scheduleForm.resetFields();
    // Đảm bảo form có treatmentStepId đúng
    scheduleForm.setFieldsValue({
      treatmentStepId: selectedStep?.id,
      shift: "MORNING",
    });
  };

  // Thêm hàm xử lý mở modal xem lịch hẹn
  const handleShowScheduleModal = async (step) => {
    setScheduleStep(step);
    setShowScheduleModal(true);
    setLoadingAppointments(true);
    try {
      const response = await treatmentService.getAppointmentsByStepId(step.id);
      const appointments = response?.data?.result || [];
      setStepAppointments(appointments);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      setStepAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Helper function to handle appointment status updates
  const handleAppointmentStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const res = await treatmentService.updateAppointmentStatus(
        appointmentId,
        newStatus
      );
      if (res?.data?.code === 1000) {
        showNotification("Cập nhật trạng thái thành công", "success");

        // Update local state immediately
        setStepAppointments((prev) =>
          Array.isArray(prev)
            ? prev.map((a) =>
                a.id === appointmentId
                  ? { ...a, status: newStatus, showStatusSelect: false }
                  : a
              )
            : []
        );

        // Không refresh data từ server nữa để tránh nhảy trang
      } else {
        showNotification(res?.data?.message || "Cập nhật thất bại", "error");
      }
    } catch (err) {
      console.error("Error updating appointment status:", err);
      showNotification(err.response.data.message, "error");
    }
  };
  // Hàm mở modal ghi chú
  const handleNoteSubmit = async () => {
    if (!note.trim()) {
      showNotification("Vui lòng nhập ghi chú!", "warning");
      return;
    }

    if (!pendingStatusUpdate) return;

    const { appointmentId, newStatus } = pendingStatusUpdate;

    try {
      const res = await treatmentService.updateAppointmentStatus(
        appointmentId,
        newStatus,
        note // truyền note
      );
      if (res?.data?.code === 1000) {
        showNotification("Cập nhật trạng thái thành công", "success");

        // Cập nhật local
        setStepAppointments((prev) =>
          Array.isArray(prev)
            ? prev.map((a) =>
                a.id === appointmentId
                  ? { ...a, status: newStatus, showStatusSelect: false }
                  : a
              )
            : []
        );
      } else {
        showNotification(res?.data?.message || "Cập nhật thất bại", "error");
      }
    } catch (err) {
      showNotification(err.response?.data?.message || "Lỗi cập nhật", "error");
    } finally {
      setShowNoteModal(false);
      setPendingStatusUpdate(null);
      setNote("");
    }
  };

  // Hàm mở modal và load danh sách dịch vụ
  const handleShowChangeService = async () => {
    setShowChangeServiceModal(true);
    try {
      const res = await treatmentService.getAllServicesForSelect();
      if (res?.data?.result) {
        setServiceOptions(res.data.result);
      } else {
        setServiceOptions([]);
      }
    } catch {
      setServiceOptions([]);
    }
  };

  // Hàm xác nhận đổi dịch vụ
  const handleChangeService = async () => {
    if (!selectedServiceId) return;
    try {
      await treatmentService.updateTreatmentRecordService(
        treatmentData.id,
        selectedServiceId
      );
      showNotification("Đã chọn dịch vụ thành công!", "success");
      setShowChangeServiceModal(false);
      setSelectedServiceId(null);
      // Reload treatment record
      const detail = await treatmentService.getTreatmentRecordById(
        treatmentData.id
      );
      setTreatmentData(detail?.data?.result);
    } catch {
      showNotification("Đổi dịch vụ thất bại!", "error");
    }
  };

  // Thêm hàm hủy dịch vụ tương tự như trong TestResults
  const handleCancelService = (treatment) => {
    setSelectedTreatment(treatment);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!cancelReason.trim()) {
      showNotification("Vui lòng nhập lý do huỷ!", "warning");
      return;
    }
    setCancelLoading(true);
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
      setCancelLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCancelReason("");
  };

  //2a hàm handleUpdateTreatmentStatus để nếu status === 'COMPLETED' thì show modal chọn kết quả
  const handleUpdateTreatmentStatus = async (status) => {
    if (status === "COMPLETED") {
      setShowResultModal(true);
      setPendingCompleteStatus(status);
      return;
    }
    try {
      const response = await treatmentService.updateTreatmentStatus(
        treatmentData.id,
        status
      );
      if (response?.data?.code === 1000 || response?.code === 1000) {
        showNotification("Cập nhật trạng thái dịch vụ thành công", "success");
        // Refresh data
        try {
          const detailedResponse =
            await treatmentService.getTreatmentRecordById(treatmentData.id);
          const detailedData = detailedResponse?.data?.result;
          if (detailedData) setTreatmentData(detailedData);
        } catch {}
      } else {
        showNotification(
          response?.data?.message || "Cập nhật trạng thái dịch vụ thất bại",
          "error"
        );
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Cập nhật trạng thái dịch vụ thất bại",
        "error"
      );
    }
  };

  // 3. Hàm xác nhận hoàn thành với kết quả
  const handleConfirmCompleteWithResult = async () => {
    if (!selectedResult) {
      showNotification("Vui lòng chọn kết quả cuối cùng!", "warning");
      return;
    }
    try {
      const response = await treatmentService.updateTreatmentStatus(
        treatmentData.id,
        "COMPLETED",
        selectedResult
      );
      if (response?.data?.code === 1000 || response?.code === 1000) {
        showNotification("Hoàn thành điều trị thành công", "success");
        setShowResultModal(false);
        setSelectedResult(null);
        setPendingCompleteStatus(null);
        // Refresh data
        try {
          const detailedResponse =
            await treatmentService.getTreatmentRecordById(treatmentData.id);
          const detailedData = detailedResponse?.data?.result;
          if (detailedData) setTreatmentData(detailedData);
        } catch {}
      } else {
        showNotification(
          response?.data?.message || "Cập nhật trạng thái dịch vụ thất bại",
          "error"
        );
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Cập nhật trạng thái dịch vụ thất bại",
        "error"
      );
    }
  };

  // Khi mở modal thêm step, load stage theo serviceId (API mới)
  useEffect(() => {
    if (showAddStepModal && treatmentData?.treatmentServiceId) {
      treatmentService
        .getSelectableStagesByServiceId(treatmentData.treatmentServiceId)
        .then((res) => {
          setStageOptions(res?.data?.result || []);
        })
        .catch(() => setStageOptions([]));
    }
    if (!showAddStepModal) {
      setAddStepAuto(false);
      setStageOptions([]);
      addStepForm.resetFields();
    }
  }, [showAddStepModal, treatmentData?.treatmentServiceId]);

  // Tự động cập nhật selectedStep khi treatmentData thay đổi
  useEffect(() => {
    if (selectedStep && treatmentData?.treatmentSteps) {
      const updatedStep = treatmentData.treatmentSteps.find(
        (step) => String(step.id) === String(selectedStep.id)
      );
      if (
        updatedStep &&
        JSON.stringify(updatedStep) !== JSON.stringify(selectedStep)
      ) {
        console.log("🔄 Updating selectedStep with new data:", updatedStep);
        setSelectedStep(updatedStep);
      }
    }
  }, [treatmentData, selectedStep]);

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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        padding: "32px 0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Header */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          background: "#fff",
          width: "100%",
          maxWidth: "1200px",
          minWidth: 320,
          padding: 0,
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ borderRadius: 8, height: 40 }}
              size="large"
            >
              Quay lại
            </Button>
          </Col>
        </Row>
      </Card>

      {treatmentData ? (
        <>
          {/* Timeline */}
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              background: "#fff",
              width: "100%",
              maxWidth: "1200px",
              minWidth: 320,
              marginBottom: "24px",
              padding: "24px 0 8px 0",
            }}
          >
            {/* Patient Info Section */}
            <div
              style={{
                padding: "0 24px 24px 24px",
                borderBottom: "1px solid #f0f0f0",
                marginBottom: 24,
              }}
            >
              <Title level={4} style={{ color: "#1890ff", marginBottom: 16 }}>
                Thông tin bệnh nhân
              </Title>
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Space>
                    <Text strong style={{ fontSize: 16 }}>
                      Tên bệnh nhân:
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {treatmentData.customerName}
                    </Text>
                  </Space>
                </Col>
                <Col xs={24} md={12}>
                  <Space>
                    <Text strong>Bác sĩ:</Text>
                    <Text>{treatmentData.doctorName}</Text>
                  </Space>
                </Col>
                <Col xs={24} md={12}>
                  <Space>
                    <Text strong>Dịch vụ:</Text>
                    <Text>{treatmentData.treatmentServiceName}</Text>
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
                <Col xs={24} md={24}>
                  <Space>
                    <Text strong>Ghi chú:</Text>
                    <Text>{treatmentData.notes || "Không có ghi chú"}</Text>
                  </Space>
                </Col>
              </Row>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                padding: "0 24px",
              }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowAddStepModal(true)}
                size="large"
                style={{ borderRadius: 8, minWidth: 180 }}
              >
                Thêm bước điều trị mới
              </Button>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "INPROGRESS",
                      label: "Đang điều trị",
                      onClick: () => handleUpdateTreatmentStatus("INPROGRESS"),
                    },
                    {
                      key: "COMPLETED",
                      label: "Hoàn thành",
                      onClick: () => handleUpdateTreatmentStatus("COMPLETED"),
                    },
                    {
                      key: "CANCELLED",
                      label: "Hủy",
                      onClick: () => handleCancelService(treatmentData),
                      danger: true,
                    },
                  ],
                }}
                placement="bottomLeft"
              >
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="large"
                  style={{ borderRadius: 8, minWidth: 180 }}
                >
                  Cập nhật trạng thái dịch vụ
                </Button>
              </Dropdown>
            </div>

            {/* Treatment Steps Timeline */}
            {treatmentData.treatmentSteps &&
            treatmentData.treatmentSteps.length > 0 ? (
              <Card
                title={
                  <span
                    style={{ fontWeight: 700, fontSize: 20, color: "#1890ff" }}
                  >
                    Các bước điều trị
                  </span>
                }
                style={{
                  marginBottom: 32,
                  borderRadius: 18,
                  boxShadow: "0 4px 16px rgba(24,144,255,0.08)",
                  background: "#fff",
                }}
                bodyStyle={{ padding: 32 }}
              >
                <Timeline style={{ marginLeft: 16 }}>
                  {treatmentData.treatmentSteps.map((step, index) => (
                    <Timeline.Item
                      key={step.id}
                      color={getStatusColor(step.status)}
                      dot={
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background:
                              getStatusColor(step.status) === "success"
                                ? "#e6fffb"
                                : getStatusColor(step.status) === "error"
                                ? "#fff1f0"
                                : getStatusColor(step.status) === "processing"
                                ? "#e6f7ff"
                                : getStatusColor(step.status) === "orange"
                                ? "#fff7e6"
                                : "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `3px solid ${
                              getStatusColor(step.status) === "success"
                                ? "#52c41a"
                                : getStatusColor(step.status) === "error"
                                ? "#ff4d4f"
                                : getStatusColor(step.status) === "processing"
                                ? "#1890ff"
                                : getStatusColor(step.status) === "orange"
                                ? "#fa8c16"
                                : "#d9d9d9"
                            }`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 22,
                              color:
                                getStatusColor(step.status) === "success"
                                  ? "#52c41a"
                                  : getStatusColor(step.status) === "error"
                                  ? "#ff4d4f"
                                  : getStatusColor(step.status) === "processing"
                                  ? "#1890ff"
                                  : getStatusColor(step.status) === "orange"
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
                            getStatusColor(step.status) === "success"
                              ? "#52c41a"
                              : getStatusColor(step.status) === "error"
                              ? "#ff4d4f"
                              : getStatusColor(step.status) === "processing"
                              ? "#1890ff"
                              : getStatusColor(step.status) === "orange"
                              ? "#fa8c16"
                              : "#d9d9d9"
                          }`,
                        }}
                        bodyStyle={{ padding: 24 }}
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
                              <Text
                                strong
                                style={{ fontSize: 18, color: "#1890ff" }}
                              >
                                Bước {index + 1}:{" "}
                                {step.stageName || step.name || ""}
                              </Text>
                              <Tag
                                color={getStatusColor(step.status)}
                                style={{ fontSize: 15, padding: "4px 16px" }}
                              >
                                {getStatusText(step.status)}
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
                              <Button
                                type="default"
                                icon={<EditOutlined />}
                                style={{
                                  borderRadius: 8,
                                  fontWeight: 600,
                                  minWidth: 140,
                                }}
                                onClick={() => showEditModal(step)}
                              >
                                Cập nhật
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            ) : (
              <Card
                title="Các bước điều trị"
                style={{
                  marginBottom: 24,
                  borderRadius: 18,
                  boxShadow: "0 4px 16px rgba(24,144,255,0.08)",
                  background: "#fff",
                }}
              >
                <Text type="secondary">Chưa có bước điều trị nào được tạo</Text>
              </Card>
            )}
          </Card>
          {/* Complete Treatment Button - ĐÃ XÓA */}
        </>
      ) : (
        <Card
          style={{
            borderRadius: 14,
            textAlign: "center",
            background: "#fff",
            width: 800,
            maxWidth: "98vw",
            minWidth: 320,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Title level={4}>Không tìm thấy thông tin điều trị</Title>
          <Text>
            Vui lòng kiểm tra lại thông tin bệnh nhân hoặc thử lại sau.
          </Text>
        </Card>
      )}

      {/* Step Detail Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <ExperimentOutlined
              style={{ fontSize: 24, color: "#1890ff", marginRight: 8 }}
            />
            Chi Tiết Bước Điều Trị
          </div>
        }
        open={showStepDetailModal}
        onCancel={() => {
          setShowStepDetailModal(false);
          setSelectedStep(null);
        }}
        footer={null}
        width={600}
        centered
      >
        {selectedStep && (
          <div style={{ padding: "32px 0" }}>
            <Card
              style={{
                marginBottom: 0,
                borderRadius: 16,
                width: "100%",
                padding: 32,
              }}
            >
              <Title level={4} style={{ color: "#1890ff", marginBottom: 16 }}>
                {selectedStep.name}
              </Title>
              <Row gutter={24}>
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Trạng thái:</Text>
                    <br />
                    <Tag
                      color={getStatusColor(selectedStep.status)}
                      style={{ marginTop: 4 }}
                    >
                      {getStatusText(selectedStep.status)}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Ghi chú:</Text>
                    <br />
                    <Text style={{ marginTop: 4 }}>
                      {selectedStep.notes || "Không có ghi chú"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Ngày bắt đầu:</Text>
                    <br />
                    <Text style={{ marginTop: 4 }}>
                      {selectedStep.startDate
                        ? dayjs(selectedStep.startDate).format("DD/MM/YYYY")
                        : "Chưa có"}
                    </Text>
                  </div>
                  <div>
                    <Text strong>Ngày kết thúc:</Text>
                    <br />
                    <Text style={{ marginTop: 4 }}>
                      {selectedStep.endDate
                        ? dayjs(selectedStep.endDate).format("DD/MM/YYYY")
                        : "Chưa có"}
                    </Text>
                  </div>
                </Col>
              </Row>
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setShowStepDetailModal(false);
                    showEditModal(selectedStep);
                  }}
                  size="large"
                  style={{ borderRadius: 8, minWidth: 120, marginRight: 16 }}
                >
                  Cập nhật
                </Button>
                <Button
                  type="default"
                  icon={<FileTextOutlined />}
                  onClick={() => {
                    setShowStepDetailModal(false);
                    handleShowScheduleModal(selectedStep);
                  }}
                  size="large"
                  style={{ borderRadius: 8, minWidth: 120, marginRight: 16 }}
                >
                  Xem lịch hẹn
                </Button>
                <Button
                  type="default"
                  icon={<CalendarOutlined />}
                  onClick={() => {
                    setShowStepDetailModal(false);
                    setSelectedStep(selectedStep);
                    handleShowCreateAppointment();
                  }}
                  size="large"
                  style={{ borderRadius: 8, minWidth: 120 }}
                >
                  Tạo lịch hẹn
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Update Step Modal */}
      <Modal
        title="Cập nhật thông tin điều trị"
        open={!!editingStep}
        onCancel={() => {
          setEditingStep(null);
          form.resetFields();
          setEditingStepStageId(null);
        }}
        footer={null}
        width={500}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateStep}>
          <Form.Item name="startDate" label="Ngày bắt đầu">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="endDate" label="Ngày kết thúc">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Select.Option value="INPROGRESS">Đang điều trị</Select.Option>
              <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  background:
                    editingStep?.status === "INPROGRESS"
                      ? "#fa8c16"
                      : "#1890ff",
                  borderColor:
                    editingStep?.status === "INPROGRESS"
                      ? "#fa8c16"
                      : "#1890ff",
                  color: "#fff",
                }}
              >
                Cập nhật
              </Button>
              <Button
                onClick={() => {
                  setEditingStep(null);
                  form.resetFields();
                  setEditingStepStageId(null);
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
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
          {loadingAppointments ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <Spin size="large" />
            </div>
          ) : stepAppointments.length === 0 ? (
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
                {Array.isArray(stepAppointments) &&
                  stepAppointments.slice(0, 3).map((app, idx) => {
                    const statusColor = getAppointmentStatusColor(app.status);
                    const statusIcon = (() => {
                      switch (app.status) {
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
                        key={app.id}
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
                        bodyStyle={{ padding: 16 }}
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
                            {dayjs(app.appointmentDate).format("DD/MM/YYYY")}
                          </Text>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Ca khám:</Text>
                          <br />
                          <Tag color="cyan">
                            {app.shift === "MORNING"
                              ? "Sáng"
                              : app.shift === "AFTERNOON"
                              ? "Chiều"
                              : app.shift}
                          </Tag>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Trạng thái:</Text>
                          <br />
                          <Tag color={statusColor}>
                            {getAppointmentStatusText(app.status)}
                          </Tag>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Ghi chú:</Text>
                          <br />
                          <Text
                            style={{
                              maxWidth: "100%",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              display: "inline-block",
                              verticalAlign: "top",
                            }}
                            title={app.notes} // tooltip đầy đủ khi hover
                          >
                            {app.notes || "Không có ghi chú"}
                          </Text>
                        </div>
                        {app.purpose && (
                          <div style={{ marginTop: 8 }}>
                            <Text strong>Mục đích:</Text>
                            <br />
                            <Text>{app.purpose}</Text>
                          </div>
                        )}
                        {/* Thêm nút cập nhật trạng thái cho bác sĩ */}
                        <div style={{ marginTop: 12, textAlign: "center" }}>
                          <Button
                            type="primary"
                            size="small"
                            style={{
                              background: "#fa8c16",
                              borderColor: "#fa8c16",
                              color: "#fff",
                              borderRadius: 6,
                              fontSize: 12,
                              height: 28,
                            }}
                            onClick={() =>
                              setStepAppointments((prev) =>
                                Array.isArray(prev)
                                  ? prev.map((a, i) =>
                                      i === idx
                                        ? {
                                            ...a,
                                            showStatusSelect:
                                              !a.showStatusSelect,
                                          }
                                        : a
                                    )
                                  : []
                              )
                            }
                          >
                            Cập nhật trạng thái
                          </Button>
                          {app.showStatusSelect && (
                            <div style={{ marginTop: 8 }}>
                              <Radio.Group
                                style={{ width: "100%" }}
                                value={app.status || undefined}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  if (
                                    ["COMPLETED", "CANCELLED"].includes(
                                      newStatus
                                    )
                                  ) {
                                    setPendingStatusUpdate({
                                      appointmentId: app.id,
                                      newStatus,
                                    });
                                    setNote(""); // clear note cũ
                                    setShowNoteModal(true); // mở modal nhập note
                                  }
                                }}
                                buttonStyle="solid"
                                size="small"
                              >
                                {statusOptions
                                  .filter((opt) =>
                                    ["COMPLETED", "CANCELLED"].includes(
                                      opt.value
                                    )
                                  )
                                  .map((opt) => (
                                    <Radio.Button
                                      key={opt.value}
                                      value={opt.value}
                                      style={{
                                        margin: 2,
                                        width: "100%",
                                        fontSize: 11,
                                        height: 24,
                                      }}
                                    >
                                      {opt.label}
                                    </Radio.Button>
                                  ))}
                              </Radio.Group>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
              </div>

              {/* Hiển thị thêm các lịch hẹn còn lại khi đã click "Xem thêm" */}
              {Array.isArray(stepAppointments) &&
                stepAppointments.some((app) => app.showAll) && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 16,
                      justifyContent: "center",
                      marginTop: 16,
                    }}
                  >
                    {stepAppointments.slice(3).map((app, idx) => {
                      const statusColor = getAppointmentStatusColor(app.status);
                      const statusIcon = (() => {
                        switch (app.status) {
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
                          key={app.id}
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
                          bodyStyle={{ padding: 16 }}
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
                              {dayjs(app.appointmentDate).format("DD/MM/YYYY")}
                            </Text>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>Ca khám:</Text>
                            <br />
                            <Tag color="cyan">
                              {app.shift === "MORNING"
                                ? "Sáng"
                                : app.shift === "AFTERNOON"
                                ? "Chiều"
                                : app.shift}
                            </Tag>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>Trạng thái:</Text>
                            <br />
                            <Tag color={statusColor}>
                              {getAppointmentStatusText(app.status)}
                            </Tag>
                          </div>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>Ghi chú:</Text>
                            <br />
                            <Text
                              style={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                display: "inline-block",
                                verticalAlign: "top",
                              }}
                              title={app.notes} // tooltip đầy đủ khi hover
                            >
                              {app.notes || "Không có ghi chú"}
                            </Text>
                          </div>
                          {app.purpose && (
                            <div style={{ marginTop: 8 }}>
                              <Text strong>Mục đích:</Text>
                              <br />
                              <Text>{app.purpose}</Text>
                            </div>
                          )}
                          {/* Thêm nút cập nhật trạng thái cho bác sĩ */}
                          <div style={{ marginTop: 12, textAlign: "center" }}>
                            <Button
                              type="primary"
                              size="small"
                              style={{
                                background: "#fa8c16",
                                borderColor: "#fa8c16",
                                color: "#fff",
                                borderRadius: 6,
                                fontSize: 12,
                                height: 28,
                              }}
                              onClick={() =>
                                setStepAppointments((prev) =>
                                  Array.isArray(prev)
                                    ? prev.map((a, i) =>
                                        i === idx + 3
                                          ? {
                                              ...a,
                                              showStatusSelect:
                                                !a.showStatusSelect,
                                            }
                                          : a
                                      )
                                    : []
                                )
                              }
                            >
                              Cập nhật trạng thái
                            </Button>
                            {app.showStatusSelect && (
                              <div style={{ marginTop: 8 }}>
                                <Radio.Group
                                  style={{ width: "100%" }}
                                  value={app.status || undefined}
                                  onChange={(e) => {
                                    const newStatus = e.target.value;
                                    if (
                                      ["COMPLETED", "CANCELLED"].includes(
                                        newStatus
                                      )
                                    ) {
                                      setPendingStatusUpdate({
                                        appointmentId: app.id,
                                        newStatus,
                                      });
                                      setNote(""); // clear note cũ
                                      setShowNoteModal(true); // mở modal nhập note
                                    }
                                  }}
                                  buttonStyle="solid"
                                  size="small"
                                >
                                  {statusOptions
                                    .filter((opt) =>
                                      ["COMPLETED", "CANCELLED"].includes(
                                        opt.value
                                      )
                                    )
                                    .map((opt) => (
                                      <Radio.Button
                                        key={opt.value}
                                        value={opt.value}
                                        style={{
                                          margin: 2,
                                          width: "100%",
                                          fontSize: 11,
                                          height: 24,
                                        }}
                                      >
                                        {opt.label}
                                      </Radio.Button>
                                    ))}
                                </Radio.Group>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}

              {/* Nút "Xem thêm" hoặc "Ẩn bớt" ở cuối */}
              {stepAppointments.length > 3 && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  {stepAppointments.some((app) => app.showAll) ? (
                    <Button
                      type="default"
                      icon={<FileTextOutlined />}
                      onClick={() => {
                        // Ẩn bớt - chỉ hiển thị 3 lịch hẹn đầu
                        setStepAppointments((prev) => {
                          if (Array.isArray(prev)) {
                            return prev.map((app) => ({
                              ...app,
                              showAll: false,
                            }));
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
                        // Hiển thị tất cả lịch hẹn
                        setStepAppointments((prev) => {
                          if (Array.isArray(prev)) {
                            return prev.map((app) => ({
                              ...app,
                              showAll: true,
                            }));
                          }
                          return prev;
                        });
                      }}
                      style={{ borderRadius: 8, minWidth: 140 }}
                    >
                      Xem thêm ({stepAppointments.length - 3})
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setShowScheduleModal(false);
                setSelectedStep(scheduleStep);
                handleShowCreateAppointment();
              }}
              size="large"
              style={{ borderRadius: 8, minWidth: 140 }}
            >
              Tạo lịch hẹn mới
            </Button>
          </div>
        </div>
      </Modal>
      {/* Note Modal */}
      <Modal
        title="Nhập ghi chú"
        open={showNoteModal}
        onOk={handleNoteSubmit}
        onCancel={() => {
          setShowNoteModal(false);
          setPendingStatusUpdate(null);
          setNote("");
        }}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Input.TextArea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú cho trạng thái này..."
        />
      </Modal>

      {/* Create Appointment Modal */}
      {showCreateAppointmentModal && (
        <Modal
          title="Tạo lịch hẹn mới"
          open={showCreateAppointmentModal}
          onCancel={() => setShowCreateAppointmentModal(false)}
          footer={null}
          width={700}
          centered
        >
          <Form
            form={scheduleForm}
            layout="vertical"
            onFinish={handleScheduleAppointment}
            initialValues={{
              shift: "MORNING",
              treatmentStepId: selectedStep?.id,
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Bước điều trị" required>
                  <Input value={selectedStep?.name} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="appointmentDate"
                  label="Ngày hẹn"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày hẹn" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="shift"
                  label="Ca khám"
                  rules={[{ required: true, message: "Vui lòng chọn ca khám" }]}
                >
                  <Select>
                    <Select.Option value="MORNING">Sáng</Select.Option>
                    <Select.Option value="AFTERNOON">Chiều</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="purpose"
              label="Mục đích"
              rules={[{ required: true, message: "Vui lòng nhập mục đích" }]}
            >
              <Input placeholder="Nhập mục đích của lịch hẹn" />
            </Form.Item>
            <Form.Item name="notes" label="Ghi chú">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="treatmentStepId"
              initialValue={selectedStep?.id}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                Tạo lịch hẹn
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Modal Thêm Step */}
      <Modal
        title="Thêm bước điều trị mới"
        open={showAddStepModal}
        onCancel={() => setShowAddStepModal(false)}
        footer={null}
        width={400}
        centered
      >
        <Form
          form={addStepForm}
          layout="vertical"
          onFinish={async (values) => {
            setAddStepLoading(true);
            try {
              const data = {
                treatmentRecordId: treatmentData.id,
                stageId: values.stageId,
                startDate: values.startDate
                  ? values.startDate.format("YYYY-MM-DD")
                  : undefined,
                status: "CONFIRMED",
                notes: values.notes,
                auto: addStepAuto,
              };
              if (addStepAuto) {
                data.purpose = values.purpose;
                data.shift = values.shift;
              }

              console.log("🔍 Creating treatment step with data:", data);
              const response = await treatmentService.createTreatmentStep(data);
              console.log("🔍 Create treatment step response:", response);

              if (response?.data?.code === 1000 || response?.code === 1000) {
                showNotification("Đã thêm bước điều trị mới!", "success");
                setShowAddStepModal(false);
                addStepForm.resetFields();

                // Reload treatment record
                try {
                  console.log(
                    "🔄 Reloading treatment record after creating step..."
                  );
                  const detail = await treatmentService.getTreatmentRecordById(
                    treatmentData.id
                  );
                  const detailData = detail?.data?.result;
                  console.log("🔍 Reloaded treatment data:", detailData);

                  if (detailData) {
                    setTreatmentData(detailData);
                    console.log("✅ Treatment data updated successfully");
                  } else {
                    console.warn("⚠️ No treatment data returned from reload");
                  }
                } catch (reloadError) {
                  console.error(
                    "❌ Error reloading treatment data:",
                    reloadError
                  );
                  showNotification(
                    "Đã thêm bước nhưng không thể cập nhật giao diện",
                    "warning"
                  );
                }
              }
            } catch (err) {
              console.error("❌ Error creating treatment step:", err);
              showNotification(err.response.data.message, "error");
            } finally {
              setAddStepLoading(false);
            }
          }}
        >
          <Form.Item
            name="stageId"
            label="Tên bước điều trị"
            rules={[{ required: true, message: "Chọn bước điều trị" }]}
          >
            <Select placeholder="Chọn bước điều trị">
              {stageOptions.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: "Chọn ngày dự kiến" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Tạo lịch hẹn:">
            <Switch checked={addStepAuto} onChange={setAddStepAuto} />
          </Form.Item>
          {addStepAuto && (
            <>
              <Form.Item
                name="purpose"
                label="Mục đích"
                rules={[{ required: true, message: "Nhập mục đích" }]}
              >
                <Input placeholder="Nhập mục đích" />
              </Form.Item>
              <Form.Item
                name="shift"
                label="Ca khám"
                rules={[{ required: true, message: "Chọn ca khám" }]}
              >
                <Select placeholder="Chọn ca khám">
                  <Select.Option value="MORNING">Sáng</Select.Option>
                  <Select.Option value="AFTERNOON">Chiều</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú (nếu có)" />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={addStepLoading}>
              Thêm bước
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chọn dịch vụ phù hợp */}
      <Modal
        title="Chọn dịch vụ phù hợp"
        open={showChangeServiceModal}
        onCancel={() => {
          setShowChangeServiceModal(false);
          setSelectedServiceId(null);
        }}
        onOk={handleChangeService}
        okText="Xác nhận"
        cancelText="Hủy"
        width={400}
        centered
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn dịch vụ..."
          value={selectedServiceId}
          onChange={setSelectedServiceId}
          options={serviceOptions.map((s) => ({
            value: s.id,
            label: `${s.name} - ${s.price?.toLocaleString()}đ`,
          }))}
        />
      </Modal>

      {/* Modal chọn kết quả điều trị cuối cùng */}
      <Modal
        title="Chọn kết quả:"
        open={showResultModal}
        onCancel={() => {
          setShowResultModal(false);
          setSelectedResult(null);
          setPendingCompleteStatus(null);
        }}
        onOk={handleConfirmCompleteWithResult}
        okText="Xác nhận"
        cancelText="Hủy"
        destroyOnClose
      >
        <Radio.Group
          value={selectedResult}
          onChange={(e) => setSelectedResult(e.target.value)}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <Radio value="SUCCESS">Thành công </Radio>
          <Radio value="FAILURE">Thất bại</Radio>
        </Radio.Group>
      </Modal>

      {/* Modal hủy hồ sơ */}
      <Modal
        title="Bạn có chắc chắn muốn hủy hồ sơ/dịch vụ này?"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={cancelLoading}
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

export default TreatmentStageDetails;
