const axios = require('axios');

async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test the root endpoint
    const response = await axios.get('http://localhost:3000/');
    
    console.log('Backend is running!');
    console.log('MongoDB Status:', response.data.mongoStatus);
    console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error.message);
    return false;
  }
}

async function testLogin() {
  try {
    console.log('\nTesting login...');
    
    // Try to log in with admin credentials
    const response = await axios.post('http://localhost:3000/api/users/login', {
      email: 'suraj@admin.com',
      password: '12345'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('User role:', response.data.role);
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    
    return true;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data.message : error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== BACKEND API TESTS ===');
  
  const connectionSuccessful = await testBackendConnection();
  
  if (connectionSuccessful) {
    await testLogin();
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

runTests(); 