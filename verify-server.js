const fetch = require('node-fetch');

async function testServer() {
  console.log('=== TESTING RASOI BASKET SERVER ===\n');
  
  // Test 1: Check if server is running
  try {
    console.log('Test 1: Checking if server is running...');
    const rootResponse = await fetch('http://localhost:3000/');
    const rootData = await rootResponse.json();
    
    console.log('✅ Server is running');
    console.log('MongoDB Status:', rootData.mongoStatus);
    console.log('Response:', rootData);
    console.log('\n');
  } catch (error) {
    console.error('❌ Server check failed:', error.message);
    console.log('Please make sure the server is running on http://localhost:3000\n');
    return false;
  }
  
  // Test 2: Try the direct login endpoint
  try {
    console.log('Test 2: Testing direct login endpoint...');
    const loginResponse = await fetch('http://localhost:3000/api/direct-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'suraj@admin.com',
        password: '12345'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Direct login successful');
      console.log('User:', loginData.name);
      console.log('Role:', loginData.role);
      console.log('Token received:', loginData.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Direct login failed:', loginData.message);
    }
    console.log('\n');
  } catch (error) {
    console.error('❌ Direct login test failed:', error.message);
    console.log('\n');
  }
  
  // Test 3: Try the regular login endpoint
  try {
    console.log('Test 3: Testing regular login endpoint...');
    const loginResponse = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'suraj@admin.com',
        password: '12345'
      })
    });
    
    try {
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ Regular login successful');
        console.log('User:', loginData.name);
        console.log('Role:', loginData.role);
        console.log('Token received:', loginData.token ? 'Yes' : 'No');
      } else {
        console.log('❌ Regular login failed:', loginData.message);
        if (loginData.message === 'stream is not readable') {
          console.log('This is the stream error we need to fix. Use the direct login endpoint instead.');
        }
      }
    } catch (parseError) {
      console.log('❌ Could not parse login response:', parseError.message);
      console.log('Original response status:', loginResponse.status);
    }
    console.log('\n');
  } catch (error) {
    console.error('❌ Regular login test failed:', error.message);
    console.log('\n');
  }
  
  console.log('=== TEST COMPLETE ===');
}

testServer(); 