const axios = require('axios');

const API = 'http://localhost:5000';

async function run() {
  try {
    // Try to register a test user
    try {
      await axios.post(`${API}/api/auth/register`, {
        name: 'Test Profile',
        email: 'test.profile@example.com',
        password: 'password',
        role: 'student'
      });
      console.log('Registered test user');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log('User already exists, continuing');
      } else {
        throw err;
      }
    }

    // Login
    const loginResp = await axios.post(`${API}/api/auth/login`, { email: 'test.profile@example.com', password: 'password' });
    const token = loginResp.data.token;

    console.log('Logged in, token length:', token.length);

    // Update name
    const updatedName = 'Updated Profile Name';
    await axios.patch(`${API}/api/auth/me`, { name: updatedName }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Updated name to', updatedName);

    // Fetch profile
    const me = await axios.get(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Profile returned:', me.data);

  } catch (err) {
    console.error('Test failed:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

run();
