# 🎬 Movie Ticket System - Event Driven Architecture

> Hệ thống đặt vé xem phim được xây dựng theo mô hình Microservices kết hợp Event-Driven Architecture sử dụng RabbitMQ.

---

# 🚀 Project Overview

Dự án mô phỏng hệ thống đặt vé xem phim với khả năng xử lý bất đồng bộ (Asynchronous Processing) nhằm tăng khả năng mở rộng và giảm phụ thuộc giữa các service.

Hệ thống bao gồm:

- 👤 User Service
- 🎬 Movie Service
- 🎟️ Booking Service
- 💳 Payment Service
- 🔔 Notification Service
- 🖥️ Frontend
- 📨 RabbitMQ Message Broker

---

# 🧠 Architecture

## Event-Driven Architecture (EDA)

Các service KHÔNG giao tiếp trực tiếp với nhau.

Thay vào đó:
- Service sẽ publish event lên RabbitMQ.
- Các service khác consume event để xử lý.

---

# 🔄 Event Flow

```txt
Frontend
   ↓
Booking Service
   ├─ Tạo booking
   ├─ Lưu trạng thái PENDING
   └─ Publish Event: BOOKING_CREATED
                ↓
            RabbitMQ
                ↓
Payment Service
   ├─ Consume BOOKING_CREATED
   ├─ Xử lý thanh toán
   └─ Publish:
        • PAYMENT_COMPLETED
        • BOOKING_FAILED
                ↓
            RabbitMQ
                ↓
Notification Service
   ├─ Consume PAYMENT_COMPLETED
   └─ Gửi thông báo thành công
```

---

# 📨 Event List

| Event | Mô tả |
|------|------|
| USER_REGISTERED | Người dùng đăng ký |
| BOOKING_CREATED | Tạo booking mới |
| PAYMENT_COMPLETED | Thanh toán thành công |
| BOOKING_FAILED | Thanh toán thất bại |

---

# 👨‍💻 Team Members & Responsibilities

| Thành viên | Công việc phụ trách |
|------------|--------------------|
| Nguyễn Thanh Tú | Frontend Development |
| Vương Ngọc Huệ | User Service |
| Lê Gia Khánh | Movie Service |
| Trần Phương Trí| Booking Service |
| Nguyễn Hồ Việt Khoa | Payment + Notification Service |

---

# 🛠️ Tech Stack

## Frontend
- ReactJS
- Axios
- TailwindCSS

## Backend
- NodeJS
- ExpressJS
- MongoDB

## Message Broker
- RabbitMQ

## Architecture
- Microservices
- Event-Driven Architecture
- REST API

---

# 📂 Project Structure

```bash
MovieTicketSystem/
│
├── frontend/
│
├── user-service/
├── movie-service/
├── booking-service/
├── payment-service/
│
├── docker-compose.yml
│
└── README.md
```

---

# ⚡ Features

## 👤 User Service
- Register
- Login
- Publish USER_REGISTERED event

## 🎬 Movie Service
- Get movie list
- Add/Edit movie

## 🎟️ Booking Service
- Create booking
- Get booking list
- Publish BOOKING_CREATED event

## 💳 Payment Service
- Consume BOOKING_CREATED
- Random payment success/fail
- Publish PAYMENT_COMPLETED / BOOKING_FAILED

## 🔔 Notification Service
- Consume PAYMENT_COMPLETED
- Send booking success notification

---

# 🐳 Run With Docker Compose

## Start system

```bash
docker compose up --build
```

## Stop system

```bash
docker compose down
```

---

# 🌐 Service Ports

| Service | Port |
|------|------|
| Frontend | 80 |
| User Service | 8081 |
| Movie Service | 8082 |
| Booking Service | 8083 |
| Payment Service | 8085 |
| RabbitMQ | 5672 |
| RabbitMQ Dashboard | 15672 |

---

# 🖥️ Access URLs

## Frontend

```txt
http://localhost
```

## RabbitMQ Dashboard

```txt
http://localhost:15672
```

Account:

```txt
guest / guest
```

---

# 📌 Notes

- Hệ thống sử dụng RabbitMQ để xử lý giao tiếp bất đồng bộ giữa các service.
- Booking Service không gọi trực tiếp Payment Service.
- Các event được truyền thông qua Message Broker giúp hệ thống scalable và loosely coupled.

---

# ❤️ Thanks For Visiting