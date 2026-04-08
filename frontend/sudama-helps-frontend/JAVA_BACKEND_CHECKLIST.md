# ☑️ Java Backend Setup Checklist

Complete this checklist to ensure your Java backend is ready for React frontend integration.

---

## 🔐 Authentication Module

- [ ] **1. User Model/Entity**
  ```java
  @Entity
  public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String fullName;
    private String email;
    private String phoneNumber;
    private String password; // Hashed with bcrypt
    private String role; // CUSTOMER, PROVIDER, ADMIN
    private Double rating;
    private Integer completedBookings;
    private LocalDateTime createdAt;
  }
  ```

- [ ] **2. Authentication Controller**
  ```
  POST   /api/auth/register      → Register new user
  POST   /api/auth/login         → Login & return JWT
  POST   /api/auth/refresh-token → Refresh token
  POST   /api/auth/logout        → Logout
  ```

- [ ] **3. JWT Token Configuration**
  ```
  Token Type: Bearer Token (JWT)
  Expiry: 1 hour
  Refresh Token: 7 days
  Secret Key: Configure in application.properties
  ```

- [ ] **4. Security Filter Chain**
  - Configure Spring Security
  - Add JWT authentication filter
  - Enable CORS (see main guide)

---

## 👤 User Management

- [ ] **User Profile Endpoints**
  ```
  GET    /api/users/profile         → Get current user
  PUT    /api/users/profile         → Update profile
  GET    /api/users/{id}            → Get user by ID
  ```

- [ ] **User Model Fields**
  - `fullName` (String)
  - `email` (String, unique)
  - `phoneNumber` (String, unique)
  - `profileImage` (String, URL)
  - `rating` (Double)
  - `completedBookings` (Integer)
  - `totalSpent` (BigDecimal)

---

## 🔧 Service Management

- [ ] **Service Model**
  ```java
  @Entity
  public class Service {
    private Long id;
    private String name;
    private String description;
    private String category; // CLEANING, PLUMBING, etc.
    private Double basePrice;
    private String estimatedDuration;
    private Double averageRating;
    private Integer totalReviews;
    private String image; // Image URL
    private Boolean isActive;
  }
  ```

- [ ] **Service Endpoints**
  ```
  GET    /api/services                    → List all services
  GET    /api/services/{id}               → Get service details
  GET    /api/services/category/{category} → Filter by category
  GET    /api/services/search?q=term      → Search services
  ```

- [ ] **Response Format**
  ```json
  {
    "data": {
      "content": [
        {
          "id": 1,
          "name": "Home Cleaning",
          "category": "CLEANING",
          "basePrice": 500,
          "averageRating": 4.5,
          "totalReviews": 120,
          "estimatedDuration": "2 hours"
        }
      ],
      "pageNumber": 0,
      "pageSize": 20,
      "totalElements": 100,
      "totalPages": 5
    }
  }
  ```

---

## 📦 Booking Management

- [ ] **Booking Model**
  ```java
  @Entity
  public class Booking {
    private Long id;
    private Long serviceId;
    private Long userId; // Customer
    private Long providerId; // Service Provider
    private LocalDateTime scheduledTime;
    private String status; // PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    private Address bookingAddress;
    private Double finalPrice;
    private String specialInstructions;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
  }
  
  public class Address {
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String landmark;
    private Double latitude;
    private Double longitude;
  }
  ```

- [ ] **Booking Endpoints**
  ```
  POST   /api/bookings                   → Create booking
  GET    /api/bookings                   → Get user's bookings
  GET    /api/bookings/{id}              → Get booking details
  PUT    /api/bookings/{id}              → Update booking status
  DELETE /api/bookings/{id}              → Cancel booking
  GET    /api/bookings/status/{status}   → Filter by status
  ```

- [ ] **Booking Request Format**
  ```json
  {
    "serviceId": 1,
    "scheduledTime": "2026-04-15T10:30:00",
    "bookingAddress": {
      "streetAddress": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "landmark": "Near Central Station",
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "specialInstructions": "Please bring own cleaning supplies"
  }
  ```

- [ ] **Booking Response Format**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "serviceName": "Cleaning",
      "providerName": "John Provider",
      "status": "PENDING",
      "scheduledTime": "2026-04-15T10:30:00",
      "finalPrice": 550,
      "createdAt": "2026-03-31T10:00:00"
    }
  }
  ```

---

## 📍 Address Management

- [ ] **Address Endpoints**
  ```
  GET    /api/addresses            → Get all user addresses
  POST   /api/addresses            → Add new address
  PUT    /api/addresses/{id}       → Update address
  DELETE /api/addresses/{id}       → Delete address
  ```

- [ ] **Address Fields**
  - `id` (Long, primary key)
  - `userId` (Long, foreign key)
  - `streetAddress` (String, required)
  - `city` (String)
  - `state` (String)
  - `zipCode` (String)
  - `landmark` (String, optional)
  - `latitude` (Double)
  - `longitude` (Double)
  - `isDefault` (Boolean)
  - `createdAt` (LocalDateTime)

---

## ⭐ Reviews & Ratings

- [ ] **Review Endpoints**
  ```
  POST   /api/bookings/{bookingId}/reviews  → Add review
  GET    /api/bookings/{bookingId}/reviews  → Get reviews for booking
  ```

- [ ] **Review Model**
  ```json
  {
    "rating": 5,
    "comment": "Excellent service!",
    "photos": ["url1", "url2"]
  }
  ```

---

## 🔄 Response Format Standard

All endpoints should return responses in this format:

### Success Response (200, 201):
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Your actual data here
  }
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": {
    "content": [...],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 100,
    "totalPages": 5,
    "last": false,
    "first": true
  }
}
```

### Error Response (4xx, 5xx):
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE",
  "timestamp": "2026-03-31T10:00:00"
}
```

---

## 🔒 Security Requirements

- [ ] **Password Hashing**
  - Use BCrypt with salt rounds >= 10
  - Never store plain text passwords

- [ ] **JWT Configuration**
  ```properties
  app.jwtSecret=your-secret-key-min-256-chars-long
  app.jwtExpirationInMs=3600000          # 1 hour
  app.jwtRefreshExpirationInMs=604800000 # 7 days
  ```

- [ ] **CORS Configuration**
  ```
  Allowed Origins: http://localhost:3000, https://yourdomain.com
  Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
  Allowed Headers: *
  Allow Credentials: true
  Max Age: 3600
  ```

- [ ] **Input Validation**
  - Validate email format
  - Validate phone number format
  - Validate required fields
  - Sanitize user inputs

- [ ] **Rate Limiting**
  - Limit login attempts: 5 per minute
  - Limit API requests: 100 per minute per user

---

## 🗄️ Database Requirements

- [ ] **Required Tables**
  - `users`
  - `services`
  - `bookings`
  - `addresses`
  - `reviews`
  - `notifications` (optional)

- [ ] **Recommended Database**
  - PostgreSQL 12+
  - MySQL 8+
  - Use proper indexing on frequently queried fields

---

## 📝 API Documentation

Generate API documentation using:
- [ ] **Swagger/OpenAPI** (recommended)
  ```xml
  <dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.0</version>
  </dependency>
  ```
  Access at: `http://localhost:8080/swagger-ui.html`

---

## 🧪 Testing Checklist

Before connecting frontend, test these endpoints with Postman:

### Authentication
- [ ] POST /api/auth/register → Returns token
- [ ] POST /api/auth/login → Returns token with user
- [ ] POST /api/auth/refresh-token → Returns new token
- [ ] GET /api/users/profile (with token) → Returns user

### Services
- [ ] GET /api/services → Returns paginated list
- [ ] GET /api/services/1 → Returns single service
- [ ] GET /api/services/category/CLEANING → Filters correctly

### Bookings
- [ ] POST /api/bookings → Creates booking
- [ ] GET /api/bookings → Returns user's bookings
- [ ] PUT /api/bookings/1 → Updates booking
- [ ] DELETE /api/bookings/1 → Cancels booking

### Addresses
- [ ] GET /api/addresses → Returns addresses
- [ ] POST /api/addresses → Creates address
- [ ] PUT /api/addresses/1 → Updates address
- [ ] DELETE /api/addresses/1 → Deletes address

---

## 🚀 Pre-Integration Checklist

Before connecting React frontend:

- [ ] Backend running on `http://localhost:8080`
- [ ] CORS enabled for `http://localhost:3000`
- [ ] All endpoints tested with Postman
- [ ] JWT token generation working
- [ ] Database populated with sample data
- [ ] Error responses in correct format
- [ ] Timestamps in ISO 8601 format
- [ ] Passwords hashed with bcrypt
- [ ] No sensitive data in logs
- [ ] API documentation ready

---

## 📋 Sample Postman Request

### Login Request:
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "password123"
}
```

### Login Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+91-9876543210",
      "role": "CUSTOMER",
      "rating": 4.5,
      "completedBookings": 10
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Services Request:
```
GET http://localhost:8080/api/services?page=0&pageSize=20
Authorization: Bearer <token>
```

---

## 🎯 Integration Workflow

1. **Backend Ready** ✓ Complete this checklist
2. **Frontend Config** → Update `.env` with backend URL
3. **API Service** → Update `api.ts` with endpoints
4. **Stores** → Connect Zustand stores to API
5. **Pages** → Replace mock data with API calls
6. **Testing** → Test all features end-to-end
7. **Deployment** → Deploy both frontend and backend

---

## 💡 Pro Tips

1. **Use Spring Boot Actuator** for health checks
   ```properties
   management.endpoints.web.exposure.include=health,info
   ```

2. **Enable Query Logging** during development
   ```properties
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   ```

3. **Use DTOs** instead of direct entity serialization
   - Dto classes for input
   - Dto classes for output
   - Prevents data leaks

4. **Implement Pagination** from the start
   - Avoid loading entire database
   - Use Spring Data JPA Page interface

5. **Add Request/Response Logging** middleware
   - Log all API calls with timing
   - Helpful for debugging

---

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Enable CORS in Spring Security config |
| 401 Unauthorized | Check JWT token in Authorization header |
| 400 Bad Request | Verify request body format matches API spec |
| 500 Server Error | Check backend logs for stack trace |
| Token expires | Implement refresh token endpoint |

---

## 📞 Support

If backend integration is failing:
1. Check this checklist
2. Test endpoints with Postman
3. Check browser DevTools Network tab
4. Review backend server logs
5. Verify CORS headers in responses

**Good luck! 🚀**
