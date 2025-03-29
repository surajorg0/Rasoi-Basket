const fetch = require('node-fetch');

async function testLogin() {
  console.log('=== TESTING UPDATED LOGIN FUNCTIONALITY ===\n');
  
  // Test registered users from MongoDB
  const testUsers = [
    // Newly registered user
    {
      email: 's@gmail.com',
      password: '12345',
      description: 'Newly registered user'
    },
    // Demo accounts
    {
      email: 'suraj@admin.com',
      password: '12345',
      description: 'Demo Admin account'
    },
    {
      email: 'suraj@user.com',
      password: '12345',
      description: 'Demo User account'
    }
  ];
  
  // Test all available login endpoints
  const endpoints = [
    '/api/users/login-test',
    '/api/direct-login',
    '/api/users/login'
  ];
  
  for (const user of testUsers) {
    console.log(`\nTesting user: ${user.description} (${user.email})`);
    
    for (const endpoint of endpoints) {
      console.log(`  Testing endpoint: ${endpoint}`);
      
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            password: user.password
          })
        });
        
        const status = response.status;
        console.log(`  Status: ${status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`  ✅ Login successful at ${endpoint}`);
          console.log(`  User: ${data.name}`);
          console.log(`  Role: ${data.role}`);
          console.log(`  Token received: ${data.token ? 'Yes' : 'No'}`);
        } else {
          let errorText = '';
          try {
            const errorData = await response.json();
            errorText = errorData.message || 'Unknown error';
          } catch (e) {
            errorText = 'Could not parse error response';
          }
          console.log(`  ❌ Login failed: ${errorText}`);
        }
      } catch (error) {
        console.error(`  ❌ Request failed:`, error.message);
      }
    }
  }
  
  console.log('\n=== LOGIN TESTS COMPLETE ===');
}

testLogin().catch(console.error); 