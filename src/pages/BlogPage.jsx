import React, { useState } from "react";
import { Typography, Row, Col, Divider, Space, Button, Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph } = Typography;

const blogPosts = [
  {
    id: 1,
    title: "Những Bà Mẹ Hiện Đại: 8 Sự Thật Bất Ngờ",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc5.jpg", 
    slug: "modern-mothers-8-surprising-facts"
  },
  {
    id: 2,
    title: "7 Nguyên Nhân Hàng Đầu Gây Vô Sinh Ở Phụ Nữ",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc4.jpg", 
    slug: "top-7-causes-of-infertility-in-women"
  },
  {
    id: 3,
    title: "IVF hay IVM: Lựa Chọn Nào Phù Hợp Với Bạn?",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc6.jpg", 
    slug: "ivf-or-ivm-which-is-right-for-you"
  },
  {
    id: 4,
    title: "Cách Thực Hiện Xét Nghiệm Thai, Từng Bước",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc3.jpg", 
    slug: "pregnancy-test-step-by-step"
  },
  {
    id: 5,
    title: "Bảo Quản Khả Năng Sinh Sản Cho Phụ Nữ Được Chẩn Đoán Ung Thư",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc9.jpg", 
    slug: "fertility-preservation-for-cancer-patients"
  },
  {
    id: 6,
    title: "Vô Sinh Nam: Sự Thật và Huyền Thoại",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc10.jpg", 
    slug: "male-infertility-facts"
  },
  {
    id: 7,
    title: "Lạc Nội Mạc Tử Cung và Sức Khỏe Sinh Sản",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc11.jpg", 
    slug: "endo-and-fertility-health"
  },
  {
    id: 8,
    title: "Nguy Cơ Đối Với Bệnh Nhân Tiếp Xúc Với Virus Zika",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/pc12.jpg", 
    slug: "zika-virus-risks-for-patients"
  },
  {
    id: 9,
    title: "Lạc Nội Mạc Tử Cung và Thai Kỳ",
    date: "NGÀY 10 THÁNG 11, 2016",
    image: "/images/features/Pc1.jpg", 
    slug: "endometriosis-and-pregnancy"
  }
];

const BlogPage = () => {
  return (
    <div className="min-h-screen">
      <UserHeader />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src="/images/features/pc8.jpg" 
          alt="Băng rôn Blog" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Thai Kỳ</h1>
            <div className="flex items-center justify-center text-white">
              <span className="mx-2">TRANG CHỦ</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">TẤT CẢ BÀI VIẾT</span>
              <span className="mx-2">{'>'}</span>
              <span className="mx-2">THAI KỲ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Row gutter={[32, 60]}>
            {blogPosts.slice(0, 3).map((post) => (
              <Col xs={24} md={8} key={post.id}>
                <Card 
                  hoverable 
                  className="h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  cover={
                    <div className="overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  }
                >
                  <div className="text-center flex-grow">
                    <div className="text-gray-500 text-sm mb-2">{post.date}</div>
                    <Title level={4} className="mb-4">{post.title}</Title>
                  </div>
                  <div className="text-center mt-auto">
                    <Link to={`/blog/${post.slug}`}>
                      <Button 
                        type="text" 
                        icon={<RightOutlined className="bg-[#ff8460] text-white rounded-full p-1 mr-2" />}
                        className="text-[#ff8460] hover:text-[#ff6b40]"
                      >
                        Thông Tin Thêm
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          
          <Divider className="my-12" />
          
          <Row gutter={[32, 60]}>
            {blogPosts.slice(3, 6).map((post) => (
              <Col xs={24} md={8} key={post.id}>
                <Card 
                  hoverable 
                  className="h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  cover={
                    <div className="overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  }
                >
                  <div className="text-center flex-grow">
                    <div className="text-gray-500 text-sm mb-2">{post.date}</div>
                    <Title level={4} className="mb-4">{post.title}</Title>
                  </div>
                  <div className="text-center mt-auto">
                    <Link to={`/blog/${post.slug}`}>
                      <Button 
                        type="text" 
                        icon={<RightOutlined className="bg-[#ff8460] text-white rounded-full p-1 mr-2" />}
                        className="text-[#ff8460] hover:text-[#ff6b40]"
                      >
                        Thông Tin Thêm
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          
          <Divider className="my-12" />
          
          <Row gutter={[32, 60]}>
            {blogPosts.slice(6, 9).map((post) => (
              <Col xs={24} md={8} key={post.id}>
                <Card 
                  hoverable 
                  className="h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  cover={
                    <div className="overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  }
                >
                  <div className="text-center flex-grow">
                    <div className="text-gray-500 text-sm mb-2">{post.date}</div>
                    <Title level={4} className="mb-4">{post.title}</Title>
                  </div>
                  <div className="text-center mt-auto">
                    <Link to={`/blog/${post.slug}`}>
                      <Button 
                        type="text" 
                        icon={<RightOutlined className="bg-[#ff8460] text-white rounded-full p-1 mr-2" />}
                        className="text-[#ff8460] hover:text-[#ff6b40]"
                      >
                        Thông Tin Thêm
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      
      <UserFooter />
    </div>
  );
};

export default BlogPage;