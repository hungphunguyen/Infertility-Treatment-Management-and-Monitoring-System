import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const AppointmentManagement = () => {
  return (
    <Card>
      <Title level={3}>Quản Lý Lịch Hẹn</Title>
      <p>Component này sẽ quản lý tất cả lịch hẹn của bệnh nhân.</p>
      <p>Tính năng:</p>
      <ul>
        <li>Xem danh sách lịch hẹn</li>
        <li>Xác nhận/Hủy lịch hẹn</li>
        <li>Sắp xếp lại lịch hẹn</li>
        <li>Thông báo nhắc nhở</li>
      </ul>
    </Card>
  );
};

export default AppointmentManagement; 