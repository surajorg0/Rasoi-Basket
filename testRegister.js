const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    // Create a new test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '5551234567',
      role: 'user'
    };
    
    // Send registration request with proper headers
    const response = await axios.post('http://localhost:3000/api/users/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration response:', response.status);
    console.log('User data:', JSON.stringify(response.data, null, 2));
    
    console.log('Registration successful!');
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
  }
}

testRegistration(); 