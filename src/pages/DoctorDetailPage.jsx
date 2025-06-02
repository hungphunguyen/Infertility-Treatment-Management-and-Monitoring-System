import React from "react";
import { Typography } from "antd";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const DoctorDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <Title level={2}>Trang Chi Tiết Bác Sĩ - ID: {id}</Title>
        <p>Test page - nếu bạn thấy dòng này, component đã hoạt động.</p>
      </div>
      <UserFooter />
    </div>
  );
};

export default DoctorDetailPage; 