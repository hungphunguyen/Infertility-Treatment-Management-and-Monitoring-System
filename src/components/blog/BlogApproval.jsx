import React, { useState, useEffect, useContext } from "react";
import { Card, Table, Button, Space, Tag, Typography, Modal, message } from "antd";
import { blogService } from "../../service/blog.service";
import { useSelector } from "react-redux";
import { NotificationContext } from "../../App";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

const BlogApproval = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = useSelector((state) => state.authSlice);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogsByStatus("pending");
      if (response.data) {
        setBlogs(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching pending blogs:", error);
      showNotification("Không thể tải danh sách bài viết", "error");
    } finally {
      setLoading(false);
    }
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
        fetchPendingBlogs(); // Refresh danh sách
      }
    } catch (error) {
      console.error("Error approving blog:", error);
      showNotification("Không thể duyệt bài viết", "error");
    }
  };

  const handleReject = async (blogId) => {
    try {
      // TODO: Implement reject functionality
      showNotification("Tính năng từ chối bài viết đang được phát triển", "info");
    } catch (error) {
      console.error("Error rejecting blog:", error);
      showNotification("Không thể từ chối bài viết", "error");
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewBlog(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            style={{ backgroundColor: "#52c41a" }}
          >
            Duyệt
          </Button>
          <Button
            type="primary"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleReject(record.id)}
          >
            Từ chối
          </Button>
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
              Duyệt Bài Viết
            </Title>
          </div>
        }
        className="shadow-md"
      >
        <Table
          columns={columns}
          dataSource={blogs}
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
            </div>
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogApproval; 