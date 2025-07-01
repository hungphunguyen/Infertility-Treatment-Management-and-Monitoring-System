import React, { useState, useEffect, useContext } from "react";
import { Card, Table, Button, Space, Tag, Typography, Modal, Input, Spin } from "antd";
import { blogService } from "../../service/blog.service";
import { useSelector } from "react-redux";
import { NotificationContext } from "../../App";
import { EyeOutlined, CheckOutlined, CloseOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

const BlogApproval = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState({ blogId: null, status: null });
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogsByStatus("PENDING_REVIEW");
      if (response.data) {
        setBlogs(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showNotification("Không thể tải danh sách bài viết. Vui lòng thử lại sau", "error");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
  };

  const handleStatusUpdate = (blogId, status) => {
    setCurrentAction({ blogId, status });
    setIsCommentModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    const { blogId, status } = currentAction;
    if (!blogId || !status) {
      showNotification("Thông tin bài viết hoặc trạng thái không hợp lệ", "error");
      return;
    }
    if (status === "REJECTED" && !commentText.trim()) {
      showNotification("Vui lòng nhập lý do từ chối!", "error");
      return;
    }
    try {
      setSubmitting(true);
      // Log để debug
      console.log("Gửi duyệt:", { blogId, status, comment: commentText });
      await blogService.updateBlogStatus(blogId, status, commentText);
      showNotification(
        `Bài viết đã được ${status === 'APPROVED' ? 'phê duyệt' : 'từ chối'} thành công`,
        "success"
      );
      setIsCommentModalVisible(false);
      setIsModalVisible(false);
      setCommentText("");
      setCurrentAction({ blogId: null, status: null });
      await fetchPendingBlogs();
    } catch (error) {
      showNotification("Không thể thực hiện thao tác", "error");
    } finally {
      setSubmitting(false);
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
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Ngày gửi",
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
            icon={<EyeOutlined />}
            onClick={() => handleViewBlog(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleStatusUpdate(record.id, "APPROVED")}
            className="bg-green-500 hover:bg-green-600"
          >
            Duyệt
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleStatusUpdate(record.id, "REJECTED")}
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
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPendingBlogs}
              loading={loading}
            >
              Làm mới
            </Button>
          </div>
        }
        className="shadow-md"
      >
        <Table
          columns={columns}
          dataSource={blogs}
          loading={loading}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showTotal: (total) => `Tổng số ${total} bài viết`,
          }}
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
              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap border p-4 rounded">
                {selectedBlog.content}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Thông tin khác</h3>
              <p>Tác giả: {selectedBlog.authorName}</p>
              <p>Ngày tạo: {new Date(selectedBlog.createdAt).toLocaleString("vi-VN")}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(selectedBlog.id, "APPROVED")}
                className="bg-green-500 hover:bg-green-600"
              >
                Duyệt
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(selectedBlog.id, "REJECTED")}
              >
                Từ chối
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={`${currentAction.status === 'APPROVED' ? 'Phê duyệt' : 'Từ chối'} bài viết`}
        open={isCommentModalVisible}
        onOk={handleCommentSubmit}
        onCancel={() => {
          setIsCommentModalVisible(false);
          setCommentText("");
          setCurrentAction({ blogId: null, status: null });
        }}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={submitting}
      >
        <div className="space-y-2">
          <p>
            {currentAction.status === 'APPROVED' 
              ? 'Thêm nhận xét cho bài viết (không bắt buộc):' 
              : 'Vui lòng cho biết lý do từ chối:'}
          </p>
          <TextArea
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              currentAction.status === 'APPROVED'
                ? "Nhập nhận xét của bạn (nếu có)..."
                : "Nhập lý do từ chối bài viết..."
            }
            required={currentAction.status === 'REJECTED'}
          />
          {currentAction.status === 'REJECTED' && !commentText && (
            <p className="text-red-500 text-sm">* Vui lòng nhập lý do từ chối</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BlogApproval; 