import React from "react";
import {
  Typography,
  Divider,
  Avatar,
  Tag,
  Button,
  Rate,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

const { Title, Paragraph, Text } = Typography;

const doctors = [
  {
    id: 1,
    name: "PGS.TS.BS Nguyễn Văn A",
    role: "Giám đốc trung tâm",
    specialization: "Chuyên khoa Sản phụ khoa, Hỗ trợ sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Hà Nội",
    experience: "Hơn 20 năm kinh nghiệm trong lĩnh vực hỗ trợ sinh sản",
    image: "/images/doctors/doctor1.png",
    email: "nguyen.van.a@example.com",
    phone: "+84 123 456 789",
    certificates: [
      "Hội Sản Phụ Khoa Việt Nam",
      "Hiệp hội Sinh sản Châu Á Thái Bình Dương",
    ],
    value: "dr_nguyen",
    rating: 4.8,
    treatmentType: "IVF",
  },
  {
    id: 2,
    name: "TS.BS Lê Thị B",
    role: "Phó Giám đốc",
    specialization: "Chuyên khoa Nội tiết sinh sản",
    education: "Tiến sĩ Y khoa, Đại học Y Dược TP.HCM",
    experience: "15 năm kinh nghiệm trong điều trị vô sinh hiếm muộn",
    image: "/images/doctors/doctor2.png",
    email: "le.thi.b@example.com",
    phone: "+84 123 456 790",
    certificates: ["Hội Nội tiết Việt Nam", "Hiệp hội Sinh sản Quốc tế"],
    value: "dr_le",
    rating: 4.7,
    treatmentType: "IUI",
  },
  {
    id: 3,
    name: "ThS.BS Trần Văn C",
    role: "Trưởng phòng phôi học",
    specialization: "Phôi học lâm sàng",
    education: "Thạc sĩ Y khoa, Đại học Y Huế",
    experience: "12 năm kinh nghiệm trong nuôi cấy phôi",
    image: "/images/doctors/doctor3.jpg",
    email: "tran.van.c@example.com",
    phone: "+84 123 456 791",
    certificates: [
      "Hiệp hội Phôi học Châu Á",
      "Chứng chỉ Phôi học lâm sàng quốc tế",
    ],
    value: "dr_tran",
    rating: 4.6,
    treatmentType: "IVF",
  },
  {
    id: 4,
    name: "BSCKII Phạm Thị D",
    role: "Bác sĩ điều trị",
    specialization: "Chuyên khoa Sản phụ khoa",
    education: "Bác sĩ chuyên khoa II, Đại học Y Hà Nội",
    experience: "10 năm kinh nghiệm trong điều trị vô sinh",
    image: "/images/doctors/doctor4.jpg",
    email: "pham.thi.d@example.com",
    phone: "+84 123 456 792",
    certificates: ["Hội Sản Phụ Khoa Việt Nam"],
    value: "dr_pham",
    rating: 4.5,
    treatmentType: "IUI",
  },
];

const OurStaffPage = () => {
  const navigate = useNavigate();

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  const handleBooking = (doctorId) => {
    navigate(`/register-service`, {
      state: { selectedDoctor: doctorId },
    });
  };

  return (
    <div className="w-full min-h-screen">
      <UserHeader />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-6 flex justify-center items-center">
                    <Avatar
                      size={120}
                      src={doctor.image}
                      icon={<UserOutlined />}
                      className="border-4 border-[#ff8460]"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-bold mb-2">{doctor.name}</h3>
                    <p className="text-[#ff8460] font-semibold mb-2">{doctor.role}</p>
                    <p className="text-gray-600 text-sm mb-3">{doctor.specialization}</p>
                    <p className="text-gray-600 text-sm mb-3">{doctor.experience}</p>
                    
                    <div className="mb-3">
                      <Rate disabled defaultValue={doctor.rating} allowHalf className="text-sm" />
                      <span className="ml-2 text-gray-600">({doctor.rating})</span>
                    </div>
                    
                    <div className="mb-3">
                      <Tag color="green" className="mb-1">{doctor.treatmentType}</Tag>
                      {doctor.certificates.slice(0, 1).map((cert, index) => (
                        <Tag color="blue" key={index} className="mb-1 text-xs">
                          {cert}
                        </Tag>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => handleDoctorClick(doctor.id)}
                        className="bg-[#ff8460] hover:bg-[#ff6b40] text-white px-4 py-2 rounded text-sm transition duration-300"
                      >
                        Xem chi tiết
                      </button>
                      <button 
                        onClick={() => handleBooking(doctor.value)}
                        className="bg-[#c2da5c] hover:bg-[#a8c245] text-white px-4 py-2 rounded text-sm transition duration-300"
                      >
                        Đặt lịch
                      </button>
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
