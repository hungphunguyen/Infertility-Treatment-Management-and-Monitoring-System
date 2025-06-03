import React from "react";
import { 
  Card, Row, Col, Avatar, Button, Descriptions, Typography, 
  Divider, Space, Statistic, Badge
} from "antd";
import {
  UserOutlined, EditOutlined, PhoneOutlined, 
  MailOutlined, EnvironmentOutlined, CalendarOutlined,
  MedicineBoxOutlined, HeartOutlined, CheckCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const ProfileOverview = () => {
  // Mock customer data
  const customerInfo = {
    fullName: "Phú Lâm Nguyên",
    email: "phulamnguyên@email.com",
    phone: "0901234567",
    dateOfBirth: "1990-05-15",
    gender: "female",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    joinDate: "2024-01-10",
    membershipLevel: "Thân thiết",
    totalServices: 3,
    completedTreatments: 1,
    upcomingAppointments: 2
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* Profile Summary */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                style={{ backgroundColor: "#52c41a", marginBottom: 16 }}
              />
              <div>
                <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
                  {customerInfo.fullName}
                </Title>
                <Badge 
                  status="success" 
                  text={customerInfo.membershipLevel}
                  style={{ marginTop: 8 }}
                />
              </div>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Email">
                <MailOutlined style={{ marginRight: 8 }} />
                {customerInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                <PhoneOutlined style={{ marginRight: 8 }} />
                {customerInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                <CalendarOutlined style={{ marginRight: 8 }} />
                {dayjs(customerInfo.joinDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Quick Stats */}
          <Card title="Tổng quan" style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic
                  title="Dịch vụ đã đăng ký"
                  value={customerInfo.totalServices}
                  prefix={<MedicineBoxOutlined />}
                  valueStyle={{ color: "#1890ff", fontSize: "18px" }}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Điều trị hoàn thành"
                  value={customerInfo.completedTreatments}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a", fontSize: "18px" }}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Lịch hẹn sắp tới"
                  value={customerInfo.upcomingAppointments}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: "#fa8c16", fontSize: "18px" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Main Profile Info */}
        <Col xs={24} lg={16}>
          <Card 
            title="Thông tin cá nhân"
            extra={
              <Button 
                icon={<EditOutlined />} 
                onClick={() => window.location.href = "#/customer-dashboard/update-profile"}
              >
                Chỉnh sửa
              </Button>
            }
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Họ và tên">
                {customerInfo.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {customerInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {customerInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {dayjs(customerInfo.dateOfBirth).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {customerInfo.gender === "female" ? "Nữ" : customerInfo.gender === "male" ? "Nam" : "Khác"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {customerInfo.address}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                {dayjs(customerInfo.joinDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Cấp độ thành viên">
                <Badge status="success" text={customerInfo.membershipLevel} />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Recent Activity */}
          <Card title="Hoạt động gần đây" style={{ marginTop: 16 }}>
            <div style={{ padding: "8px 0" }}>
              <div style={{ marginBottom: 12 }}>
                <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                <Text>15/01/2024 - Hoàn thành lịch tư vấn với BS. Nguyễn Văn A</Text>
              </div>
              <div style={{ marginBottom: 12 }}>
                <CalendarOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                <Text>12/01/2024 - Đặt lịch khám IVF ngày 20/01/2024</Text>
              </div>
              <div style={{ marginBottom: 12 }}>
                <MedicineBoxOutlined style={{ color: "#fa8c16", marginRight: 8 }} />
                <Text>10/01/2024 - Đăng ký gói điều trị IVF Tiêu chuẩn</Text>
              </div>
              <div style={{ marginBottom: 12 }}>
                <UserOutlined style={{ color: "#722ed1", marginRight: 8 }} />
                <Text>10/01/2024 - Tạo tài khoản và hoàn thiện hồ sơ</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileOverview; 