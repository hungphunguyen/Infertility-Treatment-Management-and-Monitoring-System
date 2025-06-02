import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Select,
  Input,
  Modal,
  Form,
  message,
  Row,
  Col,
  Rate,
  Avatar,
  Descriptions,
  Divider
} from "antd";
import { 
  CheckOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  MessageOutlined,
  UserOutlined,
  StarOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([
    {
      key: 1,
      id: "FB001",
      patientName: "Nguyễn Thị Lan",
      doctorName: "BS. Trần Văn Nam",
      service: "Khám tư vấn IVF",
      rating: 5,
      comment: "Bác sĩ rất tận tâm và chuyên nghiệp. Tôi rất hài lòng với dịch vụ tại đây.",
      status: "pending", // pending, approved, hidden
      type: "review", // review, complaint
      createdDate: "2024-01-15",
      responseText: null
    },
    {
      key: 2,
      id: "FB002", 
      patientName: "Lê Minh Hạnh",
      doctorName: "BS. Nguyễn Thị Mai",
      service: "Theo dõi phôi",
      rating: 4,
      comment: "Dịch vụ tốt, nhân viên thân thiện. Tuy nhiên thời gian chờ hơi lâu.",
      status: "approved",
      type: "review",
      createdDate: "2024-01-12",
      responseText: "Cảm ơn bạn đã phản hồi. Chúng tôi sẽ cải thiện thời gian chờ."
    },
    {
      key: 3,
      id: "FB003",
      patientName: "Phạm Văn Đức", 
      doctorName: "BS. Lê Văn Hùng",
      service: "IUI lần 2",
      rating: 2,
      comment: "Tôi không hài lòng với cách phục vụ. Nhân viên thiếu chuyên nghiệp và thái độ không tốt.",
      status: "pending",
      type: "complaint",
      createdDate: "2024-01-14",
      responseText: null
    },
    {
      key: 4,
      id: "FB004",
      patientName: "Hoàng Thị Nga",
      doctorName: "BS. Trần Văn Nam",
      service: "Xét nghiệm hormone",
      rating: 5,
      comment: "Rất chuyên nghiệp và tận tâm. Kết quả xét nghiệm chính xác.",
      status: "approved",
      type: "review",
      createdDate: "2024-01-10",
      responseText: "Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi."
    }
  ]);

  const [filteredData, setFilteredData] = useState(feedbacks);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // view, respond
  const [form] = Form.useForm();

  // Filter feedbacks
  React.useEffect(() => {
    let filtered = feedbacks;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.service.toLowerCase().includes(searchText.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [statusFilter, typeFilter, searchText, feedbacks]);

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: "orange", text: "Chờ duyệt" },
      approved: { color: "green", text: "Đã duyệt" },
      hidden: { color: "red", text: "Đã ẩn" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const getTypeTag = (type) => {
    const typeMap = {
      review: { color: "blue", text: "Đánh giá" },
      complaint: { color: "volcano", text: "Khiếu nại" }
    };
    return <Tag color={typeMap[type]?.color}>{typeMap[type]?.text}</Tag>;
  };

  const approveFeedback = (feedbackId) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === feedbackId ? { ...feedback, status: "approved" } : feedback
    ));
    message.success("Feedback đã được duyệt!");
  };

  const hideFeedback = (feedbackId) => {
    Modal.confirm({
      title: 'Xác nhận ẩn feedback',
      content: 'Bạn có chắc chắn muốn ẩn feedback này?',
      okText: 'Ẩn',
      cancelText: 'Hủy',
      onOk() {
        setFeedbacks(prev => prev.map(feedback => 
          feedback.id === feedbackId ? { ...feedback, status: "hidden" } : feedback
        ));
        message.success("Feedback đã được ẩn!");
      }
    });
  };

  const viewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setModalType("view");
    setIsModalVisible(true);
  };

  const respondToFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setModalType("respond");
    form.setFieldsValue({
      responseText: feedback.responseText || ""
    });
    setIsModalVisible(true);
  };

  const handleResponse = (values) => {
    const { responseText } = values;
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === selectedFeedback.id 
        ? { 
            ...feedback, 
            responseText,
            status: "approved"
          } 
        : feedback
    ));
    setIsModalVisible(false);
    form.resetFields();
    message.success("Phản hồi đã được gửi!");
  };

  const columns = [
    {
      title: "Mã FB",
      dataIndex: "id",
      key: "id",
      render: (id) => <Tag color="blue">{id}</Tag>
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (name) => (
        <div className="flex items-center">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
          {name}
        </div>
      )
    },
    {
      title: "Bác sĩ & Dịch vụ",
      key: "service",
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.doctorName}</div>
          <div className="text-sm text-gray-500">{record.service}</div>
        </div>
      )
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: getTypeTag
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating, record) => (
        <div>
          <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
          <div className="text-sm text-gray-500">{rating}/5 sao</div>
        </div>
      )
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      render: (comment) => (
        <div className="max-w-xs">
          <div className="truncate">{comment}</div>
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
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => viewFeedback(record)}
            >
              Xem
            </Button>
            <Button 
              size="small" 
              type="primary"
              icon={<MessageOutlined />}
              onClick={() => respondToFeedback(record)}
            >
              Phản hồi
            </Button>
          </Space>
          <Space>
            {record.status === "pending" && (
              <Button 
                size="small" 
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => approveFeedback(record.id)}
              >
                Duyệt
              </Button>
            )}
            {record.status !== "hidden" && (
              <Button 
                size="small" 
                danger
                icon={<EyeInvisibleOutlined />}
                onClick={() => hideFeedback(record.id)}
              >
                Ẩn
              </Button>
            )}
          </Space>
        </Space>
      )
    }
  ];

  // Statistics
  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === "pending").length,
    approved: feedbacks.filter(f => f.status === "approved").length,
    complaints: feedbacks.filter(f => f.type === "complaint").length,
    avgRating: (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
  };

  return (
    <div>
      {/* Statistics */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-500">Tổng feedback</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">Chờ duyệt</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.complaints}</div>
              <div className="text-sm text-gray-500">Khiếu nại</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.avgRating}</div>
              <div className="text-sm text-gray-500">Đánh giá TB</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6 shadow-md">
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="pending">Chờ duyệt</Option>
              <Option value="approved">Đã duyệt</Option>
              <Option value="hidden">Đã ẩn</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">Tất cả loại</Option>
              <Option value="review">Đánh giá</Option>
              <Option value="complaint">Khiếu nại</Option>
            </Select>
          </Col>
          <Col span={10}>
            <Search
              placeholder="Tìm kiếm bệnh nhân, bác sĩ, dịch vụ, nội dung..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col span={6} className="text-right">
            <span className="text-gray-500">
              Tổng: {filteredData.length} feedback
            </span>
          </Col>
        </Row>
      </Card>

      {/* Feedbacks Table */}
      <Card title="Danh Sách Feedback" className="shadow-md">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={modalType === "view" ? "Chi Tiết Feedback" : "Phản Hồi Feedback"}
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
            Gửi Phản Hồi
          </Button>
        ]}
        width={600}
      >
        {modalType === "view" && selectedFeedback && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã feedback">{selectedFeedback.id}</Descriptions.Item>
            <Descriptions.Item label="Bệnh nhân">{selectedFeedback.patientName}</Descriptions.Item>
            <Descriptions.Item label="Bác sĩ">{selectedFeedback.doctorName}</Descriptions.Item>
            <Descriptions.Item label="Dịch vụ">{selectedFeedback.service}</Descriptions.Item>
            <Descriptions.Item label="Loại">
              {getTypeTag(selectedFeedback.type)}
            </Descriptions.Item>
            <Descriptions.Item label="Đánh giá">
              <Rate disabled defaultValue={selectedFeedback.rating} />
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              {selectedFeedback.comment}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(selectedFeedback.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedFeedback.createdDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            {selectedFeedback.responseText && (
              <Descriptions.Item label="Phản hồi">
                {selectedFeedback.responseText}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}

        {modalType === "respond" && selectedFeedback && (
          <div>
            <Descriptions column={1} bordered size="small" className="mb-4">
              <Descriptions.Item label="Bệnh nhân">{selectedFeedback.patientName}</Descriptions.Item>
              <Descriptions.Item label="Nội dung feedback">
                {selectedFeedback.comment}
              </Descriptions.Item>
              <Descriptions.Item label="Đánh giá">
                <Rate disabled defaultValue={selectedFeedback.rating} />
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Form form={form} layout="vertical" onFinish={handleResponse}>
              <Form.Item
                name="responseText"
                label="Phản hồi của bạn"
                rules={[{ required: true, message: "Vui lòng nhập phản hồi!" }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Nhập phản hồi cho bệnh nhân..."
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackManagement; 