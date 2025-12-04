# Stage 1: Build React
FROM node:20 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Nginx
FROM nginx:stable-alpine

# สร้างโฟลเดอร์ html ถ้าไม่มี
RUN mkdir -p /usr/share/nginx/html

# ลบ default html ถ้ามี
RUN rm -rf /usr/share/nginx/html/*

# COPY nginx config ของเรา
COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY React build จาก stage build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
