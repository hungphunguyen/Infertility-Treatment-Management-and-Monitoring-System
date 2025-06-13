import React, { useState, useEffect } from "react";
import { 
  Card, Calendar, Badge, Modal, Button, Descriptions, 
  Typography, Tag, Row, Col, List, Timeline, Space, Empty,
  Spin, message, DatePicker
} from "antd";
import {
  CalendarOutlined, ClockCircleOutlined, UserOutlined,
  EnvironmentOutlined, PhoneOutlined, InfoCircleOutlined,
  UpOutlined, DownOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { doctorService } from "../../service/doctor.service";

const { Title, Text, Paragraph } = Typography;

const shiftMap = {
  MORNING: { color: "green", text: "Ca sáng" },
  AFTERNOON: { color: "orange", text: "Ca chiều" },
  FULL_DAY: { color: "purple", text: "Cả ngày" },
  NONE: { color: "default", text: "Nghỉ" },
  undefined: { color: "default", text: "Nghỉ" },
  null: { color: "default", text: "Nghỉ" },
  "": { color: "default", text: "Nghỉ" }
};
const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const bgColorMap = {
  completed: '#d9f7be',    // xanh lá
  'in-progress': '#bae7ff',// xanh biển
  'not-started': '#fff1b8',// cam nhạt
  cancelled: '#ffa39e',    // đỏ nhạt
  pending: '#fff1b8',      // fallback cam nhạt
};

const AppointmentSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Lấy thông tin user
      const userResponse = await authService.getMyInfo();
      if (!userResponse?.data?.result?.id) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }
      setUserInfo(userResponse.data.result);

      // Lấy danh sách điều trị của user
      const treatmentResponse = await treatmentService.getTreatmentRecordsByCustomer(userResponse.data.result.id);
      console.log('Treatment Records Response:', treatmentResponse);
      
      if (treatmentResponse?.data?.result) {
        // Chuyển đổi dữ liệu điều trị thành lịch hẹn
        const treatmentAppointments = treatmentResponse.data.result.flatMap(treatment => {
          // Nếu dịch vụ đã hủy, bỏ qua các bước cũ
          if (treatment.status === 'CANCELLED') {
            return [];
          }

          return treatment.treatmentSteps.map((step, stepIndex) => {
            // Chỉ lấy ngày thực tế, không lấy ngày dự kiến
            const appointmentDate = step.actualDate ? dayjs(step.actualDate).format("YYYY-MM-DD") : 
                                  step.scheduledDate ? dayjs(step.scheduledDate).format("YYYY-MM-DD") : null;
            
            let status = 'pending';
            if (step.status === 'COMPLETED') status = 'completed';
            else if (step.status === 'IN_PROGRESS' || step.status === 'CONFIRMED') status = 'in-progress';
            else if (step.status === 'PLANNED') status = 'not-started';
            else if (step.status === 'CANCELLED') status = 'cancelled';

            // Tính toán giờ từ scheduledDate
            const scheduledDate = step.scheduledDate ? new Date(step.scheduledDate) : null;
            const time = scheduledDate ? scheduledDate.toTimeString().slice(0, 5) : "09:00";

            return {
              id: step.id,
              title: step.name,
              date: appointmentDate,
              time: time,
              doctor: treatment.doctorName,
              department: "Khoa IVF",
              location: "Phòng khám IVF",
              status: status,
              serviceId: treatment.id,
              serviceStatus: treatment.status, // Thêm trạng thái của dịch vụ
              notes: step.notes || `Bước ${step.id} của quy trình điều trị ${treatment.treatmentServiceName}`,
              contact: userResponse.data.result.phoneNumber,
              preparationInstructions: step.preparationInstructions || "Không cần chuẩn bị đặc biệt",
              isEstimated: false
            };
          });
        }).filter(appointment => appointment.date !== null); // Chỉ lấy các lịch hẹn có ngày

        // Sắp xếp lịch hẹn theo ngày
        const sortedAppointments = treatmentAppointments.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        console.log('Mapped Appointments:', sortedAppointments);
        setAppointments(sortedAppointments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return appointments.filter(appointment => appointment.date === formattedDate);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    const selectedAppointments = getAppointmentsForDate(date);
    if (selectedAppointments.length > 0) {
      setSelectedDate(date);
      setModalVisible(true);
    }
  };

  // View appointment details
  const viewAppointmentDetails = (appointment) => {
    setAppointmentDetails(appointment);
    setDetailsModalVisible(true);
  };

  // Function to render cell content
  const dateCellRender = (date) => {
    const dateAppointments = getAppointmentsForDate(date);
    
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dateAppointments.map(appointment => {
          let badgeColor = "blue";
          if (appointment.status === "completed") badgeColor = "green";
          if (appointment.status === "cancelled") badgeColor = "red";
          
          return (
            <li key={appointment.id}>
              <Badge 
                color={badgeColor} 
                text={
                  <span style={{ fontSize: '12px' }}>
                    {appointment.time} - {appointment.title}
                  </span>
                }
              />
            </li>
          );
        })}
      </ul>
    );
  };

  // Function to get badge status for appointment
  const getStatusBadge = (status, isEstimated) => {
    const statusMap = {
      upcoming: { color: "blue", text: isEstimated ? "Dự kiến" : "Sắp tới" },
      completed: { color: "green", text: "Đã hoàn thành" },
      pending: { color: "orange", text: "Đang chờ" },
      cancelled: { color: "red", text: "Đã hủy" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  // Upcoming appointments list
  const upcomingAppointments = appointments
    .filter(a => a.status === "upcoming" || a.status === "pending")
    .sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));

  const displayedAppointments = isExpanded ? upcomingAppointments : upcomingAppointments.slice(0, 3);

  // Custom calendar grid (like DoctorWorkSchedule)
  const getCalendarGrid = (monthStr) => {
    const [year, month] = monthStr.split("-").map(Number);
    const firstDate = new Date(year, month - 1, 1);
    const totalDays = new Date(year, month, 0).getDate();
    const firstDay = firstDate.getDay(); // 0=CN
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const calendar = [];
    let day = 1;
    for (let i = 0; i < 6 && day <= totalDays; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < offset) || day > totalDays) {
          week.push(null);
        } else {
          week.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
          day++;
        }
      }
      calendar.push(week);
    }
    return calendar;
  };

  // Appointments by date
  const appointmentsByDate = {};
  appointments.forEach(app => {
    if (!appointmentsByDate[app.date]) appointmentsByDate[app.date] = [];
    appointmentsByDate[app.date].push(app);
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#e3eafc', padding: 24 }}>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <CalendarOutlined style={{ fontSize: 28, marginRight: 8, color: '#722ed1' }} />
        <DatePicker
          picker="month"
          value={dayjs(selectedMonth + "-01")}
          onChange={d => setSelectedMonth(d.format("YYYY-MM"))}
          allowClear={false}
          format="MM/YYYY"
          size="large"
          style={{ fontWeight: 600, fontSize: 20 }}
        />
      </div>
      {loading ? (
        <Spin tip="Đang tải lịch hẹn...">
          <div style={{ minHeight: 300 }} />
        </Spin>
      ) : (
        <div style={{
          background: '#f8fafc',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          padding: 32,
          marginBottom: 32,
          minWidth: 1000,
          maxWidth: 1200,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {weekdays.map(day => (
                  <th key={day} style={{ border: 'none', padding: 16, background: '#fafafa', textAlign: 'center', fontWeight: 700, fontSize: 20, color: '#722ed1' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getCalendarGrid(selectedMonth).map((week, i) => (
                <tr key={i}>
                  {week.map((dateStr, j) => {
                    const dayAppointments = appointmentsByDate[dateStr] || [];
                    const bgColor = dayAppointments.length > 0 ? bgColorMap[dayAppointments[0].status] : undefined;
                    return (
                      <td
                        key={j}
                        style={{
                          border: '2px solid #bfbfbf',
                          height: 120,
                          minWidth: 120,
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          background: dayAppointments.length > 0 ? bgColorMap[dayAppointments[0].status] : '#f3e8ff',
                          borderRadius: 16,
                          transition: 'background 0.2s',
                          position: 'relative',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <div style={{ fontSize: 16, color: '#aaa', marginBottom: 6 }}>{dateStr ? dayjs(dateStr).format('D') : ''}</div>
                          {dayAppointments.map((app, idx) => (
                            <Tag 
                              key={idx} 
                              color={bgColorMap[app.status] || 'blue'} 
                              style={{ marginBottom: 4, color: '#222', fontWeight: 600, fontSize: 15, background: bgColorMap[app.status] || '#e6f7ff', border: 'none' }}
                            >
                              {app.title}
                            </Tag>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentSchedule; 