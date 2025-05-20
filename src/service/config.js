import axios from "axios";

//setup axios custom xử lí gọi API cho dự án
const http = axios.create({
  baseURL: "http://localhost:8080/infertility-system-api/", // domain
  timeout: 30000,
  headers: {},
});

export { http };
