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
import dayjs from "dayjs";
import { http } from "../../service/config";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AppointmentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await http.get("/appointments/get-all");
      if (response?.data?.result) {
        const mapped = response.data.result.map((item) => ({
          ...item,
          startDate: item.appointmentDate,
          treatmentServiceName: item.purpose || item.serviceName,
          createdDate: item.createdAt,
        }));
        setAppointments(mapped);
        setFilteredAppointments(mapped);
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
        (app) =>
          (app.customerName &&
            app.customerName.toLowerCase().includes(lower)) ||
          (app.doctorName && app.doctorName.toLowerCase().includes(lower)) ||
          (app.treatmentServiceName &&
            app.treatmentServiceName.toLowerCase().includes(lower)) ||
          (app.id && app.id.toString().includes(lower))
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Lọc theo dịch vụ/bước điều trị
    if (serviceFilter !== "all") {
      filtered = filtered.filter((app) =>
        (app.treatmentServiceName || "").includes(serviceFilter)
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchText, statusFilter, serviceFilter]);

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
      width: 200,
    },
    {
      title: "Dịch vụ điều trị",
      dataIndex: "treatmentServiceName",
      key: "treatmentServiceName",
      width: 300,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "Chưa có"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          {record.status === "PENDING" && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => handleUpdateStatus(record.id, "CONFIRMED")}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleUpdateStatus(record.id, "CANCELLED")}
              >
                Hủy
              </Button>
            </>
          )}
          {record.status === "CONFIRMED" && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleUpdateStatus(record.id, "COMPLETED")}
            >
              Hoàn thành
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      setLoading(true);
      const response = await treatmentService.updateAppointmentStatus(appointmentId, newStatus);
      if (response?.data?.code === 1000) {
        message.success(`Cập nhật trạng thái thành công!`);
        fetchAppointments(); // Refresh data
      } else {
        message.error(response?.data?.message || "Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Title level={4}>Quản lý lịch hẹn điều trị</Title>

        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm khách hàng, bác sĩ, dịch vụ, mã lịch hẹn..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Select
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "Completed", label: "Hoàn thành" },
              { value: "InProgress", label: "Đang thực hiện" },
              { value: "Pending", label: "Chờ xử lý" },
              { value: "Cancelled", label: "Đã hủy" },
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
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `Tổng số ${total} lịch hẹn`,
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
