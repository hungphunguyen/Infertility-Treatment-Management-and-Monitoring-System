import React from "react";
import { useRoutes } from "react-router-dom";
import UserTemplate from "../template/UserTemplate";
import PageNotFound from "../components/PageNotFound";
import { path } from "../common/path";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyPage from "../pages/VerifyPage";
import ServicesPage from "../pages/ServicesPage";
import ServiceDetailPage from "../pages/ServiceDetailPage";
import BlogPage from "../pages/BlogPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import OurStaffPage from "../pages/OurStaffPage";
import ContactsPage from "../pages/ContactsPage";
import DoctorDetailPage from "../pages/DoctorDetailPage";
import AppointmentPage from "../pages/AppointmentPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import ResendOtpPage from "../pages/ResendOtpPage";

const UseRoutesCustom = () => {
  const routes = useRoutes([
    {
      path: path.homePage,
      element: <UserTemplate />,
    },

    {
      path: path.signIn,
      element: <LoginPage />,
    },
    {
      path: path.signUp,
      element: <RegisterPage />,
    },
    {
      path: path.verify,
      element: <VerifyPage />,
    },
    {
      path: path.services,
      element: <ServicesPage />,
    },
    {
      path: path.serviceDetail,
      element: <ServiceDetailPage />,
    },
    {
      path: path.blog,
      element: <BlogPage />,
    },
    {
      path: path.blogDetail,
      element: <BlogDetailPage />,
    },
    {
      path: path.ourStaff,
      element: <OurStaffPage />,
    },
    {
      path: path.contacts,
      element: <ContactsPage />,
    },
    {
      path: path.doctorDetail,
      element: <DoctorDetailPage />,
    },
    {
      path: path.appointment,
      element: <AppointmentPage />,
    },
    {
      path: path.admin,
      element: <AdminPage />,
    },
    {
      path: path.resendOtp,
      element: <ResendOtpPage />,
    },
    {
      path: path.pageNotFound,
      element: <PageNotFound />,
    },
  ]);
  return routes;
};

export default UseRoutesCustom;
