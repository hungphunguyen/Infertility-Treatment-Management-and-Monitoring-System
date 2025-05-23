import React from "react";
import { Typography, Card, Row, Col, Divider, List, Space } from "antd";
import { MedicineBoxOutlined, ExperimentOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";


const { Title, Paragraph } = Typography;

const services = [
  {
    id: 1,
    title: "Intrauterine Insemination (IUI)",
    description:
      "Intrauterine insemination is a technique of placing processed sperm directly into a woman's uterus at the time of ovulation.",
    icon: <MedicineBoxOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
    details: [
      "No surgery required, relatively simple procedure",
      "Suitable for cases of mild infertility",
      "Lower cost compared to other methods",
      "Short treatment time and minimally invasive",
    ],
    steps: [
      "Ovarian stimulation with medication (case dependent)",
      "Monitoring follicular development",
      "Hormone injection to trigger ovulation",
      "Sperm preparation and processing",
      "Placement of sperm into the uterus",
    ],
    success: "Success rate is approximately 10-20% per treatment cycle.",
  },
  {
    id: 2,
    title: "In Vitro Fertilization (IVF)",
    description:
      "In vitro fertilization is a technique that combines eggs and sperm in a laboratory, followed by embryo transfer into the woman's uterus.",
    icon: <ExperimentOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
    details: [
      "Suitable for many complex infertility cases",
      "Solution for blocked fallopian tubes",
      "Can be combined with Intracytoplasmic Sperm Injection (ICSI)",
      "Genetic screening possible before embryo transfer",
    ],
    steps: [
      "Ovarian stimulation to produce multiple eggs",
      "Egg retrieval under ultrasound guidance",
      "Fertilization of eggs with sperm in laboratory",
      "Embryo culture for 3-5 days",
      "Embryo transfer into the uterus",
      "Hormonal support for pregnancy",
    ],
    success: "Success rate is approximately 30-40% per treatment cycle.",
  },
  {
    id: 3,
    title: "Intracytoplasmic Sperm Injection (ICSI)",
    description:
      "ICSI is a technique where a single sperm is directly injected into an egg for fertilization, typically used in cases of poor sperm quality or count.",
    icon: <ExperimentOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
    details: [
      "Solution for cases with low sperm count, poor motility, or abnormal morphology",
      "Higher fertilization rate compared to conventional IVF",
      "Can be applied in cases where conventional IVF has failed",
      "Solution for male factor infertility",
    ],
    steps: [
      "Ovarian stimulation similar to IVF",
      "Egg retrieval",
      "Selection and injection of a single sperm into each egg",
      "Embryo culture",
      "Embryo transfer into the uterus",
    ],
    success: "Success rate is approximately 35-45% depending on each specific case.",
  },
];

const ServicesPage = () => {
  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">Fertility Treatment Services</Title>
          <Paragraph className="text-lg mt-4">
            We provide advanced fertility treatment methods with a professional medical team
            and state-of-the-art equipment.
          </Paragraph>
        </div>

        <Divider />

        {services.map((service) => (
          <Card key={service.id} className="mb-10 shadow-md">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={6} className="text-center">
                <Space direction="vertical" align="center">
                  {service.icon}
                  <Title level={2}>{service.title}</Title>
                </Space>
              </Col>
              <Col xs={24} md={18}>
                <Paragraph className="text-lg">{service.description}</Paragraph>
                
                <Title level={4}>Advantages</Title>
                <List
                  dataSource={service.details}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text>• {item}</Typography.Text>
                    </List.Item>
                  )}
                />
                
                <Title level={4} className="mt-4">Treatment Process</Title>
                <List
                  dataSource={service.steps}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Typography.Text>
                        {index + 1}. {item}
                      </Typography.Text>
                    </List.Item>
                  )}
                />
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <Typography.Text strong>Success Rate: </Typography.Text>
                  <Typography.Text>{service.success}</Typography.Text>
                </div>
              </Col>
            </Row>
          </Card>
        ))}

        <div className="mt-12 mb-8 text-center">
          <Title level={2}>Schedule a Consultation</Title>
          <Paragraph className="mb-6">
            Contact us for personalized advice on the most suitable treatment method for your condition.
          </Paragraph>
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
              Book Now
            </button>
          </div>
        </div>
      </div>
      <UserFooter/>
    </div>
  );
};

export default ServicesPage; 