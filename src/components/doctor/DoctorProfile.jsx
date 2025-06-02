import React, { useState } from "react";
import { 
  Card, Row, Col, Avatar, Button, Descriptions, Form, Input, 
  Upload, Modal, Typography, Divider, Badge, Tag, Timeline,
  Progress, Statistic, Select, DatePicker, Switch
} from "antd";
import {
  UserOutlined, EditOutlined, CameraOutlined, SaveOutlined,
  PhoneOutlined, MailOutlined, EnvironmentOutlined, 
  TrophyOutlined, BookOutlined, CalendarOutlined,
  MedicineBoxOutlined, TeamOutlined, FileTextOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Mock doctor data
  const doctorInfo = {
    id: "DOC001",
    name: "BS. Nguyễn Văn A",
    title: "Bác sĩ Chuyên khoa II",
    specialty: "Sản phụ khoa - Hiếm muộn",
    department: "Khoa Hỗ trợ Sinh sản",
    phone: "0901234567",
    email: "nguyenvana@hospital.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    joinDate: "2018-03-15",
    license: "BS.12345",
    experience: "8 năm",
    education: [
      "Thạc sĩ Y khoa - Đại học Y Hà Nội (2016)",
      "Bác sĩ Đa khoa - Đại học Y Hà Nội (2014)",
      "Chứng chỉ IVF - Viện Pasteur Pháp (2019)"
    ],
    certifications: [
      "Chứng chỉ Hành nghề Y - Bộ Y tế",
      "Chứng chỉ Sản phụ khoa - Hội Sản phụ khoa VN",
      "Chứng chỉ IVF/ICSI - Hội Hiếm muộn VN"
    ],
    achievements: [
      "Bác sĩ xuất sắc năm 2023",
      "Nghiên cứu khoa học ưu tú 2022",
      "100+ ca IVF thành công"
    ]
  };

  // Statistics
  const statistics = {
    totalPatients: 156,
    successRate: 85,
    totalProcedures: 89,
    currentPatients: 23
  };

  const workSchedule = [
    { day: "Thứ 2", morning: "08:00-12:00", afternoon: "13:00-17:00" },
    { day: "Thứ 3", morning: "08:00-12:00", afternoon: "13:00-17:00" },
    { day: "Thứ 4", morning: "08:00-12:00", afternoon: "Nghỉ" },
    { day: "Thứ 5", morning: "08:00-12:00", afternoon: "13:00-17:00" },
    { day: "Thứ 6", morning: "08:00-12:00", afternoon: "13:00-17:00" },
    { day: "Thứ 7", morning: "Nghỉ", afternoon: "Nghỉ" },
    { day: "Chủ nhật", morning: "Nghỉ", afternoon: "Nghỉ" }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(doctorInfo);
  };

  const handleSave = (values) => {
    console.log("Saving doctor info:", values);
    setIsEditing(false);
    // Here you would typically send the data to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} lg={8}>
          <Card 
            actions={[
              <Button key="edit" icon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            ]}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff", marginBottom: 16 }}
              />
              <Upload>
                <Button icon={<CameraOutlined />} size="small">
                  Đổi ảnh
                </Button>
              </Upload>
            </div>
            
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={4} style={{ margin: 0 }}>
                {doctorInfo.name}
              </Title>
              <Text type="secondary">{doctorInfo.title}</Text>
              <br />
              <Tag color="blue" style={{ marginTop: 8 }}>
                {doctorInfo.specialty}
              </Tag>
              <br />
              <Badge 
                status="success" 
                text="Đang hoạt động" 
                style={{ marginTop: 8 }}
              />
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã bác sĩ">
                <Tag color="cyan">{doctorInfo.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Khoa">
                {doctorInfo.department}
              </Descriptions.Item>
              <Descriptions.Item label="Kinh nghiệm">
                {doctorInfo.experience}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày vào làm">
                {dayjs(doctorInfo.joinDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Statistics Card */}
          <Card title="Thống kê" style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Tổng bệnh nhân"
                  value={statistics.totalPatients}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#1890ff", fontSize: "18px" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tỷ lệ thành công"
                  value={statistics.successRate}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: "#52c41a", fontSize: "18px" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Ca thủ thuật"
                  value={statistics.totalProcedures}
                  prefix={<MedicineBoxOutlined />}
                  valueStyle={{ color: "#722ed1", fontSize: "18px" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Đang điều trị"
                  value={statistics.currentPatients}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#fa8c16", fontSize: "18px" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={24} lg={16}>
          {/* Contact Information */}
          <Card 
            title="Thông tin liên hệ"
            extra={!isEditing && (
              <Button icon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            )}
          >
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="phone" label="Số điện thoại">
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="email" label="Email">
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="address" label="Địa chỉ">
                  <TextArea rows={2} />
                </Form.Item>
                <div style={{ textAlign: "right" }}>
                  <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Lưu
                  </Button>
                </div>
              </Form>
            ) : (
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Số điện thoại">
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {doctorInfo.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <MailOutlined style={{ marginRight: 8 }} />
                  {doctorInfo.email}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  {doctorInfo.address}
                </Descriptions.Item>
                <Descriptions.Item label="Số hành nghề">
                  <FileTextOutlined style={{ marginRight: 8 }} />
                  {doctorInfo.license}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>

          {/* Education & Certifications */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Học vấn">
                <Timeline size="small">
                  {doctorInfo.education.map((edu, index) => (
                    <Timeline.Item key={index} color="blue">
                      <Text>{edu}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Chứng chỉ">
                <Timeline size="small">
                  {doctorInfo.certifications.map((cert, index) => (
                    <Timeline.Item key={index} color="green">
                      <Text>{cert}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          </Row>

          {/* Achievements */}
          <Card title="Thành tích" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              {doctorInfo.achievements.map((achievement, index) => (
                <Col span={8} key={index}>
                  <Card size="small" style={{ textAlign: "center" }}>
                    <TrophyOutlined style={{ fontSize: "24px", color: "#faad14", marginBottom: 8 }} />
                    <div>{achievement}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Work Schedule */}
          <Card title="Lịch làm việc" style={{ marginTop: 16 }}>
            <Row gutter={[16, 8]}>
              {workSchedule.map((schedule, index) => (
                <Col span={24} key={index}>
                  <Row align="middle" style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <Col span={4}>
                      <Text strong>{schedule.day}</Text>
                    </Col>
                    <Col span={10}>
                      <Badge 
                        status={schedule.morning === "Nghỉ" ? "default" : "success"} 
                        text={`Sáng: ${schedule.morning}`}
                      />
                    </Col>
                    <Col span={10}>
                      <Badge 
                        status={schedule.afternoon === "Nghỉ" ? "default" : "success"} 
                        text={`Chiều: ${schedule.afternoon}`}
                      />
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorProfile; 