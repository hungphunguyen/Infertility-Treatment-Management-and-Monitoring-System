import React from "react";
import { Typography, Card, Row, Col, Avatar, Rate, Tag, Space, Divider } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { useParams } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

// Doctor data from OurStaffPage
const doctors = [
  {
    id: 1,
    name: "PGS.TS.BS Nguyễn Văn A",
    role: "Giám đốc trung tâm",
    specialization: "Chuyên khoa Sản phụ khoa, Hỗ trợ sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Hà Nội",
    experience: "Hơn 20 năm kinh nghiệm trong lĩnh vực hỗ trợ sinh sản",
    image: "/images/doctors/doctor1.png",
    email: "nguyen.van.a@example.com",
    phone: "+84 123 456 789",
    certificates: ["Hội Sản Phụ Khoa Việt Nam", "Hiệp hội Sinh sản Châu Á Thái Bình Dương"],
    value: "dr_nguyen",
    rating: 4.8,
    treatmentType: "IVF",
    totalReviews: 156,
    achievements: [
      "Thực hiện thành công hơn 1000 ca IVF",
      "Nghiên cứu sinh tại Đại học Y Harvard",
      "Chuyên gia tư vấn cho nhiều trung tâm hỗ trợ sinh sản",
    ],
    workingHours: {
      monday: "08:00 - 17:00",
      tuesday: "08:00 - 17:00",
      wednesday: "08:00 - 17:00",
      thursday: "08:00 - 17:00",
      friday: "08:00 - 17:00",
      saturday: "08:00 - 12:00",
      sunday: "Nghỉ",
    },
    location: "Tầng 5, Tòa nhà A, 123 Đường ABC, Quận XYZ, TP.HCM",
  },
  {
    id: 2,
    name: "TS.BS Lê Thị B",
    role: "Phó Giám đốc",
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
    totalReviews: 142,
    achievements: [
      "Thực hiện thành công hơn 800 ca IUI",
      "Nghiên cứu sinh tại Đại học Y Dược TP.HCM",
      "Chuyên gia tư vấn về nội tiết sinh sản",
    ],
    workingHours: {
      monday: "08:00 - 17:00",
      tuesday: "08:00 - 17:00",
      wednesday: "08:00 - 17:00",
      thursday: "08:00 - 17:00",
      friday: "08:00 - 17:00",
      saturday: "08:00 - 12:00",
      sunday: "Nghỉ",
    },
    location: "Tầng 5, Tòa nhà A, 123 Đường ABC, Quận XYZ, TP.HCM",
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
    treatmentType: "IVF",
    totalReviews: 128,
    achievements: [
      "Thực hiện thành công hơn 500 ca nuôi cấy phôi",
      "Nghiên cứu sinh tại Đại học Y Huế",
      "Chuyên gia về phôi học lâm sàng",
    ],
    workingHours: {
      monday: "08:00 - 17:00",
      tuesday: "08:00 - 17:00",
      wednesday: "08:00 - 17:00",
      thursday: "08:00 - 17:00",
      friday: "08:00 - 17:00",
      saturday: "08:00 - 12:00",
      sunday: "Nghỉ",
    },
    location: "Tầng 5, Tòa nhà A, 123 Đường ABC, Quận XYZ, TP.HCM",
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
    treatmentType: "IUI",
    totalReviews: 115,
    achievements: [
      "Thực hiện thành công hơn 300 ca IUI",
      "Nghiên cứu sinh tại Đại học Y Hà Nội",
      "Chuyên gia về sản phụ khoa",
    ],
    workingHours: {
      monday: "08:00 - 17:00",
      tuesday: "08:00 - 17:00",
      wednesday: "08:00 - 17:00",
      thursday: "08:00 - 17:00",
      friday: "08:00 - 17:00",
      saturday: "08:00 - 12:00",
      sunday: "Nghỉ",
    },
    location: "Tầng 5, Tòa nhà A, 123 Đường ABC, Quận XYZ, TP.HCM",
  }
];

const DoctorDetailPage = () => {
  const { id } = useParams();
  const doctor = doctors.find(d => d.id === parseInt(id));

  if (!doctor) {
    return (
      <div className="w-full min-h-screen">
        <UserHeader />
        <div className="px-4 py-8 max-w-7xl mx-auto text-center">
          <Title level={2}>Không tìm thấy thông tin bác sĩ</Title>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Card className="shadow-md">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8} className="text-center">
                <Avatar
                  size={200}
                  src={doctor.image}
                  icon={<UserOutlined />}
                  className="mb-4"
                />
                <div className="mb-4">
                  <Rate disabled defaultValue={doctor.rating} allowHalf />
                  <Text className="ml-2">({doctor.totalReviews} đánh giá)</Text>
                </div>
                <Space direction="vertical" size="small">
                  <Text>
                    <MailOutlined className="mr-2" /> {doctor.email}
                  </Text>
                  <Text>
                    <PhoneOutlined className="mr-2" /> {doctor.phone}
                  </Text>
                  <Text>
                    <EnvironmentOutlined className="mr-2" /> {doctor.location}
                  </Text>
                </Space>
              </Col>
              <Col xs={24} md={16}>
                <Title level={2}>{doctor.name}</Title>
                <Title level={4} type="secondary">
                  {doctor.role}
                </Title>
                <Paragraph className="text-lg">
                  <strong>Chuyên môn:</strong> {doctor.specialization}
                </Paragraph>
                <Paragraph>
                  <strong>Học vấn:</strong> {doctor.education}
                </Paragraph>
                <Paragraph>
                  <strong>Kinh nghiệm:</strong> {doctor.experience}
                </Paragraph>
                <div className="mt-4">
                  <Title level={5}>Chứng chỉ & Thành viên:</Title>
                  <Space wrap>
                    {doctor.certificates.map((cert, index) => (
                      <Tag color="blue" key={index}>
                        {cert}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card title="Thành tựu & Đóng góp" className="shadow-md mb-6">
              <ul className="list-disc pl-6">
                {doctor.achievements.map((achievement, index) => (
                  <li key={index} className="mb-2">
                    <Text>{achievement}</Text>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Đánh giá từ bệnh nhân" className="shadow-md">
              {/* Add patient reviews component here */}
              <Paragraph>Chưa có đánh giá nào.</Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="Lịch làm việc" className="shadow-md mb-6">
              <Space direction="vertical" size="small" className="w-full">
                {Object.entries(doctor.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <Text strong className="capitalize">
                      {day}:
                    </Text>
                    <Text>{hours}</Text>
                  </div>
                ))}
              </Space>
            </Card>

            <Card title="Đặt lịch hẹn" className="shadow-md">
              <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Đặt lịch ngay
              </button>
            </Card>
          </Col>
        </Row>
      </div>
      <UserFooter />
    </div>
  );
};

export default DoctorDetailPage; 