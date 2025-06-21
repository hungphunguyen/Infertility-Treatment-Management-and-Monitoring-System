import React, { useContext, useEffect, useRef, useState } from "react";
import { customerService } from "../service/customer.service";
import { treatmentService } from "../service/treatment.service";
import { authService } from "../service/auth.service";
import { NotificationContext } from "../App";

const PaymentPage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [infoUser, setInfoUser] = useState();
  const [treatmentList, setTreatmentList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const { showNotification } = useContext(NotificationContext);
  const intervalRef = useRef(null);
  const [countdown, setCountdown] = useState(); // 5 phút = 300s
  const countdownIntervalRef = useRef(null);
  const [reloadCooldown, setReloadCooldown] = useState(0);
  useEffect(() => {
    authService
      .getMyInfo()
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {});
  }, []);

  // hien thi danh sach record cua customer
  useEffect(() => {
    if (infoUser?.id) {
      treatmentService
        .getTreatmentRecordsByCustomer(infoUser.id)
        .then((res) => {
          setTreatmentList(res.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [infoUser]);

  // hien thi thong bao khi thanh toan momo
  useEffect(() => {
    if (showModal && selectedTreatment?.id) {
      intervalRef.current = setInterval(() => {
        customerService
          .paymentNotificationForCustomer(selectedTreatment.id)
          .then((res) => {
            const { code, result } = res.data;

            if (code === 1000 && result === true) {
              showNotification("Đã thanh toán thành công", "success");
              setShowModal(false);
              setQrCodeUrl("");
              setSelectedTreatment(null);
              clearInterval(intervalRef.current);
            }
            console.log(res.data);
          })
          .catch((err) => {
            console.error("❌ Lỗi khi kiểm tra trạng thái thanh toán:", err);
          });
      }, 3000); // mỗi 3 giây
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }; // dọn dẹp nếu modal đóng
  }, [showModal, selectedTreatment]);

  // ham thanh toan momo
  const handleMomoPayment = async (recordId, treatment) => {
    try {
      const res = await customerService.paymentForCustomer(recordId);
      setQrCodeUrl(res.data.result); // dùng để hiển thị QR Code
      setSelectedTreatment(treatment);
      setShowModal(true);
      setCountdown(300); // set thoi gian 5p cho coutdow reload momo
      setReloadCooldown(60);
      // ✅ Lưu vào session
      sessionStorage.setItem(
        "momo_payment",
        JSON.stringify({
          qrCodeUrl: res.data.result,
          treatment,
          countdown: 300,
          reloadCooldown: 60,
        })
      );
    } catch (error) {
      console.log("Tạo thanh toán thất bại:", error);
      showNotification(error.response.data.message, "error");
    }
  };

  // ham thanh toan vnpay
  const handleVnpayPayment = async (recordId) => {
    try {
      const res = await customerService.paymentVnpayForCustomer(recordId); // gọi GET /payment/vnpay/{recordId}
      const paymentUrl = res.data.result;
      if (paymentUrl) {
        window.location.href = paymentUrl; // chuyển hướng sang trang VNPAY
      } else {
        showNotification("Không lấy được link thanh toán VNPAY", "error");
      }
    } catch (error) {
      console.error("VNPAY error:", error);
      showNotification("Thanh toán VNPAY thất bại", "error");
    }
  };

  // ham cancel khi thanh toan momo
  const handleMoMoCancel = async (recordId) => {
    try {
      const res = await customerService.paymentCancelForCustomer(recordId);
      showNotification("Đã hủy thanh toán", "error");
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoMoReload = async (recordId, treatment) => {
    try {
      const res = await customerService.paymentReloadForCustomer(recordId);
      setQrCodeUrl(res.data.result); // dùng để hiển thị QR Code
      setSelectedTreatment(treatment);
      setReloadCooldown(60);
      showNotification("Lấy mã thanh toán mới thành công", "success");
    } catch (error) {
      console.log("Tạo thanh toán thất bại:", error);
    }
  };

  const handleCloseModal = () => {
    if (selectedTreatment?.id) {
      handleMoMoCancel(selectedTreatment.id);
    }
    setShowModal(false);
    setQrCodeUrl("");
    setSelectedTreatment(null);
    sessionStorage.removeItem("momo_payment"); // ✅ xóa session
  };
  // hàm xử lí count dow cho thanh toán momo
  useEffect(() => {
    if (showModal && selectedTreatment?.id) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          const next = prev - 1;

          if (next <= 0) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;

            // ✅ Check: chỉ reload khi cooldown đã xong
            if (reloadCooldown <= 0) {
              handleMoMoReload(selectedTreatment.id, selectedTreatment);
              setReloadCooldown(60); // Reset cooldown luôn ở đây
            }

            return 300; // reset sau reload
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [showModal, selectedTreatment]);
  // hàm xử lí đếm ngược cho nút reload (60s)
  useEffect(() => {
    if (reloadCooldown > 0) {
      const cooldownInterval = setInterval(() => {
        setReloadCooldown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(cooldownInterval);
    }
  }, [reloadCooldown]);
  // hàm xử lí dữ liệu khi đang thanh toán sẽ được lưu vào session để bảo quản không bị mất dữ liệu khi f5
  useEffect(() => {
    const saved = sessionStorage.getItem("momo_payment");
    if (saved) {
      const { qrCodeUrl, treatment, countdown, reloadCooldown } =
        JSON.parse(saved);
      setQrCodeUrl(qrCodeUrl);
      setSelectedTreatment(treatment);
      setShowModal(true);
      setCountdown(countdown);
      setReloadCooldown(reloadCooldown);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Danh sách dịch vụ của bạn</h2>

      {treatmentList.length === 0 ? (
        <p className="text-gray-600">Không có dịch vụ nào.</p>
      ) : (
        <div className="space-y-4">
          {treatmentList.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white shadow-sm border rounded-lg p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center"
            >
              <div className="text-sm space-y-1">
                <p>
                  <strong className="text-gray-700">Dịch vụ:</strong>{" "}
                  {treatment.treatmentServiceName}
                </p>
                <p>
                  <strong className="text-gray-700">Bác sĩ:</strong>{" "}
                  {treatment.doctorName}
                </p>
                <p>
                  <strong className="text-gray-700">Ngày bắt đầu:</strong>{" "}
                  {treatment.startDate}
                </p>
                <p>
                  <strong className="text-gray-700">Trạng thái:</strong>{" "}
                  {treatment.status}
                </p>
              </div>

              <div className="mt-3 md:mt-0">
                {treatment.status === "CANCELLED" ? (
                  <button disabled className="...">
                    Đã huỷ
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMomoPayment(treatment.id, treatment)}
                      className="bg-pink-600 text-white font-semibold py-2 px-4 rounded hover:bg-pink-700 transition"
                    >
                      Thanh toán MoMo
                    </button>
                    <button
                      onClick={() => handleVnpayPayment(treatment.id)}
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                      Thanh toán VNPAY
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedTreatment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal(); // ✅ Gọi cancel luôn khi click ngoài
            }
          }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-[340px] max-w-[90%] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">
              🔍 Quét mã MoMo để thanh toán
            </h3>
            <p className="text-sm text-gray-600 mt-3">
              ⏳ Mã QR sẽ hết hạn sau:{" "}
              <strong>
                {Math.floor(countdown / 60)}:
                {(countdown % 60).toString().padStart(2, "0")}
              </strong>
            </p>

            <p className="text-sm mb-1">
              👤 <strong>{infoUser?.fullName}</strong>
            </p>
            <p className="text-sm mb-4">
              💼 {selectedTreatment.treatmentServiceName}
            </p>

            <div className="inline-block  border-4 border-pink-500 rounded-lg p-2 bg-white">
              <img
                src={qrCodeUrl}
                alt="QR MoMo"
                className="w-48 h-48 object-contain"
              />
            </div>

            <div className="mt-5 flex justify-between">
              <button
                onClick={() =>
                  handleMoMoReload(selectedTreatment.id, selectedTreatment)
                }
                disabled={reloadCooldown > 0}
                className={`px-4 py-2 rounded text-white transition ${
                  reloadCooldown > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {reloadCooldown > 0
                  ? `Tải lại mã QR (${reloadCooldown}s)`
                  : "Tải lại mã QR"}
              </button>
              <button
                onClick={handleCloseModal}
                className="5 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
