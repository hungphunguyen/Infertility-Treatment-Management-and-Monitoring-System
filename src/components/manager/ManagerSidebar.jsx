import React from "react";
import { Layout, Menu } from "antd";
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
    },
    {
      key: "schedule",
      icon: <CalendarOutlined />,
      label: "Xếp Lịch Làm Việc",
    },
    {
      key: "appointments",
      icon: <ScheduleOutlined />,
      label: "Quản Lý Lịch Hẹn",
    },
    {
      key: "doctor-schedule",
      icon: <UserOutlined />,
      label: "Lịch Bác Sĩ Hôm Nay",
    },
    {
      key: "today-exams",
      icon: <ClockCircleOutlined />,
      label: "Lịch Khám Hôm Nay",
    },
    {
      key: "feedback",
      icon: <MessageOutlined />,
      label: "Quản Lý Feedback",
    },
    {
      key: "services",
      icon: <AppstoreOutlined />,
      label: "Quản Lý Dịch Vụ",
    },
    {
      key: "blog",
      icon: <EditOutlined />,
      label: "Quản Lý Blog",
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
        items={menuItems}
        onClick={({ key }) => onMenuSelect(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default ManagerSidebar; 