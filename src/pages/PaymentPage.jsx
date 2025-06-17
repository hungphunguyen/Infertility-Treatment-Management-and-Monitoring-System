import React, { useState } from "react";

const PaymentPage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [payUrl, setPayUrl] = useState("");

  const handleCreatePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/momo/create-payment",
        {
          amount: 50000,
          orderId: `ORDER-${Date.now()}`,
        }
      );

      setQrCodeUrl(response.data.qrCodeUrl); // dùng để hiển thị QR Code
      setPayUrl(response.data.payUrl); // dùng để mở thanh toán bằng deeplink
    } catch (error) {
      console.error("Tạo thanh toán thất bại:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thanh toán qua MoMo</h2>
      <button onClick={handleCreatePayment}>Tạo thanh toán</button>

      {qrCodeUrl && (
        <div style={{ marginTop: 20 }}>
          <h4>Quét mã để thanh toán:</h4>
          <img
            src={qrCodeUrl}
            alt="Mã QR MoMo"
            style={{ width: 200, height: 200 }}
          />
        </div>
      )}

      {payUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={payUrl} target="_blank" rel="noopener noreferrer">
            Hoặc bấm vào đây để thanh toán trên MoMo App
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
