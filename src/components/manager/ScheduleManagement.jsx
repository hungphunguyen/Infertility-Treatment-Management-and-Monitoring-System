import React, { useContext, useEffect, useState } from "react";
import { Typography, Select, Popconfirm } from "antd";
import { doctorService } from "../../service/doctor.service";
import { NotificationContext } from "../../App";
import { useSelector } from "react-redux";
import { authService } from "../../service/auth.service";
import { managerService } from "../../service/manager.service";

const ScheduleManagement = () => {
  const token = useSelector((state) => state.authSlice);
  const [infoUser, setInfoUser] = useState();
  useEffect(() => {
    if (!token) return;

    authService
      .getMyInfo()
      .then((res) => {
        setInfoUser(res.data.result);
      })
      .catch((err) => {});
  }, [token]);
  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const shiftOptions = ["", "MORNING", "AFTERNOON", "FULL DAY"];
  const [shiftByDay, setShiftByDay] = useState({});
  const { Option } = Select;
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const { showNotification } = useContext(NotificationContext);
  const [scheduleMap, setScheduleMap] = useState({});

  const handleChange = (day, value) => {
    setShiftByDay((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctors = await doctorService.getAllDoctors();
        setDoctorList(doctors.data.result);
      } catch (error) {
        message.error("Không thể tải danh sách bác sĩ");
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async () => {
    const selectedCount = Object.values(shiftByDay).filter(Boolean).length;

    if (selectedCount === 0) {
      showNotification("Bạn phải chọn ít nhất 1 ca làm", "error");
      return;
    }
    if (!selectedDoctor || !selectedMonth) {
      showNotification("Please select full doctor and month", "error");
      return;
    }
    const rules = Object.entries(shiftByDay)
      .filter(([_, shift]) => shift)
      .map(([weekday, shift]) => ({
        weekday,
        shift,
      }));
    const payload = {
      doctorId: selectedDoctor.id,
      month: selectedMonth,
      rules,
      createdBy: infoUser.id,
    };

    try {
      const res = await managerService.createWorkScheduleBulk(payload);
      showNotification(res.data.result, "success");
      getWorkScheduleMonth();
    } catch (err) {
      console.error(" Lỗi gửi lịch:", err);
      console.log(payload);
    }
  };

  const getWorkScheduleMonth = async () => {
    if (!selectedDoctor || !selectedMonth) return;

    try {
      const res = await managerService.getWorkScheduleMonth(selectedDoctor.id);

      const allSchedule = res.data.result.schedules;

      const map = {};
      Object.entries(allSchedule).forEach(([date, shift]) => {
        if (date.startsWith(selectedMonth)) {
          map[date] = shift;
        }
      });

      setScheduleMap(map);
    } catch (err) {
      console.error("Không thể lấy lịch tháng:", err);
    }
  };

  useEffect(() => {
    getWorkScheduleMonth();
  }, [selectedDoctor, selectedMonth]);

  const handleDelete = (date, doctorId) => {
    managerService
      .deleteWorkSchedule(date, doctorId)
      .then((res) => {
        showNotification("Removed success", "success");
        getWorkScheduleMonth();
      })
      .catch(err);
  };

  const getCalendarGrid = (monthStr) => {
    const [year, month] = monthStr.split("-").map(Number);
    const firstDate = new Date(year, month - 1, 1);
    const totalDays = new Date(year, month, 0).getDate();
    const firstDay = firstDate.getDay(); // 0=CN

    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const calendar = [];
    let day = 1;

    for (let i = 0; i < 6 && day <= totalDays; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < offset) || day > totalDays) {
          week.push(null);
        } else {
          week.push(
            `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
              2,
              "0"
            )}`
          );
          day++;
        }
      }
      calendar.push(week);
    }

    return calendar;
  };

  return (
    <div className="max-w-5xl mx-auto my-10 bg-white p-6 rounded shadow">
      <h1 className="text-center text-white text-2xl font-semibold bg-blue-600 py-4 rounded">
        Bảng ca làm theo tuần mẫu
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block font-semibold mb-1">🗓️ Chọn tháng:</label>
          <input
            type="month"
            className="border rounded p-2 w-full"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">👨‍⚕️ Chọn bác sĩ:</label>
          <Select
            showSearch
            placeholder="Chọn bác sĩ"
            optionFilterProp="children"
            className="w-full"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              const doctor = doctorList.find((d) => d.id === value);
              setSelectedDoctor(doctor);
            }}
          >
            {doctorList.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.fullName}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full table-auto border border-collapse">
          <thead>
            <tr className="bg-blue-300 text-black font-semibold">
              {days.map((day) => (
                <th
                  key={day}
                  className="border p-3 text-center whitespace-nowrap"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((day) => (
                <td key={day} className="border p-2 text-center align-top">
                  <select
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={shiftByDay[day] || ""}
                    onChange={(e) => handleChange(day, e.target.value)}
                  >
                    <option value="">-- chọn ca --</option>
                    {shiftOptions
                      .filter((s) => s)
                      .map((shift) => (
                        <option key={shift} value={shift}>
                          {shift}
                        </option>
                      ))}
                  </select>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-semibold shadow"
        >
          Xác nhận
        </button>
      </div>
      <table className="w-full border border-gray-300 table-fixed text-sm mt-10">
        <thead>
          <tr className="bg-blue-100 text-center text-gray-700 font-semibold">
            {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map(
              (day) => (
                <th key={day} className="border border-gray-300 py-2">
                  {day}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {getCalendarGrid(selectedMonth).map((week, i) => (
            <tr key={i}>
              {week.map((dateStr, j) => (
                <td
                  key={j}
                  className=" group h-28 border border-gray-300 p-2 align-top relative hover:bg-gray-50"
                >
                  {dateStr && (
                    <>
                      {/* Số ngày */}
                      <div className="text-right text-xs font-medium text-gray-600">
                        {+dateStr.split("-")[2]}
                      </div>

                      {/* Có ca làm thì hiển thị */}
                      {scheduleMap[dateStr] ? (
                        <div className="mt-1 space-y-1 relative ">
                          <div className="text-green-700 text-xs font-semibold">
                            {scheduleMap[dateStr]}
                          </div>
                          <Popconfirm
                            title="Xoá lịch ngày này?"
                            onConfirm={() =>
                              handleDelete(dateStr, selectedDoctor.id)
                            }
                            okText="Xoá"
                            cancelText="Huỷ"
                          >
                            <button
                              className="absolute top-5 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded 
                      opacity-0 group-hover:opacity-100 transition duration-200"
                            >
                              Xoá
                            </button>
                          </Popconfirm>
                        </div>
                      ) : (
                        // Nếu không có lịch
                        <div className="text-xs italic text-gray-400 mt-1">
                          Nghỉ
                        </div>
                      )}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleManagement;
