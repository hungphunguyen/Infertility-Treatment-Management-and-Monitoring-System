import React, { useState, useEffect } from "react";
import { 
  Card, Table, Button, Space, Tag, Modal, Descriptions, 
  Row, Col, Input, Select, Typography, notification, Drawer
} from "antd";
import {
  UserOutlined, EyeOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const PatientRecords = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const navigate = useNavigate();
  const [historyDrawer, setHistoryDrawer] = useState({ open: false, patient: null });

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await authService.getMyInfo();
        const id = res?.data?.result?.id;
        if (id) {
          setDoctorId(id);
        } else {
          console.error("Không thể lấy thông tin bác sĩ");
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error);
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
          setRecords(result);
        } else {
          setRecords([]);
        }
      } catch (error) {
        console.error('Error fetching treatment records:', error);
        setRecords([]);
      }
    };

    fetchRecords();
  }, [doctorId]);

  const getStatusTag = (status) => {
    const statusMap = {
      PENDING: { color: "orange", text: "Đang chờ xử lý" },
      INPROGRESS: { color: "blue", text: "Đã xác nhận" },
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

  const handleApprove = async (record) => {
    try {
      const response = await treatmentService.updateTreatmentRecordStatus(record.id, "INPROGRESS");
      if (response?.data?.code === 1000) {
        notification.success({
          message: "Duyệt hồ sơ thành công!",
          description: `Hồ sơ của bệnh nhân ${record.customerName} đã chuyển sang trạng thái 'Đã xác nhận'.`,
        });
        // Refresh the list
        const updatedRecords = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        if (updatedRecords) {
          setRecords(updatedRecords);
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

  const handleCancel = async (record) => {
    try {
      const response = await treatmentService.updateTreatmentRecordStatus(record.id, "CANCELLED");
      if (response?.data?.code === 1000) {
        notification.success({
          message: "Hủy hồ sơ thành công!",
          description: `Hồ sơ của bệnh nhân ${record.customerName} đã được hủy.`,
        });
        // Refresh the list
        const updatedRecords = await treatmentService.getTreatmentRecordsByDoctor(doctorId);
        if (updatedRecords) {
          setRecords(updatedRecords);
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

  // Group records by customerId, prefer INPROGRESS or PENDING for display
  const groupedRecords = Object.values(records.reduce((acc, record) => {
    if (!acc[record.customerId]) {
      acc[record.customerId] = {
        ...record,
        history: [record]
      };
    } else {
      acc[record.customerId].history.push(record);
      // Pick the most recent INPROGRESS or PENDING record for display
      const current = acc[record.customerId];
      const isCurrentActive = ["INPROGRESS", "PENDING"].includes(current.status);
      const isNewActive = ["INPROGRESS", "PENDING"].includes(record.status);
      if (
        (isNewActive && !isCurrentActive) ||
        (isNewActive && isCurrentActive && new Date(record.createdDate) > new Date(current.createdDate)) ||
        (!isNewActive && !isCurrentActive && new Date(record.createdDate) > new Date(current.createdDate))
      ) {
        acc[record.customerId] = {
          ...record,
          history: acc[record.customerId].history
        };
      }
    }
    return acc;
  }, {}));

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: "Dịch vụ",
      dataIndex: "treatmentServiceName",
      key: "treatmentServiceName",
      render: (service) => <Tag color="purple">{service}</Tag>
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status)
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => viewRecord(record)}
          >
            Chi Tiết
          </Button>
          <Button
            size="small"
            onClick={() => setHistoryDrawer({ open: true, patient: record })}
          >
            Lịch sử
          </Button>
          {record.status === "PENDING" && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleApprove(record)}
              style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
            >
              Duyệt
            </Button>
          )}
        </Space>
      ),
    }
  ];

  const filteredData = records.filter(record => {
    const matchesSearch = record.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         record.id.toString().includes(searchText);
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Card title="Hồ Sơ Bệnh Nhân">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm tên hoặc ID bệnh nhân..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING">Đang chờ xử lý</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="CANCELLED">Đã hủy</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
            </Select>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={groupedRecords}
          rowKey="customerId"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>

      <Modal
        title="Chi Tiết Hồ Sơ"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="ID">{selectedRecord.id}</Descriptions.Item>
            <Descriptions.Item label="Bệnh nhân">{selectedRecord.customerName}</Descriptions.Item>
            <Descriptions.Item label="Dịch vụ">{selectedRecord.treatmentServiceName}</Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">{dayjs(selectedRecord.startDate).format("DD/MM/YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{getStatusTag(selectedRecord.status)}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{dayjs(selectedRecord.createdDate).format("DD/MM/YYYY")}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Drawer
        title={`Lịch sử điều trị - ${historyDrawer.patient?.customerName || ''}`}
        open={historyDrawer.open}
        onClose={() => setHistoryDrawer({ open: false, patient: null })}
        width={600}
      >
        {historyDrawer.patient && (
          <Table
            columns={[
              { title: 'Dịch vụ', dataIndex: 'treatmentServiceName', key: 'service' },
              { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', render: (date) => dayjs(date).format('DD/MM/YYYY') },
              { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: getStatusTag },
              { title: 'Ngày tạo', dataIndex: 'createdDate', key: 'createdDate', render: (date) => dayjs(date).format('DD/MM/YYYY') },
            ]}
            dataSource={historyDrawer.patient.history}
            rowKey="id"
            pagination={false}
            size="small"
            bordered
          />
        )}
      </Drawer>
    </div>
  );
};

export default PatientRecords; 