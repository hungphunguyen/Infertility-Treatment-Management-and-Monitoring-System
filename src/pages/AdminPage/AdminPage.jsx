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
