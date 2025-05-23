import React from 'react';
import { Carousel, Typography, Row, Col, Card, Button, Input, Form, Checkbox, Space, Statistic } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';
import { Outlet } from 'react-router-dom';
import TreatmentOptions from '../components/TreatmentOptions';
import StatisticsSection from '../components/StatisticsSection';
import ServicesIcons from '../components/ServicesIcons';

const { Title, Paragraph, Text } = Typography;

const UserTemplate = () => {
  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Slider */}
      <Carousel autoplay effect="fade" dots={true} autoplaySpeed={5000}>
        <div>
          <div className="relative h-[600px]">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('/images/features/iui-vs-ivf.jpg')" }}
            />
            <div className="absolute inset-0 bg-black opacity-40" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h1 className="text-5xl font-bold text-white mb-6">Your Miracle.<br/>Our Mission.</h1>
                  <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-4 px-8 rounded transition duration-300 ease-in-out text-lg">
                    Make an Appointment
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
                  <h1 className="text-5xl font-bold text-white mb-6">Expert Care.<br/>Happy Families.</h1>
                  <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-4 px-8 rounded transition duration-300 ease-in-out text-lg">
                    Learn About Our Services
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
                  <h1 className="text-5xl font-bold text-white mb-6">Advanced Technology.<br/>Compassionate Care.</h1>
                  <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-4 px-8 rounded transition duration-300 ease-in-out text-lg">
                    Meet Our Specialists
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
              <span className="text-[#ff8460] font-medium">WELCOME THERE!</span>
              <h2 className="text-4xl font-bold mt-2 mb-6">Welcome to<br/>Fertility Center</h2>
              <p className="text-gray-600 text-lg mb-8">
                We provide all medical services that you need. Our goal is to make our clients happy parents. 
                We do it as easy as possible for couples to have a baby, whether it's through the use 
                of egg donation or a gestational carrier.
              </p>
              <button className="bg-[#ff8460] hover:bg-[#ff6b40] text-white font-semibold py-3 px-6 rounded transition duration-300 ease-in-out">
                More About Us
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="rounded-full border-4 border-[#ff8460] p-2 w-64 h-64 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-sm">OVER</span>
                  <div className="text-6xl text-[#ff8460] font-bold">87<span className="text-2xl">%</span></div>
                  <span className="text-gray-400 text-sm">Successful Pregnancies</span>
                </div>
                <div className="absolute -right-12 bottom-4">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                    alt="Doctor" 
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
            <h2 className="text-4xl font-bold mb-2">About Our Center</h2>
            <span className="text-[#ff8460] font-medium">WHO WE ARE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <img 
                src="/images/features/pc3.jpg" 
                alt="Doctor" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-center mb-4">Highly Qualified Specialists</h3>
                <p className="text-center text-gray-600 mb-4">
                  Our kind and compassionate care team includes physicians, nurses, medical assistants and other support staff
                </p>
                <div className="text-center">
                  <button className="text-[#ff8460] font-medium hover:text-[#ff6b40]">
                    <span className="mr-1">+</span> More Info
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <img 
                src="/images/features/pc4.jpg" 
                className="h-56 w-full object-cover"
                alt="Egg Donor"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-center mb-4">The Latest High-Tech Equipment</h3>
                <p className="text-center text-gray-600 mb-4">
                  The center is equipped with high-tech and approved equipment that ensures the best possible cooperation with doctors
                </p>
                <div className="text-center">
                  <button className="text-[#ff8460] font-medium hover:text-[#ff6b40]">
                    <span className="mr-1">+</span> More Info
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <img 
                src="/images/features/pc5.jpg" 
                alt="Baby" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-center mb-4">We Work with All Pathologies</h3>
                <p className="text-center text-gray-600 mb-4">
                  We help people fight against reproductive difficulties, infertility or fertility problems who dream of starting a family
                </p>
                <div className="text-center">
                  <button className="text-[#ff8460] font-medium hover:text-[#ff6b40]">
                    <span className="mr-1">+</span> More Info
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
          <h2 className="text-4xl font-bold text-white mb-2">Book an Appointment today!</h2>
          <p className="text-white mb-8 text-lg">GET A FREE CONSULTATION</p>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded transition duration-300 ease-in-out text-lg">
            Ask a Question
          </button>
        </div>
      </div>

      {/* Treatment Options Component */}
      <TreatmentOptions />

      {/* Statistics Section Component */}
      <StatisticsSection />

      {/* Testimonials */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-2">Happy Families About Us</h2>
          <span className="text-[#ff8460] font-medium block mb-10">TESTIMONIALS</span>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80" 
                    alt="Testimonial" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -left-8 top-6 w-16 h-16 rounded-full bg-[#ff8460] text-white flex items-center justify-center text-4xl shadow-md">
                  "
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg italic mb-6">
              My wife and I want to thank you so much! On the first of this month we had our second beautiful baby girl. 
              Three years ago, you helped pinpoint for us the male issue! Thank you all again. Finally a happy family of four.
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

