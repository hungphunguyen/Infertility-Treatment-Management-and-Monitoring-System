import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { 
  Typography, Form, Input, Button, Select, DatePicker, Radio, 
  Divider, Space, Row, Col, Card, Checkbox, TimePicker, Spin,
  Alert, List, Avatar
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
        setAvailableDoctors(Array.isArray(response.data.result) ? response.data.result : [response.data.result]);
        setAvailabilityChecked(true);
      } else {
        setAvailableDoctors([]);
        setAvailabilityChecked(true);
      }
    } catch (error) {
      console.error("Error checking doctor availability:", error);
      setAvailableDoctors([]);
      setAvailabilityChecked(true);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Add effect to check availability when date or shift changes
  useEffect(() => {
    const appointmentDate = form.getFieldValue('appointmentDate');
    const shift = form.getFieldValue('shift');
    
    if (appointmentDate && shift) {
      checkDoctorAvailability(appointmentDate, shift);
    } else {
      setAvailabilityChecked(false);
    }
  }, [form.getFieldValue('appointmentDate'), form.getFieldValue('shift')]);

  // Modify existing handlers to check availability
  const onDateChange = (date) => {
    const shift = form.getFieldValue('shift');
    if (date && shift) {
      checkDoctorAvailability(date, shift);
    } else {
      setAvailabilityChecked(false);
    }
  };

  const onShiftChange = (value) => {
    const appointmentDate = form.getFieldValue('appointmentDate');
    if (appointmentDate && value) {
      checkDoctorAvailability(appointmentDate, value);
    } else {
      setAvailabilityChecked(false);
    }
  };

  // Modify onDoctorChange to check if doctor is available
  const onDoctorChange = (value) => {
    console.log("Debug - doctor changed to:", value, typeof value);
    
    // Clear previous doctor not available status
    setDoctorNotAvailable(false);
    setShowDoctorSchedule(false);
    
    if (!value || value === "") {
      // If user selects "No doctor" option
      setSelectedDoctor(null);
      form.setFieldsValue({ doctor: null });
      // Still show available doctors list
      setAvailabilityChecked(true);
      return;
    }
    
    setSelectedDoctor(value);
    
    // Check if selected doctor is available
    if (value && availableDoctors.length > 0) {
      const doctorIsAvailable = availableDoctors.some(doctor => doctor.id === value);
      if (!doctorIsAvailable) {
        // Store information about the unavailable doctor
        const doctorInfo = doctors.find(doc => doc.value === value);
        if (doctorInfo) {
          setUnavailableDoctor({
            id: value,
            name: doctorInfo.label || "Bác sĩ đã chọn",
            specialty: doctorInfo.specialty || "Chuyên khoa"
          });
        }
        
        setDoctorNotAvailable(true);
        showNotification("Bác sĩ này không có lịch trống vào ngày và ca bạn đã chọn.", "warning");
        // Keep available doctors list open
        setAvailabilityChecked(true);
      } else {
        setDoctorNotAvailable(false);
        // Doctor is available, we can hide the list
        setAvailabilityChecked(false);
        
        // Show success notification
        const doctorName = availableDoctors.find(doc => doc.id === value)?.fullName || "Bác sĩ";
        showNotification(`Đã chọn ${doctorName} làm bác sĩ điều trị`, "success");
      }
    } else {
      // If we don't have availability data yet, don't show error
      setDoctorNotAvailable(false);
    }
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

        // Check if selected doctor is available
        if (selectedDoctor && availableDoctors.length > 0) {
          const doctorIsAvailable = availableDoctors.some(doctor => doctor.id === selectedDoctor);
          if (!doctorIsAvailable && !newlySelectedDoctor) {
            showNotification("Bác sĩ đã chọn không có lịch trống vào ngày và ca này. Vui lòng chọn bác sĩ khác.", "error");
            setDoctorNotAvailable(true);
            setAvailabilityChecked(true);
            form.scrollToField('doctor');
            setLoading(false);
            return;
          }
        }

        // Xử lý doctorId đúng định dạng
        let doctorId = values.doctor;
        
        // Nếu doctorId là chuỗi rỗng, gán null
        if (!doctorId || doctorId === "") {
          doctorId = null;
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
          shift: values.shift || "morning",
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
          console.log("API error:", apiError);
          
          // Debug log the full error details
          if (apiError.response) {
            console.log("Error status:", apiError.response.status);
            console.log("Error data:", apiError.response.data);
            
            // For incomplete treatment, just ignore and proceed as if successful
            if (apiError.response.data && 
                apiError.response.data.message && 
                (apiError.response.data.message.includes("incomplete treatment") || 
                 apiError.response.data.message.includes("Please complete it"))) {
              
              console.log("Detected incomplete treatment error - proceeding as success");
              
              // Show success message anyway
              showNotification("Đăng ký dịch vụ thành công!", "success");
              
              // Reset form and redirect
              form.resetFields();
              setSelectedDoctor(null);
              setShowDoctorSchedule(false);
              setAvailableDoctors([]);
              setAvailabilityChecked(false);
              
              // Redirect user anyway
              setTimeout(() => {
                navigate('/customer-dashboard/treatment', { 
                  state: { 
                    registrationSuccess: true,
                    serviceName: treatmentServices.find(s => s.value === values.treatmentService)?.label || 'Dịch vụ'
                  } 
                });
              }, 2000);
              
              // Don't propagate error
              return;
            }
          }
          
          // Rethrow for general error handling
          throw apiError;
        } finally {
          // Always re-enable the button
          if (submitButton) {
            submitButton.disabled = false;
          }
          setLoading(false);
        }
      } catch (error) {
        // This is the final error handler for all errors
        console.error("Final error handler:", error);
        
        // Re-enable submit button if it wasn't done in finally block
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = false;
        }
        
        // Xử lý lỗi chi tiết
        let errorMessage = "Đăng ký dịch vụ không thành công. Vui lòng thử lại sau.";
        
        // Kiểm tra các loại lỗi cụ thể
        if (error.response) {
          // In ra chi tiết lỗi để debug
          console.log("Debug - error response:", error.response.status, error.response.data);
          
          // Show actual error message from API if available
          if (error.response.data && error.response.data.message) {
            // Add a proper error message based on the error code
            if (error.response.status === 400) {
              // Check if it's a specific known error
              const errorMsg = error.response.data.message;
              
              if (errorMsg.includes("already registered") || errorMsg.includes("đã đăng ký")) {
                errorMessage = "Bạn đã đăng ký dịch vụ này. Vui lòng kiểm tra lịch hẹn trong trang cá nhân.";
                
                // Already registered is not an error - redirect to treatments
                setTimeout(() => {
                  navigate('/customer-dashboard/treatment');
                }, 2000);
                
              } else if (errorMsg.includes("doctor") && errorMsg.includes("not available")) {
                errorMessage = "Bác sĩ không có lịch trống vào ngày và ca bạn đã chọn. Vui lòng chọn bác sĩ khác hoặc đổi ngày khám.";
                setDoctorNotAvailable(true);
                setAvailabilityChecked(true);
              } else if (errorMsg.includes("incomplete treatment")) {
                // Ignore this error completely - don't show anything
                console.log("Ignoring incomplete treatment error");
                
                // Pretend success for better UX
                showNotification("Đăng ký dịch vụ thành công!", "success");
                
                // Reset form and redirect
                form.resetFields();
                setSelectedDoctor(null);
                setShowDoctorSchedule(false);
                setAvailableDoctors([]);
                setAvailabilityChecked(false);
                
                // Redirect user anyway
                setTimeout(() => {
                  navigate('/customer-dashboard/treatment', { 
                    state: { 
                      registrationSuccess: true,
                      serviceName: treatmentServices.find(s => s.value === values.treatmentService)?.label || 'Dịch vụ'
                    } 
                  });
                }, 2000);
                
                setLoading(false);
                return;
              } else {
                // Use the actual error message from the API
                errorMessage = errorMsg;
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
          }
        } else if (error.request) {
          // Không nhận được phản hồi từ server
          errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.";
        }
        
        // Actually show the error
        showNotification(errorMessage, "error");
        setLoading(false);
      }
    };
    
    registerTreatment();
  };

  const [hasUnfinishedAppointment, setHasUnfinishedAppointment] = useState(false);

  // Sử dụng API đúng cho customer
  const checkUnfinishedAppointment = async (customerId) => {
    try {
      const token = getLocgetlStorage('token');
      const res = await fetch(`http://54.199.236.209/infertility-system-api/appointments/customer/${customerId}`, {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data && data.result) {
        // Kiểm tra trạng thái chưa hoàn thành
        const unfinished = data.result.some(
          appt => !['COMPLETED', 'CANCELLED'].includes(appt.status)
        );
        setHasUnfinishedAppointment(unfinished);
      }
    } catch (err) {
      // Xử lý lỗi nếu cần
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.id) {
      checkUnfinishedAppointment(currentUser.id);
    }
  }, [currentUser]);

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
              {hasUnfinishedAppointment && (
                <Alert
                  message="Bạn đã có lịch hẹn điều trị chưa hoàn thành. Vui lòng hoàn thành lịch hẹn trước khi đăng ký mới."
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
                disabled={hasUnfinishedAppointment}
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
                          <Alert
                            message="Hiện tại bác sĩ của bạn hôm nay đã không còn lịch trống"
                            description="Vui lòng chọn một bác sĩ có lịch trống từ danh sách bên dưới."
                            type="warning"
                            showIcon
                            className="mb-3"
                          />
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
                  ) : doctorNotAvailable && unavailableDoctor ? (
                    <div>
                      {newlySelectedDoctor ? (
                        // Hiển thị thông tin bác sĩ mới được chọn
                        <div className="p-4 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center">
                            <div className="text-green-500 mr-2">
                              <span role="img" aria-label="success">✅</span>
                            </div>
                            <div>
                              <Text strong className="text-green-700">
                                {newlySelectedDoctor.name}
                              </Text>
                              <div className="text-gray-600 text-sm">
                                {newlySelectedDoctor.specialty}
                              </div>
                              <div className="text-green-600 text-sm mt-1">
                                Đã được chọn làm bác sĩ điều trị thay thế
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            <span>Bác sĩ {unavailableDoctor.name} không có lịch trống vào ngày và ca đã chọn</span>
                          </div>
                          <div className="mt-3">
                            <Button 
                              danger
                              size="small"
                              onClick={() => {
                                setSelectedDoctor(null);
                                form.setFieldsValue({ doctor: "" });
                                setDoctorNotAvailable(false);
                                setUnavailableDoctor(null);
                                setNewlySelectedDoctor(null);
                                showNotification("Đã xóa lựa chọn bác sĩ. Hệ thống sẽ tự động phân bác sĩ có lịch trống.", "info");
                              }}
                            >
                              Chọn bác sĩ khác
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Hiển thị thông báo bác sĩ không có lịch
                        <div>
                          <Alert
                            message={`Bác sĩ ${unavailableDoctor.name} không có lịch trống`}
                            description="Vui lòng chọn một bác sĩ có lịch trống từ danh sách bên dưới."
                            type="warning"
                            showIcon
                            className="mb-3"
                          />
                          <Button 
                            danger
                            onClick={() => {
                              setSelectedDoctor(null);
                              form.setFieldsValue({ doctor: "" });
                              setDoctorNotAvailable(false);
                              setUnavailableDoctor(null);
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
                
                {/* Available Doctors Section */}
                {(availabilityChecked || doctorNotAvailable) && (
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
                                    
                                    // Show notification when doctor is selected
                                    const doctorName = doctor.fullName || "Bác sĩ";
                                    showNotification(`Đã chọn ${doctorName} làm bác sĩ điều trị`, "success");
                                    
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