import React from "react";
import { Typography, Card, Row, Col, Divider, Form, Input, Button, Space } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const contactInfo = [
  {
    title: "Địa chỉ",
    content: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
    icon: <EnvironmentOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
  },
  {
    title: "Email",
    content: "info@ivfcenter.vn",
    icon: <MailOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
  },
  {
    title: "Điện thoại",
    content: "(028) 1234 5678",
    icon: <PhoneOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
  },
  {
    title: "Giờ làm việc",
    content: "Thứ 2 - Thứ 7: 8:00 - 17:00",
    icon: <ClockCircleOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
  },
];

const socialMedia = [
  {
    name: "Facebook",
    url: "https://facebook.com",
    icon: <FacebookOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
  },
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: <InstagramOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
  },
  {
    name: "Youtube",
    url: "https://youtube.com",
    icon: <YoutubeOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
  },
];

const branches = [
  {
    name: "Trung tâm chính - TP.HCM",
    address: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
    phone: "(028) 1234 5678",
    email: "hcm@ivfcenter.vn",
  },
  {
    name: "Chi nhánh Hà Nội",
    address: "456 Đường Láng, Quận Đống Đa, Hà Nội",
    phone: "(024) 9876 5432",
    email: "hanoi@ivfcenter.vn",
  },
  {
    name: "Chi nhánh Đà Nẵng",
    address: "789 Đường Nguyễn Hữu Thọ, Quận Hải Châu, Đà Nẵng",
    phone: "(0236) 3456 789",
    email: "danang@ivfcenter.vn",
  },
];

const ContactsPage = () => {
  const onFinish = (values) => {
    console.log("Received values:", values);
    // Xử lý gửi thông tin liên hệ
  };

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">Liên hệ</Title>
          <Paragraph className="text-lg mt-4">
            Liên hệ với chúng tôi để được tư vấn và hỗ trợ về các vấn đề hiếm muộn
          </Paragraph>
        </div>

        <Divider />

        <div className="mb-12">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={14}>
              <div style={{ height: "400px", backgroundColor: "#f0f2f5", marginBottom: "1rem" }}>
                {/* Đây sẽ là bản đồ Google Map */}
                <div className="w-full h-full flex items-center justify-center">
                  <Text>Google Map sẽ được hiển thị tại đây</Text>
                </div>
              </div>
              <Row gutter={[16, 16]}>
                {contactInfo.map((item, index) => (
                  <Col xs={12} sm={6} md={12} lg={6} key={index}>
                    <Card className="text-center h-full shadow-md">
                      <div className="mb-2">{item.icon}</div>
                      <Title level={5}>{item.title}</Title>
                      <Text>{item.content}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
            
            <Col xs={24} md={12} lg={10}>
              <Card title="Gửi thông tin liên hệ" className="shadow-md">
                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input placeholder="Nhập địa chỉ email" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                  <Form.Item
                    name="subject"
                    label="Chủ đề"
                    rules={[{ required: true, message: "Vui lòng nhập chủ đề" }]}
                  >
                    <Input placeholder="Nhập chủ đề cần tư vấn" />
                  </Form.Item>
                  <Form.Item
                    name="message"
                    label="Nội dung"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                  >
                    <TextArea rows={4} placeholder="Nhập nội dung cần tư vấn" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      Gửi thông tin
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="my-12">
          <Title level={2} className="text-center mb-8">Chi nhánh của chúng tôi</Title>
          <Row gutter={[24, 24]}>
            {branches.map((branch, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="shadow-md h-full">
                  <Title level={3}>{branch.name}</Title>
                  <Paragraph>
                    <EnvironmentOutlined className="mr-2" /> {branch.address}
                  </Paragraph>
                  <Paragraph>
                    <PhoneOutlined className="mr-2" /> {branch.phone}
                  </Paragraph>
                  <Paragraph>
                    <MailOutlined className="mr-2" /> {branch.email}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        <div className="my-12 text-center">
          <Title level={2} className="mb-6">Theo dõi chúng tôi</Title>
          <Space size="large">
            {socialMedia.map((social, index) => (
              <a href={social.url} target="_blank" rel="noopener noreferrer" key={index}>
                {social.icon}
              </a>
            ))}
          </Space>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default ContactsPage; 