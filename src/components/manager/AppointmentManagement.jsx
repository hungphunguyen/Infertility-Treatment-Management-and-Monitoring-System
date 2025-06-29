import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Tag,
  Space,
  Typography,
  Spin,
  DatePicker,
  Select,
  Button,
  Input,
  message,
} from "antd";
import { treatmentService } from "../../service/treatment.service";
import { 
  UserOutlined, 
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { http } from "../../service/config";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AppointmentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stepId, setStepId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(null);

  useEffect(() => {
    fetchAppointments(page, pageSize);
    // eslint-disable-next-line
  }, [page, pageSize, statusFilter, stepId, customerId, doctorId, date]);

  const fetchAppointments = async (pageParam = 1, sizeParam = 10) => {
    try {
      setLoading(true);
      const response = await http.get("/api/v1/appointments", {
        params: {
          stepId: stepId || undefined,
          customerId: customerId || undefined,
          doctorId: doctorId || undefined,
          date: date ? date.format("YYYY-MM-DD") : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          page: pageParam - 1,
          size: sizeParam,
        },
      });
      if (response?.data?.result?.content) {
        const mapped = response.data.result.content.map((item) => ({
          ...item,
          startDate: item.date,
          treatmentServiceName: item.purpose || item.serviceName,
          createdDate: item.createdAt,
          appointmentDate: item.date,
        }));
        setAppointments(mapped);
        setFilteredAppointments(mapped);
        setTotal(response.data.result.totalElements || 0);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "CONFIRMED":
        return "blue";
      case "CANCELLED":
        return "red";
      case "COMPLETED":
        return "green";
      case "PENDING_CHANGE":
        return "gold";
      case "REJECTED_CHANGE":
        return "volcano";
      case "REJECTED":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      case "COMPLETED":
        return "Hoàn thành";
      case "PENDING_CHANGE":
        return "Chờ duyệt đổi lịch";
      case "REJECTED_CHANGE":
        return "Từ chối đổi lịch";
      case "REJECTED":
        return "Đang điều trị";
      default:
        return status;
    }
  };

  useEffect(() => {
    let filtered = [...appointments];

    // Lọc theo searchText
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (appointment) =>
          (appointment.customerName &&
            appointment.customerName.toLowerCase().includes(lower)) ||
          (appointment.doctorName && appointment.doctorName.toLowerCase().includes(lower)) ||
          (appointment.purpose &&
            appointment.purpose.toLowerCase().includes(lower)) ||
          (appointment.id && appointment.id.toString().includes(lower))
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter);
    }

    // Lọc theo dịch vụ/bước điều trị
    if (serviceFilter !== "all") {
      filtered = filtered.filter((appointment) =>
        (appointment.serviceName || "").includes(serviceFilter)
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchText, statusFilter, serviceFilter]);

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
      render: (name) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <Text strong>{name}</Text>
        </Space>
      )
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
      width: 150,
      render: (name) => (
        <Space>
          <UserOutlined style={{ color: '#722ed1' }} />
          <Text>{name}</Text>
        </Space>
      )
    },
    {
      title: "Mục đích",
      dataIndex: "purpose",
      key: "purpose",
      width: 200,
      render: (text) => (
        <Space>
          <MedicineBoxOutlined style={{ color: '#722ed1' }} />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      width: 120,
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {dayjs(date).format("DD/MM/YYYY")}
        </Space>
      )
    },
    {
      title: "Ca khám",
      dataIndex: "shift",
      key: "shift",
      width: 100,
      render: (shift) => (
        <Tag color="cyan">
          {shift === "MORNING" ? "Sáng" : shift === "AFTERNOON" ? "Chiều" : shift}
        </Tag>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Title level={4}>
          <Space>
            <FileTextOutlined />
            Quản lý lịch hẹn điều trị
          </Space>
        </Title>

        <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <Input
            placeholder="Step ID"
            value={stepId}
            onChange={e => setStepId(e.target.value)}
            style={{ width: 120 }}
            allowClear
          />
          <Input
            placeholder="Customer ID"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            style={{ width: 120 }}
            allowClear
          />
          <Input
            placeholder="Doctor ID"
            value={doctorId}
            onChange={e => setDoctorId(e.target.value)}
            style={{ width: 120 }}
            allowClear
          />
          <DatePicker
            placeholder="Ngày hẹn"
            value={date}
            onChange={setDate}
            style={{ width: 140 }}
            allowClear
          />
          <Input.Search
            placeholder="Tìm kiếm khách hàng, bác sĩ, dịch vụ, mã lịch hẹn..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 220 }}
          />
          <Select
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "PENDING", label: "Chờ xác nhận" },
              { value: "CONFIRMED", label: "Đã xác nhận" },
              { value: "COMPLETED", label: "Hoàn thành" },
              { value: "CANCELLED", label: "Đã hủy" },
              { value: "PENDING_CHANGE", label: "Chờ duyệt đổi lịch" },
              { value: "REJECTED_CHANGE", label: "Từ chối đổi lịch" },
              { value: "REJECTED", label: "Đang điều trị" },
            ]}
          />
          <Select
            style={{ width: 200 }}
            value={serviceFilter}
            onChange={setServiceFilter}
            options={[
              { value: "all", label: "Tất cả dịch vụ" },
              { value: "IUI", label: "Bơm tinh trùng vào buồng tử cung (IUI)" },
              { value: "IVF", label: "Thụ tinh trong ống nghiệm (IVF)" },
            ]}
          />
          <Button
            onClick={() => {
              setSearchText("");
              setStatusFilter("all");
              setServiceFilter("all");
              setStepId("");
              setCustomerId("");
              setDoctorId("");
              setDate(null);
            }}
          >
            Đặt lại
          </Button>
        </Space>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredAppointments}
            rowKey="id"
            scroll={{ x: 900 }}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total,
              showSizeChanger: false,
              showTotal: (total) => `Tổng số ${total} lịch hẹn`,
              onChange: (newPage) => setPage(newPage),
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
