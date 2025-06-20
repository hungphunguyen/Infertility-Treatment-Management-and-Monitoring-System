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
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{
            transform: isRegistering ? "translateX(-100%)" : "translateX(0%)",
            width: "200%",
          }}
        >
          {/* Left panel: Login */}
          <div className="w-1/2 flex flex-col md:flex-row">
            {/* Left: Animation */}
            <div className="hidden md:flex w-1/2 items-center justify-center">
              <PulleyAnimation />
            </div>

            {/* Right: Form */}
            <div className="w-full md:w-1/2">
              <LoginForm switchToRegister={() => setIsRegistering(true)} />
            </div>
          </div>

          {/* Right panel: Register */}
          <div className="w-1/2 flex flex-col md:flex-row">
            {/* Left: Form */}
            <div className="w-full md:w-1/2">
              <RegisterForm switchToLogin={() => setIsRegistering(false)} />
            </div>

            {/* Right: Animation */}
            <div className="hidden md:flex w-1/2 items-center justify-center">
              <PulleyAnimation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
