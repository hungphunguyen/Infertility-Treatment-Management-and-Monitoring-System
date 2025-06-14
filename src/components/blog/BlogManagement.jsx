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
  message
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
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const statusMap = {
  pending: { color: "orange", text: "Chờ duyệt" },
  approved: { color: "green", text: "Đã duyệt" },
  rejected: { color: "red", text: "Đã từ chối" },
  draft: { color: "blue", text: "Bản nháp" },
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
      await blogService.updateBlog(blogId, selectedBlog.userId, { featured: !currentFeatured }, token.token); 
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
          message.error("Không thể lấy thông tin người dùng để tạo bài viết.");
          return;
        }
        await blogService.createBlog({ ...values, userId: currentUser.id }, token.token);
        message.success("Tạo bài viết mới thành công!");
      } else if (modalType === "edit") {
        await blogService.updateBlog(selectedBlog.id, selectedBlog.userId, values, token.token);
        message.success("Bài viết đã được cập nhật!");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchBlogs();
    } catch (error) {
      console.error("Lỗi khi xử lý bài viết:", error);
      message.error("Xử lý bài viết thất bại");
    }
  };

  const handleUnpublish = async (blogId) => {
    try {
      if (!currentUser || !currentUser.id) {
        message.error("Không thể lấy thông tin người dùng để gỡ bài viết.");
        return;
      }
      const response = await blogService.rejectBlog(blogId, token.token);
      if (response.data) {
        message.success("Bài viết đã được gỡ thành công!");
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error unpublishing blog:", error);
      message.error("Không thể gỡ bài viết");
    }
  };

  const handleApprove = async (blogId) => {
    try {
      if (!currentUser || !currentUser.id) {
        message.error("Không thể lấy thông tin người dùng để duyệt bài viết.");
        return;
      }
      const response = await blogService.approveBlog(blogId, currentUser.id, token.token);
      if (response.data) {
        message.success("Bài viết đã được duyệt thành công!");
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error approving blog:", error);
      message.error("Không thể duyệt bài viết");
    }
  };

  const handleReject = async (blogId) => {
    try {
      if (!currentUser || !currentUser.id) {
        message.error("Không thể lấy thông tin người dùng để từ chối bài viết.");
        return;
      }
      const response = await blogService.rejectBlog(blogId, token.token);
      if (response.data) {
        message.success("Bài viết đã bị từ chối!");
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error rejecting blog:", error);
      message.error("Không thể từ chối bài viết");
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
          {record.status === "draft" && <Tag color="blue" size="small">Bản nháp</Tag>}
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
        <Space size="middle">
          {record.status === "approved" ? (
            <Popconfirm
              title="Bạn có chắc chắn muốn gỡ bài viết này?"
              onConfirm={() => handleUnpublish(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<CloseOutlined />}>Gỡ</Button>
            </Popconfirm>
          ) : (
            <>
              <Button type="default" icon={<EyeOutlined />} onClick={() => viewBlog(record)}>Xem</Button>
              {record.status === "pending" && (
                <>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn duyệt bài viết này?"
                    onConfirm={() => handleApprove(record.id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button type="primary" icon={<CheckOutlined />}>Duyệt</Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn từ chối bài viết này?"
                    onConfirm={() => handleReject(record.id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button danger icon={<CloseOutlined />}>Từ chối</Button>
                  </Popconfirm>
                </>
              )}
            </>
          )}
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