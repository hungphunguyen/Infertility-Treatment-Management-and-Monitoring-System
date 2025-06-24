import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { 
  Typography, Form, Input, Button, Select, DatePicker, Radio, 
  Divider, Space, Row, Col, Card, Checkbox, TimePicker, Spin,
  Alert, List, Avatar, Descriptions
} from "antd";
import { 
  UserOutlined, CalendarOutlined, PhoneOutlined, 
  MailOutlined, MedicineBoxOutlined, IdcardOutlined, HomeOutlined,
  CheckCircleOutlined, ClockCircleOutlined
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

// Add this helper function at the top of the file, outside the component
function removeIncompleteWarning() {
  // Target all possible alert elements
  const alerts = document.querySelectorAll('.ant-alert, .ant-message-notice, [role="alert"]');
  
  alerts.forEach(alert => {
    if (alert && alert.textContent) {
      const text = alert.textContent.toLowerCase();
      if (text.includes('incomplete treatment') || 
          text.includes('please complete it') || 
          text.includes('before registering')) {
        // If it's a direct element, remove it
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
        
        // If it's in a container, try to find the container and remove it
        let parent = alert;
        for (let i = 0; i < 5; i++) { // Check up to 5 levels up
          parent = parent.parentNode;
          if (parent && (
              parent.classList.contains('ant-message') || 
              parent.classList.contains('ant-alert-wrapper') ||
              parent.classList.contains('ant-notification'))) {
            parent.style.display = 'none';
            break;
          }
        }
      }
    }
  });
}

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
  
  // Add new state for available doctors
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  
  // Add state to track unavailable doctor and newly selected doctor
  const [unavailableDoctor, setUnavailableDoctor] = useState(null);
  const [newlySelectedDoctor, setNewlySelectedDoctor] = useState(null);
  
  // Add state for doctor schedule
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  
  // Always ignore incomplete treatment warning
  const [ignoreIncompleteWarning, setIgnoreIncompleteWarning] = useState(true);
  
  // Add more aggressive DOM cleanup on mount and for every render
  useEffect(() => {
    // Remove immediately
    removeIncompleteWarning();
    
    // Set up an interval to keep checking and removing the warning
    const intervalId = setInterval(removeIncompleteWarning, 100);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Add a MutationObserver to detect and remove the warning as soon as it's added to the DOM
  useEffect(() => {
    // Create a mutation observer to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // If new nodes are added, check if they contain the warning
          removeIncompleteWarning();
        }
      }
    });
    
    // Start observing the entire document for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Clean up observer on unmount
    return () => observer.disconnect();
  }, []);
  
  // Add CSS to hide elements with the warning text
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    style.innerHTML = `
      [role="alert"]:has(*:contains('incomplete treatment')),
      [role="alert"]:has(*:contains('Please complete it')),
      .ant-alert:has(*:contains('incomplete treatment')),
      .ant-alert:has(*:contains('Please complete it')),
      .ant-message-notice:has(*:contains('incomplete treatment')),
      .ant-message-notice:has(*:contains('Please complete it')) {
        display: none !important;
      }
    `;
    
    // Add it to the document head
    document.head.appendChild(style);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Hide the incomplete treatment warning message that appears at the top of the page
  useEffect(() => {
    // Find and hide the warning element
    const hideWarningMessage = () => {
      const warningElements = document.querySelectorAll('.ant-alert-warning, .ant-alert-error');
      warningElements.forEach(element => {
        if (element.textContent && 
            (element.textContent.includes('incomplete treatment') || 
             element.textContent.includes('Please complete it'))) {
          element.style.display = 'none';
        }
      });
    };
    
    // Run initially and set up interval to keep checking
    hideWarningMessage();
    const interval = setInterval(hideWarningMessage, 500);
    
    return () => clearInterval(interval);
  }, []);

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
    // If a doctor was selected from the doctor's page, set the form field and fetch their schedule
    if (initialSelectedDoctor) {
      console.log("🔍 Initial doctor selection detected:", initialSelectedDoctor);
      console.log("🔍 Doctor name:", doctorName);
      console.log("🔍 Doctor role:", doctorRole);
      console.log("🔍 Doctor specialization:", doctorSpecialization);
      
      // We need to call the same logic as onDoctorChange
      const fetchInitialDoctorSchedule = async (doctorId) => {
        if (!doctorId) return;

        console.log("🔍 Fetching schedule for doctor ID:", doctorId);

        // Set the selected doctor in state and form
        setSelectedDoctor(doctorId);
        form.setFieldsValue({ doctor: doctorId });

        // Show loading state for schedule
        setScheduleLoading(true);
        setDoctorSchedule(null);
        setShowDoctorSchedule(false);

        try {
          // Call API to get doctor schedule
          const response = await doctorService.getDoctorScheduleById(doctorId);
          console.log("🔍 Doctor Schedule API Response:", response);
          console.log("🔍 Response data:", response.data);
          console.log("🔍 Response result:", response.data?.result);
          
          if (response.data && response.data.result) {
            console.log("✅ Setting doctor schedule:", response.data.result);
            setDoctorSchedule(response.data.result);
            setShowDoctorSchedule(true);
          } else {
            console.log("❌ No schedule data found");
            // No schedule found or error
            setDoctorSchedule(null);
            setShowDoctorSchedule(false);
          }
        } catch (error) {
          console.error("❌ Error fetching doctor schedule:", error);
          // Handle error if schedule fetching fails
          setDoctorSchedule(null);
          setShowDoctorSchedule(false);
        } finally {
          setScheduleLoading(false);
        }
      };

      fetchInitialDoctorSchedule(initialSelectedDoctor);
    }
    
    // If a service was selected from the service detail page, set the form field
    if (selectedService) {
      form.setFieldsValue({
        treatmentService: selectedService.toString()
      });
    }
  }, [initialSelectedDoctor, selectedService, form]);

  // Debug useEffect to monitor schedule state changes
  useEffect(() => {
    console.log("🔍 State Debug - showDoctorSchedule:", showDoctorSchedule);
    console.log("🔍 State Debug - doctorSchedule:", doctorSchedule);
    console.log("🔍 State Debug - scheduleLoading:", scheduleLoading);
  }, [showDoctorSchedule, doctorSchedule, scheduleLoading]);

  // Add function to check doctor availability
  const checkDoctorAvailability = async (date, shift) => {
    if (!date || !shift) return;
    
    try {
      setCheckingAvailability(true);
      
      // Format the date as YYYY-MM-DD
      const formattedDate = date.format('YYYY-MM-DD');
      
      // Convert shift to uppercase as required by API
      const formattedShift = shift.toUpperCase();
      
      // Call the API to get available doctors
      const response = await doctorService.getAvailableDoctors(formattedDate, formattedShift);
      
      if (response && response.data && response.data.result) {
        const availableDoctorsData = Array.isArray(response.data.result) ? response.data.result : [response.data.result];
        setAvailableDoctors(availableDoctorsData);
        setAvailabilityChecked(true);
        
        // Update the doctors dropdown with only available doctors
        const mappedAvailableDoctors = availableDoctorsData.map(doctor => ({
          value: doctor.id,
          label: `${doctor.fullName || "Bác sĩ"} - ${doctor.qualifications || "Chuyên khoa"}`,
          specialty: doctor.qualifications || "Chuyên khoa"
        }));
        
        // If there's an initially selected doctor, make sure they're included
        if (initialSelectedDoctor && !availableDoctorsData.find(d => d.id === initialSelectedDoctor)) {
          // Find the initially selected doctor from the original doctors list
          const originalDoctors = await fetchOriginalDoctors();
          const selectedDoctor = originalDoctors.find(d => d.value === initialSelectedDoctor);
          if (selectedDoctor) {
            mappedAvailableDoctors.unshift(selectedDoctor);
          }
        }
        
        // Add "No selection" option
        mappedAvailableDoctors.push({ value: "", label: "Không chọn - Bác sĩ có sẵn", specialty: "Tổng quát" });
        
        // Update the doctors state with only available doctors
        setDoctors(mappedAvailableDoctors);
      } else {
        setAvailableDoctors([]);
        setAvailabilityChecked(true);
        
        // If no doctors available, show empty list with "No selection" option
        setDoctors([{ value: "", label: "Không có bác sĩ có lịch trống - Vui lòng chọn ngày/ca khác", specialty: "Tổng quát" }]);
      }
    } catch (error) {
      console.error("Error checking doctor availability:", error);
      setAvailableDoctors([]);
      setAvailabilityChecked(true);
      
      // On error, show empty list with "No selection" option
      setDoctors([{ value: "", label: "Không thể tải danh sách bác sĩ - Vui lòng thử lại", specialty: "Tổng quát" }]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Helper function to fetch original doctors list
  const fetchOriginalDoctors = async () => {
    try {
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
        
        return mappedDoctors;
      }
    } catch (error) {
      console.error("Error fetching original doctors:", error);
    }
    return [];
  };

  // Add effect to check availability when date or shift changes
  useEffect(() => {
    const appointmentDate = form.getFieldValue('appointmentDate');
    const shift = form.getFieldValue('shift');
    
    if (appointmentDate && shift) {
      checkDoctorAvailability(appointmentDate, shift);
    } else {
      setAvailabilityChecked(false);
      // Reset doctors list to original state when no date/shift selected
      fetchDoctors();
    }
  }, [form.getFieldValue('appointmentDate'), form.getFieldValue('shift')]);

  // Modify existing handlers to check availability
  const onDateChange = (date) => {
    const shift = form.getFieldValue('shift');
    if (date && shift) {
      checkDoctorAvailability(date, shift);
    } else {
      setAvailabilityChecked(false);
      // Reset doctors list to original state when no date/shift selected
      fetchDoctors();
    }
  };

  const onShiftChange = (value) => {
    const appointmentDate = form.getFieldValue('appointmentDate');
    if (appointmentDate && value) {
      checkDoctorAvailability(appointmentDate, value);
    } else {
      setAvailabilityChecked(false);
      // Reset doctors list to original state when no date/shift selected
      fetchDoctors();
    }
  };

  // Modify onDoctorChange to check if doctor is available
  const onDoctorChange = async (value) => {
    setSelectedDoctor(value);
    setDoctorNotAvailable(false);
    setAvailableDoctors([]);
    setAvailabilityChecked(false);
    
    if (!value || value === "") {
      // If user selects "No doctor" option
      form.setFieldsValue({ doctor: null });
      setShowDoctorSchedule(false);
      setDoctorSchedule(null);
      return;
    }
    
    // Fetch doctor schedule when a doctor is selected, same logic as initial fetch
    setScheduleLoading(true);
    setDoctorSchedule(null);
    setShowDoctorSchedule(false);

    try {
      const response = await doctorService.getDoctorScheduleById(value);
      console.log("🔍 onDoctorChange - API Response:", response);
      console.log("🔍 onDoctorChange - Response data:", response.data);
      console.log("🔍 onDoctorChange - Response result:", response.data?.result);
      
      if (response.data && response.data.result) {
        console.log("✅ onDoctorChange - Setting doctor schedule:", response.data.result);
        setDoctorSchedule(response.data.result);
        setShowDoctorSchedule(true);
      } else {
        console.log("❌ onDoctorChange - No schedule data found");
        setDoctorSchedule(null);
        setShowDoctorSchedule(false);
      }
    } catch (error) {
      console.error("❌ onDoctorChange - Error fetching doctor schedule:", error);
      setDoctorSchedule(null);
      setShowDoctorSchedule(false);
    } finally {
      setScheduleLoading(false);
    }
  };

  // Function to handle schedule selection
  const handleScheduleSelection = (date, shift) => {
    form.setFieldsValue({
      appointmentDate: dayjs(date),
      shift: shift.toLowerCase()
    });
  };

  // Add a more comprehensive error handler that also shows more info to the user in this scenario
  const onFinish = (values) => {
    setLoading(true);
    setDoctorNotAvailable(false); // Reset doctor status
    
    // Call the API to register treatment service
    const registerTreatment = async () => {
      try {
        // Kiểm tra đăng nhập và thông tin người dùng
        const token = getLocgetlStorage("token");
        
        console.log("Debug - currentUser:", currentUser);
        console.log("Debug - token:", token ? "Có token" : "Không có token");
        console.log("Debug - form values:", values);
        console.log("Debug - selectedDoctor:", selectedDoctor);
        console.log("Debug - ignoreIncompleteWarning:", ignoreIncompleteWarning);
        
        // Kiểm tra xem token có tồn tại không (người dùng đã đăng nhập)
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Kiểm tra xem có thông tin người dùng không
        if (!currentUser || !currentUser.id) {
          showNotification("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.", "error");
          setLoading(false);
          return;
        }
        
        // Kiểm tra các trường bắt buộc
        const requiredFields = [
          { name: 'firstName', message: 'Vui lòng nhập họ tên', field: 'firstName' },
          { name: 'email', message: 'Vui lòng nhập email', field: 'email' },
          { name: 'phone', message: 'Vui lòng nhập số điện thoại', field: 'phone' },
          { name: 'dateOfBirth', message: 'Vui lòng chọn ngày sinh', field: 'dateOfBirth' },
          { name: 'gender', message: 'Vui lòng chọn giới tính', field: 'gender' },
          { name: 'address', message: 'Vui lòng nhập địa chỉ', field: 'address' },
          { name: 'appointmentDate', message: 'Vui lòng chọn ngày thăm khám', field: 'appointmentDate' },
          { name: 'shift', message: 'Vui lòng chọn buổi khám', field: 'shift' },
          { name: 'treatmentService', message: 'Vui lòng chọn dịch vụ điều trị', field: 'treatmentService' }
        ];
        
        for (const field of requiredFields) {
          if (!values[field.name]) {
            showNotification(field.message, "error");
            form.scrollToField(field.field);
            setLoading(false);
            return;
          }
        }

        // Xử lý doctorId đúng định dạng - cho phép rỗng để hệ thống tự chọn
        let doctorId = values.doctor;
        
        // Nếu doctorId là chuỗi rỗng hoặc null, gán chuỗi rỗng để hệ thống tự chọn
        if (!doctorId || doctorId === "") {
          doctorId = "";
        }
        // Nếu doctorId bắt đầu bằng "dr_", cắt bỏ tiền tố
        else if (typeof doctorId === 'string' && doctorId.startsWith('dr_')) {
          doctorId = doctorId.substring(3);
        }
        
        console.log("Debug - final doctorId:", doctorId, typeof doctorId);

        // Create direct API payload - remove any unnecessary fields
        const registerData = {
          customerId: currentUser.id,
          doctorId: doctorId,
          treatmentServiceId: parseInt(values.treatmentService),
          startDate: values.appointmentDate.format('YYYY-MM-DD'),
          shift: values.shift.toUpperCase() || "MORNING",
        };
        
        // Only add optional fields if they have values
        if (values.cd1Date) {
          registerData.cd1Date = values.cd1Date.format('YYYY-MM-DD');
        }
        
        if (values.medicalHistory) {
          registerData.medicalHistory = values.medicalHistory;
        }
        
        console.log("Debug - simplified registerData:", registerData);
        
        // Add loader indicator
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
        }
        
        // Direct registration approach - show the user what's happening
        showNotification("Đang xử lý đăng ký...", "info");
        
        try {
          // Call the API directly
          const response = await serviceService.registerTreatmentService(registerData);
          
          console.log("Debug - API response:", response);
          
          if (response && response.status >= 200 && response.status < 300) {
            // Hiển thị thông báo thành công
            showNotification("Đăng ký dịch vụ thành công!", "success");
            
            // Reset form và các state
            form.resetFields();
            setSelectedDoctor(null);
            setShowDoctorSchedule(false);
            setDoctorSchedule(null);
            setAvailableDoctors([]);
            setAvailabilityChecked(false);
            
            // Chuyển hướng đến trang customer-dashboard/treatment sau khi đăng ký thành công
            setTimeout(() => {
              navigate('/customer-dashboard/treatment', { 
                state: { 
                  registrationSuccess: true,
                  serviceName: treatmentServices.find(s => s.value === values.treatmentService)?.label || 'Dịch vụ'
                } 
              });
            }, 2000);
          } else {
            throw new Error("Unexpected response");
          }
        } catch (apiError) {
          // Sử dụng message từ BE nếu có
          let errorMessage = "Đăng ký dịch vụ không thành công. Vui lòng thử lại sau.";
          if (apiError.response && apiError.response.data && apiError.response.data.message) {
            errorMessage = apiError.response.data.message;
          }
          showNotification(errorMessage, "error");
          throw apiError;
        } finally {
          // Always re-enable the button
          if (submitButton) {
            submitButton.disabled = false;
          }
          setLoading(false);
        }
      } catch (err) {
        // Không hiển thị thông báo lỗi ở đây vì đã hiển thị ở trên
        // Re-enable submit button nếu cần
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = false;
        }
        setLoading(false);
      }
    };
    
    registerTreatment();
  };

  const isLoggedIn = !!token;

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
              {!isLoggedIn && (
                <Alert
                  message="Vui lòng đăng nhập để đăng ký dịch vụ"
                  type="warning"
                  showIcon
                  className="mb-4"
                />
              )}
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                scrollToFirstError
                disabled={!isLoggedIn}
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
                        disabled={isLoggedIn}
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
                        disabled={isLoggedIn}
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
                        disabled={isLoggedIn}
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
                        disabled={isLoggedIn}
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
                      <Radio.Group disabled={isLoggedIn}>
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
                        disabled={isLoggedIn}
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
                        onChange={onDateChange}
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
                      <Select 
                        placeholder="-- Chọn buổi khám --" 
                        size="large"
                        onChange={onShiftChange}
                      >
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
                      label="Ngày đầu chu kì"
                      tooltip="Thông tin quan trọng giúp bác sĩ lập kế hoạch điều trị hiệu quả"
                      rules={[{ required: false, message: "Vui lòng đầu chu kì nếu có" }]}
                    >
                      <DatePicker 
                        className="w-full" 
                        size="large" 
                        placeholder="Chọn ngày đầu chu kỳ"
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
                  label={initialSelectedDoctor ? "Bác sĩ đã chọn" : "Chỉ định bác sĩ điều trị (tùy chọn)"}
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
                    </div>
                  ) : doctorsLoading ? (
                    <div className="flex items-center">
                      <Spin size="small" className="mr-2" />
                      <span>Đang tải danh sách bác sĩ...</span>
                    </div>
                  ) : (
                    <Select 
                      placeholder="-- Không chọn (hệ thống tự phân bác sĩ) --" 
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
                {showDoctorSchedule && doctorSchedule && (
                  <Card className="mb-4" style={{ backgroundColor: '#f9f9f9' }}>
                    <Title level={4}>🗓 Lịch làm việc của bác sĩ</Title>
                    {scheduleLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Spin size="large" />
                        <span className="ml-2">Đang tải lịch làm việc...</span>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                          <thead>
                            <tr>
                              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', backgroundColor: '#eee' }}>Ngày</th>
                              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', backgroundColor: '#eee' }}>Ca sáng</th>
                              <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', backgroundColor: '#eee' }}>Ca chiều</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(doctorSchedule.schedules || {}).map(([date, shifts]) => (
                              <tr key={date}>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                  {dayjs(date).format('DD/MM/YYYY')}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                  {shifts.includes('MORNING') ? (
                                    <Button 
                                      type="primary" 
                                      size="small"
                                      onClick={() => handleScheduleSelection(date, 'MORNING')}
                                    >
                                      Chọn
                                    </Button>
                                  ) : (
                                    <span style={{ color: '#ccc' }}>Nghỉ</span>
                                  )}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                                  {shifts.includes('AFTERNOON') ? (
                                    <Button 
                                      type="primary" 
                                      size="small"
                                      onClick={() => handleScheduleSelection(date, 'AFTERNOON')}
                                    >
                                      Chọn
                                    </Button>
                                  ) : (
                                    <span style={{ color: '#ccc' }}>Nghỉ</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                )}
                
                {/* Available Doctors Section - Only show when no doctor is selected */}
                {!selectedDoctor && (availabilityChecked || doctorNotAvailable) && (
                  <div className="mt-4 mb-4">
                    <Card 
                      title={
                        <div className="flex items-center">
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                          <span>
                            {doctorNotAvailable && unavailableDoctor 
                              ? `Bác sĩ ${unavailableDoctor.name} không có lịch - Vui lòng chọn bác sĩ khác` 
                              : "Bác sĩ có lịch trống"}
                          </span>
                          {checkingAvailability && <Spin size="small" className="ml-2" />}
                        </div>
                      }
                      size="small"
                      className={doctorNotAvailable ? "bg-blue-50 border-blue-200" : "bg-green-50"}
                    >
                      {availableDoctors.length > 0 ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={availableDoctors}
                          renderItem={doctor => (
                            <List.Item
                              actions={[
                                <Button 
                                  type={doctorNotAvailable ? "primary" : "default"}
                                  size="small"
                                  onClick={() => {
                                    // Update the selected doctor
                                    setSelectedDoctor(doctor.id);
                                    form.setFieldsValue({ doctor: doctor.id });
                                    
                                    // Store information about the newly selected doctor
                                    setNewlySelectedDoctor({
                                      id: doctor.id,
                                      name: doctor.fullName || "Bác sĩ",
                                      specialty: doctor.specialty || doctor.qualifications || "Chuyên khoa"
                                    });
                                    
                                    setDoctorNotAvailable(false);
                                    
                                    // Scroll to the doctor field to show the selection
                                    form.scrollToField('doctor');
                                    
                                    // Hide available doctors list after selection since doctor is available
                                    setAvailabilityChecked(false);
                                  }}
                                >
                                  Chọn
                                </Button>
                              ]}
                            >
                              <List.Item.Meta
                                avatar={<Avatar src={doctor.avatarUrl || "https://via.placeholder.com/40"} />}
                                title={
                                  <div className="flex items-center">
                                    <span className="font-medium">{doctor.fullName || "Bác sĩ"}</span>
                                    {selectedDoctor === doctor.id && (
                                      <span className="ml-2 text-green-500 text-xs font-bold">✓ Đã chọn</span>
                                    )}
                                  </div>
                                }
                                description={
                                  <div>
                                    <div>{doctor.specialty || doctor.qualifications || "Chuyên khoa"}</div>
                                    <div className="text-xs text-gray-500">
                                      {doctor.experienceYears ? `${doctor.experienceYears} năm kinh nghiệm` : ''}
                                      {doctor.graduationYear ? ` • Tốt nghiệp năm ${doctor.graduationYear}` : ''}
                                    </div>
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Alert
                          message="Không có bác sĩ nào có lịch trống vào ngày và ca đã chọn"
                          description="Vui lòng chọn ngày hoặc ca khám khác."
                          type="info"
                          showIcon
                        />
                      )}
                    </Card>
                  </div>
                )}
                
                <Divider />
                
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
                    onClick={() => {
                      // Force form validation before submission
                      form.validateFields()
                        .then(values => {
                          // Instead of form.submit() which might not trigger onFinish
                          // Call onFinish directly with validated values
                          onFinish(values);
                        })
                        .catch(error => {
                          console.log("Validation error:", error);
                          // Show validation errors to the user
                          if (error.errorFields && error.errorFields.length > 0) {
                            const firstError = error.errorFields[0];
                            showNotification(firstError.errors[0], "error");
                            form.scrollToField(firstError.name[0]);
                          }
                        });
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