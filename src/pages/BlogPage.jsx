import React, { useState } from "react";
import { Typography, Card, Row, Col, Tag, Divider, Space, Input, Button } from "antd";
import { ClockCircleOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const blogPosts = [
  {
    id: 1,
    title: "Understanding Infertility and Common Causes",
    shortDescription:
      "Learn about infertility, its causes and factors affecting reproductive capacity.",
    content:
      "Infertility is defined as the inability to conceive after 12 months of regular unprotected intercourse. According to statistics, about 10-15% of couples face infertility issues. Causes can come from both male and female factors, or sometimes a combination of both...",
    author: "Dr. Andrew Smith, MD",
    date: "06/15/2023",
    tags: ["Infertility", "Causes", "Reproductive Health"],
    image: "https://example.com/images/infertility-causes.jpg",
  },
  {
    id: 2,
    title: "The IVF Journey - From Decision to Success",
    shortDescription:
      "Real experience shared by a couple who succeeded with IVF treatment.",
    content:
      "After 5 years of marriage and many failed attempts to conceive naturally, we decided to try In Vitro Fertilization (IVF). This journey wasn't easy, from psychological preparation and financial planning to going through complex medical procedures...",
    author: "Emily & James Wilson",
    date: "08/03/2023",
    tags: ["IVF", "Experience", "Success Story"],
    image: "https://example.com/images/ivf-journey.jpg",
  },
  {
    id: 3,
    title: "Nutrition and Lifestyle for Fertility Enhancement",
    shortDescription:
      "Dietary and lifestyle recommendations to improve fertility.",
    content:
      "Nutrition and lifestyle play a crucial role in improving fertility. Research shows that maintaining a healthy weight, balanced diet with plenty of vegetables, fruits, lean protein and whole grains can enhance egg and sperm quality...",
    author: "Prof. Sarah Johnson, PhD",
    date: "09/22/2023",
    tags: ["Nutrition", "Lifestyle", "Reproductive Health"],
    image: "https://example.com/images/fertility-nutrition.jpg",
  },
  {
    id: 4,
    title: "Understanding IUI and When It's Recommended",
    shortDescription:
      "Detailed explanation of Intrauterine Insemination (IUI) and suitable cases.",
    content:
      "Intrauterine Insemination (IUI) is a relatively simple and less invasive fertility treatment where processed sperm is directly placed into a woman's uterus. This method is often recommended for cases involving cervical factor infertility, mild ovulation disorders...",
    author: "Dr. Robert Thompson, MD",
    date: "11/10/2023",
    tags: ["IUI", "Fertility Treatment", "Reproductive Medicine"],
    image: "https://example.com/images/iui-explained.jpg",
  },
  {
    id: 5,
    title: "Psychological Support During Fertility Treatment",
    shortDescription:
      "The importance of mental health and support methods during fertility treatment.",
    content:
      "Fertility treatment is not only a physical challenge but also significantly affects mental health. Many studies show that stress, anxiety and depression are common among people undergoing fertility treatment. Receiving appropriate psychological support can help improve treatment outcomes...",
    author: "Lisa Parker, MS",
    date: "01/05/2024",
    tags: ["Psychology", "Support", "Stress Management"],
    image: "https://example.com/images/psychological-support.jpg",
  },
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const handleSearch = (value) => {
    if (!value) {
      setFilteredPosts(blogPosts);
      return;
    }

    const filtered = blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(value.toLowerCase()) ||
        post.shortDescription.toLowerCase().includes(value.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  return (
    
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">Blog & Knowledge</Title>
          <Paragraph className="text-lg mt-4">
            Sharing knowledge, experience and useful information about infertility and treatment methods
          </Paragraph>
        </div>

        <div className="mb-8">
          <Search
            placeholder="Search articles..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Divider />

        <Row gutter={[24, 32]}>
          {filteredPosts.map((post) => (
            <Col xs={24} md={12} lg={8} key={post.id}>
              <Card
                hoverable
                cover={
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${post.image})`,
                      backgroundSize: "cover",
                      backgroundColor: "#f0f2f5", // Fallback if image fails
                    }}
                  ></div>
                }
                className="h-full flex flex-col"
              >
                <div className="flex-grow">
                  <Space className="mb-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Tag color="blue" key={tag}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                  <Title level={4}>{post.title}</Title>
                  <Paragraph ellipsis={{ rows: 3 }}>{post.shortDescription}</Paragraph>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Space className="flex justify-between">
                    <Space>
                      <UserOutlined />
                      <Text type="secondary">{post.author}</Text>
                    </Space>
                    <Space>
                      <ClockCircleOutlined />
                      <Text type="secondary">{post.date}</Text>
                    </Space>
                  </Space>
                </div>

                <Button type="primary" className="mt-4 w-full">
                  Read More
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="mt-12 flex justify-center">
          <Button type="primary" size="large">
            View More Articles
          </Button>
        </div>
      </div>
      <UserFooter />
    </div>
    
  );
};

export default BlogPage; 