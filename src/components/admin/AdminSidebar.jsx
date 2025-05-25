import React from 'react';
import { Layout, Menu, Avatar, Typography, Button } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  PlusOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title, Text } = Typography;

const AdminSidebar = ({ collapsed, onCollapse, selectedMenu, onMenuSelect }) => {
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'user-management',
      icon: <TeamOutlined />,
      label: 'Quản Lý User',
    },
    {
      key: 'create-account',
      icon: <PlusOutlined />,
      label: 'Tạo Tài Khoản',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài Đặt',
    }
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="dark"
      width={250}
    >
      <div className="flex items-center justify-center py-4">
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          {collapsed ? 'A' : 'ADMIN'}
        </Title>
      </div>
      
      <div className="flex flex-col items-center py-4 border-b border-gray-600">
        <Avatar
          size={collapsed ? 40 : 60}
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        />
        {!collapsed && (
          <div className="text-center mt-2">
            <Text style={{ color: 'white' }}>Admin User</Text>
            <br />
            <Text style={{ color: '#8c8c8c' }}>VP Admin</Text>
          </div>
        )}
      </div>

      <Menu
        theme="dark"
        selectedKeys={[selectedMenu]}
        mode="inline"
        style={{ borderRight: 0, marginTop: 16 }}
        onClick={({ key }) => onMenuSelect(key)}
        items={menuItems}
      />

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          type="text"
          icon={<LogoutOutlined />}
          style={{ color: 'white', width: '100%' }}
        >
          {!collapsed && 'Đăng Xuất'}
        </Button>
      </div>
    </Sider>
  );
};

export default AdminSidebar; 