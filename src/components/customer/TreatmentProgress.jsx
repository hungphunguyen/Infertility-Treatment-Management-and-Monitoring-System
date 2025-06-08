import React, { useState, useEffect } from 'react';
import { 
  Card, Steps, Row, Col, Typography, Descriptions, Tag, 
  Timeline, Space, Divider, Progress, Collapse, Spin, message
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
        const currentTreatment = response.data.result[0];
        const totalSteps = currentTreatment.treatmentSteps.length;
        const completedSteps = currentTreatment.treatmentSteps.filter(step => step.status === 'CONFIRMED').length;
        const overallProgress = Math.round((completedSteps / totalSteps) * 100);

        setTreatmentData({
          id: currentTreatment.id,
          type: currentTreatment.treatmentServiceName,
          startDate: currentTreatment.startDate,
          currentPhase: currentTreatment.treatmentSteps.findIndex(step => step.status === 'CONFIRMED') + 1,
          doctor: currentTreatment.doctorName,
          status: currentTreatment.status.toLowerCase(),
          estimatedCompletion: currentTreatment.endDate || dayjs(currentTreatment.startDate).add(45, 'days').format('YYYY-MM-DD'),
          nextAppointment: currentTreatment.treatmentSteps.find(step => step.status === 'PLANNED')?.scheduledDate || 
                          dayjs(currentTreatment.startDate).add(7, 'days').format('YYYY-MM-DD'),
          overallProgress: overallProgress,
          phases: currentTreatment.treatmentSteps.map((step, index) => ({
            id: step.id,
            name: step.name,
            status: step.status === 'CONFIRMED' ? 'completed' :
                   step.status === 'IN_PROGRESS' ? 'in-progress' :
                   step.status === 'PLANNED' ? 'not-started' : 'not-started',
            startDate: step.scheduledDate || dayjs(currentTreatment.startDate).add(index * 7, 'days').format('YYYY-MM-DD'),
            endDate: step.actualDate || dayjs(currentTreatment.startDate).add((index + 1) * 7, 'days').format('YYYY-MM-DD'),
            activities: [
              {
                name: step.name,
                date: step.scheduledDate || dayjs(currentTreatment.startDate).add(index * 7, 'days').format('YYYY-MM-DD'),
                status: step.status === 'CONFIRMED' ? 'completed' :
                       step.status === 'IN_PROGRESS' ? 'in-progress' :
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
      "in-progress": { color: "blue", text: "Đang thực hiện" },
      "not-started": { color: "default", text: "Chưa bắt đầu" },
      upcoming: { color: "orange", text: "Sắp tới" },
      // Thêm mapping cho trạng thái từ API
      "Completed": { color: "green", text: "Hoàn thành" },
      "InProgress": { color: "blue", text: "Đang thực hiện" },
      "Pending": { color: "orange", text: "Đang chờ" },
      "Cancelled": { color: "red", text: "Đã hủy" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
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
    return treatmentData.phases.map(phase => (
      <Panel 
        header={
          <Space>
            <Text strong>{phase.name}</Text>
            {getStatusTag(phase.status)}
          </Space>
        } 
        key={phase.id}
      >
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="Trạng thái">
            {getStatusTag(phase.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            {dayjs(phase.startDate).format("DD/MM/YYYY")} - {dayjs(phase.endDate).format("DD/MM/YYYY")}
          </Descriptions.Item>
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

  if (!treatmentData) {
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

      {/* Treatment Overview Card */}
      <Card 
        style={{ 
          marginBottom: 24,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Title level={4} style={{ color: '#1890ff', marginBottom: 24 }}>
              <MedicineBoxOutlined style={{ marginRight: 8 }} />
              Quá trình điều trị hiện tại
            </Title>
            <Descriptions column={1} style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
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
              <Descriptions.Item label="Dự kiến hoàn thành">
                <ClockIcon style={{ marginRight: 8, color: '#1890ff' }} />
                {dayjs(treatmentData.estimatedCompletion).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Space>
                  {getStatusTag(treatmentData.status)}
                  <Text type="secondary">
                    {treatmentData.status === 'inprogress' ? 
                      `(Đang thực hiện bước ${treatmentData.currentPhase}: ${treatmentData.phases[treatmentData.currentPhase - 1].name})` :
                      treatmentData.status === 'completed' ? 
                      '(Đã hoàn thành tất cả các bước)' :
                      treatmentData.status === 'pending' ? 
                      '(Đang chờ bắt đầu điều trị)' :
                      '(Đang thực hiện)'}
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Lịch hẹn tiếp theo">
                <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                {dayjs(treatmentData.nextAppointment).format("DD/MM/YYYY")}
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
                percent={treatmentData.overallProgress} 
                status="active" 
                strokeColor={{
                  from: '#108ee9',
                  to: '#87d068',
                }}
                strokeWidth={12}
                style={{ marginBottom: 8 }}
              />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {treatmentData.overallProgress}% hoàn thành
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
                border: '1px solid #91d5ff'
              }}>
                <Space align="baseline">
                  <HeartOutlined style={{ fontSize: 28, color: '#1890ff' }} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
                      {treatmentData.phases[treatmentData.currentPhase - 1].name}
                    </div>
                    <div style={{ color: '#666', marginTop: 4 }}>
                      {treatmentData.phases[treatmentData.currentPhase - 1].activities.find(a => a.status === 'upcoming')?.name || 'Đang xử lý'}
                    </div>
                  </div>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Treatment Steps */}
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Steps
          current={treatmentData.currentPhase - 1}
          items={treatmentData.phases.map(phase => ({
            title: phase.name,
            status: getStepStatus(phase.status),
            description: dayjs(phase.startDate).format("DD/MM"),
            icon: phase.status === 'completed' ? <CheckIcon /> : 
                  phase.status === 'in-progress' ? <TestTubeIcon style={{ color: '#1890ff' }} /> : 
                  <TestTubeIcon style={{ color: '#d9d9d9' }} />
          }))}
          direction="horizontal"
          size="small"
          responsive={true}
          style={{ padding: '20px 0' }}
        />
      </Card>

      {/* Phase Details */}
      <Card 
        title={
          <Space>
            <FileTextOutlined style={{ color: '#1890ff' }} />
            <span>Chi tiết các giai đoạn điều trị</span>
          </Space>
        }
        style={{ 
          marginBottom: 24,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Collapse 
          defaultActiveKey={[treatmentData.currentPhase]}
          style={{ background: 'white' }}
        >
          {renderPhases()}
        </Collapse>
      </Card>

      {/* Treatment Reminders and Tips */}
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
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
    </div>
  );
};

export default TreatmentProgress; 