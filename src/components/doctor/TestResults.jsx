import React, { useState, useEffect } from "react";
import { 
  Card, Table, Button, Space, Tag, Modal, Descriptions, 
  Row, Col, Input, Select, Typography, notification, Drawer,
  Collapse
} from "antd";
import {
  UserOutlined, EyeOutlined, DownOutlined, UpOutlined,
  CalendarOutlined, FileTextOutlined, MedicineBoxOutlined,
  CheckOutlined, CloseOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const TestResults = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await authService.getMyInfo();
        const id = res?.data?.result?.id;
        if (id) {
          setDoctorId(id);
        } else {
          notification.error({
            message: "Lỗi",
            description: "Không thể lấy thông tin bác sĩ"
          });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể lấy thông tin bác sĩ"
        });
      }
    };
    fetchDoctorInfo();
  }, []);

  useEffect(() => {
    if (!doctorId) return;

    const fetchRecords = async () => {
      try {
        const result = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        if (result) {
          // Nhóm các records theo customerId
          const groupedByCustomer = result.reduce((acc, record) => {
            if (!acc[record.customerId]) {
              acc[record.customerId] = [];
            }
            acc[record.customerId].push(record);
            return acc;
          }, {});

          // Chuyển đổi thành mảng và sắp xếp
          const formattedRecords = Object.entries(groupedByCustomer).map(([customerId, treatments]) => {
            // Sắp xếp treatments theo ngày tạo mới nhất
            const sortedTreatments = treatments.sort((a, b) => 
              new Date(b.createdDate) - new Date(a.createdDate)
            );
            
            return {
              key: customerId,
              customerId: customerId,
              customerName: sortedTreatments[0].customerName,
              treatments: sortedTreatments.map(treatment => ({
                ...treatment,
                key: treatment.id
              }))
            };
          });

          setRecords(formattedRecords);
        } else {
          setRecords([]);
        }
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể lấy danh sách điều trị"
        });
        setRecords([]);
      }
    };

    fetchRecords();
  }, [doctorId]);

  const getStatusTag = (status) => {
    const statusMap = {
      PENDING: { color: "orange", text: "Đang chờ xử lý" },
      INPROGRESS: { color: "blue", text: "Đang điều trị" },
      CANCELLED: { color: "red", text: "Đã hủy" },
      COMPLETED: { color: "green", text: "Hoàn thành" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const viewRecord = (record) => {
    navigate("/doctor-dashboard/treatment-stages", {
      state: {
        patientInfo: {
          customerId: record.customerId,
          customerName: record.customerName,
        },
        treatmentData: record,
      },
    });
  };

  const handleApprove = async (treatment) => {
    try {
      const response = await treatmentService.updateTreatmentRecordStatus(treatment.id, "INPROGRESS");
      if (response?.data?.code === 1000) {
        notification.success({
          message: "Duyệt hồ sơ thành công!",
          description: `Hồ sơ của bệnh nhân ${treatment.customerName} đã chuyển sang trạng thái 'Đang điều trị'.`,
        });
        // Refresh the list
        const updatedRecords = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        if (updatedRecords) {
          const groupedByCustomer = updatedRecords.reduce((acc, record) => {
            if (!acc[record.customerId]) {
              acc[record.customerId] = [];
            }
            acc[record.customerId].push(record);
            return acc;
          }, {});

          const formattedRecords = Object.entries(groupedByCustomer).map(([customerId, treatments]) => {
            const sortedTreatments = treatments.sort((a, b) => 
              new Date(b.createdDate) - new Date(a.createdDate)
            );
            
            return {
              key: customerId,
              customerId: customerId,
              customerName: sortedTreatments[0].customerName,
              treatments: sortedTreatments.map(treatment => ({
                ...treatment,
                key: treatment.id
              }))
            };
          });

          setRecords(formattedRecords);
        }
      } else {
        notification.error({
          message: "Duyệt hồ sơ thất bại!",
          description: response?.data?.message || "Không thể duyệt hồ sơ, vui lòng thử lại.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi duyệt hồ sơ!",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    }
  };

  const handleCancel = async (treatment) => {
    try {
      const response = await treatmentService.updateTreatmentRecordStatus(treatment.id, "CANCELLED");
      if (response?.data?.code === 1000) {
        notification.success({
          message: "Hủy hồ sơ thành công!",
          description: `Hồ sơ của bệnh nhân ${treatment.customerName} đã được hủy.`,
        });
        // Refresh the list
        const updatedRecords = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        if (updatedRecords) {
          const groupedByCustomer = updatedRecords.reduce((acc, record) => {
            if (!acc[record.customerId]) {
              acc[record.customerId] = [];
            }
            acc[record.customerId].push(record);
            return acc;
          }, {});

          const formattedRecords = Object.entries(groupedByCustomer).map(([customerId, treatments]) => {
            const sortedTreatments = treatments.sort((a, b) => 
              new Date(b.createdDate) - new Date(a.createdDate)
            );
            
            return {
              key: customerId,
              customerId: customerId,
              customerName: sortedTreatments[0].customerName,
              treatments: sortedTreatments.map(treatment => ({
                ...treatment,
                key: treatment.id
              }))
            };
          });

          setRecords(formattedRecords);
        }
      } else {
        notification.error({
          message: "Hủy hồ sơ thất bại!",
          description: response?.data?.message || "Không thể hủy hồ sơ, vui lòng thử lại.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi hủy hồ sơ!",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    }
  };

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: 'Dịch vụ',
        dataIndex: 'treatmentServiceName',
        key: 'treatmentServiceName',
        render: (text) => (
          <Space>
            <MedicineBoxOutlined style={{ color: '#722ed1' }} />
            <Text strong>{text}</Text>
          </Space>
        )
      },
      {
        title: 'Ngày bắt đầu',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (date) => (
          <Space>
            <CalendarOutlined />
            {dayjs(date).format("DD/MM/YYYY")}
          </Space>
        )
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status) => getStatusTag(status)
      },
      {
        title: 'Ghi chú',
        dataIndex: 'notes',
        key: 'notes',
        render: (notes) => notes || '-'
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_, treatment) => (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => viewRecord(treatment)}
            >
              Xem chi tiết
            </Button>
            {treatment.status === "PENDING" && (
              <>
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(treatment)}
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                >
                  Duyệt
                </Button>
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleCancel(treatment)}
                >
                  Hủy
                </Button>
              </>
            )}
          </Space>
        )
      }
    ];

    return (
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Table
          columns={columns}
          dataSource={record.treatments}
          pagination={false}
          size="small"
        />
      </Card>
    );
  };

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <Text strong>{name}</Text>
        </Space>
      )
    },
    {
      title: "Số dịch vụ",
      key: "treatmentCount",
      render: (_, record) => (
        <Tag color="blue">{record.treatments.length} dịch vụ</Tag>
      )
    },
    {
      title: "Dịch vụ mới nhất",
      key: "latestTreatment",
      render: (_, record) => (
        <Tag color="purple">{record.treatments[0].treatmentServiceName}</Tag>
      )
    },
    {
      title: "Trạng thái mới nhất",
      key: "latestStatus",
      render: (_, record) => getStatusTag(record.treatments[0].status)
    },
    {
      title: "Chi tiết",
      key: "expand",
      render: (_, record) => (
        <Button
          type="text"
          icon={expandedRows.includes(record.key) ? <UpOutlined /> : <DownOutlined />}
          onClick={() => {
            const newExpandedRows = expandedRows.includes(record.key)
              ? expandedRows.filter(key => key !== record.key)
              : [...expandedRows, record.key];
            setExpandedRows(newExpandedRows);
          }}
        >
          {expandedRows.includes(record.key) ? 'Thu gọn' : 'Xem thêm'}
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>
          <Space>
            <FileTextOutlined />
            Kết quả xét nghiệm
          </Space>
        </Title>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên bệnh nhân"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Lọc theo trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING">Đang chờ xử lý</Option>
              <Option value="INPROGRESS">Đang điều trị</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
        </Row>

        <Table
          dataSource={records.filter(record => {
            const matchesSearch = record.customerName.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = statusFilter === 'all' || 
              record.treatments.some(t => t.status === statusFilter);
            return matchesSearch && matchesStatus;
          })}
          columns={columns}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedRows,
            onExpand: (expanded, record) => {
              const newExpandedRows = expanded
                ? [...expandedRows, record.key]
                : expandedRows.filter(key => key !== record.key);
              setExpandedRows(newExpandedRows);
            }
          }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default TestResults; 