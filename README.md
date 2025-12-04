# 🍽️ DineNest - Restaurant Management Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-blueviolet.svg)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

Professional RESTful API for restaurant management and food delivery platform with complete authentication, payment processing, and order management.

---

## 🎯 Overview

**DineNest** is a production-ready backend API for restaurant management platforms. It handles user authentication, restaurant operations, menu management, cart functionality, order processing, and payment integration via Stripe.

### Key Features

- 🔐 **Complete Authentication System** - Registration, login, email verification, password reset
- 👥 **Role-Based Access Control** - USER and ADMIN roles with permission management
- 🏪 **Restaurant Management** - Full CRUD operations with image upload
- 🍔 **Menu System** - Menu item management with pricing and images
- 🛒 **Cart & Orders** - Shopping cart and order lifecycle management
- 💳 **Payment Integration** - Stripe checkout and payment processing
- 📧 **Email Service** - Automated emails for verification and notifications
- 🛡️ **Security** - Rate limiting, JWT authentication, bcrypt password hashing
- ☁️ **Cloud Storage** - Cloudinary integration for image management

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js + Express.js** | Server framework |
| **Prisma ORM** | Database operations |
| **MySQL** | Database |
| **JWT + bcrypt** | Authentication & security |
| **Stripe** | Payment processing |
| **Cloudinary** | Image storage |
| **Nodemailer** | Email service |
| **Multer** | File uploads |

---

## 📊 Database Schema

### Core Models

**User** → **Restaurant** → **Menu**  
**User** → **Cart** ← **Menu**  
**User** → **Order** → **DeliveryDetails**

<details>
<summary>📋 View Full Schema</summary>

```prisma
model User {
  id                String      @id @default(uuid())
  fullName          String
  email             String      @unique
  contact           String
  password          String
  country           String
  address           String?
  role              Role        @default(USER) // USER | ADMIN
  isVerified        Boolean     @default(false)
  profilePicture    String?
  restaurant        Restaurant[]
  orders            Order[]
  cart              Cart[]
}

model Restaurant {
  id             String   @id @default(uuid())
  restaurantName String
  city           String
  country        String
  deliveryTime   Int
  cuisines       Json?
  imageURL       String
  price          Int
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  menus          Menu[]
  orders         Order[]
}

model Menu {
  id           String     @id @default(uuid())
  name         String
  description  String
  price        Float
  image        String
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  cart         Cart[]
}

model Order {
  id                String          @id @default(uuid())
  userId            String
  restaurantId      String
  deliveryDetailsId String
  status            Status          @default(PENDING) // PENDING | CONFIRM | DELIVERED | CANCEL
  user              User            @relation(fields: [userId], references: [id])
  restaurant        Restaurant      @relation(fields: [restaurantId], references: [id])
  deliveryDetails   DeliveryDetails @relation(fields: [deliveryDetailsId], references: [id])
}

model Cart {
  id       String @id @default(uuid())
  userId   String
  menuId   String
  items    Json
  quantity Int
  user     User   @relation(fields: [userId], references: [id])
  menu     Menu   @relation(fields: [menuId], references: [id])
}
```

</details>

---

## 📚 API Documentation

**Base URL:** `http://localhost:8001/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Auth | Rate Limited |
|--------|----------|-------------|------|--------------|
| POST | `/register` | Register new user | No | Yes |
| POST | `/login` | User login | No | Yes |
| POST | `/verify-Email` | Verify email with OTP | No | Yes |
| GET | `/logout` | Logout user | Yes | No |
| POST | `/forget-Password` | Request password reset | No | Yes |
| POST | `/reset-Password/:token` | Reset password | No | Yes |
| GET | `/check-user` | Get user profile | Yes | No |
| PUT | `/profile/update-user` | Update profile | Yes | No |

### Restaurant Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/restaurant` | Create restaurant | Admin |
| GET | `/restaurant` | Get all restaurants | No |
| GET | `/restaurant/:id` | Get single restaurant | No |
| PUT | `/restaurant/:id` | Update restaurant | Admin |
| DELETE | `/restaurant/:id` | Delete restaurant | Admin |
| GET | `/restaurant/search` | Search restaurants | No |
| GET | `/restaurant/order` | Get restaurant orders | Admin |
| GET | `/restaurant/order/:id/status` | Update order status | Admin |

### Menu Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/menu` | Create menu item | Admin |
| PUT | `/menu/:id` | Update menu item | Admin |
| DELETE | `/menu/:id` | Delete menu item | Admin |
| GET | `/menu/getAllMenu` | Get all menus | Admin |
| GET | `/menu/getSingleMenu/:id` | Get single menu | No |

> 📖 **Detailed API Documentation:** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for request/response examples

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/DineNest.git
cd DineNest

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npx prisma generate
npx prisma migrate dev

# Start server
npm start
```

Server runs at `http://localhost:8001`

---

## 🔑 Environment Variables

Create a `.env` file with the following:

```env
# Server
PORT=8001
NODE_ENV=development

# Database
DATABASE_URL="mysql://username:password@localhost:3306/dinenest"

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars

# Cloudinary
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# URLs
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

> 📝 See [.env.example](.env.example) for detailed configuration guide

---

## 📂 Project Structure

```
DineNest/
├── controllers/         # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── restaurent.js
│   ├── menu.js
│   └── orderController.js
├── routes/             # API routes
│   ├── authRoute.js
│   ├── Restaurant.js
│   └── menuRoute.js
├── middlewares/        # Custom middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── rateLimitLimiter.js
├── utils/              # Utilities
│   ├── cloudinary.js
│   ├── stripe.js
│   ├── generateToken.js
│   └── image.js
├── prisma/             # Database
│   └── schema.prisma
├── server/             # Email service
│   └── mailTrap/
└── server.js           # Entry point
```

---

## 🔐 Security Features

- ✅ **Password Hashing** - bcrypt with 10 rounds
- ✅ **JWT Authentication** - 24-hour token expiry with HTTP-only cookies
- ✅ **Rate Limiting** - 5 requests per 5 minutes on sensitive endpoints
- ✅ **CORS Protection** - Configurable origin
- ✅ **SQL Injection Protection** - Prisma ORM with parameterized queries
- ✅ **Role-Based Access Control** - USER and ADMIN roles
- ✅ **Input Validation** - Email, password, and field validation
- ✅ **Secure File Uploads** - File type and size validation

---

## 🧪 Testing

### Manual Testing with Postman

1. Import collection with all endpoints
2. Set base URL: `http://localhost:8001/api/v1`
3. Test authentication flow:
   - Register → Verify Email → Login → Access Protected Routes

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

