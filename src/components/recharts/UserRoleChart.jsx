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
  Cell,
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
const CustomBarShape = ({ x, y, width, height, fill }) => {
  // Kiểm tra nếu height = 0 hoặc y = NaN thì không render
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number" ||
    isNaN(x) ||
    isNaN(y) ||
    isNaN(width) ||
    isNaN(height) ||
    height === 0
  ) {
    return null;
  }

  const path = `
    M${x},${y + height}
    C${x + width / 3},${y + height - 10}
     ${x + (2 * width) / 3},${y + 10}
     ${x + width},${y}
    L${x + width},${y + height}
    Z
  `;
  return <path d={path} fill={fill} stroke="none" />;
};

const UserRoleChart = () => {
  const token = useSelector((state) => state.authSlice);
  console.log("Token hiện tại:", token); // log ra xem token có chưa

  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (!token) return;
    adminService
      .getUsers(token.token)
      .then((res) => {
        const roleCount = {};
        const users = res.data.result;
        users.forEach((user) => {
          const role = user.roleName.name;
          roleCount[role] = (roleCount[role] || 0) + 1;
        });

        // Format lại cho biểu đồ
        const formatted = Object.entries(roleCount).map(([role, count]) => ({
          role,
          users: count,
        }));

        setChartData(formatted);
      })
      .catch((errors) => {
      });
  }, [token]);

  return (
    <div>
      <div style={{ width: "100%", height: 400 }}>
        <h3>Thống kê User theo Role</h3>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="users"
              shape={<CustomBarShape />}
              label={{ position: "top", fill: "#333" }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserRoleChart;
