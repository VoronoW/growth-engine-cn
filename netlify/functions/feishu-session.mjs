import crypto from 'crypto';

const SESSION_SECRET = process.env.FEISHU_SESSION_SECRET || process.env.SESSION_SECRET || 'growth-engine-default-secret';

function parseCookies(cookieHeader) {
  const result = {};
  if (!cookieHeader) return result;
  for (const pair of cookieHeader.split(';')) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) result[key] = val;
  }
  return result;
}

function verifySession(token) {
  try {
    const dotIdx = token.lastIndexOf('.');
    if (dotIdx < 0) return null;
    const encoded = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);
    const expected = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(encoded)
      .digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload.user;
  } catch {
    return null;
  }
}

export const handler = async (event) => {
  const cookies = parseCookies(event.headers?.cookie || event.headers?.Cookie || '');
  const token = cookies.feishu_session;
  if (!token) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loggedIn: false }),
    };
  }
  const user = verifySession(token);
  if (!user) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loggedIn: false }),
    };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loggedIn: true, user }),
  };
};
