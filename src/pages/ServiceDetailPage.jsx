import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Row, Col, Card, Button, Divider, List, Avatar, Tag, Space } from "antd";
import { CalendarOutlined, CheckCircleOutlined, TeamOutlined, RightCircleOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;

// Service details data
const servicesData = {
  "egg-donor": {
    id: "egg-donor",
    title: "Hiến Trứng và Mang Thai Hộ",
    subTitle: "Xây dựng gia đình thông qua hiến tặng và mang thai hộ",
    heroImage: "/images/features/pc4.jpg",
    description: [
      "Hiến trứng là quá trình một người phụ nữ hiến trứng của mình cho một người phụ nữ khác để giúp cô ấy thụ thai. Phương pháp này thường được sử dụng khi người mẹ dự định có chất lượng trứng kém, tuổi mẹ cao hoặc có lo ngại về di truyền.",
      "Mang thai hộ là một thỏa thuận mà một người phụ nữ (người mang thai hộ) mang thai và sinh con cho một cá nhân hoặc cặp đôi khác. Mang thai hộ theo phương pháp gestational sử dụng phôi được tạo ra từ vật liệu di truyền của cha mẹ dự định hoặc trứng/tinh trùng hiến tặng."
    ],
    benefits: [
      "Truy cập vào cơ sở dữ liệu với hơn 1.000 người hiến tặng đã được sàng lọc",
      "Sàng lọc y tế và tâm lý toàn diện",
      "Hỗ trợ pháp lý trong suốt quá trình",
      "Tỷ lệ thành công cao với các kỹ thuật phòng thí nghiệm tiên tiến",
      "Dịch vụ ghép đôi cá nhân hóa cho cha mẹ dự định"
    ],
    process: [
      "Tư vấn và đánh giá ban đầu",
      "Lựa chọn người hiến trứng hoặc người mang thai hộ từ cơ sở dữ liệu của chúng tôi",
      "Sàng lọc y tế và đồng bộ hóa chu kỳ",
      "Lấy trứng từ người hiến hoặc thực hiện quy trình IVF",
      "Chuyển phôi vào mẹ dự định hoặc người mang thai hộ",
      "Theo dõi và hỗ trợ thai kỳ"
    ],
    specialists: [1, 2, 4]
  },
  "egg-freezing": {
    id: "egg-freezing",
    title: "Đông Lạnh / Bảo Quản Trứng",
    subTitle: "Bảo vệ khả năng sinh sản của bạn cho tương lai",
    heroImage: "/images/features/pc6.jpg",
    description: [
      "Đông lạnh trứng (bảo quản noãn bằng lạnh) là phương pháp dùng để bảo vệ tiềm năng sinh sản ở phụ nữ. Trứng được lấy từ buồng trứng, đông lạnh khi chưa thụ tinh và lưu trữ để sử dụng sau này.",
      "Quy trình này cung cấp cơ hội cho phụ nữ trì hoãn việc sinh con vì lý do y tế hoặc cá nhân, chẳng hạn như điều trị ung thư, tuổi cao hoặc chưa tìm được đối tác phù hợp."
    ],
    benefits: [
      "Bảo vệ trứng trẻ hơn, khỏe mạnh hơn để sử dụng trong tương lai",
      "Linh hoạt trong kế hoạch gia đình",
      "Lựa chọn bảo vệ khả năng sinh sản trước các điều trị y tế",
      "Giảm lo âu về suy giảm khả năng sinh sản do tuổi tác",
      "Kỹ thuật vitrification tiên tiến với tỷ lệ thành công cao"
    ],
    process: [
      "Đánh giá và xét nghiệm khả năng sinh sản ban đầu",
      "Kích thích buồng trứng bằng tiêm hormone",
      "Theo dõi sự phát triển nang trứng qua siêu âm",
      "Quy trình lấy trứng dưới gây mê nhẹ",
      "Vitrification (đông lạnh nhanh) trứng trong phòng thí nghiệm",
      "Lưu trữ trứng đông lạnh dài hạn"
    ],
    specialists: [2, 3, 4]
  },
  "gender-selection": {
    id: "gender-selection",
    title: "Lựa Chọn Giới Tính",
    subTitle: "Cân bằng gia đình thông qua xét nghiệm di truyền tiên tiến",
    heroImage: "/images/features/iui-vs-ivf.jpg",
    description: [
      "Lựa chọn giới tính là phương pháp khoa học cho phép cha mẹ chọn giới tính của con trước khi mang thai. Phương pháp này thường được thực hiện bằng Xét nghiệm Di truyền Trước Phôi (PGT) trong quá trình IVF.",
      "Lựa chọn này có thể được chọn để cân bằng gia đình hoặc ngăn ngừa các rối loạn di truyền liên quan đến giới tính truyền sang con."
    ],
    benefits: [
      "Tỷ lệ chính xác cao (trên 99%) trong xác định giới tính",
      "Lựa chọn cân bằng gia đình",
      "Ngăn ngừa các rối loạn di truyền liên quan đến giới tính",
      "Kết hợp với sàng lọc di truyền toàn diện",
      "Được thực hiện bởi các nhà phôi học giàu kinh nghiệm"
    ],
    process: [
      "Tư vấn ban đầu và tư vấn di truyền",
      "Quy trình IVF để tạo phôi",
      "Sinh thiết phôi vào ngày 5-6 của quá trình phát triển",
      "Phân tích PGT để xác định giới tính và sức khỏe di truyền",
      "Lựa chọn phôi có giới tính mong muốn",
      "Chuyển phôi và theo dõi thai kỳ"
    ],
    specialists: [1, 3]
  },
  "consultation": {
    id: "consultation",
    title: "Tư Vấn Sinh Sản",
    subTitle: "Hướng dẫn chuyên môn cho hành trình sinh sản của bạn",
    heroImage: "/images/features/pc3.jpg",
    description: [
      "Các buổi tư vấn sinh sản của chúng tôi cung cấp đánh giá toàn diện và lời khuyên cá nhân hóa từ các chuyên gia sinh sản giàu kinh nghiệm. Chúng tôi dành thời gian để hiểu tình huống và lịch sử y tế độc đáo của bạn.",
      "Trong buổi tư vấn, các chuyên gia của chúng tôi sẽ thảo luận về mục tiêu sinh sản của bạn, thực hiện các xét nghiệm cần thiết và phát triển kế hoạch điều trị tùy chỉnh phù hợp với nhu cầu và hoàn cảnh cụ thể của bạn."
    ],
    benefits: [
      "Chú ý cá nhân từ các chuyên gia được chứng nhận",
      "Đánh giá khả năng sinh sản toàn diện",
      "Lập kế hoạch điều trị tùy chỉnh",
      "Giáo dục về tất cả các lựa chọn có sẵn",
      "Hỗ trợ tinh thần và tâm lý"
    ],
    process: [
      "Xem xét lịch sử y tế đầy đủ",
      "Khám sức khỏe và xét nghiệm chẩn đoán",
      "Thảo luận về kết quả xét nghiệm và chẩn đoán",
      "Giải thích các lựa chọn điều trị",
      "Phát triển kế hoạch điều trị cá nhân hóa",
      "Hỗ trợ liên tục trong suốt hành trình sinh sản của bạn"
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
    // Check if serviceId exists
    if (!serviceId) {
      // Redirect to services page if serviceId is missing
      navigate('/services');
      return;
    }

    // Find the service by ID
    const serviceData = servicesData[serviceId];
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
      // Redirect to services page if service not found
      navigate('/services');
    }
  }, [serviceId, navigate]);

  if (!service) {
    return <div>Đang tải...</div>;
  }

  const handleBookAppointment = () => {
    navigate('/appointment', { 
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
                    onClick={() => navigate('/appointment', { 
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