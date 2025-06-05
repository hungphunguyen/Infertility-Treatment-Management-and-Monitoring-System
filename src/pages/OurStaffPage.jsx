import React, { useState, useEffect } from "react";
import { Typography, Divider, Avatar, Tag, Button, Rate, Spin } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { doctorService } from "../service/doctor.service";

const { Title, Paragraph, Text } = Typography;

const OurStaffPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getAllDoctors();

        if (
          response.data &&
          response.data.result &&
          Array.isArray(response.data.result)
        ) {
          // Map API data to component format
          const mappedDoctors = response.data.result.map((doctor) => ({
            id: doctor.id,
            name: doctor.fullName,
            role: doctor.roleName?.description || "Bác sĩ chuyên khoa",
            specialization: doctor.qualifications || "Chuyên khoa Sản phụ khoa",
            experience: `${doctor.experienceYears || 0} năm kinh nghiệm`,
            image: doctor.avatarUrl || "/images/doctors/default-doctor.png",
            email: doctor.email || "Chưa cập nhật",
            phone: doctor.phoneNumber || "Chưa cập nhật",
            certificates: doctor.qualifications
              ? [doctor.qualifications]
              : ["Bằng cấp chuyên môn"],
            value: `dr_${doctor.id}`,
            rating: 4.5,
            treatmentType: "IVF",
            graduationYear: doctor.graduationYear,
            experienceYears: doctor.experienceYears,
            username: doctor.username,
          }));

          setDoctors(mappedDoctors);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  const handleBooking = (doctor) => {
    navigate(`/register-service`, {
      state: {
        selectedDoctor: doctor.value,
        doctorName: doctor.name,
        doctorRole: doctor.role,
        doctorSpecialization: doctor.specialization,
      },
    });
  };

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="/images/features/pc7.jpg"
          alt="Băng rôn Blog"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Bác Sĩ</h1>
          </div>
        </div>
      </div>
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Title level={1} className="text-3xl">
            Đội ngũ chuyên gia
          </Title>
          <Paragraph className="text-lg mt-4">
            Gặp gỡ đội ngũ bác sĩ, chuyên gia và nhân viên y tế giàu kinh nghiệm
            của chúng tôi
          </Paragraph>
        </div>

        <Divider />

        <div className="mb-12">
          <Title level={2} className="mb-6">
            Đội ngũ y bác sĩ
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="relative w-[280px] mx-auto mb-8 cursor-pointer group"
                onClick={() => handleDoctorClick(doctor.id)}
              >
                <div className="relative transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full object-cover rounded-t-lg transition-shadow duration-300 group-hover:shadow-2xl"
                    style={{ height: "400px" }}
                  />
                  <div
                    className="absolute left-0 bottom-0 w-full bg-white bg-opacity-95 rounded-b-lg px-4 flex flex-col items-center justify-center text-center shadow-md"
                    style={{ height: "128px" }}
                  >
                    <h3 className="text-xl font-bold mb-1 text-gray-800">
                      {doctor.name}
                    </h3>
                    <p className="text-[#ff8460] font-semibold mb-1">
                      {doctor.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {doctor.specialization}
                    </p>
                    <p className="text-gray-600 text-sm">{doctor.experience}</p>
                    <div className="mt-1 flex items-center justify-center">
                      <Rate
                        disabled
                        defaultValue={doctor.rating}
                        allowHalf
                        className="text-sm"
                      />
                      <span className="ml-2 text-gray-600">
                        ({doctor.rating})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className="my-12 text-center">
          <Title level={2} className="mb-4">
            Tham vấn với chuyên gia
          </Title>
          <Paragraph className="text-lg mb-6">
            Đặt lịch tư vấn với các chuyên gia của chúng tôi để được hỗ trợ về
            vấn đề hiếm muộn
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<CalendarOutlined />}
            className="bg-[#ff8460] hover:bg-[#ff6b40] border-none"
            onClick={() => navigate("/register-service")}
          >
            Đặt lịch hẹn
          </Button>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default OurStaffPage;
