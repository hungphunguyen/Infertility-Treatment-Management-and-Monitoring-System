import React, { useState, useEffect } from "react";
import { 
  Typography, Form, Input, Button, Select, DatePicker, Radio, 
  Divider, Space, Row, Col, Card, Checkbox, message 
} from "antd";
import { 
  UserOutlined, CalendarOutlined, PhoneOutlined, 
  MailOutlined, MedicineBoxOutlined 
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RegisterService = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  // Get the selected doctor from navigation state if available
  const selectedDoctor = location.state?.selectedDoctor || null;
  const selectedService = location.state?.selectedService || null;

  useEffect(() => {
    // If a doctor was selected from the doctor's page, set the form field
    if (selectedDoctor) {
      form.setFieldsValue({
        doctor: selectedDoctor
      });
    }
    
    // If a service was selected from the service detail page, set the form field
    if (selectedService) {
      // Map service IDs from the detail page to register service form values
      const serviceMapping = {
        "ivf": "ivf",
        "iui": "iui",
        "diagnostic-testing": "fertility_check"
      };
      
      form.setFieldsValue({
        service: serviceMapping[selectedService] || "consultation"
      });
    }
  }, [selectedDoctor, selectedService, form]);

  const services = [
    { value: "consultation", label: "Tư vấn Ban đầu" },
    { value: "fertility_check", label: "Kiểm tra Khả năng Sinh sản" },
    { value: "ivf", label: "Điều trị IVF" },
    { value: "iui", label: "Điều trị IUI" },
    { value: "egg_freezing", label: "Đông lạnh Trứng" },
    { value: "sperm_analysis", label: "Phân tích Tinh trùng" },
    { value: "genetic_testing", label: "Xét nghiệm Di truyền" },
    { value: "follow_up", label: "Tái khám" },
  ];

  const doctors = [
    { value: "dr_peterson", label: "GS. TS. Andrew Peterson - Giám đốc Trung tâm" },
    { value: "dr_johnson", label: "TS. Sarah Johnson - Nội tiết Sinh sản" },
    { value: "dr_brown", label: "ThS. Michael Brown - Phôi học" },
    { value: "dr_roberts", label: "TS. Emily Roberts - Sản khoa & Phụ khoa" },
    { value: "any", label: "Bác sĩ Có sẵn" },
  ];

  const onFinish = (values) => {
    setLoading(true);
    console.log("Giá trị biểu mẫu:", values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success("Yêu cầu đăng ký dịch vụ của bạn đã được gửi thành công!");
      form.resetFields();
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src="/images/features/pc8.jpg" 
          alt="Băng rôn Đăng ký dịch vụ" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Đăng Ký Dịch Vụ</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">ĐĂNG KÝ DỊCH VỤ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Đăng Ký Dịch Vụ</h2>
            <span className="text-[#ff8460] font-medium">CHÚNG TÔI Ở ĐÂY ĐỂ HỖ TRỢ BẠN</span>
            <Paragraph className="text-lg mt-6 max-w-3xl mx-auto">
              Vui lòng điền vào biểu mẫu dưới đây để đăng ký dịch vụ. Đội ngũ của chúng tôi sẽ xem xét 
              yêu cầu của bạn và liên hệ trong vòng 24 giờ.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 24]}>
            <Col xs={24} lg={16}>
              <Card className="shadow-lg">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  scrollToFirstError
                >
                  <Title level={4} className="mb-6">Thông tin Cá nhân</Title>
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="firstName"
                        label="Tên"
                        rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Tên" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="lastName"
                        label="Họ"
                        rules={[{ required: true, message: "Vui lòng nhập họ của bạn" }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Họ" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email của bạn" },
                          { type: "email", message: "Vui lòng nhập email hợp lệ" }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Địa chỉ Email" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn" }]}
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="dateOfBirth"
                    label="Ngày sinh"
                    rules={[{ required: true, message: "Vui lòng chọn ngày sinh của bạn" }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                  
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính của bạn" }]}
                  >
                    <Radio.Group>
                      <Radio value="female">Nữ</Radio>
                      <Radio value="male">Nam</Radio>
                      <Radio value="other">Khác</Radio>
                    </Radio.Group>
                  </Form.Item>
                  
                  <Divider />
                  
                  <Title level={4} className="mb-6">Chi tiết Lịch hẹn</Title>
                  
                  <Form.Item
                    name="service"
                    label="Dịch vụ Yêu cầu"
                    rules={[{ required: true, message: "Vui lòng chọn một dịch vụ" }]}
                  >
                    <Select placeholder="Chọn một dịch vụ">
                      {services.map(service => (
                        <Option key={service.value} value={service.value}>{service.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="doctor"
                    label="Bác sĩ Ưu tiên"
                    rules={[{ required: true, message: "Vui lòng chọn một bác sĩ" }]}
                  >
                    <Select 
                      placeholder="Chọn một bác sĩ"
                      disabled={selectedDoctor !== null}
                    >
                      {doctors.map(doctor => (
                        <Option key={doctor.value} value={doctor.value}>{doctor.label}</Option>
                      ))}
                    </Select>
                    {selectedDoctor && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <Text strong className="text-green-700">
                          Bác sĩ đã chọn: {doctors.find(doc => doc.value === selectedDoctor)?.label || selectedDoctor}
                        </Text>
                      </div>
                    )}
                  </Form.Item>
                  
                  <Form.Item
                    name="medicalHistory"
                    label="Tiền sử Y khoa (Không bắt buộc)"
                  >
                    <TextArea 
                      rows={4} 
                      placeholder="Vui lòng cung cấp thông tin y khoa liên quan hoặc các mối quan tâm cụ thể"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="previousTreatment"
                    label="Bạn đã từng điều trị sinh sản trước đây chưa?"
                  >
                    <Radio.Group>
                      <Radio value="yes">Có</Radio>
                      <Radio value="no">Không</Radio>
                    </Radio.Group>
                  </Form.Item>
                  
                  <Divider />
                  
                  <Form.Item
                    name="terms"
                    valuePropName="checked"
                    rules={[{ 
                      validator: (_, value) => value ? 
                        Promise.resolve() : 
                        Promise.reject(new Error('Bạn phải đồng ý với các điều khoản và điều kiện')) 
                    }]}
                  >
                    <Checkbox>
                      Tôi đồng ý với <a href="#">các điều khoản và điều kiện</a> và <a href="#">chính sách bảo mật</a>
                    </Checkbox>
                  </Form.Item>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      className="bg-[#ff8460] hover:bg-[#ff6b40] border-none h-12 text-lg px-8"
                      block
                    >
                      Gửi Yêu cầu Đăng Ký
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <div className="space-y-6">
                <Card className="bg-[#f9f9f9] shadow-md">
                  <div className="flex items-center mb-4">
                    <CalendarOutlined className="text-[#ff8460] text-2xl mr-4" />
                    <Title level={4} className="m-0">Giờ mở cửa</Title>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text>Thứ Hai - Thứ Sáu:</Text>
                      <Text strong>9:00 - 17:00</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Thứ Bảy:</Text>
                      <Text strong>9:00 - 13:00</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Chủ Nhật:</Text>
                      <Text strong>Đóng cửa</Text>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-[#f9f9f9] shadow-md">
                  <div className="flex items-center mb-4">
                    <PhoneOutlined className="text-[#ff8460] text-2xl mr-4" />
                    <Title level={4} className="m-0">Thông tin Liên hệ</Title>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <PhoneOutlined className="mr-2 mt-1" />
                      <div>
                        <Text strong>Điện thoại:</Text>
                        <br />
                        <Text>+1 858 794 6363</Text>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MailOutlined className="mr-2 mt-1" />
                      <div>
                        <Text strong>Email:</Text>
                        <br />
                        <Text>appointments@newlife.com</Text>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-[#f9f9f9] shadow-md">
                  <div className="flex items-center mb-4">
                    <MedicineBoxOutlined className="text-[#ff8460] text-2xl mr-4" />
                    <Title level={4} className="m-0">Liên hệ Khẩn cấp</Title>
                  </div>
                  <Paragraph>
                    Đối với các vấn đề khẩn cấp ngoài giờ làm việc bình thường, vui lòng gọi đường dây khẩn cấp của chúng tôi:
                  </Paragraph>
                  <Paragraph strong className="text-lg">
                    +1 858 794 6364
                  </Paragraph>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      
      <UserFooter />
    </div>
  );
};

export default RegisterService;