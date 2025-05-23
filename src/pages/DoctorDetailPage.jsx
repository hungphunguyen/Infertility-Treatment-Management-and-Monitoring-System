import React from "react";
import { Typography, Card, Row, Col, Avatar, Rate, Tag, Space, Divider } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { useParams } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

// Mock data - In real application, this would come from an API
const doctorData = {
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
  rating: 4.8,
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
};

const DoctorDetailPage = () => {
  const { id } = useParams();

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
                  src={doctorData.image}
                  icon={<UserOutlined />}
                  className="mb-4"
                />
                <div className="mb-4">
                  <Rate disabled defaultValue={doctorData.rating} allowHalf />
                  <Text className="ml-2">({doctorData.totalReviews} đánh giá)</Text>
                </div>
                <Space direction="vertical" size="small">
                  <Text>
                    <MailOutlined className="mr-2" /> {doctorData.email}
                  </Text>
                  <Text>
                    <PhoneOutlined className="mr-2" /> {doctorData.phone}
                  </Text>
                  <Text>
                    <EnvironmentOutlined className="mr-2" /> {doctorData.location}
                  </Text>
                </Space>
              </Col>
              <Col xs={24} md={16}>
                <Title level={2}>{doctorData.name}</Title>
                <Title level={4} type="secondary">
                  {doctorData.role}
                </Title>
                <Paragraph className="text-lg">
                  <strong>Chuyên môn:</strong> {doctorData.specialization}
                </Paragraph>
                <Paragraph>
                  <strong>Học vấn:</strong> {doctorData.education}
                </Paragraph>
                <Paragraph>
                  <strong>Kinh nghiệm:</strong> {doctorData.experience}
                </Paragraph>
                <div className="mt-4">
                  <Title level={5}>Chứng chỉ & Thành viên:</Title>
                  <Space wrap>
                    {doctorData.certificates.map((cert, index) => (
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
                {doctorData.achievements.map((achievement, index) => (
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
                {Object.entries(doctorData.workingHours).map(([day, hours]) => (
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