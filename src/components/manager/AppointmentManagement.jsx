import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Select,
  Input,
  Modal,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { http } from "../../service/config";

const { Title } = Typography;

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // backend page = 0-based
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(4);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [date, setDate] = useState(null);

  // Thống kê nhanh
  const totalAppointment = totalElements;
  const pendingAppointment = appointments.filter((a) => a.status === "PENDING").length;
  const completedAppointment = appointments.filter((a) => a.status === "COMPLETED").length;

  const fetchAppointments = async (page = 0) => {
    setLoading(true);
    try {
      // Chỉ truyền params có giá trị thực sự
      const params = { page, size: pageSize };
      if (filters.status) params.status = filters.status;
      if (date) params.date = date.format("YYYY-MM-DD");
      // Nếu có thêm stepId, customerId, doctorId thì kiểm tra và thêm tương tự

      const res = await http.get("v1/appointments", { params });
      if (res?.data?.result?.content) {
        setAppointments(res.data.result.content);
        setTotalPages(res.data.result.totalPages);
        setTotalElements(res.data.result.totalElements);
        setCurrentPage(page);
      } else {
        setAppointments([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (error) {
      setAppointments([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [filters.status, date]);

  // Search/filter
  const filteredAppointments = appointments.filter((item) => {
    const doctorName = item.doctorName?.toLowerCase() || "";
    const customerName = item.customerName?.toLowerCase() || "";
    const matchKeyword =
      filters.keyword === "" ||
      customerName.includes(filters.keyword) ||
      doctorName.includes(filters.keyword);
    return matchKeyword;
  });

  // Modal chi tiết
  const openDetailModal = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalVisible(true);
  };

  const getStatusLabel = (status) => {
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

  return (
    <div>
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-6 rounded shadow text-center border border-blue-100">
          <p className="text-blue-700 font-semibold text-sm uppercase">Tổng lịch hẹn</p>
          <h2 className="text-4xl font-bold text-blue-600">{totalAppointment}</h2>
        </div>
        <div className="bg-orange-50 p-6 rounded shadow text-center border border-orange-100">
          <p className="text-red-600 font-semibold text-sm uppercase">Chờ xác nhận</p>
          <h2 className="text-4xl font-bold text-red-500">{pendingAppointment}</h2>
        </div>
        <div className="bg-green-50 p-6 rounded shadow text-center border border-green-100">
          <p className="text-green-700 font-semibold text-sm uppercase">Hoàn thành</p>
          <h2 className="text-4xl font-bold text-green-600">{completedAppointment}</h2>
        </div>
      </div>
      <Card title="Quản lý lịch hẹn điều trị">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Input
            placeholder="Tìm theo tên bệnh nhân hoặc bác sĩ"
            allowClear
            className="w-full md:w-1/3"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                keyword: e.target.value.toLowerCase(),
              }))
            }
          />
          <Select
            placeholder="Lọc trạng thái"
            allowClear
            className="w-full md:w-1/4"
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <Select.Option value="">Tất cả trạng thái</Select.Option>
            <Select.Option value="PENDING">Chờ xác nhận</Select.Option>
            <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
            <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
            <Select.Option value="CANCELLED">Đã hủy</Select.Option>
            <Select.Option value="PENDING_CHANGE">Chờ duyệt đổi lịch</Select.Option>
            <Select.Option value="REJECTED_CHANGE">Từ chối đổi lịch</Select.Option>
            <Select.Option value="REJECTED">Đang điều trị</Select.Option>
          </Select>
          <DatePicker
            placeholder="Ngày hẹn"
            value={date}
            onChange={setDate}
            style={{ width: 140 }}
            allowClear
          />
        </div>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Bệnh nhân</th>
                <th className="px-4 py-3">Bác sĩ</th>
                <th className="px-4 py-3">Mục đích</th>
                <th className="px-4 py-3">Ngày hẹn</th>
                <th className="px-4 py-3">Ca khám</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.customerName}</td>
                  <td className="px-4 py-3 text-gray-500">{item.doctorName || "..."}</td>
                  <td className="px-4 py-3">{item.purpose}</td>
                  <td className="px-4 py-3">{item.appointmentDate ? dayjs(item.appointmentDate).format("DD/MM/YYYY") : ""}</td>
                  <td className="px-4 py-3">{item.shift === "MORNING" ? "Sáng" : item.shift === "AFTERNOON" ? "Chiều" : item.shift}</td>
                  <td className="px-4 py-3">
                    <Tag color={getStatusColor(item.status)}>{getStatusLabel(item.status)}</Tag>
                  </td>
                  <td className="px-4 py-3">
                    <Button type="primary" size="small" onClick={() => openDetailModal(item)}>
                      Xem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Button
              disabled={currentPage === 0}
              onClick={() => fetchAppointments(currentPage - 1)}
              className="mr-2"
            >
              Trang trước
            </Button>
            <span className="px-4 py-1 bg-gray-100 rounded text-sm">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => fetchAppointments(currentPage + 1)}
              className="ml-2"
            >
              Trang tiếp
            </Button>
          </div>
        </div>
        <Modal
          title="Chi tiết lịch hẹn"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          {selectedAppointment && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Bệnh nhân:</strong> {selectedAppointment.customerName}
              </p>
              <p>
                <strong>Bác sĩ:</strong> {selectedAppointment.doctorName || "Không rõ"}
              </p>
              <p>
                <strong>Mục đích:</strong> {selectedAppointment.purpose}
              </p>
              <p>
                <strong>Ngày hẹn:</strong> {selectedAppointment.appointmentDate ? dayjs(selectedAppointment.appointmentDate).format("DD/MM/YYYY") : ""}
              </p>
              <p>
                <strong>Ca khám:</strong> {selectedAppointment.shift === "MORNING" ? "Sáng" : selectedAppointment.shift === "AFTERNOON" ? "Chiều" : selectedAppointment.shift}
              </p>
              <p>
                <strong>Trạng thái:</strong> {getStatusLabel(selectedAppointment.status)}
              </p>
              <p>
                <strong>Ghi chú:</strong> {selectedAppointment.notes || ""}
              </p>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
