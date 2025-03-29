const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');

console.log('=== TESTING USER REGISTRATION & MONGODB STORAGE ===\n');

// Configuration
const MONGODB_URI = 'mongodb+srv://surajorg44:EydGYuOhwn1SY7Gq@cluster0.tnzmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const API_URL = 'http://localhost:3000/api';

async function testRegistration() {
  // Generate a unique test user
  const timestamp = new Date().getTime();
  const testUser = {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: '12345',
    phone: '9876543299',
    role: 'user'
  };
  
  console.log('Registering test user:', testUser.email);
  
  try {
    // Step 1: Register the user
    const registerResponse = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      console.log(`❌ Registration failed: ${errorData.message || 'Unknown error'}`);
      return;
    }
    
    const userData = await registerResponse.json();
    console.log('✅ User registered successfully');
    console.log('User ID:', userData._id);
    console.log('Role:', userData.role);
    console.log('Approved:', userData.isApproved);
    console.log('Status:', userData.status);
    
    // Step 2: Check if user is in MongoDB
    console.log('\nChecking MongoDB for user record...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('rasoi_basket');
    const usersCollection = db.collection('users');
    
    // Find the user by email
    const storedUser = await usersCollection.findOne({ email: testUser.email });
    
    if (storedUser) {
      console.log('✅ User found in MongoDB');
      console.log('MongoDB _id:', storedUser._id);
      console.log('MongoDB email:', storedUser.email);
      console.log('MongoDB role:', storedUser.role);
      console.log('MongoDB approved:', storedUser.isApproved);
    } else {
      console.log('❌ User NOT found in MongoDB');
      console.log('This suggests the application is using mock data mode');
      
      // Check if mock data mode is enabled
      const authServicePath = './rasoi-basket-frontend/src/app/services/auth.service.ts';
      const fs = require('fs');
      
      try {
        const authServiceContent = fs.readFileSync(authServicePath, 'utf8');
        const mockDataMode = authServiceContent.includes('private useMockData = true');
        console.log(`Mock data mode enabled in auth.service.ts: ${mockDataMode ? 'YES' : 'NO'}`);
        
        if (mockDataMode) {
          console.log('To use real MongoDB storage, change "useMockData = true" to "useMockData = false"');
        }
      } catch (err) {
        console.log('Could not check mock data mode:', err.message);
      }
    }
    
    await client.close();
    console.log('MongoDB connection closed');
    
    // Step 3: Try to log in with the new user
    console.log('\nTesting login with new user...');
    const loginResponse = await fetch('http://localhost:3000/api/users/login-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful with new user');
      console.log('User:', loginData.name);
      console.log('Role:', loginData.role);
    } else {
      console.log('❌ Login failed with new user');
      try {
        const errorData = await loginResponse.json();
        console.log('Error:', errorData.message || 'Unknown error');
      } catch (e) {
        console.log('Could not parse login error response');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  console.log('\n=== REGISTRATION TEST COMPLETE ===');
}

testRegistration().catch(console.error); 