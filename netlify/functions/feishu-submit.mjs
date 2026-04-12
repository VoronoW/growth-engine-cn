import crypto from 'crypto';
import { getTableId } from './_shared/feishu-table-map.mjs';
import { getFieldMap, applyFieldMap } from './_shared/feishu-field-map.mjs';
import { getBitableAppToken } from './_shared/feishu-utils.mjs';

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const SESSION_SECRET = process.env.FEISHU_SESSION_SECRET || process.env.SESSION_SECRET || 'growth-engine-default-secret';

const LEGACY_TABLE_IDS = {
  a1: process.env.FEISHU_TABLE_A1,
  a2: process.env.FEISHU_TABLE_A2,
  a4: process.env.FEISHU_TABLE_A4,
  b2: process.env.FEISHU_TABLE_B2,
  b3: process.env.FEISHU_TABLE_B3,
  b4: process.env.FEISHU_TABLE_B4,
  b5: process.env.FEISHU_TABLE_B5,
  b6: process.env.FEISHU_TABLE_B6,
};

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

async function getAppAccessToken() {
  const res = await fetch(
    'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    }
  );
  const data = await res.json();
  return data.app_access_token;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function resolveTableId(panelId, subKey) {
  if (panelId === 'a3') {
    return getTableId(panelId, subKey);
  }
  return LEGACY_TABLE_IDS[panelId];
}

function resolveFieldMap(panelId, subKey) {
  if (panelId === 'a3') {
    return getFieldMap(panelId, subKey);
  }
  if (panelId === 'a1') {
    return getFieldMap(panelId, 'main');
  }
  return null;
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const cookies = parseCookies(event.headers?.cookie || event.headers?.Cookie || '');
  const user = verifySession(cookies.feishu_session || '');
  if (!user) {
    return json(401, { error: 'Not authenticated' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const { panelId, subKey, records } = body;
  if (!panelId || !Array.isArray(records) || records.length === 0) {
    return json(400, { error: 'panelId and non-empty records required' });
  }

  let tableId;
  try {
    tableId = resolveTableId(panelId, subKey);
  } catch (error) {
    return json(400, { error: error.message });
  }

  if (!tableId) {
    return json(400, { error: `No table configured for panel: ${panelId}` });
  }

  let bitableAppToken;
  try {
    bitableAppToken = await getBitableAppToken();
  } catch (error) {
    return json(500, { error: error.message });
  }

  const appToken = await getAppAccessToken();
  if (!appToken) {
    return json(500, { error: 'Failed to obtain app_access_token' });
  }

  const fieldMap = resolveFieldMap(panelId, subKey);
  const mappedRecords = fieldMap ? applyFieldMap(records, fieldMap) : records;

  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${bitableAppToken}/tables/${tableId}/records/batch_create`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${appToken}`,
    },
    body: JSON.stringify({
      records: mappedRecords.map((fields) => ({ fields })),
    }),
  });
  const result = await res.json();

  if (result.code !== 0) {
    console.error('Bitable write error:', JSON.stringify(result));
    return json(500, {
      error: `Feishu API error ${result.code}: ${result.msg}`,
    });
  }

  return json(200, {
    ok: true,
    count: result.data?.records?.length ?? mappedRecords.length,
  });
};
