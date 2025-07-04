import { useEffect, useState } from "react";
import { Form, message } from "antd";

import { useNavigate } from "react-router-dom";
import { doctorService } from "../service/doctor.service";
import { serviceService } from "../service/service.service";
import { authService } from "../service/auth.service";

export function useRegisterLogic() {
  const [form] = Form.useForm();
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
    fetchServices();
    preloadUserInfo();
  }, []);

  const fetchDoctors = async () => {
    const res = await doctorService.getDoctorForCard();
    setDoctors(res?.data?.result?.content || []);
  };

  const fetchServices = async () => {
    const res = await serviceService.getPublicServices();
    setServices(res?.data?.result?.content || []);
  };

  const preloadUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await authService.getMyInfo(token);
    const user = res?.data?.result;
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  };

  const onDoctorChange = async (doctorId) => {
    console.log("Bác sĩ được chọn:", doctorId);
    // Có thể thêm logic hiển thị lịch ở đây
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      // Xử lý trực tiếp tại đây – không qua utils
      const payload = {
        customerId: "current-user-id",
        doctorId: values.doctorId || null,
        treatmentServiceId: parseInt(values.serviceId),
        startDate: values.appointmentDate.format("YYYY-MM-DD"),
        shift: values.shift.toUpperCase(),
      };

      await treatmentService.registerTreatmentService(payload);
      message.success("Đăng ký thành công");
      form.resetFields();
      navigate("/customer-dashboard/services");
    } catch (err) {
      message.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    doctors,
    services,
    loading,
    onSubmit,
    onDoctorChange,
  };
}
