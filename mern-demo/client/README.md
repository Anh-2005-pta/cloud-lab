# Sổ sinh viên — MERN Lab 02

Ứng dụng thực hành phần 5–7: Express + Mongoose + MongoDB Atlas, React + Vite.

## Khởi chạy

Terminal backend, tại `/workspaces/cloud-lab/mern-demo`:

```bash
npm install
# Tạo .env từ .env.example nếu chưa có; không ghi đè .env đang dùng.
# Điền MONGODB_URI riêng của bạn, PORT=5000. Không commit .env.
npm start
```

Terminal frontend, tại `/workspaces/cloud-lab/mern-demo/client`:

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Mở cổng 5173 trong Codespaces Ports. Giữ cổng ở chế độ Private.
Vite chuyển tiếp `/api` đến backend 5000. Nếu dùng Codespace khác, cập nhật hostname cụ thể trong `vite.config.js`.
Nếu IP Codespace đổi, thêm đúng IP /32 trong Atlas IP Access List.

## Chức năng

- Student có studentId, name, email; MSSV duy nhất.
- GET/POST `/api/students`: đọc danh sách và thêm sinh viên.
- PUT/DELETE `/api/students/:id`: cập nhật và xóa theo MongoDB ObjectId.
- Form React kiểm tra trường bắt buộc, email, báo lỗi và xác nhận lưu.
- Danh sách có tìm kiếm, làm mới và trạng thái tải.

## Kiểm tra

```bash
npm run lint
npm run build
curl http://localhost:5000/api/students
ss -lntp
```

Bản ghi thử nghiệm dùng email example.com. Có thể đối chiếu tại Atlas → cloud_lab → students.

## Lưu ý an toàn

Đây là ứng dụng lab, chưa có xác thực người dùng cho API. Không đưa lên cổng công khai hoặc dùng với dữ liệu thật. `.env`, `node_modules` và `dist` không được commit; chỉ `.env.example` chứa cấu hình trống được đưa lên Git.
