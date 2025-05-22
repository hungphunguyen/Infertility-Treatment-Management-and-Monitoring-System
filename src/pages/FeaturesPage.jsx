import React from "react";
import { Typography, Card, Row, Col, Divider, List, Space, Steps } from "antd";
import {
  ExperimentOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const technologies = [
  {
    id: 1,
    title: "Hệ thống nuôi cấy phôi tiên tiến",
    description:
      "Sử dụng hệ thống nuôi cấy phôi thế hệ mới với môi trường nuôi cấy tối ưu, giúp nâng cao tỷ lệ thành công của quá trình thụ tinh trong ống nghiệm.",
    icon: <ExperimentOutlined style={{ fontSize: 36, color: "#1890ff" }} />,
    features: [
      "Môi trường nuôi cấy chuyên biệt đảm bảo sự phát triển tối ưu của phôi",
      "Hệ thống theo dõi phôi liên tục 24/7",
      "Tủ nuôi cấy hiện đại với kiểm soát nhiệt độ và độ ẩm chính xác",
      "Giảm thiểu tối đa nguy cơ nhiễm khuẩn",
    ],
  },
  {
    id: 2,
    title: "Công nghệ sàng lọc di truyền trước làm tổ (PGT)",
    description:
      "Áp dụng kỹ thuật sàng lọc di truyền hiện đại giúp phát hiện các bất thường nhiễm sắc thể và đột biến gen trước khi chuyển phôi vào tử cung.",
    icon: <SafetyCertificateOutlined style={{ fontSize: 36, color: "#52c41a" }} />,
    features: [
      "Phát hiện sớm các bất thường nhiễm sắc thể",
      "Giảm nguy cơ sảy thai và dị tật bẩm sinh",
      "Tăng tỷ lệ thành công của quá trình mang thai",
      "Phù hợp cho các cặp vợ chồng có tiền sử bệnh di truyền",
    ],
  },
  {
    id: 3,
    title: "Hệ thống phòng lab vô trùng tiêu chuẩn quốc tế",
    description:
      "Phòng lab được thiết kế theo tiêu chuẩn quốc tế, đảm bảo môi trường vô trùng tuyệt đối cho quá trình thụ tinh và nuôi cấy phôi.",
    icon: <MedicineBoxOutlined style={{ fontSize: 36, color: "#722ed1" }} />,
    features: [
      "Hệ thống lọc không khí HEPA đạt tiêu chuẩn ISO",
      "Kiểm soát nghiêm ngặt về nhiệt độ, độ ẩm và áp suất",
      "Quy trình vô trùng được tuân thủ chặt chẽ",
      "Trang thiết bị y tế hiện đại được nhập khẩu từ các nước tiên tiến",
    ],
  },
];

const advantages = [
  {
    title: "Đội ngũ chuyên gia giàu kinh nghiệm",
    description:
      "Các bác sĩ và chuyên gia của chúng tôi được đào tạo tại các nước tiên tiến và có nhiều năm kinh nghiệm trong lĩnh vực hỗ trợ sinh sản.",
    icon: <TeamOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
  },
  {
    title: "Chi phí hợp lý và minh bạch",
    description:
      "Chúng tôi cung cấp dịch vụ chất lượng cao với mức chi phí hợp lý và minh bạch, giúp giảm gánh nặng tài chính cho các cặp vợ chồng.",
    icon: <DollarOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
  },
  {
    title: "Thời gian điều trị tối ưu",
    description:
      "Quy trình điều trị được tối ưu hóa, giúp giảm thiểu thời gian chờ đợi và tăng cơ hội thành công.",
    icon: <ClockCircleOutlined style={{ fontSize: 32, color: "#faad14" }} />,
  },
];

const treatmentProcess = [
  {
    title: "Tư vấn ban đầu",
    description:
      "Gặp gỡ bác sĩ chuyên khoa để tìm hiểu về tình trạng sức khỏe và lựa chọn phương pháp điều trị phù hợp.",
  },
  {
    title: "Kiểm tra sức khỏe tổng quát",
    description:
      "Thực hiện các xét nghiệm cần thiết để đánh giá tình trạng sức khỏe và khả năng sinh sản.",
  },
  {
    title: "Lập kế hoạch điều trị",
    description:
      "Bác sĩ sẽ đưa ra kế hoạch điều trị chi tiết dựa trên kết quả xét nghiệm và tình trạng sức khỏe.",
  },
  {
    title: "Thực hiện quy trình điều trị",
    description:
      "Tiến hành các bước điều trị theo kế hoạch đã đề ra, có thể bao gồm kích thích buồng trứng, chọc hút trứng, thụ tinh và nuôi cấy phôi.",
  },
  {
    title: "Chuyển phôi và theo dõi",
    description:
      "Chuyển phôi vào tử cung và theo dõi quá trình mang thai sớm.",
  },
  {
    title: "Hỗ trợ sau điều trị",
    description:
      "Cung cấp dịch vụ hỗ trợ và theo dõi sức khỏe sau khi điều trị và trong suốt quá trình mang thai.",
  },
];

const FeaturesPage = () => {
  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">Đặc điểm & Công nghệ</Title>
          <Paragraph className="text-lg mt-4">
            Khám phá các công nghệ tiên tiến và đặc điểm nổi bật của trung tâm chúng tôi
          </Paragraph>
        </div>

        <Divider />

        <div className="mb-12">
          <Title level={2} className="mb-6 text-center">Công nghệ tiên tiến</Title>
          <Paragraph className="text-lg text-center mb-8">
            Chúng tôi ứng dụng những công nghệ hỗ trợ sinh sản hiện đại nhất để đem lại kết quả tối ưu
          </Paragraph>

          {technologies.map((tech, index) => (
            <div key={tech.id} className="mb-10">
              <Card className="shadow-md">
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={6} className="text-center">
                    <Space direction="vertical" align="center">
                      {tech.icon}
                      <Title level={3}>{tech.title}</Title>
                    </Space>
                  </Col>
                  <Col xs={24} md={18}>
                    <Paragraph className="text-lg">{tech.description}</Paragraph>
                    <List
                      header={<Title level={4}>Ưu điểm</Title>}
                      dataSource={tech.features}
                      renderItem={(item) => (
                        <List.Item>
                          <Text>• {item}</Text>
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Card>
              {index < technologies.length - 1 && <Divider dashed className="my-8" />}
            </div>
          ))}
        </div>

        <Divider />

        <div className="my-12">
          <Title level={2} className="mb-6 text-center">Lợi thế của chúng tôi</Title>
          <Row gutter={[24, 24]}>
            {advantages.map((adv, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-full shadow-md text-center">
                  <div className="mb-4">{adv.icon}</div>
                  <Title level={3}>{adv.title}</Title>
                  <Paragraph>{adv.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        <div className="my-12">
          <Title level={2} className="mb-8 text-center">Quy trình điều trị</Title>
          <Steps direction="vertical" current={-1}>
            {treatmentProcess.map((step, index) => (
              <Step
                key={index}
                title={
                  <Title level={4} className="m-0">
                    {step.title}
                  </Title>
                }
                description={<Paragraph>{step.description}</Paragraph>}
              />
            ))}
          </Steps>
        </div>

        <Divider />

        <div className="my-12 text-center">
          <Title level={2} className="mb-4">Đặt lịch tư vấn miễn phí</Title>
          <Paragraph className="text-lg mb-6">
            Liên hệ với chúng tôi để được tư vấn miễn phí về các công nghệ và quy trình điều trị
          </Paragraph>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
            Đặt lịch ngay
          </button>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default FeaturesPage; 