import React from 'react';
import { Carousel, Typography, Row, Col, Card, Button, Input, Form, Checkbox, Space, Statistic, Avatar, Tag, Rate } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, ArrowRightOutlined } from '@ant-design/icons';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import SevicesChild from '../components/SevicesChild';
import StatisticsSection from '../components/StatisticsSection';
import ServicesIcons from '../components/ServicesIcons';
import RecommendationSection from '../components/RecommendationSection';

const { Title, Paragraph, Text } = Typography;

// Dữ liệu bác sĩ từ OurStaffPage
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
  },
];

const UserTemplate = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Slider */}
      <Carousel autoplay effect="fade" dots={true} autoplaySpeed={5000}>
        <div>
          <div className="relative h-[600px]">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('/images/features/pc9.jpg')" }}
            />
            <div className="absolute inset-0 bg-black opacity-40" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h1 className="text-5xl font-bold text-white mb-6">Điều Kỳ Diệu Của Bạn.<br/>Sứ Mệnh Của Chúng Tôi.</h1>
                  <button 
                    onClick={() => navigate('/appointment')}
                    className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-4 px-8 rounded transition duration-300 ease-in-out text-lg"
                  >
                    Đặt Lịch Hẹn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="relative h-[600px]">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('/images/features/Pc1.jpg')" }}
            />
            <div className="absolute inset-0 bg-black opacity-40" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h1 className="text-5xl font-bold text-white mb-6">Chăm Sóc Chuyên Nghiệp.<br/>Gia Đình Hạnh Phúc.</h1>
                  <button 
                    onClick={() => navigate('/services')}
                    className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-4 px-8 rounded transition duration-300 ease-in-out text-lg"
                  >
                    Tìm Hiểu Về Dịch Vụ Của Chúng Tôi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="relative h-[600px]">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('/images/features/pc7.jpg')" }}
            />
            <div className="absolute inset-0 bg-black opacity-40" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h1 className="text-5xl font-bold text-white mb-6">Công Nghệ Tiên Tiến.<br/>Chăm Sóc Tận Tâm.</h1>
                  <button 
                    onClick={() => navigate('/our-staff')}
                    className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-4 px-8 rounded transition duration-300 ease-in-out text-lg"
                  >
                    Gặp Gỡ Các Chuyên Gia Của Chúng Tôi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel>

      {/* Services Icons Component */}
      <ServicesIcons />

      {/* Welcome Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <span className="text-[#ff8460] font-medium">CHÀO MỪNG BẠN!</span>
              <h2 className="text-4xl font-bold mt-2 mb-6">Chào Mừng Đến Với<br/>Trung Tâm Sinh Sản</h2>
              <p className="text-gray-600 text-lg mb-8">
                Chúng tôi cung cấp tất cả các dịch vụ y tế mà bạn cần. Mục tiêu của chúng tôi là làm cho khách hàng trở thành những bậc cha mẹ hạnh phúc. 
                Chúng tôi thực hiện điều này một cách dễ dàng nhất có thể để các cặp đôi có thể có con, dù là thông qua việc sử dụng trứng hiến tặng hay người mang thai hộ.
              </p>
              <button 
                onClick={() => navigate('/services')}
                className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-6 rounded transition duration-300 ease-in-out"
              >
                Tìm Hiểu Thêm Về Chúng Tôi
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="rounded-full border-4 border-[#ff8460] p-2 w-64 h-64 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-sm">HƠN</span>
                  <div className="text-6xl text-[#ff8460] font-bold">87<span className="text-2xl">%</span></div>
                  <span className="text-gray-400 text-sm">Thai Kỳ Thành Công</span>
                </div>
                <div className="absolute -right-12 bottom-4">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Bác sĩ" 
                    className="rounded-full w-40 h-40 object-cover border-4 border-white shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Center Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Row gutter={[48, 48]} className="items-center">
            <Col xs={24} md={12}>
              <div>
                <span className="text-[#ff8460] font-medium">GIỚI THIỆU</span>
                <h2 className="text-4xl font-bold mt-2 mb-6">Trung tâm<br/>Hỗ trợ Sinh sản</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Trung tâm Hỗ trợ Sinh sản của chúng tôi được thành lập vào năm 2010 với sứ mệnh mang lại 
                  hạnh phúc cho các gia đình đang gặp khó khăn trong việc có con. 
                  Với hơn 10 năm kinh nghiệm, chúng tôi đã giúp hàng ngàn cặp vợ chồng hiện thực hóa 
                  giấc mơ làm cha mẹ thông qua việc áp dụng các kỹ thuật điều trị sinh sản tiên tiến nhất.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition duration-300" onClick={() => navigate('/service-detail/egg-donor')}>
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4 hover:bg-[#ff6b40] transition duration-300">
                      <ArrowRightOutlined />
                    </div>
                    <span className="hover:text-[#ff8460] transition duration-300">Thụ tinh trong ống nghiệm (IVF)</span>
                  </div>
                  <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition duration-300" onClick={() => navigate('/service-detail/egg-freezing')}>
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4 hover:bg-[#ff6b40] transition duration-300">
                      <ArrowRightOutlined />
                    </div>
                    <span className="hover:text-[#ff8460] transition duration-300">Bảo quản khả năng sinh sản</span>
                  </div>
                  <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition duration-300" onClick={() => navigate('/service-detail/diagnostic-testing')}>
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4 hover:bg-[#ff6b40] transition duration-300">
                      <ArrowRightOutlined />
                    </div>
                    <span className="hover:text-[#ff8460] transition duration-300">Xét nghiệm và Chẩn đoán</span>
                  </div>
                  <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition duration-300" onClick={() => navigate('/service-detail/gender-selection')}>
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4 hover:bg-[#ff6b40] transition duration-300">
                      <ArrowRightOutlined />
                    </div>
                    <span className="hover:text-[#ff8460] transition duration-300">Xét nghiệm Di truyền</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/services')}
                  className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-6 rounded transition duration-300 ease-in-out"
                >
                  Tìm hiểu Thêm
                </button>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="relative">
                <img 
                  src="/images/features/pc5.jpg" 
                  alt="Mẹ và bé" 
                  className="w-full rounded-lg shadow-xl"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      

      {/* About Center in Numbers */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Thành tựu của chúng tôi</h2>
            <span className="text-[#ff8460] font-medium">CHÚNG TÔI LÀ AI</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="flex items-center space-x-8">
              <div>
                <div className="relative">
                  <div className="w-64 h-64">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#ff8460" strokeWidth="6" strokeDasharray="283" strokeDashoffset="70" />
                      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#ff8460" fontSize="28" fontWeight="bold">87%</text>
                    </svg>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-500">Tỷ lệ thành công</p>
                    <p className="font-semibold">Thai kỳ thành công</p>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="/images/features/pc4.jpg" 
                  alt="Cặp đôi hạnh phúc" 
                  className="w-48 h-48 rounded-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div>
                <div className="relative">
                  <div className="w-64 h-64">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#ff8460" strokeWidth="6" strokeDasharray="283" strokeDashoffset="70" />
                      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#ff8460" fontSize="28" fontWeight="bold">75%</text>
                    </svg>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-500">Tỷ lệ thành công</p>
                    <p className="font-semibold">Mang thai hộ thành công</p>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="/images/features/pc6.jpg" 
                  alt="Mẹ và bé" 
                  className="w-48 h-48 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Our Doctors */}
      <div className="py-20 bg-[#c2da5c]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-2">Đội ngũ Chuyên gia</h2>
            <span className="text-white font-medium">BÁC SĨ CỦA CHÚNG TÔI</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-6 flex justify-center items-center">
                    <Avatar
                      size={120}
                      src={doctor.image}
                      icon={<UserOutlined />}
                      className="border-4 border-[#c2da5c]"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-bold mb-2">{doctor.name}</h3>
                    <p className="text-[#c2da5c] font-semibold mb-2">{doctor.role}</p>
                    <p className="text-gray-600 text-sm mb-3">{doctor.specialization}</p>
                    <p className="text-gray-600 text-sm mb-3">{doctor.experience}</p>
                    
                    <div className="mb-3">
                      <Rate disabled defaultValue={doctor.rating} allowHalf className="text-sm" />
                      <span className="ml-2 text-gray-600">({doctor.rating})</span>
                    </div>
                    
                    <div className="mb-3">
                      <Tag color="green" className="mb-1">{doctor.treatmentType}</Tag>
                      {doctor.certificates.slice(0, 1).map((cert, index) => (
                        <Tag color="blue" key={index} className="mb-1 text-xs">
                          {cert}
                        </Tag>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => navigate(`/doctor/${doctor.id}`)}
                        className="bg-[#c2da5c] hover:bg-[#a8c245] text-white px-4 py-2 rounded text-sm transition duration-300"
                      >
                        Xem chi tiết
                      </button>
                      <button 
                        onClick={() => navigate('/appointment', { state: { selectedDoctor: doctor.value } })}
                        className="bg-[#ff8460] hover:bg-[#ff6b40] text-white px-4 py-2 rounded text-sm transition duration-300"
                      >
                        Đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={() => navigate('/our-staff')}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded transition duration-300 ease-in-out"
            >
              Xem Toàn Bộ Đội Ngũ
            </button>
          </div>
        </div>
      </div>

      {/* Recommendation Section */}
      <RecommendationSection />

      

      <Outlet />
      <UserFooter />
    </div>
  );
};

export default UserTemplate;