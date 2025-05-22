import React from "react";
import { Typography, Card, Row, Col, Divider, Image, Space } from "antd";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph } = Typography;

const AboutCenterPage = () => {
  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">Về Trung Tâm</Title>
          <Paragraph className="text-lg mt-4">
            Tìm hiểu về trung tâm hỗ trợ sinh sản của chúng tôi, lịch sử, sứ mệnh và giá trị
          </Paragraph>
        </div>

        <Divider />

        <Row gutter={[24, 24]} align="middle" className="mb-12">
          <Col xs={24} md={12}>
            <Title level={2}>Lịch sử hình thành</Title>
            <Paragraph className="text-lg">
              Trung tâm Hỗ trợ Sinh sản của chúng tôi được thành lập vào năm 2010 với sứ mệnh mang 
              lại niềm hạnh phúc cho các gia đình Việt Nam đang gặp khó khăn trong việc có con.
            </Paragraph>
            <Paragraph className="text-lg">
              Với hơn 10 năm kinh nghiệm, chúng tôi đã giúp hàng nghìn cặp vợ chồng thực hiện ước mơ 
              làm cha mẹ thông qua việc áp dụng các kỹ thuật hỗ trợ sinh sản tiên tiến nhất.
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Image
              src="https://example.com/images/center-building.jpg"
              alt="Trung tâm hỗ trợ sinh sản"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAAABJRU5ErkJggg=="
            />
          </Col>
        </Row>
        
        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24}>
            <Card className="shadow-md">
              <Title level={2} className="text-center mb-6">Sứ mệnh và tầm nhìn</Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Title level={3}>Sứ mệnh</Title>
                  <Paragraph className="text-lg">
                    Mang lại hạnh phúc cho các gia đình Việt Nam thông qua các dịch vụ hỗ trợ sinh sản an toàn, 
                    hiệu quả với chất lượng cao nhất và chi phí hợp lý.
                  </Paragraph>
                </Col>
                <Col xs={24} md={12}>
                  <Title level={3}>Tầm nhìn</Title>
                  <Paragraph className="text-lg">
                    Trở thành trung tâm hỗ trợ sinh sản hàng đầu tại Việt Nam và khu vực Đông Nam Á, 
                    nơi áp dụng các công nghệ tiên tiến nhất trong điều trị vô sinh hiếm muộn.
                  </Paragraph>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24}>
            <Title level={2} className="text-center mb-6">Giá trị cốt lõi</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card className="shadow-md h-full">
                  <Title level={3}>Chuyên môn</Title>
                  <Paragraph className="text-lg">
                    Đội ngũ y bác sĩ giàu kinh nghiệm, được đào tạo tại các nước tiên tiến về hỗ trợ sinh sản.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="shadow-md h-full">
                  <Title level={3}>Đồng cảm</Title>
                  <Paragraph className="text-lg">
                    Hiểu và chia sẻ những khó khăn, lo lắng của các cặp vợ chồng trong hành trình tìm kiếm hạnh phúc.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="shadow-md h-full">
                  <Title level={3}>Đổi mới</Title>
                  <Paragraph className="text-lg">
                    Không ngừng học hỏi, ứng dụng các công nghệ mới nhất trong lĩnh vực hỗ trợ sinh sản.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Title level={2} className="text-center mb-6">Thành tựu</Title>
            <Card className="shadow-md">
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Title level={3}>Hơn 5,000+</Title>
                  <Paragraph className="text-lg">Em bé đã chào đời nhờ sự hỗ trợ của trung tâm</Paragraph>
                </div>
                <div>
                  <Title level={3}>Trên 70%</Title>
                  <Paragraph className="text-lg">Tỷ lệ thành công trong các ca thụ tinh trong ống nghiệm</Paragraph>
                </div>
                <div>
                  <Title level={3}>20+</Title>
                  <Paragraph className="text-lg">Bác sĩ chuyên khoa với kinh nghiệm trung bình trên 10 năm</Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
      <UserFooter />
    </div>
  );
};

export default AboutCenterPage;