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
          alt="Hero Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">About Center</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">HOME</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">ABOUT</span>
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
                <span className="text-[#ff8460] font-medium">INTRODUCTION</span>
                <h2 className="text-4xl font-bold mt-2 mb-6">Fertility<br/>Support Center</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Our Fertility Support Center was established in 2010 with the mission to bring 
                  happiness to families who are experiencing difficulties in having children.
                  With over 10 years of experience, we have helped thousands of couples fulfill their 
                  dream of becoming parents through the application of the most advanced fertility treatment techniques.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4">
                      <ArrowRightOutlined />
                    </div>
                    <span>In Vitro Fertilization (IVF)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4">
                      <ArrowRightOutlined />
                    </div>
                    <span>Fertility Preservation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4">
                      <ArrowRightOutlined />
                    </div>
                    <span>Testing and Diagnosis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#ff8460] rounded-full w-8 h-8 flex items-center justify-center text-white mr-4">
                      <ArrowRightOutlined />
                    </div>
                    <span>Genetic Testing</span>
                  </div>
                </div>
                
                <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-6 rounded transition duration-300 ease-in-out">
                  Learn More
                </button>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="relative">
                <img 
                  src="/images/features/pc5.jpg" 
                  alt="Mother and baby" 
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
            <h2 className="text-4xl font-bold mb-2">Our Achievements</h2>
            <span className="text-[#ff8460] font-medium">WHO WE ARE</span>
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
                    <p className="text-gray-500">Success rate</p>
                    <p className="font-semibold">Successful Pregnancies</p>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="/images/features/pc4.jpg" 
                  alt="Happy couple" 
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
                    <p className="text-gray-500">Success rate</p>
                    <p className="font-semibold">Successful Surrogacy</p>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="/images/features/pc6.jpg" 
                  alt="Mother and baby" 
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
            <h2 className="text-4xl font-bold text-white mb-2">Expert Team</h2>
            <span className="text-white font-medium">OUR DOCTORS</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img 
                    src="/images/features/pc3.jpg" 
                    alt="Male Doctor" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <h3 className="text-2xl font-bold mb-2">Dr. Andrew Cruise</h3>
                  <p className="text-gray-500 uppercase mb-4">REPRODUCTIVE ENDOCRINOLOGY AND INFERTILITY</p>
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
                    alt="Female Doctor" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <h3 className="text-2xl font-bold mb-2">Dr. Anne William</h3>
                  <p className="text-gray-500 uppercase mb-4">REPRODUCTIVE ENDOCRINOLOGY AND INFERTILITY</p>
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
              View More
            </button>
          </div>
        </div>
      </div>

      {/* Areas of Practice - Title */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">Areas of Practice</h2>
            <span className="text-[#ff8460] font-medium">HOW WE HELP</span>
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
              View More Services
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src="/images/features/pc7.jpg" 
          alt="Appointment Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Book an Appointment today!</h2>
            <p className="text-white mb-8 text-lg">GET A FREE CONSULTATION</p>
            <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-8 rounded transition duration-300 ease-in-out text-lg">
              Ask a Question
            </button>
          </div>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default AboutCenterPage;