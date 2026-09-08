const crypto = require('crypto');

const TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 12;

const base64UrlEncode = value => Buffer.from(value).toString('base64url');
const base64UrlDecode = value => Buffer.from(value, 'base64url').toString('utf8');

const sign = payload => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured.');
  }

  const payloadJson = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadJson);
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
};

const verify = token => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || !token || !token.includes('.')) return null;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  if (signature.length !== expectedSignature.length) return null;
  const signatureMatches = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!signatureMatches) return null;

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    return null;
  }

  if (!payload?.exp || Date.now() > payload.exp) return null;
  return payload;
};

const issueAdminToken = username => sign({
  sub: username,
  role: 'admin',
  exp: Date.now() + TOKEN_LIFETIME_MS
});

const isAuthorizedAdmin = authHeader => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const payload = verify(authHeader.slice('Bearer '.length));
  return Boolean(payload && payload.role === 'admin');
};

module.exports = {
  issueAdminToken,
  isAuthorizedAdmin
};
