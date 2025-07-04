import React from "react";
import { Form, Input, Select, DatePicker, Radio, Button, Row, Col } from "antd";

const { TextArea } = Input;

export default function RegisterForm({
  form,
  doctors,
  services,
  loading,
  onSubmit,
  onDoctorChange,
}) {
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      {/* Group: Thông tin cá nhân */}
      <h3>🧍 Thông tin cá nhân</h3>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true }]}
          >
            <Radio.Group className="w-full">
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
              <Radio value="other">Khác</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      {/* Group: Thông tin lịch khám */}
      <h3>📅 Lịch khám & Dịch vụ</h3>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="appointmentDate"
            label="Ngày khám"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="shift" label="Ca khám" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Sáng (08:00 - 12:00)", value: "MORNING" },
                { label: "Chiều (13:00 - 17:00)", value: "AFTERNOON" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="cd1Date" label="Ngày đầu chu kỳ">
            <DatePicker className="w-full" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="serviceId"
            label="Gói dịch vụ điều trị"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="-- Chọn dịch vụ --"
              options={services.map((s) => ({
                label: s.serviceName,
                value: s.id,
              }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="doctorId" label="Bác sĩ (tuỳ chọn)">
            <Select
              allowClear
              placeholder="-- Hệ thống tự chọn --"
              options={doctors.map((d) => ({
                label: d.fullName,
                value: d.id,
              }))}
              onChange={onDoctorChange}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="medicalHistory" label="Tiền sử bệnh lý">
            <TextArea
              rows={3}
              placeholder="Ví dụ: u xơ tử cung, vô sinh thứ phát..."
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Submit */}
      <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" htmlType="submit" loading={loading} size="large">
          Xác nhận đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
}
