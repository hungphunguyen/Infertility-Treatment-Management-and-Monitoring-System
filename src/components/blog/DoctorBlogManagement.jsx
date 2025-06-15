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
  message
} from "antd";
import { 
  EditOutlined,
  EyeOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined
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
  pending: { color: "orange", text: "Chờ duyệt" },
  approved: { color: "green", text: "Đã duyệt" },
  rejected: { color: "red", text: "Đã từ chối" },
  draft: { color: "blue", text: "Bản nháp" },
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
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const handleCreateBlog = () => {
    navigate("/doctor/create-blog");
  };

  const viewBlog = (blog) => {
    setSelectedBlog(blog);
    setModalType("view");
    setIsModalVisible(true);
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag
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
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => viewBlog(record)}
          >
            Xem
          </Button>
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
        title="Xem bài viết"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedBlog && (
          <div>
            <h2 className="text-xl font-bold mb-4">{selectedBlog.title}</h2>
            <div className="mb-4">
              <p className="text-gray-600">Tác giả: {selectedBlog.authorName}</p>
              <p className="text-gray-600">Ngày tạo: {dayjs(selectedBlog.createdAt).format("DD/MM/YYYY HH:mm")}</p>
              <p className="text-gray-600">Trạng thái: {getStatusTag(selectedBlog.status)}</p>
            </div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedBlog.content }}></div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default DoctorBlogManagement; 