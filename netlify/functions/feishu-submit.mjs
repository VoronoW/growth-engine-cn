import crypto from 'crypto';

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const FEISHU_BITABLE_APP_TOKEN = process.env.FEISHU_BITABLE_APP_TOKEN || process.env.FEISHU_TABLE_A;
const SESSION_SECRET = process.env.FEISHU_SESSION_SECRET || process.env.SESSION_SECRET || 'growth-engine-default-secret';

// Table IDs per panel — set in Netlify env vars
const TABLE_IDS = {
  a1: process.env.FEISHU_TABLE_A1,
  a2: process.env.FEISHU_TABLE_A2,
  a3: process.env.FEISHU_TABLE_A3,
  a4: process.env.FEISHU_TABLE_A4,
  b2: process.env.FEISHU_TABLE_B2,
  b3: process.env.FEISHU_TABLE_B3,
  b4: process.env.FEISHU_TABLE_B4,
  b5: process.env.FEISHU_TABLE_B5,
  b6: process.env.FEISHU_TABLE_B6,
};

// HTML table header → Feishu field name mapping for each panel
const FIELD_MAP = {
  a1: {
    '序号': '序号',
    'SKU 名称': 'SKU名称',
    '投放平台': '投放平台',
    '近30天销量': '近30天销量',
    '广告花费(RMB)': '广告花费RMB',
    '平台ROAS': '平台ROAS',
    '实际利润(RMB)': '实际利润RMB',
    '毛利率%': '毛利率',
    '数据状态': '数据状态',
  },
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
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    );
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

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  // Check session
  const cookies = parseCookies(
    event.headers?.cookie || event.headers?.Cookie || ''
  );
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

  const { panelId, records } = body;
  if (!panelId || !Array.isArray(records) || records.length === 0) {
    return json(400, { error: 'panelId and non-empty records required' });
  }

  const tableId = TABLE_IDS[panelId];
  if (!tableId) {
    return json(400, { error: `No table configured for panel: ${panelId}` });
  }

  if (!FEISHU_BITABLE_APP_TOKEN) {
    return json(500, { error: 'FEISHU_BITABLE_APP_TOKEN not configured' });
  }

  // Get app token
  const appToken = await getAppAccessToken();
  if (!appToken) {
    return json(500, { error: 'Failed to obtain app_access_token' });
  }

  // Map field names if mapping exists
  const fieldMap = FIELD_MAP[panelId];
  const mappedRecords = records.map((fields) => {
    if (!fieldMap) return fields;
    const mapped = {};
    for (const [htmlKey, value] of Object.entries(fields)) {
      const feishuKey = fieldMap[htmlKey] || htmlKey;
      if (value !== '' && value !== null && value !== undefined) {
        mapped[feishuKey] = value;
      }
    }
    return mapped;
  });

  // Write records to Bitable
  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_BITABLE_APP_TOKEN}/tables/${tableId}/records/batch_create`;
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
