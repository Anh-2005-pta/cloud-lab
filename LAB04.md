# Buổi 4 — MERN multi-container và Docker Hub

Ứng dụng quản lý sinh viên dùng React, Express và MongoDB Atlas. Backend và frontend chạy trong hai container, giao tiếp qua Docker Compose network. Frontend Nginx chuyển các yêu cầu `/api/` đến service `backend`.

## Chuẩn bị

Tạo `.env` từ `.env.example` và đặt `MONGODB_URI` của riêng bạn. Không commit `.env`.

## Build từ source code

```sh
docker compose up -d --build
docker compose ps
```

Frontend: `http://localhost:5173`; backend: `http://localhost:5000/api/hello`.

## Chạy image từ Docker Hub

```sh
docker compose down
docker compose -f docker-compose.hub.yml up -d
docker compose -f docker-compose.hub.yml ps
```

Compose dùng `phantuananhnct/mern-backend:1.0` và `phantuananhnct/mern-frontend:2.0`. Frontend `1.0` cũng được lưu trên Docker Hub để đối chiếu phiên bản. Trong GitHub Codespaces, forward port 5173 và truy cập URL được cấp; API được proxy qua cùng port nên không cần public port 5000.
