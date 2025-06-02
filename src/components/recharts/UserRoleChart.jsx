import React, { useEffect, useState } from "react";
import { authService } from "../../service/auth.service";
import { adminService } from "../../service/admin.service";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"];
const UserRoleChart = () => {
  const token = useSelector((state) => state.authSlice);

  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const activeRes = await adminService.getUsers(token.token);
        const activeUsers = activeRes.data.result || [];

        const removedRes = await adminService.getRemovedUsers(token.token);
        const removedUsers = removedRes.data.result || [];

        const roleCount = {};
        activeUsers.forEach((user) => {
          const role = user.roleName?.name || "UNKNOWN";
          roleCount[role] = (roleCount[role] || 0) + 1;
        });

        const barFormatted = Object.entries(roleCount).map(([role, count]) => ({
          role,
          users: count,
        }));
        setBarData(barFormatted);

        const pieFormatted = [
          { name: "Active", value: activeUsers.length },
          { name: "Inactive", value: removedUsers.length },
        ];
        setPieData(pieFormatted);
      } catch (err) {}
    };

    fetchData();
  }, [token]);
  return (
    <div
      className="min-h-screen px-8 py-6"
      style={{
        background: "linear-gradient(135deg, #f0f4f8 0%, #e0ecf7 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 400,
            backgroundColor: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            padding: 20,
          }}
        >
          <h3
            style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 16 }}
          >
            📊 Thống kê User theo Role
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
              barCategoryGap="5%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="users" fill="#8884d8" barSize={80} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 400,
            backgroundColor: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            padding: 20,
          }}
        >
          <h3
            style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 16 }}
          >
            🟢 Thống kê tài khoản đang hoạt động
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserRoleChart;
