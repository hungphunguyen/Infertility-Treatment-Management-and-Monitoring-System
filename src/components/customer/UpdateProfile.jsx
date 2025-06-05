import React, { useState } from "react";
import {
  Card, Form, Input, Button, DatePicker, Select, 
  Upload, Avatar, Row, Col, message, Divider, Typography, Space
} from "antd";
import {
  UserOutlined, MailOutlined, PhoneOutlined, 
  HomeOutlined, UploadOutlined, SaveOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const UpdateProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // Mock user data
  const initialValues = {
    fullName: "Phú Lâm Nguyên",
    email: "phulamnguyên@email.com",
    phone: "0901234567",
    dateOfBirth: dayjs("1990-05-15"),
    gender: "female",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    province: "79", // TP.HCM
    district: "760", // Quận 1
    ward: "26734", // Phường Bến Nghé
    idNumber: "079123456789",
    occupation: "Kỹ sư phần mềm",
    emergencyContact: "0909876543",
    emergencyName: "Nguyễn Văn A",
    emergencyRelation: "Chồng"
  };

  const handleSubmit = (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Updated profile:", values);
      message.success("Cập nhật thông tin thành công!");
      setLoading(false);
    }, 1500);
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      // Get this url from response in real world
      setAvatar(URL.createObjectURL(info.file.originFileObj));
      message.success("Tải ảnh lên thành công!");
    }
  };

  return (
    <div>
      <Card>
        <Title level={4}>Cập Nhật Thông Tin Cá Nhân</Title>
        <Text type="secondary">
          Vui lòng cung cấp thông tin chính xác để chúng tôi có thể phục vụ bạn tốt nhất
        </Text>
        
        <Divider />
        
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
        >
          <Row gutter={[24, 0]}>
            {/* Avatar Upload */}
            <Col xs={24} md={24} style={{ textAlign: "center", marginBottom: 24 }}>
              <Form.Item name="avatar" label="Ảnh đại diện">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Avatar 
                    size={100} 
                    icon={<UserOutlined />}
                    src={avatar}
                    style={{ marginBottom: 16 }}
                  />
                  <Upload 
                    name="avatar"
                    showUploadList={false}
                    onChange={handleAvatarChange}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('Vui lòng chỉ tải lên hình ảnh!');
                      }
                      return isImage || Upload.LIST_IGNORE;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Thay đổi ảnh</Button>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
            
            {/* Basic Information */}
            <Col xs={24}>
              <Title level={5}>Thông tin cơ bản</Title>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="female">Nữ</Option>
                  <Option value="male">Nam</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="idNumber"
                label="Số CMND/CCCD"
                rules={[{ required: true, message: "Vui lòng nhập số CMND/CCCD" }]}
              >
                <Input placeholder="Số CMND/CCCD" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={24}>
              <Form.Item
                name="occupation"
                label="Nghề nghiệp"
              >
                <Input placeholder="Nghề nghiệp" />
              </Form.Item>
            </Col>
            
            {/* Address Information */}
            <Col xs={24}>
              <Divider />
              <Title level={5}>Thông tin địa chỉ</Title>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="province"
                label="Tỉnh/Thành phố"
                rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
              >
                <Select placeholder="Chọn tỉnh/thành phố">
                  <Option value="79">TP. Hồ Chí Minh</Option>
                  <Option value="01">Hà Nội</Option>
                  {/* Add more provinces */}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="district"
                label="Quận/Huyện"
                rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
              >
                <Select placeholder="Chọn quận/huyện">
                  <Option value="760">Quận 1</Option>
                  <Option value="761">Quận 2</Option>
                  {/* Add more districts */}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="ward"
                label="Phường/Xã"
                rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
              >
                <Select placeholder="Chọn phường/xã">
                  <Option value="26734">Phường Bến Nghé</Option>
                  <Option value="26737">Phường Bến Thành</Option>
                  {/* Add more wards */}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <Form.Item
                name="address"
                label="Địa chỉ chi tiết"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="Số nhà, tên đường..." />
              </Form.Item>
            </Col>
            
            {/* Emergency Contact */}
            <Col xs={24}>
              <Divider />
              <Title level={5}>Thông tin liên hệ khẩn cấp</Title>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="emergencyName"
                label="Họ tên người liên hệ"
              >
                <Input placeholder="Họ tên người liên hệ" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="emergencyContact"
                label="Số điện thoại"
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={8}>
              <Form.Item
                name="emergencyRelation"
                label="Mối quan hệ"
              >
                <Input placeholder="Mối quan hệ" />
              </Form.Item>
            </Col>
            
            {/* Submit Button */}
            <Col xs={24} style={{ textAlign: "center", marginTop: 24 }}>
              <Space>
                <Button type="default" size="large">
                  Hủy bỏ
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  size="large"
                  icon={<SaveOutlined />}
                >
                  Lưu thay đổi
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateProfile; 