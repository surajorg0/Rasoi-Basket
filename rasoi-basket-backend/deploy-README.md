# Rasoi Basket Backend Deployment Guide

This guide will help you deploy the Rasoi Basket backend to Render.com, a cloud platform that offers free hosting for Node.js applications.

## Prerequisites

- A [Render.com](https://render.com) account (free tier works fine)
- Your Rasoi Basket backend code on GitHub
- MongoDB Atlas account (you already have this set up)

## Deployment Steps

### 1. Prepare Your Backend for Deployment

Ensure your package.json has a proper start script:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

### 2. Add a Render.yaml Configuration File

Create a file called `render.yaml` in your backend project root:

```yaml
services:
  - type: web
    name: rasoi-basket-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://surajorg44:EydGYuOhwn1SY7Gq@cluster0.tnzmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
      - key: JWT_SECRET
        value: rasoi-basket-secret-key
      - key: PORT
        value: 3000
```

### 3. Deploy to Render.com

1. Go to [Render.com](https://render.com) and sign in
2. Click "New+" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your backend code
5. Render will detect your configuration from the render.yaml file
6. Click "Create Web Service"

### 4. Configure CORS in Your Backend

Make sure your backend allows requests from mobile apps by updating the CORS configuration in your server.js file:

```javascript
const cors = require('cors');

// Configure CORS
app.use(cors({
  origin: ['http://localhost:8100', 'http://localhost:4200', 'capacitor://localhost', 'ionic://localhost', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 5. Test Your Deployed API

Once deployed, your API will be available at:
`https://rasoi-basket-api.onrender.com/api`

You can test it with:
```
curl https://rasoi-basket-api.onrender.com/api
```

### 6. Configure MongoDB Atlas Network Access

Ensure your MongoDB Atlas cluster allows connections from everywhere:

1. Go to the MongoDB Atlas dashboard
2. Select your cluster
3. Click on "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Choose "Allow Access from Anywhere" (adds 0.0.0.0/0)
6. Click "Confirm"

This allows both your deployed backend and mobile apps to connect to your database.

## Troubleshooting

If you encounter issues, check the Render.com logs:

1. Go to your Render dashboard
2. Select your web service
3. Click on "Logs" to see real-time logs
4. Look for any error messages

## Next Steps

Once your backend is deployed:

1. Rebuild your mobile app with the updated API URL
2. Test registration and login from your device
3. Deploy your app to the Play Store for wider testing 