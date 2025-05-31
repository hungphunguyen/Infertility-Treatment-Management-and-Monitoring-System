import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const BlogManagement = () => {
  return (
    <Card>
      <Title level={3}>Quản Lý Blog</Title>
      <p>Component này để CRUD các bài viết blog và kiến thức chia sẻ.</p>
      <p>Tính năng:</p>
      <ul>
        <li>Thêm/Sửa/Xóa bài viết</li>
        <li>Quản lý danh mục blog</li>
        <li>Duyệt bài viết</li>
        <li>Thống kê lượt xem</li>
      </ul>
    </Card>
  );
};

export default BlogManagement; 