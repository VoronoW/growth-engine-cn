import { getAppAccessToken, getBitableAppToken, jsonResponse } from './_shared/feishu-utils.mjs';

const ALLOWED_FIELDS = new Set([
  '提交来源',
  '月销售额',
  '综合净利润率',
  'SKU数量',
  'Top 3 SKU销售占比',
  '主要销售平台',
  '其他平台说明',
  '当前增长主要来源',
  '广告费用占销售额比例',
  '老客户复购情况',
  '产品相对竞品的最大差别',
  '产品定价相对竞品',
  '用户购买主要原因',
  '现有品牌资产',
  '是否有专人负责品牌/内容/社媒',
  '当前最头疼的问题',
  '对品牌升级的主要担心',
  '品牌化投入意愿',
  '姓名',
  '微信/WhatsApp',
  '邮箱',
  '方便联系时间段',
]);

const REQUIRED_FIELDS = [
  '月销售额',
  '综合净利润率',
  'SKU数量',
  'Top 3 SKU销售占比',
  '主要销售平台',
  '当前增长主要来源',
  '广告费用占销售额比例',
  '老客户复购情况',
  '产品相对竞品的最大差别',
  '产品定价相对竞品',
  '用户购买主要原因',
  '现有品牌资产',
  '是否有专人负责品牌/内容/社媒',
  '当前最头疼的问题',
  '对品牌升级的主要担心',
  '品牌化投入意愿',
  '姓名',
  '微信/WhatsApp',
];

function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0;
  return String(value ?? '').trim() === '';
}

function normalizeFieldValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? '').trim())
      .filter(Boolean);
  }

  return String(value ?? '').trim();
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

  const tableId = process.env.FEISHU_TABLE_ASSESSMENT;
  if (!tableId) {
    return jsonResponse(503, { error: '评估表暂未接通，请稍后再试' });
  }

  let fields;
  try {
    fields = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: '请求格式错误' });
  }

  for (const field of REQUIRED_FIELDS) {
    if (isEmpty(fields[field])) {
      return jsonResponse(400, { error: `${field} 为必填项` });
    }
  }

  if (
    Array.isArray(fields['主要销售平台']) &&
    fields['主要销售平台'].includes('其他平台') &&
    isEmpty(fields['其他平台说明'])
  ) {
    return jsonResponse(400, { error: '选择“其他平台”后，请填写其他平台说明' });
  }

  const safeFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!ALLOWED_FIELDS.has(key)) continue;
    if (isEmpty(value)) continue;
    safeFields[key] = normalizeFieldValue(value);
  }

  if (!safeFields['提交来源']) {
    safeFields['提交来源'] = '官网表单';
  }

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
        body: JSON.stringify({ fields: safeFields }),
      }
    );

    const result = await response.json();
    if (result.code !== 0) {
      console.error('Assessment submit error:', JSON.stringify(result));
      return jsonResponse(500, {
        error: result.msg || '提交失败，请稍后重试',
        debug: result,
      });
    }

    return jsonResponse(200, { ok: true, recordId: result.data?.record?.record_id ?? null });
  } catch (error) {
    console.error('Assessment submit error:', error?.message || error);
    return jsonResponse(500, { error: '提交失败，请稍后重试或通过微信联系我们' });
  }
};
