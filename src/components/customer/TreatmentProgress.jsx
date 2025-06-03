import React, { useState } from "react";
import { 
  Card, Steps, Row, Col, Typography, Descriptions, Tag, 
  Timeline, Space, Divider, Progress, Collapse
} from "antd";
import {
  CheckCircleOutlined, ClockCircleOutlined, HeartOutlined,
  MedicineBoxOutlined, ExperimentOutlined, CalendarOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const TreatmentProgress = () => {
  // Mock data for treatment progress
  const treatmentData = {
    id: "TRT001",
    type: "IVF Tiêu chuẩn",
    startDate: "2024-01-12",
    currentPhase: 2,
    doctor: "BS. Nguyễn Văn A",
    status: "in-progress",
    estimatedCompletion: "2024-02-28",
    nextAppointment: "2024-01-22",
    overallProgress: 35,
    phases: [
      {
        id: 1,
        name: "Tư vấn và Chuẩn bị",
        status: "completed",
        startDate: "2024-01-12",
        endDate: "2024-01-15",
        activities: [
          {
            name: "Tư vấn ban đầu",
            date: "2024-01-15",
            status: "completed",
            notes: "Đã hoàn thành tư vấn và lập kế hoạch điều trị"
          },
          {
            name: "Xét nghiệm hormone",
            date: "2024-01-12",
            status: "completed",
            notes: "Đã hoàn thành xét nghiệm hormone"
          }
        ]
      },
      {
        id: 2,
        name: "Kích thích buồng trứng",
        status: "in-progress",
        startDate: "2024-01-18",
        endDate: "2024-01-30",
        activities: [
          {
            name: "Bắt đầu sử dụng hormone",
            date: "2024-01-18",
            status: "completed",
            notes: "Đã bắt đầu liệu trình hormone kích thích buồng trứng"
          },
          {
            name: "Siêu âm theo dõi",
            date: "2024-01-20",
            status: "completed",
            notes: "Siêu âm kiểm tra đáp ứng với hormone kích thích"
          },
          {
            name: "Siêu âm kiểm tra nang trứng",
            date: "2024-01-22",
            status: "upcoming",
            notes: "Đánh giá kích thước và số lượng nang trứng"
          },
          {
            name: "Tiêm hCG",
            date: "2024-01-28",
            status: "upcoming",
            notes: "Dự kiến tiêm hCG kích trứng trưởng thành"
          }
        ]
      },
      {
        id: 3,
        name: "Thu thập trứng",
        status: "not-started",
        startDate: "2024-01-30",
        endDate: "2024-01-30",
        activities: [
          {
            name: "Thủ thuật lấy trứng",
            date: "2024-01-30",
            status: "upcoming",
            notes: "Dự kiến thực hiện thủ thuật lấy trứng"
          }
        ]
      },
      {
        id: 4,
        name: "Thụ tinh và nuôi cấy phôi",
        status: "not-started",
        startDate: "2024-01-30",
        endDate: "2024-02-04",
        activities: []
      },
      {
        id: 5,
        name: "Chuyển phôi",
        status: "not-started",
        startDate: "2024-02-05",
        endDate: "2024-02-05",
        activities: []
      },
      {
        id: 6,
        name: "Theo dõi sau chuyển phôi",
        status: "not-started",
        startDate: "2024-02-05",
        endDate: "2024-02-19",
        activities: []
      },
      {
        id: 7,
        name: "Xét nghiệm thai",
        status: "not-started",
        startDate: "2024-02-20",
        endDate: "2024-02-20",
        activities: []
      }
    ]
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
      upcoming: { color: "orange", text: "Sắp tới" }
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

  return (
    <div>
      {/* Treatment Overview Card */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Title level={4}>Quá trình điều trị hiện tại</Title>
            <Descriptions column={1}>
              <Descriptions.Item label="Gói điều trị">
                <MedicineBoxOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                {treatmentData.type}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ phụ trách">
                {treatmentData.doctor}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {dayjs(treatmentData.startDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Dự kiến hoàn thành">
                {dayjs(treatmentData.estimatedCompletion).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(treatmentData.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Lịch hẹn tiếp theo">
                <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                {dayjs(treatmentData.nextAppointment).format("DD/MM/YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Tiến độ tổng thể:</Text>
              <Progress 
                percent={treatmentData.overallProgress} 
                status="active" 
                strokeColor={{
                  from: '#108ee9',
                  to: '#87d068',
                }}
              />
            </div>
            <div>
              <Text strong>Giai đoạn hiện tại:</Text>
              <div style={{ background: '#f0f7ff', padding: 16, borderRadius: 8, marginTop: 8 }}>
                <Space align="baseline">
                  <HeartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {treatmentData.phases[treatmentData.currentPhase - 1].name}
                    </div>
                    <div>
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
      <Card title="Quy trình điều trị" style={{ marginBottom: 24 }}>
        <Steps
          current={treatmentData.currentPhase - 1}
          items={treatmentData.phases.map(phase => ({
            title: phase.name,
            status: getStepStatus(phase.status),
            description: dayjs(phase.startDate).format("DD/MM")
          }))}
          direction="horizontal"
          size="small"
          responsive={true}
        />
      </Card>

      {/* Phase Details */}
      <Card title="Chi tiết các giai đoạn điều trị">
        <Collapse defaultActiveKey={[treatmentData.currentPhase]}>
          {renderPhases()}
        </Collapse>
      </Card>

      {/* Treatment Reminders and Tips */}
      <Card title="Lưu ý trong quá trình điều trị" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card type="inner" title="Dinh dưỡng">
              <ul style={{ paddingLeft: 16 }}>
                <li>Đảm bảo đủ folate và vitamin D</li>
                <li>Bổ sung DHA và axit folic</li>
                <li>Tránh đồ uống có cồn và caffeine</li>
                <li>Duy trì cân nặng phù hợp</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card type="inner" title="Chăm sóc sức khỏe">
              <ul style={{ paddingLeft: 16 }}>
                <li>Tập thể dục nhẹ nhàng đều đặn</li>
                <li>Tránh các hoạt động nặng</li>
                <li>Ngủ đủ giấc</li>
                <li>Quản lý stress</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card type="inner" title="Sau thủ thuật">
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