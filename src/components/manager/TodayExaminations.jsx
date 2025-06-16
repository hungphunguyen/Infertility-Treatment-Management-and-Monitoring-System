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
import { http } from "../../service/config";
import dayjs from "dayjs";

const { Option } = Select;
const { Search } = Input;

const shiftVN = {
  MORNING: 'Sáng',
  AFTERNOON: 'Chiều',
  FULL_DAY: 'Cả ngày'
};

const statusMap = {
  PENDING: { color: 'orange', text: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
  CONFIRMED: { color: 'blue', text: 'Đã xác nhận', icon: <ExclamationCircleOutlined /> },
  CANCELLED: { color: 'red', text: 'Đã hủy', icon: <ClockCircleOutlined /> },
  COMPLETED: { color: 'green', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
  PENDING_CHANGE: { color: 'gold', text: 'Chờ duyệt đổi lịch', icon: <ExclamationCircleOutlined /> },
  REJECTED_CHANGE: { color: 'volcano', text: 'Từ chối đổi lịch', icon: <ExclamationCircleOutlined /> }
};

const TodayExaminations = () => {
  const [examinations, setExaminations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await http.get('/appointments/get-all');
      const today = dayjs().format('YYYY-MM-DD');
      const todayAppointments = response.data.result
        .filter(item => item.appointmentDate === today)
        .map((item, idx) => ({
          key: item.id || idx,
          patientName: item.customerName,
          doctorName: item.doctorName,
          service: item.serviceName,
          shift: item.shift,
          status: item.status,
          phone: item.customerEmail,
        }));
      setExaminations(todayAppointments);
      setFilteredData(todayAppointments);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = examinations;
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    if (searchText) {
      filtered = filtered.filter(item =>
        (item.patientName && item.patientName.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.doctorName && item.doctorName.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    setFilteredData(filtered);
  }, [statusFilter, searchText, examinations]);

  const getStatusTag = (status) => {
    const config = statusMap[status] || { color: 'default', text: status };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Ca khám",
      dataIndex: "shift",
      key: "shift",
      width: 100,
      render: (shift) => (
        <Tag color="cyan" icon={<ClockCircleOutlined />}>{shiftVN[shift] || shift}</Tag>
      )
    },
    {
      title: "Bệnh nhân",
      key: "patient",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.patientName}</div>
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag
    }
  ];

  // Statistics
  const stats = {
    total: examinations.length,
    waiting: examinations.filter(e => e.status === "PENDING").length,
    inProgress: examinations.filter(e => e.status === "CONFIRMED").length,
    completed: examinations.filter(e => e.status === "COMPLETED").length,
    cancelled: examinations.filter(e => e.status === "CANCELLED").length
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
              title="Chờ xác nhận"
              value={stats.waiting}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã xác nhận"
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
              <Option value="PENDING">Chờ xác nhận</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm bệnh nhân, bác sĩ..."
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