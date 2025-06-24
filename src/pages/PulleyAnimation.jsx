// PulleyAnimation.jsx
import React from "react";

const PulleyAnimation = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white via-orange-400 to-green-500 bg-black/20 bg-blend-multiply">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="animate-pulley"
      >
        <circle cx="100" cy="40" r="20" fill="white" />
        <rect x="95" y="60" width="10" height="80" fill="white" />
        <circle cx="100" cy="150" r="15" fill="white" />
      </svg>

      <style>
        {`
        @keyframes moveUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
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
