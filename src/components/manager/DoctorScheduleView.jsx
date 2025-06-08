import React, { useState, useEffect } from "react";
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
  Tooltip,
  Spin,
  Modal,
  Progress
} from "antd";
import { 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined as CalendarIcon
} from "@ant-design/icons";
import dayjs from "dayjs";
import { doctorService } from "../../service/doctor.service";
import { treatmentService } from "../../service/treatment.service";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const DoctorScheduleView = () => {
  const [loading, setLoading] = useState(true);
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [shiftFilter, setShiftFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorModalVisible, setDoctorModalVisible] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loadingDoctorDetails, setLoadingDoctorDetails] = useState(false);
  const [treatmentRecords, setTreatmentRecords] = useState([]);

  // Fetch doctor schedules and treatment records when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorsResponse, treatmentResponse] = await Promise.all([
        doctorService.getDoctorSchedules(),
        treatmentService.getTreatmentRecordsForManager()
      ]);
      
      if (doctorsResponse?.data?.result) {
        const doctors = Array.isArray(doctorsResponse.data.result) 
          ? doctorsResponse.data.result 
          : [doctorsResponse.data.result];
        
        // Transform API data to match our table structure
        const transformedSchedules = doctors.map((doctor, index) => ({
          key: index + 1,
          doctorId: doctor.id,
          doctorName: doctor.fullName,
          specialty: doctor.specialty || doctor.qualifications || doctor.roleName?.description || "Bác sĩ điều trị",
          phone: doctor.phoneNumber
        }));

        setDoctorSchedules(transformedSchedules);
        setFilteredData(transformedSchedules);
      }

      if (treatmentResponse?.data?.result) {
        setTreatmentRecords(treatmentResponse.data.result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async (doctorId) => {
    try {
      setLoadingDoctorDetails(true);
      const response = await doctorService.getDoctorById(doctorId);
      if (response?.data?.result) {
        setDoctorDetails(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    } finally {
      setLoadingDoctorDetails(false);
    }
  };

  const showDoctorDetails = async (doctorId) => {
    setSelectedDoctor(doctorId);
    setDoctorModalVisible(true);
    await fetchDoctorDetails(doctorId);
  };

  // Filter schedules
  useEffect(() => {
    let filtered = doctorSchedules;
    
    if (shiftFilter !== "all") {
      filtered = filtered.filter(item => item.shift === shiftFilter);
    }
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.specialty.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [shiftFilter, searchText, doctorSchedules]);

  const getShiftTag = (shift) => {
    const shiftMap = {
      "Sáng": { color: "blue" },
      "Chiều": { color: "orange" },
      "Cả ngày": { color: "purple" }
    };
    return <Tag color={shiftMap[shift]?.color}>{shift}</Tag>;
  };

  const getDoctorStats = (doctorName) => {
    const doctorRecords = treatmentRecords.filter(record => record.doctorName === doctorName);
    const today = dayjs().format('YYYY-MM-DD');
    const todayRecords = doctorRecords.filter(record => record.startDate === today);
    
    return {
      totalPatients: todayRecords.length,
      completedPatients: todayRecords.filter(record => record.status === 'Completed').length,
      inProgressPatients: todayRecords.filter(record => record.status === 'InProgress').length,
      pendingPatients: todayRecords.filter(record => record.status === 'Pending').length
    };
  };

  const columns = [
    {
      title: "Bác sĩ",
      key: "doctor",
      render: (_, record) => (
        <div 
          className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
          onClick={() => showDoctorDetails(record.doctorId)}
        >
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
      key: "shift",
      render: (_, record) => {
        const stats = getDoctorStats(record.doctorName);
        return (
          <div>
            <div className="flex items-center space-x-2">
              <Tag color="blue">Cả ngày</Tag>
              <span className="text-sm text-gray-500">08:00 - 17:00</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {stats.totalPatients} bệnh nhân hôm nay
            </div>
          </div>
        );
      }
    },
    {
      title: "Bệnh nhân",
      key: "patients",
      render: (_, record) => {
        const stats = getDoctorStats(record.doctorName);
        return (
          <div>
            <div className="font-semibold">
              {stats.completedPatients}/{stats.totalPatients}
            </div>
            <div className="text-sm text-gray-500">
              Đã khám/Tổng
            </div>
          </div>
        );
      }
    },
    {
      title: "Tiến độ",
      key: "progress",
      render: (_, record) => {
        const stats = getDoctorStats(record.doctorName);
        const percentage = stats.totalPatients > 0 
          ? Math.round((stats.completedPatients / stats.totalPatients) * 100)
          : 0;
        
        return (
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Tiến độ</span>
              <span>{percentage}%</span>
            </div>
            <Progress 
              percent={percentage} 
              size="small"
              status={percentage === 100 ? "success" : "active"}
            />
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
    }
  ];

  // Calculate statistics
  const stats = {
    totalDoctors: doctorSchedules.length,
    totalPatients: treatmentRecords.filter(record => record.startDate === dayjs().format('YYYY-MM-DD')).length,
    completedPatients: treatmentRecords.filter(record => 
      record.startDate === dayjs().format('YYYY-MM-DD') && 
      record.status === 'Completed'
    ).length
  };

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng bác sĩ"
              value={stats.totalDoctors}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Bệnh nhân đã khám/Tổng"
              value={`${stats.completedPatients}/${stats.totalPatients}`}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tỷ lệ khám"
              value={stats.totalPatients > 0 
                ? Math.round((stats.completedPatients / stats.totalPatients) * 100) 
                : 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Card className="mb-6 shadow-md">
        <Row gutter={24}>
          <Col span={24}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dayjs().format("DD/MM/YYYY")}
              </div>
              <div className="text-sm text-gray-500">Ngày hôm nay</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card className="mb-6 shadow-md">
        <Row gutter={16} align="middle">
          <Col span={8}>
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
          <Col span={12}>
            <Search
              placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
            />
          </Col>
          <Col span={4} className="text-right">
            <Button 
              type="primary" 
              onClick={fetchData}
              icon={<CalendarOutlined />}
            >
              Làm mới
            </Button>
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
          loading={loading}
        />
      </Card>

      {/* Doctor Details Modal */}
      <Modal
        title="Thông tin chi tiết bác sĩ"
        open={doctorModalVisible}
        onCancel={() => setDoctorModalVisible(false)}
        footer={null}
        width={600}
      >
        {loadingDoctorDetails ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : doctorDetails ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar 
                size={64} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <div>
                <h3 className="text-xl font-bold">{doctorDetails.fullName}</h3>
                <p className="text-gray-500">{doctorDetails.roleName?.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MailOutlined className="mr-2" />
                  <span>{doctorDetails.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneOutlined className="mr-2" />
                  <span>{doctorDetails.phoneNumber}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <EnvironmentOutlined className="mr-2" />
                  <span>{doctorDetails.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="mr-2" />
                  <span>Ngày sinh: {dayjs(doctorDetails.dateOfBirth).format("DD/MM/YYYY")}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <span className="font-semibold mr-2">Giới tính:</span>
                  <span>{doctorDetails.gender === "male" ? "Nam" : "Nữ"}</span>
                </div>
                {doctorDetails.qualifications && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-semibold mr-2">Bằng cấp:</span>
                    <span>{doctorDetails.qualifications}</span>
                  </div>
                )}
                {doctorDetails.graduationYear && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-semibold mr-2">Năm tốt nghiệp:</span>
                    <span>{doctorDetails.graduationYear}</span>
                  </div>
                )}
                {doctorDetails.experienceYears && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-semibold mr-2">Kinh nghiệm:</span>
                    <span>{doctorDetails.experienceYears} năm</span>
                  </div>
                )}
                {doctorDetails.specialty && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-semibold mr-2">Chuyên khoa:</span>
                    <span>{doctorDetails.specialty}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Không tìm thấy thông tin bác sĩ
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorScheduleView; 