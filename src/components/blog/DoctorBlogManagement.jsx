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
  Popconfirm,
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
import { customerService } from "../../service/customer.service";

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    const filtered = myBlogs.filter((blog) => {
      const matchesStatus =
        statusFilter === "all" ? true : blog.status === statusFilter;
      const matchesSearch = blog.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setFilteredData(filtered);
  }, [myBlogs, statusFilter, searchText]);

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

  const handleCreateBlog = () => {
    setSelectedBlog(null);
    setModalType("create");
    form.resetFields();
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
      fetchMyBlogs(currentUser.id);
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
        if (!currentUser || !currentUser.id) {
          showNotification(
            "Không thể lấy thông tin người dùng để tạo bài viết.",
            "error"
          );
          return;
        }
        const response = await blogService.createBlog(currentUser.id, {
          title: values.title,
          content: values.content,
          sourceReference: values.sourceReference,
          status: "DRAFT",
        });
        if (response.data) {
          showNotification("Bài viết đã được lưu dưới dạng nháp!", "success");
          setIsModalVisible(false);
          form.resetFields();
          fetchMyBlogs(currentUser.id);
        }
      } else if (modalType === "edit") {
        if (!selectedBlog || !currentUser || !currentUser.id) {
          showNotification(
            "Không thể cập nhật bài viết. Thông tin không đầy đủ.",
            "error"
          );
          return;
        }
        const updatedBlogData = {
          ...selectedBlog,
          ...values,
        };
        await blogService.updateBlog(
          selectedBlog.id,
          currentUser.id,
          updatedBlogData,
          token.token
        );
        if (selectedBlog.status === "DRAFT") {
          const submitResponse = await blogService.submitBlog(
            selectedBlog.id,
            currentUser.id,
            token.token,
            {
              title: updatedBlogData.title,
              content: updatedBlogData.content,
              sourceReference: updatedBlogData.sourceReference,
            }
          );
          if (submitResponse.data?.result?.status === "PENDING_REVIEW") {
            showNotification(
              "Bài viết đã được gửi duyệt thành công!",
              "success"
            );
          } else {
            showNotification("Không thể gửi bài viết đi duyệt", "error");
          }
        } else {
          showNotification("Bài viết đã được cập nhật!", "success");
        }
        setIsModalVisible(false);
        form.resetFields();
        fetchMyBlogs(currentUser.id);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý bài viết:", error);
      showNotification("Xử lý bài viết thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendForReview = async (values, isNewBlog) => {
    setActionLoading(true);
    try {
      if (!currentUser || !currentUser.id) {
        showNotification(
          "Vui lòng đăng nhập để tạo hoặc gửi bài viết đi duyệt",
          "error"
        );
        return;
      }
      if (isNewBlog) {
        const response = await blogService.createBlog(currentUser.id, {
          title: values.title,
          content: values.content,
          sourceReference: values.sourceReference,
          status: "PENDING_REVIEW",
        });
        if (response.data) {
          showNotification(
            "Bài viết đã được gửi, chờ quản lý duyệt!",
            "success"
          );
          setIsModalVisible(false);
          form.resetFields();
          fetchMyBlogs(currentUser.id);
        }
      } else {
        if (!selectedBlog) {
          showNotification("Không tìm thấy bài viết để gửi duyệt.", "error");
          return;
        }
        const updatedBlogData = {
          ...selectedBlog,
          ...values,
        };
        await blogService.updateBlog(
          selectedBlog.id,
          currentUser.id,
          updatedBlogData,
          token.token
        );
        await blogService.submitBlog(
          selectedBlog.id,
          currentUser.id,
          token.token,
          updatedBlogData
        );
        showNotification("Bài viết đã được gửi duyệt thành công!", "success");
        setIsModalVisible(false);
        form.resetFields();
        fetchMyBlogs(currentUser.id);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bài viết đi duyệt:", error);
      showNotification("Gửi duyệt bài viết thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleSelectFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result); // preview base64
    };
  };

  // ✅ Handle Upload Img
  const handleUploadImg = async () => {
    if (!selectedFile || !selectedBlog?.id) return;
    setUploadingImage(true); // 🔥 Start loading

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", selectedBlog.id);

    try {
      const res = await customerService.uploadImg(formData);
      showNotification("Upload avatar thành công", "success");

      setSelectedBlog((prev) => ({
        ...prev,
        coverImageUrl: res.data.result.coverImageUrl,
      }));
      window.location.reload();
      // Reset trạng thái
      setSelectedFile(null);
      setIsUploadModalOpen(false);
      setPreview(null);
    } catch (err) {
      showNotification(err.response.data.message, "error");
      console.log(err);
      console.log(formData);
    } finally {
      setUploadingImage(false); // 🔥 End loading
    }
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
      render: (title, record) => (
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">ID: {record.id}</div>
          {record.featured && (
            <Tag color="gold" size="small">
              Nổi bật
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
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
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
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

            <Button
              size="small"
              style={{
                backgroundColor: "#FFA500",
                color: "white",
                border: "none",
              }}
              onClick={() => {
                setSelectedBlog(record); // 👈 CHỌN BLOG
                setIsUploadModalOpen(true); // 👈 MỞ MODAL
              }}
            >
              Upload ảnh
            </Button>
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
                  loading={actionLoading}
                >
                  Xóa
                </Button>
              </Popconfirm>
            )}
          </Space>
          <Space wrap>
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
                  handleSendForReview(form.getFieldsValue(), false);
                }}
                loading={actionLoading}
              >
                Gửi duyệt
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateBlog}
          >
            Tạo Blog
          </Button>
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
              <TextArea rows={10} />
            </Form.Item>
            <Form.Item name="sourceReference" label="Tham chiếu nguồn">
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* { Modal upload ảnh cho blog} */}
      <Modal
        title={`Cập nhật ảnh cho blog: ${selectedBlog?.title || ""}`}
        open={isUploadModalOpen}
        onCancel={() => {
          setIsUploadModalOpen(false);
          setSelectedFile(null);
          setPreview(null);
        }}
        footer={null}
        destroyOnClose
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Ảnh blog</h3>
          <img
            src={preview || selectedBlog?.image || "/default-blog.jpg"}
            alt="Avatar Preview"
            className="w-32 h-32 rounded-full object-cover border mx-auto mb-4"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 transition inline-block"
          >
            Chọn ảnh
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={handleSelectFile}
            className="hidden"
          />
          <p className="text-sm text-gray-600 mt-2">
            {selectedFile ? selectedFile.name : "Chưa chọn ảnh nào"}
          </p>
          <Button
            type="primary"
            loading={uploadingImage}
            disabled={!selectedFile}
            onClick={handleUploadImg}
            className="mt-3"
          >
            {uploadingImage ? "Đang upload..." : "Lưu ảnh"}
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default DoctorBlogManagement;
