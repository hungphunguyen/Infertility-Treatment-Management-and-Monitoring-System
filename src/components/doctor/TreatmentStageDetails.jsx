import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Timeline, Typography, Spin, Button, Tag, Space, Modal, Form, DatePicker, Input, Select, Row, Col, Avatar } from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined, MedicineBoxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { treatmentService } from '../../service/treatment.service';
import { authService } from '../../service/auth.service';
import dayjs from 'dayjs';
import { NotificationContext } from "../../App";

const { Title, Text } = Typography;
const { TextArea } = Input;

const TreatmentStageDetails = () => {
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
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

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
        // console.error("Error fetching doctor info:", error);
        showNotification("Không thể lấy thông tin bác sĩ", "error");
        navigate(-1);
      }
    };
    fetchDoctorInfo();
  }, [navigate, showNotification]);

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) return;

      try {
        const { patientInfo, treatmentData: passedTreatmentData } = location.state || {};
        if (!patientInfo) {
          showNotification("Không tìm thấy thông tin bệnh nhân", "warning");
          navigate(-1);
          return;
        }

        // console.log('Patient info:', patientInfo);
        // console.log('Passed treatment data:', passedTreatmentData);

        // Nếu có treatment data được truyền qua, kiểm tra và sử dụng
        if (passedTreatmentData) {
          // Luôn hiển thị đúng treatmentData được truyền vào, kể cả COMPLETED hoặc CANCELLED
          setTreatmentData(passedTreatmentData);
          setLoading(false);
          return;
        }

        // Nếu không có treatment data, fetch từ API
        const response = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        if (Array.isArray(response)) {
          // Lọc ra các treatment không bị hủy và sắp xếp theo ngày tạo mới nhất
          const activeTreatments = response
            .filter(treatment => 
              treatment.customerId === patientInfo.customerId && 
              treatment.status !== 'CANCELLED'
            )
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

          if (activeTreatments.length === 0) {
            showNotification("Không tìm thấy thông tin quy trình điều trị đang hoạt động", "warning");
            setLoading(false);
            return;
          }

          // Lấy treatment mới nhất
          const latestTreatment = activeTreatments[0];
          setTreatmentData(latestTreatment);
        }
      } catch (error) {
        // console.error("Error fetching treatment data:", error);
        showNotification("Không thể lấy thông tin điều trị", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId, location.state, navigate, showNotification]);

  useEffect(() => {
    if (showScheduleModal && (!treatmentData?.customerId || !doctorId || !nextStep?.id)) {
      // console.warn('Missing data for appointment:', {
      //   customerId: treatmentData?.customerId,
      //   doctorId,
      //   nextStepId: nextStep?.id
      // });
    }
  }, [showScheduleModal, treatmentData, doctorId, nextStep]);

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "blue";
      case "PLANNED":
        return "default";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "default";
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

    try {
      const response = await treatmentService.updateTreatmentStep(editingStep.id, {
        scheduledDate: values.scheduledDate?.format('YYYY-MM-DD'),
        actualDate: values.actualDate?.format('YYYY-MM-DD'),
        status: values.status,
        notes: values.notes
      });

      if (response?.code === 1000) {
        const updatedResponse = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        if (Array.isArray(updatedResponse)) {
          const updatedRecord = updatedResponse.find(record => record.id === treatmentData.id);
          if (updatedRecord) {
            setTreatmentData(updatedRecord);
          }
        }
        setEditingStep(null);
        form.resetFields();
      }
    } catch (error) {
      // console.error('Error updating treatment step:', error);
      showNotification('Có lỗi xảy ra khi cập nhật', 'error');
    }
  };

  const showScheduleModalForStep = async (step) => {
    setScheduleStep(step);
    setShowCreateForm(false);
    scheduleForm.resetFields();
    setShowScheduleModal(true);
    setLoadingAppointments(true);
    try {
      const res = await treatmentService.getAppointmentsByStepId(step.id);
      if (res?.data?.code === 1000 && Array.isArray(res.data.result)) {
        setStepAppointments(res.data.result);
      } else {
        setStepAppointments([]);
      }
    } catch (err) {
      setStepAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleScheduleAppointment = async (values) => {
    const treatmentStepId = values.treatmentStepId || scheduleStep?.id;
    const customerId = treatmentData?.customerId;
    const doctorIdValue = doctorId;
    const stepName = treatmentData?.treatmentSteps?.find(step => step.id === treatmentStepId)?.name || '';
    const payload = {
      treatmentStepId: Number(treatmentStepId),
      shift: values.shift,
      customerId: customerId,
      doctorId: doctorIdValue,
      appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
      purpose: stepName,
      notes: values.notes
    };
    if (!payload.treatmentStepId || !payload.customerId || !payload.doctorId) {
      showNotification('Thiếu thông tin bắt buộc: treatmentStepId, customerId hoặc doctorId', 'error');
      return;
    }
    try {
      const response = await treatmentService.createAppointment(payload);
      if (response?.data?.code === 1000) {
        showNotification('Đã tạo lịch hẹn thành công', 'success');
        setShowScheduleModal(false);
        setScheduleStep(null);
        scheduleForm.resetFields();
      } else {
        showNotification(response?.data?.message || 'Không thể tạo lịch hẹn', 'error');
      }
    } catch (error) {
      showNotification(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch hẹn', 'error');
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
      const response = await treatmentService.updateTreatmentStatus(treatmentData.id, 'COMPLETED');
      if (!response) {
        showNotification('Không nhận được phản hồi từ API', 'error');
        return;
      }
      if (response?.data?.code === 1000) {
        showNotification('Đã hoàn thành điều trị thành công!', 'success');
        // Cập nhật lại dữ liệu
        const updatedResponse = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        if (Array.isArray(updatedResponse)) {
          const updatedRecord = updatedResponse.find(record => record.id === treatmentData.id);
          if (updatedRecord) {
            setTreatmentData(updatedRecord);
          }
        }
      } else {
        showNotification(response?.data?.message || 'Không thể cập nhật trạng thái điều trị', 'error');
      }
    } catch (error) {
      showNotification('Có lỗi xảy ra khi hoàn thành điều trị', 'error');
    }
  };

  const isAllStepsCompleted = () => {
    return treatmentData?.treatmentSteps?.every(step => step.status === 'COMPLETED');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const timelineItems = treatmentData?.treatmentSteps?.map((step) => ({
    key: step.id,
    color: getStatusColor(step.status),
    children: (
      <div style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Text strong style={{ fontSize: '16px' }}>
              {step.name}
            </Text>
            <Button 
              type="primary" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => showEditModal(step)}
            >
              Cập nhật
            </Button>
            <Button
              type="default"
              size="small"
              style={{ marginLeft: 8 }}
              onClick={() => showScheduleModalForStep(step)}
            >
              Tạo lịch hẹn
            </Button>
          </Space>
          <Tag color={getStatusColor(step.status)}>
            {getStatusText(step.status)}
          </Tag>
          {step.scheduledDate && (
            <Text type="secondary" style={{ display: 'block' }}>
              Ngày dự kiến: {dayjs(step.scheduledDate).format('DD/MM/YYYY')}
            </Text>
          )}
          {step.actualDate && (
            <Text type="secondary" style={{ display: 'block' }}>
              Ngày thực hiện: {dayjs(step.actualDate).format('DD/MM/YYYY')}
            </Text>
          )}
          {step.notes && (
            <Text type="secondary" style={{ display: 'block' }}>
              Ghi chú: {step.notes}
            </Text>
          )}
        </Space>
      </div>
    ),
  }));

  return (
    <div style={{ padding: '32px 0', maxWidth: '900px', margin: '0 auto' }}>
      <Card style={{ marginBottom: '24px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
              style={{ borderRadius: 8 }}
            >
              Quay lại
            </Button>
          </Col>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>Chi tiết quy trình điều trị</Title>
          </Col>
        </Row>
      </Card>

      {treatmentData ? (
        <>
          <Card style={{ marginBottom: '24px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Space align="start">
                  <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  <div>
                    <Title level={4} style={{ margin: 0 }}>{treatmentData.customerName}</Title>
                    <Space>
                      <Tag icon={<MedicineBoxOutlined />} color="blue">
                        {treatmentData.treatmentServiceName}
                      </Tag>
                      
                    </Space>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Timeline
              items={timelineItems}
              style={{ marginBottom: 32 }}
            />

            {isAllStepsCompleted() && treatmentData.status !== 'COMPLETED' && (
              <Card style={{ marginTop: '24px', backgroundColor: '#f6ffed', borderRadius: 10, border: '1px solid #b7eb8f', textAlign: 'center' }}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <Text strong style={{ color: '#389e0d', fontSize: 18 }}>Tất cả các bước đã hoàn thành</Text>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleCompleteTreatment}
                    size="large"
                    style={{ background: '#52c41a', borderColor: '#52c41a', borderRadius: 8, minWidth: 220, fontWeight: 600, fontSize: 16 }}
                  >
                    Hoàn thành điều trị
                  </Button>
                </Space>
              </Card>
            )}
          </Card>
        </>
      ) : (
        <Card style={{ borderRadius: 12, textAlign: 'center' }}>
          <Title level={4}>Không tìm thấy thông tin điều trị</Title>
          <Text>Vui lòng kiểm tra lại thông tin bệnh nhân hoặc thử lại sau.</Text>
        </Card>
      )}

      <Modal
        title="Cập nhật thông tin điều trị"
        open={!!editingStep}
        onCancel={() => {
          setEditingStep(null);
          form.resetFields();
        }}
        footer={null}
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

      <Modal
        title="Lịch hẹn của bước điều trị"
        open={showScheduleModal}
        onCancel={() => {
          setShowScheduleModal(false);
          setScheduleStep(null);
          setShowCreateForm(false);
          scheduleForm.resetFields();
          setStepAppointments([]);
        }}
        footer={null}
        width={800}
      >
        <div style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Các lần hẹn đã đăng ký cho bước này:</div>
          {loadingAppointments ? (
            <Spin size="small" />
          ) : stepAppointments.length === 0 ? (
            <div style={{ color: '#888' }}>Chưa có lịch hẹn nào cho bước này.</div>
          ) : (
            <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 8 }}>
              {stepAppointments.map((app, idx) => (
                <Card key={app.id} size="small" style={{ marginBottom: 8, background: '#f6faff', border: '1px solid #e6f7ff', position: 'relative' }}>
                  <Row gutter={[16, 8]}>
                    <Col span={16}>
                      <Row gutter={[16, 8]}>
                        <Col span={12}>
                          <div><b>Trạng thái:</b> <Tag color={app.status === 'CONFIRMED' ? 'blue' : app.status === 'COMPLETED' ? 'green' : app.status === 'CANCELLED' ? 'red' : 'orange'}>{getAppointmentStatusText(app.status)}</Tag></div>
                          <div><b>Ngày hẹn:</b> {app.appointmentDate}</div>
                          <div><b>Ca khám:</b> {app.shift === 'MORNING' ? 'Sáng' : app.shift === 'AFTERNOON' ? 'Chiều' : app.shift}</div>
                        </Col>
                        <Col span={12}>
                          <div><b>Ghi chú:</b> {app.notes}</div>
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
                          onClick={() => setStepAppointments(prev => prev.map((a, i) => i === idx ? { ...a, showStatusSelect: !a.showStatusSelect } : a))}
                        >
                          Cập nhật trạng thái
                        </Button>
                        {app.showStatusSelect && (
                          <Select
                            style={{ width: 160 }}
                            value={app.status}
                            onChange={async (value) => {
                              try {
                                const res = await treatmentService.updateAppointmentStatus(app.id, value);
                                if (res?.data?.code === 1000) {
                                  showNotification('Cập nhật trạng thái thành công', 'success');
                                  const refreshed = await treatmentService.getAppointmentsByStepId(scheduleStep.id);
                                  setStepAppointments(refreshed?.data?.result || []);
                                } else {
                                  showNotification(res?.data?.message || 'Cập nhật thất bại', 'error');
                                }
                              } catch (err) {
                                showNotification('Có lỗi khi cập nhật trạng thái', 'error');
                              }
                            }}
                            options={statusOptions}
                            dropdownStyle={{ zIndex: 2000 }}
                          />
                        )}
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'right' }}>
            {!showCreateForm && (
              <Button type="primary" onClick={() => setShowCreateForm(true)}>
                Tạo lịch hẹn mới
              </Button>
            )}
          </div>
        </div>
        {showCreateForm && (
          <Form
            form={scheduleForm}
            layout="vertical"
            onFinish={handleScheduleAppointment}
            initialValues={{
              shift: 'MORNING',
              treatmentStepId: scheduleStep?.id
            }}
            style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16, minWidth: 500, maxWidth: 700, width: '100%' }}
          >
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
            <Form.Item name="appointmentDate" label="Ngày hẹn" rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn' }]}> 
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="shift" label="Ca khám" rules={[{ required: true, message: 'Vui lòng chọn ca khám' }]}> 
              <Select>
                <Select.Option value="MORNING">Sáng</Select.Option>
                <Select.Option value="AFTERNOON">Chiều</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="notes" label="Ghi chú">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Tạo lịch hẹn
                </Button>
                <Button onClick={() => {
                  setShowCreateForm(false);
                  scheduleForm.resetFields();
                }}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default TreatmentStageDetails; 