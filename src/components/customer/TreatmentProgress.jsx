import React, { useState, useEffect } from 'react';
import { 
  Card, Steps, Row, Col, Typography, Descriptions, Tag, 
  Timeline, Space, Divider, Progress, Collapse, Spin, message, Button, Modal,
  Form, Select, DatePicker, Input, Alert, Table
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
  EditOutlined,
  RightOutlined
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
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('list');
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    if (location.state?.treatmentRecord && location.state?.treatmentId) {
      setViewMode('detail');
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const treatmentRecord = location.state?.treatmentRecord;
      const treatmentId = location.state?.treatmentId;
      
      if (treatmentRecord && treatmentId) {
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
        const userResponse = await authService.getMyInfo();
        console.log('User Info Response:', userResponse);
        
        if (!userResponse?.data?.result?.id) {
          message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          return;
        }

        const customerId = userResponse.data.result.id;
        const response = await treatmentService.getTreatmentRecordsByCustomer(customerId);
        
        if (response?.data?.code === 1000 && Array.isArray(response.data.result)) {
          const treatmentRecords = response.data.result
            .filter(treatment => treatment.status !== 'CANCELLED')
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

          setTreatments(treatmentRecords.map(treatment => {
            const totalSteps = treatment.treatmentSteps.length;
            const completedSteps = treatment.treatmentSteps.filter(step => step.status === 'COMPLETED').length;
            const progress = Math.round((completedSteps / totalSteps) * 100);

            return {
              key: treatment.id,
              id: treatment.id,
              serviceName: treatment.treatmentServiceName,
              doctorName: treatment.doctorName,
              startDate: treatment.startDate,
              status: treatment.status,
              progress: progress,
              treatmentSteps: treatment.treatmentSteps,
              customerId: treatment.customerId
            };
          }));
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

  const handleOpenChangeModal = async (step) => {
    if (!treatmentData?.customerId) return;
    setChangeStep(step);
    setChangeAppointment(null);
    setChangeModalVisible(true);
    setChangeLoading(true);
    try {
      const res = await treatmentService.getAppointmentsByStepId(step.id);
      if (res?.data?.code === 1000 && res.data.result) {
        const appointments = res.data.result;
        console.log("Tất cả lịch hẹn của step:", appointments);
        
        if (appointments.length === 0) {
          setChangeAppointment(null);
          console.log("Không tìm thấy lịch hẹn cho step:", step.name);
        } else {
          setChangeAppointment(appointments);
          console.log("Có", appointments.length, "lịch hẹn cho step:", step.name);
        }
      } else {
        setChangeAppointment(null);
        console.log("Không tìm thấy lịch hẹn cho step:", step.name);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setChangeAppointment(null);
      message.error('Không thể lấy danh sách lịch hẹn');
    } finally {
      setChangeLoading(false);
    }
  };

  const handleSubmitChange = async () => {
    if (!selectedAppointment) {
      message.error("Vui lòng chọn lịch hẹn để thay đổi");
      return;
    }
    
    try {
      setChangeLoading(true);
      const values = await changeForm.validateFields();
      
      console.log("=== CHANGE REQUEST DEBUG ===");
      console.log("Selected appointment:", selectedAppointment);
      console.log("Appointment ID:", selectedAppointment.id, "Type:", typeof selectedAppointment.id);
      console.log("Appointment status:", selectedAppointment.status);
      console.log("Appointment customer:", selectedAppointment.customerName);
      console.log("Form values:", values);
      console.log("Sending change request for appointment ID:", selectedAppointment.id);
      console.log("Request data:", {
        requestedDate: values.requestedDate.format("YYYY-MM-DD"),
        requestedShift: values.requestedShift,
        notes: values.notes || "",
      });
      
      const response = await treatmentService.requestChangeAppointment(selectedAppointment.id, {
        requestedDate: values.requestedDate.format("YYYY-MM-DD"),
        requestedShift: values.requestedShift,
        notes: values.notes || "",
      });

      console.log("Change request response:", response);

      if (response?.data?.code === 1000 || response?.status === 200) {
        message.success("Đã gửi yêu cầu thay đổi lịch hẹn!");
        setChangeModalVisible(false);
        setSelectedAppointment(null);
        changeForm.resetFields();
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
        message.error("Không tìm thấy lịch hẹn với ID: " + selectedAppointment.id);
      } else if (err?.response?.status === 400) {
        message.error("Dữ liệu không hợp lệ: " + (err?.response?.data?.message || err?.message));
      } else {
        message.error(err?.response?.data?.message || err?.message || "Không thể gửi yêu cầu.");
      }
    } finally {
      setChangeLoading(false);
    }
  };

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

  const getCurrentPhase = () => {
    if (!treatmentData?.phases) return null;
    
    const currentPhase = treatmentData.phases.find(phase => phase.statusRaw !== 'COMPLETED');
    
    if (currentPhase) {
      return {
        name: currentPhase.name,
        status: currentPhase.statusRaw,
        notes: currentPhase.notes || 'Đang chờ thực hiện'
      };
    }
    
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

          {phase.appointment && phase.appointment.status === 'REJECTED' && (
            <div style={{ marginTop: 16 }}>
              <Alert
                type="warning"
                message="Lịch hẹn đã bị từ chối"
                description={`${phase.appointment.notes || 'Không có ghi chú'} - Bạn có thể gửi yêu cầu đổi lịch để chọn thời gian phù hợp hơn.`}
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

  const handleStepClick = (phase) => {
    setSelectedPhase(phase);
    setModalOpen(true);
  };

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

  const getProgressColor = (progress) => {
    if (progress === 0) return '#faad14';
    if (progress === 100) return '#52c41a';
    return '#1890ff';
  };

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

  const columns = [
    {
      title: 'Gói điều trị',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: text => (
        <Space>
          <MedicineBoxOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Bác sĩ phụ trách',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: text => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      )
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: date => (
        <Space>
          <CalendarOutlined />
          {dayjs(date).format('DD/MM/YYYY')}
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => getStatusTag(status)
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: progress => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? "success" : "active"}
        />
      )
    },
    {
      title: 'Chi tiết dịch vụ',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary"
          icon={<RightOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  const handleViewDetail = async (record) => {
    try {
      setLoading(true);
      const appointmentsResponse = await treatmentService.getCustomerAppointments(record.customerId);
      const appointments = appointmentsResponse?.data?.result || [];
      
      const treatmentDetail = {
        id: record.id,
        type: record.serviceName,
        startDate: record.startDate,
        currentPhase: record.treatmentSteps.findIndex(step => step.status === 'COMPLETED') + 1,
        doctor: record.doctorName,
        status: record.status.toLowerCase(),
        estimatedCompletion: dayjs(record.startDate).add(45, 'days').format('YYYY-MM-DD'),
        nextAppointment: null,
        overallProgress: record.progress,
        customerId: record.customerId,
        phases: record.treatmentSteps.map((step) => {
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
      };
      
      setTreatmentData(treatmentDetail);
      setViewMode('detail');
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải chi tiết điều trị');
    } finally {
      setLoading(false);
    }
  };

  const renderListView = () => (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>
          <Space>
            <MedicineBoxOutlined />
            Tiến trình điều trị
          </Space>
        </Title>
        <Table 
          columns={columns} 
          dataSource={treatments}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
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

  if (viewMode === 'list') {
    return renderListView();
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
            onClick={() => setViewMode('list')}
            style={{ border: 'none', boxShadow: 'none' }}
          />
          <Title level={4} style={{ margin: 0 }}>Tiến độ điều trị</Title>
        </div>
      </div>

      {renderTreatmentOverview()}
      {renderTreatmentProgress()}
      {renderTreatmentTips()}

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

      <Modal
        title={`Gửi yêu cầu thay đổi lịch hẹn: ${changeStep?.name || ""}`}
        open={changeModalVisible}
        onCancel={() => {
          setChangeModalVisible(false);
          setSelectedAppointment(null);
          changeForm.resetFields();
        }}
        onOk={handleSubmitChange}
        okText="Gửi yêu cầu"
        confirmLoading={changeLoading}
        destroyOnHidden
        width={800}
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
                  title: 'Ngày hẹn',
                  dataIndex: 'appointmentDate',
                  key: 'appointmentDate',
                  render: (date) => dayjs(date).format('DD/MM/YYYY')
                },
                {
                  title: 'Ca khám',
                  dataIndex: 'shift',
                  key: 'shift',
                  render: (shift) => shift === 'MORNING' ? 'Sáng' : 'Chiều'
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => {
                    switch (status) {
                      case 'CONFIRMED':
                        return <Tag color="green">Đã xác nhận</Tag>;
                      case 'PENDING':
                        return <Tag color="orange">Đang chờ</Tag>;
                      case 'REJECTED':
                        return <Tag color="red">Đã từ chối</Tag>;
                      case 'PENDING_CHANGE':
                        return <Tag color="blue">Chờ duyệt đổi lịch</Tag>;
                      case 'REJECTED_CHANGE':
                        return <Tag color="red">Từ chối đổi lịch</Tag>;
                      default:
                        return <Tag color="default">{status}</Tag>;
                    }
                  }
                },
                {
                  title: 'Ghi chú',
                  dataIndex: 'notes',
                  key: 'notes',
                  render: (notes) => notes || '-'
                },
                {
                  title: 'Chọn',
                  key: 'select',
                  render: (_, record) => (
                    <Button
                      type={selectedAppointment?.id === record.id ? "primary" : "default"}
                      size="small"
                      onClick={() => {
                        setSelectedAppointment(record);
                        changeForm.setFieldsValue({
                          requestedDate: record.appointmentDate ? dayjs(record.appointmentDate) : null,
                          requestedShift: record.shift || undefined,
                          notes: record.notes || "",
                        });
                      }}
                    >
                      {selectedAppointment?.id === record.id ? 'Đã chọn' : 'Chọn'}
                    </Button>
                  )
                }
              ]}
              pagination={false}
              size="small"
              rowKey="id"
            />
            
            {selectedAppointment && (
              <div style={{ marginTop: 16 }}>
                <Divider />
                <Text strong>Thông tin lịch hẹn mới:</Text>
                <Form form={changeForm} layout="vertical" style={{ marginTop: 16 }}>
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
    </div>
  );
};

export default TreatmentProgress; 