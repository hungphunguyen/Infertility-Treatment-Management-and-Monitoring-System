import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Form, 
  Select, 
  DatePicker, 
  TimePicker, 
  Button, 
  Table, 
  Space,
  message,
  Row,
  Col,
  Divider
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const ScheduleManagement = () => {
  const [form] = Form.useForm();
  const [schedules, setSchedules] = useState([
    {
      key: 1,
      weekday: "MONDAY",
      startTime: "08:00",
      endTime: "17:00"
    }
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [startWeek, setStartWeek] = useState(null);

  // Mock doctors data - replace with API call
  const doctors = [
    { id: 1, name: "Dr. John Smith", specialty: "Cardiology" },
    { id: 2, name: "Dr. Sarah Wilson", specialty: "Pediatrics" },
    { id: 3, name: "Dr. Michael Brown", specialty: "Neurology" },
    { id: 4, name: "Dr. Emily Davis", specialty: "Dermatology" },
  ];

  const weekdays = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", 
    "FRIDAY", "SATURDAY", "SUNDAY"
  ];

  const addSchedule = (values) => {
    const { weekday, startTime, endTime } = values;
    
    // Check if weekday already exists
    if (schedules.find(s => s.weekday === weekday)) {
      message.error("This weekday already has a schedule!");
      return;
    }

    // Validate time
    if (startTime.isAfter(endTime)) {
      message.error("Start time must be before end time!");
      return;
    }

    const newSchedule = {
      key: Date.now(),
      weekday,
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm")
    };

    setSchedules([...schedules, newSchedule]);
    form.resetFields(['weekday', 'startTime', 'endTime']);
    message.success("Schedule added successfully!");
  };

  const deleteSchedule = (key) => {
    setSchedules(schedules.filter(s => s.key !== key));
    message.success("Schedule deleted successfully!");
  };

  const submitSchedule = () => {
    if (!selectedDoctor) {
      message.error("Please select a doctor!");
      return;
    }
    if (!startWeek) {
      message.error("Please select start week!");
      return;
    }
    if (schedules.length === 0) {
      message.error("Please add at least one working day!");
      return;
    }

    // Here you would make API call to save the schedule
    console.log("Creating schedule:", {
      doctorId: selectedDoctor,
      startWeek: startWeek.format("YYYY-MM-DD"),
      schedules
    });
    
    message.success("Doctor schedule created successfully!");
  };

  const columns = [
    {
      title: "Weekday",
      dataIndex: "weekday",
      key: "weekday",
      render: (weekday) => <strong>{weekday}</strong>
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time", 
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button 
          type="primary" 
          danger 
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => deleteSchedule(record.key)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Card className="shadow-md">
        <Title level={2} style={{ marginBottom: "2rem", color: "#333" }}>
          Create Doctor Schedule
        </Title>

        <Form form={form} layout="vertical" onFinish={addSchedule}>
          {/* Doctor Selection */}
          <Form.Item
            label="Select Doctor"
            required
            style={{ marginBottom: "1.5rem" }}
          >
            <Select
              placeholder="Choose a doctor..."
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              size="large"
            >
              {doctors.map(doctor => (
                <Option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Start Week Selection */}
          <Form.Item
            label="Start Week (Monday)"
            required
            style={{ marginBottom: "2rem" }}
          >
            <DatePicker
              placeholder="Select start week"
              value={startWeek}
              onChange={setStartWeek}
              size="large"
              style={{ width: "100%" }}
              picker="week"
            />
          </Form.Item>

          <Divider />

          {/* Add Working Days Section */}
          <Card 
            title="Add Working Days" 
            style={{ margin: "2rem 0", border: "1px solid #ddd" }}
          >
            <Row gutter={16} align="bottom">
              <Col span={8}>
                <Form.Item
                  name="weekday"
                  label="Select Day"
                  rules={[{ required: true, message: "Please select a weekday!" }]}
                >
                  <Select placeholder="Select day..." size="large">
                    {weekdays.map(day => (
                      <Option key={day} value={day}>{day}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="startTime"
                  label="Start Time"
                  rules={[{ required: true, message: "Please select start time!" }]}
                >
                  <TimePicker 
                    format="HH:mm" 
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="endTime"
                  label="End Time"
                  rules={[{ required: true, message: "Please select end time!" }]}
                >
                  <TimePicker 
                    format="HH:mm" 
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{ width: "100%" }}
                  >
                    Add Schedule
                  </Button>
                </Form.Item>
              </Col>
            </Row>

            {/* Schedule Table */}
            <div style={{ marginTop: "1.5rem" }}>
              <Table
                columns={columns}
                dataSource={schedules}
                pagination={false}
                size="small"
                style={{ marginTop: "1rem" }}
              />
            </div>
          </Card>

          {/* Submit Button */}
          <Button 
            type="primary" 
            size="large"
            onClick={submitSchedule}
            style={{ 
              width: "100%", 
              marginTop: "1rem",
              height: "50px",
              fontSize: "16px"
            }}
          >
            Create Schedule
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ScheduleManagement; 