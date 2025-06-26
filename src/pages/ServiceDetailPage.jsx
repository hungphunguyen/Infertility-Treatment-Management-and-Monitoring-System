import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Row, Col, Card, Button, Divider, List, Tag, Space, Spin, Alert } from "antd";
import { CalendarOutlined, CheckCircleOutlined, TeamOutlined, RightCircleOutlined, UserOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { serviceService } from "../service/service.service";
import { doctorService } from "../service/doctor.service";

const { Title, Paragraph, Text } = Typography;

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

// Danh sách lợi ích dựa trên ID dịch vụ
const getBenefitsByServiceId = (serviceId) => {
  const benefitsMap = {
    // IUI - ID 1
    1: [
      "Quy trình đơn giản, ít xâm lấn và không đau",
      "Chi phí thấp hơn so với IVF",
      "Không cần gây mê hay phẫu thuật",
      "Có thể kết hợp với kích thích rụng trứng nhẹ",
      "Thời gian điều trị ngắn, ít ảnh hưởng đến cuộc sống",
      "Tỷ lệ thành công cao với các trường hợp vô sinh nhẹ",
      "Phù hợp với các trường hợp vô sinh do yếu tố cổ tử cung"
    ],
    // IVF - ID 2
    2: [
      "Tỷ lệ thành công cao, đặc biệt với phụ nữ dưới 35 tuổi",
      "Có thể điều trị nhiều nguyên nhân vô sinh khác nhau",
      "Cho phép xét nghiệm di truyền phôi trước khi chuyển",
      "Có thể đông lạnh phôi thừa để sử dụng sau này",
      "Kiểm soát được số lượng phôi chuyển để giảm nguy cơ đa thai",
      "Giải pháp hiệu quả cho các trường hợp tắc ống dẫn trứng",
      "Phù hợp với các trường hợp vô sinh nam nặng"
    ]
  };
  
  return benefitsMap[serviceId] || [
    "Đánh giá toàn diện của tình trạng sinh sản",
    "Tư vấn cá nhân hóa với chuyên gia",
    "Kế hoạch điều trị phù hợp với nhu cầu của bạn",
    "Sử dụng công nghệ và thiết bị hiện đại",
    "Hỗ trợ tâm lý trong suốt quá trình điều trị"
  ];
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [stages, setStages] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [typeDescription, setTypeDescription] = useState("");
  
  // Lấy thông tin dịch vụ và giai đoạn điều trị
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!serviceId) {
        navigate('/services');
        return;
      }
      try {
        setLoading(true);
        // Gọi API mới lấy chi tiết dịch vụ public
        const response = await serviceService.getPublicServiceById(serviceId);
        if (response && response.data && response.data.result) {
          const serviceData = response.data.result;
          setService(serviceData);
          setBenefits(getBenefitsByServiceId(serviceData.serviceId));
          // Giai đoạn điều trị lấy từ serviceData.treatmentStageResponses
          if (Array.isArray(serviceData.treatmentStageResponses)) {
            setStages(serviceData.treatmentStageResponses.sort((a, b) => a.orderIndex - b.orderIndex));
          } else {
            setStages([]);
          }
          // Không cần fetchDoctors ở đây nếu không cần
        } else {
          setError("Không tìm thấy thông tin dịch vụ");
        }
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError(`Lỗi khi tải thông tin dịch vụ: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [serviceId, navigate]);

  // Lấy thông tin loại điều trị từ API dựa vào id của service
  useEffect(() => {
    if (!service || !service.treatmentTypeId) return;
    const fetchType = async () => {
      try {
        const res = await serviceService.getAllTreatmentTypes();
        if (res?.data?.result) {
          const found = res.data.result.find(
            (item) => item.id === service.treatmentTypeId
          );
          setTypeDescription(found?.description || "");
        }
      } catch (error) {
        setTypeDescription("");
      }
    };
    fetchType();
  }, [service]);

  // Lấy danh sách bác sĩ từ API
  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await doctorService.getAllDoctors();
      
      if (response && response.data && response.data.result && Array.isArray(response.data.result)) {
        console.log("Doctors data:", response.data.result);
        
        // Lấy 3 bác sĩ đầu tiên
        const doctorsData = response.data.result.slice(0, 3);
        
        // Map dữ liệu bác sĩ sang định dạng phù hợp
        const mappedDoctors = doctorsData.map(doctor => ({
          id: doctor.id,
          name: doctor.fullName || "Bác sĩ",
          title: doctor.roleName?.description || "Bác sĩ chuyên khoa",
          image: doctor.avatarUrl || "/images/doctors/default-doctor.png",
          specialties: doctor.qualifications ? [doctor.qualifications] : ["Chuyên khoa Sản phụ khoa"],
          experience: `${doctor.experienceYears || 0} năm kinh nghiệm`,
          description: doctor.qualifications || "Chuyên gia điều trị hiếm muộn",
          rating: 4.5,
          value: `dr_${doctor.id}`
        }));
        
        setSpecialists(mappedDoctors);
      } else {
        console.warn("No doctors found or invalid response format");
        setSpecialists([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setSpecialists([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleBookAppointment = () => {
    navigate('/register-service', { 
      state: { 
        selectedService: service.id,
        serviceName: service.name
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <UserHeader />
        <div className="py-16 flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4">Đang tải thông tin dịch vụ...</p>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <UserHeader />
        <div className="py-16 container mx-auto px-4">
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
          <div className="text-center mt-4">
            <Button 
              type="primary" 
              onClick={() => navigate('/services')}
              className="bg-[#ff8460] hover:bg-[#ff6b40] border-none"
            >
              Quay lại trang Dịch Vụ
            </Button>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen">
        <UserHeader />
        <div className="py-16 container mx-auto px-4 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Không tìm thấy dịch vụ</h2>
          </div>
          <Button 
            type="primary" 
            onClick={() => navigate('/services')}
            className="bg-[#ff8460] hover:bg-[#ff6b40] border-none"
          >
            Quay lại trang Dịch Vụ
          </Button>
        </div>
        <UserFooter />
      </div>
    );
  }

  // Chuyển đổi các giai đoạn điều trị để hiển thị
  const treatmentProcess = stages.length > 0 
    ? stages.map(stage => ({
        name: stage.name,
        description: stage.description
      }))
    : [];

  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={getServiceImage(service.treatmentTypeName)} 
          alt={service.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">{service.name}</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">DỊCH VỤ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">{service.name ? service.name.toUpperCase() : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Description Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2">{service.name}</Title>
            <Text className="text-[#ff8460] text-lg">{service.treatmentTypeName}</Text>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Title level={3} className="mb-6">Giới thiệu về {service.name}</Title>
                <Paragraph className="text-gray-700 mb-4">
                  {typeDescription || service.description || "Không có mô tả chi tiết cho dịch vụ này."}
                </Paragraph>

                {treatmentProcess.length > 0 && (
                  <>
                    <Divider />
                    <Title level={4} className="mb-4">Quy trình Điều trị</Title>
                    <List
                      dataSource={treatmentProcess}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Space align="start">
                            <div className="flex items-center justify-center bg-[#ff8460] text-white rounded-full w-6 h-6 font-bold mt-1">
                              {index + 1}
                            </div>
                            <div>
                              <Text strong>{typeof item === 'object' ? item.name : item}</Text>
                              {typeof item === 'object' && item.description && (
                                <div className="ml-1 mt-1 text-gray-600">
                                  <Text>{item.description}</Text>
                                </div>
                              )}
                            </div>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </>
                )}
              </div>
            </Col>

            <Col xs={24} lg={8}>
              {/* Lợi ích */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                <Title level={4} className="mb-4 flex items-center">
                  <CheckCircleOutlined className="mr-2 text-[#ff8460]" />
                  Lợi ích
                </Title>
                <List
                  dataSource={benefits}
                  renderItem={item => (
                    <List.Item>
                      <Space>
                        <CheckCircleOutlined className="text-[#ff8460]" />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>

              {/* Đăng ký dịch vụ */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
                <Title level={4} className="mb-6 flex items-center">
                  <CalendarOutlined className="mr-2 text-[#ff8460]" />
                  Đăng ký dịch vụ
                </Title>
                <Paragraph className="mb-6">
                  Bạn muốn tìm hiểu thêm về {service.name ? service.name.toLowerCase() : ''}? 
                  Đặt lịch tư vấn với một trong những chuyên gia của chúng tôi để thảo luận 
                  về tình huống và nhu cầu cụ thể của bạn.
                </Paragraph>
                <div className="mb-4">
                  <Text strong>Giá dịch vụ: </Text>
                  <Text className="text-[#ff8460] font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                  </Text>
                </div>
                <div className="mb-4">
                  <Text strong>Thời gian điều trị: </Text>
                  <Text>{service.duration} ngày</Text>
                </div>
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

              {/* Tại sao chọn chúng tôi */}
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

      <UserFooter />
    </div>
  );
};

export default ServiceDetailPage;