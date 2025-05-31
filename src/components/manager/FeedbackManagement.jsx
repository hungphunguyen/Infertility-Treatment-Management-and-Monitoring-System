import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const FeedbackManagement = () => {
  return (
    <Card>
      <Title level={3}>Quản Lý Feedback</Title>
      <p>Component này để duyệt và quản lý feedback từ khách hàng.</p>
      <p>Tính năng:</p>
      <ul>
        <li>Xem danh sách feedback</li>
        <li>Duyệt/Ẩn feedback</li>
        <li>Xử lý khiếu nại</li>
        <li>Thống kê đánh giá</li>
      </ul>
    </Card>
  );
};

export default FeedbackManagement; 