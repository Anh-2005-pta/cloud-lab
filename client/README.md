# Frontend Docker — Buổi 3–6

`client/` ở gốc là build context của frontend. Chạy local cùng backend bằng `docker compose up -d --build` từ thư mục gốc. Mở <http://localhost:5173>.

React gọi API bằng đường dẫn tương đối `/api/students`. Khi chạy container, Nginx tạo cấu hình từ `nginx.conf.template`:

- Docker Compose local: `BACKEND_URL` mặc định là `http://backend:5000`.
- Render: đặt `BACKEND_URL=https://mern-backend-236435.onrender.com` trong Environment của Frontend Web Service.

Như vậy trình duyệt chỉ gọi `/api/` trên cùng domain Frontend; Nginx chuyển tiếp tới Backend. Biến `VITE_API_URL` không đổi được URL bên trong JavaScript đã build sẵn của image Vite/Nginx, nên bản cuối dùng cấu hình Nginx lúc container khởi động.

Kiểm tra mã nguồn: `npm ci`, `npm run lint`, `npm run build`. Trong Codespaces, Vite lấy hostname từ biến `CODESPACE_NAME`; không ghi cứng tên một Codespace cũ.
