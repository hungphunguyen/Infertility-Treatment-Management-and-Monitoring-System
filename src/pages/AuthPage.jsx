import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PulleyAnimation from "./PulleyAnimation";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-6xl h-[640px] rounded-xl overflow-hidden shadow-2xl bg-white">
        <div
          className="absolute inset-0 flex transition-all duration-700 ease-in-out"
          style={{
            transform: isRegistering ? "translateX(-50%)" : "translateX(0%)", // Di chuyển form đăng nhập và đăng ký qua lại
            width: "200%",
          }}
        >
          {/* Left panel: Login */}
          <div
            className="w-1/2 relative flex flex-col md:flex-row"
            style={{
              opacity: isRegistering ? "0" : "1", // Ẩn khi đang ở Register
              transition: "opacity 0.7s ease-in-out",
            }}
          >
            {/* Pulley Animation */}
            <div
              className="absolute inset-0 w-full flex items-center justify-center z-10"
              style={{
                transform: isRegistering
                  ? "translateX(100%)"
                  : "translateX(0%)", // Pulley animation di chuyển
                transition: "transform 0.7s ease-in-out",
                zIndex: 1, // Đảm bảo PulleyAnimation không che form
              }}
            >
              <PulleyAnimation />
            </div>

            {/* Right: Form */}
            <div className="w-full md:w-1/2 z-20">
              <LoginForm switchToRegister={() => setIsRegistering(true)} />
            </div>
          </div>

          {/* Right panel: Register */}
          <div
            className="w-1/2 relative flex flex-col md:flex-row"
            style={{
              opacity: !isRegistering ? "0" : "1", // Ẩn khi đang ở Login
              transition: "opacity 0.7s ease-in-out",
            }}
          >
            {/* Pulley Animation */}
            <div
              className="absolute inset-0 w-full flex items-center justify-center z-10"
              style={{
                transform: isRegistering
                  ? "translateX(0%)"
                  : "translateX(-100%)", // Pulley animation di chuyển
                transition: "transform 0.7s ease-in-out",
                zIndex: 1, // Đảm bảo PulleyAnimation không che form
              }}
            >
              <PulleyAnimation />
            </div>

            {/* Left: Form */}
            <div className="w-full md:w-1/2 z-20">
              <RegisterForm switchToLogin={() => setIsRegistering(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
