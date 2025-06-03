import React, { useState } from "react";
import { 
  Card, Table, Tag, Button, Space, Progress, Typography, 
  Row, Col, Statistic, Modal, Descriptions, Timeline
} from "antd";
import {
  MedicineBoxOutlined, CalendarOutlined, CheckCircleOutlined,
  ClockCircleOutlined, EyeOutlined, UserOutlined, FileTextOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const MyServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock services data
  const services = [
    {
      key: 1,
      serviceId: "SV001",
      serviceName: "Tư vấn Ban đầu",
      price: 500000,
      registeredDate: "2024-01-10",
      status: "completed",
      progress: 100,
      doctor: "BS. Nguyễn Văn A",
      appointmentDate: "2024-01-15",
      notes: "Đã hoàn thành tư vấn ban đầu và lập kế hoạch điều trị",
      nextStep: "Đăng ký gói IVF"
    },
    {
      key: 2,
      serviceId: "SV002", 
      serviceName: "IVF Tiêu chuẩn",
      price: 70000000,
      registeredDate: "2024-01-12",
      status: "in-progress",
      progress: 35,
      doctor: "BS. Nguyễn Văn A",
      appointmentDate: "2024-01-20",
      notes: "Đang trong giai đoạn kích thích buồng trứng",
      nextStep: "Siêu âm theo dõi ngày 22/01"
    },
    {
      key: 3,
      serviceId: "SV003",
      serviceName: "Xét nghiệm Di truyền",
      price: 8000000,
      registeredDate: "2024-01-18",
      status: "scheduled",
      progress: 0,
      doctor: "BS. Trần Thị B",
      appointmentDate: "2024-01-25",
      notes: "Đã đặt lịch, chờ ngày khám",
      nextStep: "Lấy mẫu xét nghiệm ngày 25/01"
    }
  ];

  const getStatusTag = (status) => {
    const statusMap = {
      completed: { color: "green", text: "Hoàn thành" },
      "in-progress": { color: "blue", text: "Đang thực hiện" },
      scheduled: { color: "orange", text: "Đã đặt lịch" },
      cancelled: { color: "red", text: "Đã hủy" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const viewService = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Mã dịch vụ",
      dataIndex: "serviceId",
      key: "serviceId",
      render: (id) => <Tag color="blue">{id}</Tag>
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctor",
      key: "doctor",
      render: (doctor) => (
        <div>
          <UserOutlined style={{ marginRight: 8 }} />
          {doctor}
        </div>
      )
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registeredDate",
      key: "registeredDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Giá dịch vụ",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text strong style={{ color: "#52c41a" }}>
          {price.toLocaleString('vi-VN')} VNĐ
        </Text>
      )
    },
    {
      title: "Tiến độ",
      key: "progress",
      render: (_, record) => (
        <div>
          <Progress percent={record.progress} size="small" />
          <Text style={{ fontSize: "12px", color: "#666" }}>
            {record.progress}%
          </Text>
        </div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => viewService(record)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  // Statistics
  const stats = {
    total: services.length,
    completed: services.filter(s => s.status === "completed").length,
    inProgress: services.filter(s => s.status === "in-progress").length,
    scheduled: services.filter(s => s.status === "scheduled").length,
    totalSpent: services.reduce((sum, s) => sum + s.price, 0)
  };

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng dịch vụ"
              value={stats.total}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang thực hiện"
              value={stats.inProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng chi phí"
              value={stats.totalSpent}
              formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
              valueStyle={{ color: '#fa8c16', fontSize: '16px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Services Table */}
      <Card title="Danh Sách Dịch Vụ Đã Đăng Ký">
        <Table
          columns={columns}
          dataSource={services}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Service Detail Modal */}
      <Modal
        title="Chi Tiết Dịch Vụ"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedService && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Mã dịch vụ">
                {selectedService.serviceId}
              </Descriptions.Item>
              <Descriptions.Item label="Tên dịch vụ">
                {selectedService.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ phụ trách">
                {selectedService.doctor}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                {dayjs(selectedService.registeredDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Lịch hẹn tiếp theo">
                {selectedService.appointmentDate ? dayjs(selectedService.appointmentDate).format("DD/MM/YYYY") : "Chưa có"}
              </Descriptions.Item>
              <Descriptions.Item label="Giá dịch vụ">
                <Text strong style={{ color: "#52c41a" }}>
                  {selectedService.price.toLocaleString('vi-VN')} VNĐ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Space>
                  {getStatusTag(selectedService.status)}
                  <Progress percent={selectedService.progress} size="small" style={{ width: 100 }} />
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Ghi chú hiện tại:</Title>
              <Text>{selectedService.notes}</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Bước tiếp theo:</Title>
              <Text strong style={{ color: "#1890ff" }}>{selectedService.nextStep}</Text>
            </div>

            {/* Treatment Timeline */}
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Tiến trình điều trị:</Title>
              <Timeline>
                <Timeline.Item color="green">
                  <Text strong>15/01/2024 - Tư vấn ban đầu</Text>
                  <br />
                  <Text type="secondary">Đã hoàn thành khám tư vấn và lập kế hoạch</Text>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <Text strong>20/01/2024 - Bắt đầu IVF</Text>
                  <br />
                  <Text type="secondary">Kích thích buồng trứng, theo dõi định kỳ</Text>
                </Timeline.Item>
                <Timeline.Item>
                  <Text strong>22/01/2024 - Siêu âm theo dõi</Text>
                  <br />
                  <Text type="secondary">Dự kiến siêu âm đánh giá phản ứng</Text>
                </Timeline.Item>
                <Timeline.Item>
                  <Text strong>25/01/2024 - Lấy trứng</Text>
                  <br />
                  <Text type="secondary">Dự kiến thủ thuật lấy trứng</Text>
                </Timeline.Item>
              </Timeline>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyServices; 