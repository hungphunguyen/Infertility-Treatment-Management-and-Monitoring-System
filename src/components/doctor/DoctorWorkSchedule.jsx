import React, { useState, useEffect } from "react";
import { Card, Typography, Row, Col, Statistic, Tag, DatePicker, Button, Spin, message } from "antd";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { managerService } from "../../service/manager.service";

const { Title } = Typography;

const shiftMap = {
  MORNING: { color: "blue", text: "Sáng" },
  AFTERNOON: { color: "orange", text: "Chiều" },
  FULL_DAY: { color: "purple", text: "Cả ngày" },
  NONE: { color: "default", text: "Nghỉ" },
  undefined: { color: "default", text: "Nghỉ" },
  null: { color: "default", text: "Nghỉ" },
  "": { color: "default", text: "Nghỉ" }
};

const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

const DoctorWorkSchedule = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);

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

  // Lấy lịch làm việc từ API khi có doctorId hoặc đổi tháng
  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    managerService.getWorkScheduleMonth(doctorId)
      .then(res => {
        if (res.data && res.data.result && res.data.result.schedules) {
          // Lọc lịch theo tháng đang chọn
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
      .finally(() => setLoading(false));
  }, [doctorId, selectedMonth]);

  const calculateStats = (map) => {
    let morning = 0, afternoon = 0, fullDay = 0, off = 0, total = 0;
    Object.values(map).forEach(shift => {
      if (shift === "MORNING") morning++;
      else if (shift === "AFTERNOON") afternoon++;
      else if (shift === "FULL_DAY") fullDay++;
      else off++;
      total++;
    });
    return { total, morning, afternoon, fullDay, off };
  };

  const stats = calculateStats(schedule);

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

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>Lịch Làm Việc Của Tôi</Title>
      {loading ? (
        <Spin tip="Đang tải lịch làm việc...">
          <div style={{ minHeight: 200 }} />
        </Spin>
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Tổng số ngày làm" value={stats.total} prefix={<CalendarOutlined />} valueStyle={{ color: '#1890ff' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Ca sáng" value={stats.morning} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Ca chiều" value={stats.afternoon} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Cả ngày" value={stats.fullDay} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#722ed1' }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Ngày nghỉ" value={stats.off} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#bfbfbf' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <DatePicker
                picker="month"
                value={dayjs(selectedMonth + "-01")}
                onChange={d => setSelectedMonth(d.format("YYYY-MM"))}
                allowClear={false}
                style={{ width: "100%" }}
                format="MM/YYYY"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button icon={<ReloadOutlined />} style={{ width: "100%" }} onClick={() => setSelectedMonth(dayjs().format("YYYY-MM"))}>Làm mới</Button>
            </Col>
          </Row>
          <Card title={<span><CalendarOutlined /> Lịch làm việc tháng {dayjs(selectedMonth + "-01").format("MM/YYYY")}</span>}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr>
                    {weekdays.map(day => (
                      <th key={day} style={{ border: '1px solid #eee', padding: 8, background: '#fafafa', textAlign: 'center' }}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getCalendarGrid(selectedMonth).map((week, i) => (
                    <tr key={i}>
                      {week.map((dateStr, j) => (
                        <td key={j} style={{ border: '1px solid #eee', height: 60, textAlign: 'center', verticalAlign: 'middle', background: dateStr === dayjs().format('YYYY-MM-DD') ? '#e6f7ff' : undefined }}>
                          {dateStr ? (
                            <Tag color={shiftMap[schedule[dateStr]]?.color || 'default'} style={{ fontSize: 14, padding: '6px 12px' }}>
                              {shiftMap[schedule[dateStr]]?.text || 'Nghỉ'}
                            </Tag>
                          ) : null}
                          <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{dateStr ? dayjs(dateStr).format('D') : ''}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default DoctorWorkSchedule; 