const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
const fs = require('fs');

// Configuration
const MONGO_URL = 'mongodb+srv://surajorg44:EydGYuOhwn1SY7Gq@cluster0.tnzmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGO_DB = 'rasoi_basket';
const API_BASE_URL = 'http://localhost:3000/api';
const FRONTEND_URL = 'http://localhost:4200';

async function checkMongoDB() {
  console.log('\n=== CHECKING MONGODB CONNECTION ===');
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log('✅ MongoDB is running');
    
    const db = client.db(MONGO_DB);
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', ') || 'None');
    
    // Check users collection
    if (collections.some(c => c.name === 'users')) {
      const usersCollection = db.collection('users');
      const userCount = await usersCollection.countDocuments();
      console.log(`Users collection has ${userCount} documents`);
      
      if (userCount > 0) {
        const sampleUser = await usersCollection.findOne({});
        console.log('Sample user found:', sampleUser ? sampleUser.email : 'None');
      }
    }
    
    await client.close();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

async function checkServerEndpoints() {
  console.log('\n=== CHECKING SERVER ENDPOINTS ===');
  
  const endpoints = [
    { method: 'GET', url: '/', name: 'Root' },
    { method: 'POST', url: '/api/users/login-test', name: 'Login Test', body: { email: 'suraj@admin.com', password: '12345' } },
    { method: 'POST', url: '/api/direct-login', name: 'Direct Login', body: { email: 'suraj@admin.com', password: '12345' } },
    { method: 'POST', url: '/api/users/login', name: 'Regular Login', body: { email: 'suraj@admin.com', password: '12345' } }
  ];
  
  let allEndpointsWorking = true;
  
  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint.url}`, options);
      const status = response.status;
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name} endpoint (${endpoint.url}): ${status} OK`);
      } else {
        console.log(`❌ ${endpoint.name} endpoint (${endpoint.url}): ${status} FAILED`);
        allEndpointsWorking = false;
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name} endpoint (${endpoint.url}): ERROR - ${error.message}`);
      allEndpointsWorking = false;
    }
  }
  
  return allEndpointsWorking;
}

async function checkProcesses() {
  console.log('\n=== CHECKING RUNNING PROCESSES ===');
  
  try {
    // Check if MongoDB is running
    const mongodbRunning = await checkMongoDB();
    console.log(`MongoDB: ${mongodbRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);
    
    // Check if backend server is running
    let backendRunning = false;
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      backendRunning = response.ok;
    } catch (error) {
      backendRunning = false;
    }
    console.log(`Backend server: ${backendRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);
    
    // Check if frontend is running
    let frontendRunning = false;
    try {
      // This will likely fail due to CORS, but we can check if the server responds
      await fetch(`${FRONTEND_URL}/`);
      frontendRunning = true;
    } catch (error) {
      // Check if error is related to CORS or connection refused
      frontendRunning = error.message.includes('Failed to fetch') || 
                        error.message.includes('CORS') || 
                        error.message.includes('ECONNREFUSED');
    }
    console.log(`Frontend server: ${frontendRunning ? '✅ LIKELY RUNNING' : '❌ NOT RUNNING'}`);
    
    return { mongodbRunning, backendRunning, frontendRunning };
  } catch (error) {
    console.error('Error checking processes:', error);
    return { mongodbRunning: false, backendRunning: false, frontendRunning: false };
  }
}

async function testSystemIntegration() {
  console.log('\n=== TESTING SYSTEM INTEGRATION ===');
  
  try {
    // Create a test user
    const timestamp = new Date().getTime();
    const testUser = {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: '12345',
      phone: '9876543200',
      role: 'user'
    };
    
    console.log('1. Creating test user:', testUser.email);
    const registerResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    let userId = null;
    if (registerResponse.ok) {
      const userData = await registerResponse.json();
      userId = userData._id;
      console.log(`✅ User registered successfully with ID: ${userId}`);
    } else {
      console.log('❌ User registration failed');
      const errorData = await registerResponse.json();
      console.log(`   Error: ${errorData.message}`);
      return false;
    }
    
    // Try to login with the new user
    console.log('2. Testing login with new user');
    const loginResponse = await fetch(`${API_BASE_URL}/users/login-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    if (loginResponse.ok) {
      console.log('✅ Login successful with new user');
    } else {
      console.log('❌ Login failed with new user');
      try {
        const errorData = await loginResponse.json();
        console.log(`   Error: ${errorData.message}`);
      } catch (e) {
        console.log('   Could not parse error response');
      }
      return false;
    }
    
    // Check if user exists in MongoDB
    console.log('3. Verifying user stored in MongoDB');
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    
    const db = client.db(MONGO_DB);
    const usersCollection = db.collection('users');
    
    const storedUser = await usersCollection.findOne({ email: testUser.email });
    
    if (storedUser) {
      console.log('✅ User found in MongoDB');
      console.log(`   MongoDB ID: ${storedUser._id}`);
      console.log(`   Role: ${storedUser.role}`);
    } else {
      console.log('❌ User NOT found in MongoDB');
      console.log('   This means the application might be in mock data mode');
      await client.close();
      return false;
    }
    
    await client.close();
    return true;
  } catch (error) {
    console.error('System integration test failed:', error.message);
    return false;
  }
}

function checkFrontendConfiguration() {
  console.log('\n=== CHECKING FRONTEND CONFIGURATION ===');
  
  try {
    // Check environment.ts file
    const envPath = './rasoi-basket-frontend/src/environments/environment.ts';
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const apiUrlMatch = envContent.match(/apiUrl: ['"]([^'"]+)['"]/);
      if (apiUrlMatch) {
        const apiUrl = apiUrlMatch[1];
        console.log(`✅ API URL in environment.ts: ${apiUrl}`);
        if (apiUrl !== 'http://localhost:3000/api') {
          console.log('⚠️ WARNING: API URL might be incorrect. Expected: http://localhost:3000/api');
        }
      } else {
        console.log('❌ Could not find apiUrl in environment.ts');
      }
    } else {
      console.log('❌ environment.ts file not found');
    }
    
    // Check auth.service.ts for mock data setting
    const authServicePath = './rasoi-basket-frontend/src/app/services/auth.service.ts';
    if (fs.existsSync(authServicePath)) {
      const authServiceContent = fs.readFileSync(authServicePath, 'utf8');
      const mockDataMatch = authServiceContent.match(/private useMockData = (true|false)/);
      if (mockDataMatch) {
        const mockDataMode = mockDataMatch[1] === 'true';
        console.log(`✅ Mock data mode in auth.service.ts: ${mockDataMode ? 'ENABLED' : 'DISABLED'}`);
        if (mockDataMode) {
          console.log('⚠️ WARNING: Mock data mode is enabled. MongoDB will not be used for storage.');
        }
      } else {
        console.log('❌ Could not find useMockData setting in auth.service.ts');
      }
    } else {
      console.log('❌ auth.service.ts file not found');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking frontend configuration:', error.message);
    return false;
  }
}

function printSystemSummary(results) {
  console.log('\n=== SYSTEM HEALTH SUMMARY ===');
  console.log(`MongoDB Connection: ${results.mongodb ? '✅ GOOD' : '❌ PROBLEM'}`);
  console.log(`Server API Endpoints: ${results.endpoints ? '✅ GOOD' : '❌ PROBLEM'}`);
  console.log(`Required Processes: ${results.processes.mongodbRunning && results.processes.backendRunning ? '✅ GOOD' : '❌ PROBLEM'}`);
  console.log(`Frontend Configuration: ${results.frontendConfig ? '✅ GOOD' : '❌ PROBLEM'}`);
  console.log(`System Integration: ${results.integration ? '✅ GOOD' : '❌ PROBLEM'}`);
  
  console.log('\n=== RECOMMENDATIONS ===');
  if (!results.mongodb) {
    console.log('1. Start MongoDB service');
    console.log('   - On Windows: Run "net start MongoDB"');
    console.log('   - On macOS/Linux: Run "sudo service mongod start"');
  }
  
  if (!results.processes.backendRunning) {
    console.log(`${results.mongodb ? '1' : '2'}. Start the backend server`);
    console.log('   - cd rasoi-basket-backend && npm start');
  }
  
  if (!results.processes.frontendRunning) {
    console.log(`${!results.mongodb && !results.processes.backendRunning ? '3' : !results.mongodb || !results.processes.backendRunning ? '2' : '1'}. Start the frontend server`);
    console.log('   - cd rasoi-basket-frontend && npm start');
  }
  
  if (results.mongodb && results.processes.backendRunning && results.processes.frontendRunning) {
    console.log('✅ All systems are running correctly!');
    console.log('\nAccess the application:');
    console.log('- Frontend: http://localhost:4200');
    console.log('- Backend API: http://localhost:3000');
    console.log('\nDemo accounts:');
    console.log('- Admin: suraj@admin.com / 12345');
    console.log('- User: suraj@user.com / 12345');
    console.log('- Seller: suraj@seller.com / 12345');
    console.log('- Delivery: suraj@delivery.com / 12345');
  }
}

async function runSystemCheck() {
  console.log('=== RASOI BASKET SYSTEM CHECK ===');
  console.log('Checking all components of the system...');
  
  const results = {
    mongodb: await checkMongoDB(),
    endpoints: await checkServerEndpoints(),
    processes: await checkProcesses(),
    frontendConfig: checkFrontendConfiguration(),
    integration: await testSystemIntegration()
  };
  
  printSystemSummary(results);
}

runSystemCheck().catch(console.error); 