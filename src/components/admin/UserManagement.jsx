import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Space, Typography, Popconfirm } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { adminService } from "../../service/admin.service";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { NotificationContext } from "../../App";

const { Title } = Typography;

const UserManagement = () => {
  const token = useSelector((state) => state.authSlice);

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showRemoved, setShowRemoved] = useState(false);
  const { showNotification } = useContext(NotificationContext);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  // thực hiện chức năng gọi danh sách User
  const fetchUsers = (isRemoved) => {
    if (!token) return;

    const apiCall = isRemoved
      ? adminService.getRemovedUsers
      : adminService.getUsers;

    apiCall(token.token)
      .then((res) => {
        setUsers(res.data.result);
        setShowRemoved(isRemoved);
      })
      .catch((err) => {
        showNotification(err.response.data.message, "error");
      });
  };
  // lọc user theo từng username và id
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchText.toLowerCase();
      return (
        (user.username || "").toLowerCase().includes(q) ||
        (user.email || "").toLowerCase().includes(q) ||
        (user.roleName.name || "").toLowerCase().includes(q)
      );
    });
  }, [users, searchText]);

  useEffect(() => {
    fetchUsers(false);
  }, [token]);

  // thực hiện chức năng style với từng role khác nhau
  const getRoleColor = (role) => {
    switch (role) {
      case "CUSTOMER":
        return "bg-yellow-100 text-yellow-700";
      case "DOCTOR":
        return "bg-green-100 text-green-700";
      case "MANAGER":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-teal-100 text-gray-600";
    }
  };

  // thực hiện chức năng delete
  const handleDelete = (id) => {
    adminService
      .deleteUser(id, token.token)
      .then((res) => {
        showNotification("Removed success", "success");
        setTimeout(() => {
          fetchUsers(showRemoved);
        }, 200);
      })
      .catch((err) => {
        showNotification(err.response.data.message, "error");
      });
  };

  // thực hiện chức năng restore
  const handleRestore = (id) => {
    adminService
      .restoreUser(id, token.token)
      .then((res) => {
        showNotification("Restored success", "success");

        setTimeout(() => {
          fetchUsers(showRemoved);
        }, 200);
      })
      .catch((err) => {
        showNotification(err.response.data.message, "error");
      });
  };

  // chỉnh sửa cho chức năng update role
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const openEditModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.roleName.name || "");
    setEditModalOpen(true);
  };
  // update role cho user hoat dong
  const handleUpdateRole = async () => {
    console.log(selectedUser.id, selectedRole, token.token);
    await adminService
      .updateRoleUser(selectedUser.id, selectedRole, token.token)
      .then((res) => {
        setEditModalOpen(false);
        showNotification("Update role success", "success");
        setTimeout(() => {
          fetchUsers(showRemoved);
        }, 200);
      })
      .catch((err) => {
        showNotification(err.response.data.message, "error");
      });
  };

  // detail user
  const openDetailModal = async (user) => {
    try {
      const res = await adminService.getUserById(user.id, token.token);
      setUserDetail(res.data); // Giả sử res.data là object user detail
      setDetailModalOpen(true);
    } catch (err) {
      showNotification(err.response.data.message, "error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Quản Lý User</Title>
        <Space>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-80"
          />

          <Button
            type="default"
            className={!showRemoved ? "border-green-500 text-green-600" : ""}
            icon={<UserOutlined />}
            onClick={() => fetchUsers(false)}
          >
            User hoạt động
          </Button>

          <Button
            type="default"
            className={showRemoved ? "border-red-500 text-red-600" : ""}
            icon={<DeleteOutlined />}
            onClick={() => fetchUsers(true)}
          >
            User đã bị xoá
          </Button>
        </Space>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Tên Đăng Nhập</th>
            <th className="p-2">Họ Tên</th>
            <th className="p-2">Email</th>
            <th className="p-2">Vai Trò</th>
            <th className="p-2">Trạng Thái</th>
            <th className="p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, idx) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${getRoleColor(
                    user.roleName?.name
                  )}`}
                >
                  {user.roleName?.name}
                </span>
              </td>
              <td className="p-2">
                {/* ✅ Hiển thị trạng thái theo removed */}
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    user.removed
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {user.removed ? "Không hoạt động" : "Hoạt động"}
                </span>
              </td>
              <td className="p-2 space-x-2">
                {!showRemoved && (
                  <button
                    className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => openEditModal(user)}
                  >
                    Sửa
                  </button>
                )}

                {!showRemoved && (
                  <button
                    className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => openDetailModal(user)}
                  >
                    Chi tiết
                  </button>
                )}

                {showRemoved ? (
                  <Popconfirm
                    title="Bạn có chắc muốn khôi phục user này không?"
                    onConfirm={() => handleRestore(user.id)}
                    okText="Khôi phục"
                    cancelText="Huỷ"
                  >
                    <button className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600">
                      Khôi phục
                    </button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="Bạn có chắc muốn xoá user này không?"
                    onConfirm={() => handleDelete(user.id)}
                    okText="Xoá"
                    cancelText="Huỷ"
                  >
                    <button className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                      Xoá
                    </button>
                  </Popconfirm>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal update role */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        contentLabel="Cập nhật vai trò"
        className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        <h2 className="text-xl font-semibold mb-4">Cập nhật vai trò</h2>

        <label className="block mb-2 font-medium">Chọn vai trò:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="DOCTOR">DOCTOR</option>
          <option value="CUSTOMER">CUSTOMER</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setEditModalOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Huỷ
          </button>
          <button
            onClick={handleUpdateRole}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cập nhật
          </button>
        </div>
      </Modal>

      {/* Modal detail user  */}
      <Modal
        isOpen={isDetailModalOpen}
        onRequestClose={() => setDetailModalOpen(false)}
        contentLabel="Chi tiết user"
        className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        <h2 className="text-xl font-semibold mb-4">Chi tiết User</h2>

        {userDetail ? (
          <div className="space-y-2">
            <div>
              <strong>ID:</strong> {userDetail.id}
            </div>
            <div>
              <strong>Tên đăng nhập:</strong> {userDetail.username}
            </div>
            <div>
              <strong>Họ tên:</strong> {userDetail.fullName}
            </div>
            <div>
              <strong>Email:</strong> {userDetail.email}
            </div>
            <div>
              <strong>Vai trò:</strong> {userDetail.roleName?.name}
            </div>
            <div>
              <strong>Trạng thái:</strong>{" "}
              {userDetail.removed ? "Không hoạt động" : "Hoạt động"}
            </div>
            <div>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(userDetail.createdAt).toLocaleString()}
            </div>
            {/* Thêm các field khác nếu cần */}
          </div>
        ) : (
          <div>Đang tải dữ liệu...</div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setDetailModalOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
