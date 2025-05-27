import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Avatar,
  Tag,
  Space,
  Typography,
  Modal,
  Popconfirm,
} from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { adminService } from "../../service/admin.service";
import { useSelector } from "react-redux";
import { Content } from "antd/es/layout/layout";
// import Modal from "react-modal";

const { Title } = Typography;

const UserManagement = () => {
  const token = useSelector((state) => state.authSlice);

  const [users, setUsers] = useState([]);
  const [showRemoved, setShowRemoved] = useState(false);

  const fetchUsers = (isRemoved) => {
    if (!token) return;

    const apiCall = isRemoved
      ? adminService.getRemovedUsers
      : adminService.getUsers;

    apiCall(token.token)
      .then((res) => {
        console.log(res);
        setUsers(res.data.result);
        setShowRemoved(isRemoved);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchUsers(false);
  }, [token]);

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

  const handleDelete = (id) => {
    adminService
      .deleteUser(id, token.token)
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          fetchUsers(showRemoved);
        }, 200);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // chỉnh sửa cho chức năng update role
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const openEditModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.roleName?.name || "");
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    await adminService
      .updateRoleUser(selectedUser.id, selectedRole, token.token)
      .then((res) => {
        console.log(res);
        setEditModalOpen(false);
        setTimeout(() => {
          fetchUsers(showRemoved);
        }, 200);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Quản Lý User</Title>
        <Space>
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
          {users.map((user, idx) => (
            <tr key={idx} className="border-t">
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
                    // onClick={handleUpdate(user.id, user.roleName.name)}
                  >
                    Sửa
                  </button>
                )}

                {showRemoved ? (
                  <button
                    className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleRestore(user.id)}
                  >
                    Khôi phục
                  </button>
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
    </div>
  );
};

export default UserManagement;
