const assert = require('assert');
const { once } = require('events');
const app = require('../app');

(async () => {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const uniqueEmail = `membertest_${Date.now()}@example.com`;

  try {
    const registerRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Admin',
        email: uniqueEmail,
        password: 'secret123',
        role: 'member'
      })
    });

    const registerData = await registerRes.json();
    assert.strictEqual(registerRes.status, 201, `register failed: ${JSON.stringify(registerData)}`);

    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: uniqueEmail, password: 'secret123' })
    });

    const loginData = await loginRes.json();
    assert.strictEqual(loginRes.status, 200, `login failed: ${JSON.stringify(loginData)}`);

    const memberRes = await fetch(`${baseUrl}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        fullName: 'Reg Test Member',
        email: 'member-create@example.com',
        contact: '1234567890',
        membershipType: 'Basic',
        startDate: '2026-01-01',
        status: 'Active'
      })
    });

    const memberData = await memberRes.json();
    assert.strictEqual(memberRes.status, 201, `member create failed: ${JSON.stringify(memberData)}`);
    assert.ok(memberData.memberId, `expected generated memberId, got ${JSON.stringify(memberData)}`);

    console.log('member-create test passed');
  } finally {
    server.close();
  }
})();
