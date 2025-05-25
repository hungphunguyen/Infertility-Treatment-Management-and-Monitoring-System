import React from 'react';
import { Card, Form, Input, Select, Button, Space, Row, Col } from 'antd';

const { Option } = Select;

const CreateAccount = () => {
  return (
    <Card title="Tạo Tài Khoản Mới">
      <Form
        layout="vertical"
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tên Đăng Nhập"
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Họ Tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Nhập họ tên đầy đủ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập địa chỉ email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Mật Khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Vai Trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Select placeholder="Chọn vai trò">
                <Option value="customer">Khách Hàng</Option>
                <Option value="doctor">Bác Sĩ</Option>
                <Option value="manager">Quản Lý</Option>
                <Option value="admin">Quản Trị Viên</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Trạng Thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              initialValue="active"
            >
              <Select>
                <Option value="active">Hoạt Động</Option>
                <Option value="inactive">Không Hoạt Động</Option>
                <Option value="pending">Chờ Duyệt</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Tạo Tài Khoản
            </Button>
            <Button>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateAccount; 