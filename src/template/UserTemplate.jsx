import React from 'react';
import { Carousel, Typography, Row, Col, Card, Button, Input, Form, Checkbox, Space, Statistic } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import SevicesChild from '../components/SevicesChild';
import StatisticsSection from '../components/StatisticsSection';
import ServicesIcons from '../components/ServicesIcons';

const { Title, Paragraph, Text } = Typography;

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
                onClick={() => navigate('/about-center')}
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

      {/* About Our Center */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Về Trung Tâm Của Chúng Tôi</h2>
            <span className="text-[#ff8460] font-medium">CHÚNG TÔI LÀ AI</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <img 
                src="/images/features/pc3.jpg" 
                alt="Bác sĩ" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-center mb-4">Chuyên Gia Có Trình Độ Cao</h3>
                <p className="text-center text-gray-600 mb-4">
                  Đội ngũ chăm sóc tận tâm và chu đáo của chúng tôi bao gồm các bác sĩ, y tá, trợ lý y tế và nhân viên hỗ trợ khác.
                </p>
                <div className="text-center">
                  <button 
                    onClick={() => navigate('/our-staff')}
                    className="text-[#ff8460] font-medium hover:text-[#ff6b40]"
                  >
                    <span className="mr-1">+</span> Thông Tin Thêm
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <img 
                src="/images/features/pc4.jpg" 
                className="h-56 w-full object-cover"
                alt="Hiến Trứng"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-center mb-4">Thiết Bị Công Nghệ Cao Mới Nhất</h3>
                <p className="text-center text-gray-600 mb-4">
                  Trung tâm được trang bị thiết bị công nghệ cao và được phê duyệt, đảm bảo sự hợp tác tốt nhất có thể với các bác sĩ.
                </p>
                <div className="text-center">
                  <button 
                    onClick={() => navigate('/about-center')}
                    className="text-[#ff8460] font-medium hover:text-[#ff6b40]"
                  >
                    <span className="mr-1">+</span> Thông Tin Thêm
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <img 
                src="/images/features/pc5.jpg" 
                alt="Em Bé" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-center mb-4">Chúng Tôi Làm Việc Với Mọi Bệnh Lý</h3>
                <p className="text-center text-gray-600 mb-4">
                  Chúng tôi giúp mọi người đấu tranh với các khó khăn về sinh sản, vô sinh hoặc các vấn đề sinh sản, những người mơ ước xây dựng một gia đình.
                </p>
                <div className="text-center">
                  <button 
                    onClick={() => navigate('/services')}
                    className="text-[#ff8460] font-medium hover:text-[#ff6b40]"
                  >
                    <span className="mr-1">+</span> Thông Tin Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Banner */}
      <div className="py-16 bg-[#c2da5c]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Đặt Lịch Hẹn Ngay Hôm Nay!</h2>
          <p className="text-white mb-8 text-lg">NHẬN TƯ VẤN MIỄN PHÍ</p>
          <button 
            onClick={() => navigate('/contacts')}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded transition duration-300 ease-in-out text-lg"
          >
            Đặt Câu Hỏi
          </button>
        </div>
      </div>

      {/* Treatment Options Component */}
      <SevicesChild />

      {/* Statistics Section Component */}
      <StatisticsSection />

      {/* Testimonials */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-2">Các Gia Đình Hạnh Phúc Nói Về Chúng Tôi</h2>
          <span className="text-[#ff8460] font-medium block mb-10">LỜI CHỨNG THỰC</span>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80" 
                    alt="Lời chứng thực" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -left-8 top-6 w-16 h-16 rounded-full bg-[#ff8460] text-white flex items-center justify-center text-4xl shadow-md">
                  "
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg italic mb-6">
              Vợ chồng tôi muốn cảm ơn các bạn rất nhiều! Vào ngày đầu tiên của tháng này, chúng tôi đã chào đón cô con gái thứ hai xinh đẹp của mình. 
              Ba năm trước, các bạn đã giúp chúng tôi xác định vấn đề ở nam giới! Một lần nữa cảm ơn tất cả các bạn. Cuối cùng, chúng tôi đã trở thành một gia đình hạnh phúc với bốn thành viên.
            </p>
            
            <h3 className="text-2xl font-semibold mt-6">Edward & Janis Mills</h3>
          </div>
        </div>
      </div>

      <Outlet />
      <UserFooter />
    </div>
  );
};

export default UserTemplate;