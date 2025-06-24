import React, { useState, useEffect } from "react";
import {
  Typography,
  Divider,
  Avatar,
  Tag,
  Button,
  Rate,
  Spin,
  Card,
} from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { doctorService } from "../service/doctor.service";
import StarRatings from "react-star-ratings";
import { useInfiniteQuery } from "@tanstack/react-query";

const { Title, Paragraph, Text } = Typography;

const OurStaffPage = () => {
  const navigate = useNavigate();

  // Fetch doctors data from API
  const fetchDoctor = async ({ pageParam = 0 }) => {
    const res = await doctorService.getDoctorForCard(pageParam, 3);
    console.log(res);
    return res.data.result;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryFn: fetchDoctor,
    getNextPageParam: (lastPage, pages) => {
      // Nếu lastPage.last === true thì đã hết data (chuẩn theo Spring pagination)
      return lastPage.last ? undefined : pages.length;
    },
  });

  const doctors = data?.pages.flatMap((page) => page.content) || [];

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };
  return (
    <div className="w-full min-h-screen bg-[#f7f8fa]">
      <UserHeader />
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden mb-0">
        <img
          src="/images/features/pc7.jpg"
          alt="Băng rôn Blog"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Bác Sĩ
            </h1>
          </div>
        </div>
      </div>
      <div className="px-4 py-16 max-w-7xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="relative w-[280px] mx-auto mb-8 cursor-pointer group shadow-lg rounded-xl border-0 hover:scale-105 transition-transform duration-300 bg-white"
                onClick={() => handleDoctorClick(doctor.id)}
                bodyStyle={{ padding: 0 }}
              >
                <div className="relative w-full max-w-sm rounded-lg overflow-hidden shadow-md group hover:scale-105 transition-transform duration-300">
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.fullName}
                    className="w-full h-[350px] object-cover rounded-t-lg transition-shadow duration-300 group-hover:shadow-2xl"
                  />
                  <div className="absolute left-0 bottom-0 w-full bg-white bg-opacity-95 rounded-b-lg px-4 py-3 shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 text-center truncate">
                      {doctor.fullName}
                    </h3>
                    <div className="mt-1 text-center space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">
                          Chuyên khoa:
                        </span>{" "}
                        {doctor.specialty}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">
                          Bằng cấp:
                        </span>{" "}
                        {doctor.qualifications}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">
                          Kinh nghiệm:
                        </span>{" "}
                        {doctor.experienceYears} năm
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-center">
                      <StarRatings
                        rating={doctor.rate}
                        starRatedColor="#fadb14"
                        numberOfStars={5}
                        name="rating"
                        starDimension="20px"
                        starSpacing="2px"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        ({doctor.rate})
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {hasNextPage && (
            <div className="text-center mt-12">
              <Button
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
              </Button>
            </div>
          )}
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
            className="bg-[#ff8460] hover:bg-[#ff6b40] border-none rounded-full shadow-lg text-lg"
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
