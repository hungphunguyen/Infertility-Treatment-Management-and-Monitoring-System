import React, { useState, useEffect } from "react";
import { Layout, Typography } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { path } from "../common/path";
import DoctorSidebar from "../components/doctor/DoctorSidebar";
import DashboardOverview from "../components/doctor/DashboardOverview";
import PatientList from "../components/doctor/PatientList";
import TestResults from "../components/doctor/TestResults";
import DoctorProfile from "../components/doctor/DoctorProfile";
import DoctorWorkSchedule from "../components/doctor/DoctorWorkSchedule";
import TreatmentStageDetails from "../components/doctor/TreatmentStageDetails";
import ChangeRequests from "../components/doctor/ChangeRequests";

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
    if (pathname.includes("/change-requests")) {
      setSelectedMenuItem("change-requests");
    } else if (pathname.includes("/work-schedule")) {
      setSelectedMenuItem("work-schedule");
    } else if (pathname.includes("/dashboard")) {
      setSelectedMenuItem("dashboard");
    } else if (pathname.includes("/patients") || pathname.includes("/treatment-stages")) {
      setSelectedMenuItem("patients");
    } else if (pathname.includes("/test-results")) {
      setSelectedMenuItem("test-results");
    } else if (pathname.includes("/profile")) {
      setSelectedMenuItem("profile");
    } else {
      setSelectedMenuItem("dashboard");
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
      case "profile":
        return "Hồ Sơ Bác Sĩ";
      case "work-schedule":
        return "Lịch Làm Việc";
      case "treatment-stages":
        return "Chi Tiết Giai Đoạn Điều Trị";
      case "change-requests":
        return "Quản Lý Yêu Cầu Thay Đổi";
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
            <Route path="work-schedule" element={<DoctorWorkSchedule />} />
            <Route path="treatment-stages" element={<TreatmentStageDetails />} />
            <Route path="change-requests" element={<ChangeRequests />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboard;