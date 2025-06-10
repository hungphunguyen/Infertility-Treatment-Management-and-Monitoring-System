import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Space, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

// Import components
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminDashboard from "../../components/admin/AdminDashboard";
import UserManagement from "../../components/admin/UserManagement";
import CreateAccount from "../../components/admin/CreateAccount";
import { useSelector } from "react-redux";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const token = useSelector((state) => state.authSlice);
  const [infoUser, setInfoUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    authService
      .getMyInfo(token.token)
      .then((res) => {
        console.log(res);
        const user = res.data.result;
        if (user.roleName.name !== "ADMIN") {
          showNotification("Bạn không có quyền truy cập trang này", "error");
          navigate("/");
          return;
        }
        setInfoUser(res.data.result);
      })
      .catch((err) => {
        navigate("/");
      });
  }, [token]);

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

  if (!infoUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

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
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              padding: "16px 0",
            }}
          >
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
              <p className="text-sm text-gray-500 mb-0">Admin Dashboard</p>
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
            minHeight: "calc(100vh - 112px)",
            marginLeft: 250,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
