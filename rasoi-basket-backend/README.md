# Rasoi Basket Backend

Backend API for Rasoi Basket - a grocery delivery application built with Node.js, Express, and MongoDB.

## Features

- RESTful API for groceries, fruits, and vegetables ordering
- User authentication and authorization with JWT
- Role-based access control (Admin, User, Seller, Delivery)
- Order management system
- Product management with categories
- MongoDB integration for data storage

## Prerequisites

- Node.js (v14 or above)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd rasoi-basket-backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/rasoi_basket
   JWT_SECRET=rasoi_basket_jwt_secret_key
   NODE_ENV=development
   ```

## Usage

### Development

To run the server in development mode with nodemon:

```
npm run dev
```

### Production

To run the server in production mode:

```
npm start
```

### Seed Data

To seed the database with initial data (including default users):

```
npm run seed
```

## Default Users

The seed script creates the following default users:

1. Admin User:
   - Email: suraj@admin.com
   - Password: 12345
   - Role: admin

2. Regular User:
   - Email: suraj@user.com
   - Password: 12345
   - Role: user

3. Seller User:
   - Email: suraj@seller.com
   - Password: 12345
   - Role: seller

4. Delivery User:
   - Email: suraj@delivery.com
   - Password: 12345
   - Role: delivery

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user and get token

### User Routes

- `GET /api/users/profile` - Get user profile (Authenticated)
- `PUT /api/users/profile` - Update user profile (Authenticated)
- `GET /api/users` - Get all users (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)

### Product Routes

- `GET /api/products` - Get all products (Public)
- `GET /api/products/:id` - Get product by ID (Public)
- `POST /api/products` - Create a product (Seller)
- `PUT /api/products/:id` - Update a product (Seller)
- `DELETE /api/products/:id` - Delete a product (Seller)
- `GET /api/products/seller/products` - Get seller products (Seller)

### Order Routes

- `POST /api/orders` - Create an order (Authenticated)
- `GET /api/orders/myorders` - Get logged in user orders (Authenticated)
- `GET /api/orders/seller` - Get seller orders (Seller)
- `GET /api/orders/delivery` - Get delivery agent orders (Delivery)
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get order by ID (Authenticated with role-based access)
- `PUT /api/orders/:id/pay` - Update order to paid (Authenticated)
- `PUT /api/orders/:id/status` - Update order status (Seller/Admin/Delivery)
- `PUT /api/orders/:id/assign-delivery` - Assign delivery agent to order (Seller/Admin)

## MongoDB Connection String

To connect to MongoDB, use the following connection string:

```
mongodb://localhost:27017/rasoi_basket
```

For MongoDB Atlas, replace with your connection string from the Atlas dashboard.

## License

ISC 