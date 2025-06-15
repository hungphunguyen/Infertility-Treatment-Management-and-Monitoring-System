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
  Popconfirm,
  Image,
  Avatar,
} from "antd";
import { 
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  PlusOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { blogService } from "../../service/blog.service";
import { useSelector } from "react-redux";
import { NotificationContext } from "../../App";
import { authService } from "../../service/auth.service";

const { Title } = Typography;
const { Option = Select.Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const statusMap = {
  PENDING_REVIEW: { color: "orange", text: "Chờ duyệt" },
  APPROVED: { color: "green", text: "Đã duyệt" },
  REJECTED: { color: "red", text: "Đã từ chối" },
  DRAFT: { color: "blue", text: "Bản nháp" },
  hidden: { color: "red", text: "Đã ẩn" },
  all: { color: "default", text: "Tất cả" },
};

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // create, edit, view
  const [form] = Form.useForm();
  const token = useSelector((state) => state.authSlice);
  const { showNotification } = useContext(NotificationContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (token?.token) {
          const response = await authService.getMyInfo(token.token);
          setCurrentUser(response.data.result);
        }
      } catch (error) {
        console.error("Error loading user info:", error);
        showNotification("Không thể tải thông tin người dùng", "error");
      }
    };
    loadUserInfo();
  }, [token, showNotification]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs();
      if (response.data) {
        setBlogs(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showNotification("Không thể tải danh sách bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = blogs.filter(blog => {
      const matchesStatus = statusFilter === "all" ? true : blog.status === statusFilter;
      const matchesSearch = blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          blog.authorName.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setFilteredData(filtered);
  }, [blogs, statusFilter, searchText]);

  const getStatusTag = (status) => {
    const statusInfo = statusMap[status];
    if (statusInfo) {
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    } else {
      return <Tag>Không xác định</Tag>;
    }
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
      sourceReference: blog.sourceReference,
      featured: blog.featured || false, // Ensure featured is set
    });
    setIsModalVisible(true);
  };

  const viewBlog = (blog) => {
    setSelectedBlog(blog);
    setModalType("view");
    setIsModalVisible(true);
  };

  const toggleFeatured = async (blogId, currentFeatured) => {
    try {
      // Assuming an updateBlog API for updating featured status
      // Note: selectedBlog might be null here if not explicitly selected from table
      const blogToUpdate = blogs.find(b => b.id === blogId);
      if (!blogToUpdate) {
        showNotification("Không tìm thấy bài viết để cập nhật trạng thái nổi bật.", "error");
        return;
      }
      const updatedBlogData = {
        ...blogToUpdate,
        featured: !currentFeatured
      };
      await blogService.updateBlog(blogId, currentUser.id, updatedBlogData, token.token); 
      showNotification("Trạng thái nổi bật đã được cập nhật!", "success");
      fetchBlogs();
    } catch (error) {
      console.error("Error updating featured status:", error);
      showNotification("Cập nhật trạng thái nổi bật thất bại", "error");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (modalType === "create") {
        if (!currentUser || !currentUser.id) {
          showNotification("Không thể lấy thông tin người dùng để tạo bài viết.", "error");
          return;
        }
        const response = await blogService.createBlog(currentUser.id, {
          title: values.title,
          content: values.content,
          sourceReference: values.sourceReference,
          status: 'DRAFT'
        });
        if (response.data) {
          showNotification("Tạo bài viết mới thành công!", "success");
          setIsModalVisible(false);
          form.resetFields();
          fetchBlogs();
        }
      } else if (modalType === "edit") {
        if (!selectedBlog || !currentUser || !currentUser.id) {
          showNotification("Không thể cập nhật bài viết. Thông tin không đầy đủ.", "error");
          return;
        }
        const updatedBlogData = {
          ...selectedBlog,
          ...values, // values already contain title, content, sourceReference
        };
        await blogService.updateBlog(selectedBlog.id, currentUser.id, updatedBlogData, token.token);
        showNotification("Bài viết đã được cập nhật!", "success");
        setIsModalVisible(false);
        form.resetFields();
        fetchBlogs();
      }
    } catch (error) {
      console.error("Lỗi khi xử lý bài viết:", error);
      showNotification("Xử lý bài viết thất bại", "error");
    }
  };

  const handleUnpublish = async (blog) => {
    try {
      if (!currentUser || !currentUser.id) {
        showNotification("Không thể lấy thông tin người dùng để gỡ bài viết.", "error");
        return;
      }
      const updatedBlogData = {
        ...blog,
        title: blog.title || "",
        content: blog.content || "",
        sourceReference: blog.sourceReference || "",
        status: "DRAFT" // Or "UNPUBLISHED" depending on your backend
      };

      await blogService.updateBlog(blog.id, currentUser.id, updatedBlogData, token.token);
      showNotification("Đã hủy xuất bản bài viết!", "success");
      fetchBlogs();
    } catch (error) {
      console.error("Error unpublishing blog:", error);
      showNotification("Không thể gỡ bài viết", "error");
    }
  };

  const handleApprove = async (blog) => {
    console.log("handleApprove called with blog:", blog);
    try {
      if (!currentUser || !currentUser.id) {
        showNotification("Không thể lấy thông tin người dùng để duyệt bài viết.", "error");
        return;
      }
      const updatedBlogData = {
        ...blog,
        title: blog.title || "",
        content: blog.content || "",
        sourceReference: blog.sourceReference || "",
        status: "APPROVED"
      };

      console.log("Calling updateBlog with:", blog.id, currentUser.id, updatedBlogData);
      const response = await blogService.updateBlog(blog.id, currentUser.id, updatedBlogData, token.token); // Store response
      console.log("updateBlog response:", response); // Log the full response
      console.log("updateBlog successful!");
      showNotification("Đã duyệt bài viết!", "success");
      fetchBlogs();
    } catch (error) {
      console.error("Error approving blog:", error);
      showNotification("Không thể duyệt bài viết", "error");
    }
  };

  const handleReject = async (blog) => {
    try {
      if (!currentUser || !currentUser.id) {
        showNotification("Không thể lấy thông tin người dùng để từ chối bài viết.", "error");
        return;
      }
      const updatedBlogData = {
        ...blog,
        title: blog.title || "",
        content: blog.content || "",
        sourceReference: blog.sourceReference || "",
        status: "REJECTED"
      };

      await blogService.updateBlog(blog.id, currentUser.id, updatedBlogData, token.token);
      showNotification("Đã từ chối bài viết!", "success");
      fetchBlogs();
    } catch (error) {
      console.error("Error rejecting blog:", error);
      showNotification("Không thể từ chối bài viết", "error");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
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
      dataIndex: "authorName",
      key: "authorName",
      render: (authorName) => (
        <div className="flex items-center">
          <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
          {authorName}
        </div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: Object.keys(statusMap).map(key => ({ text: statusMap[key].text, value: key })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => viewBlog(record)}
          >
            Xem
          </Button>
          {record.status === "DRAFT" && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => editBlog(record)}
            >
              Sửa
            </Button>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn duyệt bài viết này không?"
            onConfirm={() => handleApprove(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              style={{
                display: record.status === "DRAFT" || record.status === "PENDING_REVIEW" ? "inline-block" : "none",
              }}
            >
              Duyệt
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Bạn có chắc chắn muốn từ chối bài viết này không?"
            onConfirm={() => handleReject(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              size="small"
              type="danger"
              icon={<CloseOutlined />}
              style={{ display: record.status === "DRAFT" || record.status === "PENDING_REVIEW" ? "inline-block" : "none" }}
            >
              Từ chối
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Bạn có chắc chắn muốn gỡ bài viết này không?"
            onConfirm={() => handleUnpublish(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              size="small"
              type="default"
              icon={<CloseOutlined />}
              style={{ display: record.status === "APPROVED" ? "inline-block" : "none" }}
            >
              Gỡ bài
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="blog-management-card">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Quản lý bài viết</Title>
        <div className="flex gap-4">
          <Button type="primary" icon={<PlusOutlined />} onClick={createBlog}>Tạo Blog</Button>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={setStatusFilter}
            value={statusFilter}
          >
            {Object.entries(statusMap).map(([key, value]) => (
              <Option key={key} value={key}>{value.text}</Option>
            ))}
          </Select>
          <Search
            placeholder="Tìm kiếm bài viết..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} bài viết`,
        }}
      />

      <Modal
        title={modalType === "create" ? "Tạo bài viết mới" : modalType === "edit" ? "Chỉnh sửa bài viết" : "Xem bài viết"}
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
          <Button key="back" onClick={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Lưu
          </Button>
        ]}
        width={800}
      >
        {modalType === "view" ? (
          selectedBlog && (
            <div>
              <h2 className="text-xl font-bold mb-4">{selectedBlog.title}</h2>
              <div className="mb-4">
                <p className="text-gray-600">Tác giả: {selectedBlog.authorName}</p>
                <p className="text-gray-600">Ngày tạo: {dayjs(selectedBlog.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                <p className="text-gray-600">Trạng thái: {getStatusTag(selectedBlog.status)}</p>
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.content }}></div>
            </div>
          )
        ) : (
          <Form form={form} layout="vertical" name="blog_form" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <TextArea rows={10} />
            </Form.Item>
            <Form.Item
              name="sourceReference"
              label="Tham chiếu nguồn"
            >
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  );
};

export default BlogManagement; 