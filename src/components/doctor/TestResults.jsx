import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Descriptions,
  Row,
  Col,
  Input,
  Select,
  Typography,
  notification,
  Drawer,
  Collapse,
  Spin,
} from "antd";
import {
  UserOutlined,
  EyeOutlined,
  DownOutlined,
  UpOutlined,
  FileTextOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { authService } from "../../service/auth.service";
import { useNavigate } from "react-router-dom";
import TreatmentDetailRow from "./TreatmentDetailRow";

const { Text } = Typography;

const TestResults = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState([]);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRecords: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });

  const [currentPage, setCurrentPage] = useState(0); // backend page = 0-based
  const [totalPages, setTotalPages] = useState(1);

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
            description: "Không thể lấy thông tin bác sĩ",
          });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể lấy thông tin bác sĩ",
        });
      }
    };
    fetchDoctorInfo();
  }, []);
  const fetchDashboardStats = async (page = 0) => {
    try {
      const response = await treatmentService.getTreatmentRecordsPagination({
        doctorId,
        page,
        size: 5, // lấy tất cả
      });

      const data = response?.data?.result?.content || [];

      const formatted = data.map((item) => ({
        key: item.customerId,
        customerId: item.customerId,
        customerName: item.customerName,
        totalRecord: item.totalRecord,
        treatments: [], // ban đầu chưa load chi tiết
      }));
      setCurrentPage(page);
      setTotalPages(response.data.result.totalPages);
      setRecords(formatted);
    } catch (error) {
      console.error("❌ Error loading dashboard stats:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải số liệu tổng quan.",
      });
    }
  };
  useEffect(() => {
    if (!doctorId) return;

    fetchDashboardStats();
  }, [doctorId]);

  const getStatusTag = (status) => {
    const statusMap = {
      PENDING: { color: "orange", text: "Đang chờ xử lý" },
      INPROGRESS: { color: "blue", text: "Đang điều trị" },
      CANCELLED: { color: "red", text: "Đã hủy" },
      COMPLETED: { color: "green", text: "Hoàn thành" },
      CONFIRMED: { color: "blue", text: "Đã xác nhận" },
    };
    return (
      <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
    );
  };

  const viewRecord = (record) => {
    navigate("/doctor-dashboard/treatment-stages", {
      state: {
        patientInfo: {
          customerId: record.customerId,
          customerName: record.customerName,
        },
        treatmentData: record,
        sourcePage: "test-results",
      },
    });
  };

  const handleApprove = async (treatment) => {
    try {
      const response = await treatmentService.updateTreatmentRecordStatus(
        treatment.id,
        "INPROGRESS"
      );
      if (response?.data?.code === 1000) {
        notification.success({
          message: "Duyệt hồ sơ thành công!",
          description: `Hồ sơ của bệnh nhân ${treatment.customerName} đã chuyển sang trạng thái 'Đang điều trị'.`,
        });
        // Refresh the list using new API
        const updatedRecords =
          await treatmentService.getTreatmentRecordsPagination({
            doctorId: doctorId,
            page: 0,
            size: 100,
          });

        if (updatedRecords?.data?.result?.content) {
          const treatmentRecords = updatedRecords.data.result.content;

          const groupedByCustomer = treatmentRecords.reduce((acc, record) => {
            const customerName = record.customerName;
            if (!acc[customerName]) {
              acc[customerName] = [];
            }
            acc[customerName].push(record);
            return acc;
          }, {});

          const formattedRecords = Object.entries(groupedByCustomer).map(
            ([customerName, treatments]) => {
              const sortedTreatments = treatments.sort(
                (a, b) => new Date(b.startDate) - new Date(a.startDate)
              );

              return {
                key: customerName,
                customerId: sortedTreatments[0].customerId,
                customerName: customerName,
                treatments: sortedTreatments.map((treatment) => ({
                  ...treatment,
                  key: treatment.id,
                })),
              };
            }
          );

          setRecords(formattedRecords);
        }
      } else {
        notification.error({
          message: "Duyệt hồ sơ thất bại!",
          description:
            response?.data?.message ||
            "Không thể duyệt hồ sơ, vui lòng thử lại.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi duyệt hồ sơ!",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    }
  };

  const handleCancelService = (treatment) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn hủy hồ sơ/dịch vụ này?",
      icon: <ExclamationCircleOutlined />,
      content: `Bệnh nhân: ${treatment.customerName || treatment.customerName}`,
      okText: "Hủy hồ sơ",
      okType: "danger",
      cancelText: "Không",
      confirmLoading: cancelLoading,
      onOk: async () => {
        setCancelLoading(true);
        try {
          await treatmentService.cancelTreatmentRecord(treatment.id);
          notification.success({ message: "Hủy hồ sơ thành công!" });
          // Reload danh sách
          setTimeout(() => window.location.reload(), 800);
        } catch (err) {
          notification.error({ message: "Hủy hồ sơ thất bại!" });
        } finally {
          setCancelLoading(false);
        }
      },
    });
  };

  // const handleExpandChange = async (expanded, record, page = 0) => {
  //   const customerId = record.customerId;

  //   if (expanded) {
  //     setLoadingExpanded((prev) => [...prev, customerId]);

  //     try {
  //       const response = await treatmentService.getTreatmentRecordsExpand({
  //         customerId,
  //         doctorId,
  //         page,
  //         size: 5,
  //       });

  //       const details = response?.data?.result?.content || [];

  //       setCurrentPageExpand(page);
  //       setTotalPagesExpand(response.data.result.totalPages);

  //       setTreatmentDetails((prev) => ({
  //         ...prev,
  //         [customerId]: details.map((item) => ({
  //           ...item,
  //           key: item.id,
  //         })),
  //       }));
  //     } catch (err) {
  //       notification.error({
  //         message: "Lỗi khi tải chi tiết hồ sơ",
  //         description: err.message || "Không thể lấy dữ liệu dịch vụ.",
  //       });
  //     } finally {
  //       setLoadingExpanded((prev) => prev.filter((id) => id !== customerId));
  //     }
  //   }
  // };

  const expandedRowRender = (record) => {
    // const customerId = record.customerId;
    // const isLoading = loadingExpanded.includes(customerId);
    // const treatments = treatmentDetails[customerId] || [];

    // return (
    //   <div
    //     style={{
    //       padding: "16px",
    //       background: "#ffffff",
    //       borderRadius: "8px",
    //       margin: "8px 0",
    //       border: "1px solid #dee2e6",
    //     }}
    //   >
    //     <Spin spinning={isLoading}>
    //       <Table
    //         columns={columnsChiTiet}
    //         dataSource={treatments}
    //         pagination={false}
    //         size="small"
    //       />
    //       <div className="flex justify-end mt-4">
    //         <Button
    //           disabled={currentPageExpand === 0}
    //           onClick={() =>
    //             handleExpandChange(true, record, currentPageExpand - 1)
    //           }
    //           className="mr-2"
    //         >
    //           Trang trước
    //         </Button>
    //         <span className="px-4 py-1 bg-gray-100 rounded text-sm">
    //           Trang {currentPageExpand + 1} / {totalPagesExpand}
    //         </span>

    //         <Button
    //           disabled={currentPageExpand + 1 >= totalPagesExpand}
    //           onClick={async () => {
    //             await handleExpandChange(true, record, currentPageExpand + 1);
    //           }}
    //           className="ml-2"
    //         >
    //           Trang tiếp
    //         </Button>
    //       </div>
    //     </Spin>
    //   </div>
    // );
    return (
      <TreatmentDetailRow
        customerId={record.customerId}
        doctorId={doctorId}
        viewRecord={viewRecord}
        handleApprove={handleApprove}
        handleCancelService={handleCancelService}
      />
    );
  };

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Số dịch vụ",
      key: "treatmentCount",
      render: (_, record) => (
        <Tag color="blue">{record.totalRecord} dịch vụ</Tag>
      ),
    },
    {
      title: "Chi tiết",
      key: "expand",
      render: (_, record) => {
        const isExpanded = expandedRows.includes(record.key);
        return (
          <Button
            type="text"
            icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
            onClick={() => {
              // Cập nhật state
              const newExpanded = isExpanded
                ? expandedRows.filter((key) => key !== record.key)
                : [...expandedRows, record.key];
              setExpandedRows(newExpanded);

              // GỌI LẠI onExpand() ĐỂ FETCH API
              // handleExpandChange(!isExpanded, record);
            }}
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </Button>
        );
      },
    },
  ];

  const columnsChiTiet = [
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text, record) => (
        <Space>
          <FileTextOutlined style={{ color: "#722ed1" }} />
          <Text strong>{text || "Chưa có thông tin"}</Text>
        </Space>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) =>
        date ? (
          <Text>{dayjs(date).format("DD/MM/YYYY")}</Text>
        ) : (
          <Text type="secondary">Không có</Text>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, treatment) => (
        <Space direction="vertical">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => viewRecord(treatment)}
          >
            Xem chi tiết
          </Button>
          {treatment.status === "PENDING" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(treatment)}
              style={{ background: "#52c41a", borderColor: "#52c41a" }}
            >
              Duyệt
            </Button>
          )}
          {treatment.status !== "CANCELLED" &&
            treatment.status !== "COMPLETED" && (
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleCancelService(treatment)}
              >
                Hủy hồ sơ
              </Button>
            )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Table
          dataSource={records.filter((record) => {
            const matchesSearch = record.customerName
              .toLowerCase()
              .includes(searchText.toLowerCase());
            const matchesStatus =
              statusFilter === "all" ||
              record.treatments.some((t) => t.status === statusFilter);
            return matchesSearch && matchesStatus;
          })}
          columns={columns}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedRows,
            onExpand: async (expanded, record) => {
              const customerId = record.customerId;

              const newExpandedRows = expanded
                ? [...expandedRows, record.key]
                : expandedRows.filter((key) => key !== record.key);
              setExpandedRows(newExpandedRows);
            },
            expandIcon: () => {
              null;
            },
          }}
          pagination={false}
        />
        <div className="flex justify-end mt-4">
          <Button
            disabled={currentPage === 0}
            onClick={() => fetchDashboardStats(currentPage - 1)}
            className="mr-2"
          >
            Trang trước
          </Button>
          <span className="px-4 py-1 bg-gray-100 rounded text-sm">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <Button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => fetchDashboardStats(currentPage + 1)}
            className="ml-2"
          >
            Trang tiếp
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TestResults;
