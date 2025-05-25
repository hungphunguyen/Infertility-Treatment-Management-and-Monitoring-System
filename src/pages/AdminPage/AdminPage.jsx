import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Card,
  Avatar,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Typography
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownloadOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Sider, Content, Header } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Mock data for users
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      fullName: 'John Doe',
      role: 'customer',
      status: 'active',
      createdAt: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      username: 'dr_smith',
      email: 'smith@clinic.com',
      fullName: 'Dr. Smith Wilson',
      role: 'doctor',
      status: 'active',
      createdAt: '2024-01-10',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      username: 'manager_jane',
      email: 'jane@clinic.com',
      fullName: 'Jane Manager',
      role: 'manager',
      status: 'active',
      createdAt: '2024-01-05',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    }
  ]);

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

  const roleColors = {
    admin: 'red',
    manager: 'blue',
    doctor: 'green',
    customer: 'orange'
  };

  const statusColors = {
    active: 'green',
    inactive: 'red',
    pending: 'orange'
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar, record) => (
        <Avatar src={avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: 'Tên Đăng Nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Họ Tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={roleColors[role]}>
          {role === 'admin' && 'Quản Trị Viên'}
          {role === 'manager' && 'Quản Lý'}
          {role === 'doctor' && 'Bác Sĩ'}
          {role === 'customer' && 'Khách Hàng'}
        </Tag>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {status === 'active' && 'Hoạt Động'}
          {status === 'inactive' && 'Không Hoạt Động'}
          {status === 'pending' && 'Chờ Duyệt'}
        </Tag>
      ),
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa user này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    message.success('Đã xóa user thành công!');
  };

  const handleSubmit = (values) => {
    if (editingUser) {
      // Update user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...values }
          : user
      ));
      message.success('Cập nhật user thành công!');
    } else {
      // Create new user
      const newUser = {
        id: Date.now(),
        ...values,
        createdAt: new Date().toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      };
      setUsers([...users, newUser]);
      message.success('Tạo user mới thành công!');
    }
    
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const renderDashboard = () => (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Users"
              value={users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bác Sĩ"
              value={users.filter(u => u.role === 'doctor').length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khách Hàng"
              value={users.filter(u => u.role === 'customer').length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Quản Lý"
              value={users.filter(u => u.role === 'manager').length}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Hoạt Động Gần Đây">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <Text strong>User mới đăng ký</Text>
              <br />
              <Text type="secondary">john_doe vừa tạo tài khoản</Text>
            </div>
            <Text type="secondary">2 giờ trước</Text>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <Text strong>Cập nhật thông tin</Text>
              <br />
              <Text type="secondary">Dr. Smith cập nhật hồ sơ</Text>
            </div>
            <Text type="secondary">5 giờ trước</Text>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderUserManagement = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Quản Lý User</Title>
        <Space>
          <Button icon={<SearchOutlined />}>Tìm Kiếm</Button>
          <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUser(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Thêm User Mới
          </Button>
        </Space>
      </div>
      
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} items`,
          }}
        />
      </Card>
    </div>
  );

  const renderCreateAccount = () => (
    <Card title="Tạo Tài Khoản Mới">
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tên Đăng Nhập"
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Họ Tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Nhập họ tên đầy đủ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập địa chỉ email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Mật Khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Vai Trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Select placeholder="Chọn vai trò">
                <Option value="customer">Khách Hàng</Option>
                <Option value="doctor">Bác Sĩ</Option>
                <Option value="manager">Quản Lý</Option>
                <Option value="admin">Quản Trị Viên</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Trạng Thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              initialValue="active"
            >
              <Select>
                <Option value="active">Hoạt Động</Option>
                <Option value="inactive">Không Hoạt Động</Option>
                <Option value="pending">Chờ Duyệt</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Tạo Tài Khoản
            </Button>
            <Button onClick={() => form.resetFields()}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );

  const renderSettings = () => (
    <Card title="Cài Đặt Hệ Thống">
      <div className="space-y-6">
        <div>
          <Title level={4}>Cài Đặt Email</Title>
          <Form layout="vertical">
            <Form.Item label="SMTP Server">
              <Input placeholder="smtp.gmail.com" />
            </Form.Item>
            <Form.Item label="SMTP Port">
              <Input placeholder="587" />
            </Form.Item>
            <Form.Item label="Email Username">
              <Input placeholder="your-email@gmail.com" />
            </Form.Item>
          </Form>
        </div>
        
        <div>
          <Title level={4}>Cài Đặt Bảo Mật</Title>
          <Form layout="vertical">
            <Form.Item label="Thời gian timeout session (phút)">
              <Input placeholder="30" />
            </Form.Item>
            <Form.Item label="Số lần đăng nhập sai tối đa">
              <Input placeholder="5" />
            </Form.Item>
          </Form>
        </div>

        <Button type="primary">Lưu Cài Đặt</Button>
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return renderDashboard();
      case 'user-management':
        return renderUserManagement();
      case 'create-account':
        return renderCreateAccount();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
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
          onClick={({ key }) => setSelectedMenu(key)}
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

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <div className="flex justify-between items-center">
            <Title level={2} style={{ margin: 0 }}>
              {selectedMenu === 'dashboard' && 'Dashboard'}
              {selectedMenu === 'user-management' && 'Quản Lý User'}
              {selectedMenu === 'create-account' && 'Tạo Tài Khoản'}
              {selectedMenu === 'settings' && 'Cài Đặt'}
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

      {/* Modal for Create/Edit User */}
      <Modal
        title={editingUser ? 'Chỉnh Sửa User' : 'Tạo User Mới'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên Đăng Nhập"
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Họ Tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Vai Trò"
                name="role"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="customer">Khách Hàng</Option>
                  <Option value="doctor">Bác Sĩ</Option>
                  <Option value="manager">Quản Lý</Option>
                  <Option value="admin">Quản Trị Viên</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Trạng Thái"
                name="status"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="active">Hoạt Động</Option>
                  <Option value="inactive">Không Hoạt Động</Option>
                  <Option value="pending">Chờ Duyệt</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Cập Nhật' : 'Tạo Mới'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminPage; 