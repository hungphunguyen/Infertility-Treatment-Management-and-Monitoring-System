import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Modal,
  Descriptions,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Spin,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";
import { doctorService } from "../../service/doctor.service";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const PatientList = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // backend page = 0-based
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await authService.getMyInfo();
        const id = res?.data?.result?.id;
        const name = res?.data?.result?.fullName;

        if (id) {
          setDoctorId(id);
          setDoctorName(name);
        } else {
          message.error("Không thể lấy thông tin bác sĩ");
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error);
        message.error("Không thể lấy thông tin bác sĩ");
      }
    };
    fetchDoctorInfo();
  }, []);

  useEffect(() => {
    if (!doctorId) return;
    fetchData();
  }, [doctorId]);

  const fetchData = async (page = 0) => {
    try {
      setLoading(true);

      // Sử dụng API mới để lấy lịch hẹn hôm nay
      const response = await doctorService.getAppointmentsToday(page, 8);
      setCurrentPage(page);
      setTotalPages(response.data.result.totalPages);
      if (response?.data?.result?.content) {
        const appointments = response.data.result.content;
        console.log("✅ Appointments loaded from new API:", appointments);
        setPatients(appointments);
      } else {
        console.warn("No appointments data from API");
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Có lỗi xảy ra khi lấy dữ liệu lịch hẹn");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredData = patients.filter((patient) => {
    const matchesSearch =
      patient.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.id.toString().includes(searchText);
    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusTag = (status) => {
    const statusMap = {
      CONFIRMED: { color: "blue", text: "Đã xác nhận" },
      PENDING: { color: "orange", text: "Chờ xác nhận" },
      PLANED: { color: "orange", text: "Đã đặt lịch" },
      REJECTED: { color: "red", text: "Từ chối yêu cầu thay đổi" },
      REJECTED_CHANGE: { color: "red", text: "Từ chối thay đổi" },
      PENDING_CHANGE: { color: "gold", text: "Yêu cầu thay đổi" },
      CANCELLED: { color: "red", text: "Đã hủy" },
      COMPLETED: { color: "green", text: "Đã hoàn thành" },
      INPROGRESS: { color: "blue", text: "Đang thực hiện" },
    };
    return (
      <Tag color={statusMap[status]?.color}>
        {statusMap[status]?.text || status}
      </Tag>
    );
  };

  const handleDetail = async (record) => {
    try {
      // Lấy chi tiết treatment record theo recordId
      const detailRes = await treatmentService.getTreatmentRecordById(record);
      const detail = detailRes?.data?.result;
      if (!detail) {
        message.error("Không lấy được chi tiết hồ sơ điều trị!");
        return;
      }
      navigate("/doctor-dashboard/treatment-stages", {
        state: {
          patientInfo: {
            customerId: detail.customerId,
            customerName: detail.customerName,
          },
          treatmentData: detail,
          sourcePage: "patients",
          appointmentData: record,
        },
      });
    } catch (error) {
      console.error("Error in handleDetail:", error);
      message.error("Có lỗi xảy ra khi tìm hồ sơ điều trị!");
    }
  };

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <div>
          <div>
            <Text strong>{name}</Text>
            <br />
          </div>
        </div>
      ),
    },
    {
      title: "Ca khám",
      dataIndex: "shift",
      key: "shift",
      render: (shift) => (
        <Tag color="cyan">
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
      key: "status",
      render: (record) => getStatusTag(record.status),
    },
    {
      title: "Mục đích",
      key: "purpose",
      render: (record) => {
        return <Tag color="purple">{record.purpose || "Chưa có"}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              handleDetail(record.recordId);
            }}
          >
            Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Filters */}
      <Card
        className="mb-6"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: 12,
          border: "none",
        }}
      >
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm tên hoặc ID bệnh nhân..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%", borderRadius: 8 }}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%", borderRadius: 8 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="PENDING">Chờ xác nhận</Option>
              <Option value="PLANED">Đã đặt lịch</Option>
              <Option value="COMPLETED">Đã hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={10} style={{ textAlign: "right" }}>
            <Text type="secondary">Tổng: {filteredData.length} bệnh nhân</Text>
          </Col>
        </Row>
      </Card>

      {/* Patient Table */}
      <Card
        style={{
          boxShadow: "0 4px 16px rgba(24,144,255,0.08)",
          borderRadius: 16,
          border: "none",
          marginBottom: 24,
        }}
      >
        <Spin spinning={loading}>
          {filteredData.length === 0 ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "#888",
                fontSize: 16,
              }}
            >
              <p>Không có bệnh nhân nào cần điều trị hôm nay.</p>
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1000 }}
                bordered
                style={{ borderRadius: 12, overflow: "hidden" }}
              />
              <div className="flex justify-end mt-4">
                <Button
                  disabled={currentPage === 0}
                  onClick={() => fetchData(currentPage - 1)}
                  className="mr-2"
                >
                  Trang trước
                </Button>
                <span className="px-4 py-1 bg-gray-100 rounded text-sm">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <Button
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => fetchData(currentPage + 1)}
                  className="ml-2"
                >
                  Trang tiếp
                </Button>
              </div>
            </>
          )}
        </Spin>
      </Card>

      {/* Patient Detail Modal */}
      <Modal
        title="Hồ Sơ Bệnh Nhân"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
        destroyOnHidden
      >
        {selectedPatient && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Họ tên">
              {selectedPatient.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="ID">
              {selectedPatient.id}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(selectedPatient.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Ca khám">
              {selectedPatient.shift === "MORNING" ? "Sáng" : "Chiều"}
            </Descriptions.Item>
            <Descriptions.Item label="Mục đích">
              {selectedPatient.purpose || "Chưa có"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PatientList;
