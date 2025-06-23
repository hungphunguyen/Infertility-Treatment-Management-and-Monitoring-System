import React from "react";
import babyLogo from "./../../public/images/babyImg.png"; // đổi path tùy cấu trúc project

const PulleyAnimation = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white via-orange-400 to-green-500 bg-black/20 bg-blend-multiply relative overflow-hidden">
      <img
        src={babyLogo}
        alt="Baby Logo"
        className="w-40 h-40 object-contain animate-pulley z-10"
      />

      <style>
        {`
        @keyframes moveUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(15px); }
        }

        .animate-pulley {
          animation: moveUpDown 2s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
};

export default PulleyAnimation;
