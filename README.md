# Rasoi Basket - Food Delivery Application

A full-stack food delivery application built with Angular and Node.js.

## Features

- Multi-role support (Admin, Seller, Delivery, User)
- Admin dashboard for user management and approvals
- Restaurant owner portal for menu management
- Delivery partner interface
- Customer ordering system
- MongoDB integration for data persistence

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)
- Angular CLI (v15.x or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/rasoi-basket.git
cd rasoi-basket
```

2. Install dependencies for both frontend and backend:

```bash
npm run install:all
```

3. Set up MongoDB:

   - Make sure MongoDB is running on your machine
   - The application will connect to the database at `mongodb://localhost:27017/rasoi_basket`
   - If you need to change this, update the `.env` file in the `rasoi-basket-backend` directory

## Running the Application

### Development Mode

To run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend server on http://localhost:4200

### Running Separately

To run the backend only:

```bash
npm run start:backend
```

To run the frontend only:

```bash
npm run start:frontend
```

## Demo Accounts

The application includes demo accounts for testing different roles:

| Role     | Email                 | Password |
|----------|----------------------|----------|
| Admin    | suraj@admin.com      | 12345    |
| User     | suraj@user.com       | 12345    |
| Seller   | suraj@seller.com     | 12345    |
| Delivery | suraj@delivery.com   | 12345    |

## API Endpoints

### Authentication
- `POST /api/users/login` - Login
- `POST /api/users/register` - Register a new user

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/pending` - Get pending approval users (admin only)
- `PUT /api/users/:id/approve` - Approve a user (admin only)
- `PUT /api/users/:id/reject` - Reject a user (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)

## Project Structure

```
rasoi-basket/
├── package.json           # Root package.json for running both services
├── README.md              # This file
├── rasoi-basket-frontend/ # Angular frontend
└── rasoi-basket-backend/  # Node.js backend
    ├── src/
    │   ├── config/        # Database configuration
    │   ├── controllers/   # Route controllers
    │   ├── middlewares/   # Custom middlewares
    │   ├── models/        # MongoDB models
    │   ├── routes/        # API routes
    │   ├── utils/         # Utility functions
    │   └── server.js      # Entry point
    ├── .env               # Environment variables
    └── package.json       # Backend dependencies
```

## License

This project is licensed under the ISC License. 