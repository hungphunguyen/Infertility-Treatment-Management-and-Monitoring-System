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
    name: "Prof. Dr. Andrew Peterson",
    role: "Center Director",
    specialization: "Obstetrics & Gynecology, Reproductive Medicine",
    education: "PhD in Medicine, Harvard Medical School",
    experience: "Over 20 years of experience in reproductive medicine",
    image: "https://example.com/images/doctor1.jpg",
    email: "andrew.peterson@example.com",
    phone: "+1 (555) 123-4567",
    certificates: ["American Society for Reproductive Medicine", "Asia Pacific Initiative on Reproduction"],
    value: "dr_peterson"
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    role: "Deputy Director",
    specialization: "Reproductive Endocrinology",
    education: "PhD in Medicine, Johns Hopkins University",
    experience: "15 years of experience in treating infertility",
    image: "https://example.com/images/doctor2.jpg",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4568",
    certificates: ["American Endocrine Society", "International Federation of Fertility Societies"],
    value: "dr_johnson"
  },
  {
    id: 3,
    name: "MSc. Michael Brown",
    role: "Head of Embryology",
    specialization: "Clinical Embryology",
    education: "Master of Science, Stanford University",
    experience: "12 years of experience in embryo culture",
    image: "https://example.com/images/doctor3.jpg",
    email: "michael.brown@example.com",
    phone: "+1 (555) 123-4569",
    certificates: ["Asian Society of Embryologists", "International Certificate in Clinical Embryology"],
    value: "dr_brown"
  },
  {
    id: 4,
    name: "Dr. Emily Roberts",
    role: "Treating Physician",
    specialization: "Obstetrics & Gynecology",
    education: "Medical Specialist, University of California",
    experience: "10 years of experience in fertility treatment",
    image: "https://example.com/images/doctor4.jpg",
    email: "emily.roberts@example.com",
    phone: "+1 (555) 123-4570",
    certificates: ["American College of Obstetricians and Gynecologists"],
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
          <Title level={1} className="text-3xl">Expert Team</Title>
          <Paragraph className="text-lg mt-4">
            Meet our experienced team of doctors, specialists, and medical staff
          </Paragraph>
        </div>

        <Divider />

        <div className="mb-12">
          <Title level={2} className="mb-6">Medical Team</Title>
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
                        <strong>Specialization:</strong> {doctor.specialization}
                      </Paragraph>
                      <Paragraph>
                        <strong>Education:</strong> {doctor.education}
                      </Paragraph>
                      <Paragraph>
                        <strong>Experience:</strong> {doctor.experience}
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
                        Book Appointment
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
          <Title level={2} className="mb-4">Consult with an Expert</Title>
          <Paragraph className="text-lg mb-6">
            Schedule a consultation with our experts for support with fertility issues
          </Paragraph>
          <Button 
            type="primary" 
            size="large"
            icon={<CalendarOutlined />}
            className="bg-[#ff8460] hover:bg-[#ff6b40] border-none" 
            onClick={() => navigate('/appointment')}
          >
            Book an Appointment
          </Button>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default OurStaffPage; 