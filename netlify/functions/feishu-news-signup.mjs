import { getAppAccessToken, getBitableAppToken, jsonResponse } from './_shared/feishu-utils.mjs';

function isEmpty(value) {
  return String(value ?? '').trim() === '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  // Keep a fixed fallback here for the dedicated news signup table so the
  // signup flow stays stable even if a migrated environment lags behind.
  const tableId = 'tblNVP3LRRGnTh2p';
  if (!tableId) {
    return jsonResponse(503, { error: '订阅表暂未接通，请稍后再试' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: '请求格式错误' });
  }

  const email = String(payload['邮箱'] || payload.email || '').trim();
  if (isEmpty(email)) {
    return jsonResponse(400, { error: '邮箱为必填项' });
  }
  if (!isEmail(email)) {
    return jsonResponse(400, { error: '请输入有效的邮箱地址' });
  }

  const fields = {
    '邮箱': email,
    '来源页面': String(payload['来源页面'] || payload.sourcePage || '新闻与案例').trim(),
    '提交来源': String(payload['提交来源'] || payload.submitSource || '官网订阅表单').trim(),
  };

  try {
    const appToken = await getBitableAppToken();
    const accessToken = await getAppAccessToken();

    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      },
    );

    const result = await response.json();
    if (result.code !== 0) {
      console.error('News signup submit error:', JSON.stringify(result));
      return jsonResponse(500, { error: result.msg || '提交失败，请稍后再试' });
    }

    return jsonResponse(200, {
      ok: true,
      recordId: result.data?.record?.record_id ?? null,
    });
  } catch (error) {
    console.error('News signup submit error:', error?.message || error);
    return jsonResponse(500, { error: '提交失败，请稍后再试' });
  }
};
