import React, { useEffect, useState } from "react";
import { Menu, Avatar, Typography, Divider, Button, Spin, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { path } from "../../common/path";
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { authService } from "../../service/auth.service";

const { Text } = Typography;

const DoctorSidebar = ({
  selectedMenuItem,
  setSelectedMenuItem,
  collapsed,
}) => {
  const [userName, setUserName] = useState("");
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      title: "Xem tổng quan và lịch hôm nay",
      path: path.doctorDashboard,
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ Sơ",
      title: "Thông tin cá nhân bác sĩ",
      path: path.doctorProfile,
    },
    {
      key: "work-schedule",
      icon: <CalendarOutlined />,
      label: "Lịch Làm Việc",
      title: "Xem lịch làm việc của tôi",
      path: path.doctorWorkSchedule,
    },
    {
      key: "patients",
      icon: <TeamOutlined />,
      label: "Bệnh Nhân",
      title: "Danh sách bệnh nhân đang điều trị",
      path: path.doctorPatients,
    },
    {
      key: "test-results",
      icon: <FileTextOutlined />,
      label: "Kết Quả XN",
      title: "Quản lý kết quả xét nghiệm",
      path: path.doctorTestResults,
    },
    
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getMyInfo();
        setUserName(res?.data?.result?.fullName || "Bác sĩ");
      } catch {
        setUserName("Bác sĩ");
      }
    };
    fetchUser();
  }, []);

  return (
    <div
      style={{
        background: "#001529",
        color: "#fff",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        width: collapsed ? 80 : 250,
        overflow: "auto",
        transition: "width 0.2s"
      }}
    >
      {/* Doctor Info */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "24px",
          textAlign: "center",
          background: "#001529",
          borderBottom: "1px solid #222",
        }}
      >
        <Avatar
          size={collapsed ? 40 : 64}
          icon={<UserOutlined />}
          style={{
            backgroundColor: "#1890ff",
            marginBottom: collapsed ? 0 : 12,
          }}
        />
        {!collapsed && (
          <>
            <div style={{ marginTop: 8 }}>
              <Text strong style={{ fontSize: "16px", color: "#fff" }}>
                {userName}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: "12px", color: "#bfbfbf" }}>
              Chuyên gia IVF
            </Text>
          </>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        theme="dark"
        style={{
          border: "none",
          background: "transparent",
          color: "#fff",
          height: "auto",
        }}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: (
            <Link to={item.path} title={collapsed ? item.title : ""} style={{ color: "#fff" }}>
              {item.label}
            </Link>
          ),
        }))}
      />

      {/* Nút về trang chủ */}
      <div className="px-4 mt-4">
        <Button
          type="default"
          icon={<HomeOutlined />}
          style={{
            width: "100%",
            color: "#001529",
            background: "#fff",
            border: "none",
          }}
          onClick={() => navigate("/")}
        >
          {!collapsed && <span style={{ marginLeft: 8 }}>Về Trang Chủ</span>}
        </Button>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 24,
            right: 24,
            textAlign: "center",
            color: "#bfbfbf"
          }}
        >
          <Divider style={{ margin: "8px 0", borderColor: "#222" }} />
          <Text type="secondary" style={{ fontSize: "11px", color: "#bfbfbf" }}>
            Hệ thống quản lý bác sĩ 
          </Text>
        </div>
      )}
    </div>
  );
};

export default DoctorSidebar;
