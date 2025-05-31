import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Select,
  Input,
  Row,
  Col,
  Avatar,
  Statistic,
  Badge,
  Space,
  Button,
  Tooltip
} from "antd";
import { 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const DoctorScheduleView = () => {
  const [doctorSchedules, setDoctorSchedules] = useState([
    {
      key: 1,
      doctorId: "DOC001",
      doctorName: "BS. Trần Văn Nam",
      specialty: "Hỗ trợ sinh sản",
      shift: "Sáng",
      startTime: "08:00",
      endTime: "12:00",
      room: "P101",
      status: "present", // present, absent, late
      checkInTime: "07:55",
      totalPatients: 8,
      completedPatients: 5,
      phone: "0912345678",
      notes: "Có họp từ 10:30-11:00"
    },
    {
      key: 2,
      doctorId: "DOC002", 
      doctorName: "BS. Nguyễn Thị Mai",
      specialty: "Nội tiết sinh sản",
      shift: "Chiều",
      startTime: "13:00",
      endTime: "17:00",
      room: "P102",
      status: "present",
      checkInTime: "12:50",
      totalPatients: 6,
      completedPatients: 3,
      phone: "0987654321",
      notes: ""
    },
    {
      key: 3,
      doctorId: "DOC003",
      doctorName: "ThS. Lê Văn Hùng",
      specialty: "Phôi học lâm sàng",
      shift: "Sáng",
      startTime: "08:00", 
      endTime: "12:00",
      room: "P103",
      status: "late",
      checkInTime: "08:15",
      totalPatients: 4,
      completedPatients: 1,
      phone: "0901234567",
      notes: "Muộn do tắc đường"
    },
    {
      key: 4,
      doctorId: "DOC004",
      doctorName: "BSCKII Phạm Thị Lan",
      specialty: "Sản phụ khoa",
      shift: "Cả ngày",
      startTime: "08:00",
      endTime: "17:00",
      room: "P104",
      status: "absent",
      checkInTime: null,
      totalPatients: 10,
      completedPatients: 0,
      phone: "0934567890",
      notes: "Nghỉ phép bệnh"
    },
    {
      key: 5,
      doctorId: "DOC005",
      doctorName: "TS. Hoàng Minh Đức",
      specialty: "Nam khoa",
      shift: "Chiều",
      startTime: "14:00",
      endTime: "18:00",
      room: "P105",
      status: "present",
      checkInTime: "13:45",
      totalPatients: 5,
      completedPatients: 4,
      phone: "0945678901",
      notes: ""
    }
  ]);

  const [filteredData, setFilteredData] = useState(doctorSchedules);
  const [statusFilter, setStatusFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Filter schedules
  React.useEffect(() => {
    let filtered = doctorSchedules;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (shiftFilter !== "all") {
      filtered = filtered.filter(item => item.shift === shiftFilter);
    }
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.specialty.toLowerCase().includes(searchText.toLowerCase()) ||
        item.room.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [statusFilter, shiftFilter, searchText, doctorSchedules]);

  const getStatusBadge = (status, checkInTime) => {
    const statusMap = {
      present: { 
        status: "success", 
        text: "Có mặt",
        color: "green"
      },
      absent: { 
        status: "error", 
        text: "Vắng mặt",
        color: "red"
      },
      late: { 
        status: "warning", 
        text: "Muộn",
        color: "orange"
      }
    };
    
    const config = statusMap[status];
    return (
      <div>
        <Badge status={config.status} text={config.text} />
        {checkInTime && (
          <div className="text-xs text-gray-500">
            Check-in: {checkInTime}
          </div>
        )}
      </div>
    );
  };

  const getShiftTag = (shift) => {
    const shiftMap = {
      "Sáng": { color: "blue" },
      "Chiều": { color: "orange" },
      "Cả ngày": { color: "purple" }
    };
    return <Tag color={shiftMap[shift]?.color}>{shift}</Tag>;
  };

  const columns = [
    {
      title: "Bác sĩ",
      key: "doctor",
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            className="mr-3"
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div className="font-semibold">{record.doctorName}</div>
            <div className="text-sm text-gray-500">{record.specialty}</div>
          </div>
        </div>
      )
    },
    {
      title: "Ca làm việc",
      dataIndex: "shift",
      key: "shift",
      render: (shift, record) => (
        <div>
          {getShiftTag(shift)}
          <div className="text-sm text-gray-500 mt-1">
            {record.startTime} - {record.endTime}
          </div>
        </div>
      )
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      render: (room) => (
        <Tag color="cyan" icon={<CalendarOutlined />}>
          {room}
        </Tag>
      )
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => getStatusBadge(record.status, record.checkInTime)
    },
    {
      title: "Bệnh nhân",
      key: "patients",
      render: (_, record) => (
        <div>
          <div className="font-semibold">
            {record.completedPatients}/{record.totalPatients}
          </div>
          <div className="text-sm text-gray-500">
            {record.status !== "absent" ? "Đã khám/Tổng" : "Chưa khám"}
          </div>
        </div>
      )
    },
    {
      title: "Tiến độ",
      key: "progress",
      render: (_, record) => {
        const percentage = record.totalPatients > 0 
          ? Math.round((record.completedPatients / record.totalPatients) * 100)
          : 0;
        
        return (
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Tiến độ</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      title: "Liên hệ",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <Tooltip title="Gọi điện">
          <Button 
            type="link" 
            icon={<PhoneOutlined />}
            size="small"
          >
            {phone}
          </Button>
        </Tooltip>
      )
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (notes) => (
        <div className="max-w-xs">
          {notes ? (
            <span className="text-sm">{notes}</span>
          ) : (
            <span className="text-gray-400 text-sm">Không có ghi chú</span>
          )}
        </div>
      )
    }
  ];

  // Statistics
  const stats = {
    total: doctorSchedules.length,
    present: doctorSchedules.filter(d => d.status === "present").length,
    absent: doctorSchedules.filter(d => d.status === "absent").length,
    late: doctorSchedules.filter(d => d.status === "late").length,
    totalPatients: doctorSchedules.reduce((sum, d) => sum + d.totalPatients, 0),
    completedPatients: doctorSchedules.reduce((sum, d) => sum + d.completedPatients, 0)
  };

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng bác sĩ"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Có mặt"
              value={stats.present}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Vắng mặt"
              value={stats.absent}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tỷ lệ khám"
              value={stats.totalPatients > 0 ? Math.round((stats.completedPatients / stats.totalPatients) * 100) : 0}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Card className="mb-6 shadow-md">
        <Row gutter={24}>
          <Col span={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.completedPatients}/{stats.totalPatients}
              </div>
              <div className="text-sm text-gray-500">Bệnh nhân đã khám/Tổng</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dayjs().format("DD/MM/YYYY")}
              </div>
              <div className="text-sm text-gray-500">Ngày hôm nay</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.late}
              </div>
              <div className="text-sm text-gray-500">Bác sĩ đi muộn</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card className="mb-6 shadow-md">
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="present">Có mặt</Option>
              <Option value="absent">Vắng mặt</Option>
              <Option value="late">Muộn</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              value={shiftFilter}
              onChange={setShiftFilter}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="all">Tất cả ca</Option>
              <Option value="Sáng">Ca sáng</Option>
              <Option value="Chiều">Ca chiều</Option>
              <Option value="Cả ngày">Cả ngày</Option>
            </Select>
          </Col>
          <Col span={10}>
            <Search
              placeholder="Tìm kiếm bác sĩ, chuyên khoa, phòng..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col span={6} className="text-right">
            <span className="text-gray-500">
              Cập nhật: {dayjs().format("HH:mm")}
            </span>
          </Col>
        </Row>
      </Card>

      {/* Schedule Table */}
      <Card title="Lịch Làm Việc Bác Sĩ Hôm Nay" className="shadow-md">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ x: 1200 }}
          rowClassName={(record) => {
            if (record.status === "absent") return "bg-red-50";
            if (record.status === "late") return "bg-yellow-50";
            return "";
          }}
        />
      </Card>
    </div>
  );
};

export default DoctorScheduleView; 