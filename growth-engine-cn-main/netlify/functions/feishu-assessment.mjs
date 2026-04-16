/**
 * feishu-assessment.mjs
 * 公开提交接口（无需登录）— 品牌诊断评估表
 *
 * 环境变量（在 Netlify Dashboard → Site configuration → Environment variables 中配置）：
 *   FEISHU_APP_ID         飞书应用 App ID
 *   FEISHU_APP_SECRET     飞书应用 App Secret
 *   FEISHU_APP_TOKEN      飞书多维表格 App Token（URL /base/ 后面的字符串）
 *   FEISHU_TABLE_ASSESSMENT  评估表的 table_id（从多维表格 API 面板复制）
 */

import { getAppAccessToken, getBitableAppToken, jsonResponse } from './_shared/feishu-utils.mjs';

// 允许写入飞书的字段白名单（与多维表格列名保持一致）
const ALLOWED_FIELDS = new Set([
  '品牌名称',
  '姓名职位',
  '联系方式',
  '主营渠道',
  'GMV规模',
  '增长瓶颈',
  '品牌现状',
  '启动时间',
  '补充说明',
  '提交时间',
]);

export const handler = async (event) => {
  // CORS preflight
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

  // 检查表格是否已配置
  const tableId = process.env.FEISHU_TABLE_ASSESSMENT;
  if (!tableId) {
    console.error('FEISHU_TABLE_ASSESSMENT 未设置');
    return jsonResponse(503, {
      error: '评估表暂未接通，请通过微信联系我们',
    });
  }

  // 解析请求体
  let fields;
  try {
    fields = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: '请求格式错误' });
  }

  // 必填校验
  if (!fields['品牌名称']?.trim() || !fields['联系方式']?.trim()) {
    return jsonResponse(400, { error: '品牌名称和联系方式为必填项' });
  }

  // 过滤白名单外字段，补充提交时间
  const safeFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (ALLOWED_FIELDS.has(k) && v?.toString().trim()) {
      safeFields[k] = v.toString().trim();
    }
  }
  safeFields['提交时间'] = new Date()
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19);

  try {
    const appToken = await getBitableAppToken();
    const accessToken = await getAppAccessToken();

    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: safeFields }),
    });

    const data = await res.json();
    if (data.code !== 0) {
      console.error('Bitable write error:', JSON.stringify(data));
      throw new Error(`Feishu API error ${data.code}: ${data.msg}`);
    }

    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error('Assessment submit error:', err?.message || err);
    return jsonResponse(500, {
      error: '提交失败，请稍后重试或通过微信联系我们',
    });
  }
};
