import React, { useState, useEffect } from "react";
import { Layout, Typography } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { path } from "../common/path";
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
import CustomerBlogManagement from "../components/blog/CustomerBlogManagement";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const CustomerDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");

  // Update selected menu item based on current path
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("/profile")) {
      setSelectedMenuItem("profile");
    } else if (pathname.includes("/update-profile")) {
      setSelectedMenuItem("update-profile");
    } else if (pathname.includes("/create-blog")) {
      setSelectedMenuItem("create-blog");
    } else if (pathname.includes("/my-blogs")) {
      setSelectedMenuItem("my-blogs");
    } else if (pathname.includes("/services")) {
      setSelectedMenuItem("services");
    } else if (pathname.includes("/appointments")) {
      setSelectedMenuItem("appointments");
    } else if (pathname.includes("/treatment")) {
      setSelectedMenuItem("treatment");
    } else if (pathname.includes("/medical-record")) {
      setSelectedMenuItem("medical-record");
    } else if (pathname.includes("/notifications")) {
      setSelectedMenuItem("notifications");
    } else if (pathname.includes("/reviews")) {
      setSelectedMenuItem("reviews");
    } else if (pathname.includes("/feedback")) {
      setSelectedMenuItem("feedback");
    } else if (pathname.includes("/payment")) {
      setSelectedMenuItem("payment");
    } else {
      // Default to profile if no match
      setSelectedMenuItem("profile");
      // Redirect to profile if at the root customer dashboard
      if (pathname === "/customer") {
        navigate(path.customerProfile);
      }
    }
  }, [location, navigate]);

  const getPageTitle = () => {
    switch (selectedMenuItem) {
      case "profile":
        return "Hồ Sơ Cá Nhân";
      case "update-profile":
        return "Cập Nhật Thông Tin";
      case "create-blog":
        return "Tạo Bài Viết Mới";
      case "my-blogs":
        return "Bài Viết Của Tôi";
      case "services":
        return "Dịch Vụ Của Tôi";
      case "appointments":
        return "Lịch Hẹn Của Tôi";
      case "treatment":
        return "Lịch Trình Điều Trị";
      case "medical-record":
        return "Hồ Sơ Y Tế";
      case "notifications":
        return "Thông Báo";
      case "reviews":
        return "Đánh Giá Của Tôi";
      case "feedback":
        return "Phản Hồi Của Tôi";
      case "payment":
        return "Thanh Toán";
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
          <Routes>
            <Route index element={<ProfileOverview />} />
            <Route path="profile" element={<ProfileOverview />} />
            <Route path="services" element={<MyServices />} />
            <Route path="appointments" element={<AppointmentSchedule />} />
            <Route path="treatment" element={<TreatmentProgress />} />
            <Route path="reviews" element={<ServiceReview />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="medical-record" element={<MedicalRecord />} />
            <Route path="payment" element={<Payment />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="my-blogs" element={<CustomerBlogManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomerDashboard;