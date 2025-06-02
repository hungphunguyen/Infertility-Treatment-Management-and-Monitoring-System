import React, { useState } from "react";
import { 
  Card, Table, Button, Space, Tag, Avatar, Modal, Tabs, Descriptions, 
  Timeline, Progress, Row, Col, Input, Select, Typography 
} from "antd";
import {
  UserOutlined, EyeOutlined, EditOutlined, SearchOutlined,
  PhoneOutlined, MailOutlined, CalendarOutlined, MedicineBoxOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientList = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock patient data
  const patients = [
    {
      key: 1,
      id: "BN001",
      name: "Nguyễn Thị Mai",
      age: 32,
      phone: "0912345678",
      email: "mai.nguyen@email.com",
      treatment: "IVF",
      status: "in-treatment",
      startDate: "2024-01-15",
      progress: 65,
      lastVisit: "2024-01-20",
      nextVisit: "2024-01-25",
      avatar: null,
      medicalHistory: "Vô sinh nguyên phát, AMH thấp",
      treatmentPlan: "Kích thích buồng trứng, theo dõi phôi",
      notes: "Bệnh nhân hợp tác tốt, phản ứng tốt với thuốc"
    },
    {
      key: 2,
      id: "BN002", 
      name: "Trần Văn Hùng",
      age: 35,
      phone: "0987654321",
      email: "hung.tran@email.com",
      treatment: "IUI",
      status: "completed",
      startDate: "2023-12-01",
      progress: 100,
      lastVisit: "2024-01-18",
      nextVisit: null,
      avatar: null,
      medicalHistory: "Giảm số lượng tinh trùng",
      treatmentPlan: "IUI với xử lý tinh trùng",
      notes: "Điều trị thành công, thai kỳ 8 tuần"
    },
    {
      key: 3,
      id: "BN003",
      name: "Lê Thị Lan", 
      age: 28,
      phone: "0901234567",
      email: "lan.le@email.com",
      treatment: "Tư vấn",
      status: "consulting",
      startDate: "2024-01-20",
      progress: 25,
      lastVisit: "2024-01-20",
      nextVisit: "2024-01-27",
      avatar: null,
      medicalHistory: "Chu kỳ kinh không đều",
      treatmentPlan: "Xét nghiệm hormone, siêu âm",
      notes: "Cần theo dõi thêm chu kỳ"
    },
    {
      key: 4,
      id: "BN004",
      name: "Phạm Minh Đức",
      age: 38,
      phone: "0934567890", 
      email: "duc.pham@email.com",
      treatment: "IVF",
      status: "paused",
      startDate: "2024-01-10",
      progress: 40,
      lastVisit: "2024-01-19",
      nextVisit: "2024-02-01",
      avatar: null,
      medicalHistory: "Nang buồng trứng đa nang",
      treatmentPlan: "Điều chỉnh hormone trước IVF",
      notes: "Tạm dừng để ổn định hormone"
    }
  ];

  const getStatusTag = (status) => {
    const statusMap = {
      "in-treatment": { color: "blue", text: "Đang điều trị" },
      "completed": { color: "green", text: "Hoàn thành" },
      "consulting": { color: "orange", text: "Tư vấn" },
      "paused": { color: "red", text: "Tạm dừng" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const getTreatmentProgress = (progress, status) => {
    let color = "#1890ff";
    if (status === "completed") color = "#52c41a";
    if (status === "paused") color = "#f5222d";
    
    return (
      <Progress 
        percent={progress} 
        size="small" 
        strokeColor={color}
        showInfo={false}
      />
    );
  };

  const viewPatient = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Mã BN",
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
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.age} tuổi • {record.phone}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: "Điều trị",
      dataIndex: "treatment",
      key: "treatment",
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
          {getTreatmentProgress(record.progress, record.status)}
          <Text style={{ fontSize: "12px", color: "#666" }}>
            {record.progress}%
          </Text>
        </div>
      )
    },
    {
      title: "Lần khám cuối",
      dataIndex: "lastVisit",
      key: "lastVisit",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Lần khám tới",
      dataIndex: "nextVisit",
      key: "nextVisit",
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-"
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
    const matchesSearch = patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm tên hoặc mã bệnh nhân..."
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
              <Option value="in-treatment">Đang điều trị</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="consulting">Tư vấn</Option>
              <Option value="paused">Tạm dừng</Option>
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
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
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
                <Descriptions.Item label="Mã bệnh nhân">{selectedPatient.id}</Descriptions.Item>
                <Descriptions.Item label="Họ tên">{selectedPatient.name}</Descriptions.Item>
                <Descriptions.Item label="Tuổi">{selectedPatient.age}</Descriptions.Item>
                <Descriptions.Item label="Điện thoại">{selectedPatient.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedPatient.email}</Descriptions.Item>
                <Descriptions.Item label="Phương pháp điều trị">{selectedPatient.treatment}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusTag(selectedPatient.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Tiến độ">
                  <Progress percent={selectedPatient.progress} size="small" />
                </Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">
                  {dayjs(selectedPatient.startDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Lần khám cuối">
                  {dayjs(selectedPatient.lastVisit).format("DD/MM/YYYY")}
                </Descriptions.Item>
              </Descriptions>
              
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Tiền sử bệnh</Title>
                <Text>{selectedPatient.medicalHistory}</Text>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Kế hoạch điều trị</Title>
                <Text>{selectedPatient.treatmentPlan}</Text>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Ghi chú</Title>
                <Text>{selectedPatient.notes}</Text>
              </div>
            </TabPane>
            
            <TabPane tab="Tiến trình điều trị" key="progress">
              <Timeline>
                <Timeline.Item color="green">
                  <Text strong>20/01/2024 - Khám tái khám</Text>
                  <br />
                  <Text type="secondary">Theo dõi phản ứng với thuốc kích thích. Kết quả tốt.</Text>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <Text strong>18/01/2024 - Tiêm thuốc kích thích</Text>
                  <br />
                  <Text type="secondary">Bắt đầu chu kỳ kích thích buồng trứng.</Text>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <Text strong>15/01/2024 - Bắt đầu điều trị</Text>
                  <br />
                  <Text type="secondary">Khám ban đầu, lập kế hoạch điều trị IVF.</Text>
                </Timeline.Item>
                <Timeline.Item>
                  <Text strong>10/01/2024 - Tư vấn ban đầu</Text>
                  <br />
                  <Text type="secondary">Tư vấn về phương pháp điều trị phù hợp.</Text>
                </Timeline.Item>
              </Timeline>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default PatientList; 