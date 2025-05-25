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

const AppointmentPage = () => {
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
      // Map service IDs from the detail page to appointment form values
      const serviceMapping = {
        "egg-donor": "egg_freezing",
        "egg-freezing": "egg_freezing",
        "gender-selection": "genetic_testing",
        "consultation": "consultation",
        "diagnostic-testing": "fertility_check"
      };
      
      form.setFieldsValue({
        service: serviceMapping[selectedService] || "consultation"
      });
    }
  }, [selectedDoctor, selectedService, form]);

  const services = [
    { value: "consultation", label: "Initial Consultation" },
    { value: "fertility_check", label: "Fertility Check-up" },
    { value: "ivf", label: "IVF Treatment" },
    { value: "iui", label: "IUI Treatment" },
    { value: "egg_freezing", label: "Egg Freezing" },
    { value: "sperm_analysis", label: "Sperm Analysis" },
    { value: "genetic_testing", label: "Genetic Testing" },
    { value: "follow_up", label: "Follow-up Visit" },
  ];

  const doctors = [
    { value: "dr_peterson", label: "Prof. Dr. Andrew Peterson - Center Director" },
    { value: "dr_johnson", label: "Dr. Sarah Johnson - Reproductive Endocrinology" },
    { value: "dr_brown", label: "MSc. Michael Brown - Embryology" },
    { value: "dr_roberts", label: "Dr. Emily Roberts - Obstetrics & Gynecology" },
    { value: "any", label: "Any Available Doctor" },
  ];

  const onFinish = (values) => {
    setLoading(true);
    console.log("Form values:", values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success("Your appointment request has been submitted successfully!");
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
          alt="Appointment Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Book an Appointment</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">HOME</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">APPOINTMENT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Schedule Your Visit</h2>
            <span className="text-[#ff8460] font-medium">WE'RE HERE TO HELP YOU</span>
            <Paragraph className="text-lg mt-6 max-w-3xl mx-auto">
              Please fill out the form below to schedule an appointment. Our team will review your 
              request and confirm your appointment within 24 hours.
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
                  <Title level={4} className="mb-6">Personal Information</Title>
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: "Please enter your first name" }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="First Name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: "Please enter your last name" }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Last Name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: "Please enter your email" },
                          { type: "email", message: "Please enter a valid email" }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: "Please enter your phone number" }]}
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[{ required: true, message: "Please select your date of birth" }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                  
                  <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: "Please select your gender" }]}
                  >
                    <Radio.Group>
                      <Radio value="female">Female</Radio>
                      <Radio value="male">Male</Radio>
                      <Radio value="other">Other</Radio>
                    </Radio.Group>
                  </Form.Item>
                  
                  <Divider />
                  
                  <Title level={4} className="mb-6">Appointment Details</Title>
                  
                  <Form.Item
                    name="service"
                    label="Service Required"
                    rules={[{ required: true, message: "Please select a service" }]}
                  >
                    <Select placeholder="Select a service">
                      {services.map(service => (
                        <Option key={service.value} value={service.value}>{service.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="doctor"
                    label="Preferred Doctor"
                    rules={[{ required: true, message: "Please select a doctor" }]}
                  >
                    <Select 
                      placeholder="Select a doctor"
                      disabled={selectedDoctor !== null}
                    >
                      {doctors.map(doctor => (
                        <Option key={doctor.value} value={doctor.value}>{doctor.label}</Option>
                      ))}
                    </Select>
                    {selectedDoctor && (
                      <div className="mt-2">
                        <Text type="success">You've selected a doctor from our team.</Text>
                      </div>
                    )}
                  </Form.Item>
                  
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="preferredDate"
                        label="Preferred Date"
                        rules={[{ required: true, message: "Please select a date" }]}
                      >
                        <DatePicker className="w-full" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="preferredTime"
                        label="Preferred Time"
                        rules={[{ required: true, message: "Please select a time" }]}
                      >
                        <Select placeholder="Select time">
                          <Option value="morning">Morning (9:00 AM - 12:00 PM)</Option>
                          <Option value="afternoon">Afternoon (1:00 PM - 5:00 PM)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="medicalHistory"
                    label="Brief Medical History (Optional)"
                  >
                    <TextArea 
                      rows={4} 
                      placeholder="Please provide any relevant medical information or specific concerns"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="previousTreatment"
                    label="Have you had fertility treatments before?"
                  >
                    <Radio.Group>
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  
                  <Form.Item
                    name="howHeard"
                    label="How did you hear about us?"
                  >
                    <Select placeholder="Please select">
                      <Option value="internet">Internet Search</Option>
                      <Option value="referral">Doctor Referral</Option>
                      <Option value="friend">Friend/Family</Option>
                      <Option value="social">Social Media</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                  
                  <Divider />
                  
                  <Form.Item
                    name="terms"
                    valuePropName="checked"
                    rules={[{ 
                      validator: (_, value) => value ? 
                        Promise.resolve() : 
                        Promise.reject(new Error('You must agree to the terms and conditions')) 
                    }]}
                  >
                    <Checkbox>
                      I agree to the <a href="#">terms and conditions</a> and <a href="#">privacy policy</a>
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
                      Submit Appointment Request
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
                    <Title level={4} className="m-0">Opening Hours</Title>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text>Monday - Friday:</Text>
                      <Text strong>9:00 AM - 5:00 PM</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Saturday:</Text>
                      <Text strong>9:00 AM - 1:00 PM</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Sunday:</Text>
                      <Text strong>Closed</Text>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-[#f9f9f9] shadow-md">
                  <div className="flex items-center mb-4">
                    <PhoneOutlined className="text-[#ff8460] text-2xl mr-4" />
                    <Title level={4} className="m-0">Contact Information</Title>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <PhoneOutlined className="mr-2 mt-1" />
                      <div>
                        <Text strong>Phone:</Text>
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
                    <Title level={4} className="m-0">Emergency Contact</Title>
                  </div>
                  <Paragraph>
                    For urgent matters outside of normal business hours, please call our emergency line:
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

export default AppointmentPage; 