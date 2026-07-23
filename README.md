# Fix It Now 🔧

> Trusted Home Service Platform

---

## Live URL

- Backend API: [Live Backend URL Here](https://fix-it-now-33br.onrender.com)

---

## Project Overview

Fix It Now is a backend API for a home services marketplace where customers can book home services, technicians can manage their services and bookings, and admins can oversee platform activities.

The platform supports multiple user roles and provides features such as service booking, payment integration using Stripe, technician management, reviews and ratings, booking tracking, and admin controls.

---

## Features

### Public Features

- Browse all available services.
- Search and filter services by category, location, and price.
- View technician profiles and service details.
- View reviews and ratings.

### Customer Features

- Register and login.
- Book home services.
- Cancel bookings before they are in progress.
- Track booking status.
- Make payments using Stripe.
- View payment history and payment status.
- Leave reviews after service completion.
- Manage profile information.

### Technician Features

- Register and login.
- Create and update technician profiles.
- Manage service offerings.
- Update availability status and working schedule.
- View incoming bookings.
- Accept or decline booking requests.
- Mark bookings as In Progress or Completed.

### Admin Features

- View all users.
- Block or unblock users.
- View all bookings.
- Create and manage service categories.

---

## Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Stripe Payment Integration
- Zod Validation
- Cookie Parser
- CORS
- HTTP Status Codes
- TSX

---

## Installation Guide

1. Clone the repository.

```bash
git clone https://github.com/maruf-hasan-rion/fix-it-now
```

2. Move into the project directory.

```bash
cd fix-it-now
```

3. Install dependencies.

```bash
npm install
```

4. Create a `.env` file.

```env
PORT=5000
NODE_ENV=

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

APP_URL=
```

5. Run database migrations.

```bash
npx prisma migrate dev
```

6. Run the development server.

```bash
npm run dev
```

---

## Database Schema

The project consists of the following entities:

- Users
- Technician Profiles
- Categories
- Services
- Bookings
- Payments
- Reviews

---

## Booking Flow

```text
REQUESTED
     ↓
ACCEPTED
     ↓
PAID
     ↓
IN_PROGRESS
     ↓
COMPLETED
```

Customers can cancel bookings before they reach the IN_PROGRESS state.

---

## Payment Flow

```text
Customer

↓

Create Payment Intent

↓

Payment Pending

↓

Payment Success

↓

Booking Status Updated to PAID
```

Stripe PaymentIntent is used for payment processing.

Since this is a backend-only academic project, payment confirmation is simulated using a success endpoint after creating a PaymentIntent.

---

## API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/me       |

---

### Categories

| Method | Endpoint      |
| ------ | ------------- |
| POST   | /api/category |
| GET    | /api/category |

---

### Technician

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | /api/technician/profile      |
| PATCH  | /api/technician/profile      |
| PATCH  | /api/technician/availability |
| GET    | /api/technician/profile      |

---

### Services

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /api/service     |
| GET    | /api/service     |
| GET    | /api/service/:id |
| PATCH  | /api/service/:id |
| DELETE | /api/service/:id |

Supported query parameters:

```text
searchTerm
categoryId
location
minPrice
maxPrice
sortBy
sortOrder
page
limit
```

---

### Bookings

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | /api/booking             |
| GET    | /api/booking/my-bookings |
| GET    | /api/booking/:id         |
| PATCH  | /api/booking/:id         |
| PATCH  | /api/booking/:id/cancel  |

---

### Payments

| Method | Endpoint                           |
| ------ | ---------------------------------- |
| POST   | /api/payment/create-payment-intent |
| PATCH  | /api/payment/success/:paymentId    |
| GET    | /api/payment/my-payments           |

---

### Reviews

| Method | Endpoint                       |
| ------ | ------------------------------ |
| POST   | /api/review                    |
| GET    | /api/review/service/:serviceId |
| GET    | /api/review/my-reviews         |

---

### Admin

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | /api/admin/users      |
| PATCH  | /api/admin/users/:id  |
| GET    | /api/admin/bookings   |
| GET    | /api/admin/categories |
| POST   | /api/admin/categories |

---

## Folder Structure

```text
src
│
├── config
├── middlewares
├── utils
├── errors
│
└── modules
    ├── auth
    ├── category
    ├── technician
    ├── service
    ├── booking
    ├── payment
    ├── review
    └── admin
```

---

## Sample Roles

- CUSTOMER
- TECHNICIAN
- ADMIN

---

## Future Improvements

- Real Stripe Webhook Integration.
- SSLCommerz Payment Integration.
- Email Notifications.
- Dashboard Analytics.
- Refund System.
- Real-time Booking Notifications.

---

## Author

**Md. Maruf Hasan Rion**

Full Stack JavaScript Developer.
