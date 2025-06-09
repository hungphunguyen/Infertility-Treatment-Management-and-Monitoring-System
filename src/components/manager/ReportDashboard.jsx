import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Table,
  Tag,
} from "antd";
import {
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportDashboard = () => {
  const [timeFilter, setTimeFilter] = useState("month");
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock data - thay thế bằng API calls
  const revenueData = [
    { month: "T1", revenue: 150000000, appointments: 120, services: 85 },
    { month: "T2", revenue: 180000000, appointments: 145, services: 102 },
    { month: "T3", revenue: 220000000, appointments: 168, services: 125 },
    { month: "T4", revenue: 195000000, appointments: 152, services: 110 },
    { month: "T5", revenue: 240000000, appointments: 189, services: 140 },
    { month: "T6", revenue: 280000000, appointments: 210, services: 165 },
  ];

  const serviceRevenueData = [
    { name: "IVF", value: 45, revenue: 450000000 },
    { name: "IUI", value: 25, revenue: 180000000 },
    { name: "Khám tư vấn", value: 20, revenue: 120000000 },
    { name: "Xét nghiệm", value: 10, revenue: 80000000 },
  ];

  const topServicesColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value) => `${value.toLocaleString("vi-VN")} VNĐ`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: "Tỷ lệ",
      dataIndex: "percentage",
      key: "percentage",
      render: (value) => <Tag color="green">{value}%</Tag>,
    },
  ];

  const topServicesData = [
    { key: 1, name: "IVF", count: 85, revenue: 450000000, percentage: 45 },
    { key: 2, name: "IUI", count: 65, revenue: 180000000, percentage: 25 },
    {
      key: 3,
      name: "Khám tư vấn",
      count: 120,
      revenue: 120000000,
      percentage: 20,
    },
    {
      key: 4,
      name: "Xét nghiệm",
      count: 45,
      revenue: 80000000,
      percentage: 10,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      {/* Key Metrics */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng Doanh Thu Tháng"
              value={280000000}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số Lịch Hẹn"
              value={210}
              valueStyle={{ color: "#1890ff" }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bệnh Nhân Mới"
              value={145}
              valueStyle={{ color: "#cf1322" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tăng Trưởng"
              value={16.7}
              precision={1}
              valueStyle={{ color: "#3f8600" }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} className="mb-6">
        <Col span={16}>
          <Card title="Biểu Đồ Doanh Thu Theo Tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [
                        `${value.toLocaleString("vi-VN")} VNĐ`,
                        "Doanh thu",
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={3}
                  name="Doanh thu"
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#82ca9d"
                  name="Lịch hẹn"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Phân Bố Doanh Thu Theo Dịch Vụ">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceRevenueData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Services Table */}
      <Card title="Top Dịch Vụ Theo Doanh Thu">
        <Table
          columns={topServicesColumns}
          dataSource={topServicesData}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default ReportDashboard;
