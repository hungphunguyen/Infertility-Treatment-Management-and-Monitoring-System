import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PulleyAnimation from "./PulleyAnimation";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-6xl h-[640px] rounded-xl overflow-hidden shadow-2xl bg-white">
        {/* FORM: Register (bên trái) */}
        <div className="absolute top-0 left-0 w-1/2 h-full z-20 flex items-center justify-center p-8 transition-opacity duration-500">
          <RegisterForm switchToLogin={() => setIsRegistering(false)} />
        </div>

        {/* FORM: Login (bên phải) */}
        <div className="absolute top-0 right-0 w-1/2 h-full z-20 flex items-center justify-center p-8 transition-opacity duration-500">
          <LoginForm switchToRegister={() => setIsRegistering(true)} />
        </div>

        {/* PULLEY - nằm trên, di chuyển qua trái/phải để che */}
        <div
          className="absolute top-0 h-full w-1/2 transition-transform duration-700 ease-in-out z-30"
          style={{
            transform: isRegistering ? "translateX(100%)" : "translateX(0%)",
            left: 0,
          }}
        >
          <PulleyAnimation />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
