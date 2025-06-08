import React, { useState, useEffect, useContext } from "react";
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
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { blogService } from "../../service/blog.service";
import { useSelector } from "react-redux";
import { NotificationContext } from "../../App";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchText, setSearchText] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // create, edit, view
  const [form] = Form.useForm();
  const token = useSelector((state) => state.authSlice);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogsByStatus(statusFilter);
      if (response.data) {
        setBlogs(response.data.result);
        setFilteredData(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showNotification("Không thể tải danh sách bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: "orange", text: "Chờ duyệt" },
      approved: { color: "green", text: "Đã duyệt" },
      rejected: { color: "red", text: "Đã từ chối" }
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

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
  };

  const handleApprove = async (blogId) => {
    try {
      const response = await blogService.approveBlog(blogId, token.token);
      if (response.data) {
        showNotification("Bài viết đã được duyệt thành công!", "success");
        fetchBlogs(); // Refresh danh sách
      }
    } catch (error) {
      console.error("Error approving blog:", error);
      showNotification("Không thể duyệt bài viết", "error");
    }
  };

  const handleReject = async (blogId) => {
    try {
      const response = await blogService.rejectBlog(blogId, token.token);
      if (response.data) {
        showNotification("Bài viết đã bị từ chối!", "success");
        fetchBlogs(); // Refresh danh sách
      }
    } catch (error) {
      console.error("Error rejecting blog:", error);
      showNotification("Không thể từ chối bài viết", "error");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchText.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchText.toLowerCase())
  );

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
              onClick={() => handleViewBlog(record)}
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
            {record.status === "pending" && (
              <>
                <Button 
                  size="small" 
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(record.id)}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  Duyệt
                </Button>
                <Button 
                  size="small" 
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => handleReject(record.id)}
                >
                  Từ chối
                </Button>
              </>
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
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!mb-0">
              Quản Lý Bài Viết
            </Title>
          </div>
        }
        className="shadow-md"
      >
        <div className="mb-4 flex gap-4">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 200 }}
          >
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Đã từ chối</Option>
          </Select>
          <Search
            placeholder="Tìm kiếm theo tiêu đề, tác giả, danh mục..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredBlogs}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Chi tiết bài viết"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBlog && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Tiêu đề</h3>
              <p>{selectedBlog.title}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tóm tắt</h3>
              <p>{selectedBlog.summary}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Nội dung</h3>
              <p className="whitespace-pre-wrap">{selectedBlog.content}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Thông tin khác</h3>
              <p>Tác giả: {selectedBlog.author}</p>
              <p>Danh mục: {selectedBlog.category}</p>
              <p>Tags: {selectedBlog.tags?.join(", ")}</p>
              <p>Trạng thái: {
                selectedBlog.status === "pending" ? "Chờ duyệt" :
                selectedBlog.status === "approved" ? "Đã duyệt" : "Đã từ chối"
              }</p>
            </div>
            {selectedBlog.status === "pending" && (
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    handleApprove(selectedBlog.id);
                    setIsModalVisible(false);
                  }}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  Duyệt
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => {
                    handleReject(selectedBlog.id);
                    setIsModalVisible(false);
                  }}
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogManagement; 