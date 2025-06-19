import React, { useState, useEffect } from 'react';
import { 
  Card, Steps, Row, Col, Typography, Descriptions, Tag, 
  Timeline, Space, Divider, Progress, Collapse, Spin, message, Button, Modal,
  Form, Select, DatePicker, Input, Alert
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined as ClockIcon,
  CheckCircleOutlined as CheckIcon,
  InfoCircleOutlined,
  AppstoreOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined as TestTubeIcon,
  ArrowLeftOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { treatmentService } from '../../service/treatment.service';
import { authService } from '../../service/auth.service';
import { useNavigate, useLocation } from 'react-router-dom';
import { path } from '../../common/path';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra xem có dữ liệu từ MyServices không
      const treatmentRecord = location.state?.treatmentRecord;
      const treatmentId = location.state?.treatmentId;
      
      if (treatmentRecord && treatmentId) {
        // Sử dụng dữ liệu từ MyServices
        const appointmentsResponse = await treatmentService.getCustomerAppointments(treatmentRecord.customerId);
        const appointments = appointmentsResponse?.data?.result || [];
        
        const totalSteps = treatmentRecord.treatmentSteps.length;
        const completedSteps = treatmentRecord.treatmentSteps.filter(step => step.status === 'COMPLETED').length;
        const overallProgress = Math.round((completedSteps / totalSteps) * 100);

        setTreatmentData({
          id: treatmentRecord.id,
          type: treatmentRecord.treatmentServiceName,
          startDate: treatmentRecord.startDate,
          currentPhase: treatmentRecord.treatmentSteps.findIndex(step => step.status === 'COMPLETED') + 1,
          doctor: treatmentRecord.doctorName,
          status: treatmentRecord.status.toLowerCase(),
          estimatedCompletion: treatmentRecord.endDate || dayjs(treatmentRecord.startDate).add(45, 'days').format('YYYY-MM-DD'),
          nextAppointment: null,
          overallProgress: overallProgress,
          customerId: treatmentRecord.customerId,
          phases: treatmentRecord.treatmentSteps.map((step, index) => {
            // Tìm lịch hẹn thực tế cho step này dựa vào purpose
            const appointment = appointments.find(app => app.purpose === step.name);
            return {
              id: step.id,
              name: step.name,
              statusRaw: step.status,
              status: step.status,
              displayDate: appointment?.appointmentDate || step.scheduledDate || null,
              hasDate: !!(appointment?.appointmentDate || step.scheduledDate),
              startDate: appointment?.appointmentDate || step.scheduledDate,
              endDate: step.actualDate,
              notes: step.notes,
              appointment: appointment,
              activities: [
                {
                  name: step.name,
                  date: appointment?.appointmentDate || step.scheduledDate,
                  status: step.status,
                  notes: step.notes || 'Đang chờ thực hiện'
                }
              ]
            };
          })
        });
      } else {
        // Fallback: Lấy dữ liệu như cũ
        const userResponse = await authService.getMyInfo();
        console.log('User Info Response:', userResponse);
        
        if (!userResponse?.data?.result?.id) {
          message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          return;
        }

        const customerId = userResponse.data.result.id;
        const appointmentsResponse = await treatmentService.getCustomerAppointments(customerId);
        const appointments = appointmentsResponse?.data?.result || [];
        const response = await treatmentService.getTreatmentRecordsByCustomer(customerId);
        console.log('Treatment Records Response:', response);
        
        if (response?.data?.code === 1000 && Array.isArray(response.data.result) && response.data.result.length > 0) {
          const activeTreatments = response.data.result
            .filter(treatment => treatment.status !== 'CANCELLED')
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

          if (activeTreatments.length === 0) {
            setError('Không tìm thấy thông tin điều trị đang hoạt động');
            return;
          }

          const currentTreatment = activeTreatments[0];
          const totalSteps = currentTreatment.treatmentSteps.length;
          const completedSteps = currentTreatment.treatmentSteps.filter(step => step.status === 'COMPLETED').length;
          const overallProgress = Math.round((completedSteps / totalSteps) * 100);

          setTreatmentData({
            id: currentTreatment.id,
            type: currentTreatment.treatmentServiceName,
            startDate: currentTreatment.startDate,
            currentPhase: currentTreatment.treatmentSteps.findIndex(step => step.status === 'COMPLETED') + 1,
            doctor: currentTreatment.doctorName,
            status: currentTreatment.status.toLowerCase(),
            estimatedCompletion: currentTreatment.endDate || dayjs(currentTreatment.startDate).add(45, 'days').format('YYYY-MM-DD'),
            nextAppointment: null,
            overallProgress: overallProgress,
            customerId: currentTreatment.customerId,
            phases: currentTreatment.treatmentSteps.map((step, index) => {
              const appointment = appointments.find(app => app.purpose === step.name);
              return {
                id: step.id,
                name: step.name,
                statusRaw: step.status,
                status: step.status,
                displayDate: appointment?.appointmentDate || step.scheduledDate || null,
                hasDate: !!(appointment?.appointmentDate || step.scheduledDate),
                startDate: appointment?.appointmentDate || step.scheduledDate,
                endDate: step.actualDate,
                notes: step.notes,
                appointment: appointment,
                activities: [
                  {
                    name: step.name,
                    date: appointment?.appointmentDate || step.scheduledDate,
                    status: step.status,
                    notes: step.notes || 'Đang chờ thực hiện'
                  }
                ]
              };
            })
          });
        } else {
          setError('Không tìm thấy thông tin điều trị');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to open change modal for a step
  const handleOpenChangeModal = async (step) => {
    if (!treatmentData?.customerId) return;
    setChangeStep(step);
    setChangeAppointment(null);
    setChangeModalVisible(true);
    setChangeLoading(true);
    try {
      const res = await treatmentService.getCustomerAppointments(treatmentData.customerId);
      if (res?.data?.result) {
        // Lọc tất cả appointment đúng với step (purpose) và status hợp lệ
        const foundAppointments = res.data.result.filter(
          (app) =>
            app.purpose === step.name &&
            (app.status === "CONFIRMED" || app.status === "PENDING_CHANGE")
        );
        // Log ra toàn bộ danh sách appointment và id sẽ dùng
        console.log("Tất cả appointment:", res.data.result);
        console.log("Các lịch hẹn hợp lệ cho bước này:", foundAppointments);
        console.log("Step name:", step.name);
        console.log("Step ID:", step.id);

        if (foundAppointments.length === 0) {
          setChangeAppointment(null);
          console.log("Không tìm thấy appointment hợp lệ cho step:", step.name);
        } else if (foundAppointments.length === 1) {
          setChangeAppointment(foundAppointments[0]);
          console.log("Sử dụng appointment:", foundAppointments[0]);
          console.log("Appointment ID (type):", typeof foundAppointments[0].id, foundAppointments[0].id);
          // Chỉ set form values khi modal đã visible
          setTimeout(() => {
            changeForm.setFieldsValue({
              requestedDate: foundAppointments[0].appointmentDate
                ? dayjs(foundAppointments[0].appointmentDate)
                : null,
              requestedShift: foundAppointments[0].shift || undefined,
              notes: foundAppointments[0].notes || "",
            });
          }, 100);
          // Log id sẽ gửi lên API
          console.log("Sẽ gửi đổi lịch cho appointment id:", foundAppointments[0].id);
        } else {
          setChangeAppointment(foundAppointments[0]);
          console.log("Có nhiều appointment, sử dụng appointment đầu tiên:", foundAppointments[0]);
          // Chỉ set form values khi modal đã visible
          setTimeout(() => {
            changeForm.setFieldsValue({
              requestedDate: foundAppointments[0].appointmentDate
                ? dayjs(foundAppointments[0].appointmentDate)
                : null,
              requestedShift: foundAppointments[0].shift || undefined,
              notes: foundAppointments[0].notes || "",
            });
          }, 100);
          alert("Có nhiều lịch hẹn hợp lệ cho bước này, kiểm tra console để chọn đúng lịch!");
          // Log tất cả id để bạn kiểm tra
          foundAppointments.forEach(app => console.log("Có thể chọn id:", app.id, app));
        }
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setChangeAppointment(null);
    } finally {
      setChangeLoading(false);
    }
  };

  // Function to handle submit change request
  const handleSubmitChange = async () => {
    if (!changeAppointment) {
      message.error("Không tìm thấy lịch hẹn để thay đổi");
      return;
    }
    
    try {
      setChangeLoading(true);
      const values = await changeForm.validateFields();
      
      console.log("=== CHANGE REQUEST DEBUG ===");
      console.log("Selected appointment:", changeAppointment);
      console.log("Appointment ID:", changeAppointment.id, "Type:", typeof changeAppointment.id);
      console.log("Appointment status:", changeAppointment.status);
      console.log("Appointment customer:", changeAppointment.customerName);
      console.log("Form values:", values);
      console.log("Sending change request for appointment ID:", changeAppointment.id);
      console.log("Request data:", {
        requestedDate: values.requestedDate.format("YYYY-MM-DD"),
        requestedShift: values.requestedShift,
        notes: values.notes || "",
      });
      
      const response = await treatmentService.requestChangeAppointment(changeAppointment.id, {
        requestedDate: values.requestedDate.format("YYYY-MM-DD"),
        requestedShift: values.requestedShift,
        notes: values.notes || "",
      });

      console.log("Change request response:", response);

      if (response?.data?.code === 1000 || response?.status === 200) {
        message.success("Đã gửi yêu cầu thay đổi lịch hẹn!");
        setChangeModalVisible(false);
        // Refresh data
        fetchData();
      } else {
        message.error(response?.data?.message || response?.message || "Không thể gửi yêu cầu.");
      }
    } catch (err) {
      console.error('Error submitting change request:', err);
      console.error('Error details:', {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message
      });
      
      if (err?.response?.status === 404) {
        message.error("Không tìm thấy lịch hẹn với ID: " + changeAppointment.id);
      } else if (err?.response?.status === 400) {
        message.error("Dữ liệu không hợp lệ: " + (err?.response?.data?.message || err?.message));
      } else {
        message.error(err?.response?.data?.message || err?.message || "Không thể gửi yêu cầu.");
      }
    } finally {
      setChangeLoading(false);
    }
  };

  // Get status tag with color - giống như MyServices
  const getStatusTag = (status) => {
    switch (status) {
      case "COMPLETED":
      case "completed":
        return <Tag color="success">Hoàn thành</Tag>;
      case "INPROGRESS":
      case "IN_PROGRESS":
      case "in-progress":
      case "inprogress":
        return <Tag color="#1890ff">Đang điều trị</Tag>;
      case "PENDING":
      case "PLANNED":
      case "upcoming":
      case "pending":
        return <Tag color="warning">Đang chờ điều trị</Tag>;
      case "CANCELLED":
      case "cancelled":
        return <Tag color="error">Đã hủy</Tag>;
      case "CONFIRMED":
      case "confirmed":
        return <Tag color="#1890ff">Đã xác nhận</Tag>;
      case "PENDING_CHANGE":
        return <Tag color="orange">Chờ duyệt đổi lịch</Tag>;
      case "REJECTED_CHANGE":
        return <Tag color="red">Từ chối đổi lịch</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // Hàm getStepStatusTag: mapping trạng thái tiếng Việt + màu - giống như MyServices
  const getStepStatusTag = (status) => {
    switch (status) {
      case "COMPLETED":
        return <Tag color="success">Hoàn thành</Tag>;
      case "INPROGRESS":
      case "IN_PROGRESS":
      case "CONFIRMED":
        return <Tag color="#1890ff">Đang điều trị</Tag>;
      case "PENDING":
      case "PLANNED":
        return <Tag color="warning">Đang chờ điều trị</Tag>;
      case "CANCELLED":
        return <Tag color="error">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // Hàm lấy giai đoạn hiện tại - giống như MyServices
  const getCurrentPhase = () => {
    if (!treatmentData?.phases) return null;
    
    // Tìm phase đầu tiên chưa hoàn thành
    const currentPhase = treatmentData.phases.find(phase => phase.statusRaw !== 'COMPLETED');
    
    if (currentPhase) {
      return {
        name: currentPhase.name,
        status: currentPhase.statusRaw,
        notes: currentPhase.notes || 'Đang chờ thực hiện'
      };
    }
    
    // Nếu tất cả đã hoàn thành, trả về phase cuối cùng
    const lastPhase = treatmentData.phases[treatmentData.phases.length - 1];
    return {
      name: lastPhase.name,
      status: lastPhase.statusRaw,
      notes: 'Đã hoàn thành'
    };
  };

  const renderPhases = () => {
    return treatmentData && treatmentData.phases && treatmentData.phases.map((phase, idx) => ({
      key: phase.id,
      label: (
        <Space>
          <Text strong>{phase.name}</Text>
          {getStepStatusTag(phase.statusRaw)}
        </Space>
      ),
      children: (
        <div>
          <Descriptions column={2} size="small" bordered>
            <Descriptions.Item label="Trạng thái">
              {getStepStatusTag(phase.statusRaw)}
            </Descriptions.Item>
            {(idx === 0 || phase.hasDate) && (
              <Descriptions.Item label="Ngày khám">
                {phase.displayDate ? dayjs(phase.displayDate).format("DD/MM/YYYY") : '-'}
              </Descriptions.Item>
            )}
          </Descriptions>
          
          {/* Nút gửi yêu cầu thay đổi lịch hẹn */}
          {phase.appointment && 
           phase.statusRaw !== 'COMPLETED' && 
           phase.appointment.status !== 'PENDING_CHANGE' && 
           phase.appointment.status !== 'REJECTED_CHANGE' && (
            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleOpenChangeModal(phase)}
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                }}
              >
                Gửi yêu cầu thay đổi lịch hẹn
              </Button>
            </div>
          )}

          {/* Hiển thị trạng thái yêu cầu thay đổi nếu có */}
          {phase.appointment && phase.appointment.status === 'PENDING_CHANGE' && (
            <div style={{ marginTop: 16 }}>
              <Alert
                type="warning"
                message="Đã gửi yêu cầu thay đổi lịch hẹn"
                description={`Ngày mới: ${phase.appointment.requestedDate ? dayjs(phase.appointment.requestedDate).format('DD/MM/YYYY') : ''} - Ca: ${phase.appointment.requestedShift === 'MORNING' ? 'Sáng' : 'Chiều'}`}
                showIcon
              />
            </div>
          )}

          {phase.appointment && phase.appointment.status === 'REJECTED_CHANGE' && (
            <div style={{ marginTop: 16 }}>
              <Alert
                type="error"
                message="Yêu cầu thay đổi lịch hẹn đã bị từ chối"
                description={phase.appointment.notes || 'Không có ghi chú'}
                showIcon
              />
            </div>
          )}

          {phase.activities.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text strong>Các hoạt động:</Text>
              <Timeline 
                style={{ marginTop: 16 }}
                items={phase.activities.map((activity, index) => ({
                  key: index,
                  color: activity.status === 'COMPLETED' ? 'green' : 
                         activity.status === 'IN_PROGRESS' || activity.status === 'INPROGRESS' || activity.status === 'CONFIRMED' ? 'blue' : 
                         activity.status === 'PLANNED' || activity.status === 'PENDING' ? 'orange' : 'gray',
                  children: (
                    <div>
                      <Space>
                        <Text strong>{activity.name}</Text>
                        {getStatusTag(activity.status)}
                      </Space>
                      <div>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        <Text>{activity.date ? dayjs(activity.date).format("DD/MM/YYYY") : 'Chưa lên lịch'}</Text>
                      </div>
                      {activity.notes && (
                        <div style={{ color: '#666', marginTop: 4 }}>
                          {activity.notes}
                        </div>
                      )}
                    </div>
                  )
                }))}
              />
            </div>
          )}
          {phase.activities.length === 0 && (
            <div style={{ marginTop: 16, color: '#666' }}>
              Chưa có hoạt động được lên lịch
            </div>
          )}
        </div>
      )
    }));
  };

  const totalSteps = treatmentData && treatmentData.phases ? treatmentData.phases.length : 0;
  const completedSteps = treatmentData && treatmentData.phases ? treatmentData.phases.filter(phase => phase.statusRaw === 'COMPLETED').length : 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const currentPhaseIdx = treatmentData && typeof treatmentData.currentPhase === 'number' ? treatmentData.currentPhase - 1 : -1;
  const currentPhase = getCurrentPhase();

  // Handler for step click
  const handleStepClick = (phase) => {
    setSelectedPhase(phase);
    setModalOpen(true);
  };

  // Hàm lấy trạng thái tổng thể - giống như MyServices
  const getOverallStatus = (status, progress) => {
    if (status === 'CANCELLED') {
      return { text: 'Đã hủy', color: 'error' };
    }
    if (status === 'COMPLETED') {
      return { text: 'Hoàn thành', color: 'success' };
    }
    if (status === 'INPROGRESS') {
      return { text: 'Đang điều trị', color: 'processing' };
    }
    if (status === 'PENDING') {
      return { text: 'Đang chờ điều trị', color: 'warning' };
    }
    return { text: 'Đang chờ điều trị', color: 'warning' };
  };

  // Hàm lấy màu cho progress bar
  const getProgressColor = (progress) => {
    if (progress === 0) return '#faad14';
    if (progress === 100) return '#52c41a';
    return '#1890ff';
  };

  // Hàm render treatment overview
  const renderTreatmentOverview = () => (
    <Card 
      style={{ 
        marginBottom: 24,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
      hoverable
      styles={{ body: { padding: '24px' } }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: 24 }}>
            <MedicineBoxOutlined style={{ marginRight: 8 }} />
            Quá trình điều trị hiện tại
          </Title>
          <Descriptions 
            column={1} 
            style={{ 
              background: '#fafafa', 
              padding: '16px', 
              borderRadius: '8px',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <Descriptions.Item label="Gói điều trị">
              <MedicineBoxOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              <Text strong>{treatmentData.type}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Bác sĩ phụ trách">
              <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              <Text strong>{treatmentData.doctor}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              {dayjs(treatmentData.startDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(treatmentData.status)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: 24 }}>
            <Title level={5} style={{ color: '#1890ff', marginBottom: 16 }}>
              <CheckIcon style={{ marginRight: 8 }} />
              Tiến độ tổng thể
            </Title>
            <Progress 
              percent={progress} 
              status="active" 
              strokeColor={{
                from: getProgressColor(progress),
                to: getProgressColor(progress),
              }}
              size={12}
              style={{ marginBottom: 8 }}
            />
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {progress}% hoàn thành
            </Text>
          </div>
          <div>
            <Title level={5} style={{ color: '#1890ff', marginBottom: 16 }}>
              <HeartOutlined style={{ marginRight: 8 }} />
              Giai đoạn hiện tại
            </Title>
            <div style={{ 
              background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f7ff 100%)', 
              padding: 20, 
              borderRadius: 12,
              border: '1px solid #91d5ff',
              transition: 'all 0.3s ease'
            }}>
              <Space align="baseline">
                <HeartOutlined style={{ fontSize: 28, color: '#1890ff' }} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
                    {currentPhase ? currentPhase.name : 'Thăm khám ban đầu'}
                  </div>
                  <div style={{ color: '#666', marginTop: 4 }}>
                    {currentPhase ? currentPhase.notes : 'Chuẩn bị thăm khám ban đầu'}
                  </div>
                </div>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Hàm render treatment progress (thay thế cho treatment steps)
  const renderTreatmentProgress = () => (
    <Card 
      title={
        <Space>
          <DeploymentUnitOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <span>Tiến trình điều trị</span>
        </Space>
      }
      style={{ 
        marginBottom: 24,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
      hoverable
    >
      <Collapse 
        defaultActiveKey={['0']} 
        style={{ background: 'transparent' }}
        expandIconPosition="end"
        items={renderPhases()}
      />
    </Card>
  );

  // Hàm render treatment tips
  const renderTreatmentTips = () => (
    <Card 
      title={
        <Space>
          <InfoCircleOutlined style={{ color: '#1890ff' }} />
          <span>Lưu ý trong quá trình điều trị</span>
        </Space>
      }
      style={{ 
        marginTop: 24,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
      hoverable
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card 
            type="inner" 
            title={
              <Space>
                <MedicineBoxOutlined style={{ color: '#52c41a' }} />
                <span>Dinh dưỡng</span>
              </Space>
            }
            style={{ borderRadius: '8px' }}
            hoverable
          >
            <ul style={{ paddingLeft: 16 }}>
              <li>Đảm bảo đủ folate và vitamin D</li>
              <li>Bổ sung DHA và axit folic</li>
              <li>Tránh đồ uống có cồn và caffeine</li>
              <li>Duy trì cân nặng phù hợp</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            type="inner" 
            title={
              <Space>
                <HeartOutlined style={{ color: '#1890ff' }} />
                <span>Chăm sóc sức khỏe</span>
              </Space>
            }
            style={{ borderRadius: '8px' }}
            hoverable
          >
            <ul style={{ paddingLeft: 16 }}>
              <li>Tập thể dục nhẹ nhàng đều đặn</li>
              <li>Tránh các hoạt động nặng</li>
              <li>Ngủ đủ giấc</li>
              <li>Quản lý stress</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            type="inner" 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#faad14' }} />
                <span>Sau thủ thuật</span>
              </Space>
            }
            style={{ borderRadius: '8px' }}
            hoverable
          >
            <ul style={{ paddingLeft: 16 }}>
              <li>Nghỉ ngơi sau lấy trứng và chuyển phôi</li>
              <li>Tránh quan hệ tình dục trong thời gian được hướng dẫn</li>
              <li>Uống thuốc theo đúng chỉ định</li>
              <li>Báo cáo bất thường cho bác sĩ</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Card>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  if (!treatmentData || !treatmentData.phases) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="secondary">Không có thông tin điều trị</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24,
        background: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(path.customerServices)}
            style={{ border: 'none', boxShadow: 'none' }}
          />
          <Title level={4} style={{ margin: 0 }}>Tiến độ điều trị</Title>
        </div>
      </div>

      {renderTreatmentOverview()}
      {renderTreatmentProgress()}
      {renderTreatmentTips()}

      {/* Modal chi tiết phase */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title={selectedPhase ? selectedPhase.name : ''}
      >
        {selectedPhase && (
          <div>
            <p><b>Trạng thái:</b> {getStepStatusTag(selectedPhase.statusRaw)}</p>
            {selectedPhase.displayDate && <p><b>Ngày khám:</b> {dayjs(selectedPhase.displayDate).format("DD/MM/YYYY")}</p>}
            {selectedPhase.notes && <p><b>Ghi chú:</b> {selectedPhase.notes}</p>}
          </div>
        )}
      </Modal>

      {/* Modal đổi lịch hẹn */}
      <Modal
        title={`Gửi yêu cầu thay đổi lịch hẹn: ${changeStep?.name || ""}`}
        open={changeModalVisible}
        onCancel={() => {
          setChangeModalVisible(false);
          changeForm.resetFields();
        }}
        onOk={handleSubmitChange}
        okText="Gửi yêu cầu"
        confirmLoading={changeLoading}
        destroyOnHidden
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

export default TreatmentProgress; 