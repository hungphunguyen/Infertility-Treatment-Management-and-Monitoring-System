import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const ServiceManagement = () => {
  return (
    <Card>
      <Title level={3}>Quản Lý Dịch Vụ</Title>
      <p>Component này để CRUD các dịch vụ khám chữa bệnh.</p>
      <p>Tính năng:</p>
      <ul>
        <li>Thêm/Sửa/Xóa dịch vụ</li>
        <li>Quản lý giá dịch vụ</li>
        <li>Mô tả chi tiết dịch vụ</li>
        <li>Thống kê sử dụng dịch vụ</li>
      </ul>
    </Card>
  );
};

export default ServiceManagement; 