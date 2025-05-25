import React from "react";
import { Typography, Button, Row, Col, Space } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import ServicesIcons from "../components/ServicesIcons";

const { Title, Paragraph } = Typography;

const AboutCenterPage = () => {
  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src="/images/features/pc7.jpg" 
          alt="Băng rôn Giới thiệu" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Giới thiệu Trung tâm</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">GIỚI THIỆU</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="py-20">
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
                  <div className="flex items-center">
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4">
                      <ArrowRightOutlined />
                    </div>
                    <span>Thụ tinh trong ống nghiệm (IVF)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4">
                      <ArrowRightOutlined />
                    </div>
                    <span>Bảo quản khả năng sinh sản</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4">
                      <ArrowRightOutlined />
                    </div>
                    <span>Xét nghiệm và Chẩn đoán</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4">
                      <ArrowRightOutlined />
                    </div>
                    <span>Xét nghiệm Di truyền</span>
                  </div>
                </div>
                
                <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-6 rounded transition duration-300 ease-in-out">
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
      <div className="py-20 bg-gray-50">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img 
                    src="/images/features/pc3.jpg" 
                    alt="Bác sĩ Nam" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <h3 className="text-2xl font-bold mb-2">Bác sĩ Andrew Cruise</h3>
                  <p className="text-gray-500 uppercase mb-4">NỘI TIẾT SINH SẢN VÀ VÔ SINH</p>
                  <div className="flex space-x-2 mt-6">
                    <a href="#" className="bg-[#c2da5c] rounded-full w-8 h-8 flex items-center justify-center text-white">f</a>
                    <a href="#" className="bg-[#c2da5c] rounded-full w-8 h-8 flex items-center justify-center text-white">x</a>
                    <a href="#" className="bg-[#c2da5c] rounded-full w-8 h-8 flex items-center justify-center text-white">in</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img 
                    src="/images/features/iui-vs-ivf.jpg" 
                    alt="Bác sĩ Nữ" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <h3 className="text-2xl font-bold mb-2">Bác sĩ Anne William</h3>
                  <p className="text-gray-500 uppercase mb-4">NỘI TIẾT SINH SẢN VÀ VÔ SINH</p>
                  <div className="flex space-x-2 mt-6">
                    <a href="#" className="bg-[#c2da5c] rounded-full w-8 h-8 flex items-center justify-center text-white">f</a>
                    <a href="#" className="bg-[#c2da5c] rounded-full w-8 h-8 flex items-center justify-center text-white">x</a>
                    <a href="#" className="bg-[#c2da5c] rounded-full w-8 h-8 flex items-center justify-center text-white">in</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded transition duration-300 ease-in-out">
              Xem Thêm
            </button>
          </div>
        </div>
      </div>

      {/* Areas of Practice - Title */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">Lĩnh vực Hoạt động</h2>
            <span className="text-[#ff8460] font-medium">CHÚNG TÔI HỖ TRỢ NHƯ THẾ NÀO</span>
          </div>
        </div>
      </div>
      
      {/* Services Icons - Full Width */}
      <ServicesIcons />
      
      {/* View More Button */}
      <div className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-6 rounded transition duration-300 ease-in-out">
              Xem Thêm Dịch vụ
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src="/images/features/pc7.jpg" 
          alt="Băng rôn Đặt lịch" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Đặt lịch hẹn ngay hôm nay!</h2>
            <p className="text-white mb-8 text-lg">NHẬN TƯ VẤN MIỄN PHÍ</p>
            <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-8 rounded transition duration-300 ease-in-out text-lg">
              Đặt câu hỏi
            </button>
          </div>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default AboutCenterPage;