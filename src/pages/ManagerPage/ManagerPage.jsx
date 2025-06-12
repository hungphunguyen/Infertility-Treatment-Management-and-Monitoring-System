import React, { useState, useEffect } from "react";
import { Layout, Spin, Typography } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { path } from "../../common/path";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import ReportDashboard from "../../components/manager/ReportDashboard";
import ScheduleManagement from "../../components/manager/ScheduleManagement";
import AppointmentManagement from "../../components/manager/AppointmentManagement";
import DoctorScheduleView from "../../components/manager/DoctorScheduleView";
import TodayExaminations from "../../components/manager/TodayExaminations";
import FeedbackManagement from "../../components/manager/FeedbackManagement";
import ServiceManagement from "../../components/manager/ServiceManagement";
import BlogManagement from "../../components/manager/BlogManagement";
import { useSelector } from "react-redux";
import { authService } from "../../service/auth.service";
import UpdateProfile from "../../components/customer/UpdateProfile";

const { Header, Content } = Layout;
const { Title } = Typography;

const ManagerPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("report");
  const navigate = useNavigate();
  const token = useSelector((state) => state.authSlice);
  const location = useLocation();
  const [infoUser, setInfoUser] = useState();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    authService
      .getMyInfo(token.token)
      .then((res) => {
        const user = res.data.result;
        if (user.roleName.name !== "MANAGER") {
          showNotification("Bạn không có quyền truy cập trang này", "error");
          navigate("/");
          return;
        }
        setInfoUser(res.data.result);
      })
      .catch((err) => {
        navigate("/");
        console.log(err);
      });
  }, [token]);

  // Update selected menu based on current path
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("/dashboard")) {
      setSelectedMenu("report");
    } else if (pathname.includes("/schedule")) {
      setSelectedMenu("schedule");
    } else if (pathname.includes("/appointments")) {
      setSelectedMenu("appointments");
    } else if (pathname.includes("/doctor-schedule")) {
      setSelectedMenu("doctor-schedule");
    } else if (pathname.includes("/today-exams")) {
      setSelectedMenu("today-exams");
    } else if (pathname.includes("/feedback")) {
      setSelectedMenu("feedback");
    } else if (pathname.includes("/services")) {
      setSelectedMenu("services");
    } else if (pathname.includes("/blog")) {
      setSelectedMenu("blog");
    } else if (pathname.includes("/update-profile")) {
      setSelectedMenu("update-profile");
    } else {
      // Default to report if no match
      setSelectedMenu("report");
      // Redirect to dashboard if at the root manager page
      if (pathname === "/manager") {
        navigate(path.managerDashboard);
      }
    }
  }, [location, navigate]);

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
      case "update-profile":
        return "Cập nhật thông tin cá nhân";
      default:
        return "Dashboard";
    }
  };

  if (!infoUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

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
            <Title
              level={2}
              style={{
                margin: 0,
                alignItems: "center",
                marginLeft: 250,
              }}
            >
              {getPageTitle()}
            </Title>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-0">Manager Dashboard</p>
              <p className="text-xs text-gray-400 mb-0">
                {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#f0f2f5",
            marginLeft: 250,
          }}
        >
          <Routes>
            <Route index element={<ReportDashboard />} />
            <Route path="dashboard" element={<ReportDashboard />} />
            <Route path="schedule" element={<ScheduleManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="doctor-schedule" element={<DoctorScheduleView />} />
            <Route path="today-exams" element={<TodayExaminations />} />
            <Route path="feedback" element={<FeedbackManagement />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="blog" element={<BlogManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerPage;
