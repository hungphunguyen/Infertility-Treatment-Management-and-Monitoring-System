import React, { useContext, useEffect, useState } from "react";
import { Select, Popconfirm, Modal } from "antd";
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
      .catch(() => {});
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
  const shiftOptions = ["", "MORNING", "AFTERNOON", "FULL_DAY"];
  const [shiftByDay, setShiftByDay] = useState({});
  const { Option } = Select;
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const { showNotification } = useContext(NotificationContext);
  const [scheduleMap, setScheduleMap] = useState({});
  const [editingDate, setEditingDate] = useState(null);
  const [editingShift, setEditingShift] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const shiftDisplayMap = {
    MORNING: "Sáng",
    AFTERNOON: "Chiều",
    FULL_DAY: "Cả ngày",
  };

  const dayDisplayMap = {
    MONDAY: "Thứ 2",
    TUESDAY: "Thứ 3",
    WEDNESDAY: "Thứ 4",
    THURSDAY: "Thứ 5",
    FRIDAY: "Thứ 6",
    SATURDAY: "Thứ 7",
    SUNDAY: "Chủ nhật",
  };

  const handleChange = (day, value) => {
    setShiftByDay((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctors = await doctorService.getDoctorToSelectSchedule();
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
      showNotification(
        "Vui lòng không để trống mục chọn tháng và bác sĩ",
        "error"
      );
      return;
    }
    const shiftRules = Object.entries(shiftByDay)
      .filter(([_, shift]) => shift)
      .map(([weekday, shift]) => ({
        weekday,
        shift,
      }));
    const payload = {
      doctorId: selectedDoctor.id,
      month: selectedMonth,
      shiftRules,
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
      const res = await managerService.getWorkScheduleYear(
        selectedMonth,
        selectedDoctor.id
      );
      const allSchedule = res.data.result;
      const map = {};
      for (const item of allSchedule) {
        const date = item.workDate; // "2025-06-01"
        if (date.startsWith(selectedMonth)) {
          map[date] = item.shift;
        }
      }
      setScheduleMap(map);
    } catch (err) {
      console.error("Không thể lấy lịch tháng này:", err);
    }
  };

  useEffect(() => {
    getWorkScheduleMonth();
  }, [selectedDoctor, selectedMonth]);

  const handleDelete = (date, doctorId) => {
    managerService
      .deleteWorkSchedule(date, doctorId)
      .then(() => {
        showNotification("Xóa lịch làm việc thành công", "success");
        getWorkScheduleMonth();
      })
      .catch((err) => {
        showNotification(err.response.data.message, "error");
      });
  };

  const handleUpdate = (doctorId, data) => {
    managerService
      .updateWorkSchedule(doctorId, data)
      .then(() => {
        showNotification("Cập nhật lịch làm việc thành công", "success");
        getWorkScheduleMonth();
      })
      .catch((err) => {
        console.log(err);
        showNotification(err.response.data.message, "error");
      });
  };

  const handleCreateByDay = (doctorId, data) => {
    managerService
      .createWorkScheduleByDay({
        doctorId: doctorId,
        workDate: data.workDate,
        shift: data.shift,
        createdBy: infoUser.id,
      })
      .then(() => {
        showNotification("Tạo lịch làm việc thành công", "success");
        getWorkScheduleMonth();
      })
      .catch((err) => {
        console.error("Lỗi tạo lịch:", err);
      });
  };

  const openEditModal = (dateStr) => {
    setEditingDate(dateStr);
    setEditingShift(scheduleMap[dateStr] || "");
    setIsModalVisible(true);
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
    <div className="rounded-[12px] overflow-hidden shadow bg-white">
      <>
        <h1 className="bg-blue-600 text-white px-5 py-3 text-base font-semibold">
          Bảng ca phân ca làm theo tháng
        </h1>

        <div className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="">Chọn tháng:</label>
            <input
              type="month"
              className="h-10 w-full px-3 border border-gray-300 rounded-md text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Chọn bác sĩ:</label>
            <Select
              showSearch
              placeholder="Chọn bác sĩ"
              optionFilterProp="children"
              className="w-full h-[40px] text-sm" // <- thêm h-[40px] và text-sm
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
          <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-blue-300 text-black font-semibold text-center">
                {days.map((day) => (
                  <th
                    key={day}
                    className="border border-gray-300 px-2 py-2 whitespace-nowrap"
                  >
                    {dayDisplayMap[day] || day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {days.map((day) => (
                  <td
                    key={day}
                    className="border border-gray-300 px-2 py-1 text-center"
                  >
                    <select
                      className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm"
                      value={shiftByDay[day] || ""}
                      onChange={(e) => handleChange(day, e.target.value)}
                    >
                      <option value="">-- chọn ca --</option>
                      {shiftOptions
                        .filter((s) => s)
                        .map((shift) => (
                          <option key={shift} value={shift}>
                            {shiftDisplayMap[shift] || shift}
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
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium shadow text-sm"
          >
            Xác nhận
          </button>
        </div>
      </>

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
                  onClick={() => dateStr && openEditModal(dateStr)}
                  className="group h-28 border border-gray-300 p-2 align-top relative hover:bg-gray-50 cursor-pointer"
                >
                  {dateStr && (
                    <>
                      <div className="text-right text-xs font-medium text-gray-600">
                        {+dateStr.split("-")[2]}
                      </div>

                      {scheduleMap[dateStr] ? (
                        <div className="mt-1 space-y-1">
                          <div className="text-green-700 text-xs font-semibold text-center">
                            {shiftDisplayMap[scheduleMap[dateStr]] ||
                              scheduleMap[dateStr]}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-xs italic text-gray-400 mt-1">
                          + Thêm ca làm <br /> (nghỉ)
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
      <Modal
        title={`Cập nhật lịch: ${editingDate}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">Chọn ca làm:</label>
          <Select
            className="w-full"
            value={editingShift}
            onChange={(value) => setEditingShift(value)}
          >
            {shiftOptions
              .filter((s) => s)
              .map((shift) => (
                <Select.Option key={shift} value={shift}>
                  {shiftDisplayMap[shift] || shift}
                </Select.Option>
              ))}
          </Select>
        </div>

        <div className="flex justify-between">
          {scheduleMap[editingDate] && (
            <Popconfirm
              title="Xoá lịch ngày này?"
              onConfirm={() => {
                handleDelete(editingDate, selectedDoctor.id);
                isModalVisible(false);
              }}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Xoá
              </button>
            </Popconfirm>
          )}
          <button
            onClick={() => {
              const payload = {
                workDate: editingDate,
                shift: editingShift,
              };

              if (scheduleMap[editingDate]) {
                // Cập nhật
                handleUpdate(selectedDoctor.id, payload);
              } else {
                // Tạo mới
                handleCreateByDay(selectedDoctor.id, payload);
              }

              setIsModalVisible(false);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {scheduleMap[editingDate] ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;
