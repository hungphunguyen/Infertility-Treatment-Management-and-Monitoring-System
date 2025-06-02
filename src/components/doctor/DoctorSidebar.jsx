import React from "react";
import { Menu, Avatar, Typography, Divider } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined
} from "@ant-design/icons";

const { Text } = Typography;

const DoctorSidebar = ({ selectedMenuItem, setSelectedMenuItem, collapsed }) => {
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      title: "Xem tổng quan và lịch hôm nay"
    },
    {
      key: "patients",
      icon: <TeamOutlined />,
      label: "Bệnh Nhân",
      title: "Danh sách bệnh nhân đang điều trị"
    },
    {
      key: "test-results",
      icon: <FileTextOutlined />,
      label: "Kết Quả XN",
      title: "Quản lý kết quả xét nghiệm"
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ Sơ",
      title: "Thông tin cá nhân bác sĩ"
    }
  ];

  return (
    <div style={{ height: "100%" }}>
      {/* Doctor Info */}
      <div style={{ 
        padding: collapsed ? "16px 8px" : "24px", 
        textAlign: "center",
        background: "#fafafa",
        borderBottom: "1px solid #f0f0f0"
      }}>
        <Avatar 
          size={collapsed ? 40 : 64} 
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff", marginBottom: collapsed ? 0 : 12 }}
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
          height: "calc(100% - 140px)"
        }}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: (
            <span 
              onClick={() => setSelectedMenuItem(item.key)}
              title={collapsed ? item.title : ""}
              style={{ cursor: "pointer" }}
            >
              {item.label}
            </span>
          )
        }))}
      />

      {/* Footer */}
      {!collapsed && (
        <div style={{ 
          position: "absolute", 
          bottom: 16, 
          left: 24, 
          right: 24,
          textAlign: "center"
        }}>
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