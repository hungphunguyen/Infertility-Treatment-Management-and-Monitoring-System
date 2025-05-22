import React from "react";
import { useRoutes } from "react-router-dom";
import UserTemplate from "../template/UserTemplate";
import PageNotFound from "../components/PageNotFound";
import { path } from "../common/path";
import LoginPage from "../pages/LoginPage";
import ServicesPage from "../pages/ServicesPage";
import BlogPage from "../pages/BlogPage";
import AboutCenterPage from "../pages/AboutCenterPage";
import OurStaffPage from "../pages/OurStaffPage";
import FeaturesPage from "../pages/FeaturesPage";
import ContactsPage from "../pages/ContactsPage";

const UseRoutesCustom = () => {
  const routes = useRoutes([
    {
      path: path.homePage,
      element: <UserTemplate />,
    },
    {
      path: path.pageNotFound,
      element: <PageNotFound />,
    },
    {
      path: path.signIn,
      element: <LoginPage />,
    },
    {
      path: path.services,
      element: <ServicesPage />,
    },
    {
      path: path.blog,
      element: <BlogPage />,
    },
    {
      path: path.aboutCenter,
      element: <AboutCenterPage />,
    },
    {
      path: path.ourStaff,
      element: <OurStaffPage />,
    },
    {
      path: path.features,
      element: <FeaturesPage />,
    },
    {
      path: path.contacts,
      element: <ContactsPage />,
    },
  ]);
  return routes;
};

export default UseRoutesCustom;
