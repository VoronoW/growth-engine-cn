#!/usr/bin/env node

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const APP_TOKEN = process.env.FEISHU_APP_TOKEN;

if (!APP_ID || !APP_SECRET || !APP_TOKEN) {
  throw new Error('缺少 FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_APP_TOKEN');
}

const TABLE_SPECS = [
  {
    env: 'FEISHU_TABLE_B2_BASE',
    name: 'B2 品牌基础设定（Clean）',
    headers: ['品牌维度', '当前定义', '目标定义', '差距说明', '修正建议']
  },
  {
    env: 'FEISHU_TABLE_B2_HOOKS',
    name: 'B2 广告文案矩阵（Clean）',
    headers: ['序号', '受众细分', '核心钩子', '价值主张', '文案矩阵正文', '行动号召', '适用场景']
  },
  {
    env: 'FEISHU_TABLE_B3_SKU',
    name: 'B3 SKU 阵营划分表（Clean）',
    headers: ['SKU ID', '产品名称', 'SKU阵营', '毛利率%', '月销量', '客单价$', '核心卖点（1句话）', '脚本优先级']
  },
  {
    env: 'FEISHU_TABLE_B3_SCRIPT',
    name: 'B3 SKU 脚本矩阵（Clean）',
    headers: ['脚本ID', 'SKU ID', '脚本框架', '脚本内容(Hook+展开+CTA)', '目标情绪', '视频时长', '制作状态', '投测优先级']
  },
  {
    env: 'FEISHU_TABLE_B4_CORE',
    name: 'B4 素材沙盒测试矩阵（Clean）',
    headers: ['序号', '测试周期', '创建时间', '素材名称/ID', '素材类型', '投放平台', '测试预算(USD)', '实际曝光量', '实际点击量', '实际转化量', 'CTR(%)', 'CVR(%)', 'CPA(USD)', 'ROAS', '测试结论']
  },
  {
    env: 'FEISHU_TABLE_B4_WINNER',
    name: 'B4 Winner Insights（Clean）',
    headers: ['序号', '记录时间', '洞察版本', '赢家素材名称/ID', '投放平台', '投放周期', '花费(USD)', '实际ROAS', '钩子类型分析', '画面/视觉元素', '文案结构', '受众匹配度分析', '可复用核心元素', '放量建议', '关联SKU', '归档标签']
  },
  {
    env: 'FEISHU_TABLE_B5_FUNNEL',
    name: 'B5 漏斗分层投放策略（Clean）',
    headers: ['序号', '漏斗层级', '投放目标', '核心受众', '素材策略', '预算分配比例', '关键优化动作', '复盘口径']
  },
  {
    env: 'FEISHU_TABLE_B5_RULES',
    name: 'B5 止损护航规则（Clean）',
    headers: ['序号', '规则版本', '生效时间', '平台', '当前日均花费', '近7天ROAS', '近7天CPA', '止损触发条件', 'ROAS红线阈值', 'CPA红线阈值', '触发动作', '执行负责人', '例外情形说明', '规则优先级', '复盘频率']
  },
  {
    env: 'FEISHU_TABLE_B6_ANALYSIS',
    name: 'B6 用户多维分析（Clean）',
    headers: ['序号', '分析周期', '更新时间', '数据来源平台', '分析时间区间', '样本订单量', '新客占比(%)', '复购客占比(%)', 'RFM分层结果', '高价值用户特征', 'LTV估算(USD)', '核心流失节点', '增长机会洞察', '策略建议', '下一步动作']
  },
  {
    env: 'FEISHU_TABLE_B6_SEEDS',
    name: 'B6 种子标签包（Clean）',
    headers: ['序号', '标签包版本', '创建时间', '对应SKU/产品类目', '目标平台', '已知高转化受众描述', '兴趣标签(列表)', '行为标签(列表)', '人口属性', '自定义受众规则', '相似受众来源', '排除人群条件', '适用场景', '测试优先级', '备注']
  }
];

function fieldType(name) {
  if (/日期|时间/.test(name)) return 5;
  if (/%|分|ROAS|CPA|USD|售价|量|数值|\$/.test(name)) return 2;
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
  if (data.code !== 0) throw new Error(`${path} -> ${data.msg}`);
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
    body: JSON.stringify({ field_name: fieldName, type: fieldType(fieldName) })
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
