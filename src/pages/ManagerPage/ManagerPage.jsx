import React, { useState } from "react";
import { Layout, Typography } from "antd";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import ReportDashboard from "../../components/manager/ReportDashboard";
import ScheduleManagement from "../../components/manager/ScheduleManagement";
import AppointmentManagement from "../../components/manager/AppointmentManagement";
import DoctorScheduleView from "../../components/manager/DoctorScheduleView";
import TodayExaminations from "../../components/manager/TodayExaminations";
import FeedbackManagement from "../../components/manager/FeedbackManagement";
import ServiceManagement from "../../components/manager/ServiceManagement";
import BlogManagement from "../../components/manager/BlogManagement";

const { Header, Content } = Layout;
const { Title } = Typography;

const ManagerPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("report");

  const getPageTitle = () => {
    switch (selectedMenu) {
      case "report":
        return "Báo Cáo Doanh Thu";
      case "schedule":
        return "Xếp Lịch Làm Việc";
      case "appointments":
        return "Quản Lý Lịch Hẹn";
      case "doctor-schedule":
        return "Lịch Làm Việc Bác Sĩ";
      case "today-exams":
        return "Lịch Khám Hôm Nay";
      case "feedback":
        return "Quản Lý Feedback";
      case "services":
        return "Quản Lý Dịch Vụ";
      case "blog":
        return "Quản Lý Blog";
      default:
        return "Dashboard";
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "report":
        return <ReportDashboard />;
      case "schedule":
        return <ScheduleManagement />;
      case "appointments":
        return <AppointmentManagement />;
      case "doctor-schedule":
        return <DoctorScheduleView />;
      case "today-exams":
        return <TodayExaminations />;
      case "feedback":
        return <FeedbackManagement />;
      case "services":
        return <ServiceManagement />;
      case "blog":
        return <BlogManagement />;
      default:
        return <ReportDashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ManagerSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
      />

      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <div className="flex justify-between items-center">
            <Title level={2} style={{ margin: 0 }}>
              {getPageTitle()}
            </Title>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-0">Manager Dashboard</p>
              <p className="text-xs text-gray-400 mb-0">
                {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </Header>

        <Content
          style={{ margin: "24px 16px", padding: 24, background: "#f0f2f5" }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerPage; 