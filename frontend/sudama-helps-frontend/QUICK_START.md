# 🎯 Quick Start: Frontend + Java Backend Integration

**⏱️ 5 minutes to get started**

---

## 1️⃣ Backend Setup (Java Developer)

### Create endpoints that respond with this format:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Enable CORS in Spring Boot:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("*")
            .allowCredentials(true);
  }
}
```

### Minimum endpoints needed:
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/services
POST   /api/bookings
GET    /api/bookings
PUT    /api/users/profile
```

---

## 2️⃣ Frontend Setup (React Developer)

### Step 1: Create `.env` file
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
```

### Step 2: Backend is assumed to be ready for API calls

The frontend already has:
- ✅ API client setup in `src/services/api.ts`
- ✅ Authentication store in `src/store/auth.ts`
- ✅ Booking store in `src/store/booking.ts`
- ✅ Service store in `src/store/service.ts`

---

## 3️⃣ Test Integration

### Terminal 1: Start Java Backend
```bash
cd your-java-project
mvn spring-boot:run
# Backend on http://localhost:8080
```

### Terminal 2: Start React Frontend
```bash
cd sudama-helps-frontend
npm run dev
# Frontend on http://localhost:3000
```

### Test Login:
1. Open `http://localhost:3000`
2. Go to Login page
3. Try to login
4. Check DevTools Network tab for API call

---

## 4️⃣ If You Get CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Fix:** Add CORS to Java backend (see Step 1)

---

## 5️⃣ If You Get 404 Error

**Problem:** Backend endpoints don't exist

**Check:** 
- Backend is running on port 8080
- API endpoint path matches exactly
- Return response in correct format

---

## 6️⃣ Example: Login Flow

```
1. User enters credentials on frontend
   ↓
2. Frontend sends: POST /api/auth/login
   Request: { identifier: "email@example.com", password: "pass123" }
   ↓
3. Backend verifies and returns:
   Response: {
     "success": true,
     "data": {
       "user": { "id": 1, "email": "..." },
       "token": "eyJhbGciOiJIUzI1NiIs...",
       "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
     }
   }
   ↓
4. Frontend stores token in localStorage
   ↓
5. All future requests include: Authorization: Bearer <token>
```

---

## 📚 Full Documentation

- **[JAVA_BACKEND_INTEGRATION.md](./JAVA_BACKEND_INTEGRATION.md)** - Complete integration guide with 12 steps
- **[MIGRATION_EXAMPLES.md](./MIGRATION_EXAMPLES.md)** - Code examples for each page
- **[JAVA_BACKEND_CHECKLIST.md](./JAVA_BACKEND_CHECKLIST.md)** - Backend requirements checklist

---

## ✅ Verification Checklist

**Backend Ready?**
- [ ] Running on `http://localhost:8080`
- [ ] CORS enabled for `localhost:3000`
- [ ] All endpoints tested with Postman

**Frontend Ready?**
- [ ] `.env` file created
- [ ] `npm run dev` works
- [ ] No errors in console

**Integration Test?**
- [ ] Login page loads
- [ ] Can submit login form
- [ ] API call visible in DevTools Network tab
- [ ] Token stored in localStorage

---

## 🔥 Common Issues

| Problem | Solution |
|---------|----------|
| CORS error | Add CORS config to Spring Boot |
| Login fails | Check backend logs for errors |
| 404 Not Found | Verify endpoint path: `/api/auth/login` |
| Token not sent | Check Authorization header is set |
| Services don't load | Make sure `GET /api/services` endpoint exists |

---

## 📞 Need Help?

1. **CORS issues?** → See JAVA_BACKEND_INTEGRATION.md Step 2
2. **API format issues?** → See JAVA_BACKEND_CHECKLIST.md section "Response Format Standard"
3. **Code examples?** → See MIGRATION_EXAMPLES.md
4. **Complete workflow?** → See JAVA_BACKEND_INTEGRATION.md

---

## 🎯 Next: Update Your Pages

Once backend API is working:

1. Open [MIGRATION_EXAMPLES.md](./MIGRATION_EXAMPLES.md)
2. Copy the "After" code samples
3. Replace mock data calls with `async` API calls
4. Test each page

---

## 🚀 You're Ready!

Backend setup + Frontend configuration = **Full integration complete! 🎉**

Start by testing login, then expand to other pages.

Good luck! 💪
