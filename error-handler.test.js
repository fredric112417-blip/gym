const test = require('node:test');
const assert = require('node:assert');
const errorHandler = require('../middleware/errorHandler');

test('Error Handler Middleware', async (t) => {
  // Mock console.error to avoid cluttering test output
  const originalConsoleError = console.error;
  t.before(() => {
    console.error = () => {};
  });
  t.after(() => {
    console.error = originalConsoleError;
  });

  await t.test('should return 500 and default message if error has no status or message', () => {
    const err = new Error();
    const req = {};
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
    const next = () => {};

    errorHandler(err, req, res, next);

    assert.strictEqual(statusCalledWith, 500);
    assert.deepStrictEqual(jsonCalledWith, { message: 'Internal Server Error' });
  });

  await t.test('should return custom status and message if provided', () => {
    const err = new Error('Custom Error Message');
    err.status = 400;
    const req = {};
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
    const next = () => {};

    errorHandler(err, req, res, next);

    assert.strictEqual(statusCalledWith, 400);
    assert.deepStrictEqual(jsonCalledWith, { message: 'Custom Error Message' });
  });
});
