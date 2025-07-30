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
      <div className="bg-blue-600 text-white px-5 py-3 text-base font-semibold rounded-t">
        Bảng ca phân ca làm theo tháng
      </div>
      <div className="px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
          {/* Cột chọn tháng */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 font-medium">
              Chọn tháng:
            </label>
            <input
              type="month"
              className="h-10 border border-gray-300 rounded-md px-3 text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          {/* Cột chọn bác sĩ */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 font-medium">
              Chọn bác sĩ:
            </label>
            <Select
              showSearch
              placeholder="Chọn bác sĩ"
              className="w-full h-10 text-sm"
              dropdownStyle={{ fontSize: "14px" }}
              optionFilterProp="children"
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

        {/* Bảng chọn ca */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mt-6 ">
          {days.map((day) => (
            <div key={day} className="border rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-700 mb-2">
                {dayDisplayMap[day]}
              </div>
              <select
                className="w-full h-9 border border-gray-300 rounded-md text-sm px-2"
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
            </div>
          ))}
        </div>

        <div className="flex justify-end py-5">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium shadow"
          >
            Xác nhận
          </button>
        </div>
      </div>

      <div className="rounded-[12px] overflow-hidden shadow bg-white mt-10">
        <div className="bg-purple-600 text-white px-5 py-3 text-base font-semibold">
          Lịch tháng
        </div>

        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map(
                (day) => (
                  <th key={day} className="py-2 border text-center font-medium">
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
                    className="h-28 border p-2 align-top relative hover:bg-gray-50 cursor-pointer"
                  >
                    {dateStr && (
                      <>
                        <div className="text-right text-xs font-medium text-gray-600">
                          {+dateStr.split("-")[2]}
                        </div>

                        {scheduleMap[dateStr] ? (
                          <div className="mt-1">
                            <div className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              {shiftDisplayMap[scheduleMap[dateStr]] ||
                                scheduleMap[dateStr]}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-xs italic text-gray-400 mt-2">
                            + Thêm ca làm
                            <br />
                            (nghỉ)
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
