import React, { useState, useEffect } from "react";
import { 
  Card, Calendar, Badge, Modal, Button, Descriptions, 
  Typography, Tag, Row, Col, List, Timeline, Space, Empty,
  Spin, message
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

const AppointmentSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
          return treatment.treatmentSteps.map(step => {
            // Tính toán ngày và giờ từ scheduledDate
            const scheduledDate = step.scheduledDate ? new Date(step.scheduledDate) : null;
            const date = scheduledDate ? scheduledDate.toISOString().split('T')[0] : null;
            const time = scheduledDate ? scheduledDate.toTimeString().slice(0, 5) : "09:00";

            // Nếu là bước đã xác nhận (CONFIRMED) thì hiển thị ngày thực tế
            // Nếu là bước đã lên kế hoạch (PLANNED) thì ước tính ngày dựa trên ngày bắt đầu
            let appointmentDate = date;
            if (!appointmentDate && step.status === 'PLANNED') {
              // Ước tính ngày dựa trên vị trí của bước trong chuỗi điều trị
              const stepIndex = treatment.treatmentSteps.findIndex(s => s.id === step.id);
              const startDate = new Date(treatment.startDate);
              startDate.setDate(startDate.getDate() + (stepIndex * 7)); // Mỗi bước cách nhau 1 tuần
              appointmentDate = startDate.toISOString().split('T')[0];
            }

            return {
              id: step.id,
              title: step.name,
              date: appointmentDate,
              time: time,
              doctor: treatment.doctorName,
              department: "Khoa IVF",
              location: "Phòng khám IVF",
              status: step.status === 'CONFIRMED' ? 'completed' : 
                     step.status === 'PLANNED' ? 'upcoming' : 'pending',
              serviceId: treatment.id,
              notes: step.notes || `Bước ${step.id} của quy trình điều trị ${treatment.treatmentServiceName}`,
              contact: userResponse.data.result.phoneNumber,
              preparationInstructions: step.preparationInstructions || "Không cần chuẩn bị đặc biệt",
              isEstimated: !date && step.status === 'PLANNED' // Đánh dấu ngày ước tính
            };
          });
        }).filter(appointment => appointment.date !== null); // Chỉ lấy các lịch hẹn có ngày

        console.log('Mapped Appointments:', treatmentAppointments);
        setAppointments(treatmentAppointments);
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
                    {appointment.isEstimated && " (Dự kiến)"}
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* Upcoming Appointments */}
        <Col xs={24} lg={8}>
          <Card 
            title="Lịch hẹn sắp tới" 
            style={{ marginBottom: 16 }}
            extra={
              upcomingAppointments.length > 3 && (
                <Button
                  type="text"
                  icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </Button>
              )
            }
          >
            {upcomingAppointments.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={displayedAppointments}
                renderItem={appointment => (
                  <List.Item
                    actions={[
                      <Button 
                        size="small" 
                        type="link" 
                        onClick={() => viewAppointmentDetails(appointment)}
                      >
                        Chi tiết
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <div>
                          <Text strong>{appointment.title}</Text>
                          <div style={{ marginTop: 4 }}>
                            {getStatusBadge(appointment.status, appointment.isEstimated)}
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <div>
                            <CalendarOutlined style={{ marginRight: 8 }} />
                            {dayjs(appointment.date).format("DD/MM/YYYY")}
                            <ClockCircleOutlined style={{ marginLeft: 12, marginRight: 8 }} />
                            {appointment.time}
                          </div>
                          <div>
                            <UserOutlined style={{ marginRight: 8 }} />
                            {appointment.doctor}
                          </div>
                          <div>
                            <EnvironmentOutlined style={{ marginRight: 8 }} />
                            {appointment.location}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Không có lịch hẹn sắp tới" />
            )}
          </Card>

          {/* Reminders */}
          <Card title="Lưu ý quan trọng">
            <Timeline>
              <Timeline.Item color="blue">
                <Text strong>Chuẩn bị cho lịch hẹn</Text>
                <Paragraph>
                  Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục
                </Paragraph>
              </Timeline.Item>
              <Timeline.Item color="green">
                <Text strong>Mang theo hồ sơ</Text>
                <Paragraph>
                  Đem theo hồ sơ bệnh án, kết quả xét nghiệm trước đó
                </Paragraph>
              </Timeline.Item>
              <Timeline.Item color="red">
                <Text strong>Hoãn/hủy lịch hẹn</Text>
                <Paragraph>
                  Vui lòng thông báo trước ít nhất 24 giờ nếu cần thay đổi lịch hẹn
                </Paragraph>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Text strong>Nhịn ăn</Text>
                <Paragraph>
                  Một số thủ thuật yêu cầu nhịn ăn, vui lòng đọc kỹ hướng dẫn
                </Paragraph>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>

        {/* Calendar */}
        <Col xs={24} lg={16}>
          <Card>
            <Calendar 
              cellRender={dateCellRender} 
              onSelect={handleDateSelect}
            />
          </Card>
        </Col>
      </Row>

      {/* Day Appointments Modal */}
      <Modal
        title={selectedDate ? `Lịch hẹn ngày ${selectedDate.format("DD/MM/YYYY")}` : "Lịch hẹn"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedDate && (
          <List
            itemLayout="horizontal"
            dataSource={getAppointmentsForDate(selectedDate)}
            renderItem={appointment => (
              <List.Item
                actions={[
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => viewAppointmentDetails(appointment)}
                  >
                    Chi tiết
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{appointment.time}</Text>
                      <Text>{appointment.title}</Text>
                      {getStatusBadge(appointment.status, appointment.isEstimated)}
                    </Space>
                  }
                  description={
                    <div>
                      <div>
                        <UserOutlined style={{ marginRight: 8 }} />
                        {appointment.doctor}
                      </div>
                      <div>
                        <EnvironmentOutlined style={{ marginRight: 8 }} />
                        {appointment.location}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* Appointment Details Modal */}
      <Modal
        title="Chi tiết lịch hẹn"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {appointmentDetails && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tên lịch hẹn" span={2}>
                <Text strong>{appointmentDetails.title}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày">
                {dayjs(appointmentDetails.date).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ">
                {appointmentDetails.time}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ">
                {appointmentDetails.doctor}
              </Descriptions.Item>
              <Descriptions.Item label="Khoa">
                {appointmentDetails.department}
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {appointmentDetails.location}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusBadge(appointmentDetails.status, appointmentDetails.isEstimated)}
              </Descriptions.Item>
              <Descriptions.Item label="Mã dịch vụ">
                <Tag color="blue">{appointmentDetails.serviceId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Liên hệ" span={2}>
                <PhoneOutlined style={{ marginRight: 8 }} />
                {appointmentDetails.contact}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Ghi chú:</Title>
              <Paragraph>{appointmentDetails.notes}</Paragraph>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Hướng dẫn chuẩn bị:</Title>
              <Paragraph>
                <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                {appointmentDetails.preparationInstructions}
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentSchedule; 