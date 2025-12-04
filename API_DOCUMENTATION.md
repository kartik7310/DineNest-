# 📚 DineNest API Documentation

Quick reference guide for all API endpoints.

**Base URL**: `http://localhost:8001/api/v1`

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "contact": "+1234567890",
  "country": "USA",
  "role": "USER"
}
```

**Rate Limited**: 5 requests per 5 minutes

---

### Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Rate Limited**: 5 requests per 5 minutes

**Response**: Sets HTTP-only cookie with JWT token

---

### Verify Email
```http
POST /verify-Email
Content-Type: application/json

{
  "verificationCode": "123456"
}
```

**Rate Limited**: 5 requests per 5 minutes

---

### Logout
```http
GET /logout
Cookie: Token=<jwt-token>
```

**Authentication**: Required

---

### Forget Password
```http
POST /forget-Password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Rate Limited**: 5 requests per 5 minutes

---

### Reset Password
```http
POST /reset-Password/:token
Content-Type: application/json

{
  "newPassword": "NewSecurePassword123"
}
```

**Rate Limited**: 5 requests per 5 minutes

---

## 👤 User Profile Endpoints

### Get Profile
```http
GET /check-user
Cookie: Token=<jwt-token>
```

**Authentication**: Required

---

### Update Profile
```http
PUT /profile/update-user
Cookie: Token=<jwt-token>
Content-Type: application/json

{
  "fullName": "John Updated",
  "email": "newemail@example.com",
  "address": "456 New Ave",
  "city": "New York",
  "country": "USA",
  "profilePicture": "base64-image-string"
}
```

**Authentication**: Required

---

## 🏪 Restaurant Endpoints

### Create Restaurant
```http
POST /restaurant
Cookie: Token=<jwt-token>
Content-Type: multipart/form-data

restaurantName: The Food Palace
city: New York
country: USA
deliveryTime: 30
cuisines: ["Italian", "Mexican"]
price: 50
image: <file>
```

**Authentication**: Required (Admin only)

---

### Get All Restaurants
```http
GET /restaurant?page=1&limit=10
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

---

### Get Single Restaurant
```http
GET /restaurant/:restaurantId
```

---

### Update Restaurant
```http
PUT /restaurant/:restaurantId
Cookie: Token=<jwt-token>
Content-Type: multipart/form-data

restaurantName: Updated Name
city: Los Angeles
deliveryTime: 45
image: <file>
```

**Authentication**: Required (Admin only)

---

### Delete Restaurant
```http
DELETE /restaurant/:restaurantId
Cookie: Token=<jwt-token>
```

**Authentication**: Required (Admin only)

---

### Search Restaurants
```http
GET /restaurant/search?searchText=pizza&selectedCuisines=Italian&city=NewYork
```

**Query Parameters**:
- `searchText` (optional): Search term
- `selectedCuisines` (optional): Comma-separated cuisines
- `city` (optional): Filter by city

---

### Get Restaurant Orders
```http
GET /restaurant/order
Cookie: Token=<jwt-token>
```

**Authentication**: Required (Admin only)

---

### Update Order Status
```http
GET /restaurant/order/:orderId/status?status=CONFIRMED
Cookie: Token=<jwt-token>
```

**Query Parameters**:
- `status`: PENDING | CONFIRM | DELIVERED | CANCEL

**Authentication**: Required (Admin only)

---

## 🍔 Menu Endpoints

### Create Menu
```http
POST /menu
Cookie: Token=<jwt-token>
Content-Type: multipart/form-data

name: Margherita Pizza
description: Classic Italian pizza with tomato and mozzarella
price: 12.99
file: <image-file>
```

**Authentication**: Required (Admin only)

---

### Edit Menu
```http
PUT /menu/:menuId
Cookie: Token=<jwt-token>
Content-Type: application/json

{
  "name": "Updated Pizza Name",
  "description": "Updated description",
  "price": 14.99
}
```

**Authentication**: Required (Admin only)

---

### Delete Menu
```http
DELETE /menu/:menuId
Cookie: Token=<jwt-token>
```

**Authentication**: Required (Admin only)

---

### Get All Menus
```http
GET /menu/getAllMenu?page=1&limit=10
Cookie: Token=<jwt-token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Authentication**: Required (Admin only)

---

### Get Single Menu
```http
GET /menu/getSingleMenu/:menuId
```

---

## 📋 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔒 Authentication

All protected routes require a JWT token sent via HTTP-only cookie.

**Cookie Name**: `Token`

**Token Expiry**: 24 hours

**How to authenticate**:
1. Login via `POST /login`
2. JWT token automatically set in cookie
3. Include cookie in subsequent requests

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## 🚦 Rate Limiting

Sensitive endpoints are rate-limited to **5 requests per 5 minutes** per IP address.

**Limited Endpoints**:
- `/register`
- `/login`
- `/verify-Email`
- `/forget-Password`
- `/reset-Password/:token`

**Rate Limit Response**:
```json
{
  "error": "Too Many Requests",
  "message": "Too many requests, please try again later."
}
```

---
