import React from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const Settings = () => {
  return (
    <Card title="Cài Đặt Hệ Thống">
      <div className="space-y-6">
        <div>
          <Title level={4}>Cài Đặt Email</Title>
          <Form layout="vertical">
            <Form.Item label="SMTP Server">
              <Input placeholder="smtp.gmail.com" />
            </Form.Item>
            <Form.Item label="SMTP Port">
              <Input placeholder="587" />
            </Form.Item>
            <Form.Item label="Email Username">
              <Input placeholder="your-email@gmail.com" />
            </Form.Item>
            <Form.Item label="Email Password">
              <Input.Password placeholder="Nhập mật khẩu email" />
            </Form.Item>
          </Form>
        </div>
        
        <div>
          <Title level={4}>Cài Đặt Bảo Mật</Title>
          <Form layout="vertical">
            <Form.Item label="Thời gian timeout session (phút)">
              <Input placeholder="30" />
            </Form.Item>
            <Form.Item label="Số lần đăng nhập sai tối đa">
              <Input placeholder="5" />
            </Form.Item>
            <Form.Item label="Thời gian khóa tài khoản (phút)">
              <Input placeholder="15" />
            </Form.Item>
          </Form>
        </div>

        <div>
          <Title level={4}>Cài Đặt Hệ Thống</Title>
          <Form layout="vertical">
            <Form.Item label="Tên Phòng Khám">
              <Input placeholder="Phòng Khám Hiếm Muộn ABC" />
            </Form.Item>
            <Form.Item label="Địa Chỉ">
              <Input placeholder="123 Đường ABC, Quận XYZ, TP.HCM" />
            </Form.Item>
            <Form.Item label="Số Điện Thoại">
              <Input placeholder="0123 456 789" />
            </Form.Item>
          </Form>
        </div>

        <Button type="primary" size="large">
          Lưu Cài Đặt
        </Button>
      </div>
    </Card>
  );
};

export default Settings; 