import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
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
  DashboardOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

const ManagerSidebar = ({ collapsed, onCollapse, selectedMenu, onMenuSelect }) => {
  const menuItems = [
    {
      key: "report",
      icon: <BarChartOutlined />,
      label: "Báo Cáo Doanh Thu",
      path: path.managerDashboard
    },
    {
      key: "schedule",
      icon: <CalendarOutlined />,
      label: "Xếp Lịch Làm Việc",
      path: "/manager/schedule"
    },
    {
      key: "appointments",
      icon: <ScheduleOutlined />,
      label: "Quản Lý Lịch Hẹn",
      path: path.managerAppointments
    },
    {
      key: "doctor-schedule",
      icon: <UserOutlined />,
      label: "Lịch Bác Sĩ Hôm Nay",
      path: "/manager/doctor-schedule"
    },
    {
      key: "today-exams",
      icon: <ClockCircleOutlined />,
      label: "Lịch Khám Hôm Nay",
      path: "/manager/today-exams"
    },
    {
      key: "feedback",
      icon: <MessageOutlined />,
      label: "Quản Lý Feedback",
      path: "/manager/feedback"
    },
    {
      key: "services",
      icon: <AppstoreOutlined />,
      label: "Quản Lý Dịch Vụ",
      path: path.managerServices
    },
    {
      key: "blog",
      icon: <EditOutlined />,
      label: "Quản Lý Blog",
      path: "/manager/blog"
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="dark"
      width={250}
    >
      <div className="p-4 text-center">
        <DashboardOutlined className="text-white text-2xl" />
        {!collapsed && (
          <h3 className="text-white mt-2 mb-0">Manager Panel</h3>
        )}
      </div>

      <Menu
        theme="dark"
        selectedKeys={[selectedMenu]}
        mode="inline"
        style={{ borderRight: 0 }}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: (
            <Link to={item.path}>
              {item.label}
            </Link>
          )
        }))}
      />
    </Sider>
  );
};

export default ManagerSidebar;