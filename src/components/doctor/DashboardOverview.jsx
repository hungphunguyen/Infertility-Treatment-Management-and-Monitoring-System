import React, { useState } from "react";
import { 
  Card, Row, Col, Table, Calendar, Badge, Typography, Statistic, 
  Tag, Avatar, Space, Button, Timeline, Progress 
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DashboardOverview = () => {
  // Mock data for today's appointments
  const todayAppointments = [
    {
      key: 1,
      time: "08:00",
      patientName: "Nguyễn Thị Mai",
      phone: "0912345678",
      service: "Tư vấn IVF",
      status: "completed",
      room: "P101"
    },
    {
      key: 2,
      time: "09:30",
      patientName: "Trần Văn Hùng",
      phone: "0987654321", 
      service: "Theo dõi phôi",
      status: "in-progress",
      room: "P101"
    },
    {
      key: 3,
      time: "10:00",
      patientName: "Lê Thị Lan",
      phone: "0901234567",
      service: "IUI lần 2",
      status: "waiting",
      room: "P101"
    },
    {
      key: 4,
      time: "14:00",
      patientName: "Phạm Minh Đức",
      phone: "0934567890",
      service: "Xét nghiệm hormone",
      status: "scheduled",
      room: "P101"
    },
    {
      key: 5,
      time: "15:30",
      patientName: "Hoàng Thị Nga",
      phone: "0945678901",
      service: "Tái khám IVF",
      status: "scheduled",
      room: "P101"
    }
  ];

  // Mock data for weekly calendar
  const getListData = (value) => {
    const appointments = {
      1: [
        { type: 'success', content: '5 bệnh nhân' },
        { type: 'warning', content: '2 xét nghiệm' }
      ],
      2: [
        { type: 'success', content: '7 bệnh nhân' },
        { type: 'error', content: '1 khẩn cấp' }
      ],
      3: [
        { type: 'success', content: '6 bệnh nhân' }
      ],
      4: [
        { type: 'success', content: '4 bệnh nhân' },
        { type: 'warning', content: '3 xét nghiệm' }
      ],
      5: [
        { type: 'success', content: '8 bệnh nhân' }
      ]
    };
    return appointments[value.date()] || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} style={{ fontSize: '11px' }} />
          </li>
        ))}
      </ul>
    );
  };

  const getStatusTag = (status) => {
    const statusMap = {
      completed: { color: "green", text: "Hoàn thành" },
      "in-progress": { color: "blue", text: "Đang khám" },
      waiting: { color: "orange", text: "Chờ khám" },
      scheduled: { color: "default", text: "Đã đặt lịch" }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const appointmentColumns = [
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
      render: (time) => (
        <Text strong style={{ color: "#1890ff" }}>{time}</Text>
      )
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (name, record) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
            <Text strong>{name}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.phone}
          </Text>
        </div>
      )
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service"
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      render: (room) => <Tag color="cyan">{room}</Tag>
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag
    }
  ];

  // Statistics
  const todayStats = {
    total: todayAppointments.length,
    completed: todayAppointments.filter(a => a.status === "completed").length,
    inProgress: todayAppointments.filter(a => a.status === "in-progress").length,
    waiting: todayAppointments.filter(a => a.status === "waiting").length
  };

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn hôm nay"
              value={todayStats.total}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={todayStats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang khám"
              value={todayStats.inProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={todayStats.waiting}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Today's Appointments */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                <span>Lịch Khám Hôm Nay</span>
                <Tag color="blue">{dayjs().format("DD/MM/YYYY")}</Tag>
              </Space>
            }
            extra={
              <Text type="secondary">
                Tiến độ: {Math.round((todayStats.completed / todayStats.total) * 100)}%
              </Text>
            }
          >
            <Progress 
              percent={Math.round((todayStats.completed / todayStats.total) * 100)} 
              strokeColor="#52c41a"
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={appointmentColumns}
              dataSource={todayAppointments}
              size="small"
              pagination={false}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        {/* Weekly Schedule */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <Space>
                <MedicineBoxOutlined />
                <span>Lịch Làm Việc Tuần Này</span>
              </Space>
            }
          >
            <Calendar 
              fullscreen={false} 
              dateCellRender={dateCellRender}
              headerRender={() => (
                <div style={{ padding: '8px 0', textAlign: 'center' }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {dayjs().format("MMMM YYYY")}
                  </Title>
                </div>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Hoạt động gần đây">
            <Timeline>
              <Timeline.Item color="green">
                <Text>09:45 - Hoàn thành khám cho bệnh nhân Nguyễn Thị Mai</Text>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Text>09:30 - Bắt đầu khám bệnh nhân Trần Văn Hùng</Text>
              </Timeline.Item>
              <Timeline.Item>
                <Text>08:00 - Bắt đầu ca làm việc</Text>
              </Timeline.Item>
              <Timeline.Item color="gray">
                <Text>07:30 - Đăng nhập hệ thống</Text>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview; 