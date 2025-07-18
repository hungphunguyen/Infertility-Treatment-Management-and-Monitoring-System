// components/TreatmentDetailRow.jsx
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Table, Button, Spin, notification, Tag } from "antd";
import { treatmentService } from "../../service/treatment.service";
import dayjs from "dayjs";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
const statusMap = {
  PENDING: { text: "Đang chờ xử lý", color: "gold" },
  INPROGRESS: { text: "Đang điều trị", color: "blue" },
  CANCELLED: { text: "Đã hủy", color: "red" },
  COMPLETED: { text: "Hoàn thành", color: "green" },
  CONFIRMED: { text: "Đã xác nhận", color: "cyan" },
};

const resultMap = {
  SUCCESS: { text: "Thành công", color: "green" },
  FAILURE: { text: "Thất bại", color: "red" },
  UNDETERMINED: { text: "Chưa xác định", color: "gold" },
};

const columnsChiTiet = (viewRecord, handleApprove, handleCancelService) => [
  {
    title: "Dịch vụ",
    dataIndex: "serviceName",
    key: "serviceName",
  },
  {
    title: "Ngày bắt đầu",
    dataIndex: "startDate",
    key: "startDate",
    render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "Không có"),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const item = statusMap[status] || { text: status, color: "default" };
      return <Tag color={item.color}>{item.text}</Tag>;
    },
  },
  {
    title: "Kết quả",
    dataIndex: "result",
    key: "result",
    render: (result) => {
      const item = resultMap[result] || { text: result, color: "default" };
      return <Tag color={item.color}>{item.text}</Tag>;
    },
  },
  {
    title: "Thao tác",
    key: "action",
    render: (_, treatment) => (
      <div className="flex gap-2">
        <Button icon={<EyeOutlined />} onClick={() => viewRecord(treatment)} />
        {treatment.status === "PENDING" && (
          <Button
            icon={<CheckOutlined />}
            onClick={() => handleApprove(treatment)}
          />
        )}
        {treatment.status !== "CANCELLED" &&
          treatment.status !== "COMPLETED" && (
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => handleCancelService(treatment)}
            />
          )}
      </div>
    ),
  },
];

export default function TreatmentDetailRow({
  customerId,
  doctorId,
  viewRecord,
  handleApprove,
  handleCancelService,
}) {
  const [recordExpand, setRecordExpand] = useState([]);

  const fetchTreatmentDetails = async ({ pageParam = 0 }) => {
    try {
      const res = await treatmentService.getTreatmentRecordsExpand({
        customerId,
        doctorId,
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
        message: "Không thể tải dữ liệu",
      });
      return { list: [], hasNextPage: false };
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["treatments", customerId],
      queryFn: fetchTreatmentDetails,
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length : undefined,
      enabled: !!customerId && !!doctorId,

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
          columns={columnsChiTiet(
            viewRecord,
            handleApprove,
            handleCancelService
          )}
          pagination={false}
          size="small"
          rowKey="id"
        />
        {hasNextPage && (
          <div className="text-center mt-4">
            <Button
              onClick={() => {
                fetchNextPage();

                console.log(recordExpand);
              }}
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
