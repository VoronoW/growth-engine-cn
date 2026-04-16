#!/usr/bin/env node

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const APP_TOKEN = process.env.FEISHU_APP_TOKEN;
const A1_MAIN_TABLE_ID = process.env.FEISHU_TABLE_A1;

if (!APP_ID || !APP_SECRET || !APP_TOKEN || !A1_MAIN_TABLE_ID) {
  throw new Error('缺少 FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_APP_TOKEN / FEISHU_TABLE_A1');
}

const QA_TABLE_NAME = 'A1 数据质检清单';
const GAP_TABLE_NAME = 'A1 待补资料缺口清单';

const QA_ITEMS = [
  'Amazon / Meta / Google / TikTok 历史订单已导出至本地',
  'Shopify 后台真实成交数与平台数据已对齐',
  '退款订单与测试订单已剔除',
  '各平台数据已统一币种（USD）',
  'GA4 中 Unassigned 流量占比已低于 5%'
];

const MAIN_FIELDS = ['序号', '创建日期', '最后更新时间', '综合健康分', '产品链接', '当前售价(USD)', '近30天退货量', 'SKU角色定位', '操盘建议'];
const QA_FIELDS = ['检查项', '状态', '备注'];
const GAP_FIELDS = ['缺失资料', '用途', '责任人', '截止日期'];

async function getAccessToken() {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`获取 access_token 失败: ${data.msg}`);
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
    body: JSON.stringify({
      table: {
        name
      }
    })
  });
  return data.data?.table_id || data.data?.table?.table_id;
}

async function getOrCreateTable(accessToken, name) {
  const tables = await listTables(accessToken);
  const existing = tables.find((item) => item.name === name);
  if (existing) return { tableId: existing.table_id, created: false };
  const tableId = await createTable(accessToken, name);
  return { tableId, created: true };
}

async function listFields(accessToken, tableId) {
  const data = await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields?page_size=500`, accessToken);
  return data.data?.items ?? [];
}

async function ensureFields(accessToken, tableId, names) {
  const existing = await listFields(accessToken, tableId);
  const existingNames = new Set(existing.map((item) => item.field_name));
  const created = [];

  for (const name of names) {
    if (existingNames.has(name)) continue;
    await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/fields`, accessToken, {
      method: 'POST',
      body: JSON.stringify({
        field_name: name,
        type: name.includes('日期') ? 5 : 1
      })
    });
    created.push(name);
  }

  return created;
}

async function listRecords(accessToken, tableId) {
  const data = await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records?page_size=500`, accessToken);
  return data.data?.items ?? [];
}

async function batchCreate(accessToken, tableId, records) {
  if (records.length === 0) return { created: 0 };
  const payload = {
    records: records.map((fields) => ({ fields }))
  };
  const data = await api(`/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records/batch_create`, accessToken, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return { created: data.data?.records?.length ?? records.length };
}

async function main() {
  const accessToken = await getAccessToken();

  const qaTable = await getOrCreateTable(accessToken, QA_TABLE_NAME);
  const gapTable = await getOrCreateTable(accessToken, GAP_TABLE_NAME);

  const mainCreatedFields = await ensureFields(accessToken, A1_MAIN_TABLE_ID, MAIN_FIELDS);
  const qaCreatedFields = await ensureFields(accessToken, qaTable.tableId, QA_FIELDS);
  const gapCreatedFields = await ensureFields(accessToken, gapTable.tableId, GAP_FIELDS);

  const mainExistingRecords = await listRecords(accessToken, A1_MAIN_TABLE_ID);
  const qaExistingRecords = await listRecords(accessToken, qaTable.tableId);
  const gapExistingRecords = await listRecords(accessToken, gapTable.tableId);

  let mainInserted = 0;
  let qaInserted = 0;
  let gapInserted = 0;

  if (mainExistingRecords.length === 0) {
    const mainRows = [{ '序号': '1' }, { '序号': '2' }, { '序号': '3' }];
    mainInserted = (await batchCreate(accessToken, A1_MAIN_TABLE_ID, mainRows)).created;
  }

  if (qaExistingRecords.length === 0) {
    const qaRows = QA_ITEMS.map((item) => ({ '检查项': item }));
    qaInserted = (await batchCreate(accessToken, qaTable.tableId, qaRows)).created;
  }

  if (gapExistingRecords.length === 0) {
    gapInserted = 0;
  }

  const mainFields = (await listFields(accessToken, A1_MAIN_TABLE_ID)).map((item) => item.field_name);
  const qaFields = (await listFields(accessToken, qaTable.tableId)).map((item) => item.field_name);
  const gapFields = (await listFields(accessToken, gapTable.tableId)).map((item) => item.field_name);

  const mainRows = (await listRecords(accessToken, A1_MAIN_TABLE_ID)).length;
  const qaRows = (await listRecords(accessToken, qaTable.tableId)).length;
  const gapRows = (await listRecords(accessToken, gapTable.tableId)).length;

  console.log(JSON.stringify({
    app_token: APP_TOKEN,
    blocks: [
      {
        block: 'A1・SKU档案盘点表',
        table_name: 'A1 · SKU档案盘点表',
        table_id: A1_MAIN_TABLE_ID,
        created_table: false,
        created_fields: mainCreatedFields,
        inserted_rows: mainInserted,
        live_row_count: mainRows,
        live_fields: mainFields
      },
      {
        block: 'A1 数据质检清单',
        table_name: QA_TABLE_NAME,
        table_id: qaTable.tableId,
        created_table: qaTable.created,
        created_fields: qaCreatedFields,
        inserted_rows: qaInserted,
        live_row_count: qaRows,
        live_fields: qaFields
      },
      {
        block: 'A1 待补资料缺口清单',
        table_name: GAP_TABLE_NAME,
        table_id: gapTable.tableId,
        created_table: gapTable.created,
        created_fields: gapCreatedFields,
        inserted_rows: gapInserted,
        live_row_count: gapRows,
        live_fields: gapFields
      }
    ]
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
