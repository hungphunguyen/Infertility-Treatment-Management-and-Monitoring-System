import React, { useState, useEffect, useContext } from "react";
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
import { managerService } from "../../service/manager.service";
import { NotificationContext } from "../../App";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    totalCustomersTreated: 0,
  });

  const [topServices, setTopServices] = useState([]);
  const { showNotification } = useContext(NotificationContext);
  const [chartData, setChartData] = useState([]);
  const [yAxisUnit, setYAxisUnit] = useState("VNĐ");
  const [yAxisDivider, setYAxisDivider] = useState(1);
  useEffect(() => {
    const renderData = async () => {
      try {
        const res1 = await managerService.managerStatistic();
        const res2 = await managerService.managerChart();
        const res3 = await managerService.managerDashboardService();

        if (res1?.data?.result) {
          setStatistics({
            totalRevenue: res1.data.result.totalRevenue,
            totalAppointments: res1.data.result.totalAppointments,
            totalCustomersTreated: res1.data.result.totalCustomersTreated,
          });
        }

        if (res2?.data?.result) {
          const parsedChartData = res2.data.result.map((item) => {
            const monthNumber = new Date(item.month).getMonth() + 1;
            return {
              month: `T${monthNumber}`,
              revenue: Number(item.totalRevenue),
              appointments: Number(item.totalTreatmentServiceInMonth),
            };
          });
          setChartData(parsedChartData);

          // Tính giá trị doanh thu lớn nhất
          const maxRevenue = Math.max(...parsedChartData.map((d) => d.revenue));

          // Lấy đơn vị phù hợp
          const { unit, divider } = getYAxisUnit(maxRevenue);

          // Lưu lại để dùng khi render
          setYAxisUnit(unit);
          setYAxisDivider(divider);
        }

        if (res3?.data?.result) {
          const totalRevenueAllServices = res3.data.result.reduce(
            (acc, item) => acc + item.totalRevenue,
            0
          ); // cộng tổng tất cả doanh thu của dịch vụ

          const servicesWithRatio = res3.data.result.map((item, index) => ({
            key: index,
            name: item.name,
            totalUses: item.totalUses,
            totalRevenue: item.totalRevenue,
            ratio: Math.round(
              (item.totalRevenue / totalRevenueAllServices) * 100
            ), // tính phần trăm của từng dịch vụ khi map ra
          }));

          setTopServices(servicesWithRatio);
        }
      } catch (error) {
        console.error(error);
        showNotification(error.response.data.message, "error");
      }
    };

    renderData();
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN") + " VNĐ";
  };

  const serviceColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "totalUses",
      key: "totalUses",
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Tỷ lệ",
      dataIndex: "ratio",
      key: "ratio",
      render: (value) => <Tag color="green">{value}%</Tag>,
    },
  ];

  const getYAxisUnit = (max) => {
    if (max >= 1_000_000_000) {
      return { unit: "tỷ", divider: 1_000_000_000 };
    }
    if (max >= 1_000_000) {
      return { unit: "triệu", divider: 1_000_000 };
    }
    if (max >= 1_000) {
      return { unit: "nghìn", divider: 1_000 };
    }
    return { unit: "VNĐ", divider: 1 }; // fallback
  };

  if (!statistics) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng Doanh Thu Tháng"
              value={statistics.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "green" }}
              formatter={formatCurrency}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Số Lịch Hẹn"
              value={statistics.totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "blue" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Bệnh Nhân Mới"
              value={statistics.totalCustomersTreated}
              prefix={<UserOutlined />}
              valueStyle={{ color: "red" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Biểu đồ */}
      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card title="Biểu Đồ Doanh Thu Theo Tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) =>
                    `${(value / yAxisDivider).toLocaleString(
                      "vi-VN"
                    )} ${yAxisUnit}`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString("vi-VN")} VNĐ`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  name="Lịch hẹn"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Bảng Top Dịch Vụ */}
      <Row style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card title="Top Dịch Vụ Theo Doanh Thu">
            <Table
              columns={serviceColumns}
              dataSource={topServices}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportDashboard;
