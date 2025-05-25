import React from "react";
import { Typography, Card, Row, Col, Divider, Avatar, Space, Tag, Button } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;

const doctors = [
  {
    id: 1,
    name: "GS.TS. Andrew Peterson",
    role: "Giám đốc Trung tâm",
    specialization: "Sản khoa & Phụ khoa, Y học Sinh sản",
    education: "Tiến sĩ Y khoa, Trường Y Harvard",
    experience: "Hơn 20 năm kinh nghiệm trong y học sinh sản",
    image: "https://example.com/images/doctor1.jpg",
    email: "andrew.peterson@example.com",
    phone: "+1 (555) 123-4567",
    certificates: ["Hiệp hội Y học Sinh sản Hoa Kỳ", "Sáng kiến Châu Á Thái Bình Dương về Sinh sản"],
    value: "dr_peterson"
  },
  {
    id: 2,
    name: "TS. Sarah Johnson",
    role: "Phó Giám đốc",
    specialization: "Nội tiết Sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Johns Hopkins",
    experience: "15 năm kinh nghiệm trong điều trị vô sinh",
    image: "https://example.com/images/doctor2.jpg",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4568",
    certificates: ["Hiệp hội Nội tiết Hoa Kỳ", "Liên đoàn Quốc tế các Hiệp hội Sinh sản"],
    value: "dr_johnson"
  },
  {
    id: 3,
    name: "ThS. Michael Brown",
    role: "Trưởng phòng Phôi học",
    specialization: "Phôi học Lâm sàng",
    education: "Thạc sĩ Khoa học, Đại học Stanford",
    experience: "12 năm kinh nghiệm trong nuôi cấy phôi",
    image: "https://example.com/images/doctor3.jpg",
    email: "michael.brown@example.com",
    phone: "+1 (555) 123-4569",
    certificates: ["Hiệp hội Phôi học Châu Á", "Chứng chỉ Quốc tế về Phôi học Lâm sàng"],
    value: "dr_brown"
  },
  {
    id: 4,
    name: "TS. Emily Roberts",
    role: "Bác sĩ Điều trị",
    specialization: "Sản khoa & Phụ khoa",
    education: "Chuyên gia Y khoa, Đại học California",
    experience: "10 năm kinh nghiệm trong điều trị sinh sản",
    image: "https://example.com/images/doctor4.jpg",
    email: "emily.roberts@example.com",
    phone: "+1 (555) 123-4570",
    certificates: ["Hội Sản phụ khoa Hoa Kỳ"],
    value: "dr_roberts"
  },
];

const OurStaffPage = () => {
  const navigate = useNavigate();

  const handleBooking = (doctorId) => {
    // Navigate to appointment page with selected doctor as state
    navigate(`/appointment`, { 
      state: { selectedDoctor: doctorId }
    });
  };

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">Đội Ngũ Chuyên Gia</Title>
          <Paragraph className="text-lg mt-4">
            Gặp gỡ đội ngũ bác sĩ, chuyên gia và nhân viên y tế giàu kinh nghiệm của chúng tôi
          </Paragraph>
        </div>

        <Divider />

        <div className="mb-12">
          <Title level={2} className="mb-6">Đội Ngũ Y tế</Title>
          <Row gutter={[24, 32]}>
            {doctors.map((doctor) => (
              <Col xs={24} md={12} key={doctor.id}>
                <Card className="shadow-md h-full">
                  <Row gutter={16} align="middle">
                    <Col xs={24} md={8} className="text-center mb-4 md:mb-0">
                      <Avatar
                        size={120}
                        src={doctor.image}
                        icon={<UserOutlined />}
                        className="mb-2"
                      />
                      <div>
                        {doctor.certificates.map((cert, index) => (
                          <Tag color="blue" key={index} className="mt-2">
                            {cert}
                          </Tag>
                        ))}
                      </div>
                    </Col>
                    <Col xs={24} md={16}>
                      <Title level={3}>{doctor.name}</Title>
                      <Title level={5} type="secondary">
                        {doctor.role}
                      </Title>
                      <Paragraph>
                        <strong>Chuyên môn:</strong> {doctor.specialization}
                      </Paragraph>
                      <Paragraph>
                        <strong>Học vấn:</strong> {doctor.education}
                      </Paragraph>
                      <Paragraph>
                        <strong>Kinh nghiệm:</strong> {doctor.experience}
                      </Paragraph>
                      <Space direction="vertical" className="mt-2">
                        <Text>
                          <MailOutlined className="mr-2" /> {doctor.email}
                        </Text>
                        <Text>
                          <PhoneOutlined className="mr-2" /> {doctor.phone}
                        </Text>
                      </Space>
                      
                      <Button 
                        type="primary" 
                        icon={<CalendarOutlined />}
                        className="mt-4 bg-[#ff8460] hover:bg-[#ff6b40] border-none"
                        onClick={() => handleBooking(doctor.value)}
                      >
                        Đặt Lịch Hẹn
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        <div className="my-12 text-center">
          <Title level={2} className="mb-4">Tư Vấn Với Chuyên Gia</Title>
          <Paragraph className="text-lg mb-6">
            Đặt lịch tư vấn với các chuyên gia của chúng tôi để được hỗ trợ về các vấn đề sinh sản
          </Paragraph>
          <Button 
            type="primary" 
            size="large"
            icon={<CalendarOutlined />}
            className="bg-[#ff8460] hover:bg-[#ff6b40] border-none" 
            onClick={() => navigate('/appointment')}
          >
            Đặt Lịch Hẹn
          </Button>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default OurStaffPage;