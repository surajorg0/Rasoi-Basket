const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login with fetch...');
    
    const response = await fetch('http://localhost:3000/api/users/login-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'suraj@admin.com',
        password: '12345'
      })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('Login successful!');
    } else {
      console.log('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin(); 