// components/ManagerTreatmentDetailRow.jsx
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Table, Button, Spin, notification, Tag, Typography } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { treatmentService } from "../../service/treatment.service";

const { Text } = Typography;

const statusMap = {
  PENDING: { text: "Đang chờ xử lý", color: "orange" },
  CONFIRMED: { text: "Đã xác nhận", color: "cyan" },
  INPROGRESS: { text: "Đang điều trị", color: "blue" },
  CANCELLED: { text: "Đã hủy", color: "red" },
  COMPLETED: { text: "Hoàn thành", color: "green" },
};

const resultMap = {
  SUCCESS: { text: "Thành công", color: "green" },
  FAILURE: { text: "Thất bại", color: "red" },
  UNDETERMINED: { text: "Chưa xác định", color: "gold" },
};

const columnsChiTiet = (viewRecord, handleApprove, handleCancel) => [
  {
    title: "Dịch vụ",
    dataIndex: "treatmentServiceName",
    key: "treatmentServiceName",
    render: (text, treatment) => {
      const name =
        treatment.treatmentServiceName ||
        treatment.serviceName ||
        treatment.name ||
        treatment.treatmentService?.name ||
        "Chưa có thông tin";
      return (
        <div>
          <Text strong>{name}</Text>
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
    render: (_, treatment) => (
      <div>
        <Text strong>{treatment.doctorName || "Chưa có thông tin"}</Text>
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
    render: (_, treatment) => (
      <div>
        <Text strong>{dayjs(treatment.startDate).format("DD/MM/YYYY")}</Text>
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
    render: (status, treatment) => {
      const s = statusMap[status] || { text: status, color: "default" };
      return (
        <div>
          <Tag color={s.color}>{s.text}</Tag>
          {treatment.notes && (
            <div>
              <Text type="secondary">{treatment.notes}</Text>
            </div>
          )}
        </div>
      );
    },
  },
  {
    title: "Kết quả",
    dataIndex: "result",
    key: "result",
    render: (result) => {
      const s = resultMap[result] || { text: result, color: "default" };
      return (
        <div>
          <Tag color={s.color}>{s.text}</Tag>
        </div>
      );
    },
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

export default function ManagerTreatmentDetailRow({
  customerId,
  viewRecord,
  handleApprove,
  handleCancel,
}) {
  const [recordExpand, setRecordExpand] = useState([]);

  const fetchTreatments = async ({ pageParam = 0 }) => {
    try {
      const res = await treatmentService.getTreatmentRecordsExpand({
        customerId,
        page: pageParam,
        size: 5,
      });
      const data = res?.data?.result;
      setRecordExpand(data.content);
      return {
        list: data?.content || [],
        hasNextPage: !data?.last,
      };
    } catch (err) {
      notification.error({
        message: "Không thể tải dữ liệu chi tiết",
      });
      return { list: [], hasNextPage: false };
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["manager-treatments", customerId],
      queryFn: fetchTreatments,
      getNextPageParam: (_, allPages) => allPages.length,
      enabled: !!customerId,

      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      staleTime: Infinity, // hoặc vài phút nếu muốn
    });

  const treatments = data?.pages.flatMap((page) => page.list) || [];

  return (
    <div className="p-4 bg-white border rounded">
      <Spin spinning={isLoading}>
        <Table
          dataSource={treatments}
          columns={columnsChiTiet(viewRecord, handleApprove, handleCancel)}
          pagination={false}
          size="small"
          rowKey="id"
        />
        {hasNextPage && (
          <div className="text-center mt-4">
            <Button
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
              disabled={recordExpand.length === 0}
            >
              {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
            </Button>
          </div>
        )}
      </Spin>
    </div>
  );
}
