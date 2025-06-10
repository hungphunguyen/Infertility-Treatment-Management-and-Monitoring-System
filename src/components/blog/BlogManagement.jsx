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
  Avatar
} from "antd";
import { 
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // create, edit, view
  const [form] = Form.useForm();
  const token = useSelector((state) => state.authSlice);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchBlogs();
  }, []);

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
                            blog.authorName.toLowerCase().includes(searchText.toLowerCase()) ||
                            blog.category.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setFilteredData(filtered);
  }, [blogs, statusFilter, searchText]);

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: "orange", text: "Chờ duyệt" },
      approved: { color: "green", text: "Đã duyệt" },
      rejected: { color: "red", text: "Đã từ chối" },
      draft: { color: "blue", text: "Bản nháp" },
      all: { color: "default", text: "Tất cả" },
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

  const deleteBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId, token.token);
      showNotification("Bài viết đã được xóa!", "success");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      showNotification("Không thể xóa bài viết", "error");
    }
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
        // Logic to create new blog (if needed, currently not used from this component)
        showNotification("Tạo bài viết mới thành công!", "success");
      } else if (modalType === "edit") {
        await blogService.updateBlog(selectedBlog.id, selectedBlog.userId, values, token.token);
        showNotification("Bài viết đã được cập nhật!", "success");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
      showNotification("Cập nhật bài viết thất bại", "error");
    }
  };

  const handleApprove = async (blogId) => {
    try {
      const response = await blogService.approveBlog(blogId, token.token);
      if (response.data) {
        showNotification("Bài viết đã được duyệt thành công!", "success");
        fetchBlogs();
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
        fetchBlogs();
      }
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
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => viewBlog(record)}
          >
            Xem
          </Button>
          {record.status === "pending" && (
            <Popconfirm
              title="Duyệt bài viết này?"
              onConfirm={() => handleApprove(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                icon={<CheckOutlined />}
                style={{ backgroundColor: "#52c41a" }}
              >
                Duyệt
              </Button>
            </Popconfirm>
          )}
          {record.status === "pending" && (
            <Popconfirm
              title="Từ chối bài viết này?"
              onConfirm={() => handleReject(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
              >
                Từ chối
              </Button>
            </Popconfirm>
          )}
          {record.status === "draft" && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => editBlog(record)}
            >
              Sửa
            </Button>
          )}
          {record.status === "approved" && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => editBlog(record)}
            >
              Sửa
            </Button>
          )}
          {(record.status === "pending" || record.status === "draft" || record.status === "rejected" || record.status === "approved") && (
            <Popconfirm
              title="Bạn có chắc muốn xóa bài viết này?"
              onConfirm={() => deleteBlog(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
          {record.status === "approved" && (
            <Button
              type={record.featured ? "default" : "primary"}
              onClick={() => toggleFeatured(record.id, record.featured)}
            >
              {record.featured ? "Bỏ nổi bật" : "Đặt nổi bật"}
            </Button>
          )}
        </Space>
      ),
    },
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
            <Option value="all">Tất cả</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Đã từ chối</Option>
            <Option value="draft">Bản nháp</Option>
          </Select>
          <Search
            placeholder="Tìm kiếm theo tiêu đề, tác giả..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
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
              <h3 className="text-lg font-semibold mb-2">Nội dung</h3>
              <p className="whitespace-pre-wrap">{selectedBlog.content}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Nguồn tham khảo</h3>
              <p>{selectedBlog.sourceReference}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Thông tin khác</h3>
              <p>Tác giả: {selectedBlog.authorName}</p>
              <p>Trạng thái: {getStatusTag(selectedBlog.status).props.children}</p>
              <p>Ngày tạo: {dayjs(selectedBlog.createdAt).format("DD/MM/YYYY")}</p>
              {selectedBlog.publishedAt && (
                <p>Ngày xuất bản: {dayjs(selectedBlog.publishedAt).format("DD/MM/YYYY")}</p>
              )}
              <p>Lượt xem: {selectedBlog.views?.toLocaleString('vi-VN')}</p>
              <p>Nổi bật: {selectedBlog.featured ? "Có" : "Không"}</p>
            </div>
            {modalType === "edit" && (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  title: selectedBlog.title,
                  content: selectedBlog.content,
                  sourceReference: selectedBlog.sourceReference,
                  featured: selectedBlog.featured,
                }}
              >
                <Form.Item
                  name="title"
                  label="Tiêu đề bài viết"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                >
                  <Input placeholder="Nhập tiêu đề bài viết" />
                </Form.Item>
                <Form.Item
                  name="content"
                  label="Nội dung"
                  rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                >
                  <TextArea rows={8} placeholder="Nhập nội dung bài viết" />
                </Form.Item>
                <Form.Item
                  name="sourceReference"
                  label="Nguồn tham khảo"
                  rules={[{ required: true, message: "Vui lòng nhập nguồn tham khảo!" }]}
                >
                  <Input placeholder="Nhập nguồn tham khảo" />
                </Form.Item>
                <Form.Item name="featured" valuePropName="checked">
                  <Switch checkedChildren="Nổi bật" unCheckedChildren="Bình thường" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            )}
            {modalType === "view" && selectedBlog.status === "pending" && (
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