import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const ScheduleManagement = () => {
  return (
    <Card>
      <Title level={3}>Xếp Lịch Làm Việc</Title>
      <p>Component này sẽ được phát triển để quản lý lịch làm việc của bác sĩ và nhân viên.</p>
      <p>Tính năng:</p>
      <ul>
        <li>Xếp lịch làm việc theo tuần/tháng</li>
        <li>Phân ca làm việc</li>
        <li>Quản lý nghỉ phép</li>
        <li>Thống kê giờ làm việc</li>
      </ul>
    </Card>
  );
};

export default ScheduleManagement; 