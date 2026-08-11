const crypto = require('crypto');
const { issueAdminToken } = require('../../lib/adminAuth');

const respond = (res, status, payload) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(payload);
};

const safeEqual = (a, b) => {
  const left = Buffer.from(a || '');
  const right = Buffer.from(b || '');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return respond(res, 405, { error: 'Method not allowed.' });
  }

  const { username, password } = req.body || {};
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || !process.env.ADMIN_SESSION_SECRET) {
    return respond(res, 503, { error: 'Admin login is not configured on the server.' });
  }

  const usernameValid = safeEqual(String(username || ''), expectedUsername);
  const passwordValid = safeEqual(String(password || ''), expectedPassword);

  if (!usernameValid || !passwordValid) {
    return respond(res, 401, { error: 'Invalid credentials.' });
  }

  const token = issueAdminToken(expectedUsername);
  return respond(res, 200, {
    token,
    expiresInSeconds: 60 * 60 * 12
  });
};
