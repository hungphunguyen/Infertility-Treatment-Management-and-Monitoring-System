import React from "react";
import { Typography, Card, Row, Col, Divider, List, Space } from "antd";
import { MedicineBoxOutlined, ExperimentOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";


const { Title, Paragraph } = Typography;

const services = [
  {
    id: 1,
    title: "Thụ tinh trong tử cung (IUI)",
    description:
      "Phương pháp thụ tinh trong tử cung là kỹ thuật đưa tinh trùng đã được xử lý vào trong buồng tử cung của người phụ nữ vào đúng thời điểm rụng trứng.",
    icon: <MedicineBoxOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
    details: [
      "Không cần phẫu thuật, tương đối đơn giản",
      "Phù hợp với các trường hợp vô sinh nhẹ",
      "Chi phí thấp hơn so với các phương pháp khác",
      "Thời gian điều trị ngắn và ít xâm lấn",
    ],
    steps: [
      "Kích thích buồng trứng bằng thuốc (tùy trường hợp)",
      "Theo dõi sự phát triển của nang trứng",
      "Tiêm hormone kích thích rụng trứng",
      "Chuẩn bị và xử lý tinh trùng",
      "Đưa tinh trùng vào buồng tử cung",
    ],
    success: "Tỷ lệ thành công khoảng 10-20% cho mỗi chu kỳ điều trị.",
  },
  {
    id: 2,
    title: "Thụ tinh trong ống nghiệm (IVF)",
    description:
      "Phương pháp thụ tinh trong ống nghiệm là kỹ thuật kết hợp trứng và tinh trùng trong phòng thí nghiệm, sau đó cấy phôi vào tử cung của người phụ nữ.",
    icon: <ExperimentOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
    details: [
      "Phù hợp với nhiều trường hợp vô sinh phức tạp",
      "Giải pháp cho vô sinh do vòi trứng bị tắc",
      "Có thể kết hợp với kỹ thuật tiêm tinh trùng vào bào tương trứng (ICSI)",
      "Có thể sàng lọc di truyền trước khi cấy phôi",
    ],
    steps: [
      "Kích thích buồng trứng để tạo nhiều trứng",
      "Chọc hút trứng dưới hướng dẫn siêu âm",
      "Thụ tinh trứng với tinh trùng trong phòng thí nghiệm",
      "Nuôi cấy phôi trong 3-5 ngày",
      "Chuyển phôi vào tử cung",
      "Hỗ trợ thai kỳ bằng hormone",
    ],
    success: "Tỷ lệ thành công khoảng 30-40% cho mỗi chu kỳ điều trị.",
  },
  {
    id: 3,
    title: "Tiêm tinh trùng vào bào tương trứng (ICSI)",
    description:
      "Kỹ thuật ICSI là phương pháp tiêm trực tiếp một tinh trùng vào một trứng để thụ tinh, thường được áp dụng trong trường hợp tinh trùng yếu hoặc ít.",
    icon: <ExperimentOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
    details: [
      "Giải pháp cho trường hợp tinh trùng ít, yếu hoặc dị dạng",
      "Tỷ lệ thụ tinh cao hơn so với IVF thông thường",
      "Có thể áp dụng cho các trường hợp thất bại với IVF thông thường",
      "Giải pháp cho vô sinh do yếu tố nam",
    ],
    steps: [
      "Kích thích buồng trứng tương tự IVF",
      "Chọc hút trứng",
      "Chọn và tiêm một tinh trùng vào trứng",
      "Nuôi cấy phôi",
      "Chuyển phôi vào tử cung",
    ],
    success: "Tỷ lệ thành công khoảng 35-45% tùy thuộc vào từng trường hợp cụ thể.",
  },
];

const ServicesPage = () => {
  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">Dịch vụ điều trị hiếm muộn</Title>
          <Paragraph className="text-lg mt-4">
            Chúng tôi cung cấp các phương pháp điều trị hiếm muộn tiên tiến với đội ngũ y bác sĩ
            chuyên nghiệp và trang thiết bị hiện đại.
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
                
                <Title level={4}>Ưu điểm</Title>
                <List
                  dataSource={service.details}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text>• {item}</Typography.Text>
                    </List.Item>
                  )}
                />
                
                <Title level={4} className="mt-4">Quy trình điều trị</Title>
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
                  <Typography.Text strong>Tỷ lệ thành công: </Typography.Text>
                  <Typography.Text>{service.success}</Typography.Text>
                </div>
              </Col>
            </Row>
          </Card>
        ))}

        <div className="mt-12 mb-8 text-center">
          <Title level={2}>Đặt lịch tư vấn</Title>
          <Paragraph className="mb-6">
            Hãy liên hệ với chúng tôi để được tư vấn về phương pháp điều trị phù hợp nhất với tình trạng của bạn.
          </Paragraph>
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
              Đặt lịch ngay
            </button>
          </div>
        </div>
      </div>
      <UserFooter/>
    </div>
  );
};

export default ServicesPage; 