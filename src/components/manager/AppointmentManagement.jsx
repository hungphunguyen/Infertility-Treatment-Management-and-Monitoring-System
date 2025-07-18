import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Typography,
  Button,
  Select,
  Input,
  Row,
  Col,
  Statistic,
  Tabs,
  Modal,
  Descriptions,
  Timeline,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  Alert,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SwapOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
  BellOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AppointmentManagement = () => {
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingChangeRequests, setLoadingChangeRequests] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filteredChangeRequests, setFilteredChangeRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedChangeRequest, setSelectedChangeRequest] = useState(null);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [changeRequestModalVisible, setChangeRequestModalVisible] = useState(false);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    changeRequests: 0,
  });
  const [changeRequestNotes, setChangeRequestNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // page index (0-based)
  const [totalPages, setTotalPages] = useState(1);

  const [changeRequestPage, setChangeRequestPage] = useState(0);
  const [changeRequestTotalPages, setChangeRequestTotalPages] = useState(1);

  // Fetch Appointments (không lấy PENDING_CHANGE)
  const fetchAppointments = async (page = 0) => {
    try {
      setLoadingAppointments(true);
      const response = await treatmentService.getAppointments({
        page: page,
        size: 8,
        // Nếu backend chưa hỗ trợ filter loại trừ status, phải filter ở FE:
        // status: "NOT_PENDING_CHANGE" // hoặc bỏ tham số này
      });
      const data = response?.data?.result?.content || [];
      // Nếu API trả về cả PENDING_CHANGE, filter ở đây:
      const appointmentsOnly = data.filter(
        (x) => x.status !== "PENDING_CHANGE"
      );
      setAppointments(appointmentsOnly);
      setFilteredAppointments(appointmentsOnly);
      setCurrentPage(page);
      setTotalPages(response?.data?.result?.totalPages);
    } catch (err) {
      notification.error({ message: "Lỗi khi tải lịch hẹn." });
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Fetch Change Requests (PENDING_CHANGE, lấy cả detail từng item)
  const fetchChangeRequests = async (page = 0) => {
    try {
      setLoadingChangeRequests(true);
      const response = await treatmentService.getAppointments({
        status: "PENDING_CHANGE",
        page: page,
        size: 8,
      });
      const pendingChangeAppointments = response?.data?.result?.content || [];
      // Lấy detail từng item (có thể song song, tối ưu performance):
      const detailPromises = pendingChangeAppointments.map(
        async (appointment) => {
          try {
            const detail = await http.get(`v1/appointments/${appointment.id}`);
            const detailData = detail?.data?.result;
            return { ...appointment, ...detailData };
          } catch (error) {
            return appointment; // fallback
          }
        }
      );
      const detailedChangeRequests = await Promise.all(detailPromises);

      setChangeRequests(detailedChangeRequests);
      setFilteredChangeRequests(detailedChangeRequests);
      setChangeRequestPage(page);
      setChangeRequestTotalPages(response?.data?.result?.totalPages);
    } catch (err) {
      notification.error({ message: "Lỗi khi tải yêu cầu đổi lịch." });
    } finally {
      setLoadingChangeRequests(false);
    }
  };

  // useEffect độc lập cho mỗi loại
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleApproveClick = (request) => {
    setSelectedChangeRequest(request);
    setChangeRequestModalVisible(true);
    setActionType('CONFIRMED');
    setChangeRequestNotes("");
  };

  const handleRejectClick = (request) => {
    setSelectedChangeRequest(request);
    setChangeRequestModalVisible(true);
    setActionType('REJECTED');
    setChangeRequestNotes("");
  };

  const handleChangeRequestAction = async () => {
    if (!changeRequestNotes || !changeRequestNotes.trim()) {
      notification.error({ message: "Vui lòng nhập ghi chú!" });
      return;
    }
    setActionLoading(true);
    try {
      await treatmentService.confirmAppointmentChange(selectedChangeRequest.id, { status: actionType, note: changeRequestNotes });
      notification.success({ 
        message: actionType === 'CONFIRMED' ? 'Đã duyệt yêu cầu!' : 'Đã từ chối yêu cầu!',
        description: `Yêu cầu thay đổi lịch hẹn của ${selectedChangeRequest.customerName} đã được ${actionType === 'CONFIRMED' ? 'duyệt' : 'từ chối'} thành công.`
      });
      setChangeRequestModalVisible(false);
      setChangeRequestNotes("");
      await fetchChangeRequests();
    } catch (err) {
      notification.error({ 
        message: 'Không thể cập nhật yêu cầu!',
        description: err?.response?.data?.message || err?.message || 'Lỗi không xác định.'
      });
    } finally {
      setActionLoading(false);
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
        return "volcano";
      case "PLANED":
        return "orange";
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
        return "Từ chối yêu cầu thay đổi";
      case "PLANED":
        return "Đã đặt lịch";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "CONFIRMED":
        return <ScheduleOutlined style={{ color: "#1890ff" }} />;
      case "PENDING":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "PENDING_CHANGE":
        return <SwapOutlined style={{ color: "#faad14" }} />;
      case "CANCELLED":
        return <CloseOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#d9d9d9" }} />;
    }
  };

  const showAppointmentDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentModalVisible(true);
  };

  const showChangeRequestDetail = (request) => {
    setSelectedChangeRequest(request);
    setChangeRequestModalVisible(true);
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.customerName?.toLowerCase().includes(lower) ||
          apt.doctorName?.toLowerCase().includes(lower) ||
          apt.purpose?.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((apt) =>
        dayjs(apt.appointmentDate).isSame(dateFilter, "day")
      );
    }

    setFilteredAppointments(filtered);
  };

  const filterChangeRequests = () => {
    let filtered = [...changeRequests];

    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.customerName?.toLowerCase().includes(lower) ||
          req.doctorName?.toLowerCase().includes(lower)
      );
    }

    setFilteredChangeRequests(filtered);
  };

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchText, statusFilter, dateFilter]);

  useEffect(() => {
    filterChangeRequests();
  }, [changeRequests, searchText]);

  const appointmentColumns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <Text strong>{name}</Text>
            {record.customerPhone && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {record.customerPhone}
                </Text>
              </>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (name) => (
        <Space>
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => (
        <Space direction="vertical" size="small">
          <Text strong>{dayjs(date).format("DD/MM/YYYY")}</Text>
        </Space>
      ),
    },
    {
      title: "Ca khám",
      dataIndex: "shift",
      key: "shift",
      render: (shift) => (
        <Tag color="cyan" icon={<ScheduleOutlined />}>
          {shift === "MORNING"
            ? "Sáng"
            : shift === "AFTERNOON"
            ? "Chiều"
            : shift}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showAppointmentDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const changeRequestColumns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <Text strong>{name}</Text>
            {record.customerEmail && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {record.customerEmail}
                </Text>
              </>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (name, record) => (
        <Space>
          <UserOutlined style={{ color: "#722ed1" }} />
          <div>
            <Text>{name}</Text>
            {record.doctorEmail && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {record.doctorEmail}
                </Text>
              </>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Lịch hiện tại",
      key: "currentSchedule",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>
            {dayjs(record.appointmentDate).format("DD/MM/YYYY")}
          </Text>
          <Tag color="blue">
            {record.shift === "MORNING" ? "Sáng" : "Chiều"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestedDate",
      key: "requestedDate",
      render: (t) =>
        t ? (
          <Text strong style={{ color: "#faad14" }}>
            {dayjs(t).format("DD/MM/YYYY")}
          </Text>
        ) : (
          <Text type="secondary">Chưa có thông tin</Text>
        ),
    },
    {
      title: "Ca yêu cầu",
      dataIndex: "requestedShift",
      key: "requestedShift",
      render: (s) =>
        s === "MORNING"
          ? "Sáng"
          : s === "AFTERNOON"
          ? "Chiều"
          : s || <Text type="secondary">Chưa có thông tin</Text>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showChangeRequestDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Tabs items for Antd 5+
  const tabItems = [
    {
      key: "appointments",
      label: (
        <span>
          <CalendarOutlined />
          Lịch hẹn ({filteredAppointments.length})
        </span>
      ),
      children: (
        <>
          {/* Filters */}
          <Card
            size="small"
            style={{ marginBottom: 16, background: "#fafafa" }}
          >
            <Row gutter={16} align="middle">
              <Col span={6}>
                <Input.Search
                  placeholder="Tìm kiếm bệnh nhân, bác sĩ..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Trạng thái"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: "100%" }}
                  options={[
                    { value: "all", label: "Tất cả" },
                    { value: "PENDING", label: "Chờ xác nhận" },
                    { value: "CONFIRMED", label: "Đã xác nhận" },
                    { value: "COMPLETED", label: "Hoàn thành" },
                    { value: "CANCELLED", label: "Đã hủy" },
                    { value: "PENDING_CHANGE", label: "Chờ đổi lịch" },
                  ]}
                />
              </Col>
              <Col span={4}>
                <DatePicker
                  placeholder="Chọn ngày"
                  value={dateFilter}
                  onChange={setDateFilter}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={4}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText("");
                    setStatusFilter("all");
                    setDateFilter(null);
                  }}
                >
                  Đặt lại
                </Button>
              </Col>
            </Row>
          </Card>

          <Spin spinning={loadingAppointments}>
            <Table
              pagination={false}
              columns={appointmentColumns}
              dataSource={filteredAppointments}
              rowKey="id"
              locale={{
                emptyText: loadingAppointments
                  ? ""
                  : "Không có lịch hẹn nào phù hợp hoặc dữ liệu chưa sẵn sàng.",
              }}
            />
            {/* Pagination buttons giống feedback */}
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
          </Spin>
        </>
      ),
    },
    {
      key: "changeRequests",
      label: (
        <span>
          <SwapOutlined />
          Yêu cầu thay đổi lịch hẹn
          {stats.changeRequests > 0 && (
            <Badge count={stats.changeRequests} style={{ marginLeft: 8 }} />
          )}
        </span>
      ),
      children: (
        <>
          {stats.changeRequests > 0 && (
            <Alert
              message={`Có ${stats.changeRequests} yêu cầu thay đổi lịch hẹn cần xử lý`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Spin spinning={loadingChangeRequests}>
            <Table
              columns={changeRequestColumns}
              pagination={false}
              dataSource={filteredChangeRequests}
              rowKey="id"
              locale={{
                emptyText: loadingChangeRequests
                  ? ""
                  : "Không có yêu cầu thay đổi lịch hẹn nào hoặc dữ liệu chưa sẵn sàng.",
              }}
            />
            <div className="flex justify-end mt-4">
              <Button
                disabled={changeRequestPage === 0}
                onClick={() => fetchChangeRequests(changeRequestPage - 1)}
                className="mr-2"
              >
                Trang trước
              </Button>
              <span className="px-4 py-1 bg-gray-100 rounded text-sm">
                Trang {changeRequestPage + 1} / {changeRequestTotalPages}
              </span>
              <Button
                disabled={changeRequestPage + 1 >= changeRequestTotalPages}
                onClick={() => fetchChangeRequests(changeRequestPage + 1)}
                className="ml-2"
              >
                Trang tiếp
              </Button>
            </div>
          </Spin>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Statistics */}

      {/* Main Content */}
      <Card
        style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Tabs
          defaultActiveKey="appointments"
          size="large"
          items={tabItems}
          onChange={(key) => {
            if (key === "changeRequests") {
              fetchChangeRequests();
            }
          }}
        />
      </Card>

      {/* Appointment Detail Modal */}
      <Modal
        title="Chi tiết lịch hẹn"
        open={appointmentModalVisible}
        onCancel={() => setAppointmentModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedAppointment && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Bệnh nhân" span={2}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Text strong>{selectedAppointment.customerName}</Text>
                  {selectedAppointment.customerPhone && (
                    <>
                      <br />
                      <Text type="secondary">
                        {selectedAppointment.customerPhone}
                      </Text>
                    </>
                  )}
                </div>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Bác sĩ">
              <Text>{selectedAppointment.doctorName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hẹn">
              <Text>
                {dayjs(selectedAppointment.appointmentDate).format(
                  "DD/MM/YYYY"
                )}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ca khám">
              <Tag color="cyan">
                {selectedAppointment.shift === "MORNING" ? "Sáng" : "Chiều"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(selectedAppointment.status)}>
                {getStatusText(selectedAppointment.status)}
              </Tag>
            </Descriptions.Item>
            {selectedAppointment.step && (
              <Descriptions.Item label="Bước điều trị" span={2}>
                <Text>{selectedAppointment.step}</Text>
              </Descriptions.Item>
            )}
            {selectedAppointment.notes && (
              <Descriptions.Item label="Ghi chú" span={2}>
                <Text>{selectedAppointment.notes}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Change Request Detail Modal */}
      <Modal
        title="Chi tiết yêu cầu thay đổi lịch hẹn"
        open={changeRequestModalVisible}
        onCancel={() => setChangeRequestModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedChangeRequest && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Bệnh nhân" span={2}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <Text strong>{selectedChangeRequest.customerName}</Text>
                    {selectedChangeRequest.customerEmail && (
                      <>
                        <br />
                        <Text type="secondary">
                          {selectedChangeRequest.customerEmail}
                        </Text>
                      </>
                    )}
                  </div>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ" span={2}>
                <Space>
                  <UserOutlined style={{ color: "#722ed1" }} />
                  <div>
                    <Text>{selectedChangeRequest.doctorName}</Text>
                    {selectedChangeRequest.doctorEmail && (
                      <>
                        <br />
                        <Text type="secondary">
                          {selectedChangeRequest.doctorEmail}
                        </Text>
                      </>
                    )}
                  </div>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Bước điều trị">
                <Text>{selectedChangeRequest.step}</Text>
              </Descriptions.Item>
            </Descriptions>
            <Timeline>
              <Timeline.Item color="blue">
                <Card size="small" title="Thông tin hiện tại">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Ngày hiện tại:</Text>
                      <br />
                      <Text>
                        {selectedChangeRequest.appointmentDate ? (
                          dayjs(selectedChangeRequest.appointmentDate).format(
                            "DD/MM/YYYY"
                          )
                        ) : (
                          <Text type="secondary">Chưa có thông tin</Text>
                        )}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Ca hiện tại:</Text>
                      <br />
                      <Tag color="blue">
                        {selectedChangeRequest.shift === "MORNING"
                          ? "Sáng"
                          : selectedChangeRequest.shift === "AFTERNOON"
                          ? "Chiều"
                          : selectedChangeRequest.shift}
                      </Tag>
                    </Col>
                  </Row>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Card size="small" title="Yêu cầu thay đổi">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Ngày yêu cầu:</Text>
                      <br />
                      {selectedChangeRequest.requestedDate ? (
                        <Text style={{ color: "#faad14" }}>
                          {dayjs(selectedChangeRequest.requestedDate).format(
                            "DD/MM/YYYY"
                          )}
                        </Text>
                      ) : (
                        <Text type="secondary">Chưa có thông tin</Text>
                      )}
                    </Col>
                    <Col span={12}>
                      <Text strong>Ca yêu cầu:</Text>
                      <br />
                      {selectedChangeRequest.requestedShift ? (
                        <Tag color="gold">
                          {selectedChangeRequest.requestedShift === "MORNING"
                            ? "Sáng"
                            : selectedChangeRequest.requestedShift ===
                              "AFTERNOON"
                            ? "Chiều"
                            : selectedChangeRequest.requestedShift}
                        </Tag>
                      ) : (
                        <Text type="secondary">Chưa có thông tin</Text>
                      )}
                    </Col>
                  </Row>
                </Card>
              </Timeline.Item>
            </Timeline>
            {selectedChangeRequest.notes && (
              <>
                <Divider />
                <Card size="small" title="Ghi chú">
                  <Text>{selectedChangeRequest.notes}</Text>
                </Card>
              </>
            )}
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <Text strong>Ghi chú xử lý:</Text>
              <Input.TextArea
                rows={3}
                value={changeRequestNotes}
                onChange={(e) => setChangeRequestNotes(e.target.value)}
                placeholder="Nhập ghi chú bắt buộc"
                style={{ marginTop: 8 }}
              />
            </div>
            <Space style={{ width: "100%", justifyContent: "center" }}>
              <Button
                type="primary"
                size="large"
                icon={<CheckOutlined />}
                style={{ minWidth: 120 }}
              >
                Duyệt yêu cầu
              </Button>
              <Button
                danger
                size="large"
                icon={<CloseOutlined />}
                style={{ minWidth: 120 }}
              >
                Từ chối yêu cầu
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentManagement;
