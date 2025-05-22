import React from "react";
import { useRoutes } from "react-router-dom";
import UserTemplate from "../template/UserTemplate";
import PageNotFound from "../components/PageNotFound";
import { path } from "../common/path";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

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
      path: path.signUp,
      element: <RegisterPage />,
    },
  ]);
  return routes;
};

export default UseRoutesCustom;
