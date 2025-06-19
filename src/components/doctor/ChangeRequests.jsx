import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Tag, Modal, Input, message, Spin, Space, Typography, Descriptions } from 'antd';
import { doctorService } from '../../service/doctor.service';
import { authService } from '../../service/auth.service';
import dayjs from 'dayjs';
import { UserOutlined, CalendarOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ChangeRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await authService.getMyInfo();
        setDoctorId(res?.data?.result?.id);
      } catch {}
    };
    fetchDoctor();
  }, []);

  useEffect(() => {
    if (doctorId) fetchRequests();
    // eslint-disable-next-line
  }, [doctorId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getAppointmentsWithPendingChange(doctorId);
      setRequests(res.data.result || []);
    } catch (err) {
      message.error('Không thể tải yêu cầu đổi lịch!');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await doctorService.confirmAppointmentChange(selected.id, { status, notes });
      message.success(status === 'CONFIRMED' ? 'Đã duyệt yêu cầu!' : 'Đã từ chối yêu cầu!');
      setModalVisible(false);
      fetchRequests();
    } catch (err) {
      message.error('Không thể cập nhật yêu cầu!');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      title: <span><UserOutlined /> Khách hàng</span>,
      dataIndex: 'customerName',
      key: 'customerName',
      render: (t) => <Text strong>{t}</Text>
    },
    { title: 'Email', dataIndex: 'customerEmail', key: 'customerEmail' },
    { title: 'Dịch vụ', dataIndex: 'serviceName', key: 'serviceName' },
    { title: 'Bước', dataIndex: 'purpose', key: 'purpose' },
    {
      title: <span><CalendarOutlined /> Ngày hẹn</span>,
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: t => t ? dayjs(t).format('DD/MM/YYYY') : ''
    },
    { title: 'Ca', dataIndex: 'shift', key: 'shift' },
    {
      title: <span><SyncOutlined spin /> Đổi sang ngày</span>,
      dataIndex: 'requestedDate',
      key: 'requestedDate',
      render: t => t ? dayjs(t).format('DD/MM/YYYY') : ''
    },
    {
      title: 'Đổi sang ca',
      dataIndex: 'requestedShift',
      key: 'requestedShift',
      render: s => s === 'MORNING' ? 'Sáng' : s === 'AFTERNOON' ? 'Chiều' : s
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: s => <Tag color="orange">Chờ duyệt</Tag>
    },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => { setSelected(record); setModalVisible(true); setNotes(''); }}
        >
          Duyệt
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        title={<Space><SyncOutlined spin style={{ color: '#faad14' }} /> <span>Yêu cầu đổi lịch hẹn từ khách hàng</span></Space>}
        style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
        styles={{ body: { padding: 24 } }}
        hoverable
      >
        <Spin spinning={loading} tip="Đang tải...">
          <Table 
            columns={columns} 
            dataSource={requests} 
            rowKey="id" 
            pagination={{ pageSize: 8 }}
            bordered
            size="middle"
            style={{ background: 'white', borderRadius: 8 }}
            scroll={{ x: 'max-content' }}
          />
        </Spin>
        <Modal
          title={<Space><EditOutlined /> Duyệt yêu cầu đổi lịch hẹn</Space>}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          centered
        >
          {selected && (
            <div style={{ padding: 8 }}>
              <Descriptions column={1} size="small" bordered style={{ marginBottom: 12 }}>
                <Descriptions.Item label="Khách hàng">{selected.customerName}</Descriptions.Item>
                <Descriptions.Item label="Bước">{selected.purpose}</Descriptions.Item>
                <Descriptions.Item label="Ngày hẹn">{selected.appointmentDate ? dayjs(selected.appointmentDate).format('DD/MM/YYYY') : ''}</Descriptions.Item>
                <Descriptions.Item label="Ca">{selected.shift}</Descriptions.Item>
                <Descriptions.Item label="Đổi sang ngày">{selected.requestedDate ? dayjs(selected.requestedDate).format('DD/MM/YYYY') : ''}</Descriptions.Item>
                <Descriptions.Item label="Đổi sang ca">{selected.requestedShift === 'MORNING' ? 'Sáng' : selected.requestedShift === 'AFTERNOON' ? 'Chiều' : selected.requestedShift}</Descriptions.Item>
              </Descriptions>
              <Input.TextArea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ghi chú cho khách hàng (nếu có)"
                style={{ marginBottom: 16 }}
              />
              <Space style={{ width: '100%', justifyContent: 'end' }}>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  loading={actionLoading} 
                  onClick={() => handleAction('CONFIRMED')} 
                  style={{ minWidth: 120 }}
                >
                  Duyệt
                </Button>
                <Button 
                  danger 
                  icon={<CloseCircleOutlined />} 
                  loading={actionLoading} 
                  onClick={() => handleAction('REJECTED')} 
                  style={{ minWidth: 120 }}
                >
                  Từ chối
                </Button>
              </Space>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default ChangeRequests; 