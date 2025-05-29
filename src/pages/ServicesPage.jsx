import React from "react";
import { Typography, Row, Col, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph } = Typography;

// All services for the services page
const allServices = [
  {
    id: "ivf",
    title: "Thụ Tinh Trong Ống Nghiệm (IVF)",
    description: "IVF là kỹ thuật hỗ trợ sinh sản tiên tiến nhất, trong đó trứng được thụ tinh với tinh trùng trong phòng thí nghiệm, sau đó phôi được chuyển vào tử cung để phát triển thành thai.",
    image: "/images/features/pc4.jpg"
  },
  {
    id: "iui",
    title: "Thụ Tinh Nhân Tạo (IUI)",
    description: "IUI là phương pháp đưa tinh trùng đã được xử lý trực tiếp vào tử cung của người phụ nữ vào thời điểm rụng trứng để tăng cơ hội thụ thai tự nhiên.",
    image: "/images/features/pc6.jpg"
  },
  {
    id: "diagnostic-testing",
    title: "Xét Nghiệm Chẩn Đoán",
    description: "Xét nghiệm toàn diện để xác định nguyên nhân của vô sinh và xác định phương pháp điều trị hiệu quả nhất.",
    image: "/images/features/pc9.jpg"
  }
];

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src="/images/features/pc4.jpg" 
          alt="Băng rôn Dịch vụ" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Dịch Vụ</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">DỊCH VỤ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2">Những Gì Chúng Tôi Cung Cấp</Title>
            <div className="mt-2">
              <span className="text-[#ff8460] font-medium text-lg">DỊCH VỤ CỦA CHÚNG TÔI</span>
            </div>
          </div>

          {/* Services Row */}
          <Row gutter={[32, 32]} className="mb-16">
            {allServices.map((service) => (
              <Col xs={24} md={8} key={service.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6 flex-grow flex flex-col">
                    <Title level={4} className="mb-4">{service.title}</Title>
                    <Paragraph className="text-gray-600 mb-6 flex-grow">
                      {service.description}
                    </Paragraph>
                    <Link to={`/service-detail/${service.id}`} className="text-[#ff8460] font-medium hover:text-[#ff6b40] inline-block mt-auto">
                      <span className="mr-1">+</span> Thông Tin Thêm
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      
      {/* Recommendation Section */}
      <div className="py-20 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/features/pc9.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex justify-center">
                <div className="w-64 h-64 rounded-full border-4 border-white flex flex-col items-center justify-center text-white">
                  <div className="text-sm uppercase">HƠN</div>
                  <div className="text-6xl font-bold">1250</div>
                  <div className="text-sm uppercase text-[#ff8460]">Gia Đình Hạnh Phúc</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 text-white">
              <h2 className="text-4xl font-bold mb-4">Mọi Người Đề Xuất Chúng Tôi</h2>
              <div className="text-[#ff8460] font-medium mb-4">TẠI SAO CHỌN CHÚNG TÔI</div>
              <p className="mb-8">
                Chúng tôi cung cấp sự chăm sóc và quan tâm cá nhân hóa cho mỗi khách hàng trong hành trình làm cha mẹ của họ. 
                Chúng tôi cung cấp xét nghiệm toàn diện để xác định nguyên nhân vô sinh ở nam và nữ, và chúng tôi 
                chuyên về IUI và IVF.
              </p>
              <Button 
                onClick={() => navigate('/contacts')}
                className="bg-[#ff8460] hover:bg-[#ff6b40] text-white border-none rounded py-3 px-8"
              >
                Liên Hệ Với Chúng Tôi
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <UserFooter />
    </div>
  );
};

export default ServicesPage;