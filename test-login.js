const fetch = require('node-fetch');

async function testLogin() {
  console.log('=== TESTING RASOI BASKET LOGIN FUNCTIONALITY ===\n');
  
  const credentials = {
    email: 'suraj@admin.com',
    password: '12345'
  };
  
  // Test all available login endpoints
  const endpoints = [
    '/api/users/login-test',  // New test endpoint
    '/api/direct-login',      // Direct login endpoint
    '/api/users/login'        // Regular login endpoint
  ];
  
  for (const endpoint of endpoints) {
    console.log(`Testing login at: ${endpoint}`);
    
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      const status = response.status;
      console.log(`Status: ${status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Login successful at ${endpoint}`);
        console.log('User:', data.name);
        console.log('Role:', data.role);
        console.log('Token received:', data.token ? 'Yes' : 'No');
      } else {
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = errorData.message || 'Unknown error';
        } catch (e) {
          errorText = 'Could not parse error response';
        }
        console.log(`❌ Login failed: ${errorText}`);
      }
    } catch (error) {
      console.error(`❌ Request failed:`, error.message);
    }
    
    console.log('\n');
  }
  
  console.log('=== LOGIN TESTS COMPLETE ===');
}

testLogin(); 