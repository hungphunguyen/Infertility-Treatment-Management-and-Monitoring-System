import React, { useState, useEffect } from "react";
import { 
  Card, Row, Col, Avatar, Button, Descriptions, Typography, 
  Divider, Space, Statistic, Badge, Spin, message
} from "antd";
import {
  UserOutlined, EditOutlined, PhoneOutlined, 
  MailOutlined, EnvironmentOutlined, CalendarOutlined,
  MedicineBoxOutlined, HeartOutlined, CheckCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { authService } from "../../service/auth.service";
import { treatmentService } from "../../service/treatment.service";

const { Title, Text, Paragraph } = Typography;

const ProfileOverview = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [treatmentStats, setTreatmentStats] = useState({
    totalServices: 0,
    completedTreatments: 0,
    upcomingAppointments: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy thông tin user
        const userResponse = await authService.getMyInfo();
        console.log('User Info Response:', userResponse);
        
        if (!userResponse?.data?.result) {
          message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          return;
        }

        const userData = userResponse.data.result;
        setUserInfo({
          ...userData,
          phone: userData.phoneNumber || 'Chưa cập nhật'
        });

        // Lấy thông tin điều trị
        const treatmentResponse = await treatmentService.getTreatmentRecordsByCustomer(userData.id);
        console.log('Treatment Records Response:', treatmentResponse);
        
        if (treatmentResponse?.data?.code === 1000 && Array.isArray(treatmentResponse.data.result)) {
          const records = treatmentResponse.data.result;
          const stats = {
            totalServices: records.length,
            completedTreatments: records.filter(r => r.status === 'Completed').length,
            upcomingAppointments: records.filter(r => r.status === 'Pending').length
          };
          setTreatmentStats(stats);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          message.error('Có lỗi xảy ra khi tải dữ liệu');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="danger">Không tìm thấy thông tin người dùng</Text>
      </div>
    );
  }

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
                  {userInfo.fullName}
                </Title>
                <Badge 
                  status="success" 
                  text="Thành viên"
                  style={{ marginTop: 8 }}
                />
              </div>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Email">
                <MailOutlined style={{ marginRight: 8 }} />
                {userInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                <PhoneOutlined style={{ marginRight: 8 }} />
                {userInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                <CalendarOutlined style={{ marginRight: 8 }} />
                {dayjs(userInfo.createdAt).format("DD/MM/YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Quick Stats */}
          <Card title="Tổng quan" style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic
                  title="Dịch vụ đã đăng ký"
                  value={treatmentStats.totalServices}
                  prefix={<MedicineBoxOutlined />}
                  valueStyle={{ color: "#1890ff", fontSize: "18px" }}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Điều trị hoàn thành"
                  value={treatmentStats.completedTreatments}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a", fontSize: "18px" }}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Lịch hẹn sắp tới"
                  value={treatmentStats.upcomingAppointments}
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
                {userInfo.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {userInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {userInfo.dateOfBirth ? dayjs(userInfo.dateOfBirth).format("DD/MM/YYYY") : "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {userInfo.gender === "female" ? "Nữ" : userInfo.gender === "male" ? "Nam" : "Khác"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {userInfo.address || "Chưa cập nhật"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Recent Activity */}
          <Card title="Hoạt động gần đây" style={{ marginTop: 16 }}>
            <div style={{ padding: "8px 0" }}>
              {treatmentStats.totalServices > 0 ? (
                <div style={{ marginBottom: 12 }}>
                  <MedicineBoxOutlined style={{ color: "#fa8c16", marginRight: 8 }} />
                  <Text>Đã đăng ký {treatmentStats.totalServices} dịch vụ điều trị</Text>
                </div>
              ) : (
                <Text type="secondary">Chưa có hoạt động nào</Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileOverview; 