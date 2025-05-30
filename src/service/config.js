import axios from "axios";

//setup axios custom xử lí gọi API cho dự án
const http = axios.create({
  baseURL: "http://www.infertilitymonitoring.unaux.com/infertility-system-api/", // domain
  timeout: 30000,
  headers: {},
});

export { http };
