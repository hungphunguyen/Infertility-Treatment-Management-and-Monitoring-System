import React from "react";
import { Typography, Card, Row, Col, Divider, Avatar, Space, Tag, Button, Rate } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;

const doctors = [
  {
    id: 1,
    name: "PGS.TS.BS Nguyễn Văn A",
    role: "Giám đốc trung tâm",
    specialization: "Chuyên khoa Sản phụ khoa, Hỗ trợ sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Hà Nội",
    experience: "Hơn 20 năm kinh nghiệm trong lĩnh vực hỗ trợ sinh sản",
    image: "/images/doctors/doctor1.jpg",
    email: "nguyen.van.a@example.com",
    phone: "+84 123 456 789",
    certificates: ["Hội Sản Phụ Khoa Việt Nam", "Hiệp hội Sinh sản Châu Á Thái Bình Dương"],
    value: "dr_nguyen",
    rating: 4.8,
    treatmentType: "IVF"
  },
  {
    id: 2,
    name: "TS.BS Lê Thị B",
    role: "Phó Giám đốc",
    specialization: "Chuyên khoa Nội tiết sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Dược TP.HCM",
    experience: "15 năm kinh nghiệm trong điều trị vô sinh hiếm muộn",
    image: "/images/doctors/doctor2.jpg",
    email: "le.thi.b@example.com",
    phone: "+84 123 456 790",
    certificates: ["Hội Nội tiết Việt Nam", "Hiệp hội Sinh sản Quốc tế"],
    value: "dr_le",
    rating: 4.7,
    treatmentType: "IUI"
  },
  {
    id: 3,
    name: "ThS.BS Trần Văn C",
    role: "Trưởng phòng phôi học",
    specialization: "Phôi học lâm sàng",
    education: "Thạc sĩ Y khoa, Đại học Y Huế",
    experience: "12 năm kinh nghiệm trong nuôi cấy phôi",
    image: "/images/doctors/doctor3.jpg",
    email: "tran.van.c@example.com",
    phone: "+84 123 456 791",
    certificates: ["Hiệp hội Phôi học Châu Á", "Chứng chỉ Phôi học lâm sàng quốc tế"],
    value: "dr_tran",
    rating: 4.6,
    treatmentType: "IVF"
  },
  {
    id: 4,
    name: "BSCKII Phạm Thị D",
    role: "Bác sĩ điều trị",
    specialization: "Chuyên khoa Sản phụ khoa",
    education: "Bác sĩ chuyên khoa II, Đại học Y Hà Nội",
    experience: "10 năm kinh nghiệm trong điều trị vô sinh",
    image: "/images/doctors/doctor4.jpg",
    email: "pham.thi.d@example.com",
    phone: "+84 123 456 792",
    certificates: ["Hội Sản Phụ Khoa Việt Nam"],
    value: "dr_pham",
    rating: 4.5,
    treatmentType: "IUI"
  }
];

const nurses = [
  {
    id: 1,
    name: "Nguyễn Thị E",
    role: "Điều dưỡng trưởng",
    experience: "15 năm kinh nghiệm",
    education: "Cử nhân Điều dưỡng, Đại học Y Hà Nội",
    image: "https://example.com/images/nurse1.jpg"
  },
  {
    id: 2,
    name: "Lê Văn F",
    role: "Điều dưỡng",
    experience: "8 năm kinh nghiệm",
    education: "Cử nhân Điều dưỡng, Đại học Y Dược TP.HCM",
    image: "https://example.com/images/nurse2.jpg"
  },
  {
    id: 3,
    name: "Trần Thị G",
    role: "Điều dưỡng",
    experience: "7 năm kinh nghiệm",
    education: "Cử nhân Điều dưỡng, Đại học Y Huế",
    image: "https://example.com/images/nurse3.jpg"
  },
  {
    id: 4,
    name: "Phạm Văn H",
    role: "Kỹ thuật viên phòng lab",
    experience: "10 năm kinh nghiệm",
    education: "Cử nhân Xét nghiệm, Đại học Y Dược TP.HCM",
    image: "https://example.com/images/nurse4.jpg"
  }
];

const OurStaffPage = () => {
  const navigate = useNavigate();

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  const handleBooking = (doctorId) => {
    navigate(`/appointment`, { 
      state: { selectedDoctor: doctorId }
    });
  };

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">Đội ngũ chuyên gia</Title>
          <Paragraph className="text-lg mt-4">
            Gặp gỡ đội ngũ bác sĩ, chuyên gia và nhân viên y tế giàu kinh nghiệm của chúng tôi
          </Paragraph>
        </div>

        <Divider />

        <div className="mb-12">
          <Title level={2} className="mb-6">Đội ngũ y bác sĩ</Title>
          <Row gutter={[24, 32]}>
            {doctors.map((doctor) => (
              <Col xs={24} md={12} key={doctor.id}>
                <Card 
                  className="shadow-md h-full cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleDoctorClick(doctor.id)}
                >
                  <div className="text-center">
                    <Avatar
                      size={120}
                      src={doctor.image}
                      icon={<UserOutlined />}
                      className="mb-4"
                    />
                    <Title level={3}>{doctor.name}</Title>
                    <Paragraph className="mb-2">
                      {doctor.specialization}
                    </Paragraph>
                    <div className="mb-2">
                      {doctor.certificates.map((cert, index) => (
                        <Tag color="blue" key={index} className="mt-2">
                          {cert}
                        </Tag>
                      ))}
                    </div>
                    <div className="mb-2">
                      <Tag color="green">{doctor.treatmentType}</Tag>
                    </div>
                    <Rate disabled defaultValue={doctor.rating} allowHalf />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        <div className="my-12">
          <Title level={2} className="mb-6">Đội ngũ điều dưỡng và kỹ thuật viên</Title>
          <Row gutter={[24, 24]}>
            {nurses.map((nurse) => (
              <Col xs={24} sm={12} md={6} key={nurse.id}>
                <Card className="shadow-md text-center h-full">
                  <Avatar
                    size={100}
                    src={nurse.image}
                    icon={<UserOutlined />}
                    className="mb-4"
                  />
                  <Title level={4}>{nurse.name}</Title>
                  <Text type="secondary" className="block mb-2">
                    {nurse.role}
                  </Text>
                  <Paragraph>
                    <strong>Kinh nghiệm:</strong> {nurse.experience}
                  </Paragraph>
                  <Paragraph>
                    <strong>Học vấn:</strong> {nurse.education}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        <div className="my-12 text-center">
          <Title level={2} className="mb-4">Tham vấn với chuyên gia</Title>
          <Paragraph className="text-lg mb-6">
            Đặt lịch tư vấn với các chuyên gia của chúng tôi để được hỗ trợ về vấn đề hiếm muộn
          </Paragraph>
          <Button 
            type="primary" 
            size="large"
            icon={<CalendarOutlined />}
            className="bg-[#ff8460] hover:bg-[#ff6b40] border-none" 
            onClick={() => navigate('/appointment')}
          >
            Đặt lịch hẹn
          </Button>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default OurStaffPage; 