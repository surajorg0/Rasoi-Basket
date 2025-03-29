# Rasoi Basket

A food delivery application with multiple user roles (Admin, User, Seller, Delivery Partner).

## Project Structure

- **Frontend**: Angular (Ionic) application in `rasoi-basket-frontend` directory
- **Backend**: Node.js (Express) application in `rasoi-basket-backend` directory

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (v4 or later)
- Angular CLI (`npm install -g @angular/cli`)
- Ionic CLI (`npm install -g @ionic/cli`)

## Step-by-Step Setup Guide

### 1. Install Dependencies

First, install all the required dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd rasoi-basket-backend
npm install

# Install frontend dependencies
cd ../rasoi-basket-frontend
npm install

# Return to the project root
cd ..
```

### 2. Set Up MongoDB

Make sure MongoDB is running on your system:

- **Windows**: MongoDB should be running as a service. You can check in Services (services.msc)
- **macOS/Linux**: Run `sudo service mongod start` or `brew services start mongodb-community`

The application will connect to:
```
mongodb://localhost:27017/rasoi_basket
```

### 3. Run the Backend Server

```bash
cd rasoi-basket-backend
npm run dev
```

You should see the following output:
```
MongoDB Connected: localhost
Server running on port 3000
Environment: development
MongoDB Status: Connected
```

Keep this terminal open and running.

### 4. Run the Frontend Application

Open a new terminal window/tab and run:

```bash
cd rasoi-basket-frontend
npm start
```

This will start the Angular development server and open the application in your browser.

### 5. Testing the Application

You can use the following demo accounts to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | suraj@admin.com | 12345 |
| User | suraj@user.com | 12345 |
| Seller | suraj@seller.com | 12345 |
| Delivery | suraj@delivery.com | 12345 |

### 6. Registering New Users

- Regular users are approved automatically
- Seller and delivery partner accounts require admin approval
- New users are stored in MongoDB and can login after registration

## Troubleshooting

### CORS Issues
If you encounter CORS issues, make sure both frontend and backend servers are running and your backend has proper CORS configuration.

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` in the terminal should connect to the MongoDB shell
- Check connection string in `.env` file: `MONGODB_URI=mongodb://localhost:27017/rasoi_basket`

### Login/Registration Issues
- Verify the backend is running and responding to API requests
- Check for any errors in browser console or backend terminal
- Ensure MongoDB is properly connected

## Development Notes

- Frontend runs on: http://localhost:4200
- Backend API runs on: http://localhost:3000
- API endpoints are available at: http://localhost:3000/api/users, /api/products, /api/orders

For more details on API endpoints, refer to the backend code or API documentation. 