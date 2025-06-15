import React from "react";
import { Menu, Avatar, Typography, Divider, Button } from "antd";
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
  EditOutlined,
  ReadOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const DoctorSidebar = ({
  selectedMenuItem,
  setSelectedMenuItem,
  collapsed,
}) => {
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      title: "Xem tổng quan và lịch hôm nay",
      path: path.doctorDashboard,
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
    {
      key: "my-blogs",
      icon: <ReadOutlined />,
      label: "Bài viết của tôi",
      title: "Xem và quản lý bài viết của bạn",
      path: "/doctor/my-blogs",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ Sơ",
      title: "Thông tin cá nhân bác sĩ",
      path: path.doctorProfile,
    },
  ];
  const navigate = useNavigate();

  return (
    <div style={{ height: "100%" }}>
      {/* Doctor Info */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "24px",
          textAlign: "center",
          background: "#fafafa",
          borderBottom: "1px solid #f0f0f0",
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
              <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                BS. Nguyễn Văn A
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Chuyên gia IVF
            </Text>
          </>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        style={{
          border: "none",
          background: "transparent",
          height: "calc(100% - 140px)",
        }}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: (
            <Link to={item.path} title={collapsed ? item.title : ""}>
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
            display: "flex",
            justifyContent: collapsed ? "center" : "flex-start",
            alignItems: "center",
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
          }}
        >
          <Divider style={{ margin: "8px 0" }} />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            Hệ thống quản lý bác sĩ v1.0
          </Text>
        </div>
      )}
    </div>
  );
};

export default DoctorSidebar;
