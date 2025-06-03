import React, { useState } from "react";
import { Layout, Typography } from "antd";
import CustomerSidebar from "../components/customer/CustomerSidebar";
import ProfileOverview from "../components/customer/ProfileOverview";
import MyServices from "../components/customer/MyServices";
import AppointmentSchedule from "../components/customer/AppointmentSchedule";
import TreatmentProgress from "../components/customer/TreatmentProgress";
import ServiceReview from "../components/customer/ServiceReview";
import Notifications from "../components/customer/Notifications";
import Feedback from "../components/customer/Feedback";
import MedicalRecord from "../components/customer/MedicalRecord";
import Payment from "../components/customer/Payment";
import UpdateProfile from "../components/customer/UpdateProfile";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const CustomerDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "profile":
        return <ProfileOverview />;
      case "services":
        return <MyServices />;
      case "appointments":
        return <AppointmentSchedule />;
      case "treatment":
        return <TreatmentProgress />;
      case "reviews":
        return <ServiceReview />;
      case "notifications":
        return <Notifications />;
      case "feedback":
        return <Feedback />;
      case "medical-record":
        return <MedicalRecord />;
      case "payment":
        return <Payment />;
      case "update-profile":
        return <UpdateProfile />;
      default:
        return <ProfileOverview />;
    }
  };

  const getPageTitle = () => {
    switch (selectedMenuItem) {
      case "profile":
        return "Hồ Sơ Cá Nhân";
      case "services":
        return "Dịch Vụ Đã Đăng Ký";
      case "appointments":
        return "Lịch Hẹn";
      case "treatment":
        return "Lịch Trình Điều Trị";
      case "reviews":
        return "Đánh Giá Dịch Vụ";
      case "notifications":
        return "Thông Báo";
      case "feedback":
        return "Phản Hồi";
      case "medical-record":
        return "Hồ Sơ Bệnh Án";
      case "payment":
        return "Thanh Toán";
      case "update-profile":
        return "Cập Nhật Thông Tin Cá Nhân";
      default:
        return "Dashboard Khách Hàng";
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        width={280}
      >
        <CustomerSidebar 
          selectedMenuItem={selectedMenuItem}
          setSelectedMenuItem={setSelectedMenuItem}
          collapsed={collapsed}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: "#fff", 
          padding: "0 24px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
            {getPageTitle()}
          </Title>
          <div style={{ color: "#666" }}>
            Chào mừng, Phú Lâm Nguyên
          </div>
        </Header>
        
        <Content style={{ 
          margin: "24px", 
          background: "#f0f2f5",
          minHeight: "calc(100vh - 112px)"
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomerDashboard; 