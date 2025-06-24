import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Timeline, Typography, Spin, Button, Tag, Space, Row, Col, Avatar } from 'antd';
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, MedicineBoxOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { NotificationContext } from "../../App";

const { Title, Text } = Typography;

const TreatmentStagesView = () => {
  const [loading, setLoading] = useState(true);
  const [treatmentData, setTreatmentData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { patientInfo, treatmentData: passedTreatmentData } = location.state || {};
        if (!patientInfo) {
          showNotification("Không tìm thấy thông tin bệnh nhân", "warning");
          navigate(-1);
          return;
        }

        if (passedTreatmentData) {
          setTreatmentData(passedTreatmentData);
        } else {
          showNotification("Không tìm thấy thông tin điều trị", "warning");
          navigate(-1);
          return;
        }
      } catch (error) {
        showNotification("Không thể lấy thông tin điều trị", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state, navigate, showNotification]);

  // Treatment record status (hồ sơ điều trị)
  const getTreatmentStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING": return "orange";
      case "INPROGRESS": return "blue";
      case "COMPLETED": return "green";
      case "CANCELLED": return "red";
      default: return "default";
    }
  };

  const getTreatmentStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING": return "Vừa đăng ký";
      case "INPROGRESS": return "Đang điều trị";
      case "COMPLETED": return "Hoàn thành";
      case "CANCELLED": return "Đã hủy";
      default: return status || "Không xác định";
    }
  };

  // Treatment step status (bước điều trị)
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PLANNED": return "default";
      case "CONFIRMED": return "blue";
      case "COMPLETED": return "green";
      case "CANCELLED": return "red";
      default: return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "PLANNED": return "Chưa có lịch";
      case "CONFIRMED": return "Đã có lịch";
      case "COMPLETED": return "Đã thực hiện";
      case "CANCELLED": return "Đã hủy";
      default: return status || "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED": return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case "CONFIRMED": return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case "CANCELLED": return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case "PLANNED": default: return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!treatmentData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Không tìm thấy thông tin điều trị</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>
          
          <Title level={3}>
            <Space>
              <MedicineBoxOutlined />
              Chi tiết quy trình điều trị
            </Space>
          </Title>
        </div>

        {/* Patient Information */}
        <Card 
          title="Thông tin bệnh nhân" 
          style={{ marginBottom: 24 }}
          size="small"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                <Text strong>Tên bệnh nhân:</Text>
                <Text>{treatmentData.customerName}</Text>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <UserOutlined style={{ color: '#722ed1' }} />
                <Text strong>Bác sĩ:</Text>
                <Text>{treatmentData.doctorName}</Text>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <CalendarOutlined style={{ color: '#52c41a' }} />
                <Text strong>Ngày bắt đầu:</Text>
                <Text>{dayjs(treatmentData.startDate).format("DD/MM/YYYY")}</Text>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <MedicineBoxOutlined style={{ color: '#fa8c16' }} />
                <Text strong>Dịch vụ:</Text>
                <Text>{treatmentData.treatmentServiceName}</Text>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <Text strong>Trạng thái:</Text>
                <Tag 
                  color={getTreatmentStatusColor(treatmentData.status)}
                  style={{ 
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '14px'
                  }}
                  icon={getStatusIcon(treatmentData.status)}
                >
                  {getTreatmentStatusText(treatmentData.status)}
                </Tag>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <CalendarOutlined style={{ color: '#13c2c2' }} />
                <Text strong>Ngày tạo:</Text>
                <Text>{dayjs(treatmentData.createdDate).format("DD/MM/YYYY")}</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Treatment Steps Timeline */}
        <Card title="Quy trình điều trị" size="small">
          <Timeline
            mode="left"
            items={treatmentData.treatmentSteps?.map((step, index) => ({
              key: step.id,
              dot: getStatusIcon(step.status),
              children: (
                <Card 
                  size="small" 
                  style={{ 
                    marginBottom: 16,
                    borderLeft: `4px solid ${
                      step.status === 'COMPLETED' || step.status === 'FINISHED' || step.status === 'APPROVED' ? '#52c41a' :
                      step.status === 'CONFIRMED' || step.status === 'SCHEDULED' || step.status === 'ACTIVE' ? '#1890ff' :
                      step.status === 'CANCELLED' || step.status === 'FAILED' || step.status === 'REJECTED' ? '#ff4d4f' :
                      step.status === 'PENDING' || step.status === 'ON_HOLD' || step.status === 'WAITING' ? '#fa8c16' :
                      step.status === 'INPROGRESS' || step.status === 'IN_PROGRESS' ? '#1890ff' :
                      step.status === 'PENDING_CHANGE' ? '#722ed1' :
                      step.status === 'DRAFT' || step.status === 'INACTIVE' ? '#d9d9d9' : '#d9d9d9'
                    }`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                  }}
                >
                  <Row gutter={[16, 8]}>
                    <Col span={24}>
                      <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                        {step.name}
                      </Title>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space>
                        <Text type="secondary">Trạng thái:</Text>
                        <Tag 
                          color={getStatusColor(step.status)}
                          style={{ 
                            fontWeight: 'bold',
                            borderRadius: '4px'
                          }}
                        >
                          {getStatusText(step.status)}
                        </Tag>
                      </Space>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space>
                        <Text type="secondary">Lịch dự kiến:</Text>
                        <Text style={{ fontWeight: '500' }}>
                          {step.scheduledDate 
                            ? dayjs(step.scheduledDate).format("DD/MM/YYYY")
                            : "Chưa lên lịch"
                          }
                        </Text>
                      </Space>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space>
                        <Text type="secondary">Ngày thực hiện:</Text>
                        <Text style={{ fontWeight: '500' }}>
                          {step.actualDate 
                            ? dayjs(step.actualDate).format("DD/MM/YYYY")
                            : "Chưa thực hiện"
                          }
                        </Text>
                      </Space>
                    </Col>
                    {step.notes && (
                      <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text type="secondary">Ghi chú:</Text>
                          <Text style={{ 
                            backgroundColor: '#f5f5f5', 
                            padding: '8px 12px', 
                            borderRadius: '4px',
                            display: 'block',
                            width: '100%'
                          }}>
                            {step.notes}
                          </Text>
                        </Space>
                      </Col>
                    )}
                  </Row>
                </Card>
              )
            })) || []}
          />
        </Card>
      </Card>
    </div>
  );
};

export default TreatmentStagesView; 