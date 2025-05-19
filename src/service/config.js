import axios from "axios";

//setup axios custom xử lí gọi API cho dự án
export const http = axios.create({
  baseURL: "localhost:8080/infertility-system-api", // domain
  timeout: 30000,
  headers: {},
});
