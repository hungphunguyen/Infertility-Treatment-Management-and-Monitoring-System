import { useRegisterLogic } from "../hooks/useRegisterLogic";
import RegisterForm from "../components/registerService/RegisterForm";
import { HeartFilled } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { useEffect, useState, useContext } from "react";
import { Form, Input, Select, DatePicker, Button, Radio, Spin, Typography, Row, Col, Divider, Card } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { NotificationContext } from "../App";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { authService } from "../service/auth.service";
import { serviceService } from "../service/service.service";
import { doctorService } from "../service/doctor.service";
import { treatmentService } from "../service/treatment.service";
import { getLocgetlStorage } from "../utils/util";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Add this helper function at the top of the file, outside the component
function removeIncompleteWarning() {
  // Target all possible alert elements
  const alerts = document.querySelectorAll(
    '.ant-alert, .ant-message-notice, [role="alert"]'
  );

  alerts.forEach((alert) => {
    if (alert && alert.textContent) {
      const text = alert.textContent.toLowerCase();
      if (
        text.includes("incomplete treatment") ||
        text.includes("please complete it") ||
        text.includes("before registering")
      ) {
        // If it's a direct element, remove it
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }

        // If it's in a container, try to find the container and remove it
        let parent = alert;
        for (let i = 0; i < 5; i++) {
          // Check up to 5 levels up
          parent = parent.parentNode;
          if (
            parent &&
            (parent.classList.contains("ant-message") ||
              parent.classList.contains("ant-alert-wrapper") ||
              parent.classList.contains("ant-notification"))
          ) {
            parent.style.display = "none";
            break;
          }
        }
      }
    }
  });
}

const MONTHS_VI = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function RegisterServicePage() {
  const {
    form,
    doctors,
    services,
    loading,
    availableDoctors,
    setSelectedDate,
    setSelectedShift,
    onSubmit,
    onDoctorChange,
  } = useRegisterLogic();

  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-10">
          <RegisterForm
            form={form}
            doctors={doctors}
            availableDoctors={availableDoctors}
            services={services}
            loading={loading}
            onSubmit={onSubmit}
            onDoctorChange={onDoctorChange}
            setSelectedDate={setSelectedDate}
            setSelectedShift={setSelectedShift}
          />
        </div>
      </div>
      <UserFooter />
    </>
  );
}
