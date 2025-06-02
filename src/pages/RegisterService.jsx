import React, { useState, useEffect } from "react";
import { 
  Typography, Form, Input, Button, Select, DatePicker, Radio, 
  Divider, Space, Row, Col, Card, Checkbox, message, TimePicker 
} from "antd";
import { 
  UserOutlined, CalendarOutlined, PhoneOutlined, 
  MailOutlined, MedicineBoxOutlined, IdcardOutlined, HomeOutlined 
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { authService } from "../service/auth.service";
import { getLocgetlStorage } from "../utils/util";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RegisterService = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorSchedule, setShowDoctorSchedule] = useState(false);
  const location = useLocation();
  
  // Get the selected doctor from navigation state if available
  const initialSelectedDoctor = location.state?.selectedDoctor || null;
  const selectedService = location.state?.selectedService || null;

  // Load user information when component mounts
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setUserInfoLoading(true);
        const token = getLocgetlStorage("token");
        
        if (token) {
          console.log("🔄 Loading user info...");
          const response = await authService.getMyInfo(token);
          
          if (response.data && response.data.result) {
            const userInfo = response.data.result;
            console.log("👤 User info loaded:", userInfo);
            console.log("📋 Available fields:", Object.keys(userInfo));
            
            // Try different possible field names for firstName/lastName
            const firstName = userInfo.firstName || userInfo.fname || userInfo.first_name || userInfo.fullName || userInfo.name || "";
            
            console.log("🔍 Extracted name:", { firstName });
            
            // Auto-fill user information
            form.setFieldsValue({
              firstName: firstName,
              email: userInfo.email || "",
              phone: userInfo.phone || userInfo.phoneNumber || "",
              dateOfBirth: userInfo.dateOfBirth || userInfo.dob ? dayjs(userInfo.dateOfBirth || userInfo.dob) : null,
              gender: userInfo.gender || "",
              address: userInfo.address || userInfo.fullAddress || ""
            });
            
            message.success("Thông tin cá nhân đã được tự động điền từ tài khoản của bạn!");
          }
        } else {
          console.log("⚠️ No token found - user not logged in");
        }
      } catch (error) {
        console.error("❌ Error loading user info:", error);
        message.warning("Không thể tải thông tin cá nhân. Vui lòng điền thủ công.");
      } finally {
        setUserInfoLoading(false);
      }
    };

    loadUserInfo();
  }, [form]);

  useEffect(() => {
    // If a doctor was selected from the doctor's page, set the form field
    if (initialSelectedDoctor) {
      setSelectedDoctor(initialSelectedDoctor);
      form.setFieldsValue({
        doctor: initialSelectedDoctor
      });
    }
    
    // If a service was selected from the service detail page, set the form field
    if (selectedService) {
      const serviceMapping = {
        "ivf": "201",
        "iui": "101", 
        "diagnostic-testing": "fertility_check"
      };
      
      form.setFieldsValue({
        treatmentService: serviceMapping[selectedService] || "consultation"
      });
    }
  }, [initialSelectedDoctor, selectedService, form]);

  const treatmentServices = [
    { value: "consultation", label: "Tư vấn Ban đầu - 500.000 VND", price: 500000 },
    { value: "fertility_check", label: "Kiểm tra Khả năng Sinh sản - 2.000.000 VND", price: 2000000 },
    { value: "101", label: "IUI Cơ bản - 12.000.000 VND", price: 12000000 },
    { value: "102", label: "IUI Nâng cao - 18.000.000 VND", price: 18000000 },
    { value: "201", label: "IVF Tiêu chuẩn - 70.000.000 VND", price: 70000000 },
    { value: "202", label: "IVF Trọn gói - 95.000.000 VND", price: 95000000 },
    { value: "egg_freezing", label: "Đông lạnh Trứng - 25.000.000 VND", price: 25000000 },
    { value: "sperm_analysis", label: "Phân tích Tinh trùng - 1.500.000 VND", price: 1500000 },
    { value: "genetic_testing", label: "Xét nghiệm Di truyền - 8.000.000 VND", price: 8000000 },
    { value: "follow_up", label: "Tái khám - 300.000 VND", price: 300000 },
  ];

  const doctors = [
    { value: "doc01", label: "BS. Nguyễn Văn A - Chuyên gia IVF", specialty: "IVF" },
    { value: "doc02", label: "BS. Trần Thị B - Chuyên gia Hiếm muộn", specialty: "Hiếm muộn" },
    { value: "doc03", label: "BS. Lê Văn C - Chuyên gia IUI", specialty: "IUI" },
    { value: "dr_peterson", label: "GS. TS. Andrew Peterson - Giám đốc Trung tâm", specialty: "Tổng quát" },
    { value: "dr_johnson", label: "TS. Sarah Johnson - Nội tiết Sinh sản", specialty: "Nội tiết" },
    { value: "", label: "Không chọn - Bác sĩ có sẵn", specialty: "Tổng quát" },
  ];

  // Mock doctor schedules
  const doctorSchedules = {
    doc01: [
      ['Thứ 2 (15/01)', '✅', '❌'],
      ['Thứ 3 (16/01)', '✅', '✅'],
      ['Thứ 4 (17/01)', '❌', '✅'],
      ['Thứ 5 (18/01)', '✅', '✅'],
      ['Thứ 6 (19/01)', '✅', '❌']
    ],
    doc02: [
      ['Thứ 2 (15/01)', '✅', '✅'],
      ['Thứ 3 (16/01)', '✅', '✅'],
      ['Thứ 4 (17/01)', '✅', '✅'],
      ['Thứ 5 (18/01)', '✅', '✅'],
      ['Thứ 6 (19/01)', '✅', '✅']
    ],
    doc03: [
      ['Thứ 3 (16/01)', '✅', '❌'],
      ['Thứ 4 (17/01)', '✅', '❌'],
      ['Thứ 6 (19/01)', '✅', '✅'],
      ['Thứ 7 (20/01)', '✅', '✅']
    ]
  };

  const onDoctorChange = (value) => {
    setSelectedDoctor(value);
    setShowDoctorSchedule(value && value !== "" && doctorSchedules[value]);
  };

  const onFinish = (values) => {
    setLoading(true);
    console.log("📋 Dữ liệu đăng ký dịch vụ:", values);
    
    // Format data for API
    const apiData = {
      // Personal Information
      fullName: `${values.firstName}`,
      firstName: values.firstName,
      email: values.email,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
      gender: values.gender,
      address: values.address,
      
      // Appointment Details
      appointmentDate: values.appointmentDate?.format('YYYY-MM-DD'),
      appointmentShift: values.shift,
      treatmentServiceId: values.treatmentService,
      doctorId: values.doctor || null,
      
      // Medical Information
      medicalHistory: values.medicalHistory || "",
      previousTreatment: values.previousTreatment === "yes",
      
      // Additional info
      notes: values.notes || "",
      termsAccepted: values.terms,
      
      // Meta
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    
    console.log("🚀 API Data:", apiData);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success("Yêu cầu đăng ký dịch vụ của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ trong vòng 24 giờ.");
      form.resetFields();
      setSelectedDoctor(null);
      setShowDoctorSchedule(false);
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
            <h1 className="text-5xl font-bold text-white mb-4">📋 Đăng Ký Dịch Vụ Điều Trị Hiếm Muộn</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">ĐĂNG KÝ DỊCH VỤ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20" style={{ backgroundColor: '#f0f4f8' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg" style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                scrollToFirstError
              >
                <Title level={3} className="mb-6" style={{ color: '#333' }}>
                  👤 Thông tin Cá nhân
                  {userInfoLoading && (
                    <span style={{ fontSize: '14px', color: '#1890ff', marginLeft: '10px' }}>
                      🔄 Đang tải thông tin...
                    </span>
                  )}
                </Title>
                
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="firstName"
                      label="Họ và Tên"
                      rules={[{ required: true, message: "Vui lòng nhập họ và tên của bạn" }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Họ và Tên" 
                        size="large" 
                        loading={userInfoLoading}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email của bạn" },
                        { type: "email", message: "Vui lòng nhập email hợp lệ" }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Địa chỉ Email" 
                        size="large" 
                        loading={userInfoLoading}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn" }]}
                    >
                      <Input 
                        prefix={<PhoneOutlined />} 
                        placeholder="Số điện thoại" 
                        size="large" 
                        loading={userInfoLoading}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="dateOfBirth"
                      label="Ngày sinh"
                      rules={[{ required: true, message: "Vui lòng chọn ngày sinh của bạn" }]}
                    >
                      <DatePicker 
                        className="w-full" 
                        size="large" 
                        placeholder="Chọn ngày sinh" 
                        loading={userInfoLoading}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="gender"
                      label="Giới tính"
                      rules={[{ required: true, message: "Vui lòng chọn giới tính của bạn" }]}
                    >
                      <Radio.Group disabled={userInfoLoading}>
                        <Radio value="female">Nữ</Radio>
                        <Radio value="male">Nam</Radio>
                        <Radio value="other">Khác</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                    >
                      <Input 
                        prefix={<HomeOutlined />} 
                        placeholder="Địa chỉ thường trú" 
                        size="large" 
                        loading={userInfoLoading}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Divider />
                
                <Title level={3} className="mb-6" style={{ color: '#333' }}>🗓 Thông tin Đặt lịch</Title>
                
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="appointmentDate"
                      label="Ngày thăm khám ban đầu"
                      rules={[{ required: true, message: "Vui lòng chọn ngày khám" }]}
                    >
                      <DatePicker 
                        className="w-full" 
                        size="large" 
                        placeholder="Chọn ngày khám"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="shift"
                      label="Buổi khám"
                      rules={[{ required: true, message: "Vui lòng chọn buổi khám" }]}
                    >
                      <Select placeholder="-- Chọn buổi khám --" size="large">
                        <Option value="morning">Sáng (08:00–12:00)</Option>
                        <Option value="afternoon">Chiều (13:00–17:00)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                  name="treatmentService"
                  label="Gói dịch vụ điều trị"
                  rules={[{ required: true, message: "Vui lòng chọn gói dịch vụ" }]}
                >
                  <Select placeholder="-- Chọn gói dịch vụ --" size="large">
                    {treatmentServices.map(service => (
                      <Option key={service.value} value={service.value}>{service.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="doctor"
                  label="Chỉ định bác sĩ điều trị (nếu muốn)"
                >
                  <Select 
                    placeholder="-- Không chọn --" 
                    size="large"
                    onChange={onDoctorChange}
                    disabled={initialSelectedDoctor !== null}
                  >
                    {doctors.map(doctor => (
                      <Option key={doctor.value} value={doctor.value}>{doctor.label}</Option>
                    ))}
                  </Select>
                  {initialSelectedDoctor && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <Text strong className="text-green-700">
                        Bác sĩ đã chọn: {doctors.find(doc => doc.value === initialSelectedDoctor)?.label || initialSelectedDoctor}
                      </Text>
                    </div>
                  )}
                </Form.Item>

                {/* Doctor Schedule */}
                {showDoctorSchedule && (
                  <Card className="mb-4" style={{ backgroundColor: '#f9f9f9' }}>
                    <Title level={4}>🗓 Lịch làm việc của bác sĩ</Title>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', backgroundColor: '#eee' }}>Ngày</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', backgroundColor: '#eee' }}>Sáng</th>
                            <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', backgroundColor: '#eee' }}>Chiều</th>
                          </tr>
                        </thead>
                        <tbody>
                          {doctorSchedules[selectedDoctor]?.map((row, index) => (
                            <tr key={index}>
                              <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{row[0]}</td>
                              <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{row[1]}</td>
                              <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>{row[2]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
                
                <Divider />
                
                <Title level={3} className="mb-6" style={{ color: '#333' }}>🏥 Thông tin Y khoa</Title>
                
                <Form.Item
                  name="medicalHistory"
                  label="Tiền sử Y khoa (Không bắt buộc)"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Vui lòng cung cấp thông tin tiền sử y khoa liên quan hoặc các mối quan tâm cụ thể"
                    style={{ resize: 'vertical' }}
                  />
                </Form.Item>
                
                <Form.Item
                  name="previousTreatment"
                  label="Bạn đã từng điều trị sinh sản trước đây chưa?"
                  rules={[{ required: true, message: "Vui lòng chọn một tùy chọn" }]}
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
                    Tôi đồng ý với <a href="#" target="_blank">các điều khoản và điều kiện</a> và <a href="#" target="_blank">chính sách bảo mật</a>
                  </Checkbox>
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    size="large"
                    block
                    style={{ 
                      backgroundColor: '#1976d2', 
                      borderColor: '#1976d2',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    Gửi đăng ký
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </div>
      
      <UserFooter />
    </div>
  );
};

export default RegisterService;