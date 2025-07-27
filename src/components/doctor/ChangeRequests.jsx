import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Input,
  Spin,
  Space,
  Typography,
  Descriptions,
  Avatar,
  Timeline,
  Divider,
} from "antd";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { http } from "../../service/config";
import dayjs from "dayjs";
import {
  UserOutlined,
  CalendarOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { NotificationContext } from "../../App";

const { Text } = Typography;

const ChangeRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const { showNotification } = useContext(NotificationContext);
  const [actionType, setActionType] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // backend page = 0-based
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await authService.getMyInfo();
        setDoctorId(res?.data?.result?.id);
      } catch {}
    };
    fetchDoctor();
  }, []);

  useEffect(() => {
    if (doctorId) fetchRequests();
    // eslint-disable-next-line
  }, [doctorId]);

  const fetchRequests = async (page = 0) => {
    setLoading(true);
    try {
      // Bước 1: Lấy danh sách PENDING_CHANGE appointments cho doctor này
      const changeRequestsResponse = await treatmentService.getAppointments({
        status: "PENDING_CHANGE",
        doctorId: doctorId,
        page,
        size: 5,
      });
      setCurrentPage(page);
      setTotalPages(changeRequestsResponse.data.result.totalPages);
      const pendingChangeAppointments =
        changeRequestsResponse?.data?.result?.content || [];
      console.log(
        "✅ PENDING_CHANGE appointments found for doctor:",
        pendingChangeAppointments.length
      );

      // Bước 2: Lấy thông tin chi tiết cho từng PENDING_CHANGE appointment
      const detailedChangeRequests = [];
      for (const appointment of pendingChangeAppointments) {
        try {
          const detailResponse = await http.get(
            `v1/appointments/${appointment.id}`
          );
          const detailData = detailResponse?.data?.result;
          if (detailData) {
            // Merge thông tin từ cả 2 API
            const mergedData = {
              ...appointment,
              ...detailData,
              customerName: detailData.customerName || appointment.customerName,
              doctorName: detailData.doctorName || appointment.doctorName,
              appointmentDate:
                detailData.appointmentDate || appointment.appointmentDate,
              shift: detailData.shift || appointment.shift,
              purpose: appointment.purpose,
              step: appointment.step,
              recordId: appointment.recordId,
              requestedDate:
                detailData.requestedDate || appointment.requestedDate,
              requestedShift:
                detailData.requestedShift || appointment.requestedShift,
            };
            detailedChangeRequests.push(mergedData);
          }
        } catch (error) {
          console.warn(
            `Failed to get details for appointment ${appointment.id}:`,
            error
          );
          // Fallback: sử dụng data từ API đầu tiên
          detailedChangeRequests.push(appointment);
        }
      }

      console.log(
        "✅ Detailed change requests loaded for doctor:",
        detailedChangeRequests.length
      );
      setRequests(detailedChangeRequests);
    } catch (err) {
      showNotification("Không thể tải yêu cầu đổi lịch!", "error");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const showDetail = (record) => {
    setSelected(record);
    setModalVisible(true);
    setActionType(null);
    setNotes("");
  };

  const handleApproveClick = (record) => {
    setSelected(record);
    setModalVisible(true);
    setActionType("CONFIRMED");
    setNotes("");
  };

  const handleRejectClick = (record) => {
    setSelected(record);
    setModalVisible(true);
    setActionType("REJECTED");
    setNotes("");
  };

  const handleAction = async () => {
    if (!notes || !notes.trim()) {
      showNotification("Vui lòng nhập ghi chú!", "error");
      return;
    }
    if (!selected) return;
    setActionLoading(true);
    try {
      await treatmentService.confirmAppointmentChange(selected.id, {
        status: actionType,
        note: notes,
      });
      showNotification(
        actionType === "CONFIRMED"
          ? "Đã duyệt yêu cầu!"
          : "Đã từ chối yêu cầu!",
        "success"
      );
      setModalVisible(false);
      fetchRequests();
    } catch (err) {
      showNotification("Không thể cập nhật yêu cầu!", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name, record) => (
        <Space>
          <div>
            <Text strong>{name}</Text>
            {record.customerEmail && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {record.customerEmail}
                </Text>
              </>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (name, record) => (
        <Space>
          <div>
            <Text strong>{name}</Text>
            {record.doctorEmail && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {record.doctorEmail}
                </Text>
              </>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Lịch hiện tại",
      key: "currentSchedule",
      render: (_, record) => (
        <div>
          <div>
            {record.appointmentDate
              ? dayjs(record.appointmentDate).format("DD/MM/YYYY")
              : ""}
          </div>
          <Tag color="blue">
            {record.shift === "MORNING"
              ? "Sáng"
              : record.shift === "AFTERNOON"
              ? "Chiều"
              : record.shift}
          </Tag>
        </div>
      ),
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestedDate",
      key: "requestedDate",
      render: (t) =>
        t ? (
          <Text style={{ color: "#faad14" }}>
            {dayjs(t).format("DD/MM/YYYY")}
          </Text>
        ) : (
          <Text type="secondary">Chưa có</Text>
        ),
    },
    {
      title: "Ca yêu cầu",
      dataIndex: "requestedShift",
      key: "requestedShift",
      render: (s) =>
        s ? (
          s === "MORNING" ? (
            "Sáng"
          ) : s === "AFTERNOON" ? (
            "Chiều"
          ) : (
            s
          )
        ) : (
          <Text type="secondary">Chưa có</Text>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <Space>
            <span>Yêu cầu đổi lịch hẹn từ khách hàng</span>
          </Space>
        }
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
        styles={{ body: { padding: 24 } }}
        hoverable
      >
        <Spin spinning={loading} tip="Đang tải...">
          <Table
            columns={columns}
            dataSource={requests}
            rowKey="id"
            pagination={false}
            bordered
            size="middle"
            style={{ background: "white", borderRadius: 8 }}
            scroll={{ x: "max-content" }}
          />
          <div className="flex justify-end mt-4">
            <Button
              disabled={currentPage === 0}
              onClick={() => fetchRequests(currentPage - 1)}
              className="mr-2"
            >
              Trang trước
            </Button>
            <span className="px-4 py-1 bg-gray-100 rounded text-sm">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => fetchRequests(currentPage + 1)}
              className="ml-2"
            >
              Trang tiếp
            </Button>
          </div>
        </Spin>
        <Modal
          title="Chi tiết yêu cầu đổi lịch"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          centered
          width={500}
        >
          {selected && (
            <div style={{ padding: 8 }}>
              <Descriptions
                column={1}
                size="small"
                bordered
                style={{ marginBottom: 16 }}
              >
                <Descriptions.Item label="Bệnh nhân">
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <Text strong>{selected.customerName}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Bác sĩ">
                  <Space>
                    <Avatar
                      style={{ background: "#a084ee" }}
                      icon={<UserOutlined />}
                    />
                    <Text strong>{selected.doctorName}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Lịch hiện tại">
                  <div>
                    {selected.appointmentDate
                      ? dayjs(selected.appointmentDate).format("DD/MM/YYYY")
                      : ""}
                  </div>
                  <Tag color="blue">
                    {selected.shift === "MORNING"
                      ? "Sáng"
                      : selected.shift === "AFTERNOON"
                      ? "Chiều"
                      : selected.shift}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày yêu cầu">
                  {selected.requestedDate ? (
                    <Text style={{ color: "#faad14" }}>
                      {dayjs(selected.requestedDate).format("DD/MM/YYYY")}
                    </Text>
                  ) : (
                    <Text type="secondary">Chưa có</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ca yêu cầu">
                  {selected.requestedShift ? (
                    selected.requestedShift === "MORNING" ? (
                      "Sáng"
                    ) : selected.requestedShift === "AFTERNOON" ? (
                      "Chiều"
                    ) : (
                      selected.requestedShift
                    )
                  ) : (
                    <Text type="secondary">Chưa có</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
              <Divider />
              <Input.TextArea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú bắt buộc"
                style={{ marginBottom: 16 }}
              />
              <Space style={{ width: "100%", justifyContent: "center" }}>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={actionLoading && actionType === "CONFIRMED"}
                  onClick={() => {
                    setActionType("CONFIRMED");
                    handleAction();
                  }}
                  style={{ minWidth: 120 }}
                >
                  Duyệt yêu cầu
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  loading={actionLoading && actionType === "REJECTED"}
                  onClick={() => {
                    setActionType("REJECTED");
                    handleAction();
                  }}
                  style={{ minWidth: 120 }}
                >
                  Từ chối yêu cầu
                </Button>
              </Space>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default ChangeRequests;
