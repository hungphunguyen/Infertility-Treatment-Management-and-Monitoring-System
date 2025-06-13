import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Timeline, Typography, Spin, message, Button, Tag, Space, Modal, Form, DatePicker, Input, Select, Row, Col, Avatar } from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { treatmentService } from '../../service/treatment.service';
import { authService } from '../../service/auth.service';
import dayjs from 'dayjs';

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

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await authService.getMyInfo();
        const id = res?.data?.result?.id;
        if (id) {
          setDoctorId(id);
        } else {
          message.error("Không thể lấy thông tin bác sĩ");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error);
        message.error("Không thể lấy thông tin bác sĩ");
        navigate(-1);
      }
    };
    fetchDoctorInfo();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) return;

      try {
        const { patientInfo } = location.state || {};
        if (!patientInfo) {
          message.error("Không tìm thấy thông tin bệnh nhân");
          navigate(-1);
          return;
        }

        const response = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        
        if (Array.isArray(response)) {
          const treatmentRecord = response.find(
            treatment => {
              const matches = treatment.id === patientInfo.id;
              const hasTreatmentSteps = treatment.treatmentSteps && treatment.treatmentSteps.length > 0;
              return matches && hasTreatmentSteps;
            }
          );

          if (!treatmentRecord) {
            message.warning("Chưa có thông tin quy trình điều trị cho bệnh nhân này");
            return;
          }

          setTreatmentData(treatmentRecord);
        }
      } catch (error) {
        console.error("Error fetching treatment data:", error);
        message.error("Không thể lấy thông tin điều trị");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId, location.state, navigate]);

  useEffect(() => {
    if (showScheduleModal && (!treatmentData?.customerId || !doctorId || !nextStep?.id)) {
      console.warn('Missing data for appointment:', {
        customerId: treatmentData?.customerId,
        doctorId,
        nextStepId: nextStep?.id
      });
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
        return "Chờ thực hiện";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
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
            if (values.status === 'COMPLETED') {
              const currentStepIndex = updatedRecord.treatmentSteps.findIndex(step => step.id === editingStep.id);
              if (currentStepIndex < updatedRecord.treatmentSteps.length - 1) {
                setNextStep(updatedRecord.treatmentSteps[currentStepIndex + 1]);
                setShowScheduleModal(true);
              }
            }
          }
        }
        setEditingStep(null);
        form.resetFields();
      }
    } catch (error) {
      console.error('Error updating treatment step:', error);
      message.error('Có lỗi xảy ra khi cập nhật');
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
    const payload = {
      treatmentStepId: Number(treatmentStepId),
      shift: values.shift,
      customerId: customerId,
      doctorId: doctorIdValue,
      appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
      purpose: values.purpose,
      notes: values.notes
    };
    if (!payload.treatmentStepId || !payload.customerId || !payload.doctorId) {
      message.error('Thiếu thông tin bắt buộc: treatmentStepId, customerId hoặc doctorId');
      return;
    }
    try {
      const response = await treatmentService.createAppointment(payload);
      if (response?.data?.code === 1000) {
        message.success('Đã tạo lịch hẹn thành công');
        setShowScheduleModal(false);
        setScheduleStep(null);
        scheduleForm.resetFields();
      } else {
        message.error(response?.data?.message || 'Không thể tạo lịch hẹn');
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch hẹn');
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
      const response = await treatmentService.updateAppointmentStatus(treatmentData.id, 'COMPLETED');
      
      if (response?.data?.code === 1000) {
        if (response?.data?.result) {
          const updatedTreatmentData = {
            ...treatmentData,
            ...response.data.result,
            status: 'COMPLETED'
          };
          setTreatmentData(updatedTreatmentData);
        }
      }
    } catch (error) {
      console.error("Error completing treatment:", error);
      message.error(`Lỗi: ${error.message || 'Không thể hoàn thành điều trị'}`);
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
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
          <Card style={{ marginBottom: '24px' }}>
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
                      <Tag icon={<CalendarOutlined />} color="cyan">
                        {dayjs(treatmentData.appointmentDate).format('DD/MM/YYYY')}
                      </Tag>
                    </Space>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card>
            <Timeline items={timelineItems} />

            {isAllStepsCompleted() && treatmentData.status !== 'COMPLETED' && (
              <Card style={{ marginTop: '24px', backgroundColor: '#f6ffed' }}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <Text strong>Tất cả các bước đã hoàn thành</Text>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />}
                    onClick={handleCompleteTreatment}
                    size="large"
                  >
                    Hoàn thành điều trị
                  </Button>
                </Space>
              </Card>
            )}
          </Card>
        </>
      ) : (
        <Card>
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
              <Select.Option value="PLANNED">Chờ thực hiện</Select.Option>
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
                  <Space direction="vertical" size={0} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <div>
                        <div><b>Trạng thái:</b> <Tag color={app.status === 'CONFIRMED' ? 'blue' : app.status === 'COMPLETED' ? 'green' : app.status === 'CANCELLED' ? 'red' : 'orange'}>{app.status === 'CONFIRMED' ? 'Đã xác nhận' : app.status === 'COMPLETED' ? 'Hoàn thành' : app.status === 'INPROGRESS' ? 'Đang thực hiện' : app.status === 'PLANNED' ? 'Chờ thực hiện' : app.status}</Tag></div>
                        <div><b>Ngày hẹn:</b> {app.appointmentDate}</div>
                        <div><b>Ca khám:</b> {app.shift === 'MORNING' ? 'Sáng' : app.shift === 'AFTERNOON' ? 'Chiều' : app.shift}</div>
                        <div><b>Mục đích:</b> {app.purpose}</div>
                        <div><b>Ghi chú:</b> {app.notes}</div>
                        <div><b>Bác sĩ:</b> {app.doctorName}</div>
                        <div><b>Bệnh nhân:</b> {app.customerName}</div>
                        <div><b>Dịch vụ:</b> {app.serviceName}</div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        {app.status !== 'COMPLETED' && app.status !== 'CANCELLED' && (
                          <Select
                            style={{ width: 140, marginRight: 8 }}
                            value={app.status === 'INPROGRESS' ? 'INPROGRESS' : app.status === 'CONFIRMED' ? 'CONFIRMED' : 'PLANNED'}
                            onChange={async (value) => {
                              // Gọi API cập nhật trạng thái appointment
                              try {
                                const res = await treatmentService.updateAppointmentStatus(app.id, value);
                                if (res?.data?.code === 1000) {
                                  message.success('Cập nhật trạng thái thành công');
                                  // Cập nhật lại danh sách lịch hẹn
                                  const refreshed = await treatmentService.getAppointmentsByStepId(scheduleStep.id);
                                  setStepAppointments(refreshed?.data?.result || []);
                                } else {
                                  message.error(res?.data?.message || 'Cập nhật thất bại');
                                }
                              } catch (err) {
                                message.error('Có lỗi khi cập nhật trạng thái');
                              }
                            }}
                            options={[
                              { value: 'INPROGRESS', label: 'Đang thực hiện' },
                              { value: 'COMPLETED', label: 'Hoàn thành' },
                            ]}
                          />
                        )}
                        {app.status !== 'COMPLETED' && app.status !== 'CANCELLED' && (
                          <Button
                            type="primary"
                            style={{ background: '#fa8c16', borderColor: '#fa8c16', color: '#fff', float: 'right' }}
                            onClick={async () => {
                              // Gọi API cập nhật trạng thái sang giá trị đã chọn (nếu có)
                              let newStatus = 'INPROGRESS';
                              if (app.status === 'INPROGRESS') newStatus = 'COMPLETED';
                              try {
                                const res = await treatmentService.updateAppointmentStatus(app.id, newStatus);
                                if (res?.data?.code === 1000) {
                                  message.success('Cập nhật trạng thái thành công');
                                  const refreshed = await treatmentService.getAppointmentsByStepId(scheduleStep.id);
                                  setStepAppointments(refreshed?.data?.result || []);
                                } else {
                                  message.error(res?.data?.message || 'Cập nhật thất bại');
                                }
                              } catch (err) {
                                message.error('Có lỗi khi cập nhật trạng thái');
                              }
                            }}
                          >
                            {app.status === 'INPROGRESS' ? 'Đánh dấu hoàn thành' : 'Bắt đầu thực hiện'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Space>
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
            <Form.Item name="purpose" label="Mục đích">
              <Input />
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