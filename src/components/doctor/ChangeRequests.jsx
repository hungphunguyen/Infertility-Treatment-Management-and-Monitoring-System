import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Tag, Modal, Input, message, Spin } from 'antd';
import { doctorService } from '../../service/doctor.service';
import { authService } from '../../service/auth.service';
import dayjs from 'dayjs';

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
      const res = await authService.getMyInfo();
      console.log('[ChangeRequests] Doctor info:', res?.data?.result);
      setDoctorId(res?.data?.result?.id);
    };
    fetchDoctor();
  }, []);

  useEffect(() => {
    if (doctorId) {
      console.log('[ChangeRequests] doctorId:', doctorId);
      console.log('[ChangeRequests] Token:', localStorage.getItem('token'));
      fetchRequests();
    }
    // eslint-disable-next-line
  }, [doctorId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      console.log('[ChangeRequests] Fetching requests for doctorId:', doctorId);
      const res = await doctorService.getAppointmentsWithPendingChange(doctorId);
      console.log('[ChangeRequests] API response:', res);
      setRequests(res.data.result || []);
    } catch (err) {
      console.error('[ChangeRequests] Error fetching requests:', err);
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
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Email', dataIndex: 'customerEmail', key: 'customerEmail' },
    { title: 'Dịch vụ', dataIndex: 'serviceName', key: 'serviceName' },
    { title: 'Bước', dataIndex: 'purpose', key: 'purpose' },
    { title: 'Ngày hẹn', dataIndex: 'appointmentDate', key: 'appointmentDate', render: t => t ? dayjs(t).format('DD/MM/YYYY') : '' },
    { title: 'Ca', dataIndex: 'shift', key: 'shift' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => <Tag color="orange">Chờ duyệt</Tag> },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => <Button type="primary" onClick={() => { setSelected(record); setModalVisible(true); setNotes(''); }}>Duyệt</Button>
    }
  ];

  return (
    <Card title="Yêu cầu đổi lịch hẹn từ khách hàng" style={{ margin: 24 }}>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={requests} rowKey="id" pagination={false} />
      </Spin>
      <Modal
        title="Duyệt yêu cầu đổi lịch hẹn"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selected && (
          <div>
            <p><b>Khách hàng:</b> {selected.customerName}</p>
            <p><b>Bước:</b> {selected.purpose}</p>
            <p><b>Ngày hẹn:</b> {selected.appointmentDate ? dayjs(selected.appointmentDate).format('DD/MM/YYYY') : ''}</p>
            <p><b>Ca:</b> {selected.shift}</p>
            <Input.TextArea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ghi chú cho khách hàng (nếu có)"
              style={{ marginBottom: 12 }}
            />
            <Button type="primary" loading={actionLoading} onClick={() => handleAction('CONFIRMED')} style={{ marginRight: 8 }}>Duyệt</Button>
            <Button danger loading={actionLoading} onClick={() => handleAction('CANCELLED')}>Từ chối</Button>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ChangeRequests; 