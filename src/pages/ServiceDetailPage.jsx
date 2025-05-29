import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Row, Col, Card, Button, Divider, List, Avatar, Tag, Space } from "antd";
import { CalendarOutlined, CheckCircleOutlined, TeamOutlined, RightCircleOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;

// Service details data
const servicesData = {
  "ivf": {
    id: "ivf",
    title: "Thụ Tinh Trong Ống Nghiệm (IVF)",
    subTitle: "Kỹ thuật hỗ trợ sinh sản tiên tiến nhất",
    heroImage: "/images/features/pc4.jpg",
    description: [
      "Thụ tinh trong ống nghiệm (IVF) là một kỹ thuật hỗ trợ sinh sản trong đó trứng được lấy từ buồng trứng của người phụ nữ và được thụ tinh với tinh trùng trong phòng thí nghiệm. Sau khi thụ tinh, phôi được nuôi cấy trong 3-5 ngày trước khi được chuyển vào tử cung.",
      "IVF được chỉ định cho nhiều trường hợp vô sinh khác nhau như tắc ống dẫn trứng, vô sinh nam, vô sinh không rõ nguyên nhân, tuổi cao, hoặc thất bại với các phương pháp điều trị khác. Đây là phương pháp có tỷ lệ thành công cao nhất trong các kỹ thuật hỗ trợ sinh sản."
    ],
    benefits: [
      "Tỷ lệ thành công cao, đặc biệt với phụ nữ dưới 35 tuổi",
      "Có thể điều trị nhiều nguyên nhân vô sinh khác nhau",
      "Cho phép xét nghiệm di truyền phôi trước khi chuyển",
      "Có thể đông lạnh phôi thừa để sử dụng sau này",
      "Kiểm soát được số lượng phôi chuyển để giảm nguy cơ đa thai"
    ],
    process: [
      "Tư vấn và đánh giá ban đầu, lập kế hoạch điều trị",
      "Kích thích buồng trứng bằng thuốc hormone trong 8-12 ngày",
      "Theo dõi sự phát triển nang trứng qua siêu âm và xét nghiệm máu",
      "Tiêm thuốc kích thích rụng trứng và lấy trứng sau 36 giờ",
      "Thụ tinh trứng với tinh trùng trong phòng thí nghiệm",
      "Nuôi cấy phôi 3-5 ngày và chuyển phôi tốt nhất vào tử cung",
      "Hỗ trợ hoàng thể và theo dõi thai kỳ"
    ],
    specialists: [1, 2, 3]
  },
  "iui": {
    id: "iui",
    title: "Thụ Tinh Nhân Tạo (IUI)",
    subTitle: "Phương pháp hỗ trợ sinh sản đơn giản và hiệu quả",
    heroImage: "/images/features/pc6.jpg",
    description: [
      "Thụ tinh nhân tạo trong tử cung (IUI) là một phương pháp hỗ trợ sinh sản trong đó tinh trùng đã được xử lý và tập trung được đưa trực tiếp vào tử cung của người phụ nữ vào thời điểm rụng trứng. Phương pháp này giúp tinh trùng tiếp cận trứng dễ dàng hơn.",
      "IUI thường được chỉ định cho các trường hợp vô sinh nhẹ như rối loạn rụng trứng, vô sinh cổ tử cung, vô sinh nam nhẹ, hoặc vô sinh không rõ nguyên nhân. Đây là bước đầu tiên trong điều trị vô sinh trước khi chuyển sang IVF."
    ],
    benefits: [
      "Quy trình đơn giản, ít xâm lấn và không đau",
      "Chi phí thấp hơn so với IVF",
      "Không cần gây mê hay phẫu thuật",
      "Có thể kết hợp với kích thích rụng trứng nhẹ",
      "Thời gian điều trị ngắn, ít ảnh hưởng đến cuộc sống"
    ],
    process: [
      "Tư vấn và đánh giá khả năng sinh sản của cả hai vợ chồng",
      "Theo dõi chu kỳ kinh nguyệt và xác định thời điểm rụng trứng",
      "Kích thích rụng trứng bằng thuốc (nếu cần thiết)",
      "Chuẩn bị mẫu tinh trùng và xử lý trong phòng thí nghiệm",
      "Đưa tinh trùng vào tử cung bằng ống thông mềm",
      "Hỗ trợ hoàng thể và theo dõi kết quả sau 2 tuần"
    ],
    specialists: [1, 2, 4]
  },
  "diagnostic-testing": {
    id: "diagnostic-testing",
    title: "Xét Nghiệm Chẩn Đoán",
    subTitle: "Chẩn đoán tiên tiến để xác định thách thức sinh sản",
    heroImage: "/images/features/pc9.jpg",
    description: [
      "Xét nghiệm chẩn đoán sinh sản toàn diện của chúng tôi sử dụng công nghệ tiên tiến để xác định nguyên nhân gốc rễ của vô sinh. Chúng tôi cung cấp đầy đủ các quy trình chẩn đoán cho cả nam và nữ.",
      "Chẩn đoán sớm và chính xác là rất quan trọng để phát triển các kế hoạch điều trị hiệu quả. Các giao thức xét nghiệm của chúng tôi được thiết kế để kỹ lưỡng đồng thời giảm thiểu sự khó chịu và bất tiện cho bệnh nhân."
    ],
    benefits: [
      "Đánh giá toàn diện cho cả hai đối tác",
      "Thiết bị phòng thí nghiệm hiện đại",
      "Kết quả nhanh chóng với giải thích chi tiết",
      "Giao thức xét nghiệm dựa trên nghiên cứu mới nhất",
      "Xác định các yếu tố sinh sản thường bị bỏ qua"
    ],
    process: [
      "Tư vấn ban đầu để xác định các xét nghiệm cần thiết",
      "Đánh giá mức hormone",
      "Đánh giá cơ quan sinh sản bằng siêu âm",
      "Hysterosalpingogram (HSG) để kiểm tra ống dẫn trứng",
      "Phân tích tinh dịch để đánh giá yếu tố nam",
      "Xét nghiệm di truyền khi được chỉ định"
    ],
    specialists: [2, 3]
  }
};

// Doctor data
const doctors = [
  {
    id: 1,
    name: "TS. Andrew Peterson",
    title: "Bác sĩ Nội tiết Sinh sản",
    image: "/images/features/pc10.jpg",
    specialties: ["IVF", "Hiến Trứng", "Lựa Chọn Giới Tính"],
    experience: "Hơn 15 năm kinh nghiệm",
    description: "TS. Peterson dẫn dắt đội ngũ nội tiết sinh sản của chúng tôi với chuyên môn về các ca sinh sản phức tạp và công nghệ sinh sản tiên tiến."
  },
  {
    id: 2,
    name: "TS. Sarah Johnson",
    title: "Chuyên gia Sinh sản",
    image: "/images/features/pc11.jpg",
    specialties: ["Đông Lạnh Trứng", "Bảo Quản Sinh Sản", "Điều trị PCOS"],
    experience: "12 năm kinh nghiệm",
    description: "TS. Johnson chuyên về các lựa chọn bảo quản sinh sản cho phụ nữ đối mặt với điều trị y tế hoặc trì hoãn việc sinh con."
  },
  {
    id: 3,
    name: "TS. Michael Brown",
    title: "Nhà Phôi học",
    image: "/images/features/pc12.jpg",
    specialties: ["Xét nghiệm PGT", "Nuôi cấy Phôi", "Vitrification"],
    experience: "10 năm kinh nghiệm",
    description: "TS. Brown giám sát phòng thí nghiệm phôi học hiện đại của chúng tôi, đảm bảo điều kiện tối ưu cho sự phát triển của phôi."
  },
  {
    id: 4,
    name: "TS. Emily Roberts",
    title: "Bác sĩ Phẫu thuật Sinh sản",
    image: "/images/features/Pc1.jpg",
    specialties: ["Lấy Trứng", "Phẫu thuật Xâm lấn Tối thiểu", "Giải phẫu Sinh sản"],
    experience: "14 năm kinh nghiệm",
    description: "TS. Roberts rất thành thạo trong các thủ thuật phẫu thuật xâm lấn tối thiểu liên quan đến điều trị sinh sản."
  }
];

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    console.log('ServiceDetailPage - serviceId:', serviceId);
    console.log('ServiceDetailPage - servicesData:', servicesData);
    
    // Check if serviceId exists
    if (!serviceId) {
      console.log('No serviceId found, redirecting to services');
      // Redirect to services page if serviceId is missing
      navigate('/services');
      return;
    }

    // Find the service by ID
    const serviceData = servicesData[serviceId];
    console.log('Found serviceData:', serviceData);
    
    if (serviceData) {
      setService(serviceData);
      
      // Find specialists for this service
      if (serviceData.specialists) {
        const serviceSpecialists = doctors.filter(doctor => 
          serviceData.specialists.includes(doctor.id)
        );
        setSpecialists(serviceSpecialists);
      }
    } else {
      console.log('Service not found, redirecting to services');
      // Redirect to services page if service not found
      navigate('/services');
    }
  }, [serviceId, navigate]);

  if (!service) {
    return <div>Đang tải...</div>;
  }

  const handleBookAppointment = () => {
    navigate('/register-service', { 
      state: { 
        selectedService: service.id,
        serviceName: service.title
      } 
    });
  };

  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={service.heroImage} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">{service.title}</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">DỊCH VỤ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">{service.title.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Description Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2">{service.title}</Title>
            <Text className="text-[#ff8460] text-lg">{service.subTitle}</Text>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Title level={3} className="mb-6">Giới thiệu về {service.title}</Title>
                {service.description.map((paragraph, index) => (
                  <Paragraph key={index} className="text-gray-700 mb-4">
                    {paragraph}
                  </Paragraph>
                ))}

                <Divider />

                <Title level={4} className="mb-4">Lợi ích</Title>
                <List
                  dataSource={service.benefits}
                  renderItem={item => (
                    <List.Item>
                      <Space>
                        <CheckCircleOutlined className="text-[#ff8460]" />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />

                <Divider />

                <Title level={4} className="mb-4">Quy trình Điều trị</Title>
                <List
                  dataSource={service.process}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Space>
                        <div className="flex items-center justify-center bg-[#ff8460] text-white rounded-full w-6 h-6 font-bold">
                          {index + 1}
                        </div>
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                <Title level={4} className="mb-6 flex items-center">
                  <CalendarOutlined className="mr-2 text-[#ff8460]" />
                  Đặt Lịch Tư Vấn
                </Title>
                <Paragraph className="mb-6">
                  Bạn muốn tìm hiểu thêm về {service.title.toLowerCase()}? 
                  Đặt lịch tư vấn với một trong những chuyên gia của chúng tôi để thảo luận 
                  về tình huống và nhu cầu cụ thể của bạn.
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  onClick={handleBookAppointment}
                  className="bg-[#ff8460] hover:bg-[#ff6b40] border-none"
                >
                  Đặt Lịch Hẹn
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <Title level={4} className="mb-4 flex items-center">
                  <TeamOutlined className="mr-2 text-[#ff8460]" />
                  Tại Sao Chọn Chúng Tôi
                </Title>
                <List
                  dataSource={[
                    "Các chuyên gia giàu kinh nghiệm với tỷ lệ thành công đã được chứng minh",
                    "Cơ sở vật chất và công nghệ hiện đại",
                    "Kế hoạch điều trị cá nhân hóa cho mỗi bệnh nhân",
                    "Hỗ trợ toàn diện trong suốt hành trình của bạn",
                    "Giá cả minh bạch và các lựa chọn tài chính"
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <Space>
                        <RightCircleOutlined className="text-[#ff8460]" />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Specialists Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2}>Các Chuyên Gia Của Chúng Tôi</Title>
            <Text className="text-lg">Gặp gỡ các chuyên gia về {service.title.toLowerCase()}</Text>
          </div>

          <Row gutter={[24, 24]}>
            {specialists.map(doctor => (
              <Col xs={24} md={12} lg={6} key={doctor.id}>
                <Card 
                  hoverable 
                  className="text-center h-full flex flex-col"
                  cover={
                    <img 
                      alt={doctor.name} 
                      src={doctor.image} 
                      className="h-64 object-cover"
                    />
                  }
                >
                  <div className="flex-grow">
                    <Title level={4}>{doctor.name}</Title>
                    <Text type="secondary" className="block mb-2">{doctor.title}</Text>
                    <Text className="block mb-4">{doctor.experience}</Text>
                    <div className="mb-4">
                      {doctor.specialties.map(specialty => (
                        <Tag color="blue" key={specialty} className="m-1">
                          {specialty}
                        </Tag>
                      ))}
                    </div>
                    <Paragraph ellipsis={{ rows: 3 }}>
                      {doctor.description}
                    </Paragraph>
                  </div>
                  <Button 
                    type="primary" 
                    className="mt-4 bg-[#ff8460] hover:bg-[#ff6b40] border-none"
                    onClick={() => navigate('/register-service', { 
                      state: { 
                        selectedService: service.id,
                        selectedDoctor: `dr_${doctor.id}` 
                      } 
                    })}
                  >
                    Đặt Lịch Với {doctor.name.split(' ')[0]}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="mb-4">Sẵn Sàng Thực Hiện Bước Tiếp Theo?</Title>
          <Paragraph className="text-lg mb-8 max-w-2xl mx-auto">
            Đội ngũ của chúng tôi sẵn sàng giúp bạn trên hành trình sinh sản. 
            Liên hệ với chúng tôi ngay hôm nay để tìm hiểu thêm về {service.title.toLowerCase()} 
            và cách chúng tôi có thể hỗ trợ bạn đạt được giấc mơ làm cha mẹ.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              onClick={handleBookAppointment}
              className="bg-[#ff8460] hover:bg-[#ff6b40] border-none"
            >
              Đặt Lịch Tư Vấn
            </Button>
            <Button 
              size="large"
              onClick={() => navigate('/contacts')}
            >
              Liên Hệ Với Chúng Tôi
            </Button>
          </Space>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default ServiceDetailPage;