import React, { useState, useEffect } from "react";
import { 
  Card, Row, Col, Table, Calendar, Badge, Typography, Statistic, 
  Tag, Avatar, Space, Button, Timeline, Progress, DatePicker, Spin, message
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { managerService } from "../../service/manager.service";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";

const { Title, Text } = Typography;
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
  MORNING: '#f6ffed',
  AFTERNOON: '#fff7e6',
  FULL_DAY: '#f9f0ff',
};

const DashboardOverview = () => {
  // Lịch làm việc tháng này
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [schedule, setSchedule] = useState({});
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

  // Lịch khám hôm nay
  const [loadingToday, setLoadingToday] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState([]);

  // Lấy doctorId từ token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        setDoctorId(decoded.sub);
      } catch (error) {
        message.error('Không thể xác thực thông tin bác sĩ');
      }
    }
  }, []);

  // Lấy lịch làm việc tháng
  useEffect(() => {
    if (!doctorId) return;
    setLoadingSchedule(true);
    managerService.getWorkScheduleMonth(doctorId)
      .then(res => {
        if (res.data && res.data.result && res.data.result.schedules) {
          const allSchedule = res.data.result.schedules;
          const map = {};
          Object.entries(allSchedule).forEach(([date, shift]) => {
            if (date.startsWith(selectedMonth)) {
              map[date] = shift;
            }
          });
          setSchedule(map);
        } else {
          setSchedule({});
        }
      })
      .catch(err => {
        setSchedule({});
        message.error('Không thể lấy lịch làm việc');
      })
      .finally(() => setLoadingSchedule(false));
  }, [doctorId, selectedMonth]);

  // Lấy lịch khám hôm nay
  useEffect(() => {
    if (!doctorId) return;
    setLoadingToday(true);
    const today = dayjs().format('YYYY-MM-DD');
    treatmentService.getDoctorAppointmentsByDate(doctorId, today)
      .then(res => {
        if (res?.data?.result) {
          setTodayAppointments(res.data.result);
        } else {
          setTodayAppointments([]);
        }
      })
      .catch(() => setTodayAppointments([]))
      .finally(() => setLoadingToday(false));
  }, [doctorId]);

  // Bảng lịch làm việc tháng (thu nhỏ)
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

  // Bảng lịch khám hôm nay
  const todayColumns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <span>{name}</span>
        </div>
      )
    },
    {
      title: "Ngày khám",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: "Ca khám",
      dataIndex: "shift",
      key: "shift",
      render: (shift) => shiftMap[shift]?.text || shift
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          CONFIRMED: { color: 'blue', text: 'Đã xác nhận' },
          PLANNED: { color: 'orange', text: 'Chờ thực hiện' },
          COMPLETED: { color: 'green', text: 'Hoàn thành' },
          CANCELLED: { color: 'red', text: 'Đã hủy' },
          INPROGRESS: { color: 'blue', text: 'Đang thực hiện' },
          IN_PROGRESS: { color: 'blue', text: 'Đang thực hiện' },
        };
        const s = statusMap[status] || { color: 'default', text: status };
        return <Tag color={s.color}>{s.text}</Tag>;
      }
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName"
    }
  ];

  // Statistics
  const todayStats = {
    total: todayAppointments.length,
    completed: todayAppointments.filter(a => a.status === "completed").length,
    inProgress: todayAppointments.filter(a => a.status === "in-progress").length,
    waiting: todayAppointments.filter(a => a.status === "waiting").length
  };

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn hôm nay"
              value={todayStats.total}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={todayStats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang khám"
              value={todayStats.inProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={todayStats.waiting}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Today's Appointments */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                <span>Lịch Khám Hôm Nay</span>
                <Tag color="blue">{dayjs().format("DD/MM/YYYY")}</Tag>
              </Space>
            }
           
          >
            <Table
              columns={todayColumns}
              dataSource={todayAppointments}
              loading={loadingToday}
              pagination={false}
              rowKey="id"
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        {/* Weekly Schedule */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <Space>
                <MedicineBoxOutlined />
                <span>Lịch Làm Việc Tháng Này</span>
              </Space>
            }
          >
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <CalendarOutlined style={{ fontSize: 22, marginRight: 8, color: '#722ed1' }} />
              <DatePicker
                picker="month"
                value={dayjs(selectedMonth + "-01")}
                onChange={d => setSelectedMonth(d.format("YYYY-MM"))}
                allowClear={false}
                format="MM/YYYY"
                size="middle"
                style={{ fontWeight: 600, fontSize: 16 }}
              />
            </div>
            {loadingSchedule ? (
              <Spin tip="Đang tải lịch làm việc...">
                <div style={{ minHeight: 200 }} />
              </Spin>
            ) : (
              <div style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                padding: 12,
                marginBottom: 12,
                minWidth: 400,
                maxWidth: 600,
                width: '100%',
                overflowX: 'auto',
              }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      {weekdays.map(day => (
                        <th key={day} style={{ border: 'none', padding: 8, background: '#fafafa', textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#722ed1' }}>{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getCalendarGrid(selectedMonth).map((week, i) => (
                      <tr key={i}>
                        {week.map((dateStr, j) => {
                          const shift = schedule[dateStr];
                          const bgColor = bgColorMap[shift] || undefined;
                          return (
                            <td
                              key={j}
                              style={{
                                border: '1.5px solid #bfbfbf',
                                height: 60,
                                minWidth: 60,
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                background: bgColor || (dateStr === dayjs().format('YYYY-MM-DD') ? '#e6f7ff' : '#fff'),
                                borderRadius: 8,
                                transition: 'background 0.2s',
                                position: 'relative',
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                {dateStr && shift ? (
                                  <span style={{
                                    color: shiftMap[shift]?.color,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    letterSpacing: 0.5,
                                  }}>
                                    {shiftMap[shift]?.text || 'Nghỉ'}
                                  </span>
                                ) : null}
                                <div style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>{dateStr ? dayjs(dateStr).format('D') : ''}</div>
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
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview; 