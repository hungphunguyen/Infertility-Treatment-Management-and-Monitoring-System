// src/components/GoogleLogin.jsx
import { useEffect } from "react";

export default function GoogleLogin() {
  useEffect(() => {
    // Load script Google GIS
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      /* global google */
      window.google.accounts.id.initialize({
        client_id:
          "102777012744-s07lc3n8j3tpd1prrrhtl5lb723esgcb.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
        }
      );
    };

    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential;

    console.log("🎯 id_token:", idToken);

    // Gửi token về backend
    const res = await fetch("http://localhost:8080/auth/login-google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("accessToken", data.token);
      alert("Đăng nhập thành công 🎉");
      window.location.href = "/";
    } else {
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-full max-w mx-auto" id="google-signin-button"></div>
    </div>
  );
}
