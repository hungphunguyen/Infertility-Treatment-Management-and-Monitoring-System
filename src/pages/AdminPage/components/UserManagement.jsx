import React from 'react';
import { Table, Button, Card, Avatar, Tag, Space, Typography } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const UserManagement = () => {
  // Mock data
  const users = [
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
      render: (avatar) => (
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
      render: () => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Quản Lý User</Title>
        <Space>
          <Button icon={<SearchOutlined />}>Tìm Kiếm</Button>
          <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
          <Button type="primary" icon={<PlusOutlined />}>
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
};

export default UserManagement; 