import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Avatar,
  Row,
  Col,
  Statistic,
  Timeline,
  Badge,
  Select,
  Input
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

const TodayExaminations = () => {
  const [examinations, setExaminations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Mock data - thay thế bằng API
  const todayExaminations = [
    {
      key: 1,
      time: "08:00",
      patientName: "Nguyễn Thị Lan",
      patientId: "BN001",
      doctorName: "BS. Trần Văn Nam",
      service: "Khám tư vấn IVF",
      status: "waiting",
      phone: "0912345678",
      notes: "Lần khám đầu tiên",
      room: "P101"
    },
    {
      key: 2,
      time: "08:30",
      patientName: "Lê Minh Hạnh",
      patientId: "BN002", 
      doctorName: "BS. Nguyễn Thị Mai",
      service: "Theo dõi phôi",
      status: "in-progress",
      phone: "0987654321",
      notes: "Tuần thứ 2 sau chuyển phôi",
      room: "P102"
    },
    {
      key: 3,
      time: "09:00",
      patientName: "Phạm Văn Đức",
      patientId: "BN003",
      doctorName: "BS. Trần Văn Nam", 
      service: "IUI lần 2",
      status: "completed",
      phone: "0901234567",
      notes: "Hoàn thành thủ thuật",
      room: "P103"
    },
    {
      key: 4,
      time: "09:30",
      patientName: "Hoàng Thị Nga",
      patientId: "BN004",
      doctorName: "BS. Lê Văn Hùng",
      service: "Xét nghiệm hormone",
      status: "cancelled",
      phone: "0934567890",
      notes: "Bệnh nhân hủy phút chót",
      room: "P104"
    },
    {
      key: 5,
      time: "10:00",
      patientName: "Trần Thị Hoa",
      patientId: "BN005",
      doctorName: "BS. Nguyễn Thị Mai",
      service: "Siêu âm thai",
      status: "waiting",
      phone: "0945678901",
      notes: "Siêu âm 8 tuần",
      room: "P105"
    }
  ];

  useEffect(() => {
    setExaminations(todayExaminations);
    setFilteredData(todayExaminations);
  }, []);

  useEffect(() => {
    let filtered = examinations;
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(item => 
        item.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.patientId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.doctorName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [statusFilter, searchText, examinations]);

  const getStatusTag = (status) => {
    const statusMap = {
      waiting: { color: "blue", text: "Đang chờ", icon: <ClockCircleOutlined /> },
      "in-progress": { color: "orange", text: "Đang khám", icon: <ExclamationCircleOutlined /> },
      completed: { color: "green", text: "Hoàn thành", icon: <CheckCircleOutlined /> },
      cancelled: { color: "red", text: "Đã hủy", icon: <ClockCircleOutlined /> }
    };
    
    const config = statusMap[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      width: 80,
      render: (time) => (
        <Tag color="cyan" icon={<ClockCircleOutlined />}>
          {time}
        </Tag>
      )
    },
    {
      title: "Bệnh nhân",
      key: "patient",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.patientName}</div>
          <div className="text-sm text-gray-500">ID: {record.patientId}</div>
          <div className="text-sm text-gray-500">{record.phone}</div>
        </div>
      )
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (name) => (
        <div className="flex items-center">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
          {name}
        </div>
      )
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      render: (room) => <Tag color="purple">{room}</Tag>
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" type="primary">Chi tiết</Button>
          {record.status === "waiting" && (
            <Button size="small" type="default">Bắt đầu</Button>
          )}
        </Space>
      )
    }
  ];

  // Statistics
  const stats = {
    total: examinations.length,
    waiting: examinations.filter(e => e.status === "waiting").length,
    inProgress: examinations.filter(e => e.status === "in-progress").length,
    completed: examinations.filter(e => e.status === "completed").length,
    cancelled: examinations.filter(e => e.status === "cancelled").length
  };

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng lịch khám"
              value={stats.total}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={stats.waiting}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang khám"
              value={stats.inProgress}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              placeholder="Lọc theo trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="waiting">Đang chờ</Option>
              <Option value="in-progress">Đang khám</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm bệnh nhân, ID, bác sĩ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={10}>
            <div className="text-right">
              <span className="text-gray-500">
                Ngày: {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Examinations Table */}
      <Card title="Lịch Khám Hôm Nay">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default TodayExaminations; 