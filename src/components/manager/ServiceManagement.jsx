import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input,
  Modal,
  Form,
  InputNumber,
  message,
  Row,
  Col,
  Popconfirm,
  Image,
  Upload,
  Switch,
  Descriptions
} from "antd";
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  SearchOutlined
} from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const ServiceManagement = () => {
  const [services, setServices] = useState([
    {
      key: 1,
      id: "SRV001",
      name: "Thụ Tinh Trong Ống Nghiệm (IVF)",
      description: "IVF là kỹ thuật hỗ trợ sinh sản tiên tiến nhất, trong đó trứng được thụ tinh với tinh trùng trong phòng thí nghiệm.",
      price: 50000000,
      duration: "2-3 tháng",
      category: "Hỗ trợ sinh sản",
      isActive: true,
      image: "/images/services/ivf.jpg",
      createdDate: "2024-01-01"
    },
    {
      key: 2,
      id: "SRV002", 
      name: "Thụ Tinh Nhân Tạo (IUI)",
      description: "IUI là phương pháp đưa tinh trùng đã được xử lý trực tiếp vào tử cung của người phụ nữ.",
      price: 15000000,
      duration: "1 tháng",
      category: "Hỗ trợ sinh sản",
      isActive: true,
      image: "/images/services/iui.jpg",
      createdDate: "2024-01-01"
    },
    {
      key: 3,
      id: "SRV003",
      name: "Xét Nghiệm Chẩn Đoán",
      description: "Xét nghiệm toàn diện để xác định nguyên nhân của vô sinh.",
      price: 2000000,
      duration: "1-2 tuần",
      category: "Chẩn đoán",
      isActive: true,
      image: "/images/services/diagnostic.jpg",
      createdDate: "2024-01-01"
    }
  ]);

  const [filteredData, setFilteredData] = useState(services);
  const [searchText, setSearchText] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // create, edit, view
  const [form] = Form.useForm();

  // Filter services
  React.useEffect(() => {
    let filtered = services;
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [searchText, services]);

  const createService = () => {
    setSelectedService(null);
    setModalType("create");
    form.resetFields();
    setIsModalVisible(true);
  };

  const editService = (service) => {
    setSelectedService(service);
    setModalType("edit");
    form.setFieldsValue({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      isActive: service.isActive
    });
    setIsModalVisible(true);
  };

  const viewService = (service) => {
    setSelectedService(service);
    setModalType("view");
    setIsModalVisible(true);
  };

  const deleteService = (serviceId) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    message.success("Dịch vụ đã được xóa!");
  };

  const toggleServiceStatus = (serviceId) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive }
        : service
    ));
    message.success("Trạng thái dịch vụ đã được cập nhật!");
  };

  const handleSubmit = (values) => {
    const serviceData = {
      ...values,
      id: modalType === "create" ? `SRV${String(services.length + 1).padStart(3, '0')}` : selectedService.id,
      key: modalType === "create" ? Date.now() : selectedService.key,
      image: "/images/services/default.jpg",
      createdDate: modalType === "create" ? new Date().toISOString().split('T')[0] : selectedService.createdDate
    };

    if (modalType === "create") {
      setServices(prev => [...prev, serviceData]);
      message.success("Dịch vụ mới đã được tạo!");
    } else {
      setServices(prev => prev.map(service => 
        service.id === selectedService.id ? { ...service, ...serviceData } : service
      ));
      message.success("Dịch vụ đã được cập nhật!");
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Mã dịch vụ",
      dataIndex: "id",
      key: "id",
      render: (id) => <Tag color="blue">{id}</Tag>
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image 
          width={60} 
          height={40} 
          src={image} 
          fallback="/images/default-service.jpg"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      )
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      render: (name) => <div className="font-semibold">{name}</div>
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="green">{category}</Tag>
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => toggleServiceStatus(record.id)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm dừng"
        />
      )
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => viewService(record)}
          >
            Xem
          </Button>
          <Button 
            size="small" 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => editService(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa dịch vụ"
            description="Bạn có chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => deleteService(record.id)}
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
      )
    }
  ];

  return (
    <div>
      {/* Header & Actions */}
      <Card className="mb-6 shadow-md">
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Search
              placeholder="Tìm kiếm dịch vụ, mã dịch vụ, danh mục..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col span={12} className="text-right">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="large"
              onClick={createService}
            >
              Thêm Dịch Vụ Mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Services Table */}
      <Card title="Danh Sách Dịch Vụ" className="shadow-md">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={
          modalType === "create" ? "Thêm Dịch Vụ Mới" :
          modalType === "edit" ? "Chỉnh Sửa Dịch Vụ" : "Chi Tiết Dịch Vụ"
        }
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
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {modalType === "create" ? "Tạo Dịch Vụ" : "Cập Nhật"}
          </Button>
        ]}
        width={700}
      >
        {modalType === "view" && selectedService && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã dịch vụ">{selectedService.id}</Descriptions.Item>
            <Descriptions.Item label="Tên dịch vụ">{selectedService.name}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{selectedService.description}</Descriptions.Item>
            <Descriptions.Item label="Giá">
              {selectedService.price.toLocaleString('vi-VN')} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian">{selectedService.duration}</Descriptions.Item>
            <Descriptions.Item label="Danh mục">{selectedService.category}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedService.isActive ? "green" : "red"}>
                {selectedService.isActive ? "Hoạt động" : "Tạm dừng"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{selectedService.createdDate}</Descriptions.Item>
          </Descriptions>
        )}

        {(modalType === "create" || modalType === "edit") && (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên dịch vụ"
                  rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Mô tả dịch vụ"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Giá dịch vụ (VNĐ)"
                  rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                >
                  <InputNumber 
                    size="large"
                    style={{ width: "100%" }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="duration"
                  label="Thời gian điều trị"
                  rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
                >
                  <Input size="large" placeholder="VD: 2-3 tháng" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="isActive"
                  label="Trạng thái"
                  valuePropName="checked"
                >
                  <Switch 
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Tạm dừng"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Hình ảnh">
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                  >
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ServiceManagement; 