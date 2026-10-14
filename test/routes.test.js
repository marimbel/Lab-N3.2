// Run with: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../app');

let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

test('Part A: HTML form post returns an HTML response', async () => {
  const res = await fetch(`${base}/readCustomerInfoAndRespond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'name=Mari&email=mari%40example.com',
  });
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  assert.strictEqual(await res.text(), 'Welcome Mari<br>We will contact you at mari@example.com');
});

test('Part B: REST endpoint returns JSON', async () => {
  const res = await fetch(`${base}/api/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Mari', email: 'mari@example.com' }),
  });
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  assert.deepStrictEqual(await res.json(), { message: 'Welcome Mari', email: 'mari@example.com' });
});

test('Part B: missing fields return 400 JSON error', async () => {
  const res = await fetch(`${base}/api/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '' }),
  });
  assert.strictEqual(res.status, 400);
  assert.ok((await res.json()).error);
});
