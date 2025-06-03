import React from "react";
import { Menu, Avatar, Typography, Divider, Badge } from "antd";
import { Link } from "react-router-dom";
import { path } from "../../common/path";
import {
  UserOutlined, MedicineBoxOutlined, CalendarOutlined, 
  HeartOutlined, StarOutlined, BellOutlined, MessageOutlined,
  FileTextOutlined, CreditCardOutlined, LogoutOutlined,
  SettingOutlined, EditOutlined
} from "@ant-design/icons";

const { Text } = Typography;

const CustomerSidebar = ({ selectedMenuItem, setSelectedMenuItem, collapsed }) => {
  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ Sơ",
      title: "Xem thông tin cá nhân",
      path: path.customerProfile
    },
    {
      key: "update-profile",
      icon: <EditOutlined />,
      label: "Cập Nhật Thông Tin",
      title: "Cập nhật thông tin cá nhân",
      path: path.customerUpdateProfile
    },
    {
      key: "services",
      icon: <MedicineBoxOutlined />,
      label: "Dịch Vụ",
      title: "Xem dịch vụ đã đăng ký",
      path: path.customerServices
    },
    {
      key: "appointments",
      icon: <CalendarOutlined />,
      label: "Lịch Hẹn",
      title: "Quản lý lịch hẹn khám",
      path: path.customerAppointments
    },
    {
      key: "treatment",
      icon: <HeartOutlined />,
      label: "Điều Trị",
      title: "Theo dõi lịch trình điều trị",
      path: path.customerTreatment
    },
    {
      key: "medical-record",
      icon: <FileTextOutlined />,
      label: "Hồ Sơ Y Tế",
      title: "Xem hồ sơ bệnh án",
      path: path.customerMedicalRecord
    },
    {
      key: "notifications",
      icon: (
        <Badge count={3} size="small">
          <BellOutlined />
        </Badge>
      ),
      label: "Thông Báo",
      title: "Thông báo lịch khám và nhắc nhở",
      path: path.customerNotifications
    },
    {
      key: "reviews",
      icon: <StarOutlined />,
      label: "Đánh Giá",
      title: "Đánh giá dịch vụ",
      path: path.customerReviews
    },
    {
      key: "feedback",
      icon: <MessageOutlined />,
      label: "Phản Hồi",
      title: "Gửi phản hồi và khiếu nại",
      path: path.customerFeedback
    },
    {
      key: "payment",
      icon: <CreditCardOutlined />,
      label: "Thanh Toán",
      title: "Quản lý thanh toán",
      path: path.customerPayment
    }
  ];

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem("token");
    window.location.href = "/sign-in";
  };

  return (
    <div style={{ height: "100%" }}>
      {/* Customer Info */}
      <div style={{ 
        padding: collapsed ? "16px 8px" : "24px", 
        textAlign: "center",
        background: "#fafafa",
        borderBottom: "1px solid #f0f0f0"
      }}>
        <Avatar 
          size={collapsed ? 40 : 64} 
          icon={<UserOutlined />}
          style={{ backgroundColor: "#52c41a", marginBottom: collapsed ? 0 : 12 }}
        />
        {!collapsed && (
          <>
            <div style={{ marginTop: 8 }}>
              <Text strong style={{ fontSize: "16px", color: "#52c41a" }}>
                Phú Lâm Nguyên
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Khách hàng thân thiết
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
          height: "calc(100% - 200px)"
        }}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: (
            <Link 
              to={item.path}
              title={collapsed ? item.title : ""}
            >
              {item.label}
            </Link>
          )
        }))}
      />

      {/* Bottom Actions */}
      {!collapsed && (
        <div style={{ 
          position: "absolute", 
          bottom: 16, 
          left: 16, 
          right: 16
        }}>
          <Divider style={{ margin: "8px 0" }} />
          
          <Menu
            mode="inline"
            style={{ border: "none", background: "transparent" }}
            items={[
              {
                key: "settings",
                icon: <SettingOutlined />,
                label: "Cài đặt"
              },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: (
                  <span onClick={handleLogout} style={{ color: "#ff4d4f" }}>
                    Đăng xuất
                  </span>
                )
              }
            ]}
          />
          
          <Text type="secondary" style={{ fontSize: "11px", display: "block", textAlign: "center", marginTop: "8px" }}>
            Hệ thống khách hàng v1.0
          </Text>
        </div>
      )}
    </div>
  );
};

export default CustomerSidebar;