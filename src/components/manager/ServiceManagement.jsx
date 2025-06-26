import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../App";
import { managerService } from "../../service/manager.service";
import {
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { path } from "../../common/path";
import "../../index.scss";
import { Button, Modal, Popconfirm } from "antd";
const ServiceManagement = () => {
  const { showNotification } = useContext(NotificationContext);
  const [treatmentService, setTreatmentService] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedService, setEditedService] = useState(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fetchTreatmentService = async (page = 0) => {
    try {
      const res = await managerService.getTreatmentService(page, 5);
      setTreatmentService(res.data.result.content);
    } catch (error) {
      showNotification("Lỗi khi tải dịch vụ", "error");
    }
  };

  useEffect(() => {
    fetchTreatmentService();
  }, []);

  const handleStatusChange = async (id) => {
    try {
      const service = treatmentService.find((service) => service.id === id);

      if (!service.isRemove) {
        await managerService.deleteTreatmentService(id);
        showNotification("Dịch vụ đã được tắt", "success");
      } else {
        await managerService.restoreTreatmentService(id);
        showNotification("Dịch vụ đã được khôi phục", "success");
      }

      await fetchTreatmentService();
    } catch (error) {
      showNotification(error.response.data.message);
    }
  };

  const getTreatmentServiceDetail = async (serviceId) => {
    try {
      const res = await managerService.getTreatmentServiceDetail(serviceId);
      setSelectedService(res.data.result);
      setEditedService({ ...res.data.result });
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "duration") {
      setEditedService((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, ""), // Loại bỏ ký tự không phải là số
      }));
    } else {
      setEditedService((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const updateTreatmentService = async () => {
    try {
      const res = await managerService.updateTreatmentService(
        editedService.id,
        editedService
      );
      setTreatmentService((prev) =>
        prev.map((service) =>
          service.id === editedService.id ? editedService : service
        )
      );
      showNotification("Cập nhật dịch vụ thành công", "success");
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      showNotification(error.response.data.message, "error");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredServices = treatmentService.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setEditedService(null);
  };

  const handleSelectFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result); // preview base64
    };
  };

  // ✅ Handle Upload Img
  const handleUploadImg = async () => {
    if (!selectedFile || !selectedService?.id) return;
    setUploadingImage(true); // 🔥 Start loading
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await managerService.uploadImgService(
        selectedService.id,
        formData
      );

      showNotification("Upload avatar thành công", "success");

      setTreatmentService((prev) => ({
        ...prev,
        ImgUrl: res.data.result.coverImageUrl,
      }));
      window.location.reload();
      // Reset trạng thái
      setSelectedFile(null);
      setIsUploadModalOpen(false);
      setPreview(null);
    } catch (err) {
      // showNotification(err.response.data.message, "error");
      console.log(err);
      console.log(formData);
      console.log("id", selectedService.id);
      console.log(selectedFile);
    } finally {
      setUploadingImage(false); // 🔥 End loading
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 flex justify-between items-center">
        <div className="">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="">
          <button
            onClick={() => {
              setTimeout(() => {
                navigate(path.managerRenderCreateTreatmentService);
              }, 500);
            }}
            className="bg-green-500 mx-3 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600"
          >
            <PlusOutlined />
            <span> Tạo Dịch Vụ</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Hình ảnh</th>
              <th className="px-6 py-3 text-left">Tên dịch vụ</th>
              <th className="px-6 py-3 text-left">Giá</th>
              <th className="px-6 py-3 text-left">Thời gian điều trị</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img src={service.coverImageUrl} alt="" />
                  </td>
                  <td className="px-6 py-4">{service.name}</td>
                  <td className="px-6 py-4">
                    {service.price.toLocaleString()} VNĐ
                  </td>
                  <td className="px-6 py-4">{service.duration} tháng</td>
                  <td className="px-6 py-4">
                    <label className="relative inline-block w-[110px] h-[36px] select-none">
                      <input
                        type="checkbox"
                        checked={!service.isRemove}
                        onChange={() => handleStatusChange(service.id)}
                        className="sr-only peer"
                      />

                      {/* Background toggle */}
                      <div
                        className="
      w-full h-full rounded-full
      transition-colors duration-300
      peer-checked:bg-green-500
      bg-red-100
    "
                      ></div>

                      {/* Label text - Căn giữa */}
                      <span
                        className="
      absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
      text-sm font-semibold pointer-events-none
      text-red-600 peer-checked:text-white
    "
                      >
                        {service.isRemove ? "Tắt" : "Hoạt động"}
                      </span>

                      {/* Toggle dot */}
                      <div
                        className="
      absolute top-1/2 w-[26px] h-[26px] bg-white rounded-full shadow
      -translate-y-1/2 transition-all duration-300
      left-[6px] peer-checked:left-[calc(100%-32px)]
    "
                      ></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                        onClick={() => getTreatmentServiceDetail(service.id)}
                      >
                        <EyeOutlined />
                        <span> Xem</span>
                      </button>
                      <button
                        className="bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-600"
                        onClick={() => {
                          setSelectedService(service); // giữ để lấy id
                          setIsUploadModalOpen(true); // mở modal
                        }}
                      >
                        🖼 Cập nhật hình
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  Không có dịch vụ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Avatar Card */}
      {isUploadModalOpen && (
        <Modal
          title={`Cập nhật ảnh cho service`}
          open={isUploadModalOpen}
          onCancel={() => {
            setIsUploadModalOpen(false);
            setSelectedFile(null);
            setPreview(null);
          }}
          footer={null}
          destroyOnClose
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Ảnh service</h3>
            <img
              src={preview || selectedService?.image || "/default-blog.jpg"}
              alt="Avatar Preview"
              className="w-32 h-32 rounded-full object-cover border mx-auto mb-4"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 transition inline-block"
            >
              Chọn ảnh
            </label>
            <input
              type="file"
              id="fileInput"
              onChange={handleSelectFile}
              className="hidden"
            />
            <p className="text-sm text-gray-600 mt-2">
              {selectedFile ? selectedFile.name : "Chưa chọn ảnh nào"}
            </p>
            <Button
              type="primary"
              loading={uploadingImage}
              disabled={!selectedFile}
              onClick={handleUploadImg}
              className="mt-3"
            >
              {uploadingImage ? "Đang upload..." : "Lưu ảnh"}
            </Button>
          </div>
        </Modal>
      )}

      {/* Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-2/3 md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Chi tiết dịch vụ</h2>
            <div className="flex gap-8">
              {/* Left Section: Display static info */}
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Người tạo
                  </label>
                  <input
                    type="text"
                    value={editedService.createdBy}
                    readOnly
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Thời gian điều trị
                  </label>
                  <input
                    name="duration"
                    type="text"
                    value={editedService.duration.toLocaleString() + " Tháng"}
                    onChange={handleEditChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>

              {/* Right Section: Editable fields */}
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Tên dịch vụ
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedService.name}
                    onChange={handleEditChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Giá
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={editedService.price.toLocaleString() + " VNĐ"}
                    onChange={handleEditChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                name="description"
                value={editedService.description}
                onChange={handleEditChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                Đóng
              </button>

              <Popconfirm
                title="Bạn có chắc muốn sửa những gì đã thay đổi không?"
                onConfirm={() => updateTreatmentService()}
                okText="Sửa"
                cancelText="Huỷ"
              >
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600">
                  Sửa
                </button>
              </Popconfirm>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
