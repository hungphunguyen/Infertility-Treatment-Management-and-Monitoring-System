import React, { useState } from "react";
import { Layout, Typography } from "antd";
import DoctorSidebar from "../components/doctor/DoctorSidebar";
import DashboardOverview from "../components/doctor/DashboardOverview";
import PatientList from "../components/doctor/PatientList";
import TestResults from "../components/doctor/TestResults";
import DoctorProfile from "../components/doctor/DoctorProfile";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const DoctorDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "dashboard":
        return <DashboardOverview />;
      case "patients":
        return <PatientList />;
      case "test-results":
        return <TestResults />;
      case "profile":
        return <DoctorProfile />;
      default:
        return <DashboardOverview />;
    }
  };

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
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboard; 