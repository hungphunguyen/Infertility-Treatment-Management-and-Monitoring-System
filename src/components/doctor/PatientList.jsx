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
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT token manually
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        console.log('Decoded token:', decoded);
        setDoctorId(decoded.sub);
        console.log('Doctor ID from token:', decoded.sub);
      } catch (error) {
        console.error('Error decoding token:', error);
        message.error('Không thể xác thực thông tin bác sĩ');
      }
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchPatients();
    }
  }, [doctorId]);

  const calculateEndDate = (treatmentSteps) => {
    if (!treatmentSteps || treatmentSteps.length === 0) return null;

    // Lấy ngày thực hiện của bước cuối cùng đã hoàn thành
    const completedSteps = treatmentSteps.filter(step => step.status === "CONFIRMED");
    if (completedSteps.length > 0) {
      const lastCompletedStep = completedSteps[completedSteps.length - 1];
      return lastCompletedStep.actualDate;
    }

    // Nếu chưa có bước nào hoàn thành, lấy ngày dự kiến của bước cuối cùng
    const lastStep = treatmentSteps[treatmentSteps.length - 1];
    return lastStep.scheduledDate;
  };

  const getStatusTag = (status) => {
    const statusMap = {
      "InProgress": { color: "blue", text: "Đang điều trị" },
      "Completed": { color: "green", text: "Hoàn thành" },
      "Pending": { color: "orange", text: "Chờ xử lý" },
      "Cancelled": { color: "red", text: "Đã hủy" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const calculateProgress = (treatmentSteps) => {
    if (!treatmentSteps || treatmentSteps.length === 0) return 0;
    const completedSteps = treatmentSteps.filter(step => step.status === "CONFIRMED").length;
    return Math.round((completedSteps / treatmentSteps.length) * 100);
  };

  const getTreatmentProgress = (treatmentSteps, status) => {
    const progress = calculateProgress(treatmentSteps);
    let color = "#1890ff";
    if (status === "Completed") color = "#52c41a";
    if (status === "Cancelled") color = "#f5222d";
    
    return (
      <Progress 
        percent={progress} 
        size="small" 
        strokeColor={color}
        showInfo={false}
      />
    );
  };

  const fetchPatients = async () => {
    if (!doctorId) {
      message.error('Không tìm thấy ID bác sĩ');
      return;
    }

    try {
      setLoading(true);
      const response = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
      console.log('Fetch Patients Response:', response);
      
      if (response?.data?.code === 1000) {
        if (response.data.result && response.data.result.length > 0) {
          setPatients(response.data.result);
        } else {
          message.info('Chưa có bệnh nhân nào được gán cho bác sĩ này');
          setPatients([]);
        }
      } else {
        message.warning('API trả về mã không xác định: ' + response?.data?.code);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error('Có lỗi xảy ra khi lấy dữ liệu bệnh nhân: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const testApi = async () => {
    if (!doctorId) {
      message.error('Không tìm thấy ID bác sĩ');
      return;
    }

    try {
      setLoading(true);
      const response = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
      console.log('API Response:', response);
      setApiResponse(response);
      
      if (response?.data?.code === 1000) {
        if (response.data.result && response.data.result.length > 0) {
          message.success('Lấy dữ liệu thành công!');
          setPatients(response.data.result);
        } else {
          message.info('Chưa có bệnh nhân nào được gán cho bác sĩ này');
          setPatients([]);
        }
      } else {
        message.warning('API trả về mã không xác định: ' + response?.data?.code);
      }
    } catch (error) {
      console.error('API Error:', error);
      message.error('Lỗi khi gọi API: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const viewPatient = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
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
      key: "patient",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ marginRight: 12, backgroundColor: "#1890ff" }}
          />
          <div>
            <Text strong>{record.customerName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.customerId}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: "Điều trị",
      dataIndex: "treatmentServiceName",
      key: "treatmentServiceName",
      render: (treatment) => <Tag color="cyan">{treatment}</Tag>
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag
    },
    {
      title: "Tiến độ",
      key: "progress",
      render: (_, record) => (
        <div>
          {getTreatmentProgress(record.treatmentSteps, record.status)}
          <Text style={{ fontSize: "12px", color: "#666" }}>
            {calculateProgress(record.treatmentSteps)}%
          </Text>
        </div>
      )
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Ngày kết thúc",
      key: "endDate",
      render: (_, record) => {
        const endDate = calculateEndDate(record.treatmentSteps);
        return endDate ? dayjs(endDate).format("DD/MM/YYYY") : "-";
      }
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => viewPatient(record)}
          >
            Xem
          </Button>
          <Button 
            size="small" 
            type="primary"
            icon={<EditOutlined />}
          >
            Cập nhật
          </Button>
        </Space>
      )
    }
  ];

  // Filter data
  const filteredData = patients.filter(patient => {
    const matchesSearch = patient.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         patient.id.toString().includes(searchText);
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const timelineItems = selectedPatient?.treatmentSteps?.map((step, index) => ({
    key: index,
    color: step.status === "CONFIRMED" ? "green" : "blue",
    children: (
      <>
        <Text strong>{step.name}</Text>
        <br />
        <Text type="secondary">
          {step.scheduledDate ? `Ngày dự kiến: ${dayjs(step.scheduledDate).format("DD/MM/YYYY")}` : "Chưa lên lịch"}
        </Text>
        {step.actualDate && (
          <Text type="secondary">
            <br />
            Ngày thực hiện: {dayjs(step.actualDate).format("DD/MM/YYYY")}
          </Text>
        )}
        {step.notes && (
          <Text type="secondary">
            <br />
            Ghi chú: {step.notes}
          </Text>
        )}
      </>
    )
  })) || [];

  return (
    <div>
      {/* Test API Button */}
      <Card className="mb-6">
        <Row gutter={16} align="middle">
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={testApi}
                loading={loading}
              >
                Test API
              </Button>
              {doctorId && (
                <Text type="secondary">
                  Doctor ID: {doctorId}
                </Text>
              )}
              {apiResponse && (
                <Text type="secondary">
                  Last API Response: {JSON.stringify(apiResponse)}
                </Text>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm tên hoặc ID bệnh nhân..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="InProgress">Đang điều trị</Option>
              <Option value="Completed">Hoàn thành</Option>
              <Option value="Pending">Chờ xử lý</Option>
              <Option value="Cancelled">Đã hủy</Option>
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
      <Card title="Danh Sách Bệnh Nhân Đang Điều Trị">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
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
                <Descriptions.Item label="Mã bệnh nhân">{selectedPatient.customerId}</Descriptions.Item>
                <Descriptions.Item label="Bác sĩ">{selectedPatient.doctorName}</Descriptions.Item>
                <Descriptions.Item label="Phương pháp điều trị">{selectedPatient.treatmentServiceName}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusTag(selectedPatient.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Tiến độ">
                  <Progress 
                    percent={calculateProgress(selectedPatient.treatmentSteps)} 
                    size="small" 
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">
                  {dayjs(selectedPatient.startDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày kết thúc">
                  {calculateEndDate(selectedPatient.treatmentSteps) 
                    ? dayjs(calculateEndDate(selectedPatient.treatmentSteps)).format("DD/MM/YYYY") 
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {dayjs(selectedPatient.createdDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Thanh toán">
                  {selectedPatient.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            
            <TabPane tab="Tiến trình điều trị" key="progress">
              <Timeline items={timelineItems} />
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default PatientList; 