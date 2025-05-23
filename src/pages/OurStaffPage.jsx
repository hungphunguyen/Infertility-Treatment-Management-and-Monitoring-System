import React from "react";
import { Typography, Card, Row, Col, Divider, Avatar, Space, Tag } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
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
    image: "https://example.com/images/doctor1.jpg",
    email: "nguyen.van.a@example.com",
    phone: "+84 123 456 789",
    certificates: ["Hội Sản Phụ Khoa Việt Nam", "Hiệp hội Sinh sản Châu Á Thái Bình Dương"],
  },
  {
    id: 2,
    name: "TS.BS Lê Thị B",
    role: "Phó Giám đốc",
    specialization: "Chuyên khoa Nội tiết sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Dược TP.HCM",
    experience: "15 năm kinh nghiệm trong điều trị vô sinh hiếm muộn",
    image: "https://example.com/images/doctor2.jpg",
    email: "le.thi.b@example.com",
    phone: "+84 123 456 790",
    certificates: ["Hội Nội tiết Việt Nam", "Hiệp hội Sinh sản Quốc tế"],
  },
  {
    id: 3,
    name: "ThS.BS Trần Văn C",
    role: "Trưởng phòng phôi học",
    specialization: "Phôi học lâm sàng",
    education: "Thạc sĩ Y khoa, Đại học Y Huế",
    experience: "12 năm kinh nghiệm trong nuôi cấy phôi",
    image: "https://example.com/images/doctor3.jpg",
    email: "tran.van.c@example.com",
    phone: "+84 123 456 791",
    certificates: ["Hiệp hội Phôi học Châu Á", "Chứng chỉ Phôi học lâm sàng quốc tế"],
  },
  {
    id: 4,
    name: "BSCKII Phạm Thị D",
    role: "Bác sĩ điều trị",
    specialization: "Chuyên khoa Sản phụ khoa",
    education: "Bác sĩ chuyên khoa II, Đại học Y Hà Nội",
    experience: "10 năm kinh nghiệm trong điều trị vô sinh",
    image: "https://example.com/images/doctor4.jpg",
    email: "pham.thi.d@example.com",
    phone: "+84 123 456 792",
    certificates: ["Hội Sản Phụ Khoa Việt Nam"],
  },
];

const nurses = [
  {
    id: 1,
    name: "Nguyễn Thị E",
    role: "Điều dưỡng trưởng",
    experience: "15 năm kinh nghiệm",
    education: "Cử nhân Điều dưỡng, Đại học Y Hà Nội",
    image: "https://example.com/images/nurse1.jpg",
  },
  {
    id: 2,
    name: "Lê Văn F",
    role: "Điều dưỡng",
    experience: "8 năm kinh nghiệm",
    education: "Cử nhân Điều dưỡng, Đại học Y Dược TP.HCM",
    image: "https://example.com/images/nurse2.jpg",
  },
  {
    id: 3,
    name: "Trần Thị G",
    role: "Điều dưỡng",
    experience: "7 năm kinh nghiệm",
    education: "Cử nhân Điều dưỡng, Đại học Y Huế",
    image: "https://example.com/images/nurse3.jpg",
  },
  {
    id: 4,
    name: "Phạm Văn H",
    role: "Kỹ thuật viên phòng lab",
    experience: "10 năm kinh nghiệm",
    education: "Cử nhân Xét nghiệm, Đại học Y Dược TP.HCM",
    image: "https://example.com/images/nurse4.jpg",
  },
];

const OurStaffPage = () => {
  const navigate = useNavigate();

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
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
                  <Row>
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
                    </Col>
                  </Row>
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
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
            Đặt lịch hẹn
          </button>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default OurStaffPage; 