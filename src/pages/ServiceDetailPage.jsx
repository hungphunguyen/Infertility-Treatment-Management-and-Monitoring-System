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
    title: "Egg Donor and Surrogacy",
    subTitle: "Building families through donation and surrogacy",
    heroImage: "/images/features/pc4.jpg",
    description: [
      "Egg donation is a process where a woman donates her eggs to another woman to help her conceive. This is often used when the intended mother has poor egg quality, advanced maternal age, or genetic concerns.",
      "Surrogacy is an arrangement where a woman (the surrogate) carries and delivers a baby for another person or couple. Gestational surrogacy uses an embryo created with the intended parents' genetic material or donor eggs/sperm."
    ],
    benefits: [
      "Access to our database of over 1,000 screened donors",
      "Comprehensive medical and psychological screening",
      "Legal support throughout the process",
      "High success rates with advanced laboratory techniques",
      "Personalized matching services for intended parents"
    ],
    process: [
      "Initial consultation and evaluation",
      "Selection of egg donor or surrogate from our database",
      "Medical screening and synchronization of cycles",
      "Egg retrieval from donor or IVF procedure",
      "Embryo transfer to intended mother or surrogate",
      "Pregnancy monitoring and support"
    ],
    specialists: [1, 2, 4]
  },
  "egg-freezing": {
    id: "egg-freezing",
    title: "Egg Freezing / Preservation",
    subTitle: "Preserve your fertility for the future",
    heroImage: "/images/features/pc6.jpg",
    description: [
      "Egg freezing (oocyte cryopreservation) is a method used to preserve reproductive potential in women. Eggs are harvested from the ovaries, frozen unfertilized, and stored for later use.",
      "This procedure provides an opportunity for women to delay childbearing for medical or personal reasons, such as cancer treatment, advancing age, or not having found the right partner."
    ],
    benefits: [
      "Preserve younger, healthier eggs for future use",
      "Flexibility in family planning timeline",
      "Option to preserve fertility before medical treatments",
      "Reduced anxiety about age-related fertility decline",
      "Advanced vitrification techniques with high success rates"
    ],
    process: [
      "Initial fertility assessment and testing",
      "Ovarian stimulation with hormone injections",
      "Monitoring follicle development via ultrasound",
      "Egg retrieval procedure under light sedation",
      "Laboratory vitrification (flash-freezing) of eggs",
      "Long-term storage of frozen eggs"
    ],
    specialists: [2, 3, 4]
  },
  "gender-selection": {
    id: "gender-selection",
    title: "Gender Selection",
    subTitle: "Family balancing through advanced genetic testing",
    heroImage: "/images/features/iui-vs-ivf.jpg",
    description: [
      "Gender selection is a scientific method that allows parents to choose the gender of their child before pregnancy. This is typically performed using Preimplantation Genetic Testing (PGT) during IVF.",
      "This option may be chosen for family balancing or to prevent gender-linked genetic disorders from being passed to children."
    ],
    benefits: [
      "High accuracy rate (over 99%) for gender determination",
      "Option for family balancing",
      "Prevention of gender-linked genetic disorders",
      "Combined with comprehensive genetic screening",
      "Performed by experienced embryologists"
    ],
    process: [
      "Initial consultation and genetic counseling",
      "IVF procedure to create embryos",
      "Embryo biopsy on day 5-6 of development",
      "PGT analysis to determine gender and genetic health",
      "Selection of embryos of desired gender",
      "Embryo transfer and pregnancy monitoring"
    ],
    specialists: [1, 3]
  },
  "consultation": {
    id: "consultation",
    title: "Fertility Consultation",
    subTitle: "Expert guidance for your fertility journey",
    heroImage: "/images/features/pc3.jpg",
    description: [
      "Our fertility consultations provide comprehensive evaluation and personalized advice from experienced reproductive specialists. We take time to understand your unique situation and medical history.",
      "During your consultation, our specialists will discuss your reproductive goals, conduct necessary testing, and develop a customized treatment plan tailored to your specific needs and circumstances."
    ],
    benefits: [
      "One-on-one attention from board-certified specialists",
      "Comprehensive fertility assessment",
      "Customized treatment planning",
      "Education about all available options",
      "Emotional and psychological support"
    ],
    process: [
      "Complete medical history review",
      "Physical examination and diagnostic tests",
      "Discussion of test results and diagnosis",
      "Explanation of treatment options",
      "Development of personalized treatment plan",
      "Ongoing support throughout your fertility journey"
    ],
    specialists: [1, 2, 4]
  },
  "diagnostic-testing": {
    id: "diagnostic-testing",
    title: "Diagnostic Testing",
    subTitle: "Advanced diagnostics to identify fertility challenges",
    heroImage: "/images/features/pc9.jpg",
    description: [
      "Our comprehensive fertility diagnostic testing utilizes state-of-the-art technology to identify the root causes of infertility. We offer a complete range of diagnostic procedures for both men and women.",
      "Early and accurate diagnosis is crucial for developing effective treatment plans. Our testing protocols are designed to be thorough while minimizing discomfort and inconvenience for our patients."
    ],
    benefits: [
      "Comprehensive evaluation of both partners",
      "State-of-the-art laboratory equipment",
      "Rapid results with detailed explanation",
      "Testing protocols based on latest research",
      "Identification of often overlooked fertility factors"
    ],
    process: [
      "Initial consultation to determine necessary tests",
      "Hormone level assessment",
      "Ultrasound evaluation of reproductive organs",
      "Hysterosalpingogram (HSG) to check fallopian tubes",
      "Semen analysis for male factor assessment",
      "Genetic testing when indicated"
    ],
    specialists: [2, 3]
  }
};

// Doctor data
const doctors = [
  {
    id: 1,
    name: "Dr. Andrew Peterson",
    title: "Reproductive Endocrinologist",
    image: "/images/features/pc10.jpg",
    specialties: ["IVF", "Egg Donation", "Gender Selection"],
    experience: "15+ years experience",
    description: "Dr. Peterson leads our reproductive endocrinology team with expertise in complex fertility cases and advanced reproductive technologies."
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    title: "Fertility Specialist",
    image: "/images/features/pc11.jpg",
    specialties: ["Egg Freezing", "Fertility Preservation", "PCOS Treatment"],
    experience: "12 years experience",
    description: "Dr. Johnson specializes in fertility preservation options for women facing medical treatments or delaying childbearing."
  },
  {
    id: 3,
    name: "Dr. Michael Brown",
    title: "Embryologist",
    image: "/images/features/pc12.jpg",
    specialties: ["PGT Testing", "Embryo Culture", "Vitrification"],
    experience: "10 years experience",
    description: "Dr. Brown oversees our state-of-the-art embryology laboratory, ensuring optimal conditions for embryo development."
  },
  {
    id: 4,
    name: "Dr. Emily Roberts",
    title: "Reproductive Surgeon",
    image: "/images/features/Pc1.jpg",
    specialties: ["Egg Retrieval", "Minimally Invasive Surgery", "Reproductive Anatomy"],
    experience: "14 years experience",
    description: "Dr. Roberts is highly skilled in minimally invasive surgical procedures related to fertility treatment."
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
    return <div>Loading...</div>;
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
              <span className="mx-2">HOME</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">SERVICES</span>
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
                <Title level={3} className="mb-6">About {service.title}</Title>
                {service.description.map((paragraph, index) => (
                  <Paragraph key={index} className="text-gray-700 mb-4">
                    {paragraph}
                  </Paragraph>
                ))}

                <Divider />

                <Title level={4} className="mb-4">Benefits</Title>
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

                <Title level={4} className="mb-4">Treatment Process</Title>
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
                  Schedule a Consultation
                </Title>
                <Paragraph className="mb-6">
                  Interested in learning more about {service.title.toLowerCase()}? 
                  Schedule a consultation with one of our specialists to discuss 
                  your specific situation and needs.
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  onClick={handleBookAppointment}
                  className="bg-[#ff8460] hover:bg-[#ff6b40] border-none"
                >
                  Book an Appointment
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <Title level={4} className="mb-4 flex items-center">
                  <TeamOutlined className="mr-2 text-[#ff8460]" />
                  Why Choose Us
                </Title>
                <List
                  dataSource={[
                    "Experienced specialists with proven success rates",
                    "State-of-the-art facilities and technology",
                    "Personalized treatment plans for each patient",
                    "Comprehensive support throughout your journey",
                    "Transparent pricing and financing options"
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
            <Title level={2}>Our Specialists</Title>
            <Text className="text-lg">Meet our experts in {service.title.toLowerCase()}</Text>
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
                    Book with {doctor.name.split(' ')[0]}
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
          <Title level={2} className="mb-4">Ready to Take the Next Step?</Title>
          <Paragraph className="text-lg mb-8 max-w-2xl mx-auto">
            Our team is ready to help you on your fertility journey. 
            Contact us today to learn more about {service.title.toLowerCase()} 
            and how we can assist you in achieving your dream of parenthood.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              onClick={handleBookAppointment}
              className="bg-[#ff8460] hover:bg-[#ff6b40] border-none"
            >
              Schedule a Consultation
            </Button>
            <Button 
              size="large"
              onClick={() => navigate('/contacts')}
            >
              Contact Us
            </Button>
          </Space>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default ServiceDetailPage; 