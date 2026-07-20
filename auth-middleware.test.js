const test = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

test('Auth Middleware', async (t) => {
  t.beforeEach(() => {
    process.env.JWT_SECRET = 'testsecret';
  });

  await t.test('should return 401 if no Authorization header is provided', () => {
    const req = {
      header: () => null
    };
    let statusCalledWith = null;
    let jsonCalledWith = null;
    const res = {
      status(code) {
        statusCalledWith = code;
        return this;
      },
      json(data) {
        jsonCalledWith = data;
        return this;
      }
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    authMiddleware(req, res, next);

    assert.strictEqual(statusCalledWith, 401);
    assert.deepStrictEqual(jsonCalledWith, { message: 'Access denied. No token provided.' });
    assert.strictEqual(nextCalled, false);
  });

  await t.test('should return 400 if token is invalid', () => {
    const req = {
      header: (name) => name === 'Authorization' ? 'Bearer invalidtoken' : null
    };
    let statusCalledWith = null;
    let jsonCalledWith = null;
    const res = {
      status(code) {
        statusCalledWith = code;
        return this;
      },
      json(data) {
        jsonCalledWith = data;
        return this;
      }
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    authMiddleware(req, res, next);

    assert.strictEqual(statusCalledWith, 400);
    assert.deepStrictEqual(jsonCalledWith, { message: 'Invalid token.' });
    assert.strictEqual(nextCalled, false);
  });

  await t.test('should call next and set req.user if token is valid', () => {
    const payload = { id: 'user123', role: 'admin' };
    const token = jwt.sign(payload, 'testsecret');
    const req = {
      header: (name) => name === 'Authorization' ? `Bearer ${token}` : null
    };
    const res = {};
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    authMiddleware(req, res, next);

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.id, 'user123');
    assert.strictEqual(req.user.role, 'admin');
  });
});
