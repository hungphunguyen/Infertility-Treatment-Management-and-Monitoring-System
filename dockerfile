# Base image (sử dụng Ubuntu 22 làm yêu cầu)
FROM node:18-bullseye-slim AS builder

# Thiết lập môi trường làm việc
WORKDIR /app

# Copy file package.json và package-lock.json để cài đặt dependencies trước
COPY package*.json ./

# Cài đặt dependencies với cache tối ưu
RUN npm install --frozen-lockfile --legacy-peer-deps

# Copy toàn bộ mã nguồn vào image
COPY . .

# Build ứng dụng
RUN npm run build

# Production stage
FROM nginx:1.23.4

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/share/nginx/html

# Xóa file default của Nginx
RUN rm -rf ./*

# Copy các file đã build từ builder stage
COPY --from=builder /app/dist .

# Cấu hình Nginx để tương thích với React SPA
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 8084

# Lệnh khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]