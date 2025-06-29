import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Modal,
  Descriptions,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Spin,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const PatientList = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await authService.getMyInfo();
        const id = res?.data?.result?.id;
        const name = res?.data?.result?.fullName;
        if (id) {
          setDoctorId(id);
          setDoctorName(name);
        } else {
          message.error("Không thể lấy thông tin bác sĩ");
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error);
        message.error("Không thể lấy thông tin bác sĩ");
      }
    };
    fetchDoctorInfo();
  }, []);

  useEffect(() => {
    if (!doctorId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = dayjs().format("YYYY-MM-DD");
        // Gọi song song 2 API
        const [appointmentsRes, treatmentRecordsRes] = await Promise.all([
          treatmentService.getDoctorAppointmentsByDate(doctorId, today),
          treatmentService.getTreatmentRecordsByDoctor(doctorId),
        ]);
        
        // Đảm bảo appointments là array
        let appointments = [];
        if (appointmentsRes?.data?.result) {
          if (Array.isArray(appointmentsRes.data.result)) {
            appointments = appointmentsRes.data.result;
          } else if (appointmentsRes.data.result.content && Array.isArray(appointmentsRes.data.result.content)) {
            appointments = appointmentsRes.data.result.content;
          } else {
            console.warn('Appointments data format không đúng:', appointmentsRes.data.result);
            appointments = [];
          }
        }
        
        // Đảm bảo treatmentRecords là array
        let treatmentRecords = [];
        if (Array.isArray(treatmentRecordsRes)) {
          treatmentRecords = treatmentRecordsRes;
        } else if (treatmentRecordsRes?.data?.result) {
          if (Array.isArray(treatmentRecordsRes.data.result)) {
            treatmentRecords = treatmentRecordsRes.data.result;
          } else if (treatmentRecordsRes.data.result.content && Array.isArray(treatmentRecordsRes.data.result.content)) {
            treatmentRecords = treatmentRecordsRes.data.result.content;
          }
        }
        
        console.log('📅 Appointments:', appointments);
        console.log('📋 Treatment Records:', treatmentRecords);
        
        // Lọc: chỉ giữ lịch hẹn mà bệnh nhân có treatment record hợp lệ
        const filtered = appointments.filter((appt) => {
          return treatmentRecords.some(
            (record) =>
              (record.customerId === appt.customerId ||
                record.customerName === appt.customerName) &&
              record.status !== "PENDING" &&
              record.status !== "CANCELLED"
          );
        });
        
        console.log('✅ Filtered patients:', filtered);
        setPatients(filtered);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Có lỗi xảy ra khi lấy dữ liệu bệnh nhân");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  // Filter data
  const filteredData = patients.filter((patient) => {
    const matchesSearch =
      patient.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.id.toString().includes(searchText);
    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusTag = (status) => {
    const statusMap = {
      CONFIRMED: { color: "blue", text: "Đã xác nhận" },
      PENDING: { color: "orange", text: "Chờ xác nhận" },
      REJECTED_CHANGE: { color: "red", text: "Từ chối thay đổi" },
      CANCELLED: { color: "red", text: "Đã hủy" },
      COMPLETED: { color: "green", text: "Đã hoàn thành" },
      INPROGRESS: { color: "blue", text: "Đang thực hiện" },
    };
    return (
      <Tag color={statusMap[status]?.color}>
        {statusMap[status]?.text || status}
      </Tag>
    );
  };

  const handleDetail = async (record) => {
    try {
      console.log('🔍 Bắt đầu tìm treatment record cho appointment:', record);
      
      // Lấy tất cả treatment records của bác sĩ
      const treatmentRecordsResponse = await treatmentService.getAllTreatmentRecordsByDoctor(doctorId);
      const treatmentRecords = treatmentRecordsResponse?.data?.result?.content || treatmentRecordsResponse?.data?.result || [];
      
      console.log('🔍 Tất cả treatment records:', treatmentRecords);
      console.log('📅 Appointment cần tìm:', record);
      
      // Lọc treatment records theo customer trước
      const customerTreatmentRecords = treatmentRecords.filter(
        (r) =>
          (record.customerId && r.customerId === record.customerId) ||
          (record.customerName && r.customerName === record.customerName)
      );
      
      console.log('🔍 Treatment records của customer:', customerTreatmentRecords);
      
      // Tìm treatment record có step khớp với appointment
      let matchedTreatmentRecord = null;
      
      for (const treatmentRecord of customerTreatmentRecords) {
        // Kiểm tra từng step trong treatment record
        if (treatmentRecord.treatmentSteps && Array.isArray(treatmentRecord.treatmentSteps)) {
          const matchingStep = treatmentRecord.treatmentSteps.find(step => {
            // Khớp theo ngày
            const dateMatch = step.scheduledDate === record.appointmentDate;
            
            // Nếu appointment có purpose/service name thì match theo name
            const hasPurpose = record.purpose || record.serviceName || record.treatmentServiceName;
            let nameMatch = false;
            
            if (hasPurpose) {
              nameMatch = step.name === record.purpose || 
                         step.name === record.serviceName ||
                         step.name === record.treatmentServiceName;
            } else {
              // Nếu không có purpose, chỉ match theo date
              nameMatch = true;
            }
            
            console.log(`🔍 Kiểm tra step: ${step.name} (${step.scheduledDate}) vs appointment: ${record.purpose} (${record.appointmentDate})`);
            console.log(`📅 Date match: ${dateMatch}, Name match: ${nameMatch}, Has purpose: ${hasPurpose}`);
            
            return dateMatch && nameMatch;
          });
          
          if (matchingStep) {
            matchedTreatmentRecord = treatmentRecord;
            console.log('✅ Tìm thấy treatment record khớp:', matchedTreatmentRecord);
            console.log('✅ Step khớp:', matchingStep);
            break;
          }
        } else {
          // Nếu treatment record không có steps, gọi API lấy chi tiết
          console.log(`⚠️ Treatment record ${treatmentRecord.id} không có treatmentSteps, gọi API lấy chi tiết...`);
          try {
            const detailRes = await treatmentService.getTreatmentRecordById(treatmentRecord.id);
            const detailedRecord = detailRes?.data?.result;
            
            if (detailedRecord && detailedRecord.treatmentSteps && Array.isArray(detailedRecord.treatmentSteps)) {
              console.log(`📋 Treatment record ${treatmentRecord.id} có ${detailedRecord.treatmentSteps.length} steps sau khi gọi API`);
              
              const matchingStep = detailedRecord.treatmentSteps.find(step => {
                // Khớp theo ngày
                const dateMatch = step.scheduledDate === record.appointmentDate;
                
                // Nếu appointment có purpose/service name thì match theo name
                const hasPurpose = record.purpose || record.serviceName || record.treatmentServiceName;
                let nameMatch = false;
                
                if (hasPurpose) {
                  nameMatch = step.name === record.purpose || 
                             step.name === record.serviceName ||
                             step.name === record.treatmentServiceName;
                } else {
                  // Nếu không có purpose, chỉ match theo date
                  nameMatch = true;
                }
                
                console.log(`🔍 Kiểm tra step: ${step.name} (${step.scheduledDate}) vs appointment: ${record.purpose} (${record.appointmentDate})`);
                console.log(`📅 Date match: ${dateMatch}, Name match: ${nameMatch}, Has purpose: ${hasPurpose}`);
                
                return dateMatch && nameMatch;
              });
              
              if (matchingStep) {
                matchedTreatmentRecord = detailedRecord;
                console.log('✅ Tìm thấy treatment record khớp:', matchedTreatmentRecord);
                console.log('✅ Step khớp:', matchingStep);
                break;
              }
            }
          } catch (error) {
            console.error(`❌ Lỗi khi gọi API lấy chi tiết treatment record ${treatmentRecord.id}:`, error);
          }
        }
      }
      
      // Nếu không tìm thấy theo step, tìm theo customer và service (fallback)
      if (!matchedTreatmentRecord) {
        console.log('⚠️ Không tìm thấy theo step, tìm theo customer và service...');
        
        if (customerTreatmentRecords.length > 0) {
          // Nếu có nhiều records, cần logic phân biệt
          if (customerTreatmentRecords.length === 1) {
            // Chỉ có 1 record → dùng luôn
            matchedTreatmentRecord = customerTreatmentRecords[0];
            console.log('✅ Chỉ có 1 treatment record cho customer, dùng luôn:', matchedTreatmentRecord);
          } else {
            // Có nhiều records → cần logic phân biệt
            console.log('⚠️ Có nhiều treatment records cho customer, cần logic phân biệt...');
            
            // Thử tìm theo service name nếu có
            if (record.purpose || record.serviceName || record.treatmentServiceName) {
              const serviceMatch = customerTreatmentRecords.find(r =>
                r.purpose === record.purpose ||
                r.serviceName === record.serviceName ||
                r.treatmentServiceName === record.purpose ||
                r.treatmentServiceName === record.serviceName
              );
              
              if (serviceMatch) {
                matchedTreatmentRecord = serviceMatch;
                console.log('✅ Tìm thấy theo service match:', matchedTreatmentRecord);
              }
            }
            
            // Nếu vẫn không tìm thấy, thử logic phân biệt thông minh
            if (!matchedTreatmentRecord) {
              console.log('🔍 Thử logic phân biệt thông minh...');
              
              // 1. Thử tìm theo ngày gần nhất với appointment date
              const appointmentDate = new Date(record.appointmentDate);
              const sortedByDate = customerTreatmentRecords.sort((a, b) => {
                const dateA = new Date(a.startDate || a.createdDate);
                const dateB = new Date(b.startDate || b.createdDate);
                const diffA = Math.abs(dateA - appointmentDate);
                const diffB = Math.abs(dateB - appointmentDate);
                return diffA - diffB;
              });
              
              console.log('📅 Sắp xếp theo ngày gần nhất:', sortedByDate.map(r => ({ id: r.id, startDate: r.startDate, createdDate: r.createdDate })));
              
              // 2. Thử tìm theo status (ưu tiên INPROGRESS > CONFIRMED > COMPLETED)
              const statusPriority = ['INPROGRESS', 'CONFIRMED', 'COMPLETED', 'PLANNED'];
              let statusMatch = null;
              
              for (const status of statusPriority) {
                statusMatch = customerTreatmentRecords.find(r => r.status === status);
                if (statusMatch) {
                  console.log(`✅ Tìm thấy theo status ${status}:`, statusMatch);
                  break;
                }
              }
              
              // 3. Quyết định cuối cùng
              if (statusMatch) {
                matchedTreatmentRecord = statusMatch;
                console.log('✅ Chọn theo status priority:', matchedTreatmentRecord);
              } else if (sortedByDate.length > 0) {
                matchedTreatmentRecord = sortedByDate[0];
                console.log('✅ Chọn theo ngày gần nhất:', matchedTreatmentRecord);
              } else {
                // Cuối cùng mới báo lỗi
                message.error(
                  `Bệnh nhân ${record.customerName} có ${customerTreatmentRecords.length} hồ sơ điều trị. Không thể xác định hồ sơ nào tương ứng với lịch hẹn này!`
                );
                return;
              }
            }
          }
        }
      }
      
      console.log('🎯 Treatment record cuối cùng:', matchedTreatmentRecord);
      
      if (matchedTreatmentRecord) {
        // Gọi API lấy chi tiết treatment record (bao gồm các bước)
        const detailRes = await treatmentService.getTreatmentRecordById(matchedTreatmentRecord.id);
        const detail = detailRes?.data?.result;
        
        console.log('📋 Treatment record chi tiết:', detail);
        
        if (detail) {
          navigate("/doctor-dashboard/treatment-stages", {
            state: {
              patientInfo: {
                customerId: detail.customerId,
                customerName: detail.customerName,
              },
              treatmentData: detail, // truyền treatment record chi tiết (có steps)
              sourcePage: "patients",
              appointmentData: record
            },
          });
        } else {
          message.error("Không lấy được chi tiết hồ sơ điều trị!");
        }
      } else {
        message.error(
          "Không tìm thấy hồ sơ điều trị hợp lệ cho bệnh nhân này!"
        );
      }
    } catch (error) {
      console.error("Error in handleDetail:", error);
      message.error("Có lỗi xảy ra khi tìm hồ sơ điều trị!");
    }
  };

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ marginRight: 12, backgroundColor: "#1890ff" }}
          />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.customerEmail}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày khám",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ca khám",
      dataIndex: "shift",
      key: "shift",
      render: (shift) => (
        <Tag color="cyan">
          {shift === "MORNING"
            ? "Sáng"
            : shift === "AFTERNOON"
            ? "Chiều"
            : shift}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (record) => getStatusTag(record.status),
    },
    {
      title: "Dịch vụ",
      key: "serviceName",
      render: (record) => {
        // Hiển thị dịch vụ theo thứ tự ưu tiên
        const serviceName = record.purpose || 
                           record.serviceName || 
                           record.treatmentServiceName ||
                           record.treatmentService?.name ||
                           "Chưa có";
        return (
          <Tag color="purple">
            {serviceName}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => handleDetail(record)}
          >
            Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Filters */}
      <Card
        className="mb-6"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: 12,
          border: "none",
        }}
      >
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm tên hoặc ID bệnh nhân..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%", borderRadius: 8 }}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%", borderRadius: 8 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="PENDING">Chờ xác nhận</Option>
              <Option value="REJECTED_CHANGE">Từ chối thay đổi</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={10} style={{ textAlign: "right" }}>
            <Text type="secondary">Tổng: {filteredData.length} bệnh nhân</Text>
          </Col>
        </Row>
      </Card>

      {/* Patient Table */}
      <Card
        title={
          <span style={{ fontWeight: 600, fontSize: 20, color: "#1890ff" }}>
            Danh Sách Bệnh Nhân Hôm Nay
          </span>
        }
        style={{
          boxShadow: "0 4px 16px rgba(24,144,255,0.08)",
          borderRadius: 16,
          border: "none",
          marginBottom: 24,
        }}
      >
        <Spin spinning={loading}>
          {filteredData.length === 0 ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "#888",
                fontSize: 16,
              }}
            >
              <p>Không có bệnh nhân nào cần điều trị hôm nay.</p>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
              bordered
              style={{ borderRadius: 12, overflow: "hidden" }}
            />
          )}
        </Spin>
      </Card>

      {/* Patient Detail Modal */}
      <Modal
        title="Hồ Sơ Bệnh Nhân"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
        destroyOnHidden
      >
        {selectedPatient && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Họ tên">
              {selectedPatient.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedPatient.customerEmail}
            </Descriptions.Item>
            <Descriptions.Item label="Bác sĩ">
              {selectedPatient.doctorName}
            </Descriptions.Item>
            <Descriptions.Item label="Dịch vụ">
              {selectedPatient.serviceName || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(selectedPatient.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khám">
              {dayjs(selectedPatient.appointmentDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Ca khám">
              {selectedPatient.shift}
            </Descriptions.Item>
            <Descriptions.Item label="Mục đích">
              {selectedPatient.purpose || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {selectedPatient.notes || "Chưa có"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PatientList;
