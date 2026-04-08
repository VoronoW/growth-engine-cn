/**
 * feishu-submit.mjs
 * POST /.netlify/functions/feishu-submit
 * body: {
 *   panelId: 'a1',
 *   records: [ { '序号': '1', 'SKU 名称': '...' }, ... ],
 *   subKey?: 'main'   // 可选，默认取该面板第一个子表
 * }
 */

import { getSessionFromEvent, writeRecordsToBitable, jsonResponse } from './_shared/feishu-utils.mjs';
import { getTableId } from './_shared/feishu-table-map.mjs';
import { getFieldMap, applyFieldMap } from './_shared/feishu-field-map.mjs';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST,OPTIONS' }, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  // 1. 验证登录
  const session = getSessionFromEvent(event);
  if (!session?.user) {
    return jsonResponse(401, { error: '未登录，请先使用飞书账号登录' });
  }

  // 2. 解析请求体
  let panelId, subKey, records;
  try {
    const body = JSON.parse(event.body || '{}');
    panelId = body.panelId?.toLowerCase();
    subKey  = body.subKey;
    records = body.records;
    if (!panelId) throw new Error('缺少 panelId');
    if (!Array.isArray(records) || records.length === 0) throw new Error('records 为空');
  } catch (err) {
    return jsonResponse(400, { error: `请求格式错误: ${err.message}` });
  }

  // 3. 获取 tableId
  let tableId;
  try {
    tableId = getTableId(panelId, subKey);
  } catch (err) {
    return jsonResponse(400, { error: err.message });
  }

  // 4. 字段映射
  const fieldMap = getFieldMap(panelId, subKey);
  if (!fieldMap) {
    return jsonResponse(400, { error: `面板 ${panelId.toUpperCase()} 字段映射尚未配置` });
  }
  const mapped   = applyFieldMap(records, fieldMap);
  const nonEmpty = mapped.filter(r => Object.keys(r).length > 0);
  if (nonEmpty.length === 0) {
    return jsonResponse(400, { error: '所有记录字段均为空，请检查表格数据' });
  }

  // 5. 写入飞书 Bitable
  try {
    const created = await writeRecordsToBitable(tableId, nonEmpty);
    return jsonResponse(200, {
      success: true,
      created,
      panelId,
      subKey: subKey ?? 'default',
      submittedBy: session.user.name || session.user.email
    });
  } catch (err) {
    console.error('[feishu-submit]', err);
    return jsonResponse(500, { error: `写入飞书失败: ${err.message}` });
  }
};
