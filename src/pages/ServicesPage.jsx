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
    id: "egg-donor",
    title: "Egg Donor and Surrogacy",
    description: "At our center we have comprehensive knowledge and experience in the field of egg donor and surrogacy. We have a booming base of 1,000 donors.",
    image: "/images/features/pc4.jpg"
  },
  {
    id: "egg-freezing",
    title: "Egg Freezing / Preservation",
    description: "Fertility preservation in general, and egg freezing in particular, is quickly becoming a more popular procedure for women all over the world each year.",
    image: "/images/features/pc6.jpg"
  },
  {
    id: "gender-selection",
    title: "Gender Selection",
    description: "Sex selection can be done either before or after the fertilisation of the egg. Gender selection is the attempt to control the gender of human offspring.",
    image: "/images/features/iui-vs-ivf.jpg"
  },
  {
    id: "consultation",
    title: "Fertility Consultation",
    description: "Personalized consultations with our fertility specialists to discuss your options and develop a treatment plan.",
    image: "/images/features/pc3.jpg"
  },
  {
    id: "diagnostic-testing",
    title: "Diagnostic Testing",
    description: "Comprehensive testing to identify the causes of infertility and determine the most effective treatment approach.",
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
          alt="Services Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Services</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">HOME</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">SERVICES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2">What We Offer</Title>
            <div className="mt-2">
              <span className="text-[#ff8460] font-medium text-lg">OUR SERVICES</span>
            </div>
          </div>

          {/* First row - 3 services */}
          <Row gutter={[32, 32]} className="mb-16">
            {allServices.slice(0, 3).map((service) => (
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
                    <Link to={`/service/${service.id}`} className="text-[#ff8460] font-medium hover:text-[#ff6b40] inline-block mt-auto">
                      <span className="mr-1">+</span> More Info
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* Second row - 2 services centered */}
          <Row gutter={[32, 32]} justify="center">
            {allServices.slice(3, 5).map((service) => (
              <Col xs={24} md={8} lg={6} key={service.id}>
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
                    <Link to={`/service/${service.id}`} className="text-[#ff8460] font-medium hover:text-[#ff6b40] inline-block mt-auto">
                      <span className="mr-1">+</span> More Info
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
                  <div className="text-sm uppercase">OVER</div>
                  <div className="text-6xl font-bold">1250</div>
                  <div className="text-sm uppercase text-[#ff8460]">Happy Families</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 text-white">
              <h2 className="text-4xl font-bold mb-4">People Recommend Us</h2>
              <div className="text-[#ff8460] font-medium mb-4">WHY CHOOSE US</div>
              <p className="mb-8">
                We provide individualized care and attention for every client during their journey to parenthood. 
                We offer comprehensive testing to determine the causes of male and female infertility, and we 
                specialize in IUI and in IVF.
              </p>
              <Button 
                onClick={() => navigate('/contacts')}
                className="bg-[#ff8460] hover:bg-[#ff6b40] text-white border-none rounded py-3 px-8"
              >
                Contact Us
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