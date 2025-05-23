// src/components/GoogleLogin.jsx
import { useContext, useEffect } from "react";
import { authService } from "../service/auth.service";
import { getLocgetlStorage, setLocalStorage } from "../utils/util";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../App";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      /* global google */
      window.google.accounts.id.initialize({
        client_id:
          "275410243519-d80fcmlrq078l24q9hechprhjraon6e5.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          text: "sign_in_with",
          shape: "rectangular",
          logo_alignment: "left",
        }
      );
    };

    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential;
    console.log("✅ Google ID Token:", idToken);

    try {
      const res = await authService.signInByGoogle({ idToken });
      const data = res.data.result;

      if (data.token) {
        setLocalStorage("token", res.data.result.token); // coi lai phia be tra du lieu theo format nao
        authService.getMyInfo(getLocgetlStorage("token")).then((res) => {
          console.log(res.data.result);
          setLocalStorage("user", JSON.stringify(res.data.result));
        });
        showNotification("Login successful", "success");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      showNotification(error.response.data.message, "error");
    }
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-full max-w mx-auto" id="google-signin-button"></div>
    </div>
  );
}
