# Cloud Computing Laboratory — MERN

Sinh viên: Phan Tuấn Anh · MSSV: 236435 · Lớp: DH23TIN08

## Cấu trúc theo các buổi

- **Buổi 2:** `mern-demo/` chứa Express/Mongoose (`server/server.js`) và React/Vite (`client/`). Bản giao diện này có xem, thêm, sửa và xóa sinh viên.
- **Buổi 3:** `server/` và `client/` ở gốc là hai build context được `docker-compose.yml` sử dụng để chạy MERN bằng Docker.
- **Buổi 4:** `docker-compose.hub.yml` chạy image đã đăng trên Docker Hub. Frontend 2.0 là bản giao diện nâng cấp; frontend 1.0 vẫn có trên Hub.
- **Buổi 5–6:** `docker-compose.production.yml` chạy backend 2.0 và frontend 3.1 (bản chỉnh chữ trên giao diện từ 3.0); `LAB05-06.md` ghi cách triển khai trên Render, liên kết nộp bài và các bước đã kiểm tra.

Các commit kết thúc Buổi 2–4 vẫn nằm trong lịch sử Git. Các phần bổ sung sau Buổi 4 nằm ở commit riêng để không thay đổi lịch sử những buổi trước.

## Chạy từ source bằng Docker Compose

Tạo `.env` từ `.env.example`, điền `MONGODB_URI` hợp lệ; không commit `.env`.

```sh
docker compose up -d --build
docker compose ps
```

Frontend: <http://localhost:5173>. API: <http://localhost:5000/api/students>.

## Chạy image từ Docker Hub

```sh
docker compose down
docker compose -f docker-compose.hub.yml up -d
docker compose -f docker-compose.hub.yml ps
```

Image Buổi 4: `phantuananhnct/mern-backend:1.0` và `phantuananhnct/mern-frontend:2.0`.

Chi tiết: [LAB04.md](LAB04.md).

## Chạy bản production Buổi 5–6

```sh
docker compose -f docker-compose.production.yml up -d
docker compose -f docker-compose.production.yml ps
```

Trên Render, frontend và backend chạy từ hai image Docker Hub có tag `latest`. URI Atlas nằm trong Environment Group chỉ liên kết với backend; địa chỉ backend nằm trong Environment của frontend. Không lưu thông tin đăng nhập trong Git. Xem [LAB05-06.md](LAB05-06.md).
