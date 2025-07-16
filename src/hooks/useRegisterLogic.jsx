import { useContext, useEffect, useState } from "react";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import { doctorService } from "../service/doctor.service";
import { serviceService } from "../service/service.service";
import { authService } from "../service/auth.service";
import dayjs from "dayjs";
import { treatmentService } from "../service/treatment.service";
import { NotificationContext } from "../App";
export function useRegisterLogic() {
  const [form] = Form.useForm();
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  useEffect(() => {
    fetchDoctors();
    fetchServices();
    preloadUserInfo();
    fetchScheduleDoctor();
  }, []);

  const fetchDoctors = async () => {
    const res = await doctorService.getDoctorForCard();
    setDoctors(res?.data?.result?.content || []);
  };

  const fetchServices = async () => {
    const res = await serviceService.getPublicServices();
    setServices(res?.data?.result?.content || []);
  };

  const fetchScheduleDoctor = async () => {
    const res = await doctorService.getDoctorScheduleById(doctors.id);
    setSchedules(res.data.result.schedules || []);
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
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
        gender: user.gender || "",
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
        // customerId: "current-user-id",
        doctorId: values.doctorId || null,
        treatmentServiceId: parseInt(values.serviceId),
        startDate: values.startDate.format("YYYY-MM-DD"),
        shift: values.shift.toUpperCase(),
        cd1Date: values.cd1Date,
      };

      await treatmentService.registerTreatmentService(payload);
      showNotification("Đăng kí dịch vụ khám thành công", "success");
      form.resetFields();
      navigate("/customer-dashboard/services");
    } catch (err) {
      showNotification(err.response.data.message, "error");
      console.log(err);
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
