import React, { useState } from "react";
import { 
  Card, Form, Input, Button, Select, Upload, Typography, 
  List, Tag, Divider, Space, Badge, Avatar, Alert, Steps, message
} from "antd";
import {
  SendOutlined, UploadOutlined, CommentOutlined,
  UserOutlined, CheckCircleOutlined, QuestionCircleOutlined,
  ExclamationCircleOutlined, SolutionOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Feedback = () => {
  const [form] = Form.useForm();
  const [feedbackType, setFeedbackType] = useState("question");
  const [fileList, setFileList] = useState([]);
  
  // Mock feedback history
  const feedbackHistory = [
    {
      id: 1,
      type: "question",
      title: "Thắc mắc về quy trình IVF",
      content: "Tôi có một số thắc mắc về quy trình IVF, cụ thể là quá trình kích thích buồng trứng có ảnh hưởng gì đến sức khỏe dài hạn không?",
      status: "answered",
      date: "2024-01-15T10:30:00",
      response: {
        content: "Kính gửi chị Phú Lâm Nguyên, Cảm ơn chị đã gửi câu hỏi. Quá trình kích thích buồng trứng trong IVF là một quy trình an toàn và được nghiên cứu kỹ lưỡng. Các nghiên cứu dài hạn không cho thấy tác động tiêu cực đến sức khỏe tổng thể. Tuy nhiên, trong ngắn hạn có thể có một số tác dụng phụ như đau bụng, căng tức vùng bụng, thay đổi tâm trạng do thay đổi hormone. Hiếm khi xảy ra tình trạng quá kích buồng trứng, nhưng đội ngũ y tế của chúng tôi luôn theo dõi sát sao để đảm bảo an toàn tối đa cho bệnh nhân. Nếu chị có thêm thắc mắc, vui lòng không ngần ngại liên hệ. Trân trọng, BS. Nguyễn Văn A",
        date: "2024-01-16T14:15:00",
        respondent: "BS. Nguyễn Văn A"
      }
    },
    {
      id: 2,
      type: "issue",
      title: "Khó khăn khi đặt lịch hẹn",
      content: "Tôi gặp khó khăn khi đặt lịch hẹn qua ứng dụng. Mỗi khi tôi chọn ngày và giờ, hệ thống báo lỗi 'Không thể đặt lịch vào thời gian này'.",
      status: "processing",
      date: "2024-01-19T09:45:00",
      response: null
    },
    {
      id: 3,
      type: "suggestion",
      title: "Đề xuất thêm thông tin về chế độ dinh dưỡng",
      content: "Tôi mong muốn trang web có thêm thông tin và hướng dẫn chi tiết về chế độ dinh dưỡng trong quá trình điều trị IVF.",
      status: "new",
      date: "2024-01-20T16:20:00",
      response: null
    }
  ];

  // Submit feedback
  const handleSubmit = (values) => {
    console.log("Submitted feedback:", {
      ...values,
      type: feedbackType,
      files: fileList
    });
    
    // In a real app, would send this to an API
    message.success("Gửi phản hồi thành công!");
    form.resetFields();
    setFileList([]);
  };

  // Handle file upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      new: { color: "blue", text: "Mới" },
      processing: { color: "orange", text: "Đang xử lý" },
      answered: { color: "green", text: "Đã trả lời" }
    };
    
    return <Badge status={statusMap[status]?.color} text={statusMap[status]?.text} />;
  };

  // Get type tag
  const getTypeTag = (type) => {
    const typeMap = {
      question: { color: "blue", text: "Thắc mắc", icon: <QuestionCircleOutlined /> },
      issue: { color: "red", text: "Vấn đề", icon: <ExclamationCircleOutlined /> },
      suggestion: { color: "green", text: "Đề xuất", icon: <SolutionOutlined /> }
    };
    
    return (
      <Tag color={typeMap[type]?.color} icon={typeMap[type]?.icon}>
        {typeMap[type]?.text}
      </Tag>
    );
  };

  // Get process steps
  const getProcessSteps = (status) => {
    const items = [
      { title: "Đã gửi" },
      { title: "Đang xử lý" },
      { title: "Đã trả lời" }
    ];
    
    let current = 0;
    if (status === "processing") current = 1;
    if (status === "answered") current = 2;
    
    return (
      <Steps
        size="small"
        current={current}
        items={items}
      />
    );
  };

  return (
    <div>
      {/* Submit New Feedback */}
      <Card title="Gửi phản hồi mới">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Loại phản hồi"
            name="feedbackType"
            initialValue={feedbackType}
            rules={[{ required: true, message: "Vui lòng chọn loại phản hồi" }]}
          >
            <Select onChange={value => setFeedbackType(value)}>
              <Option value="question">
                <QuestionCircleOutlined style={{ color: '#1890ff' }} /> Thắc mắc
              </Option>
              <Option value="issue">
                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /> Vấn đề gặp phải
              </Option>
              <Option value="suggestion">
                <SolutionOutlined style={{ color: '#52c41a' }} /> Đề xuất cải thiện
              </Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Nhập tiêu đề phản hồi" />
          </Form.Item>
          
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea 
              rows={5} 
              placeholder="Mô tả chi tiết phản hồi của bạn..." 
            />
          </Form.Item>
          
          {feedbackType === "issue" && (
            <Form.Item
              label="Liên quan đến"
              name="relatedTo"
            >
              <Select placeholder="Chọn dịch vụ/chức năng liên quan">
                <Option value="appointment">Đặt lịch hẹn</Option>
                <Option value="payment">Thanh toán</Option>
                <Option value="medication">Thuốc và hướng dẫn</Option>
                <Option value="website">Website/Ứng dụng</Option>
                <Option value="staff">Nhân viên/Bác sĩ</Option>
                <Option value="facility">Cơ sở vật chất</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          )}
          
          <Form.Item
            label="Tài liệu đính kèm"
            name="attachments"
          >
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SendOutlined />}
            >
              Gửi phản hồi
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Feedback Guidelines */}
      <Alert
        message="Lưu ý khi gửi phản hồi"
        description="Phản hồi của bạn sẽ được xử lý trong vòng 24-48 giờ làm việc. Đối với các vấn đề khẩn cấp, vui lòng liên hệ trực tiếp qua số hotline: 1900 1234."
        type="info"
        showIcon
        style={{ margin: '24px 0' }}
      />

      {/* Feedback History */}
      <Card title="Lịch sử phản hồi" style={{ marginTop: 24 }}>
        <List
          itemLayout="vertical"
          dataSource={feedbackHistory}
          renderItem={item => (
            <List.Item
              key={item.id}
              extra={
                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  {getStatusBadge(item.status)}
                  <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                    {dayjs(item.date).format("DD/MM/YYYY HH:mm")}
                  </div>
                </div>
              }
            >
              <List.Item.Meta
                title={
                  <Space>
                    {getTypeTag(item.type)}
                    <Text strong>{item.title}</Text>
                  </Space>
                }
                description={getProcessSteps(item.status)}
              />
              
              <div style={{ margin: '16px 0' }}>
                <Paragraph>{item.content}</Paragraph>
              </div>
              
              {item.response && (
                <>
                  <Divider dashed />
                  <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 4 }}>
                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      <Avatar icon={<UserOutlined />} />
                      <div style={{ marginLeft: 8 }}>
                        <Text strong>{item.response.respondent}</Text>
                        <div style={{ fontSize: 12, color: '#999' }}>
                          {dayjs(item.response.date).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>
                    </div>
                    <Paragraph>{item.response.content}</Paragraph>
                  </div>
                </>
              )}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Feedback; 