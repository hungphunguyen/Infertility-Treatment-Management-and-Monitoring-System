import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, Avatar, Spin, Alert, Button } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { useParams, useNavigate } from "react-router-dom";
import { doctorService } from "../service/doctor.service";

const { Title, Text } = Typography;

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getDoctorInfo(id);
        
        if (response.data && response.data.code === 1000) {
          setDoctor(response.data.result);
        } else {
          setError("Không thể tải thông tin bác sĩ");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Có lỗi xảy ra khi tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorInfo();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen">
        <UserHeader />
        <div className="px-4 py-8 max-w-7xl mx-auto text-center">
          <Spin size="large" tip="Đang tải thông tin bác sĩ..." />
        </div>
        <UserFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen">
        <UserHeader />
        <div className="px-4 py-8 max-w-7xl mx-auto">
          <Alert message="Lỗi" description={error} type="error" showIcon />
        </div>
        <UserFooter />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="w-full min-h-screen">
        <UserHeader />
        <div className="px-4 py-8 max-w-7xl mx-auto">
          <Alert message="Không tìm thấy bác sĩ" type="warning" showIcon />
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      <div className="px-4 py-8 max-w-7xl mx-auto">
        
        <Card>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={6} className="text-center">
              {doctor.avatarUrl && (
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.fullName}
                  className="w-[280px] mx-auto object-cover rounded-t-lg"
                  style={{ height: '400px' }}
                />
              )}
            </Col>
            
            <Col xs={24} md={12}>
              <Title level={2}>{doctor.fullName}</Title>
              <p><strong>Chuyên khoa:</strong> {doctor.specialty || "Chưa cập nhật"}</p>
              <p><strong>Kinh nghiệm:</strong> {doctor.experience || "Chưa cập nhật"}</p>
              
              {doctor.phoneNumber && (
                <p><PhoneOutlined /> {doctor.phoneNumber}</p>
              )}
              
              {doctor.email && (
                <p><MailOutlined /> {doctor.email}</p>
              )}
              
              {doctor.address && (
                <p><strong>Địa chỉ:</strong> {doctor.address}</p>
              )}
            </Col>
            
            <Col xs={24} md={6} className="text-center">
              <Button 
                type="primary" 
                size="large" 
                onClick={() => navigate("/register-service")}
              >
                Đặt lịch khám
              </Button>
            </Col>
          </Row>
        </Card>

      </div>
      <UserFooter />
    </div>
  );
};

export default DoctorDetailPage; 