const API = 'http://localhost:5000/api';

// Handle login and registration flows for the admin panel.

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      alert(error.message);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      role: document.getElementById('role').value,
      gender: document.getElementById('gender').value,
      address: document.getElementById('address').value,
      goal: document.getElementById('goal').value,
      package: document.getElementById('package').value,
      coachRequested: document.getElementById('coachRequested').value === 'true'
    };

    try {
      const response = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('token', data.token);
      if (data.user?.memberId) {
        alert(`Registration successful! Your member ID is ${data.user.memberId} and total fees are ${data.user.fees}`);
      } else {
        alert('Registration successful!');
      }
      window.location.href = '/dashboard';
    } catch (error) {
      alert(error.message);
    }
  });
}
