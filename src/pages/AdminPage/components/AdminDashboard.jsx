import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { UserOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AdminDashboard = () => {
  return (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Users"
              value={156}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bác Sĩ"
              value={12}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khách Hàng"
              value={142}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Quản Lý"
              value={2}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Hoạt Động Gần Đây">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <Text strong>User mới đăng ký</Text>
              <br />
              <Text type="secondary">john_doe vừa tạo tài khoản</Text>
            </div>
            <Text type="secondary">2 giờ trước</Text>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <Text strong>Cập nhật thông tin</Text>
              <br />
              <Text type="secondary">Dr. Smith cập nhật hồ sơ</Text>
            </div>
            <Text type="secondary">5 giờ trước</Text>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <Text strong>Đặt lịch hẹn mới</Text>
              <br />
              <Text type="secondary">Jane Doe đặt lịch khám</Text>
            </div>
            <Text type="secondary">1 ngày trước</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard; 