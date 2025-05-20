// src/components/GoogleLogin.jsx
import { useEffect } from "react";
import { authService } from "../service/auth.service";
import { setLocalStorage } from "../utils/util";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../App";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

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
    try {
      const res = await authService.signInByGoogle({ idToken });
      const data = res.data.result;

      if (data.token) {
        setLocalStorage("username", res.data.result);
        showNotification("Login successful", "success");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        showNotification(res.data.result.message, "error");
      }
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      showNotification(res.data.result.message, "error");
    }
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-full max-w mx-auto" id="google-signin-button"></div>
    </div>
  );
}
