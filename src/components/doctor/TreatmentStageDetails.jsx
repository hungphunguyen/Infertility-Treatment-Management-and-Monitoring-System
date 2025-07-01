import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Divider,
  Progress,
  Tooltip,
  Badge
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  CheckCircleOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  MedicineBoxOutlined, 
  ExclamationCircleOutlined,
  ExperimentOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { treatmentService } from '../../service/treatment.service';
import { authService } from '../../service/auth.service';
import dayjs from 'dayjs';
import { NotificationContext } from "../../App";

const { Title, Text } = Typography;
const { TextArea } = Input;

const TreatmentStageDetails = () => {
  console.log('🚀 TreatmentStageDetails component loaded');
  
  const [loading, setLoading] = useState(true);
  const [treatmentData, setTreatmentData] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [nextStep, setNextStep] = useState(null);
  const [form] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const [scheduleStep, setScheduleStep] = useState(null);
  const [stepAppointments, setStepAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showStepDetailModal, setShowStepDetailModal] = useState(false);
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const dataLoadedRef = React.useRef(false);

  // Debug log khi treatmentData thay đổi
  useEffect(() => {
    console.log('🔄 TreatmentData state changed:', treatmentData);
    console.log('🔄 Has treatmentSteps?', !!treatmentData?.treatmentSteps);
    console.log('🔄 Steps count:', treatmentData?.treatmentSteps?.length || 0);
    console.log('🔄 Steps data:', treatmentData?.treatmentSteps);
  }, [treatmentData]);

  const statusOptions = [
    { value: 'PLANNED', label: 'Chờ xếp lịch' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'INPROGRESS', label: 'Đang thực hiện' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
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
      console.log('🚀 Starting to fetch treatment data...');

      try {
        const { patientInfo, treatmentData: passedTreatmentData, appointmentData } = location.state || {};
        if (!patientInfo) {
          showNotification("Không tìm thấy thông tin bệnh nhân", "warning");
          navigate(-1);
          return;
        }

        console.log('📋 Received data from PatientList:', {
          patientInfo,
          treatmentData: passedTreatmentData,
          appointmentData
        });

        // Chỉ sử dụng treatmentData được truyền từ PatientList
        if (passedTreatmentData && passedTreatmentData.id) {
          console.log('✅ Using treatmentData from PatientList:', passedTreatmentData.id);
          
          // Nếu đã có đủ steps thì dùng luôn
          if (passedTreatmentData.treatmentSteps && passedTreatmentData.treatmentSteps.length > 0) {
            console.log('✅ TreatmentData already has steps, using directly');
            setTreatmentData(passedTreatmentData);
            setLoading(false);
            return;
          } else {
            // Gọi API lấy chi tiết để có steps
            console.log('⚠️ TreatmentData missing steps, calling API to get details...');
            const detailedResponse = await treatmentService.getTreatmentRecordById(passedTreatmentData.id);
            const detailedData = detailedResponse?.data?.result;
            if (detailedData) {
              console.log('✅ Got detailed treatment data with steps');
              setTreatmentData(detailedData);
              setLoading(false);
              return;
            } else {
              console.log('⚠️ API call failed, using passed treatmentData');
              setTreatmentData(passedTreatmentData);
              setLoading(false);
              return;
            }
          }
        }

        // Nếu không có treatmentData từ PatientList, báo lỗi
        console.log('❌ No treatmentData received from PatientList');
        showNotification("Không nhận được dữ liệu điều trị từ danh sách bệnh nhân", "error");
        navigate(-1);
        
      } catch (error) {
        console.error('❌ Error fetching treatment data:', error);
        showNotification("Không thể lấy thông tin điều trị", "error");
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]); // Chỉ phụ thuộc vào doctorId

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "#1890ff";
      case "PLANNED":
        return "#d9d9d9";
      case "COMPLETED":
        return "#52c41a";
      case "CANCELLED":
        return "#ff4d4f";
      case "INPROGRESS":
        return "#fa8c16";
      default:
        return "#d9d9d9";
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
        return "Đang thực hiện";
      case "PENDING_CHANGE":
        return "Chờ duyệt đổi lịch";
      default:
        return status;
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
      case "PLANNED":
        return "Chờ xếp lịch";
      case "CANCELLED":
        return "Đã hủy";
      case "PENDING_CHANGE":
        return "Chờ duyệt đổi lịch";
      case "REJECTED_CHANGE":
        return "Từ chối đổi lịch";
      case "REJECTED":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const handleUpdateStep = async (values) => {
    if (!editingStep) return;

    console.log('🔍 handleUpdateStep called:', { editingStep, values });

    try {
      const updateData = {
        scheduledDate: values.scheduledDate?.format('YYYY-MM-DD'),
        actualDate: values.actualDate?.format('YYYY-MM-DD'),
        status: values.status,
        notes: values.notes
      };
      
      console.log('🔍 Update data prepared:', updateData);
      console.log('🔍 Calling updateTreatmentStep with id:', editingStep.id);

      const response = await treatmentService.updateTreatmentStep(editingStep.id, updateData);
      
      console.log('🔍 Update response:', response);
      console.log('🔍 Response code:', response?.code || response?.data?.code);

      if (response?.code === 1000 || response?.data?.code === 1000) {
        console.log('✅ Update successful, refreshing data...');
        
        // Thử lấy treatment record với steps để refresh data
        try {
          const detailedResponse = await treatmentService.getTreatmentRecordById(treatmentData.id);
          const detailedData = detailedResponse?.data?.result;
          
          console.log('🔍 Detailed response after update:', detailedResponse);
          console.log('🔍 Detailed data after update:', detailedData);
          
          if (detailedData && detailedData.treatmentSteps) {
            console.log('✅ Setting updated treatment data:', detailedData);
            setTreatmentData(detailedData);
          } else {
            console.warn('❌ Treatment record không có steps sau khi update');
            // Fallback to old method
            const updatedResponse = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
            
            // Đảm bảo updatedResponse là array
            let treatmentRecords = [];
            if (Array.isArray(updatedResponse)) {
              treatmentRecords = updatedResponse;
            } else if (updatedResponse?.data?.result) {
              if (Array.isArray(updatedResponse.data.result)) {
                treatmentRecords = updatedResponse.data.result;
              } else if (updatedResponse.data.result.content && Array.isArray(updatedResponse.data.result.content)) {
                treatmentRecords = updatedResponse.data.result.content;
              }
            }
            
            if (treatmentRecords && treatmentRecords.length > 0) {
              const updatedRecord = treatmentRecords.find(record => record.id === treatmentData.id);
              if (updatedRecord) {
                console.log('✅ Setting updated record from list:', updatedRecord);
                setTreatmentData(updatedRecord);
              }
            }
          }
        } catch (refreshError) {
          console.warn('❌ Không thể refresh data:', refreshError);
          // Fallback to old method
          const updatedResponse = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
          
          // Đảm bảo updatedResponse là array
          let treatmentRecords = [];
          if (Array.isArray(updatedResponse)) {
            treatmentRecords = updatedResponse;
          } else if (updatedResponse?.data?.result) {
            if (Array.isArray(updatedResponse.data.result)) {
              treatmentRecords = updatedResponse.data.result;
            } else if (updatedResponse.data.result.content && Array.isArray(updatedResponse.data.result.content)) {
              treatmentRecords = updatedResponse.data.result.content;
            }
          }
          
          if (treatmentRecords && treatmentRecords.length > 0) {
            const updatedRecord = treatmentRecords.find(record => record.id === treatmentData.id);
            if (updatedRecord) {
              console.log('✅ Setting updated record from fallback:', updatedRecord);
              setTreatmentData(updatedRecord);
            }
          }
        }
        
        setEditingStep(null);
        form.resetFields();
        showNotification("Cập nhật thành công", "success");
      } else {
        console.warn('❌ Update failed - invalid response code:', response?.code || response?.data?.code);
        showNotification("Cập nhật thất bại", "error");
      }
    } catch (error) {
      console.error('❌ Error updating step:', error);
      console.error('❌ Error details:', error.response?.data);
      showNotification("Có lỗi khi cập nhật", "error");
    }
  };

  const showScheduleModalForStep = async (step) => {
    setScheduleStep(step);
    setShowScheduleModal(true);
    setShowCreateForm(false);
    scheduleForm.resetFields();
    setLoadingAppointments(true);

    try {
      const response = await treatmentService.getAppointmentsByStepId(step.id);
      setStepAppointments(response?.data?.result?.content || []);
    } catch (error) {
      showNotification("Không thể lấy danh sách lịch hẹn", "error");
      setStepAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleScheduleAppointment = async (values) => {
    try {
      // Lấy đúng step object từ treatmentData dựa vào id
      const stepObj = treatmentData.treatmentSteps.find(
        step => String(step.id) === String(values.treatmentStepId)
      );
      const appointmentData = {
        customerId: treatmentData.customerId,
        doctorId: doctorId,
        appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
        shift: values.shift,
        purpose: stepObj?.name || '', // Luôn lấy tên tiếng Việt
        notes: values.notes,
        treatmentStepId: values.treatmentStepId
      };
      const response = await treatmentService.createAppointment(appointmentData);
      if (response?.data?.code === 1000) {
        showNotification("Tạo lịch hẹn thành công", "success");
        setShowCreateAppointmentModal(false);
        setShowStepDetailModal(true);
        setLoadingAppointments(true);
        try {
          const refreshed = await treatmentService.getAppointmentsByStepId(values.treatmentStepId);
          setStepAppointments(refreshed?.data?.result?.content || []);
        } catch (error) {
          setStepAppointments([]);
        } finally {
          setLoadingAppointments(false);
        }
        scheduleForm.resetFields();
      } else {
        showNotification(response?.data?.message || "Tạo lịch hẹn thất bại", "error");
      }
    } catch (error) {
      let errorMessage = "Có lỗi khi tạo lịch hẹn";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      showNotification(errorMessage, "error");
    }
  };

  const showEditModal = (step) => {
    setEditingStep(step);
    form.setFieldsValue({
      scheduledDate: step.scheduledDate ? dayjs(step.scheduledDate) : null,
      actualDate: step.actualDate ? dayjs(step.actualDate) : null,
      status: step.status,
      notes: step.notes
    });
  };

  const handleCompleteTreatment = async () => {
    try {
      console.log('🔍 handleCompleteTreatment called:', { treatmentId: treatmentData.id, status: 'COMPLETED' });
      
      const response = await treatmentService.updateTreatmentStatus(treatmentData.id, 'COMPLETED');
      
      console.log('🔍 Complete treatment response:', response);
      console.log('🔍 Response code:', response?.code || response?.data?.code);
      
      if (response?.data?.code === 1000 || response?.code === 1000) {
        console.log('✅ Treatment completed successfully, refreshing data...');
        showNotification("Hoàn thành điều trị thành công", "success");
        
        // Thử lấy treatment record với steps để refresh data
        try {
          const detailedResponse = await treatmentService.getTreatmentRecordById(treatmentData.id);
          const detailedData = detailedResponse?.data?.result;
          
          console.log('🔍 Detailed response after completion:', detailedResponse);
          console.log('🔍 Detailed data after completion:', detailedData);
          
          if (detailedData && detailedData.treatmentSteps) {
            console.log('✅ Setting updated treatment data after completion:', detailedData);
            setTreatmentData(detailedData);
          } else {
            console.warn('❌ Treatment record không có steps sau khi complete');
            // Fallback to old method
            const updatedResponse = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
            
            // Đảm bảo updatedResponse là array
            let treatmentRecords = [];
            if (Array.isArray(updatedResponse)) {
              treatmentRecords = updatedResponse;
            } else if (updatedResponse?.data?.result) {
              if (Array.isArray(updatedResponse.data.result)) {
                treatmentRecords = updatedResponse.data.result;
              } else if (updatedResponse.data.result.content && Array.isArray(updatedResponse.data.result.content)) {
                treatmentRecords = updatedResponse.data.result.content;
              }
            }
            
            if (treatmentRecords && treatmentRecords.length > 0) {
              const updatedRecord = treatmentRecords.find(record => record.id === treatmentData.id);
              if (updatedRecord) {
                console.log('✅ Setting updated record from list after completion:', updatedRecord);
                setTreatmentData(updatedRecord);
              }
            }
          }
        } catch (refreshError) {
          console.warn('❌ Không thể refresh data after completion:', refreshError);
          // Fallback to old method
          const updatedResponse = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
          
          // Đảm bảo updatedResponse là array
          let treatmentRecords = [];
          if (Array.isArray(updatedResponse)) {
            treatmentRecords = updatedResponse;
          } else if (updatedResponse?.data?.result) {
            if (Array.isArray(updatedResponse.data.result)) {
              treatmentRecords = updatedResponse.data.result;
            } else if (updatedResponse.data.result.content && Array.isArray(updatedResponse.data.result.content)) {
              treatmentRecords = updatedResponse.data.result.content;
            }
          }
          
          if (treatmentRecords && treatmentRecords.length > 0) {
            const updatedRecord = treatmentRecords.find(record => record.id === treatmentData.id);
            if (updatedRecord) {
              console.log('✅ Setting updated record from fallback after completion:', updatedRecord);
              setTreatmentData(updatedRecord);
            }
          }
        }
      } else {
        console.warn('❌ Treatment completion failed - invalid response code:', response?.code || response?.data?.code);
        showNotification("Hoàn thành điều trị thất bại", "error");
      }
    } catch (error) {
      console.error('❌ Error completing treatment:', error);
      console.error('❌ Error details:', error.response?.data);
      showNotification("Có lỗi khi hoàn thành điều trị", "error");
    }
  };

  const isAllStepsCompleted = () => {
    return treatmentData?.treatmentSteps?.every(step => step.status === 'COMPLETED');
  };

  const calculateProgress = () => {
    if (!treatmentData?.treatmentSteps) return 0;
    const completedSteps = treatmentData.treatmentSteps.filter(step => step.status === 'COMPLETED').length;
    return Math.round((completedSteps / treatmentData.treatmentSteps.length) * 100);
  };

  const handleStepClick = async (step) => {
    console.log('🎯 Step clicked:', step);
    console.log('🎯 Step ID:', step.id);
    setSelectedStep(step);
    setShowStepDetailModal(true);
    setShowCreateAppointmentModal(false);
    setLoadingAppointments(true);
    try {
      console.log('🔍 Calling getAppointmentsByStepId with stepId:', step.id);
      const response = await treatmentService.getAppointmentsByStepId(step.id);
      console.log('🔍 Appointments response:', response);
      console.log('🔍 Appointments response.data:', response?.data);
      console.log('🔍 Appointments response.data.result:', response?.data?.result);
      console.log('🔍 Appointments response.data.result.content:', response?.data?.result?.content);
      console.log('🔍 Appointments response.data.result type:', typeof response?.data?.result);
      console.log('🔍 Is result array?', Array.isArray(response?.data?.result));
      console.log('🔍 Is content array?', Array.isArray(response?.data?.result?.content));
      
      // Lấy content array từ paginated response
      const appointments = response?.data?.result?.content || [];
      console.log('🔍 Final appointments array:', appointments);
      console.log('🔍 Appointments length:', appointments.length);
      
      setStepAppointments(appointments);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      console.error('❌ Error details:', error.response?.data);
      setStepAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleShowCreateAppointment = () => {
    setShowStepDetailModal(false);
    setShowCreateAppointmentModal(true);
    scheduleForm.resetFields();
  };

  // Helper function to handle appointment status updates
  const handleAppointmentStatusUpdate = async (appointmentId, newStatus, stepId) => {
    try {
      const res = await treatmentService.updateAppointmentStatus(appointmentId, newStatus);
      if (res?.data?.code === 1000) {
        showNotification('Cập nhật trạng thái thành công', 'success');
        
        // Update local state immediately
        setStepAppointments(prev =>
          Array.isArray(prev) ? prev.map(a =>
            a.id === appointmentId ? { ...a, status: newStatus, showStatusSelect: false } : a
          ) : []
        );
        
        // Refresh data from server
        if (stepId) {
          const refreshed = await treatmentService.getAppointmentsByStepId(stepId);
          setStepAppointments(refreshed?.data?.result?.content || []);
        }
      } else {
        showNotification(res?.data?.message || 'Cập nhật thất bại', 'error');
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      showNotification('Có lỗi khi cập nhật trạng thái', 'error');
    }
  };

  React.useEffect(() => {
    if (showCreateAppointmentModal && selectedStep) {
      scheduleForm.setFieldsValue({ treatmentStepId: selectedStep.id });
    }
  }, [showCreateAppointmentModal, selectedStep]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#fff',
        overflow: 'hidden'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#fff',
      padding: '32px 0',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      {/* Header */}
      <Card style={{ 
        marginBottom: '24px', 
        borderRadius: 14, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        background: '#fff',
        width: 800,
        maxWidth: '98vw',
        minWidth: 320,
        padding: 0
      }}>
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
          <Col flex="auto">
            <Title level={3} style={{ margin: 0, color: '#1a1a1a', textAlign: 'left', fontWeight: 700 }}>
              Tiến Trình Điều Trị
            </Title>
            
          </Col>
        </Row>
      </Card>

      {treatmentData ? (
        <>
          {/* Patient Info */}
          <Card style={{ 
            marginBottom: '24px', 
            borderRadius: 14, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            background: '#fff',
            width: 800,
            maxWidth: '98vw',
            minWidth: 320,
            padding: 0
          }}>
            <Row gutter={[24, 24]} align="middle">
              <Col>
                <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              </Col>
              <Col flex="auto">
                <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
                  {treatmentData.customerName}
                </Title>
                <Space size="large">
                  <Tag icon={<MedicineBoxOutlined />} color="blue" style={{ fontSize: 13, padding: '6px 12px' }}>
                    {treatmentData.treatmentServiceName}
                  </Tag>
                  <Tag color="green" style={{ fontSize: 13, padding: '6px 12px' }}>
                    {getStatusText(treatmentData.status)}
                  </Tag>
                </Space>
              </Col>
              <Col>
                <Progress 
                  type="circle" 
                  percent={calculateProgress()} 
                  size={60}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Col>
            </Row>
          </Card>

          {/* Timeline */}
          {(() => {
            console.log('🎯 Rendering timeline...');
            console.log('🎯 treatmentData:', treatmentData);
            console.log('🎯 treatmentSteps:', treatmentData?.treatmentSteps);
            console.log('🎯 Steps count:', treatmentData?.treatmentSteps?.length || 0);
            console.log('🎯 Will render timeline?', !!treatmentData?.treatmentSteps?.length);
            
            return (
              <Card style={{ 
                borderRadius: 14, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                background: '#fff',
                width: 800,
                maxWidth: '98vw',
                minWidth: 320,
                marginBottom: '24px',
                padding: '24px 0 8px 0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 16px',
                  marginBottom: 24
                }}>
                  {treatmentData.treatmentSteps?.map((step, index) => (
                    <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Tooltip title={`Bước ${index + 1}: ${step.name}`}>
                        <div
                          onClick={() => handleStepClick(step)}
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${getStatusColor(step.status)} 0%, ${getStatusColor(step.status)}dd 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            border: '3px solid white'
                          }}
                        >
                          <ExperimentOutlined 
                            style={{ 
                              fontSize: 22, 
                              color: 'white',
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }} 
                          />
                          <Badge 
                            count={index + 1} 
                            style={{ 
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: '#1890ff',
                              color: 'white',
                              fontSize: 11,
                              fontWeight: 'bold'
                            }}
                          />
                        </div>
                      </Tooltip>
                      <div style={{ marginTop: 6 }}>
                        {step.status === 'COMPLETED' && (
                          <CheckOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                        )}
                        {step.status === 'CANCELLED' && (
                          <CloseOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
                        )}
                        {step.status === 'INPROGRESS' && (
                          <ClockCircleOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })()}

          {/* Complete Treatment Button */}
          {isAllStepsCompleted() && treatmentData.status !== 'COMPLETED' && (
            <Card style={{ 
              borderRadius: 14, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              textAlign: 'center',
              border: 'none',
              width: 800,
              maxWidth: '98vw',
              minWidth: 320,
              marginBottom: 16
            }}>
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                  🎉 Tất cả các bước đã hoàn thành!
                </Title>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleCompleteTreatment}
                  size="large"
                  style={{ 
                    background: 'white', 
                    borderColor: 'white', 
                    color: '#52c41a',
                    borderRadius: 10, 
                    minWidth: 200, 
                    fontWeight: 600, 
                    fontSize: 15,
                    height: 44
                  }}
                >
                  Hoàn thành điều trị
                </Button>
              </Space>
            </Card>
          )}
        </>
      ) : (
        <Card style={{ 
          borderRadius: 14, 
          textAlign: 'center',
          background: '#fff',
          width: 800,
          maxWidth: '98vw',
          minWidth: 320,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Title level={4}>Không tìm thấy thông tin điều trị</Title>
          <Text>Vui lòng kiểm tra lại thông tin bệnh nhân hoặc thử lại sau.</Text>
        </Card>
      )}

      {/* Step Detail Modal */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <ExperimentOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 8 }} />
            Chi Tiết Bước Điều Trị
          </div>
        }
        open={showStepDetailModal}
        onCancel={() => {
          setShowStepDetailModal(false);
          setSelectedStep(null);
        }}
        footer={null}
        width={800}
        centered
      >
        {selectedStep && (
          <div style={{ padding: '32px 0' }}>
            <Card style={{ marginBottom: 0, borderRadius: 16, width: '100%', padding: 32 }}>
              <Title level={4} style={{ color: '#1890ff', marginBottom: 16 }}>
                {selectedStep.name}
              </Title>
              <Row gutter={24}>
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Trạng thái:</Text>
                    <br />
                    <Tag color={getStatusColor(selectedStep.status)} style={{ marginTop: 4 }}>
                      {getStatusText(selectedStep.status)}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Ghi chú:</Text>
                    <br />
                    <Text style={{ marginTop: 4 }}>
                      {selectedStep.notes || 'Không có ghi chú'}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>Ngày dự kiến:</Text>
                    <br />
                    <Text style={{ marginTop: 4 }}>
                      {selectedStep.scheduledDate ? dayjs(selectedStep.scheduledDate).format('DD/MM/YYYY') : 'Chưa có'}
                    </Text>
                  </div>
                  <div>
                    <Text strong>Ngày thực hiện:</Text>
                    <br />
                    <Text style={{ marginTop: 4 }}>
                      {selectedStep.actualDate ? dayjs(selectedStep.actualDate).format('DD/MM/YYYY') : 'Chưa có'}
                    </Text>
                  </div>
                </Col>
              </Row>
              <div style={{ fontWeight: 600, margin: '32px 0 16px 0', fontSize: 16, textAlign: 'left' }}>
                📅 Các lần hẹn đã đăng ký cho bước này:
              </div>
              <div style={{ background: '#fff', borderRadius: 8, padding: 0, marginBottom: 8 }}>
                {loadingAppointments ? (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin size="large" />
                  </div>
                ) : stepAppointments.length === 0 ? (
                  <div style={{
                    color: '#888',
                    textAlign: 'center',
                    padding: 20,
                    background: '#fff',
                    borderRadius: 8
                  }}>
                    Chưa có lịch hẹn nào cho bước này.
                  </div>
                ) : (
                  <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 0 }}>
                    {Array.isArray(stepAppointments) && stepAppointments.map((app, idx) => (
                      <Card key={app.id} size="small" style={{
                        marginBottom: 8,
                        background: '#f6faff',
                        border: '1px solid #e6f7ff',
                        position: 'relative',
                        borderRadius: 8
                      }}>
                        <Row gutter={[16, 8]}>
                          <Col span={16}>
                            <Row gutter={[16, 8]}>
                              <Col span={12}>
                                <div><b>Trạng thái:</b> <Tag color={app.status === 'CONFIRMED' ? 'blue' : app.status === 'COMPLETED' ? 'green' : app.status === 'CANCELLED' ? 'red' : 'orange'}>{getAppointmentStatusText(app.status)}</Tag></div>
                                <div><b>Ngày hẹn:</b> {app.appointmentDate}</div>
                                <div><b>Ca khám:</b> {app.shift === 'MORNING' ? 'Sáng' : app.shift === 'AFTERNOON' ? 'Chiều' : app.shift}</div>
                              </Col>
                              <Col span={12}>
                                <div><b>Ghi chú:</b> {app.notes || 'Không có'}</div>
                                <div><b>Bệnh nhân:</b> {app.customerName}</div>
                                <div><b>Mục đích:</b> {selectedStep.name}</div>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={8} style={{ textAlign: 'right' }}>
                            <Space direction="vertical" align="end">
                              <Button
                                type="primary"
                                style={{ background: '#fa8c16', borderColor: '#fa8c16', color: '#fff' }}
                                onClick={() => setStepAppointments(prev => Array.isArray(prev) ? prev.map((a, i) => i === idx ? { ...a, showStatusSelect: !a.showStatusSelect } : a) : [])}
                              >
                                Cập nhật trạng thái
                              </Button>
                              {app.showStatusSelect && (
                                <Select
                                  style={{ width: 160 }}
                                  value={app.status || undefined}
                                  onChange={(value) => handleAppointmentStatusUpdate(app.id, value, scheduleStep?.id)}
                                  options={statusOptions}
                                  styles={{ popup: { root: { zIndex: 2000 } } }}
                                />
                              )}
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: 24 }}>
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
                  icon={<CalendarOutlined />}
                  onClick={handleShowCreateAppointment}
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
        }}
        footer={null}
        width={500}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateStep}
        >
          <Form.Item
            name="scheduledDate"
            label="Ngày dự kiến"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="actualDate"
            label="Ngày thực hiện"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="PLANNED">Chờ xếp lịch</Select.Option>
              <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
              <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => {
                setEditingStep(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        title="Lịch hẹn của bước điều trị"
        open={showScheduleModal}
        onCancel={() => {
          setShowScheduleModal(false);
          setScheduleStep(null);
          scheduleForm.resetFields();
          setStepAppointments([]);
        }}
        footer={null}
        width={800}
        centered
      >
        <div style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 16 }}>
            📅 Các lần hẹn đã đăng ký cho bước này:
          </div>
          {loadingAppointments ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Spin size="large" />
            </div>
          ) : stepAppointments.length === 0 ? (
            <div style={{ 
              color: '#888', 
              textAlign: 'center', 
              padding: 20,
              background: '#f5f5f5',
              borderRadius: 8
            }}>
              Chưa có lịch hẹn nào cho bước này.
            </div>
          ) : (
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
              {Array.isArray(stepAppointments) && stepAppointments.map((app, idx) => (
                <Card key={app.id} size="small" style={{ 
                  marginBottom: 8, 
                  background: '#f6faff', 
                  border: '1px solid #e6f7ff', 
                  position: 'relative',
                  borderRadius: 8
                }}>
                  <Row gutter={[16, 8]}>
                    <Col span={16}>
                      <Row gutter={[16, 8]}>
                        <Col span={12}>
                          <div><b>Trạng thái:</b> <Tag color={app.status === 'CONFIRMED' ? 'blue' : app.status === 'COMPLETED' ? 'green' : app.status === 'CANCELLED' ? 'red' : 'orange'}>{getAppointmentStatusText(app.status)}</Tag></div>
                          <div><b>Ngày hẹn:</b> {app.appointmentDate}</div>
                          <div><b>Ca khám:</b> {app.shift === 'MORNING' ? 'Sáng' : app.shift === 'AFTERNOON' ? 'Chiều' : app.shift}</div>
                        </Col>
                        <Col span={12}>
                          <div><b>Ghi chú:</b> {app.notes || 'Không có'}</div>
                          <div><b>Bệnh nhân:</b> {app.customerName}</div>
                          <div><b>Mục đích:</b> {scheduleStep?.name}</div>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Space direction="vertical" align="end">
                        <Button
                          type="primary"
                          style={{ background: '#fa8c16', borderColor: '#fa8c16', color: '#fff' }}
                          onClick={() => setStepAppointments(prev => Array.isArray(prev) ? prev.map((a, i) => i === idx ? { ...a, showStatusSelect: !a.showStatusSelect } : a) : [])}
                        >
                          Cập nhật trạng thái
                        </Button>
                        {app.showStatusSelect && (
                          <Select
                            style={{ width: 160 }}
                            value={app.status || undefined}
                            onChange={(value) => handleAppointmentStatusUpdate(app.id, value, scheduleStep?.id)}
                            options={statusOptions}
                            styles={{ popup: { root: { zIndex: 2000 } } }}
                          />
                        )}
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          )}
          <Form
            form={scheduleForm}
            layout="vertical"
            onFinish={handleScheduleAppointment}
            initialValues={{
              shift: 'MORNING',
              treatmentStepId: scheduleStep?.id
            }}
            style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="treatmentStepId" label="Bước điều trị" rules={[{ required: true, message: 'Bắt buộc' }]}> 
                  <Select
                    showSearch
                    placeholder="Chọn bước điều trị"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                  >
                    {treatmentData?.treatmentSteps?.map(step => (
                      <Select.Option key={step.id} value={step.id}>{step.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="appointmentDate" label="Ngày hẹn" rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn' }]}> 
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="shift" label="Ca khám" rules={[{ required: true, message: 'Vui lòng chọn ca khám' }]}> 
                  <Select>
                    <Select.Option value="MORNING">Sáng</Select.Option>
                    <Select.Option value="AFTERNOON">Chiều</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="notes" label="Ghi chú">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                Tạo lịch hẹn
              </Button>
            </Form.Item>
          </Form>
        </div>
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
              shift: 'MORNING',
              treatmentStepId: selectedStep?.id
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Bước điều trị" required>
                  <Input value={selectedStep?.name} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="appointmentDate" label="Ngày hẹn" rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn' }]}> 
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="shift" label="Ca khám" rules={[{ required: true, message: 'Vui lòng chọn ca khám' }]}> 
                  <Select>
                    <Select.Option value="MORNING">Sáng</Select.Option>
                    <Select.Option value="AFTERNOON">Chiều</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="notes" label="Ghi chú">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name="treatmentStepId" initialValue={selectedStep?.id} hidden>
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                Tạo lịch hẹn
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default TreatmentStageDetails; 