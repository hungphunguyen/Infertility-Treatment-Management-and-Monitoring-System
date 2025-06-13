import React, { useState, useEffect } from 'react';
import { 
  Card, Steps, Row, Col, Typography, Descriptions, Tag, 
  Timeline, Space, Divider, Progress, Collapse, Spin, message, Button, Modal
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
  ExperimentOutlined as TestTubeIcon
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { treatmentService } from '../../service/treatment.service';
import { authService } from '../../service/auth.service';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const TreatmentProgress = () => {
  const [loading, setLoading] = useState(true);
  const [treatmentData, setTreatmentData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Lấy thông tin user từ API
      const userResponse = await authService.getMyInfo();
      console.log('User Info Response:', userResponse);
      
      if (!userResponse?.data?.result?.id) {
        message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      const customerId = userResponse.data.result.id;
      // Lấy danh sách điều trị của customer
      const response = await treatmentService.getTreatmentRecordsByCustomer(customerId);
      console.log('Treatment Records Response:', response);
      
      if (response?.data?.code === 1000 && Array.isArray(response.data.result) && response.data.result.length > 0) {
        // Lọc ra các dịch vụ không bị hủy và sắp xếp theo ngày tạo mới nhất
        const activeTreatments = response.data.result
          .filter(treatment => treatment.status !== 'CANCELLED')
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

        if (activeTreatments.length === 0) {
          setError('Không tìm thấy thông tin điều trị đang hoạt động');
          return;
        }

        const currentTreatment = activeTreatments[0]; // Lấy dịch vụ mới nhất
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
          nextAppointment: currentTreatment.treatmentSteps.find(step => step.status === 'PLANNED')?.scheduledDate || 
                          dayjs(currentTreatment.startDate).add(7, 'days').format('YYYY-MM-DD'),
          overallProgress: overallProgress,
          phases: currentTreatment.treatmentSteps.map((step, index) => ({
            id: step.id,
            name: step.name,
            statusRaw: step.status,
            status: step.status === 'COMPLETED' ? 'completed' :
                   step.status === 'IN_PROGRESS' ? 'in-progress' :
                   step.status === 'CONFIRMED' ? 'confirmed' :
                   step.status === 'PLANNED' ? 'not-started' : 'not-started',
            displayDate: index === 0 ? step.scheduledDate : (step.actualDate || step.scheduledDate),
            hasDate: !!(index === 0 || step.actualDate || step.scheduledDate),
            startDate: step.scheduledDate,
            endDate: step.actualDate,
            activities: [
              {
                name: step.name,
                date: step.scheduledDate,
                status: step.status === 'COMPLETED' ? 'completed' :
                       step.status === 'IN_PROGRESS' ? 'in-progress' :
                       step.status === 'CONFIRMED' ? 'confirmed' :
                       step.status === 'PLANNED' ? 'upcoming' : 'upcoming',
                notes: step.notes || 'Đang chờ thực hiện'
              }
            ]
          }))
        });
      } else {
        setError('Không tìm thấy thông tin điều trị');
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

  // Get status for Steps component
  const getStepStatus = (phaseStatus) => {
    switch (phaseStatus) {
      case "completed":
        return "finish";
      case "in-progress":
        return "process";
      case "not-started":
        return "wait";
      default:
        return "wait";
    }
  };

  // Get status tag with color
  const getStatusTag = (status) => {
    const statusMap = {
      completed: { color: "green", text: "Hoàn thành" },
      "in-progress": { color: "blue", text: "Đang điều trị" },
      "not-started": { color: "default", text: "Chưa bắt đầu" },
      upcoming: { color: "orange", text: "Sắp tới" },
      // Thêm mapping cho trạng thái từ API
      "Completed": { color: "green", text: "Hoàn thành" },
      "InProgress": { color: "blue", text: "Đang điều trị" },
      "Pending": { color: "orange", text: "Đang chờ điều trị" },
      "Cancelled": { color: "red", text: "Đã hủy" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  // Hàm getStepStatusTag: mapping trạng thái tiếng Việt + màu
  const getStepStatusTag = (status) => {
    const map = {
      'CONFIRMED': { color: 'blue', text: 'Đang điều trị' },
      'IN_PROGRESS': { color: 'blue', text: 'Đang điều trị' },
      'COMPLETED': { color: 'green', text: 'Hoàn thành' },
      'PLANNED': { color: 'orange', text: 'Đang chờ điều trị' },
      'CANCELLED': { color: 'red', text: 'Đã hủy' }
    };
    const { color, text } = map[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  const renderActivities = (activities) => {
    return activities.map((activity, index) => (
      <Timeline.Item 
        key={index} 
        color={
          activity.status === 'completed' ? 'green' : 
          activity.status === 'in-progress' ? 'blue' : 
          activity.status === 'upcoming' ? 'orange' : 'gray'
        }
      >
        <div>
          <Space>
            <Text strong>{activity.name}</Text>
            {getStatusTag(activity.status)}
          </Space>
          <div>
            <CalendarOutlined style={{ marginRight: 8 }} />
            <Text>{dayjs(activity.date).format("DD/MM/YYYY")}</Text>
          </div>
          {activity.notes && (
            <div style={{ color: '#666', marginTop: 4 }}>
              {activity.notes}
            </div>
          )}
        </div>
      </Timeline.Item>
    ));
  };

  // Render each phase for collapse panel
  const renderPhases = () => {
    return treatmentData && treatmentData.phases && treatmentData.phases.map((phase, idx) => (
      <Panel 
        header={
          <Space>
            <Text strong>{phase.name}</Text>
            {getStepStatusTag(phase.statusRaw)}
          </Space>
        } 
        key={phase.id}
      >
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="Trạng thái">
            {getStepStatusTag(phase.statusRaw)}
          </Descriptions.Item>
          {/* Chỉ hiển thị ngày cho giai đoạn đầu tiên hoặc khi có actualDate/scheduledDate */}
          {(idx === 0 || phase.hasDate) && (
            <Descriptions.Item label="Ngày khám">
              {phase.displayDate ? dayjs(phase.displayDate).format("DD/MM/YYYY") : '-'}
            </Descriptions.Item>
          )}
        </Descriptions>
        {phase.activities.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Text strong>Các hoạt động:</Text>
            <Timeline style={{ marginTop: 16 }}>
              {renderActivities(phase.activities)}
            </Timeline>
          </div>
        )}
        {phase.activities.length === 0 && (
          <div style={{ marginTop: 16, color: '#666' }}>
            Chưa có hoạt động được lên lịch
          </div>
        )}
      </Panel>
    ));
  };

  const totalSteps = treatmentData && treatmentData.phases ? treatmentData.phases.length : 0;
  const completedSteps = treatmentData && treatmentData.phases ? treatmentData.phases.filter(phase => phase.statusRaw === 'COMPLETED').length : 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const currentPhaseIdx = treatmentData && typeof treatmentData.currentPhase === 'number' ? treatmentData.currentPhase - 1 : -1;
  const currentPhase = treatmentData && treatmentData.phases && currentPhaseIdx >= 0 && treatmentData.phases.length > currentPhaseIdx
    ? treatmentData.phases[currentPhaseIdx]
    : null;

  // Handler for step click
  const handleStepClick = (phase) => {
    setSelectedPhase(phase);
    setModalOpen(true);
  };

  // Hàm lấy trạng thái tổng thể
  const getOverallStatus = (status, progress) => {
    if (status === 'cancelled' && progress === 0) {
      return { text: 'Đã hủy', color: 'error' };
    }
    if (progress === 0) {
      return { text: 'Đang chờ điều trị', color: 'warning' };
    }
    if (progress === 100) {
      return { text: 'Hoàn thành', color: 'success' };
    }
    return { text: 'Đang điều trị', color: 'processing' };
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
              {(() => {
                const { text, color } = getOverallStatus(treatmentData.status, progress);
                return <Tag color={color}>{text}</Tag>;
              })()}
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
                    {currentPhase ? currentPhase.activities[0]?.notes : 'Chuẩn bị thăm khám ban đầu'}
                  </div>
                </div>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Hàm render treatment steps
  const renderTreatmentSteps = () => (
    <Card 
      title={
        <Space>
          <DeploymentUnitOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <span>Quy trình điều trị</span>
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
      <Steps
        current={currentPhaseIdx >= 0 ? currentPhaseIdx : 0}
        items={treatmentData.phases.map((phase, idx) => {
          let color = '#d9d9d9';
          if (phase.status === 'completed') color = '#52c41a';
          else if (phase.status === 'in-progress' || phase.statusRaw === 'IN_PROGRESS' || phase.statusRaw === 'CONFIRMED') color = '#1890ff';
          else if (phase.statusRaw === 'CANCELLED') color = '#ff4d4f';
          else if (phase.status === 'not-started') color = '#faad14';

          return {
            title: (
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => handleStepClick(phase)}
              >
                <span style={{ display: 'block', marginBottom: 2 }}>
                  {phase.status === 'completed' ? (
                    <CheckIcon style={{ fontSize: 18, color }} />
                  ) : (
                    <TestTubeIcon style={{ color, fontSize: 18 }} />
                  )}
                </span>
                <span style={{ 
                  fontSize: 13,
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  color,
                  transition: 'all 0.3s ease'
                }}>
                  {phase.name}
                </span>
              </div>
            ),
            status: getStepStatus(phase.status),
          };
        })}
        direction="horizontal"
        size="small"
        responsive={true}
        style={{ padding: '20px 0' }}
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
        <Title level={4} style={{ margin: 0 }}>Tiến độ điều trị</Title>
      </div>

      {renderTreatmentOverview()}
      {renderTreatmentSteps()}
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
            {selectedPhase.displayDate && <p><b>Ngày khám:</b> {selectedPhase.displayDate}</p>}
            {selectedPhase.activities && selectedPhase.activities[0]?.notes && <p><b>Ghi chú:</b> {selectedPhase.activities[0].notes}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TreatmentProgress; 