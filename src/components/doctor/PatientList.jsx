import React, { useState, useEffect } from "react";
import { 
  Card, Table, Button, Space, Tag, Avatar, Modal, Tabs, Descriptions, 
  Timeline, Progress, Row, Col, Input, Select, Typography, Spin, message 
} from "antd";
import {
  UserOutlined, EyeOutlined, EditOutlined, SearchOutlined,
  PhoneOutlined, MailOutlined, CalendarOutlined, MedicineBoxOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";
import { path } from "../../common/path";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientList = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [apiResponse, setApiResponse] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [treatmentRecords, setTreatmentRecords] = useState([]);
  const navigate = useNavigate();

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

    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchPatients(),
          fetchTreatmentRecords()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Có lỗi xảy ra khi lấy dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const fetchPatients = async () => {
    if (!doctorId) {
      message.error('Không tìm thấy ID bác sĩ');
      return;
    }
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const response = await treatmentService.getDoctorAppointmentsByDate(doctorId, today);
      if (response?.data?.result) {
        setPatients(response.data.result);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error('Có lỗi xảy ra khi lấy dữ liệu bệnh nhân');
      setPatients([]);
    }
  };

  const fetchTreatmentRecords = async () => {
    try {
      const records = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
      console.log('Fetched treatment records:', records);
      if (Array.isArray(records)) {
        setTreatmentRecords(records);
      } else {
        console.error('Treatment records is not an array:', records);
        setTreatmentRecords([]);
      }
    } catch (error) {
      console.error('Error fetching treatment records:', error);
      message.error('Không thể lấy thông tin quy trình điều trị');
      setTreatmentRecords([]);
    }
  };

  const testApi = async () => {
    if (!doctorId) {
      message.error('Không tìm thấy ID bác sĩ');
      return;
    }

    try {
      setLoading(true);
      const today = dayjs().format('YYYY-MM-DD');
      const response = await treatmentService.getDoctorAppointmentsByDate(doctorId, today);
      console.log('API Response:', response);
      setApiResponse(response);
      
      if (response?.data?.result && response.data.result.length > 0) {
        message.success('Lấy dữ liệu thành công!');
        setPatients(response.data.result);
      } else {
        message.info('Chưa có bệnh nhân nào được lên lịch hôm nay');
        setPatients([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      message.error('Lỗi khi gọi API: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  // Helper: enrich patients with today's treatment step info
  const today = dayjs().format('YYYY-MM-DD');
  const enrichedPatients = patients.map(patient => {
    const treatment = treatmentRecords.find(
      t => (t.customerId === patient.customerId || t.customerName === patient.customerName) && t.status === 'INPROGRESS'
    );
    let todayStep = null;
    if (treatment && Array.isArray(treatment.treatmentSteps)) {
      todayStep = treatment.treatmentSteps.find(
        step => step.scheduledDate && dayjs(step.scheduledDate).format('YYYY-MM-DD') === today
      );
    }
    return {
      ...patient,
      todayStepName: todayStep ? todayStep.name : null,
      todayStepStatus: todayStep ? todayStep.status : null,
      treatmentStatus: treatment ? treatment.status : null,
      treatmentRecordId: treatment ? treatment.id : null,
      hasTodayStep: !!todayStep
    };
  })
  .filter(patient => patient.treatmentStatus === 'INPROGRESS' && patient.hasTodayStep);

  // Updated status tag for step statuses
  const getStepStatusTag = (status) => {
    const statusMap = {
      CONFIRMED: { color: 'blue', text: 'Đã xác nhận' },
      PLANNED: { color: 'orange', text: 'Chờ thực hiện' },
      COMPLETED: { color: 'green', text: 'Hoàn thành' },
      CANCELLED: { color: 'red', text: 'Đã hủy' },
      IN_PROGRESS: { color: 'blue', text: 'Đang điều trị' },
    };
    const s = statusMap[status] || { color: 'default', text: status };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const getStatusTag = (status) => {
    const statusMap = {
      "CONFIRMED": { color: "blue", text: "Đang điều trị" },
      "PENDING": { color: "orange", text: "Đang chờ xử lý" },
      "REJECTED_CHANGE": { color: "red", text: "Từ chối thay đổi" },
      "CANCELLED": { color: "red", text: "Đã hủy" },
      "COMPLETED": { color: "green", text: "Đã hoàn thành" },
      "INPROGRESS": { color: "blue", text: "Đang thực hiện" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const handleUpdate = async (record) => {
    try {
      console.log('Selected patient record:', record);
      console.log('Available treatment records:', treatmentRecords);
      
      // Tìm treatment record dựa trên customerId hoặc customerName
      const patientTreatment = treatmentRecords.find(
        treatment => 
          treatment.customerId === record.customerId || 
          treatment.customerName === record.customerName
      );
      
      console.log('Found treatment record:', patientTreatment);

      if (patientTreatment) {
        // Đảm bảo dữ liệu được truyền đúng định dạng
        const stateData = {
          treatmentData: {
            ...patientTreatment,
            id: patientTreatment.id || record.id,
            customerId: patientTreatment.customerId || record.customerId,
            customerName: patientTreatment.customerName || record.customerName
          },
          patientInfo: {
            ...record,
            id: record.id || patientTreatment.id,
            customerId: record.customerId || patientTreatment.customerId
          }
        };

        // Kiểm tra dữ liệu trước khi navigate
        if (!stateData.patientInfo.customerId) {
          message.error('Không tìm thấy thông tin bệnh nhân');
          return;
        }

        // Navigate với dữ liệu đã được kiểm tra
        await navigate(path.doctorTreatmentStages, { 
          state: stateData,
          replace: true // Sử dụng replace để tránh lặp lại history
        });
        
        console.log('Navigation attempted to:', path.doctorTreatmentStages);
      } else {
        console.log('No treatment record found for patient:', record);
        message.warning('Chưa có thông tin quy trình điều trị cho bệnh nhân này');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      message.error('Có lỗi xảy ra khi chuyển trang');
    }
  };

  const handleApprove = async (record) => {
    try {
      const response = await treatmentService.updateAppointmentStatus(record.id, "CONFIRMED");
      if (response?.data?.code === 1000) {
        message.success("Đã duyệt lịch hẹn thành công");
        fetchPatients(); // Refresh the list
      } else {
        message.error("Không thể duyệt lịch hẹn");
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
      message.error("Có lỗi xảy ra khi duyệt lịch hẹn");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Tag color="blue">{id}</Tag>
    },
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ marginRight: 12, backgroundColor: "#1890ff" }}
          />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.customerEmail}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: "Ngày khám",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Ca khám",
      dataIndex: "shift",
      key: "shift",
      render: (shift) => <Tag color="cyan">{shift}</Tag>
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (record) => getStatusTag(record.status)
    },
    {
      title: "Dịch vụ",
      key: "serviceName",
      render: (record) => <Tag color="purple">{record.purpose || record.serviceName || 'Chưa có'}</Tag>
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => handleUpdate(record)}
          >
            Chi Tiết
          </Button>
        </Space>
      ),
    }
  ];

  // Filter data
  const filteredData = enrichedPatients.filter(patient => {
    const matchesSearch = patient.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         patient.id.toString().includes(searchText);
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const viewPatient = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  return (
    <div>
      {/* Filters */}
      <Card className="mb-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 12, border: 'none' }}>
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
              <Option value="REJECTED_CHANGE">Từ chối thay đổi</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={10} style={{ textAlign: "right" }}>
            <Text type="secondary">
              Tổng: {filteredData.length} bệnh nhân
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Patient Table */}
      <Card title={<span style={{ fontWeight: 600, fontSize: 20, color: '#1890ff' }}>Danh Sách Bệnh Nhân Hôm Nay</span>}
            style={{ boxShadow: '0 4px 16px rgba(24,144,255,0.08)', borderRadius: 16, border: 'none', marginBottom: 24 }}>
        <Spin spinning={loading}>
          {enrichedPatients.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#888', fontSize: 16 }}>
              <p>Không có bệnh nhân nào cần điều trị hôm nay.</p>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={enrichedPatients}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
              bordered
              style={{ borderRadius: 12, overflow: 'hidden' }}
            />
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
          <Button key="edit" type="primary">
            Chỉnh sửa
          </Button>
        ]}
        width={800}
      >
        {selectedPatient && (
          <Tabs defaultActiveKey="info">
            <TabPane tab="Thông tin cơ bản" key="info">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="ID">{selectedPatient.id}</Descriptions.Item>
                <Descriptions.Item label="Họ tên">{selectedPatient.customerName}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedPatient.customerEmail}</Descriptions.Item>
                <Descriptions.Item label="Bác sĩ">{selectedPatient.doctorName}</Descriptions.Item>
                <Descriptions.Item label="Dịch vụ">{selectedPatient.serviceName || "Chưa có"}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusTag(selectedPatient.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày khám">
                  {dayjs(selectedPatient.appointmentDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Ca khám">
                  {selectedPatient.shift}
                </Descriptions.Item>
                <Descriptions.Item label="Mục đích">
                  {selectedPatient.purpose || "Chưa có"}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">
                  {selectedPatient.notes || "Chưa có"}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default PatientList; 