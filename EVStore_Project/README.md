# EVStore - Hệ thống quản lý cửa hàng xe điện

Bài tập lớn môn Lập trình hướng đối tượng (Java), năm 3 - PTIT.

Ứng dụng quản lý mẫu xe, xe, khách hàng, đơn hàng, lịch sử bảo dưỡng, nhân viên và thống kê doanh thu. Có đăng nhập, phân quyền bằng JWT.

## Công nghệ sử dụng

| Phần             | Công nghệ                               | Phiên bản |
| ---------------- | --------------------------------------- | --------- |
| Ngôn ngữ backend | Java                                    | 21        |
| Framework        | Spring Boot (Web, Data JPA, Validation) | 3.5.8     |
| Bảo mật          | Spring Security, JWT (jjwt)             | 0.11.5    |
| Cơ sở dữ liệu    | MySQL                                   | 8.0       |
| Tiện ích         | Lombok                                  | -         |
| Frontend         | React, React Router                     | 19 / 7    |
| Build frontend   | Vite                                    | 7         |
| Giao diện        | Tailwind CSS, lucide-react              | 4         |
| Gọi API, biểu đồ | Axios, Chart.js                         | -         |

## Cấu trúc thư mục

```
EVStore_Project/
├── evstore-backend/          # API Spring Boot
│   └── src/main/java/com/store/evstore
│       ├── config/           # Security, JWT, dữ liệu khởi tạo
│       ├── controller/       # REST API
│       ├── service/          # Xử lý nghiệp vụ
│       ├── repository/       # Truy vấn JPA
│       ├── model/            # Entity, enum
│       └── dto/              # Dữ liệu request/response
└── evstore-frontend/         # Giao diện React
    └── src
        ├── pages/            # Các màn hình
        ├── components/       # Thành phần dùng chung
        ├── services/         # Gọi API
        ├── contexts/         # Trạng thái đăng nhập
        ├── layout/  routes/
```

## Cách chạy

Cần cài: JDK 21 trở lên, Node.js 20 trở lên, MySQL 8.

**1. Backend**

```bash
cd evstore-backend
copy .env.example .env      # rồi điền DB_PASSWORD và JWT_SECRET
mvnw spring-boot:run
```

Database `evstore` và các bảng sẽ tự được tạo khi chạy lần đầu. API chạy ở http://localhost:8080/api

**2. Frontend** (mở terminal khác)

```bash
cd evstore-frontend
npm install
npm run dev
```

Mở trình duyệt vào địa chỉ Vite in ra (thường là http://localhost:5173).

**3.**
Tài khoản chạy thử

Tài khoản - mật khẩu: admin/Admin123
