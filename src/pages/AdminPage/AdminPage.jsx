import React, { useState } from "react";
import { Layout, Typography, Button, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

// Import components
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminDashboard from "../../components/admin/AdminDashboard";
import UserManagement from "../../components/admin/UserManagement";
import CreateAccount from "../../components/admin/CreateAccount";

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const getPageTitle = () => {
    switch (selectedMenu) {
      case "dashboard":
        return "Dashboard";
      case "user-management":
        return "Quản Lý User";
      case "create-account":
        return "Tạo Tài Khoản";
      default:
        return "Dashboard";
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <AdminDashboard />;
      case "user-management":
        return <UserManagement />;
      case "create-account":
        return <CreateAccount />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
      />

      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              padding: "16px 0",
            }}
          >
            <Title
              level={3}
              style={{
                margin: 0,
                fontWeight: 700,
                color: "#1f2937",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {getPageTitle()}
            </Title>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#f0f2f5",
            minHeight: "calc(100vh - 112px)",
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
