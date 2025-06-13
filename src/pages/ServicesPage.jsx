import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Button, Spin, Empty, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { serviceService } from "../service/service.service";

const { Title, Text } = Typography;

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hàm lấy danh sách dịch vụ
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy danh sách dịch vụ không bị xóa
      const response = await serviceService.getAllNonRemovedServices();
      
      if (response && response.data && response.data.result) {
        // Kiểm tra nếu result là mảng
        if (Array.isArray(response.data.result)) {
          setServices(response.data.result);
        } 
        // Nếu result là object đơn lẻ
        else if (typeof response.data.result === 'object') {
          setServices([response.data.result]);
        }
      } else {
        setServices([]);
        setError("Không tìm thấy dữ liệu dịch vụ từ API");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(`Không thể tải danh sách dịch vụ: ${err.message}`);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={1} className="text-gray-800 mb-2">
              Những Gì Chúng Tôi Cung Cấp
            </Title>
            <div className="mt-2">
              <Text className="text-[#ff8460] font-medium text-lg uppercase">
                DỊCH VỤ CỦA CHÚNG TÔI
              </Text>
            </div>
          </div>

          {/* Services Display */}
          {loading ? (
            <div className="text-center py-10">
              <Spin size="large" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-10">
              <Empty description={error || "Không có dịch vụ nào"} />
              <Button 
                onClick={() => fetchServices()} 
                className="mt-3"
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <>
              
              <Row gutter={[32, 64]} className="justify-center">
                {services.map((service) => (
                  <Col xs={24} md={12} key={service.id}>
                    <div 
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                      onClick={() => navigate(`/service-detail/${service.id}`)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={getServiceImage(service.treatmentTypeName)}
                          alt={service.name}
                          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">{service.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {service.description || "Không có mô tả cho dịch vụ này."}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          {service.price && (
                            <p className="text-[#ff8460] font-medium">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                            </p>
                          )}
                          <span className="inline-flex items-center text-[#ff8460] hover:text-[#ff6b40] font-medium">
                            <PlusOutlined className="mr-1" /> Chi tiết
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      </div>

      {/* Recommendation Section */}
      <div
        className="py-20 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/features/pc9.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex justify-center">
                <div className="w-64 h-64 rounded-full border-4 border-white flex flex-col items-center justify-center text-white">
                  <div className="text-sm uppercase">HƠN</div>
                  <div className="text-6xl font-bold">1250</div>
                  <div className="text-sm uppercase text-[#ff8460]">
                    Gia Đình Hạnh Phúc
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 text-white">
              <h2 className="text-4xl font-bold mb-4">
                Mọi Người Đề Xuất Chúng Tôi
              </h2>
              <div className="text-[#ff8460] font-medium mb-4">
                TẠI SAO CHỌN CHÚNG TÔI
              </div>
              <p className="mb-8">
                Chúng tôi cung cấp sự chăm sóc và quan tâm cá nhân hóa cho mỗi
                khách hàng trong hành trình làm cha mẹ của họ. Chúng tôi cung
                cấp xét nghiệm toàn diện để xác định nguyên nhân vô sinh ở nam
                và nữ, và chúng tôi chuyên về IUI và IVF.
              </p>
              <Button
                onClick={() => navigate("/contacts")}
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

// Hàm lấy hình ảnh dựa trên loại điều trị
const getServiceImage = (treatmentType) => {
  const imageMap = {
    'IUI': '/images/features/pc6.jpg',
    'IVF': '/images/features/pc4.jpg',
    'Diagnostic Testing': '/images/features/pc9.jpg',
    'Embryo Testing': '/images/features/pc11.jpg',
    'Egg Freezing': '/images/features/pc12.jpg',
  };
  
  return imageMap[treatmentType] || '/images/features/pc4.jpg';
};

export default ServicesPage;