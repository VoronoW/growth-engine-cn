/**
 * feishu-utils.mjs
 * 飞书 API 工具函数 — 服务端专用
 */

import { createHmac, randomBytes } from 'crypto';

/* ── App Access Token ─────────────────────────────── */
let _cachedAppToken = null;
let _appTokenExpiry = 0;

export async function getAppAccessToken() {
  if (_cachedAppToken && Date.now() < _appTokenExpiry) return _cachedAppToken;

  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET
    })
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`获取 app_access_token 失败: ${data.msg}`);
  _cachedAppToken = data.app_access_token;
  _appTokenExpiry = Date.now() + (data.expire - 60) * 1000;
  return _cachedAppToken;
}

/* ── 正式 Bitable App Token ────────────────────────── */
let _resolvedAppToken = null;

export async function getBitableAppToken() {
  if (_resolvedAppToken) return _resolvedAppToken;

  const direct = process.env.FEISHU_APP_TOKEN;
  if (!direct) {
    throw new Error('缺少 FEISHU_APP_TOKEN 环境变量');
  }

  _resolvedAppToken = direct;
  return direct;
}

/* ── Session Cookie ────────────────────────────────── */
const SESSION_COOKIE = 'feishu_session';
const STATE_COOKIE   = 'feishu_oauth_state';

export function signSession(payload) {
  const secret = process.env.FEISHU_SESSION_SECRET || 'dev-insecure-secret';
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig  = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySession(token) {
  if (!token) return null;
  const secret = process.env.FEISHU_SESSION_SECRET || 'dev-insecure-secret';
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  if (expected !== sig) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString());
  } catch { return null; }
}

export function makeSessionCookie(payload, maxAgeSeconds = 86400 * 7) {
  const token = signSession(payload);
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function makeStateCookie(state, maxAgeSeconds = 600) {
  return `${STATE_COOKIE}=${state}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

export function parseCookies(cookieHeader = '') {
  const cookies = {};
  cookieHeader.split(';').forEach(pair => {
    const [k, ...v] = pair.trim().split('=');
    if (k) cookies[k.trim()] = v.join('=').trim();
  });
  return cookies;
}

export function getSessionFromEvent(event) {
  const cookies = parseCookies(event.headers?.cookie || event.headers?.Cookie || '');
  return verifySession(cookies[SESSION_COOKIE]);
}

export function generateState() {
  return randomBytes(16).toString('hex');
}

/* ── Bitable 写入 ──────────────────────────────────── */
export async function writeRecordsToBitable(tableId, records) {
  const appToken   = await getBitableAppToken();
  const accessToken = await getAppAccessToken();

  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/batch_create`;
  const body = {
    records: records.map(fields => ({ fields }))
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`写入飞书 Bitable 失败 (code ${data.code}): ${data.msg}`);
  return data.data?.records?.length ?? records.length;
}

/* ── CORS headers ─────────────────────────────────── */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

export function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders, ...extraHeaders },
    body: JSON.stringify(body)
  };
}

export function redirectResponse(location, extraHeaders = {}) {
  return {
    statusCode: 302,
    headers: { Location: location, ...extraHeaders },
    body: ''
  };
}
