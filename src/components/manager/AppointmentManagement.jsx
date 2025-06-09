import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Typography, Spin, DatePicker, Select, Button, Input } from 'antd';
import { treatmentService } from '../../service/treatment.service';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AppointmentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await treatmentService.getTreatmentRecordsForManager();
      if (response?.data?.result) {
        setAppointments(response.data.result);
        setFilteredAppointments(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'InProgress':
        return 'processing';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Completed':
        return 'Hoàn thành';
      case 'InProgress':
        return 'Đang thực hiện';
      case 'Pending':
        return 'Chờ xử lý';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  useEffect(() => {
    let filtered = [...appointments];

    // Lọc theo searchText
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(app =>
        (app.customerName && app.customerName.toLowerCase().includes(lower)) ||
        (app.doctorName && app.doctorName.toLowerCase().includes(lower)) ||
        (app.treatmentServiceName && app.treatmentServiceName.toLowerCase().includes(lower)) ||
        (app.id && app.id.toString().includes(lower))
      );
    }

    // Lọc theo ngày
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      filtered = filtered.filter(app => {
        const d = dayjs(app.startDate);
        return d.isSameOrAfter(start, 'day') && d.isSameOrBefore(end, 'day');
      });
    }

    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Lọc theo dịch vụ
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(app => app.treatmentServiceName.includes(serviceFilter));
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchText, dateRange, statusFilter, serviceFilter]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      key: 'doctorName',
      width: 200,
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'treatmentServiceName',
      key: 'treatmentServiceName',
      width: 300,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 150,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'Chưa có',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>Quản lý lịch hẹn điều trị</Title>
        
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm khách hàng, bác sĩ, dịch vụ, mã lịch hẹn..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <RangePicker
            onChange={setDateRange}
            value={dateRange}
            format="DD/MM/YYYY"
          />
          <Select
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'Completed', label: 'Hoàn thành' },
              { value: 'InProgress', label: 'Đang thực hiện' },
              { value: 'Pending', label: 'Chờ xử lý' },
              { value: 'Cancelled', label: 'Đã hủy' },
            ]}
          />
          <Select
            style={{ width: 200 }}
            value={serviceFilter}
            onChange={setServiceFilter}
            options={[
              { value: 'all', label: 'Tất cả dịch vụ' },
              { value: 'IUI', label: 'Bơm tinh trùng vào buồng tử cung (IUI)' },
              { value: 'IVF', label: 'Thụ tinh trong ống nghiệm (IVF)' },
            ]}
          />
          <Button onClick={() => {
            setSearchText('');
            setDateRange(null);
            setStatusFilter('all');
            setServiceFilter('all');
          }}>
            Đặt lại
          </Button>
        </Space>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredAppointments}
            rowKey="id"
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `Tổng số ${total} lịch hẹn`,
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default AppointmentManagement; 