const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'rasoi_basket';

async function checkMongoDB() {
  console.log('=== CHECKING MONGODB CONNECTION ===');
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('✅ MongoDB is running');
    
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));
    
    // Check users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`User collection has ${userCount} documents`);
    
    await client.close();
    console.log('MongoDB connection closed');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\nPlease make sure MongoDB is running:');
    console.log('- On Windows: Run "net start MongoDB"');
    console.log('- On macOS/Linux: Run "sudo service mongod start"');
    console.log('\nOr run the project with mock data by setting useMockData = true in auth.service.ts');
    return false;
  }
}

async function checkServer() {
  console.log('\n=== CHECKING SERVER API ===');
  try {
    // Test base endpoint
    const baseResponse = await fetch('http://localhost:3000/');
    const baseData = await baseResponse.json();
    console.log('✅ Server is running');
    console.log('MongoDB status from server:', baseData.mongoStatus);
    
    // Test login-test endpoint
    const loginTestResponse = await fetch('http://localhost:3000/api/users/login-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'suraj@admin.com', password: '12345' })
    });
    
    if (loginTestResponse.ok) {
      const loginData = await loginTestResponse.json();
      console.log('✅ login-test endpoint is working');
      console.log('Login response user role:', loginData.role);
    } else {
      console.log('❌ login-test endpoint returned:', loginTestResponse.status);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Server check error:', error.message);
    console.log('\nPlease start the server:');
    console.log('- Navigate to rasoi-basket-backend directory');
    console.log('- Run "npm start" or "node src/server.js"');
    return false;
  }
}

async function main() {
  const mongoRunning = await checkMongoDB();
  const serverRunning = await checkServer();
  
  console.log('\n=== CHECK SUMMARY ===');
  console.log(`MongoDB: ${mongoRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);
  console.log(`Server API: ${serverRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);
  
  if (!mongoRunning || !serverRunning) {
    console.log('\nRecommended steps:');
    if (!mongoRunning) {
      console.log('1. Start MongoDB');
    }
    if (!serverRunning) {
      console.log(`${mongoRunning ? '1' : '2'}. Ensure port 3000 is free (kill any processes using it)`);
      console.log(`${mongoRunning ? '2' : '3'}. Start the server with "npm start" in rasoi-basket-backend directory`);
    }
  } else {
    console.log('\n✅ Your system is ready to run Rasoi Basket!');
    console.log('\nStart the frontend with:');
    console.log('cd rasoi-basket-frontend && npm start');
  }
}

main().catch(console.error); 