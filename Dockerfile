# Bước 1: Build ứng dụng React
FROM node:16 AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Bước 2: Phục vụ ứng dụng React bằng Nginx
FROM nginx:alpine

# Sao chép các file đã build từ bước trước vào thư mục phục vụ của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 cho Nginx
EXPOSE 80

# Khởi động Nginx server
CMD ["nginx", "-g", "daemon off;"]
