import React, { useState, useEffect, useContext } from "react";
import { Typography, Card, Row, Col, Avatar, Spin, Alert, Button, List, Rate } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { useParams, useNavigate } from "react-router-dom";
import { doctorService } from "../service/doctor.service";
import { getLocgetlStorage } from "../utils/util";
import { NotificationContext } from "../App";

const { Title } = Typography;

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [doctorRating, setDoctorRating] = useState(null);

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
        setError("Có lỗi xảy ra khi tải thông tin");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDoctorInfo();
    }
  }, [id]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!id) return;
      setLoadingFeedbacks(true);
      try {
        const response = await doctorService.getDoctorFeedback(id, true);
        if (response.data && response.data.code === 1000) {
          setFeedbacks(response.data.result);
        }
      } catch (error) {
        //
      } finally {
        setLoadingFeedbacks(false);
      }
    };
    fetchFeedbacks();
  }, [id]);

  useEffect(() => {
    // Fetch doctor rating
    const fetchDoctorRating = async () => {
      try {
        const res = await doctorService.getDoctorRatings();
        if (res.data && res.data.code === 1000 && Array.isArray(res.data.result)) {
          const found = res.data.result.find((d) => d.id === id);
          setDoctorRating(found ? found.rate : null);
        }
      } catch (e) {
        setDoctorRating(null);
      }
    };
    if (id) fetchDoctorRating();
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
    <div className="w-full min-h-screen bg-[#f7f8fa]">
      <UserHeader />
      <div className="px-4 py-8 max-w-5xl mx-auto">
        <Card className="shadow-lg rounded-xl p-6">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={6} className="flex flex-col items-center">
              <Avatar
                src={doctor.avatarUrl}
                size={180}
                className="border-4 border-orange-400 shadow-lg"
                icon={<UserOutlined />}
              />
              <div className="mt-4 text-center">
                {doctorRating !== null && (
                  <>
                    <Rate disabled allowHalf value={doctorRating} style={{ fontSize: 28 }} />
                    <span className="ml-2 text-lg font-semibold text-gray-700">{doctorRating}</span>
                    <div className="text-gray-500 text-sm mt-1">Đánh giá tổng quan</div>
                  </>
                )}
              </div>
            </Col>
            <Col xs={24} md={14}>
              <Title level={2} className="mb-2 text-orange-500">{doctor.fullName}</Title>
              <div className="mb-2 flex items-center"><UserOutlined className="mr-2 text-orange-400" /> <span className="font-semibold mr-1">Chuyên khoa:</span> <span>{doctor.specialty || "Chưa cập nhật"}</span></div>
              <div className="mb-2 flex items-center"><MailOutlined className="mr-2 text-orange-400" /> <span className="font-semibold mr-1">Email:</span> <span>{doctor.email || "Chưa cập nhật"}</span></div>
              <div className="mb-2 flex items-center"><PhoneOutlined className="mr-2 text-orange-400" /> <span className="font-semibold mr-1">Số điện thoại:</span> <span>{doctor.phoneNumber || "Chưa cập nhật"}</span></div>
              <div className="mb-2 flex items-center"><span className="mr-2 text-orange-400">🎓</span> <span className="font-semibold mr-1">Bằng cấp:</span> <span>{doctor.qualifications || "Chưa cập nhật"}</span></div>
              <div className="mb-2 flex items-center"><span className="mr-2 text-orange-400">📅</span> <span className="font-semibold mr-1">Năm tốt nghiệp:</span> <span>{doctor.graduationYear || "Chưa cập nhật"}</span></div>
              <div className="mb-2 flex items-center"><span className="mr-2 text-orange-400">📍</span> <span className="font-semibold mr-1">Địa chỉ:</span> <span>{doctor.address || "Chưa cập nhật"}</span></div>
              <div className="mb-2 flex items-center"><span className="mr-2 text-orange-400">💼</span> <span className="font-semibold mr-1">Kinh nghiệm:</span> <span>{doctor.experienceYears ? `${doctor.experienceYears} năm kinh nghiệm` : "Chưa cập nhật"}</span></div>
            </Col>
            <Col xs={24} md={4} className="flex flex-col items-center justify-center">
              <Button
                type="primary"
                size="large"
                className="bg-[#ff8460] hover:bg-[#ff6b40] border-none shadow"
                onClick={() => navigate('/register-service', { 
                  state: { 
                    selectedDoctor: doctor.id,
                    doctorName: doctor.fullName,
                    doctorRole: doctor.roleName?.description || "Bác sĩ chuyên khoa",
                    doctorSpecialization: doctor.specialty || doctor.qualifications
                  } 
                })}
              >
                Đặt lịch khám
              </Button>
            </Col>
          </Row>
        </Card>
        <Card title="Đánh giá từ bệnh nhân" className="mt-8 shadow rounded-xl">
          {loadingFeedbacks ? (
            <Spin tip="Đang tải đánh giá..." />
          ) : (
            <>
              <List
                dataSource={showAllFeedbacks ? feedbacks : feedbacks.slice(0, 3)}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.customerName}
                      description={
                        <>
                          <Rate disabled defaultValue={item.rating} />
                          <p>{item.comment}</p>
                          <small>Ngày: {new Date(item.submitDate).toLocaleDateString()}</small>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
              {feedbacks.length > 3 && !showAllFeedbacks && (
                <Button type="link" onClick={() => setShowAllFeedbacks(true)}>
                  Xem thêm
                </Button>
              )}
            </>
          )}
        </Card>
      </div>
      <UserFooter />
    </div>
  );
};

export default DoctorDetailPage; 