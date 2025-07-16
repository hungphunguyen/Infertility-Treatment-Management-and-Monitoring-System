import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Input,
  Select,
  notification,
  Spin,
  Typography,
  Statistic,
} from "antd";
import {
  UserOutlined,
  EyeOutlined,
  DownOutlined,
  UpOutlined,
  FileTextOutlined,
  CheckOutlined,
  CloseOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";
import { useNavigate } from "react-router-dom";
import ManagerTreatmentDetailRow from "./ManagerTreatmentDetailRow";

const { Search } = Input;
const { Text } = Typography;
const ManagerTreatmentRecords = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    pendingRecords: 0,
    inProgressRecords: 0,
    completedRecords: 0,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [treatmentDetails, setTreatmentDetails] = useState({});
  const [loadingRows, setLoadingRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Page từ 1
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageExpand, setCurrentPageExpand] = useState(0); // backend page = 0-based
  const [totalPagesExpand, setTotalPagesExpand] = useState(1);

  useEffect(() => {
    fetchRecords(); // API backend nhận page bắt đầu từ 0
  }, []);

  const fetchRecords = async (page = 0) => {
    try {
      setLoading(true);
      const response = await treatmentService.getTreatmentRecordsPagination({
        page,
        size: 5,
      });

      const data = response?.data?.result;
      const content = data?.content || [];

      const formattedRecords = content.map((item) => ({
        key: item.customerId,
        customerId: item.customerId,
        customerName: item.customerName,
        treatments: [
          {
            id: item.customerId + "-summary",
            customerName: item.customerName,
            totalRecord: item.totalRecord,
          },
        ],
      }));
      setCurrentPage(page);
      setTotalPages(response.data.result.totalPages);
      setRecords(formattedRecords);
      setTotalItems(data?.totalElements || content.length);
    } catch (error) {
      console.error("❌ Error fetching records:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể lấy danh sách hồ sơ điều trị.",
      });
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      PENDING: { color: "orange", text: "Đang chờ xử lý" },
      CONFIRMED: { color: "blue", text: "Đã xác nhận" },
      INPROGRESS: { color: "blue", text: "Đang điều trị" },
      CANCELLED: { color: "red", text: "Đã hủy" },
      COMPLETED: { color: "green", text: "Hoàn thành" },
    };
    return (
      <Tag color={statusMap[status]?.color}>
        {statusMap[status]?.text || status}
      </Tag>
    );
  };

  const viewRecord = (record) => {
    console.log("🔍 Navigating to treatment-stages-view with record:", record);
    navigate("/manager/treatment-stages-view", {
      state: {
        patientInfo: {
          customerId: record.customerId,
          customerName: record.customerName,
        },
        treatmentData: record,
        sourcePage: "manager-treatment-records",
      },
    });
  };

  const handleApprove = async (treatment) => {
    try {
      const response = await treatmentService.updateTreatmentStatus(
        treatment.id,
        "INPROGRESS"
      );
      if (response?.data?.code === 1000) {
        notification.success({
          message: "Duyệt hồ sơ thành công!",
          description: `Hồ sơ của bệnh nhân ${treatment.customerName} đã chuyển sang trạng thái 'Đang điều trị'.`,
        });
        // Refresh the list
        fetchRecords();
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

  const handleCancel = async (treatment) => {
    try {
      const response = await treatmentService.updateTreatmentStatus(
        treatment.id,
        "CANCELLED"
      );
      if (response?.data?.code === 1000) {
        notification.success({
          message: "Hủy hồ sơ thành công!",
          description: `Hồ sơ của bệnh nhân ${treatment.customerName} đã được hủy.`,
        });
        // Refresh the list
        fetchRecords();
      } else {
        notification.error({
          message: "Hủy hồ sơ thất bại!",
          description:
            response?.data?.message || "Không thể hủy hồ sơ, vui lòng thử lại.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi hủy hồ sơ!",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    }
  };

  const handleExpandChange = async (expanded, record, page = 0) => {
    const customerId = record.customerId;

    if (expanded) {
      setLoadingRows((prev) => [...prev, customerId]);

      try {
        console.log("➡️ Gọi API khi mở rộng với:", customerId);

        const res = await treatmentService.getTreatmentRecordsExpand({
          customerId,
          page,
          size: 5,
        });

        const data = res?.data?.result?.content || [];
        const treatmentsWithKey = data.map((item) => ({
          ...item,
          key: item.id,
        }));

        setCurrentPageExpand(page);
        setTotalPagesExpand(res.data.result.totalPages);

        setTreatmentDetails((prev) => ({
          ...prev,
          [customerId]: treatmentsWithKey,
        }));
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải chi tiết hồ sơ!",
          description: error.message || "Vui lòng thử lại.",
        });
      } finally {
        setLoadingRows((prev) => prev.filter((id) => id !== customerId));
      }
    }
  };

  const expandedRowRender = (record) => {
    // const isLoading = loadingRows.includes(record.customerId);
    // const treatments = treatmentDetails[record.customerId] || [];

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
      <ManagerTreatmentDetailRow
        customerId={record.customerId}
        viewRecord={viewRecord}
        handleApprove={handleApprove}
        handleCancel={handleCancel}
      />
    );
  };

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Số hồ sơ",
      dataIndex: "treatments",
      key: "totalRecord",
      render: (treatments) => {
        const record = treatments?.[0];
        return (
          <Text
            style={{
              backgroundColor: "#90EE90",
              padding: "5px 20px",
              color: "#28a745",
              fontWeight: "500",
            }}
          >
            {record?.totalRecord ?? 0}
          </Text>
        );
      },
    },

    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={
              expandedRows.includes(record.key) ? (
                <UpOutlined />
              ) : (
                <DownOutlined />
              )
            }
            onClick={() => {
              const isExpanded = expandedRows.includes(record.key);
              const newExpanded = isExpanded
                ? expandedRows.filter((key) => key !== record.key)
                : [...expandedRows, record.key];

              setExpandedRows(newExpanded);

              // GỌI `onExpand` thủ công để kích hoạt xử lý logic
              handleExpandChange(!isExpanded, record);
            }}
          >
            {expandedRows.includes(record.key) ? "Thu gọn" : "Mở rộng"}
          </Button>
        </Space>
      ),
    },
  ];

  // cột dữ liệu render ra khi nhấn mở rộng
  const columnsChiTiet = [
    {
      title: "Dịch vụ",
      dataIndex: "treatmentServiceName",
      key: "treatmentServiceName",
      render: (text, treatment) => {
        const serviceName =
          treatment.treatmentServiceName ||
          treatment.serviceName ||
          treatment.name ||
          treatment.treatmentService?.name ||
          "Chưa có thông tin";
        return (
          <div>
            <Text strong>{serviceName}</Text>
            {treatment.treatmentServiceDescription && (
              <div>
                <Text type="secondary">
                  {treatment.treatmentServiceDescription}
                </Text>
              </div>
            )}
            {treatment.price && (
              <div>
                <Text style={{ color: "#28a745", fontWeight: "500" }}>
                  {treatment.price.toLocaleString("vi-VN")} VNĐ
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (text, treatment) => (
        <div>
          <Text strong>{text || "Chưa có thông tin"}</Text>
          {treatment.doctorEmail && (
            <div>
              <Text type="secondary">{treatment.doctorEmail}</Text>
            </div>
          )}
          {treatment.doctorPhone && (
            <div>
              <Text type="secondary">{treatment.doctorPhone}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "startDate",
      key: "startDate",
      render: (date, treatment) => (
        <div>
          <Text strong>{dayjs(date).format("DD/MM/YYYY")}</Text>
          {treatment.endDate && (
            <div>
              <Text type="secondary">
                Kết thúc: {dayjs(treatment.endDate).format("DD/MM/YYYY")}
              </Text>
            </div>
          )}
          {treatment.createdDate && (
            <div>
              <Text type="secondary">
                Tạo: {dayjs(treatment.createdDate).format("DD/MM/YYYY")}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, treatment) => (
        <div>
          {getStatusTag(status)}
          {treatment.notes && (
            <div>
              <Text type="secondary">{treatment.notes}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, treatment) => (
        <div>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => viewRecord(treatment)}
            style={{ width: "100%", marginBottom: 4 }}
          >
            Xem chi tiết
          </Button>
          {treatment.status === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                onClick={() => handleApprove(treatment)}
                style={{
                  width: "100%",
                  background: "#28a745",
                  borderColor: "#28a745",
                  marginBottom: 4,
                }}
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleCancel(treatment)}
                style={{ width: "100%" }}
              >
                Hủy
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.customerName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      record.treatments.some((treatment) => treatment.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="Tìm kiếm theo tên bệnh nhân..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />

          <Button
            onClick={() => {
              setSearchText("");
              setStatusFilter("all");
            }}
          >
            Đặt lại
          </Button>
        </Space>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredRecords}
            expandable={{
              expandedRowRender,
              expandedRowKeys: expandedRows,
              onExpand: async (expanded, record) => {
                const customerId = record.customerId;

                if (expanded && !expandedRows.includes(record.key)) {
                  setExpandedRows([...expandedRows, record.key]);

                  // Nếu chưa có data thì gọi API
                  if (!treatmentDetails[customerId]) {
                    setLoadingRows((prev) => [...prev, customerId]);

                    try {
                      const res =
                        await treatmentService.getTreatmentRecordsExpand({
                          customerId,
                          page: 0,
                          size: 100,
                        });

                      const data = res?.data?.result?.content || [];
                      const treatmentsWithKey = data.map((item) => ({
                        ...item,
                        key: item.id,
                      }));

                      setTreatmentDetails((prev) => ({
                        ...prev,
                        [customerId]: treatmentsWithKey,
                      }));
                    } catch (error) {
                      notification.error({
                        message: "Lỗi khi tải chi tiết hồ sơ!",
                        description: error.message || "Vui lòng thử lại.",
                      });
                    } finally {
                      setLoadingRows((prev) =>
                        prev.filter((id) => id !== customerId)
                      );
                    }
                  }
                } else {
                  setExpandedRows(
                    expandedRows.filter((key) => key !== record.key)
                  );
                }
              },
              expandIcon: () => {
                null;
              },
            }}
            pagination={
              // pageSize: 10,
              // showSizeChanger: true,
              // showTotal: (total) => `Tổng số ${total} bệnh nhân`,
              false
            }
          />

          <div className="flex justify-end mt-4">
            <Button
              disabled={currentPage === 0}
              onClick={() => fetchRecords(currentPage - 1)}
              className="mr-2"
            >
              Trang trước
            </Button>
            <span className="px-4 py-1 bg-gray-100 rounded text-sm">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => fetchRecords(currentPage + 1)}
              className="ml-2"
            >
              Trang tiếp
            </Button>
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default ManagerTreatmentRecords;
