#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const TARGETS = [
  {
    key: 'a1',
    tableName: 'A1・SKU档案盘点表',
    env: 'FEISHU_TABLE_A1',
    tableId: 'tbl-a1',
    manualFields: ['序号'],
    renameMap: {
      'SKU名称': 'SKU 名称',
      '广告花费RMB': '广告花费(RMB)',
      '实际利润RMB': '实际利润(RMB)',
      '毛利率': '毛利率%'
    },
    fieldSpecs: {
      '创建日期': { type: 5 },
      '最后更新时间': { type: 5 },
      '综合健康分': { type: 2 },
      '产品链接': { type: 1 },
      '当前售价(USD)': { type: 2 },
      '近30天退货量': { type: 2 },
      'SKU角色定位': { type: 1 },
      '操盘建议': { type: 1 }
    }
  },
  {
    key: 'a2:utm',
    tableName: 'A2 UTM 参数标准化表',
    env: 'FEISHU_TABLE_A2_UTM',
    tableId: 'tbl-a2',
    manualFields: ['序号'],
    renameMap: {},
    fieldSpecs: {
      '规范版本号': { type: 1 },
      '最后更新时间': { type: 5 },
      '投放平台': { type: 1 },
      '渠道来源': { type: 1 },
      '活动目标': { type: 1 },
      'UTM 生成结果': { type: 1 }
    }
  },
  {
    key: 'a2:naming',
    tableName: 'A2 命名规范对照',
    env: 'FEISHU_TABLE_A2_NAMING',
    tableId: 'tbl-a2-naming',
    manualFields: [],
    renameMap: {},
    fieldSpecs: {
      '规范版本号': { type: 1 },
      '最后更新时间': { type: 5 },
      '原始素材名/文件名': { type: 1 },
      '投放平台': { type: 1 },
      '素材类型': { type: 1 },
      '规范命名': { type: 1 }
    }
  },
  {
    key: 'a3:obs',
    tableName: 'A3 Pixel vs S2S 观测矩阵',
    env: 'FEISHU_TABLE_A3_OBS',
    tableId: 'tbl-a3',
    manualFields: ['序号'],
    renameMap: {
      '观测日期': '记录周期',
      'Pixel接收量': 'Pixel报告数值',
      'S2S接收量': 'S2S实际数值',
      '补足率': '数据差异%'
    },
    fieldSpecs: {
      '记录周期': { type: 1 },
      '更新时间': { type: 5 },
      '数据差异%': { type: 2 },
      '平台': { type: 1 },
      '事件名称': { type: 1 },
      'Pixel报告数值': { type: 2 },
      '观测时间段': { type: 1 },
      'S2S实际数值': { type: 2 },
      '差异原因分析': { type: 1 },
      '可信度评级': { type: 1 },
      '建议使用口径': { type: 1 },
      '优先级': { type: 1 },
      '备注': { type: 1 }
    }
  },
  {
    key: 'a3:qa',
    tableName: 'A3 QA 清单',
    env: 'FEISHU_TABLE_A3_QA',
    tableId: 'tbl-a3-qa',
    manualFields: ['序号'],
    renameMap: {
      '验收项': '检查项目描述',
      '状态': '检查结果',
      'EMQ分数备注': '备注'
    },
    fieldSpecs: {
      '检查批次时间': { type: 5 },
      '整体通过率': { type: 2 },
      '检查项目描述': { type: 1 },
      '对应平台': { type: 1 },
      '上线/变更时间': { type: 5 },
      '检查结果': { type: 1 },
      '问题说明': { type: 1 },
      '负责人': { type: 1 },
      '截止修复时间': { type: 5 },
      '复查结果': { type: 1 },
      '备注': { type: 1 }
    }
  },
  {
    key: 'a4',
    tableName: 'A4 归因沙盘演习报告',
    env: 'FEISHU_TABLE_A4',
    tableId: 'tbl-a4',
    manualFields: ['序号'],
    renameMap: {},
    fieldSpecs: {
      '沙盘批次': { type: 1 },
      '演习日期': { type: 5 },
      '触点路径描述': { type: 1 },
      '归因模型': { type: 1 },
      '归因结果': { type: 1 },
      '偏差说明': { type: 1 },
      '结论建议': { type: 1 }
    }
  },
  {
    key: 'b2:base',
    tableName: 'B2 品牌基础设定',
    env: 'FEISHU_TABLE_B2_BASE',
    tableId: 'tbl-b2-base',
    manualFields: [],
    renameMap: {},
    fieldSpecs: {
      '品牌维度': { type: 1 },
      '当前定义': { type: 1 },
      '目标定义': { type: 1 },
      '差距说明': { type: 1 },
      '修正建议': { type: 1 }
    }
  },
  {
    key: 'b2:hooks',
    tableName: 'B2 广告文案矩阵',
    env: 'FEISHU_TABLE_B2_HOOKS',
    tableId: 'tbl-b2',
    manualFields: ['序号'],
    renameMap: {},
    fieldSpecs: {
      '受众细分': { type: 1 },
      '核心钩子': { type: 1 },
      '价值主张': { type: 1 },
      '文案矩阵正文': { type: 1 },
      '行动号召': { type: 1 },
      '适用场景': { type: 1 }
    }
  },
  {
    key: 'b4:core',
    tableName: 'B4 素材沙盒测试矩阵',
    env: 'FEISHU_TABLE_B4_CORE',
    tableId: 'tbl-b4',
    manualFields: ['序号'],
    renameMap: {
      '素材ID': '素材名称/ID',
      '曝光量': '实际曝光量',
      'CTR': 'CTR(%)',
      'CVR': 'CVR(%)',
      '结论': '测试结论'
    },
    fieldSpecs: {
      '测试周期': { type: 1 },
      '创建时间': { type: 5 },
      '素材名称/ID': { type: 1 },
      '素材类型': { type: 1 },
      '投放平台': { type: 1 },
      '测试预算(USD)': { type: 2 },
      '实际曝光量': { type: 2 },
      '实际点击量': { type: 2 },
      '实际转化量': { type: 2 },
      'CTR(%)': { type: 2 },
      'CVR(%)': { type: 2 },
      'CPA(USD)': { type: 2 },
      'ROAS': { type: 2 },
      '测试结论': { type: 1 }
    }
  },
  {
    key: 'b4:winner',
    tableName: 'B4 Winner Insights',
    env: 'FEISHU_TABLE_B4_WINNER',
    tableId: 'tbl-b4-winner',
    manualFields: ['序号'],
    renameMap: {
      '分析维度': '钩子类型分析'
    },
    fieldSpecs: {
      '记录时间': { type: 5 },
      '洞察版本': { type: 1 },
      '赢家素材名称/ID': { type: 1 },
      '投放平台': { type: 1 },
      '投放周期': { type: 1 },
      '花费(USD)': { type: 2 },
      '实际ROAS': { type: 2 },
      '钩子类型分析': { type: 1 },
      '画面/视觉元素': { type: 1 },
      '文案结构': { type: 1 },
      '受众匹配度分析': { type: 1 },
      '可复用核心元素': { type: 1 },
      '放量建议': { type: 1 },
      '关联SKU': { type: 1 },
      '归档标签': { type: 1 }
    }
  },
  {
    key: 'b5:rules',
    tableName: 'B5 止损护航规则',
    env: 'FEISHU_TABLE_B5_RULES',
    tableId: 'tbl-b5-rules',
    manualFields: ['序号'],
    renameMap: {
      '触发条件': '止损触发条件',
      '执行动作': '触发动作'
    },
    fieldSpecs: {
      '规则版本': { type: 1 },
      '生效时间': { type: 5 },
      '平台': { type: 1 },
      '当前日均花费': { type: 2 },
      '近7天ROAS': { type: 2 },
      '近7天CPA': { type: 2 },
      '止损触发条件': { type: 1 },
      'ROAS红线阈值': { type: 2 },
      'CPA红线阈值': { type: 2 },
      '触发动作': { type: 1 },
      '执行负责人': { type: 1 },
      '例外情形说明': { type: 1 },
      '规则优先级': { type: 1 },
      '复盘频率': { type: 1 }
    }
  },
  {
    key: 'b6:analysis',
    tableName: 'B6 用户多维分析',
    env: 'FEISHU_TABLE_B6_ANALYSIS',
    tableId: 'tbl-b6',
    manualFields: ['序号'],
    renameMap: {
      '分析维度': '分析周期',
      '占比': '新客占比(%)',
      '投放建议': '策略建议'
    },
    fieldSpecs: {
      '分析周期': { type: 1 },
      '更新时间': { type: 5 },
      '数据来源平台': { type: 1 },
      '分析时间区间': { type: 1 },
      '样本订单量': { type: 2 },
      '新客占比(%)': { type: 2 },
      '复购客占比(%)': { type: 2 },
      'RFM分层结果': { type: 1 },
      '高价值用户特征': { type: 1 },
      'LTV估算(USD)': { type: 2 },
      '核心流失节点': { type: 1 },
      '增长机会洞察': { type: 1 },
      '策略建议': { type: 1 },
      '下一步动作': { type: 1 }
    }
  },
  {
    key: 'b6:seeds',
    tableName: 'B6 种子标签包',
    env: 'FEISHU_TABLE_B6_SEEDS',
    tableId: 'tbl-b6-seeds',
    manualFields: ['序号'],
    renameMap: {
      '标签包': '标签包版本',
      '用户数量': '测试优先级'
    },
    fieldSpecs: {
      '标签包版本': { type: 1 },
      '创建时间': { type: 5 },
      '对应SKU/产品类目': { type: 1 },
      '目标平台': { type: 1 },
      '已知高转化受众描述': { type: 1 },
      '兴趣标签(列表)': { type: 1 },
      '行为标签(列表)': { type: 1 },
      '人口属性': { type: 1 },
      '自定义受众规则': { type: 1 },
      '相似受众来源': { type: 1 },
      '排除人群条件': { type: 1 },
      '适用场景': { type: 1 },
      '测试优先级': { type: 1 },
      '备注': { type: 1 }
    }
  }
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`缺少环境变量 ${name}`);
  return value;
}

async function getAppAccessToken() {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: requireEnv('FEISHU_APP_ID'),
      app_secret: requireEnv('FEISHU_APP_SECRET')
    })
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`获取 app_access_token 失败: ${data.msg}`);
  return data.app_access_token;
}

async function bitableRequest(urlPath, accessToken, init = {}) {
  const res = await fetch(`https://open.feishu.cn${urlPath}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${urlPath} -> ${data.msg}`);
  return data;
}

async function listFields(tableId, accessToken) {
  const appToken = requireEnv('FEISHU_APP_TOKEN');
  const data = await bitableRequest(`/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields?page_size=500`, accessToken);
  return data.data?.items ?? [];
}

async function createField(tableId, accessToken, fieldName, spec) {
  const appToken = requireEnv('FEISHU_APP_TOKEN');
  const body = { field_name: fieldName, type: spec.type || 1 };
  if (spec.options?.length) {
    body.property = { options: spec.options.map((name) => ({ name })) };
  }
  return bitableRequest(`/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields`, accessToken, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

async function renameField(tableId, accessToken, existingField, newName) {
  const appToken = requireEnv('FEISHU_APP_TOKEN');
  const body = {
    field_name: newName,
    type: existingField.type
  };
  if (existingField.property && Object.keys(existingField.property).length > 0) {
    body.property = existingField.property;
  }
  return bitableRequest(`/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields/${existingField.field_id}`, accessToken, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

function stripTags(input) {
  return input.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractHeaders(html, tableDomId) {
  const tablePattern = new RegExp(`<table[^>]+id="${tableDomId}"[\\s\\S]*?<thead><tr>([\\s\\S]*?)<\\/tr><\\/thead>`, 'i');
  const match = html.match(tablePattern);
  if (!match) throw new Error(`在前端页面中找不到表格 ${tableDomId}`);
  const thMatches = [...match[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
  return thMatches.map((item) => stripTags(item[1]));
}

function buildPlan(target, frontHeaders, actualFields) {
  const expected = frontHeaders;
  const actualByName = new Map(actualFields.map((field) => [field.field_name, field]));
  const renameCandidates = [];

  for (const [from, to] of Object.entries(target.renameMap)) {
    if (actualByName.has(from) && expected.includes(to) && !actualByName.has(to)) {
      renameCandidates.push({
        from,
        to,
        field: actualByName.get(from)
      });
    }
  }

  const renamedTargets = new Set(renameCandidates.map((item) => item.to));
  const missing = expected.filter((name) => !target.manualFields.includes(name) && !actualByName.has(name) && !renamedTargets.has(name));
  const legacy = actualFields
    .map((field) => field.field_name)
    .filter((name) => !expected.includes(name))
    .filter((name) => !renameCandidates.some((item) => item.from === name));

  return {
    missing,
    renameCandidates,
    legacy
  };
}

function printPlan(target, frontHeaders, actualFields, plan) {
  console.log(`\n[${target.tableName}]`);
  console.log(`env: ${target.env}`);
  console.log(`table_id: ${process.env[target.env]}`);
  console.log(`前端实际栏位: ${frontHeaders.join(' / ')}`);
  console.log(`Feishu当前字段: ${actualFields.map((field) => field.field_name).join(' / ') || '无'}`);
  console.log(`缺失字段: ${plan.missing.join(' / ') || '无'}`);
  console.log(`可自动重命名: ${plan.renameCandidates.map((item) => `${item.from} -> ${item.to}`).join(' / ') || '无'}`);
  console.log(`保留legacy字段: ${plan.legacy.join(' / ') || '无'}`);
}

async function main() {
  const applyMode = process.argv.includes('--apply');
  const sourceArg = process.argv.find((arg) => arg.startsWith('--source='));
  const sourcePath = sourceArg ? sourceArg.split('=')[1] : 'growth-forms.html';
  const html = await fs.readFile(path.resolve(process.cwd(), sourcePath), 'utf8');
  const accessToken = await getAppAccessToken();

  console.log(applyMode ? '模式: APPLY' : '模式: DRY-RUN');
  console.log(`前端源文件: ${sourcePath}`);

  for (const target of TARGETS) {
    const tableId = requireEnv(target.env);
    const frontHeaders = extractHeaders(html, target.tableId);
    const actualFields = await listFields(tableId, accessToken);
    const plan = buildPlan(target, frontHeaders, actualFields);

    printPlan(target, frontHeaders, actualFields, plan);

    if (!applyMode) continue;

    for (const rename of plan.renameCandidates) {
      await renameField(tableId, accessToken, rename.field, rename.to);
      console.log(`  已重命名: ${rename.from} -> ${rename.to}`);
    }

    for (const fieldName of plan.missing) {
      await createField(tableId, accessToken, fieldName, target.fieldSpecs[fieldName] || { type: 1 });
      console.log(`  已新增: ${fieldName}`);
    }
  }
}

main().catch((error) => {
  console.error('\n前端字段同步失败:');
  console.error(error.message);
  process.exit(1);
});
