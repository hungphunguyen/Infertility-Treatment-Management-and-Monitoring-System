import React, { useEffect, useState } from "react";
import { Avatar, Button, Layout, Menu } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { path } from "../../common/path";
import {
  BarChartOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  AppstoreOutlined,
  EditOutlined,
  DashboardOutlined,
  HomeOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { authService } from "../../service/auth.service";

const { Sider } = Layout;

const ManagerSidebar = ({
  collapsed,
  onCollapse,
  selectedMenu,
  onMenuSelect,
}) => {
  const menuItems = [
    {
      key: "report",
      icon: <BarChartOutlined />,
      label: "Báo Cáo Doanh Thu",
      path: path.managerDashboard,
    },
    {
      key: "schedule",
      icon: <CalendarOutlined />,
      label: "Xếp Lịch Làm Việc",
      path: "/manager/schedule",
    },
    {
      key: "appointments",
      icon: <ScheduleOutlined />,
      label: "Quản Lý Lịch Hẹn",
      path: path.managerAppointments,
    },
    {
      key: "doctor-schedule",
      icon: <UserOutlined />,
      label: "Lịch Bác Sĩ Hôm Nay",
      path: "/manager/doctor-schedule",
    },
    {
      key: "today-exams",
      icon: <ClockCircleOutlined />,
      label: "Lịch Khám Hôm Nay",
      path: "/manager/today-exams",
    },
    {
      key: "feedback",
      icon: <MessageOutlined />,
      label: "Quản Lý Feedback",
      path: "/manager/feedback",
    },
    {
      key: "services",
      icon: <AppstoreOutlined />,
      label: "Quản Lý Dịch Vụ",
      path: path.managerServices,
    },
    {
      key: "blog",
      icon: <EditOutlined />,
      label: "Quản Lý Blog",
      path: "/manager/blog-management",
    },
    {
      key: "update-profile",
      icon: <FormOutlined />,
      label: "Hồ Sơ",
      path: path.updataProfile,
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
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="dark"
      width={250}
      style={{
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        zIndex: 1000,
        overflow: "auto",
      }}
    >
      <div className="p-4 text-center">{checkLogin()}</div>

      <Menu
        theme="dark"
        selectedKeys={[selectedMenu]}
        mode="inline"
        style={{ borderRight: 0 }}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.path}>{item.label}</Link>,
        }))}
      />

      {/* Nút về trang chủ */}
      <div className="px-4 mt-4">
        <Button
          type="default"
          icon={<HomeOutlined />}
          style={{ width: "100%" }}
          onClick={() => navigate("/")}
        >
          {!collapsed && "Về Trang Chủ"}
        </Button>
      </div>
    </Sider>
  );
};

export default ManagerSidebar;
