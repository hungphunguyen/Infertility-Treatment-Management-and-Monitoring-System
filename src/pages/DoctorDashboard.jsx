import React, { useState, useEffect } from "react";
import { Layout, Typography } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { path } from "../common/path";
import DoctorSidebar from "../components/doctor/DoctorSidebar";
import DashboardOverview from "../components/doctor/DashboardOverview";
import PatientList from "../components/doctor/PatientList";
import TestResults from "../components/doctor/TestResults";
import DoctorProfile from "../components/doctor/DoctorProfile";
import DoctorBlogManagement from "../components/blog/DoctorBlogManagement";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const DoctorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  // Update selected menu item based on current path
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("/dashboard")) {
      setSelectedMenuItem("dashboard");
    } else if (pathname.includes("/patients")) {
      setSelectedMenuItem("patients");
    } else if (pathname.includes("/test-results")) {
      setSelectedMenuItem("test-results");
    } else if (pathname.includes("/create-blog")) {
      setSelectedMenuItem("create-blog");
    } else if (pathname.includes("/my-blogs")) {
      setSelectedMenuItem("my-blogs");
    } else if (pathname.includes("/profile")) {
      setSelectedMenuItem("profile");
    } else {
      // Default to dashboard if no match
      setSelectedMenuItem("dashboard");
      // Redirect to dashboard if at the root doctor dashboard
      if (pathname === "/doctor-dashboard") {
        navigate(path.doctorDashboard);
      }
    }
  }, [location, navigate]);

  const getPageTitle = () => {
    switch (selectedMenuItem) {
      case "dashboard":
        return "Dashboard Bác Sĩ";
      case "patients":
        return "Danh Sách Bệnh Nhân";
      case "test-results":
        return "Quản Lý Kết Quả Xét Nghiệm";
      case "create-blog":
        return "Tạo Bài Viết Mới";
      case "my-blogs":
        return "Bài Viết Của Tôi";
      case "profile":
        return "Hồ Sơ Bác Sĩ";
      default:
        return "Dashboard Bác Sĩ";
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
        <DoctorSidebar 
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
            Chào mừng, BS. Nguyễn Văn A
          </div>
        </Header>
        
        <Content style={{ 
          margin: "24px", 
          background: "#f0f2f5",
          minHeight: "calc(100vh - 112px)"
        }}>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="test-results" element={<TestResults />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="my-blogs" element={<DoctorBlogManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboard;