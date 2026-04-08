# Sudama Helps - Home Services Platform

![Sudama Helps Logo](https://raw.githubusercontent.com/yy500047091/sudama-helps/main/frontend/sudama-helps-frontend/public/vite.svg)

Sudama Helps is a modern, scalable home services platform designed to connect customers with professional service providers. The platform features real-time tracking, secure bookings, and a robust administrative interface.

## 🚀 Features

- **Real-time Tracking**: Live provider location tracking using WebSockets and Apache Kafka.
- **Secure Authentication**: Persona-based access control (Customer, Provider, Admin) powered by Spring Security and JWT.
- **Service Management**: Multi-category service listings with detailed descriptions and pricing.
- **Booking Engine**: Atomic transaction-based booking system with status updates.
- **Review System**: Trust-based rating and review mechanism for service feedback.
- **Performance Optimized**: Caching layer with Redis for high-frequency data access.
- **Responsive UI**: Modern, mobile-first design built with React, Tailwind CSS, and Framer Motion.

## 🛠️ Tech Stack

### Backend
- **Core**: Java 17, Spring Boot 3.2.0
- **Security**: Spring Security, JWT (jjwt)
- **Persistence**: Spring Data JPA, MySQL 8.0
- **Messaging**: Spring Kafka, Apache Kafka, Zookeeper
- **Real-time**: Spring WebSocket, STOMP
- **Caching**: Spring Data Redis
- **Utilities**: Lombok, MapStruct, SpringDoc OpenAPI (Swagger)

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS, Framer Motion
- **Networking**: Axios
- **Forms**: React Hook Form, Zod
- **Real-time**: StompJS, SockJS

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Monitoring**: Spring Boot Actuator, Micrometer (Prometheus ready)

## 📂 Project Structure

```text
sudama-helps/
├── backend/                # Spring Boot application
│   ├── src/                # Java source files
│   ├── database/           # SQL schema and migration scripts
│   └── pom.xml             # Maven configuration
├── frontend/               
│   └── sudama-helps-frontend/ # React + TypeScript project
└── docker-compose.yml      # Infrastructure setup (MySQL, Kafka, Redis)
```

## 🛠️ Getting Started

### Prerequisites
- JDK 17
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+

### 1. Clone the repository
```bash
git clone https://github.com/yy500047091/sudama-helps.git
cd sudama-helps
```

### 2. Start Infrastructure
Launch MySQL, Kafka, and Redis using Docker:
```bash
docker-compose up -d
```

### 3. Run Backend
```bash
cd backend
./mvnw spring-boot:run
```
The API will be available at `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 4. Run Frontend
```bash
cd frontend/sudama-helps-frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📖 API Documentation
The API documentation is automatically generated using OpenAPI. Once the backend is running, you can explore the endpoints at:
`http://localhost:8080/swagger-ui/index.html`

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
