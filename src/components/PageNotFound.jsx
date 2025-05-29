import React from "react";
import { Link } from "react-router-dom";
import { path } from "../common/path";
import { useLottie } from "lottie-react";
import pageNotFoundAnimation from "../assets/animation/404_Animation.json";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import UserTemplate from "../template/UserTemplate";

const PageNotFound = () => {
  const options = {
    animationData: pageNotFoundAnimation,
    loop: true,
  };
  const { View } = useLottie(options);

  return (
    <div>
      <div className="container">
        <div className="404_content  h-screen flex justify-around items-center h-[70vh] overflow-hidden">
          <div className="404_img w-[700px] ">{View}</div>

          <Link
            className="text-6xl py-3 px-4 border border-orange-500 hover:bg-orange-500  rounded-md duration-400 "
            to={path.homePage}
          >
            Go back Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
