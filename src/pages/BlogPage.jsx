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
    title: "Hiểu về hiếm muộn và các nguyên nhân phổ biến",
    shortDescription:
      "Tìm hiểu về hiếm muộn, nguyên nhân và các yếu tố ảnh hưởng đến khả năng sinh sản.",
    content:
      "Hiếm muộn được định nghĩa là tình trạng không thể mang thai sau 12 tháng quan hệ đều đặn không sử dụng biện pháp tránh thai. Theo thống kê, khoảng 10-15% các cặp vợ chồng gặp vấn đề về hiếm muộn. Nguyên nhân có thể đến từ cả hai phía nam và nữ, hoặc đôi khi là sự kết hợp của cả hai...",
    author: "TS. BS. Nguyễn Văn A",
    date: "15/06/2023",
    tags: ["Hiếm muộn", "Nguyên nhân", "Sức khỏe sinh sản"],
    image: "https://example.com/images/infertility-causes.jpg",
  },
  {
    id: 2,
    title: "Hành trình IVF - Từ quyết định đến thành công",
    shortDescription:
      "Chia sẻ kinh nghiệm thực tế từ một cặp vợ chồng đã thành công với phương pháp IVF.",
    content:
      "Sau 5 năm kết hôn và nhiều lần thất bại trong việc có con tự nhiên, chúng tôi quyết định thử phương pháp thụ tinh trong ống nghiệm (IVF). Hành trình này không hề dễ dàng, từ việc chuẩn bị tâm lý, tài chính đến trải qua các quy trình y tế phức tạp...",
    author: "Nguyễn Thị B & Trần Văn C",
    date: "03/08/2023",
    tags: ["IVF", "Kinh nghiệm", "Thành công"],
    image: "https://example.com/images/ivf-journey.jpg",
  },
  {
    id: 3,
    title: "Dinh dưỡng và lối sống tốt cho người hiếm muộn",
    shortDescription:
      "Những lời khuyên về chế độ ăn uống và lối sống giúp cải thiện khả năng sinh sản.",
    content:
      "Dinh dưỡng và lối sống đóng vai trò quan trọng trong việc cải thiện khả năng sinh sản. Nghiên cứu cho thấy việc duy trì cân nặng hợp lý, ăn uống cân bằng với nhiều rau xanh, trái cây, protein nạc và ngũ cốc nguyên hạt có thể cải thiện chất lượng trứng và tinh trùng...",
    author: "PGS. TS. Lê Thị D",
    date: "22/09/2023",
    tags: ["Dinh dưỡng", "Lối sống", "Sức khỏe sinh sản"],
    image: "https://example.com/images/fertility-nutrition.jpg",
  },
  {
    id: 4,
    title: "Hiểu về phương pháp IUI và khi nào nên áp dụng",
    shortDescription:
      "Giải thích chi tiết về phương pháp thụ tinh trong tử cung (IUI) và các trường hợp phù hợp.",
    content:
      "Thụ tinh trong tử cung (IUI) là phương pháp hỗ trợ sinh sản tương đối đơn giản và ít xâm lấn, trong đó tinh trùng được xử lý và đưa trực tiếp vào tử cung của người phụ nữ. Phương pháp này thường được khuyến nghị cho các trường hợp vô sinh do yếu tố cổ tử cung, rối loạn phóng noãn nhẹ...",
    author: "TS. BS. Phạm Văn E",
    date: "10/11/2023",
    tags: ["IUI", "Hỗ trợ sinh sản", "Điều trị hiếm muộn"],
    image: "https://example.com/images/iui-explained.jpg",
  },
  {
    id: 5,
    title: "Hỗ trợ tâm lý cho người điều trị hiếm muộn",
    shortDescription:
      "Tầm quan trọng của sức khỏe tâm lý và các phương pháp hỗ trợ trong quá trình điều trị hiếm muộn.",
    content:
      "Điều trị hiếm muộn không chỉ là thách thức về mặt thể chất mà còn ảnh hưởng lớn đến sức khỏe tâm lý. Nhiều nghiên cứu cho thấy stress, lo âu và trầm cảm phổ biến ở những người đang điều trị hiếm muộn. Việc nhận được hỗ trợ tâm lý thích hợp có thể giúp cải thiện kết quả điều trị...",
    author: "ThS. Trịnh Thị F",
    date: "05/01/2024",
    tags: ["Tâm lý", "Hỗ trợ", "Stress"],
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
          <Title level={1} className="text-3xl">Blog & Kiến Thức</Title>
          <Paragraph className="text-lg mt-4">
            Chia sẻ kiến thức, kinh nghiệm và thông tin hữu ích về hiếm muộn và các phương pháp điều trị
          </Paragraph>
        </div>

        <div className="mb-8">
          <Search
            placeholder="Tìm kiếm bài viết..."
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
                  Đọc thêm
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="mt-12 flex justify-center">
          <Button type="primary" size="large">
            Xem thêm bài viết
          </Button>
        </div>
      </div>
      <UserFooter />
    </div>
    
  );
};

export default BlogPage; 