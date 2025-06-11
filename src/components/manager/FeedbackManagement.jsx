import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Select,
  Input,
  Modal,
  Form,
  message,
  Row,
  Col,
  Rate,
  Avatar,
  Descriptions,
  Divider,
  List,
} from "antd";
import {
  CheckOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  MessageOutlined,
  UserOutlined,
  StarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { managerService } from "../../service/manager.service";
import { authService } from "../../service/auth.service";
import { NotificationContext } from "../../App";
import { doctorService } from "../../service/doctor.service";

const { Title, Text } = Typography;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [infoUser, setInfoUser] = useState();
  const { showNotification } = useContext(NotificationContext);
  const [doctorMap, setDoctorMap] = useState({});
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
  });
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    authService
      .getMyInfo()
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {});
  }, []);

  const getAllFeedBack = async () => {
    try {
      const res = await managerService.getAllFeedback();
      if (res?.data?.result) {
        setFeedbacks(res.data.result);
        getDoctorNames(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // format lại id doctor -> doctor name
  const getDoctorNames = async (feedbackList) => {
    const uniqueDoctorIds = [...new Set(feedbackList.map((fb) => fb.doctorId))];
    const newMap = {};
    await Promise.all(
      uniqueDoctorIds.map(async (id) => {
        try {
          const res = await doctorService.getDoctorById(id);
          newMap[id] = res?.data?.result?.fullName || "Không rõ";
        } catch (err) {
          newMap[id] = "Không rõ";
        }
      })
    );

    setDoctorMap(newMap);
  };

  useEffect(() => {
    getAllFeedBack();
  }, []);

  // nút từ chối và update
  const handleUpdateApprovalStatus = async (id, approved) => {
    if (!infoUser?.fullName) {
      showNotification("Không lấy được thông tin người duyệt", "error");
      return;
    }

    setLoadingIds((prev) => [...prev, id]);

    try {
      await managerService.confirmFeedback(id, {
        approveBy: infoUser.id,
        approved, // true hoặc false
      });
      showNotification(
        approved ? "Duyệt feedback thành công" : "Từ chối feedback thành công",
        "success"
      );
      await getAllFeedBack();
    } catch (error) {
      console.error(error);
      showNotification("Có lỗi xảy ra khi cập nhật trạng thái", "error");
      console.log(approveBy);
    } finally {
      setLoadingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  // search
  const filteredFeedbacks = feedbacks.filter((item) => {
    const doctorName = doctorMap[item.doctorId]?.toLowerCase() || "";
    const customerName = item.customerName?.toLowerCase() || "";

    const matchKeyword =
      filters.keyword === "" ||
      customerName.includes(filters.keyword) ||
      doctorName.includes(filters.keyword);

    const matchStatus =
      filters.status === "" ||
      (filters.status === "approved" && item.approved) ||
      (filters.status === "pending" && !item.approved);

    return matchKeyword && matchStatus;
  });

  return (
    <div>
      <Card title="Danh sách phản hồi khách hàng">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Input
            placeholder="Tìm theo tên bệnh nhân hoặc bác sĩ"
            allowClear
            className="w-full md:w-1/3"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                keyword: e.target.value.toLowerCase(),
              }))
            }
          />

          <Select
            placeholder="Lọc trạng thái"
            allowClear
            className="w-full md:w-1/4"
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <Select.Option value="approved">Đã duyệt</Select.Option>
            <Select.Option value="pending">Chưa duyệt</Select.Option>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Bệnh nhân</th>
                <th className="px-4 py-3">Bác sĩ & Dịch vụ</th>
                <th className="px-4 py-3">Đánh giá</th>
                <th className="px-4 py-3">Nội dung</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFeedbacks.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.customerName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {doctorMap[item.doctorId] || "Đang tải..."}
                  </td>
                  <td className="px-4 py-3">
                    <Rate disabled value={item.rating} />
                  </td>
                  <td className="px-4 py-3">{item.comment}</td>
                  <td className="px-4 py-3">
                    <Tag color={item.approved ? "green" : "red"}>
                      {item.approved ? "Đã duyệt" : "Chưa duyệt"}
                    </Tag>
                  </td>
                  <td className="px-4 py-3">
                    {dayjs(item.submitDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3">
                    <Space>
                      {!item.approved && (
                        <Button
                          type="primary"
                          size="small"
                          icon={<CheckOutlined />}
                          loading={loadingIds.includes(item.id)}
                          onClick={() =>
                            handleUpdateApprovalStatus(item.id, true)
                          } // ✅ Duyệt thật
                        >
                          Duyệt
                        </Button>
                      )}
                      <Button
                        type="default"
                        danger
                        size="small"
                        icon={<ExclamationCircleOutlined />}
                        loading={loadingIds.includes(item.id)}
                        onClick={() =>
                          handleUpdateApprovalStatus(item.id, false)
                        }
                      >
                        Từ chối
                      </Button>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FeedbackManagement;
