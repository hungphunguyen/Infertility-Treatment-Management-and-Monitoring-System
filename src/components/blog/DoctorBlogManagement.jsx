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
  Image,
  Avatar,
  message,
  Popconfirm
} from "antd";
import { 
  EditOutlined,
  EyeOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { blogService } from "../../service/blog.service";
import { useSelector } from "react-redux";
import { NotificationContext } from "../../App";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const statusMap = {
  PENDING_REVIEW: { color: "orange", text: "Chờ duyệt" },
  APPROVED: { color: "green", text: "Đã duyệt" },
  REJECTED: { color: "red", text: "Đã từ chối" },
  DRAFT: { color: "blue", text: "Bản nháp" },
  all: { color: "default", text: "Tất cả" },
};

const DoctorBlogManagement = () => {
  const [myBlogs, setMyBlogs] = useState([]);
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
  const navigate = useNavigate();

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

  useEffect(() => {
    if (currentUser?.id) {
      fetchMyBlogs(currentUser.id);
    }
  }, [currentUser]);

  const fetchMyBlogs = async (authorId) => {
    try {
      setLoading(true);
      const response = await blogService.getBlogsByAuthor(authorId);
      if (response.data) {
        setMyBlogs(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching my blogs:", error);
      showNotification("Không thể tải danh sách bài viết của bạn", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = myBlogs.filter(blog => {
      const matchesStatus = statusFilter === "all" ? true : blog.status === statusFilter;
      const matchesSearch = blog.title.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setFilteredData(filtered);
  }, [myBlogs, statusFilter, searchText]);

  const getStatusTag = (status) => {
    const statusInfo = statusMap[status];
    if (statusInfo) {
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    } else {
      return <Tag>Không xác định</Tag>;
    }
  };

  const handleCreateBlog = () => {
    navigate("/doctor/create-blog");
  };

  const editBlog = (blog) => {
    setSelectedBlog(blog);
    setModalType("edit");
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
      sourceReference: blog.sourceReference,
      featured: blog.featured || false,
    });
    setIsModalVisible(true);
  };

  const viewBlog = (blog) => {
    setSelectedBlog(blog);
    setModalType("view");
    setIsModalVisible(true);
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
          status: 'DRAFT' // Default status when saving via form.submit() or 'Lưu'
        });
        if (response.data) {
          showNotification("Bài viết đã được lưu dưới dạng nháp!", "success"); // Changed message
          setIsModalVisible(false);
          form.resetFields();
          fetchMyBlogs(currentUser.id);
        }
      } else if (modalType === "edit") {
        if (!selectedBlog || !currentUser || !currentUser.id) {
          showNotification("Không thể cập nhật bài viết. Thông tin không đầy đủ.", "error");
          return;
        }
        const updatedBlogData = {
          ...selectedBlog,
          ...values,
          // Do not explicitly set status here, as status changes will be handled by separate buttons/functions
        };
        await blogService.updateBlog(selectedBlog.id, currentUser.id, updatedBlogData, token.token);
        showNotification("Bài viết đã được cập nhật!", "success");
        setIsModalVisible(false);
        form.resetFields();
        fetchMyBlogs(currentUser.id);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý bài viết:", error);
      showNotification("Xử lý bài viết thất bại", "error");
    }
  };

  const handleSendForReview = async (values, isNewBlog) => {
    try {
      if (!currentUser || !currentUser.id) {
        showNotification("Vui lòng đăng nhập để tạo hoặc gửi bài viết đi duyệt", "error");
        return;
      }

      if (isNewBlog) {
        const response = await blogService.createBlog(currentUser.id, {
            title: values.title,
            content: values.content,
            sourceReference: values.sourceReference,
            status: 'PENDING_REVIEW'
        });
        if (response.data) {
            showNotification("Bài viết đã được gửi, chờ quản lý duyệt!", "success");
            setIsModalVisible(false);
            form.resetFields();
            fetchMyBlogs(currentUser.id);
        }
      } else { // Existing blog (modalType === "edit" and selectedBlog?.status === "DRAFT")
        if (!selectedBlog) {
            showNotification("Không tìm thấy bài viết để gửi duyệt.", "error");
            return;
        }
        // First, update content (if any changes were made)
        const updatedBlogData = {
          ...selectedBlog,
          ...values, // Apply any changes from the form before submitting
        };
        await blogService.updateBlog(selectedBlog.id, currentUser.id, updatedBlogData, token.token); // Update content first
        
        // Then, submit the blog for review
        console.log("Submitting blog for review:", selectedBlog.id, currentUser.id);
        await blogService.submitBlog(selectedBlog.id, currentUser.id, token.token, updatedBlogData);
        showNotification("Bài viết đã được gửi duyệt thành công!", "success");
        setIsModalVisible(false);
        form.resetFields();
        fetchMyBlogs(currentUser.id);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bài viết đi duyệt:", error);
      showNotification("Gửi duyệt bài viết thất bại", "error");
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
      filters: Object.keys(statusMap).map(key => ({ text: statusMap[key].text, value: key })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm")
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
            {record.status === "DRAFT" && (
              <Button
                size="small"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => editBlog(record)}
              >
                Sửa
              </Button>
            )}
            {record.status === "DRAFT" && (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa bài viết này?"
                onConfirm={() => handleDeleteBlog(record.id)}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                >
                  Xóa
                </Button>
              </Popconfirm>
            )}
          </Space>
          <Space>
            {record.status === "DRAFT" && (
              <Button 
                size="small" 
                type="primary"
                onClick={() => {
                  setSelectedBlog(record);
                  setModalType("edit");
                  form.setFieldsValue({
                    title: record.title,
                    content: record.content,
                    sourceReference: record.sourceReference,
                    featured: record.featured || false,
                  });
                  handleSendForReview(form.getFieldsValue(), false); // Gửi bài viết đi duyệt
                }}
              >
                Gửi duyệt
              </Button>
            )}
            {record.status !== "hidden" && (
              <Button 
                size="small" 
                danger
                icon={<EyeInvisibleOutlined />}
                onClick={() => handleStatusChange(record.id, "hidden")}
              >
                Ẩn
              </Button>
            )}
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <Card className="blog-management-card">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Bài Viết Của Tôi</Title>
        <div className="flex gap-4">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateBlog}>Tạo Blog</Button>
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
          <Button key="saveDraft" onClick={() => form.submit()}>
            Lưu
          </Button>,
          (modalType === "create" || (modalType === "edit" && selectedBlog?.status === "DRAFT")) && (
            <Button key="submitReview" type="primary" onClick={() => handleSendForReview(form.getFieldsValue(), modalType === "create")}>
              Gửi duyệt
            </Button>
          )
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

export default DoctorBlogManagement; 