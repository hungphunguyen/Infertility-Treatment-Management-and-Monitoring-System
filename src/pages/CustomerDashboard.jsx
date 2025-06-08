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
import { authService } from "../service/auth.service";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const CustomerDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authService.getMyInfo();
        if (response?.data?.result) {
          setUserInfo(response.data.result);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  // Update selected menu item based on current path
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("/profile")) {
      setSelectedMenuItem("profile");
    } else if (pathname.includes("/services")) {
      setSelectedMenuItem("services");
    } else if (pathname.includes("/appointments")) {
      setSelectedMenuItem("appointments");
    } else if (pathname.includes("/treatment")) {
      setSelectedMenuItem("treatment");
    } else if (pathname.includes("/reviews")) {
      setSelectedMenuItem("reviews");
    } else if (pathname.includes("/notifications")) {
      setSelectedMenuItem("notifications");
    } else if (pathname.includes("/feedback")) {
      setSelectedMenuItem("feedback");
    } else if (pathname.includes("/medical-record")) {
      setSelectedMenuItem("medical-record");
    } else if (pathname.includes("/payment")) {
      setSelectedMenuItem("payment");
    } else if (pathname.includes("/update-profile")) {
      setSelectedMenuItem("update-profile");
    } else {
      // Default to profile if no match
      setSelectedMenuItem("profile");
      // Redirect to profile if at the root customer dashboard
      if (pathname === "/customer-dashboard") {
        navigate(path.customerProfile);
      }
    }
  }, [location, navigate]);

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
            Chào mừng, {userInfo?.fullName || 'Khách hàng'}
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
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomerDashboard;