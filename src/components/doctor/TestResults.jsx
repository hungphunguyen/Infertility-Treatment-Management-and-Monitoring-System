import React, { useState } from "react";
import { 
  Card, Table, Button, Space, Tag, Modal, Descriptions, 
  Row, Col, Input, Select, DatePicker, Typography, Alert,
  Upload, Tabs, List, Avatar, Badge
} from "antd";
import {
  FileTextOutlined, EyeOutlined, DownloadOutlined, UploadOutlined,
  CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
  UserOutlined, SearchOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const TestResults = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [testTypeFilter, setTestTypeFilter] = useState("all");

  // Mock test results data
  const testResults = [
    {
      key: 1,
      id: "XN001",
      patientId: "BN001",
      patientName: "Nguyễn Thị Mai",
      testType: "Hormone",
      testName: "Hormone sinh sản",
      orderDate: "2024-01-20",
      resultDate: "2024-01-21",
      status: "completed",
      priority: "normal",
      doctor: "BS. Nguyễn Văn A",
      results: {
        FSH: { value: "8.2", unit: "mIU/mL", normal: "3.5-12.5", status: "normal" },
        LH: { value: "5.8", unit: "mIU/mL", normal: "2.4-12.6", status: "normal" },
        AMH: { value: "1.2", unit: "ng/mL", normal: "1.0-4.0", status: "low" },
        E2: { value: "45", unit: "pg/mL", normal: "12.5-166.0", status: "normal" }
      },
      conclusion: "AMH thấp, cần theo dõi chức năng buồng trứng",
      notes: "Bệnh nhân cần tư vấn về dự trữ buồng trứng"
    },
    {
      key: 2,
      id: "XN002",
      patientId: "BN002",
      patientName: "Trần Văn Hùng",
      testType: "Tinh dịch đồ",
      testName: "Phân tích tinh dịch",
      orderDate: "2024-01-19",
      resultDate: "2024-01-20",
      status: "completed",
      priority: "normal",
      doctor: "BS. Nguyễn Văn A",
      results: {
        count: { value: "35", unit: "triệu/mL", normal: ">15", status: "normal" },
        motility: { value: "42", unit: "%", normal: ">40", status: "normal" },
        morphology: { value: "5", unit: "%", normal: ">4", status: "normal" },
        volume: { value: "3.2", unit: "mL", normal: "1.5-5.0", status: "normal" }
      },
      conclusion: "Chất lượng tinh trùng bình thường",
      notes: "Có thể tiến hành IUI"
    },
    {
      key: 3,
      id: "XN003",
      patientId: "BN003",
      patientName: "Lê Thị Lan",
      testType: "Siêu âm",
      testName: "Siêu âm buồng trứng",
      orderDate: "2024-01-21",
      resultDate: null,
      status: "pending",
      priority: "urgent",
      doctor: "BS. Nguyễn Văn A",
      results: null,
      conclusion: null,
      notes: "Cần siêu âm để đếm nang noãn"
    },
    {
      key: 4,
      id: "XN004",
      patientId: "BN001",
      patientName: "Nguyễn Thị Mai",
      testType: "Máu",
      testName: "Beta-HCG",
      orderDate: "2024-01-22",
      resultDate: "2024-01-22",
      status: "abnormal",
      priority: "urgent",
      doctor: "BS. Nguyễn Văn A",
      results: {
        betaHCG: { value: "1250", unit: "mIU/mL", normal: "Âm tính", status: "positive" }
      },
      conclusion: "Thai kỳ sớm",
      notes: "Cần theo dõi Beta-HCG định kỳ"
    }
  ];

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: "orange", text: "Chờ kết quả", icon: <ClockCircleOutlined /> },
      completed: { color: "green", text: "Hoàn thành", icon: <CheckCircleOutlined /> },
      abnormal: { color: "red", text: "Bất thường", icon: <ExclamationCircleOutlined /> }
    };
    return (
      <Tag color={statusMap[status]?.color} icon={statusMap[status]?.icon}>
        {statusMap[status]?.text}
      </Tag>
    );
  };

  const getPriorityTag = (priority) => {
    const priorityMap = {
      normal: { color: "default", text: "Bình thường" },
      urgent: { color: "red", text: "Khẩn cấp" }
    };
    return <Tag color={priorityMap[priority]?.color}>{priorityMap[priority]?.text}</Tag>;
  };

  const viewResult = (result) => {
    setSelectedResult(result);
    setModalVisible(true);
  };

  const renderTestValues = (results) => {
    if (!results) return null;
    
    return (
      <div>
        {Object.entries(results).map(([key, value]) => (
          <Row key={key} style={{ marginBottom: 8 }}>
            <Col span={8}>
              <Text strong>{key.toUpperCase()}:</Text>
            </Col>
            <Col span={6}>
              <Text>{value.value} {value.unit}</Text>
            </Col>
            <Col span={6}>
              <Text type="secondary">({value.normal})</Text>
            </Col>
            <Col span={4}>
              <Tag color={value.status === "normal" ? "green" : value.status === "positive" ? "blue" : "red"}>
                {value.status === "normal" ? "Bình thường" : 
                 value.status === "positive" ? "Dương tính" :
                 value.status === "low" ? "Thấp" : "Cao"}
              </Tag>
            </Col>
          </Row>
        ))}
      </div>
    );
  };

  const columns = [
    {
      title: "Mã XN",
      dataIndex: "id",
      key: "id",
      render: (id) => <Tag color="blue">{id}</Tag>
    },
    {
      title: "Bệnh nhân",
      key: "patient",
      render: (_, record) => (
        <div>
          <Text strong>{record.patientName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.patientId}
          </Text>
        </div>
      )
    },
    {
      title: "Loại xét nghiệm",
      dataIndex: "testType",
      key: "testType",
      render: (type) => <Tag color="cyan">{type}</Tag>
    },
    {
      title: "Tên xét nghiệm",
      dataIndex: "testName",
      key: "testName"
    },
    {
      title: "Ngày chỉ định",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Ngày có kết quả",
      dataIndex: "resultDate",
      key: "resultDate",
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-"
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: getPriorityTag
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
            onClick={() => viewResult(record)}
          >
            Xem
          </Button>
          {record.status === "completed" && (
            <Button 
              size="small" 
              icon={<DownloadOutlined />}
              type="primary"
            >
              Tải
            </Button>
          )}
        </Space>
      )
    }
  ];

  // Filter data
  const filteredData = testResults.filter(result => {
    const matchesSearch = result.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
                         result.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    const matchesType = testTypeFilter === "all" || result.testType === testTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Statistics
  const stats = {
    total: testResults.length,
    pending: testResults.filter(r => r.status === "pending").length,
    completed: testResults.filter(r => r.status === "completed").length,
    abnormal: testResults.filter(r => r.status === "abnormal").length
  };

  return (
    <div>
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
                {stats.total}
              </div>
              <div>Tổng xét nghiệm</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#faad14" }}>
                {stats.pending}
              </div>
              <div>Chờ kết quả</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>
                {stats.completed}
              </div>
              <div>Hoàn thành</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f5222d" }}>
                {stats.abnormal}
              </div>
              <div>Bất thường</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Search
              placeholder="Tìm kiếm bệnh nhân hoặc mã XN..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              value={testTypeFilter}
              onChange={setTestTypeFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả loại XN</Option>
              <Option value="Hormone">Hormone</Option>
              <Option value="Tinh dịch đồ">Tinh dịch đồ</Option>
              <Option value="Siêu âm">Siêu âm</Option>
              <Option value="Máu">Xét nghiệm máu</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="pending">Chờ kết quả</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="abnormal">Bất thường</Option>
            </Select>
          </Col>
          <Col span={10} style={{ textAlign: "right" }}>
            <Space>
              <Button type="primary" icon={<UploadOutlined />}>
                Tải lên kết quả
              </Button>
              <Text type="secondary">
                Tổng: {filteredData.length} kết quả
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Results Table */}
      <Card title="Kết Quả Xét Nghiệm">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Result Detail Modal */}
      <Modal
        title="Chi Tiết Kết Quả Xét Nghiệm"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="print" type="primary">
            In kết quả
          </Button>
        ]}
        width={800}
      >
        {selectedResult && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Mã xét nghiệm">{selectedResult.id}</Descriptions.Item>
              <Descriptions.Item label="Bệnh nhân">{selectedResult.patientName}</Descriptions.Item>
              <Descriptions.Item label="Mã bệnh nhân">{selectedResult.patientId}</Descriptions.Item>
              <Descriptions.Item label="Loại xét nghiệm">{selectedResult.testType}</Descriptions.Item>
              <Descriptions.Item label="Tên xét nghiệm">{selectedResult.testName}</Descriptions.Item>
              <Descriptions.Item label="Ngày chỉ định">
                {dayjs(selectedResult.orderDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày có kết quả">
                {selectedResult.resultDate ? dayjs(selectedResult.resultDate).format("DD/MM/YYYY") : "Chưa có"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedResult.status)}
              </Descriptions.Item>
            </Descriptions>

            {selectedResult.results && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Kết quả chi tiết:</Title>
                {renderTestValues(selectedResult.results)}
              </div>
            )}

            {selectedResult.conclusion && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Kết luận:</Title>
                <Alert 
                  message={selectedResult.conclusion} 
                  type={selectedResult.status === "abnormal" ? "error" : "info"}
                />
              </div>
            )}

            {selectedResult.notes && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Ghi chú:</Title>
                <Text>{selectedResult.notes}</Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TestResults; 