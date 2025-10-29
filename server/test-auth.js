import fetch from 'node-fetch';

// Test user data
const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      mobileNumber: '1234567890',
      isPerformer: false
};

// Base URL
const API_URL = 'http://localhost:5000/api/auth';

// Test registration
async function testRegister() {
      try {
            console.log('Testing registration...');
            const response = await fetch(`${API_URL}/register`, {
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(testUser)
            });

            const data = await response.json();
            console.log('Registration response:', data);
            return data;
      } catch (error) {
            console.error('Registration test failed:', error);
      }
}

// Test login
async function testLogin() {
      try {
            console.log('\nTesting login...');
            const response = await fetch(`${API_URL}/login`, {
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                        email: testUser.email,
                        password: testUser.password
                  })
            });

            const data = await response.json();
            console.log('Login response:', data);
            return data;
      } catch (error) {
            console.error('Login test failed:', error);
      }
}

// Test get profile (protected route)
async function testGetProfile(token) {
      try {
            console.log('\nTesting get profile (protected route)...');
            const response = await fetch(`${API_URL}/profile`, {
                  method: 'GET',
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                  }
            });

            const data = await response.json();
            console.log('Get profile response:', data);
            return data;
      } catch (error) {
            console.error('Get profile test failed:', error);
      }
}

// Run tests
async function runTests() {
      // Test registration
      const registerData = await testRegister();

      // Test login
      const loginData = await testLogin();

      // Test get profile if login successful
      if (loginData && loginData.success && loginData.user.token) {
            await testGetProfile(loginData.user.token);
      }
}

runTests();