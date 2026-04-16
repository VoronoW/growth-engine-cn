#!/usr/bin/env node

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const APP_TOKEN = process.env.FEISHU_APP_TOKEN;

if (!APP_ID || !APP_SECRET || !APP_TOKEN) {
  throw new Error('缺少 FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_APP_TOKEN');
}

const TABLE_SPECS = [
  {
    env: 'FEISHU_TABLE_A1',
    name: 'A1・SKU档案盘点表（Clean）',
    headers: ['序号', '创建日期', '最后更新时间', '综合健康分', '产品链接', '当前售价(USD)', '近30天退货量', 'SKU角色定位', '操盘建议']
  },
  {
    env: 'FEISHU_TABLE_A1_DATA',
    name: 'A1 数据质检清单（Clean）',
    headers: ['检查项', '状态', '备注']
  },
  {
    env: 'FEISHU_TABLE_A1_ADDITIONAL',
    name: 'A1 待补资料缺口清单（Clean）',
    headers: ['缺失资料', '用途', '责任人', '截止日期']
  },
  {
    env: 'FEISHU_TABLE_A2_UTM',
    name: 'A2 UTM 参数标准化表（Clean）',
    headers: ['序号', '规范版本号', '最后更新时间', '投放平台', '渠道来源', '活动目标', 'UTM 生成结果']
  },
  {
    env: 'FEISHU_TABLE_A2_NAMING',
    name: 'A2 命名规范对照（Clean）',
    headers: ['规范版本号', '最后更新时间', '原始素材名/文件名', '投放平台', '素材类型', '规范命名']
  },
  {
    env: 'FEISHU_TABLE_A3_OBS',
    name: 'A3 Pixel vs S2S 观测矩阵（Clean）',
    headers: ['序号', '记录周期', '更新时间', '数据差异%', '平台', '事件名称', 'Pixel报告数值', '观测时间段', 'S2S实际数值', '差异原因分析', '可信度评级', '建议使用口径', '优先级', '备注']
  },
  {
    env: 'FEISHU_TABLE_A3_QA',
    name: 'A3 QA 清单（Clean）',
    headers: ['序号', '检查批次时间', '整体通过率', '检查项目描述', '对应平台', '上线/变更时间', '检查结果', '问题说明', '负责人', '截止修复时间', '复查结果', '备注']
  },
  {
    env: 'FEISHU_TABLE_A4',
    name: 'A4 归因沙盘演习报告（Clean）',
    headers: ['序号', '沙盘批次', '演习日期', '触点路径描述', '归因模型', '归因结果', '偏差说明', '结论建议']
  }
];

function fieldType(name) {
  if (/日期|时间/.test(name)) return 5;
  if (/%|分|ROAS|CPA|USD|售价|量|数值/.test(name)) return 2;
  return 1;
}

async function getAppAccessToken() {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`获取 app_access_token 失败: ${data.msg}`);
  return data.app_access_token;
}

async function api(path, accessToken, init = {}) {
  const res = await fetch(`https://open.feishu.cn${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  const data = await res.json();
  if (data.code !== 0) {
    throw new Error(`${path} -> ${data.msg}`);
  }
  return data;
}

async function listTables(accessToken) {
  const data = await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables?page_size=500`, accessToken);
  return data.data?.items ?? [];
}

async function createTable(accessToken, name) {
  const data = await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables`, accessToken, {
    method: 'POST',
    body: JSON.stringify({ table: { name } })
  });
  return data.data?.table_id || data.data?.table?.table_id;
}

async function listFields(accessToken, tableId) {
  const data = await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields?page_size=500`, accessToken);
  return data.data?.items ?? [];
}

async function renameField(accessToken, tableId, field, newName) {
  const body = { field_name: newName, type: field.type };
  if (field.property && Object.keys(field.property).length > 0) {
    body.property = field.property;
  }
  await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields/${field.field_id}`, accessToken, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

async function createField(accessToken, tableId, fieldName) {
  await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields`, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      field_name: fieldName,
      type: fieldType(fieldName)
    })
  });
}

async function ensureCleanTable(accessToken, spec) {
  const tables = await listTables(accessToken);
  let table = tables.find((item) => item.name === spec.name);
  const created = !table;

  if (!table) {
    table = { name: spec.name, table_id: await createTable(accessToken, spec.name) };
  }

  let fields = await listFields(accessToken, table.table_id);
  if (fields[0] && fields[0].field_name !== spec.headers[0]) {
    await renameField(accessToken, table.table_id, fields[0], spec.headers[0]);
  }

  fields = await listFields(accessToken, table.table_id);
  const existing = new Set(fields.map((field) => field.field_name));
  const createdFields = [];

  for (const fieldName of spec.headers.slice(1)) {
    if (existing.has(fieldName)) continue;
    await createField(accessToken, table.table_id, fieldName);
    createdFields.push(fieldName);
  }

  const liveFields = (await listFields(accessToken, table.table_id)).map((field) => field.field_name);

  return {
    env: spec.env,
    table_name: spec.name,
    table_id: table.table_id,
    created_table: created,
    created_fields: createdFields,
    live_fields: liveFields
  };
}

async function main() {
  const accessToken = await getAppAccessToken();
  const results = [];

  for (const spec of TABLE_SPECS) {
    results.push(await ensureCleanTable(accessToken, spec));
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
