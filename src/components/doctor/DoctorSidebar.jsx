import React, { useEffect, useState } from "react";
import {
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  Spin,
  Dropdown,
} from "antd";
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
import { useSelector } from "react-redux";

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
      key: "work-schedule",
      icon: <CalendarOutlined />,
      label: "Lịch Làm Việc",
      title: "Xem lịch làm việc của tôi",
      path: path.doctorWorkSchedule,
    },
    {
      key: "patients",
      icon: <TeamOutlined />,
      label: "Bệnh Nhân Hôm Nay",
      title: "Danh sách bệnh điều trị hôm nay",
      path: path.doctorPatients,
    },
    {
      key: "test-results",
      icon: <FileTextOutlined />,
      label: "Hồ Sơ Bệnh Nhân",
      title: "Quản lý kết quả xét nghiệm",
      path: path.doctorTestResults,
    },
    ,
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ Sơ",
      title: "Thông tin cá nhân bác sĩ",
      path: path.doctorProfile,
    },
  ];
  const token = useSelector((state) => state.authSlice);

  const navigate = useNavigate();
  const [infoUser, setInfoUser] = useState();
  useEffect(() => {
    if (!token) return;
    authService
      .getMyInfo(token.token)
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {});
  }, [token]);
  const checkLogin = () => {
    if (infoUser) {
      return (
        <div className="flex items-center gap-2 select-none cursor-pointer ">
          <Avatar
            className="w-12 h-12 rounded-full justify-center text-white font-bold hover:border-4 hover:border-orange-400 transition-all duration-300"
            src={infoUser.avatarUrl || undefined}
          ></Avatar>
          <span className="text-sm font-medium text-white">
            {infoUser.fullName}
          </span>
        </div>
      );
    }
  };

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
        transition: "width 0.2s",
      }}
    >
      {/* Doctor Info */}
      <div className="p-4 text-center">{checkLogin()}</div>

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
            <Link
              to={item.path}
              title={collapsed ? item.title : ""}
              style={{ color: "#fff" }}
            >
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
            color: "#bfbfbf",
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



