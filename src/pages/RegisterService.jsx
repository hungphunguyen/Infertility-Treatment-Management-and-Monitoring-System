import React, { useState, useEffect, useContext } from "react";
import { 
  Typography, Form, Input, Button, Select, DatePicker, Radio, 
  Divider, Space, Row, Col, Card, Checkbox, TimePicker, Spin
} from "antd";
import { 
  UserOutlined, CalendarOutlined, PhoneOutlined, 
  MailOutlined, MedicineBoxOutlined, IdcardOutlined, HomeOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { authService } from "../service/auth.service";
import { serviceService } from "../service/service.service";
import { doctorService } from "../service/doctor.service";
import { getLocgetlStorage } from "../utils/util";
import dayjs from "dayjs";
import { NotificationContext } from "../App";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RegisterService = () => {
  const { showNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorSchedule, setShowDoctorSchedule] = useState(false);
  const location = useLocation();
  const token = useSelector((state) => state.authSlice.token);
  const [currentUser, setCurrentUser] = useState(null);
  
  // API data states
  const [treatmentServices, setTreatmentServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  
  // Get the selected doctor from navigation state if available
  const initialSelectedDoctor = location.state?.selectedDoctor || null;
  const doctorName = location.state?.doctorName || null;
  const doctorRole = location.state?.doctorRole || null;
  const doctorSpecialization = location.state?.doctorSpecialization || null;
  const selectedService = location.state?.selectedService || null;

  // Additional state
  const [doctorNotAvailable, setDoctorNotAvailable] = useState(false);

  // Load user information when component mounts
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setUserInfoLoading(true);
        const token = getLocgetlStorage("token");
        
        if (token) {
          const response = await authService.getMyInfo(token);
          
          if (response.data && response.data.result) {
            const userInfo = response.data.result;
            setCurrentUser(userInfo);
            
            // Try different possible field names for firstName/lastName
            const firstName = userInfo.firstName || userInfo.fname || userInfo.first_name || userInfo.fullName || userInfo.name || "";
            
            // Auto-fill user information
            form.setFieldsValue({
              firstName: firstName,
              email: userInfo.email || "",
              phone: userInfo.phone || userInfo.phoneNumber || "",
              dateOfBirth: userInfo.dateOfBirth || userInfo.dob ? dayjs(userInfo.dateOfBirth || userInfo.dob) : null,
              gender: userInfo.gender || "",
              address: userInfo.address || userInfo.fullAddress || ""
            });
          }
        }
      } catch (error) {
        // Silent error handling - don't show notification
      } finally {
        setUserInfoLoading(false);
      }
    };

    loadUserInfo();
    fetchTreatmentServices();
    fetchDoctors();
  }, [form]);

  // Fetch treatment services from API
  const fetchTreatmentServices = async () => {
    try {
      setServicesLoading(true);
      const response = await serviceService.getAllNonRemovedServices();
      
      if (response && response.data && response.data.result) {
        let servicesData = Array.isArray(response.data.result) 
          ? response.data.result 
          : [response.data.result];
        
        // Map API data to the format needed for Select options
        const mappedServices = servicesData.map(service => ({
          value: service.id.toString(),
          label: `${service.name} - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}`,
          price: service.price
        }));
        
        setTreatmentServices(mappedServices);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);
      const response = await doctorService.getAllDoctors();
      
      if (response && response.data && response.data.result) {
        let doctorsData = Array.isArray(response.data.result) 
          ? response.data.result 
          : [response.data.result];
        
        // Map API data to the format needed for Select options
        const mappedDoctors = doctorsData.map(doctor => ({
          value: doctor.id,
          label: `${doctor.fullName || "Bác sĩ"} - ${doctor.qualifications || "Chuyên khoa"}`,
          specialty: doctor.qualifications || "Chuyên khoa"
        }));
        
        // Add "No selection" option
        mappedDoctors.push({ value: "", label: "Không chọn - Bác sĩ có sẵn", specialty: "Tổng quát" });
        
        setDoctors(mappedDoctors);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setDoctorsLoading(false);
    }
  };

  useEffect(() => {
    // If a doctor was selected from the doctor's page, set the form field
    if (initialSelectedDoctor) {
      console.log("Debug - initialSelectedDoctor:", initialSelectedDoctor, typeof initialSelectedDoctor);
      setSelectedDoctor(initialSelectedDoctor);
      form.setFieldsValue({
        doctor: initialSelectedDoctor
      });
    }
    
    // If a service was selected from the service detail page, set the form field
    if (selectedService) {
      form.setFieldsValue({
        treatmentService: selectedService.toString()
      });
    }
  }, [initialSelectedDoctor, selectedService, form]);

  const onDoctorChange = (value) => {
    console.log("Debug - doctor changed to:", value, typeof value);
    setSelectedDoctor(value);
    setShowDoctorSchedule(false); // Disable doctor schedule display since we're not using mock data
  };

  const onFinish = (values) => {
    setLoading(true);
    setDoctorNotAvailable(false); // Reset trạng thái bác sĩ không khả dụng
    
    // Call the API to register treatment service
    const registerTreatment = async () => {
      try {
        // Kiểm tra đăng nhập và thông tin người dùng
        const token = getLocgetlStorage("token");
        
        console.log("Debug - currentUser:", currentUser);
        console.log("Debug - token:", token ? "Có token" : "Không có token");
        console.log("Debug - form values:", values);
        console.log("Debug - selectedDoctor:", selectedDoctor);
        
        // Kiểm tra xem token có tồn tại không (người dùng đã đăng nhập)
        if (!token) {
          showNotification("Vui lòng đăng nhập để đăng ký dịch vụ", "error");
          setLoading(false);
          return;
        }
        
        // Kiểm tra xem có thông tin người dùng không
        if (!currentUser || !currentUser.id) {
          showNotification("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.", "error");
          setLoading(false);
          return;
        }
        
        // Kiểm tra xem đã chọn dịch vụ chưa
        if (!values.treatmentService) {
          showNotification("Vui lòng chọn dịch vụ điều trị", "error");
          form.scrollToField('treatmentService');
          setLoading(false);
          return;
        }
        
        // Kiểm tra xem đã chọn ngày hẹn chưa
        if (!values.appointmentDate) {
          showNotification("Vui lòng chọn ngày thăm khám", "error");
          form.scrollToField('appointmentDate');
          setLoading(false);
          return;
        }

        // Xử lý doctorId đúng định dạng
        let doctorId = values.doctor;
        
        // Nếu doctorId là chuỗi rỗng, gán null
        if (doctorId === "") {
          doctorId = null;
        }
        // Nếu doctorId bắt đầu bằng "dr_", cắt bỏ tiền tố
        else if (typeof doctorId === 'string' && doctorId.startsWith('dr_')) {
          doctorId = doctorId.substring(3);
        }
        
        console.log("Debug - final doctorId:", doctorId, typeof doctorId);

        // Chuẩn bị dữ liệu đăng ký theo đúng định dạng API yêu cầu
        const registerData = {
          customerId: currentUser.id,
          doctorId: doctorId,
          treatmentServiceId: parseInt(values.treatmentService),
          startDate: values.appointmentDate.format('YYYY-MM-DD'),
          shift: values.shift || "morning",
          cd1Date: values.cd1Date ? values.cd1Date.format('YYYY-MM-DD') : null
        };
        
        console.log("Debug - registerData:", registerData);
        
        // Gọi API đăng ký dịch vụ
        const response = await serviceService.registerTreatmentService(registerData);
        
        setLoading(false);
        
        if (response && response.status >= 200 && response.status < 300) {
          // Hiển thị thông báo thành công
          showNotification("Đăng ký dịch vụ thành công!", "success");
          
          // Reset form và các state
          form.resetFields();
          setSelectedDoctor(null);
          setShowDoctorSchedule(false);
          
          // Chuyển hướng về trang chủ sau khi đăng ký thành công
          setTimeout(() => {
            navigate('/', { 
              state: { 
                registrationSuccess: true,
                serviceName: treatmentServices.find(s => s.value === values.treatmentService)?.label || 'Dịch vụ'
              } 
            });
          }, 2000);
        } else {
          // Hiển thị thông báo lỗi
          showNotification("Đăng ký dịch vụ không thành công. Vui lòng kiểm tra lại thông tin và thử lại.", "error");
          form.scrollToField('firstName');
        }
      } catch (error) {
        // Xử lý lỗi chi tiết
        let errorMessage = "Đăng ký dịch vụ không thành công. Vui lòng thử lại sau.";
        
        // Kiểm tra các loại lỗi cụ thể
        if (error.response) {
          // In ra chi tiết lỗi để debug
          console.log("Debug - error response:", error.response.status, error.response.data);
          
          // Lỗi từ phản hồi của server
          if (error.response.status === 400) {
            // Kiểm tra xem có phải lỗi bác sĩ không khả dụng không
            if (error.response.data && 
               (error.response.data.message === "Doctor is not available for the selected date and shift" ||
                error.response.data.message.includes("not available"))) {
              errorMessage = "Bác sĩ không có lịch trống vào ngày và ca bạn đã chọn. Vui lòng chọn ngày hoặc ca khác.";
              
              // Đánh dấu trạng thái bác sĩ không khả dụng
              setDoctorNotAvailable(true);
              
              // Đánh dấu các trường cần sửa
              form.scrollToField('appointmentDate');
            } else {
              errorMessage = "Dữ liệu đăng ký không hợp lệ. Vui lòng kiểm tra lại thông tin.";
            }
          } else if (error.response.status === 401) {
            errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
          } else if (error.response.status === 404) {
            errorMessage = "Không tìm thấy bác sĩ hoặc dịch vụ. Vui lòng kiểm tra lại thông tin.";
          } else if (error.response.status === 415) {
            errorMessage = "Định dạng dữ liệu không được hỗ trợ. Vui lòng thử lại.";
          } else if (error.response.status === 500) {
            errorMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
          }
          
          // Nếu server trả về thông báo lỗi cụ thể
          if (error.response.data && error.response.data.message) {
            if (error.response.data.message === "Doctor is not available for the selected date and shift") {
              errorMessage = "Bác sĩ không có lịch trống vào ngày và ca bạn đã chọn. Vui lòng chọn ngày hoặc ca khác.";
              setDoctorNotAvailable(true);
            } else {
              errorMessage = error.response.data.message;
            }
          }
        } else if (error.request) {
          // Không nhận được phản hồi từ server
          errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.";
        }
        
        showNotification(errorMessage, "error");
        setLoading(false);
        
        // Cuộn lên đầu form
        const formElement = document.querySelector('.ant-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    
    registerTreatment();
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
                validateMessages={{
                  required: '${label} là trường bắt buộc!',
                  types: {
                    email: '${label} không đúng định dạng!',
                    number: '${label} phải là số!'
                  }
                }}
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
                      <Radio.Group>
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
                    {doctorNotAvailable && (
                      <div className="text-red-500 text-sm mb-2">
                        <span>⚠️ Bác sĩ không có lịch trống vào ngày và ca này. Vui lòng chọn ngày hoặc ca khác.</span>
                      </div>
                    )}
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
                    {doctorNotAvailable && (
                      <div className="text-blue-500 text-sm mb-2">
                        <span>💡 Gợi ý: Thử chọn buổi khám khác hoặc chọn "Không chọn - Bác sĩ có sẵn" để hệ thống tự động phân bác sĩ có lịch trống.</span>
                      </div>
                    )}
                  </Col>
                </Row>
                
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="cd1Date"
                      label="Ngày rụng trứng gần nhất (CD1)"
                      tooltip="CD1 là ngày rụng trứng gần nhất, thông tin quan trọng giúp bác sĩ lập kế hoạch điều trị hiệu quả"
                      rules={[{ required: false, message: "Vui lòng chọn ngày rụng trứng gần nhất nếu có" }]}
                    >
                      <DatePicker 
                        className="w-full" 
                        size="large" 
                        placeholder="Chọn ngày rụng trứng gần nhất"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                      />
                    </Form.Item>
                    <div className="text-gray-500 text-sm mt-1">
                      <i>Thông tin này giúp bác sĩ xác định chu kỳ kinh nguyệt và lập kế hoạch điều trị phù hợp</i>
                    </div>
                  </Col>
                </Row>
                
                <Form.Item
                  name="treatmentService"
                  label="Gói dịch vụ điều trị"
                  rules={[{ required: true, message: "Vui lòng chọn gói dịch vụ" }]}
                >
                  {servicesLoading ? (
                    <div className="flex items-center">
                      <Spin size="small" className="mr-2" />
                      <span>Đang tải danh sách dịch vụ...</span>
                    </div>
                  ) : (
                    <Select placeholder="-- Chọn gói dịch vụ --" size="large">
                      {treatmentServices.map(service => (
                        <Option key={service.value} value={service.value}>{service.label}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                
                <Form.Item
                  name="doctor"
                  label={initialSelectedDoctor ? "Bác sĩ đã chọn" : "Chỉ định bác sĩ điều trị (nếu muốn)"}
                >
                  {initialSelectedDoctor ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                      <Text strong className="text-green-700 text-lg">
                        {doctorName || doctors.find(doc => doc.value === initialSelectedDoctor)?.label || "Bác sĩ đã được chỉ định"}
                      </Text>
                      
                      {doctorRole && (
                        <div className="mt-1 text-[#ff8460] font-medium">
                          {doctorRole}
                        </div>
                      )}
                      
                      {doctorSpecialization && (
                        <div className="mt-1 text-gray-700">
                          {doctorSpecialization}
                        </div>
                      )}
                      
                      {doctorNotAvailable && (
                        <div className="mt-3">
                          <Button 
                            danger
                            onClick={() => {
                              setSelectedDoctor(null);
                              form.setFieldsValue({ doctor: "" });
                              setDoctorNotAvailable(false);
                              showNotification("Đã xóa lựa chọn bác sĩ. Hệ thống sẽ tự động phân bác sĩ có lịch trống.", "info");
                            }}
                          >
                            Chọn bác sĩ khác
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : doctorsLoading ? (
                    <div className="flex items-center">
                      <Spin size="small" className="mr-2" />
                      <span>Đang tải danh sách bác sĩ...</span>
                    </div>
                  ) : (
                    <Select 
                      placeholder="-- Không chọn --" 
                      size="large"
                      onChange={onDoctorChange}
                    >
                      {doctors.map(doctor => (
                        <Option key={doctor.value} value={doctor.value}>{doctor.label}</Option>
                      ))}
                    </Select>
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
                          {/* Doctor schedule content will be populated here */}
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