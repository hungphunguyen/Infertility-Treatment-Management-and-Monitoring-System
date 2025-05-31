import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Select, 
  DatePicker, 
  Input,
  Modal,
  Form,
  TimePicker,
  message,
  Row,
  Col,
  Avatar,
  Divider,
  Descriptions
} from "antd";
import { 
  SearchOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined,
  EditOutlined,
  EyeOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([
    {
      key: 1,
      id: "APT001",
      patientName: "Nguyễn Thị Lan",
      phone: "0912345678",
      email: "lan.nguyen@email.com",
      doctorName: "BS. Trần Văn Nam",
      service: "Khám tư vấn IVF",
      appointmentDate: "2024-01-15",
      appointmentTime: "09:00",
      status: "pending",
      notes: "Lần khám đầu tiên",
      createdDate: "2024-01-10"
    },
    {
      key: 2,
      id: "APT002",
      patientName: "Lê Minh Hạnh",
      phone: "0987654321",
      email: "hanh.le@email.com",
      doctorName: "BS. Nguyễn Thị Mai",
      service: "Theo dõi phôi",
      appointmentDate: "2024-01-16",
      appointmentTime: "14:30",
      status: "confirmed",
      notes: "Tuần thứ 2 sau chuyển phôi",
      createdDate: "2024-01-12"
    },
    {
      key: 3,
      id: "APT003",
      patientName: "Phạm Văn Đức",
      phone: "0901234567",
      email: "duc.pham@email.com",
      doctorName: "BS. Lê Văn Hùng",
      service: "IUI lần 2",
      appointmentDate: "2024-01-14",
      appointmentTime: "10:00",
      status: "cancelled",
      notes: "Hủy do bệnh nhân bận việc",
      createdDate: "2024-01-08"
    }
  ]);

  const [filteredData, setFilteredData] = useState(appointments);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // view, reschedule
  const [form] = Form.useForm();

  // Filter appointments
  React.useEffect(() => {
    let filtered = appointments;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.toLowerCase().includes(searchText.toLowerCase()) ||
        item.doctorName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [statusFilter, searchText, appointments]);

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: "orange", text: "Chờ xác nhận" },
      confirmed: { color: "green", text: "Đã xác nhận" },
      cancelled: { color: "red", text: "Đã hủy" },
      completed: { color: "blue", text: "Hoàn thành" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const confirmAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: "confirmed" } : apt
    ));
    message.success("Lịch hẹn đã được xác nhận!");
  };

  const cancelAppointment = (appointmentId) => {
    Modal.confirm({
      title: 'Xác nhận hủy lịch hẹn',
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      okText: 'Hủy lịch hẹn',
      cancelText: 'Đóng',
      onOk() {
        setAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
        ));
        message.success("Lịch hẹn đã được hủy!");
      }
    });
  };

  const viewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType("view");
    setIsModalVisible(true);
  };

  const rescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType("reschedule");
    form.setFieldsValue({
      appointmentDate: dayjs(appointment.appointmentDate),
      appointmentTime: dayjs(appointment.appointmentTime, "HH:mm"),
      notes: appointment.notes
    });
    setIsModalVisible(true);
  };

  const handleReschedule = (values) => {
    const { appointmentDate, appointmentTime, notes } = values;
    setAppointments(prev => prev.map(apt => 
      apt.id === selectedAppointment.id 
        ? { 
            ...apt, 
            appointmentDate: appointmentDate.format("YYYY-MM-DD"),
            appointmentTime: appointmentTime.format("HH:mm"),
            notes,
            status: "confirmed"
          } 
        : apt
    ));
    setIsModalVisible(false);
    form.resetFields();
    message.success("Lịch hẹn đã được sắp xếp lại!");
  };

  const columns = [
    {
      title: "Mã lịch hẹn",
      dataIndex: "id",
      key: "id",
      render: (id) => <Tag color="blue">{id}</Tag>
    },
    {
      title: "Bệnh nhân",
      key: "patient",
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
      title: "Ngày & Giờ",
      key: "datetime",
      render: (_, record) => (
        <div>
          <div>{dayjs(record.appointmentDate).format("DD/MM/YYYY")}</div>
          <div className="text-sm text-gray-500">{record.appointmentTime}</div>
        </div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => viewAppointment(record)}
          >
            Xem
          </Button>
          {record.status === "pending" && (
            <Button 
              size="small" 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={() => confirmAppointment(record.id)}
            >
              Xác nhận
            </Button>
          )}
          {(record.status === "pending" || record.status === "confirmed") && (
            <>
              <Button 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => rescheduleAppointment(record)}
              >
                Sắp xếp lại
              </Button>
              <Button 
                size="small" 
                danger 
                icon={<CloseCircleOutlined />}
                onClick={() => cancelAppointment(record.id)}
              >
                Hủy
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Filters */}
      <Card className="mb-6 shadow-md">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="cancelled">Đã hủy</Option>
              <Option value="completed">Hoàn thành</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm bệnh nhân, mã lịch hẹn, bác sĩ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col span={10}>
            <div className="text-right">
              <span className="text-gray-500">
                Tổng: {filteredData.length} lịch hẹn
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Appointments Table */}
      <Card title="Danh Sách Lịch Hẹn" className="shadow-md">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modals */}
      <Modal
        title={modalType === "view" ? "Chi Tiết Lịch Hẹn" : "Sắp Xếp Lại Lịch Hẹn"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={modalType === "view" ? [
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ] : [
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Lưu thay đổi
          </Button>
        ]}
        width={600}
      >
        {modalType === "view" && selectedAppointment && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã lịch hẹn">{selectedAppointment.id}</Descriptions.Item>
            <Descriptions.Item label="Bệnh nhân">{selectedAppointment.patientName}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại">{selectedAppointment.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedAppointment.email}</Descriptions.Item>
            <Descriptions.Item label="Bác sĩ">{selectedAppointment.doctorName}</Descriptions.Item>
            <Descriptions.Item label="Dịch vụ">{selectedAppointment.service}</Descriptions.Item>
            <Descriptions.Item label="Ngày hẹn">
              {dayjs(selectedAppointment.appointmentDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ hẹn">{selectedAppointment.appointmentTime}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(selectedAppointment.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selectedAppointment.notes}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedAppointment.createdDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        )}

        {modalType === "reschedule" && (
          <Form form={form} layout="vertical" onFinish={handleReschedule}>
            <Form.Item
              name="appointmentDate"
              label="Ngày hẹn mới"
              rules={[{ required: true, message: "Vui lòng chọn ngày hẹn!" }]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>
            <Form.Item
              name="appointmentTime"
              label="Giờ hẹn mới"
              rules={[{ required: true, message: "Vui lòng chọn giờ hẹn!" }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} size="large" />
            </Form.Item>
            <Form.Item
              name="notes"
              label="Ghi chú"
            >
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentManagement; 