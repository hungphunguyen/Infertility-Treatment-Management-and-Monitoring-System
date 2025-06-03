import React, { useState } from "react";
import { 
  Card, Table, Tag, Button, Typography, Statistic, 
  Row, Col, Steps, Modal, Form, Radio, Input, Space,
  Divider, Descriptions, Alert, Tabs
} from "antd";
import {
  DollarOutlined, CreditCardOutlined, BankOutlined,
  QrcodeOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
  HistoryOutlined, FileTextOutlined, PrinterOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const Payment = () => {
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [form] = Form.useForm();
  
  // Mock data for invoices
  const invoices = [
    {
      id: "INV001",
      serviceId: "SV001",
      serviceName: "Tư vấn Ban đầu",
      amount: 500000,
      status: "paid",
      dueDate: "2024-01-15",
      paidDate: "2024-01-15",
      paymentMethod: "Thẻ tín dụng",
      remainingBalance: 0
    },
    {
      id: "INV002",
      serviceId: "SV002",
      serviceName: "IVF Tiêu chuẩn - Đợt 1",
      amount: 35000000,
      status: "paid",
      dueDate: "2024-01-12",
      paidDate: "2024-01-12",
      paymentMethod: "Chuyển khoản",
      remainingBalance: 0
    },
    {
      id: "INV003",
      serviceId: "SV002",
      serviceName: "IVF Tiêu chuẩn - Đợt 2",
      amount: 35000000,
      status: "pending",
      dueDate: "2024-01-25",
      paidDate: null,
      paymentMethod: null,
      remainingBalance: 35000000
    },
    {
      id: "INV004",
      serviceId: "SV003",
      serviceName: "Xét nghiệm Di truyền",
      amount: 8000000,
      status: "overdue",
      dueDate: "2024-01-19",
      paidDate: null,
      paymentMethod: null,
      remainingBalance: 8000000
    }
  ];

  // Calculate statistics
  const stats = {
    totalSpent: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0),
    pendingPayment: invoices.filter(i => i.status !== "paid").reduce((sum, i) => sum + i.amount, 0),
    paidInvoices: invoices.filter(i => i.status === "paid").length,
    pendingInvoices: invoices.filter(i => i.status === "pending").length,
    overdueInvoices: invoices.filter(i => i.status === "overdue").length
  };

  // Filter invoices by status
  const getInvoicesByStatus = (status) => {
    if (status === "all") return invoices;
    return invoices.filter(invoice => invoice.status === status);
  };

  // Get status tag
  const getStatusTag = (status) => {
    const statusMap = {
      paid: { color: "green", text: "Đã thanh toán" },
      pending: { color: "orange", text: "Chờ thanh toán" },
      overdue: { color: "red", text: "Quá hạn" }
    };
    
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  // Open payment modal
  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentModalVisible(true);
  };

  // Handle payment
  const handlePayment = (values) => {
    console.log("Payment for invoice:", selectedInvoice.id, values);
    setPaymentModalVisible(false);
    setConfirmModalVisible(true);
  };

  // View receipt
  const viewReceipt = (invoice) => {
    setSelectedInvoice(invoice);
    setReceiptModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "id",
      key: "id",
      render: id => <Text strong>{id}</Text>
    },
    {
      title: "Dịch vụ",
      key: "service",
      render: (_, record) => (
        <div>
          <div><Text strong>{record.serviceName}</Text></div>
          <div><Tag color="blue">{record.serviceId}</Tag></div>
        </div>
      )
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: amount => (
        <Text strong style={{ color: '#52c41a' }}>
          {amount.toLocaleString('vi-VN')} VNĐ
        </Text>
      )
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      render: date => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: status => getStatusTag(status)
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.status === "paid" ? (
            <Button 
              size="small" 
              icon={<FileTextOutlined />}
              onClick={() => viewReceipt(record)}
            >
              Xem biên lai
            </Button>
          ) : (
            <Button 
              size="small" 
              type="primary" 
              icon={<DollarOutlined />}
              onClick={() => openPaymentModal(record)}
            >
              Thanh toán
            </Button>
          )}
        </Space>
      )
    }
  ];

  // Payment methods
  const paymentMethods = [
    {
      key: "bank_transfer",
      title: "Chuyển khoản ngân hàng",
      icon: <BankOutlined />,
      description: "Chuyển khoản trực tiếp đến tài khoản ngân hàng của chúng tôi"
    },
    {
      key: "credit_card",
      title: "Thẻ tín dụng/ghi nợ",
      icon: <CreditCardOutlined />,
      description: "Thanh toán an toàn bằng thẻ tín dụng hoặc thẻ ghi nợ"
    },
    {
      key: "qr_code",
      title: "Quét mã QR",
      icon: <QrcodeOutlined />,
      description: "Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử"
    }
  ];

  return (
    <div>
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã thanh toán"
              value={stats.totalSpent}
              formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Chờ thanh toán"
              value={stats.pendingPayment}
              formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
              valueStyle={{ color: stats.pendingPayment > 0 ? '#fa8c16' : '#52c41a' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Statistic
                title="Hóa đơn đã trả"
                value={stats.paidInvoices}
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="Chờ thanh toán"
                value={stats.pendingInvoices}
                valueStyle={{ color: '#fa8c16' }}
              />
              <Statistic
                title="Quá hạn"
                value={stats.overdueInvoices}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Invoices */}
      <Card>
        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: "all",
              label: "Tất cả hóa đơn",
              children: (
                <Table
                  columns={columns}
                  dataSource={getInvoicesByStatus("all")}
                  rowKey="id"
                  pagination={false}
                />
              )
            },
            {
              key: "pending",
              label: (
                <span>
                  Chờ thanh toán
                  <Tag color="orange" style={{ marginLeft: 8 }}>
                    {stats.pendingInvoices + stats.overdueInvoices}
                  </Tag>
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={[...getInvoicesByStatus("pending"), ...getInvoicesByStatus("overdue")]}
                  rowKey="id"
                  pagination={false}
                />
              )
            },
            {
              key: "paid",
              label: "Đã thanh toán",
              children: (
                <Table
                  columns={columns}
                  dataSource={getInvoicesByStatus("paid")}
                  rowKey="id"
                  pagination={false}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Payment Information */}
      <Card title="Thông tin thanh toán" style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>Tài khoản ngân hàng</Title>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên tài khoản">CÔNG TY TNHH ĐIỀU TRỊ VÔ SINH ABC</Descriptions.Item>
            <Descriptions.Item label="Số tài khoản">1234 5678 9012 3456</Descriptions.Item>
            <Descriptions.Item label="Ngân hàng">Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)</Descriptions.Item>
            <Descriptions.Item label="Chi nhánh">TP. Hồ Chí Minh</Descriptions.Item>
            <Descriptions.Item label="Nội dung chuyển khoản">
              <Text type="danger">
                [Mã hóa đơn] [Họ và tên khách hàng]
                <br />
                Ví dụ: INV003 NGUYEN PHU LAM
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
        
        <Alert
          message="Lưu ý quan trọng về thanh toán"
          description="Vui lòng thanh toán đúng hạn để đảm bảo dịch vụ được tiến hành theo kế hoạch. Hóa đơn thanh toán sẽ được gửi qua email sau khi thanh toán thành công."
          type="info"
          showIcon
        />
      </Card>

      {/* Payment Modal */}
      <Modal
        title="Thanh toán hóa đơn"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedInvoice && (
          <div>
            <Descriptions title="Thông tin hóa đơn" bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Mã hóa đơn">{selectedInvoice.id}</Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">{selectedInvoice.serviceName}</Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <Text strong style={{ color: '#52c41a' }}>
                  {selectedInvoice.amount.toLocaleString('vi-VN')} VNĐ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Hạn thanh toán">
                {dayjs(selectedInvoice.dueDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                {getStatusTag(selectedInvoice.status)}
              </Descriptions.Item>
            </Descriptions>

            <Form
              form={form}
              layout="vertical"
              onFinish={handlePayment}
              initialValues={{ paymentMethod }}
            >
              <Form.Item
                label="Phương thức thanh toán"
                name="paymentMethod"
                rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
              >
                <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)}>
                  <Space direction="vertical">
                    {paymentMethods.map(method => (
                      <Radio key={method.key} value={method.key}>
                        <Space>
                          {method.icon}
                          <div>
                            <div><Text strong>{method.title}</Text></div>
                            <div><Text type="secondary">{method.description}</Text></div>
                          </div>
                        </Space>
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>

              {paymentMethod === "bank_transfer" && (
                <Alert
                  message="Hướng dẫn chuyển khoản"
                  description={
                    <div>
                      <p>Vui lòng chuyển khoản với thông tin sau:</p>
                      <p>Tên tài khoản: CÔNG TY TNHH ĐIỀU TRỊ VÔ SINH ABC</p>
                      <p>Số tài khoản: 1234 5678 9012 3456</p>
                      <p>Ngân hàng: Vietcombank - Chi nhánh TP. HCM</p>
                      <p>
                        <Text strong type="danger">
                          Nội dung chuyển khoản: {selectedInvoice.id} NGUYEN PHU LAM
                        </Text>
                      </p>
                      <p>Sau khi chuyển khoản, vui lòng nhấn "Xác nhận đã thanh toán" và cung cấp thông tin chuyển khoản.</p>
                    </div>
                  }
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

              {paymentMethod === "credit_card" && (
                <>
                  <Form.Item
                    label="Số thẻ"
                    name="cardNumber"
                    rules={[{ required: true, message: "Vui lòng nhập số thẻ" }]}
                  >
                    <Input placeholder="1234 5678 9012 3456" />
                  </Form.Item>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Ngày hết hạn"
                        name="expiryDate"
                        rules={[{ required: true, message: "Vui lòng nhập ngày hết hạn" }]}
                      >
                        <Input placeholder="MM/YY" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="CVV/CVC"
                        name="cvv"
                        rules={[{ required: true, message: "Vui lòng nhập mã bảo mật" }]}
                      >
                        <Input placeholder="123" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    label="Tên chủ thẻ"
                    name="cardholderName"
                    rules={[{ required: true, message: "Vui lòng nhập tên chủ thẻ" }]}
                  >
                    <Input placeholder="NGUYEN PHU LAM" />
                  </Form.Item>
                </>
              )}

              {paymentMethod === "qr_code" && (
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src="https://example.com/qr-placeholder.png" 
                    alt="QR Code" 
                    style={{ width: 200, height: 200, margin: '0 auto' }} 
                  />
                  <div style={{ marginTop: 16 }}>
                    <Text>Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử để thanh toán</Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text strong type="danger">
                      Số tiền: {selectedInvoice.amount.toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </div>
                </div>
              )}

              <Divider />
              
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => setPaymentModalVisible(false)}>
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {paymentMethod === "bank_transfer" ? "Xác nhận đã thanh toán" : "Thanh toán ngay"}
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Xác nhận thanh toán"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
          <Title level={4} style={{ marginTop: 16 }}>Thanh toán thành công!</Title>
          <Paragraph>
            Cảm ơn bạn đã thanh toán. Hóa đơn của bạn đã được cập nhật và chúng tôi đã gửi biên lai đến email của bạn.
          </Paragraph>
        </div>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        title="Biên lai thanh toán"
        open={receiptModalVisible}
        onCancel={() => setReceiptModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In biên lai
          </Button>,
          <Button key="download" icon={<DownloadOutlined />}>
            Tải xuống
          </Button>,
          <Button key="close" onClick={() => setReceiptModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedInvoice && (
          <div id="receipt-content">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={3}>BIÊN LAI THANH TOÁN</Title>
              <Text strong>Mã biên lai: {selectedInvoice.id}-RCPT</Text>
            </div>
            
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Text strong>Khách hàng:</Text>
                <div>Phú Lâm Nguyên</div>
                <div>phulamnguyên@email.com</div>
                <div>0901234567</div>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Ngày thanh toán:</Text>
                <div>{selectedInvoice.paidDate ? dayjs(selectedInvoice.paidDate).format("DD/MM/YYYY") : "N/A"}</div>
                <Text strong>Phương thức:</Text>
                <div>{selectedInvoice.paymentMethod || "N/A"}</div>
              </Col>
            </Row>
            
            <Divider />
            
            <div style={{ marginBottom: 24 }}>
              <Table
                columns={[
                  { title: "Dịch vụ", dataIndex: "serviceName", key: "serviceName" },
                  { 
                    title: "Đơn giá", 
                    dataIndex: "amount", 
                    key: "amount",
                    render: (amount) => `${amount.toLocaleString('vi-VN')} VNĐ`
                  },
                  { title: "Số lượng", key: "quantity", render: () => "1" },
                  { 
                    title: "Thành tiền", 
                    key: "total",
                    render: (_, record) => `${record.amount.toLocaleString('vi-VN')} VNĐ`
                  }
                ]}
                dataSource={[selectedInvoice]}
                pagination={false}
                rowKey="id"
                bordered
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3} align="right">
                        <Text strong>Tổng cộng:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong style={{ color: '#52c41a' }}>
                          {selectedInvoice.amount.toLocaleString('vi-VN')} VNĐ
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
            
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Text strong>Ghi chú:</Text>
                <div>Đã thanh toán đầy đủ. Cảm ơn quý khách đã sử dụng dịch vụ.</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 40 }}>
                  <Text strong>Người lập biên lai</Text>
                </div>
                <div>Nguyễn Thị Thu Hà</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payment; 