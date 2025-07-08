import { Modal, Select, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { doctorService } from "../../service/doctor.service";

// Helper để tạo lưới lịch
const getCalendarGrid = (monthStart) => {
  const startOfMonth = dayjs(monthStart).startOf("month");
  const endOfMonth = dayjs(monthStart).endOf("month");

  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const grid = [];
  let current = startDate;

  while (current.isBefore(endDate)) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(current);
      current = current.add(1, "day");
    }
    grid.push(week);
  }

  return grid;
};

export default function DoctorScheduleModal({ visible, onClose, onSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const grid = useMemo(() => getCalendarGrid(currentMonth), [currentMonth]);

  useEffect(() => {
    if (visible) {
      doctorService.getDoctorForCard().then((res) => {
        setDoctors(res?.data?.result?.content || []);
      });
    }
  }, [visible]);

  const handleDoctorChange = async (doctorId) => {
    setSelectedDoctorId(doctorId);
    setLoading(true);
    try {
      const res = await doctorService.getDoctorScheduleById(doctorId);
      setSchedules(res?.data?.result?.schedules || {});
    } catch (err) {
      console.error("Lỗi lấy lịch:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShift = (date, shift) => {
    if (onSelect) {
      onSelect({
        doctorId: selectedDoctorId,
        startDate: date,
        shift,
      });
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      title="Chọn lịch làm việc bác sĩ"
    >
      <Select
        showSearch
        placeholder="Chọn bác sĩ"
        style={{ width: "100%", marginBottom: 24 }}
        options={doctors.map((d) => ({
          label: `${d.fullName} - ${d.qualifications || "Chuyên khoa"}`,
          value: d.id,
        }))}
        onChange={handleDoctorChange}
        value={selectedDoctorId}
      />

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            >
              ←
            </button>
            <div className="font-semibold">
              Tháng {currentMonth.month() + 1} {currentMonth.year()}
            </div>
            <button
              onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            >
              →
            </button>
          </div>

          {/* Table lịch */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold mb-2">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-sm">
            {grid.map((week, wi) =>
              week.map((date, di) => {
                const key = date.format("YYYY-MM-DD");
                const isInMonth = date.month() === currentMonth.month();
                const shifts = schedules[key] || [];
                return (
                  <div
                    key={key}
                    className={`border p-1 rounded ${
                      isInMonth ? "bg-orange-50" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <div className="font-bold">{date.date()}</div>
                    {shifts.includes("MORNING") && (
                      <button
                        onClick={() => handleSelectShift(date, "MORNING")}
                        className="w-full bg-orange-100 text-orange-600 font-semibold rounded py-1 hover:bg-orange-200 transition"
                      >
                        S
                      </button>
                    )}
                    {shifts.includes("AFTERNOON") && (
                      <button
                        onClick={() => handleSelectShift(date, "AFTERNOON")}
                        className="w-full bg-orange-100 text-orange-600 font-semibold rounded py-1 hover:bg-orange-200 transition mt-1"
                      >
                        C
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
          {/* Ghi chú */}
          <div className="mt-4 text-xs text-gray-600 flex items-center gap-4">
            <span>🟧 S: Ca sáng</span>
            <span>🟧 C: Ca chiều</span>
            <span>⬜ Không có lịch</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
