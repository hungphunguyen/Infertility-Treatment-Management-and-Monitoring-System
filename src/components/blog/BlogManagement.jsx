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
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { blogService } from "../../service/blog.service";
import { useSelector } from "react-redux";
import { NotificationContext } from "../../App";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option = Select.Option } = Select;
const { Search } = Input;

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
  const [actionLoading, setActionLoading] = useState(false);
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
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState({
    blogId: null,
    status: null,
  });
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

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
        showNotification("Không thể tải thông tin người dùng", "error");
      }
    };
    loadUserInfo();
  }, [token, showNotification]);

  const fetchBlogs = async (page = 0, status = statusFilter, keyword = searchText) => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs({
        status: status !== 'all' ? status : undefined,
        keyword: keyword || undefined,
        page,
        size: 10,
      });
      if (response.data && response.data.result) {
        setBlogs(response.data.result.content);
      }
    } catch (error) {
      showNotification("Không thể tải danh sách bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = blogs.filter((blog) => {
      const matchesStatus =
        statusFilter === "all" ? true : blog.status === statusFilter;
      const matchesSearch =
        blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setFilteredData(filtered);
  }, [blogs, statusFilter, searchText]);

  const getStatusTag = (status) => {
    const statusInfo = statusMap[status];
    if (statusInfo) {
      return (
        <Tag color={statusInfo.color} style={{ fontWeight: 600 }}>
          {statusInfo.text}
        </Tag>
      );
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
      featured: blog.featured || false,
    });
    setIsModalVisible(true);
  };

  const viewBlog = (blog) => {
    setSelectedBlog(blog);
    setModalType("view");
    setIsModalVisible(true);
  };

  const handleDeleteBlog = async (blogId) => {
    setActionLoading(true);
    try {
      await blogService.deleteBlog(blogId, token.token);
      showNotification("Bài viết đã được xóa!", "success");
      fetchBlogs();
    } catch (error) {
      showNotification("Xóa bài viết thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setActionLoading(true);
    try {
      if (modalType === "create") {
        const response = await blogService.createBlog({
          title: values.title,
          content: values.content,
          sourceReference: values.sourceReference,
        });
        if (response.data) {
          showNotification("Bài viết đã được lưu dưới dạng nháp!", "success");
          setIsModalVisible(false);
          form.resetFields();
          fetchBlogs();
        }
      } else if (modalType === "edit") {
        await blogService.updateBlog(selectedBlog.id, {
          title: values.title,
          content: values.content,
          sourceReference: values.sourceReference,
        });
        showNotification("Bài viết đã được cập nhật!", "success");
        setIsModalVisible(false);
        form.resetFields();
        fetchBlogs();
      }
    } catch (error) {
      showNotification("Xử lý bài viết thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendForReview = async (values, isNewBlog) => {
    setActionLoading(true);
    try {
      if (isNewBlog) {
        const response = await blogService.createBlog({
          title: values.title,
          content: values.content,
          sourceReference: values.sourceReference,
        });
        if (response.data) {
          await blogService.submitBlog(response.data.result.id, {
            title: values.title,
            content: values.content,
            sourceReference: values.sourceReference,
          });
          showNotification("Bài viết đã được gửi, chờ quản lý duyệt!", "success");
          setIsModalVisible(false);
          form.resetFields();
          fetchBlogs();
        }
      } else {
        await blogService.updateBlog(selectedBlog.id, {
          title: values.title,
          content: values.content,
          sourceReference: values.sourceReference,
        });
        await blogService.submitBlog(selectedBlog.id, {
          title: values.title,
          content: values.content,
          sourceReference: values.sourceReference,
        });
        showNotification("Bài viết đã được gửi duyệt thành công!", "success");
        setIsModalVisible(false);
        form.resetFields();
        fetchBlogs();
      }
    } catch (error) {
      showNotification("Gửi duyệt bài viết thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (blogId, currentStatus) => {
    setActionLoading(true);
    try {
      if (!currentUser || !currentUser.id) {
        showNotification(
          "Không có thông tin người dùng để cập nhật trạng thái bài viết.",
          "error"
        );
        return;
      }
      let newStatus;
      let successMessage;
      if (currentStatus === "APPROVED") {
        newStatus = "hidden";
        successMessage = "Bài viết đã được ẩn!";
      } else if (currentStatus === "hidden") {
        newStatus = "APPROVED";
        successMessage = "Bài viết đã được hiện lại!";
      } else {
        showNotification("Không thể thay đổi trạng thái này.", "warning");
        setActionLoading(false);
        return;
      }
      await blogService.updateBlogStatus(
        blogId,
        newStatus,
        token.token,
        currentUser.id
      );
      showNotification(successMessage, "success");
      fetchBlogs();
    } catch (error) {
      showNotification("Cập nhật trạng thái thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (blogId) => {
    setCurrentAction({ blogId, status: "APPROVED" });
    setIsCommentModalVisible(true);
  };

  const handleReject = async (blogId) => {
    setCurrentAction({ blogId, status: "REJECTED" });
    setIsCommentModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    setActionLoading(true);
    try {
      if (!token?.token || !currentUser?.id) {
        showNotification("Không có thông tin người dùng quản lý.", "error");
        setActionLoading(false);
        return;
      }
      const { blogId, status } = currentAction;
      if (!blogId || !status) {
        showNotification(
          "Thông tin bài viết hoặc trạng thái không hợp lệ.",
          "error"
        );
        setActionLoading(false);
        return;
      }
      const response = await blogService.approveBlog(
        blogId,
        currentUser.id,
        token.token,
        { action: status, comment: commentText }
      );
      if (response.data && response.data.result) {
        showNotification(
          `Bài viết đã được ${
            status === "APPROVED" ? "duyệt" : "từ chối"
          } thành công!`,
          "success"
        );
        setIsCommentModalVisible(false);
        setCommentText("");
        fetchBlogs();
      } else {
        showNotification("Thao tác thất bại.", "error");
      }
    } catch (error) {
      showNotification("Không thể thực hiện thao tác", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCommentModalCancel = () => {
    setIsCommentModalVisible(false);
    setCommentText("");
    setCurrentAction({ blogId: null, status: null });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Hình ảnh",
      key: "coverImageUrl",
      render: (_, record) => (
        <Image
          width={60}
          height={40}
          src={record.coverImageUrl || "/images/default-blog.jpg"}
          fallback="/images/default-blog.jpg"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <span
          className="font-medium cursor-pointer text-blue-600 hover:underline"
          onClick={() => navigate(`/blog-detail/${record.id}`)}
        >
          {text}
        </span>
      ),
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
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: Object.keys(statusMap).map((key) => ({
        text: statusMap[key].text,
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space wrap>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => viewBlog(record)}
            >
              Xem
            </Button>
          </Space>
          <Space wrap>
            {record.status === "PENDING_REVIEW" && (
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
                loading={actionLoading}
              >
                Duyệt
              </Button>
            )}
            {record.status === "PENDING_REVIEW" && (
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
                loading={actionLoading}
              >
                Từ chối
              </Button>
            )}
            {record.status === "APPROVED" && (
              <Button
                size="small"
                danger
                icon={<EyeInvisibleOutlined />}
                onClick={() => handleStatusChange(record.id, "APPROVED")}
                loading={actionLoading}
              >
                Ẩn
              </Button>
            )}
            {record.status === "hidden" && (
              <Button
                size="small"
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleStatusChange(record.id, "hidden")}
                loading={actionLoading}
              >
                Bỏ ẩn
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
        <Title level={4}>Quản lý bài viết</Title>
        <div className="flex gap-4">
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={setStatusFilter}
            value={statusFilter}
          >
            {Object.entries(statusMap).map(([key, value]) => (
              <Option key={key} value={key}>
                {value.text}
              </Option>
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
        loading={loading || actionLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} bài viết`,
        }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={
          modalType === "create"
            ? "Tạo bài viết mới"
            : modalType === "edit"
            ? "Chỉnh sửa bài viết"
            : "Xem bài viết"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={
          modalType === "view"
            ? [
                <Button key="close" onClick={() => setIsModalVisible(false)}>
                  Đóng
                </Button>,
              ]
            : [
                <Button
                  key="back"
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }}
                >
                  Hủy
                </Button>,
                <Button
                  key="saveDraft"
                  onClick={() => form.submit()}
                  type="primary"
                  loading={actionLoading}
                >
                  Lưu
                </Button>,
                (modalType === "create" ||
                  (modalType === "edit" &&
                    selectedBlog?.status === "DRAFT")) && (
                  <Button
                    key="submitReview"
                    type="primary"
                    onClick={() =>
                      handleSendForReview(
                        form.getFieldsValue(),
                        modalType === "create"
                      )
                    }
                    loading={actionLoading}
                  >
                    Gửi duyệt
                  </Button>
                ),
              ]
        }
        width={800}
        destroyOnClose
      >
        {modalType === "view" ? (
          selectedBlog && (
            <div>
              <h2 className="text-xl font-bold mb-4">{selectedBlog.title}</h2>
              <div className="mb-4">
                <p className="text-gray-600">
                  Tác giả: {selectedBlog.authorName}
                </p>
                <p className="text-gray-600">
                  Ngày tạo:{" "}
                  {dayjs(selectedBlog.createdAt).format("DD/MM/YYYY HH:mm")}
                </p>
                <p className="text-gray-600">
                  Trạng thái: {getStatusTag(selectedBlog.status)}
                </p>
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              ></div>
            </div>
          )
        ) : (
          <Form
            form={form}
            layout="vertical"
            name="blog_form"
            onFinish={handleSubmit}
          >
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
              <Input.TextArea rows={10} />
            </Form.Item>
            <Form.Item name="sourceReference" label="Tham chiếu nguồn">
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title={`Thêm bình luận cho bài viết ${
          currentAction.status === "APPROVED" ? "duyệt" : "từ chối"
        }`}
        open={isCommentModalVisible}
        onOk={handleCommentSubmit}
        onCancel={handleCommentModalCancel}
        okText="Gửi"
        cancelText="Hủy"
        confirmLoading={actionLoading}
        destroyOnClose
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập bình luận của bạn (ví dụ: Bài viết đạt yêu cầu; Nội dung cần sửa đổi)..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </Modal>
    </Card>
  );
};

export default BlogManagement;
