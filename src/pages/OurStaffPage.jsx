import React from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Avatar,
  Space,
  Tag,
  Button,
  Rate,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;

const doctors = [
  {
    id: 1,
    name: "PGS.TS.BS Nguyễn Văn A",
    role: "Bác sĩ khám",
    specialization: "Chuyên khoa Sản phụ khoa, Hỗ trợ sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Hà Nội",
    experience: "Hơn 20 năm kinh nghiệm trong lĩnh vực hỗ trợ sinh sản",
    image: "/images/doctors/doctor1.png",
    email: "nguyen.van.a@example.com",
    phone: "+84 123 456 789",
    certificates: [
      "Hội Sản Phụ Khoa Việt Nam",
      "Hiệp hội Sinh sản Châu Á Thái Bình Dương",
    ],
    value: "dr_nguyen",
    rating: 4.8,
    treatmentType: "IVF",
  },
  {
    id: 2,
    name: "TS.BS Lê Thị B",
    role: "Bác sĩ khám",
    specialization: "Chuyên khoa Nội tiết sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Dược TP.HCM",
    experience: "15 năm kinh nghiệm trong điều trị vô sinh hiếm muộn",
    image: "/images/doctors/doctor2.png",
    email: "le.thi.b@example.com",
    phone: "+84 123 456 790",
    certificates: ["Hội Nội tiết Việt Nam", "Hiệp hội Sinh sản Quốc tế"],
    value: "dr_le",
    rating: 4.7,
    treatmentType: "IUI",
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
    certificates: [
      "Hiệp hội Phôi học Châu Á",
      "Chứng chỉ Phôi học lâm sàng quốc tế",
    ],
    value: "dr_tran",
    rating: 4.6,
    treatmentType: "IVF",
  },
  {
    id: 4,
    name: "TS.BS Nguyễn Thị D",
    role: "Bác sĩ khám",
    specialization: "Chuyên khoa Sản phụ khoa",
    education: "Tiến sĩ Y khoa, Đại học Y Dược TP.HCM",
    experience: "14 năm kinh nghiệm trong điều trị vô sinh",
    image: "/images/doctors/doctor4.jpg",
    email: "nguyen.thi.d@example.com",
    phone: "+84 123 456 792",
    certificates: [
      "Hội Sản Phụ Khoa Việt Nam",
      "Hiệp hội Sinh sản Châu Á Thái Bình Dương",
    ],
    value: "dr_nguyen_d",
    rating: 4.7,
    treatmentType: "IVF",
  },
  {
    id: 5,
    name: "TS.BS Lê Văn E",
    role: "Bác sĩ khám",
    specialization: "Chuyên khoa Nội tiết sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Hà Nội",
    experience: "13 năm kinh nghiệm trong điều trị vô sinh",
    image: "/images/doctors/doctor5.jpg",
    email: "le.van.e@example.com",
    phone: "+84 123 456 793",
    certificates: [
      "Hội Nội tiết Việt Nam",
      "Hiệp hội Sinh sản Quốc tế",
    ],
    value: "dr_le_e",
    rating: 4.6,
    treatmentType: "IUI",
  },
  {
    id: 6,
    name: "ThS.BS Trần Thị F",
    role: "Bác sĩ khám",
    specialization: "Chuyên khoa Sản phụ khoa",
    education: "Thạc sĩ Y khoa, Đại học Y Dược TP.HCM",
    experience: "11 năm kinh nghiệm trong điều trị vô sinh",
    image: "/images/doctors/doctor6.webp",
    email: "tran.thi.f@example.com",
    phone: "+84 123 456 794",
    certificates: [
      "Hội Sản Phụ Khoa Việt Nam",
      "Hiệp hội Sinh sản Châu Á Thái Bình Dương",
    ],
    value: "dr_tran_f",
    rating: 4.5,
    treatmentType: "IVF",
  }
];

const OurStaffPage = () => {
  const navigate = useNavigate();

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  const handleBooking = (doctorId) => {
    navigate(`/appointment`, {
      state: { selectedDoctor: doctorId },
    });
  };

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">
            Đội ngũ chuyên gia
          </Title>
          <Paragraph className="text-lg mt-4">
            Gặp gỡ đội ngũ bác sĩ, chuyên gia và nhân viên y tế giàu kinh nghiệm
            của chúng tôi
          </Paragraph>
        </div>

        <Divider />

        <div className="mb-12">
          <Title level={2} className="mb-6">
            Đội ngũ y bác sĩ
          </Title>
          <Row gutter={[24, 32]}>
            {doctors.map((doctor) => (
              <Col xs={24} md={8} key={doctor.id}>
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

        <div className="my-12 text-center">
          <Title level={2} className="mb-4">
            Tham vấn với chuyên gia
          </Title>
          <Paragraph className="text-lg mb-6">
            Đặt lịch tư vấn với các chuyên gia của chúng tôi để được hỗ trợ về
            vấn đề hiếm muộn
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<CalendarOutlined />}
            className="bg-[#ff8460] hover:bg-[#ff6b40] border-none"
            onClick={() => navigate("/appointment")}
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
