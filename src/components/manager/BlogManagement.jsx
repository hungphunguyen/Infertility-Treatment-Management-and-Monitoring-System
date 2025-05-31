import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Select,
  Input,
  Modal,
  Form,
  message,
  Row,
  Col,
  Popconfirm,
  Image,
  Upload,
  Switch,
  Descriptions,
  Avatar
} from "antd";
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  UserOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([
    {
      key: 1,
      id: "BLOG001",
      title: "Những Bà Mẹ Hiện Đại: 8 Sự Thật Bất Ngờ",
      content: "Khám phá những thay đổi hấp dẫn trong vai trò làm mẹ hiện đại và cách các bà mẹ ngày nay trải qua hành trình mang thai khác biệt so với các thế hệ trước...",
      summary: "Những thay đổi trong vai trò làm mẹ hiện đại",
      category: "Thai Kỳ",
      author: "TS. Sarah Johnson",
      status: "published",
      featured: true,
      views: 1250,
      tags: ["Làm Mẹ", "Thai Kỳ", "Sức Khỏe Phụ Nữ"],
      image: "/images/blog/blog1.jpg",
      publishDate: "2024-01-15",
      createdDate: "2024-01-10"
    },
    {
      key: 2,
      id: "BLOG002",
      title: "7 Nguyên Nhân Hàng Đầu Gây Vô Sinh Ở Phụ Nữ",
      content: "Vô sinh là một vấn đề phức tạp có thể xuất phát từ nhiều nguyên nhân khác nhau. Hiểu rõ các nguyên nhân này giúp định hướng điều trị hiệu quả...",
      summary: "Tìm hiểu các nguyên nhân chính gây vô sinh ở phụ nữ",
      category: "Vô Sinh",
      author: "BS. Nguyễn Văn A",
      status: "draft", 
      featured: false,
      views: 890,
      tags: ["Vô Sinh", "Phụ Nữ", "Điều Trị"],
      image: "/images/blog/blog2.jpg",
      publishDate: null,
      createdDate: "2024-01-12"
    },
    {
      key: 3,
      id: "BLOG003",
      title: "IVF hay IVM: Lựa Chọn Nào Phù Hợp Với Bạn?",
      content: "So sánh chi tiết giữa IVF và IVM, hai phương pháp hỗ trợ sinh sản phổ biến nhất hiện nay...",
      summary: "So sánh IVF và IVM để lựa chọn phù hợp",
      category: "Hỗ Trợ Sinh Sản",
      author: "ThS. Lê Thị B",
      status: "published",
      featured: true,
      views: 2100,
      tags: ["IVF", "IVM", "Hỗ Trợ Sinh Sản"],
      image: "/images/blog/blog3.jpg",
      publishDate: "2024-01-20",
      createdDate: "2024-01-18"
    }
  ]);

  const [filteredData, setFilteredData] = useState(blogs);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // create, edit, view
  const [form] = Form.useForm();

  // Filter blogs
  React.useEffect(() => {
    let filtered = blogs;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.author.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [statusFilter, searchText, blogs]);

  const getStatusTag = (status) => {
    const statusMap = {
      published: { color: "green", text: "Đã xuất bản" },
      draft: { color: "orange", text: "Bản nháp" },
      archived: { color: "red", text: "Đã lưu trữ" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const createBlog = () => {
    setSelectedBlog(null);
    setModalType("create");
    form.resetFields();
    setIsModalVisible(true);
  };

  const editBlog = (blog) => {
    setSelectedBlog(blog);
    setModalType("edit");
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
      summary: blog.summary,
      category: blog.category,
      author: blog.author,
      status: blog.status,
      featured: blog.featured,
      tags: blog.tags.join(", ")
    });
    setIsModalVisible(true);
  };

  const viewBlog = (blog) => {
    setSelectedBlog(blog);
    setModalType("view");
    setIsModalVisible(true);
  };

  const deleteBlog = (blogId) => {
    setBlogs(prev => prev.filter(blog => blog.id !== blogId));
    message.success("Bài viết đã được xóa!");
  };

  const toggleFeatured = (blogId) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { ...blog, featured: !blog.featured }
        : blog
    ));
    message.success("Trạng thái nổi bật đã được cập nhật!");
  };

  const publishBlog = (blogId) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === blogId 
        ? { 
            ...blog, 
            status: "published",
            publishDate: new Date().toISOString().split('T')[0]
          }
        : blog
    ));
    message.success("Bài viết đã được xuất bản!");
  };

  const handleSubmit = (values) => {
    const blogData = {
      ...values,
      id: modalType === "create" ? `BLOG${String(blogs.length + 1).padStart(3, '0')}` : selectedBlog.id,
      key: modalType === "create" ? Date.now() : selectedBlog.key,
      tags: values.tags.split(",").map(tag => tag.trim()),
      views: modalType === "create" ? 0 : selectedBlog.views,
      image: "/images/blog/default.jpg",
      createdDate: modalType === "create" ? new Date().toISOString().split('T')[0] : selectedBlog.createdDate,
      publishDate: values.status === "published" ? new Date().toISOString().split('T')[0] : null
    };

    if (modalType === "create") {
      setBlogs(prev => [...prev, blogData]);
      message.success("Bài viết mới đã được tạo!");
    } else {
      setBlogs(prev => prev.map(blog => 
        blog.id === selectedBlog.id ? { ...blog, ...blogData } : blog
      ));
      message.success("Bài viết đã được cập nhật!");
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image 
          width={60} 
          height={40} 
          src={image} 
          fallback="/images/default-blog.jpg"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      )
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">ID: {record.id}</div>
          {record.featured && <Tag color="gold" size="small">Nổi bật</Tag>}
        </div>
      )
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      render: (author) => (
        <div className="flex items-center">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
          {author}
        </div>
      )
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      render: (views) => views.toLocaleString('vi-VN')
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => viewBlog(record)}
            >
              Xem
            </Button>
            <Button 
              size="small" 
              type="primary"
              icon={<EditOutlined />}
              onClick={() => editBlog(record)}
            >
              Sửa
            </Button>
          </Space>
          <Space>
            {record.status === "draft" && (
              <Button 
                size="small" 
                type="primary"
                onClick={() => publishBlog(record.id)}
              >
                Xuất bản
              </Button>
            )}
            <Button 
              size="small" 
              onClick={() => toggleFeatured(record.id)}
            >
              {record.featured ? "Bỏ nổi bật" : "Đặt nổi bật"}
            </Button>
            <Popconfirm
              title="Xác nhận xóa bài viết"
              description="Bạn có chắc chắn muốn xóa bài viết này?"
              onConfirm={() => deleteBlog(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button 
                size="small" 
                danger
                icon={<DeleteOutlined />}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Filters */}
      <Card className="mb-6 shadow-md">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="published">Đã xuất bản</Option>
              <Option value="draft">Bản nháp</Option>
              <Option value="archived">Đã lưu trữ</Option>
            </Select>
          </Col>
          <Col span={10}>
            <Search
              placeholder="Tìm kiếm tiêu đề, tác giả, danh mục..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col span={8} className="text-right">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="large"
              onClick={createBlog}
            >
              Tạo Bài Viết Mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Blogs Table */}
      <Card title="Danh Sách Bài Viết" className="shadow-md">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={
          modalType === "create" ? "Tạo Bài Viết Mới" :
          modalType === "edit" ? "Chỉnh Sửa Bài Viết" : "Chi Tiết Bài Viết"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={modalType === "view" ? [
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ] : [
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {modalType === "create" ? "Tạo Bài Viết" : "Cập Nhật"}
          </Button>
        ]}
        width={800}
      >
        {modalType === "view" && selectedBlog && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{selectedBlog.id}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{selectedBlog.title}</Descriptions.Item>
            <Descriptions.Item label="Tóm tắt">{selectedBlog.summary}</Descriptions.Item>
            <Descriptions.Item label="Tác giả">{selectedBlog.author}</Descriptions.Item>
            <Descriptions.Item label="Danh mục">{selectedBlog.category}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(selectedBlog.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Nổi bật">
              <Tag color={selectedBlog.featured ? "gold" : "default"}>
                {selectedBlog.featured ? "Có" : "Không"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lượt xem">
              {selectedBlog.views.toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Tags">
              {selectedBlog.tags.map(tag => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(selectedBlog.createdDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            {selectedBlog.publishDate && (
              <Descriptions.Item label="Ngày xuất bản">
                {dayjs(selectedBlog.publishDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}

        {(modalType === "create" || modalType === "edit") && (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Tiêu đề bài viết"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="summary"
              label="Tóm tắt"
              rules={[{ required: true, message: "Vui lòng nhập tóm tắt!" }]}
            >
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <TextArea rows={8} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="author"
                  label="Tác giả"
                  rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                >
                  <Select size="large">
                    <Option value="draft">Bản nháp</Option>
                    <Option value="published">Xuất bản</Option>
                    <Option value="archived">Lưu trữ</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="featured"
                  label="Nổi bật"
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="tags"
              label="Tags (phân cách bằng dấu phẩy)"
            >
              <Input size="large" placeholder="VD: IVF, Thai kỳ, Sức khỏe" />
            </Form.Item>

            <Form.Item label="Hình ảnh đại diện">
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default BlogManagement; 