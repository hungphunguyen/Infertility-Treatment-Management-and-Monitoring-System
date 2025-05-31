import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const DoctorScheduleView = () => {
  return (
    <Card>
      <Title level={3}>Lịch Làm Việc Bác Sĩ Hôm Nay</Title>
      <p>Component này hiển thị lịch làm việc của tất cả bác sĩ trong ngày.</p>
      <p>Tính năng:</p>
      <ul>
        <li>Xem lịch làm việc theo bác sĩ</li>
        <li>Trạng thái có mặt/vắng mặt</li>
        <li>Phân ca làm việc</li>
        <li>Số lượng bệnh nhân đã khám</li>
      </ul>
    </Card>
  );
};

export default DoctorScheduleView; 