import React, { useState } from "react";
import { 
  Card, Calendar, Badge, Modal, Button, Descriptions, 
  Typography, Tag, Row, Col, List, Timeline, Space, Empty
} from "antd";
import {
  CalendarOutlined, ClockCircleOutlined, UserOutlined,
  EnvironmentOutlined, PhoneOutlined, InfoCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const AppointmentSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      title: "Tư vấn ban đầu",
      date: "2024-01-15",
      time: "09:00",
      doctor: "BS. Nguyễn Văn A",
      department: "Khoa IVF",
      location: "Phòng 103, Tầng 1",
      status: "completed",
      serviceId: "SV001",
      notes: "Đã hoàn thành tư vấn, lập kế hoạch điều trị IVF",
      contact: "0901234567",
      preparationInstructions: "Không cần chuẩn bị trước"
    },
    {
      id: 2,
      title: "Kích thích buồng trứng",
      date: "2024-01-20",
      time: "10:30",
      doctor: "BS. Nguyễn Văn A",
      department: "Khoa IVF",
      location: "Phòng 105, Tầng 1",
      status: "completed",
      serviceId: "SV002",
      notes: "Siêu âm theo dõi, điều chỉnh liều hormone",
      contact: "0901234567",
      preparationInstructions: "Mang theo hồ sơ y tế"
    },
    {
      id: 3,
      title: "Siêu âm theo dõi",
      date: "2024-01-22",
      time: "09:30",
      doctor: "BS. Nguyễn Văn A",
      department: "Khoa IVF",
      location: "Phòng 105, Tầng 1",
      status: "upcoming",
      serviceId: "SV002",
      notes: "Theo dõi phát triển nang trứng",
      contact: "0901234567",
      preparationInstructions: "Mang theo hồ sơ y tế và kết quả xét nghiệm trước đó"
    },
    {
      id: 4,
      title: "Xét nghiệm Di truyền",
      date: "2024-01-25",
      time: "08:00",
      doctor: "BS. Trần Thị B",
      department: "Khoa Xét nghiệm",
      location: "Phòng 201, Tầng 2",
      status: "upcoming",
      serviceId: "SV003",
      notes: "Lấy mẫu xét nghiệm di truyền tiền làm tổ",
      contact: "0901234568",
      preparationInstructions: "Nhịn ăn 8 tiếng trước khi xét nghiệm"
    },
    {
      id: 5,
      title: "Lấy trứng",
      date: "2024-01-30",
      time: "07:30",
      doctor: "BS. Nguyễn Văn A",
      department: "Khoa IVF",
      location: "Phòng phẫu thuật 3, Tầng 3",
      status: "upcoming",
      serviceId: "SV002",
      notes: "Thủ thuật lấy trứng",
      contact: "0901234567",
      preparationInstructions: "Nhịn ăn từ 22:00 tối hôm trước, mang theo người thân hỗ trợ"
    }
  ];

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
  const getStatusBadge = (status) => {
    const statusMap = {
      upcoming: { color: "blue", text: "Sắp tới" },
      completed: { color: "green", text: "Đã hoàn thành" },
      cancelled: { color: "red", text: "Đã hủy" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  // Upcoming appointments list
  const upcomingAppointments = appointments.filter(a => a.status === "upcoming")
    .sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* Upcoming Appointments */}
        <Col xs={24} lg={8}>
          <Card title="Lịch hẹn sắp tới" style={{ marginBottom: 16 }}>
            {upcomingAppointments.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={upcomingAppointments}
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
                            {getStatusBadge(appointment.status)}
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
                      {getStatusBadge(appointment.status)}
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
                {getStatusBadge(appointmentDetails.status)}
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
            
            <div style={{ marginTop: 16 }}>
              <Space>
                <Button type="primary">
                  Xác nhận tham dự
                </Button>
                <Button danger>
                  Yêu cầu đổi lịch
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentSchedule; 