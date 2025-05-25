import React, { useState } from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

// Import components
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import CreateAccount from './components/CreateAccount';
import Settings from './components/Settings';

const { Header, Content } = Layout;
const { Title } = Typography;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const getPageTitle = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return 'Dashboard';
      case 'user-management':
        return 'Quản Lý User';
      case 'create-account':
        return 'Tạo Tài Khoản';
      case 'settings':
        return 'Cài Đặt';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'user-management':
        return <UserManagement />;
      case 'create-account':
        return <CreateAccount />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
      />

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <div className="flex justify-between items-center">
            <Title level={2} style={{ margin: 0 }}>
              {getPageTitle()}
            </Title>
            
            <Space>
              <Button type="primary" icon={<DownloadOutlined />}>
                Tải Báo Cáo
              </Button>
            </Space>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#f0f2f5' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage; 