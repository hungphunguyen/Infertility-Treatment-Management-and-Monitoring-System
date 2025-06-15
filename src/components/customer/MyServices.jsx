import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Tag, Typography, Row, Col, Statistic, 
  Timeline, Modal, Descriptions, Spin, message, Button 
} from 'antd';
import { 
  ExperimentOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { treatmentService } from '../../service/treatment.service';
import { authService } from '../../service/auth.service';

const { Title, Text } = Typography;

const MyServices = () => {
  const [loading, setLoading] = useState(true);
  const [treatmentRecords, setTreatmentRecords] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statistics, setStatistics] = useState({
    totalServices: 0,
    completedServices: 0,
    inProgressServices: 0,
    pendingServices: 0
  });
  const [cancelLoading, setCancelLoading] = useState({});
  const [userId, setUserId] = useState(null);
  const [appointments, setAppointments] = useState([]);

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
      console.log('User Info Response:', userResponse);
      
      if (!userResponse?.data?.result?.id) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }

      const customerId = userResponse.data.result.id;
      const response = await treatmentService.getTreatmentRecordsByCustomer(customerId);
      console.log('Treatment Records Response:', response);
      console.log('Treatment Records Data:', response?.data?.result);
      
      if (response?.data?.result) {
        const records = response.data.result;
        console.log('First Record Full Structure:', JSON.stringify(records[0], null, 2));
        
        setTreatmentRecords(records);

        // Tính toán thống kê
        const stats = {
          totalServices: records.length,
          completedServices: records.filter(r => r.status === 'Completed').length,
          inProgressServices: records.filter(r => r.status === 'InProgress').length,
          pendingServices: records.filter(r => r.status === 'Pending').length
        };
        setStatistics(stats);
      }
    } catch (error) {
      console.error('Error fetching treatment records:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status, progress) => {
    // Nếu có progress, ưu tiên hiển thị trạng thái dựa trên progress
    if (progress !== undefined) {
      if (progress === '0%') {
        if (status === 'CANCELLED' || status === 'Cancelled') {
          return <Tag color="error">Đã hủy</Tag>;
        }
        return <Tag color="warning">Đang chờ điều trị</Tag>;
      } else if (progress === '100%') {
        return <Tag color="success">Hoàn thành</Tag>;
      } else {
        return <Tag color="processing">Đang điều trị</Tag>;
      }
    }

    // Nếu không có progress, sử dụng status
    const statusMap = {
      'Completed': { color: 'success', text: 'Hoàn thành' },
      'InProgress': { color: 'processing', text: 'Đang điều trị' },
      'Pending': { color: 'warning', text: 'Đang chờ điều trị' },
      'Cancelled': { color: 'error', text: 'Đã hủy' },
      'CANCELLED': { color: 'error', text: 'Đã hủy' }
    };

    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  const calculateEstimatedEndDate = (startDate, treatmentSteps) => {
    if (!startDate) return null;
    
    // Nếu có endDate từ API thì sử dụng
    if (selectedService?.endDate) {
      return selectedService.endDate;
    }
    
    // Nếu không có endDate, tính toán dựa trên ngày bắt đầu
    // Thêm 45 ngày cho toàn bộ quá trình điều trị
    return dayjs(startDate).add(45, 'days').format('YYYY-MM-DD');
  };

  const handleCancelTreatment = async (record) => {
    if (!userId) return;
    setCancelLoading(l => ({ ...l, [record.id]: true }));
    try {
      await treatmentService.cancelTreatmentRecord(record.id, userId);
      message.success('Yêu cầu hủy hồ sơ điều trị đã được gửi.');
      fetchTreatmentRecords();
    } catch (err) {
      message.error(err?.response?.data?.message || 'Không thể hủy hồ sơ điều trị này.');
    } finally {
      setCancelLoading(l => ({ ...l, [record.id]: false }));
    }
  };

  const columns = [
    {
      title: 'Gói điều trị',
      dataIndex: 'treatmentServiceName',
      key: 'treatmentServiceName',
      render: (text) => <span>{text || 'N/A'}</span>
    },
    {
      title: 'Bác sĩ phụ trách',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (text) => <span>{text || 'N/A'}</span>
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => <span>{text ? new Date(text).toLocaleDateString('vi-VN') : 'N/A'}</span>
    },
    
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const totalSteps = record.treatmentSteps?.length || 0;
        if (!totalSteps || record.treatmentSteps[0]?.status !== 'COMPLETED') {
          return getStatusTag(status, '0%');
        }
        const completedSteps = record.treatmentSteps?.filter(step => step.status === 'COMPLETED').length || 0;
        const progress = Math.round((completedSteps / totalSteps) * 100);
        return getStatusTag(status, `${progress}%`);
      }
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (_, record) => {
        const totalSteps = record.treatmentSteps?.length || 0;
        if (!totalSteps || record.treatmentSteps[0]?.status !== 'COMPLETED') {
          return '0%';
        }
        const completedSteps = record.treatmentSteps?.filter(step => step.status === 'COMPLETED').length || 0;
        const progress = Math.round((completedSteps / totalSteps) * 100);
        return `${progress}%`;
      }
    },
    {
      title: 'Yêu cầu hủy',
      key: 'cancel',
      render: (_, record) => (
        <Button
          danger
          loading={!!cancelLoading[record.id]}
          onClick={e => { e.stopPropagation(); handleCancelTreatment(record); }}
          disabled={!userId || record.status === 'Cancelled'}
        >
          Hủy tuyến trình
        </Button>
      )
    }
  ];

  const handleViewDetails = async (record) => {
    setSelectedService(record);
    setModalVisible(true);
    // Lấy lịch hẹn thực tế cho customerId
    if (record.customerId) {
      try {
        const res = await treatmentService.getCustomerAppointments(record.customerId);
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={4} style={{ marginBottom: 24 }}>Dịch vụ của tôi</Title>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số dịch vụ"
              value={statistics.totalServices}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={statistics.completedServices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang thực hiện"
              value={statistics.inProgressServices}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={statistics.pendingServices}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng dịch vụ */}
      <Card>
        <Table
          columns={columns}
          dataSource={treatmentRecords}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Tổng số ${total} dịch vụ`
          }}
          onRow={(record) => ({
            onClick: () => handleViewDetails(record),
            style: { cursor: 'pointer' }
          })}
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
                  const totalSteps = selectedService.treatmentSteps?.length || 0;
                  if (!totalSteps || selectedService.treatmentSteps[0]?.status !== 'COMPLETED') {
                    return getStatusTag(selectedService.status, '0%');
                  }
                  const completedSteps = selectedService.treatmentSteps?.filter(step => step.status === 'COMPLETED').length || 0;
                  const progress = Math.round((completedSteps / totalSteps) * 100);
                  return getStatusTag(selectedService.status, `${progress}%`);
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {selectedService.startDate ? new Date(selectedService.startDate).toLocaleDateString('vi-VN') : 'N/A'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày tạo">
                {selectedService.createdDate ? new Date(selectedService.createdDate).toLocaleDateString('vi-VN') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                {selectedService.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Descriptions.Item>
            </Descriptions>

            {/* Treatment Timeline */}
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Tiến trình điều trị:</Title>
              <Timeline>
                {selectedService.treatmentSteps?.map((step, index) => {
                  // Tìm appointment thực tế cho step này
                  const appointment = appointments.find(app => app.purpose === step.name);
                  // Lấy ngày và trạng thái thực tế nếu có
                  const displayDate = appointment?.appointmentDate || step.scheduledDate;
                  const displayStatus = appointment?.status || step.status;
                  const statusMap = {
                    CONFIRMED: { color: 'blue', text: 'Đã xác nhận' },
                    PLANNED: { color: 'orange', text: 'Chờ thực hiện' },
                    COMPLETED: { color: 'green', text: 'Hoàn thành' },
                    CANCELLED: { color: 'red', text: 'Đã hủy' },
                    INPROGRESS: { color: 'blue', text: 'Đang thực hiện' },
                    IN_PROGRESS: { color: 'blue', text: 'Đang thực hiện' },
                  };
                  const s = statusMap[displayStatus] || { color: 'default', text: displayStatus };
                  return (
                    <Timeline.Item 
                      key={index}
                      color={s.color}
                    >
                      <Text strong>
                        {displayDate ? new Date(displayDate).toLocaleDateString('vi-VN') : 'Chưa lên lịch'} - {step.name}
                      </Text>
                      <br />
                      <Text type="secondary">
                        {s.text}
                      </Text>
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
    </div>
  );
};

export default MyServices; 