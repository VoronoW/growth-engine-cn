/**
 * feishu-field-map.mjs
 * 前端字段名 → 飞书多维表格字段名映射
 *
 * A1 已实现；其余面板为 scaffold（空对象 = 透传原字段名）
 */

/* A1 — 已验证 */
const MAPS = {
  a1: {
    main: {
      '序号':          '序号',
      'SKU 名称':      'SKU名称',
      '投放平台':      '投放平台',
      '近30天销量':    '近30天销量',
      '广告花费(RMB)': '广告花费RMB',
      '平台ROAS':      '平台ROAS',
      '实际利润(RMB)': '实际利润RMB',
      '毛利率%':       '毛利率',
      '数据状态':      '数据状态'
    }
  },
  // Scaffold — 字段名直接透传，待后续补充具体映射
  a2: { utm: {}, naming: {} },
  a3: {
    obs: {
      '日期': '观测日期',
      '平台': '平台',
      'Pixel接收量(A)': 'Pixel接收量',
      'S2S接收量(B)': 'S2S接收量',
      '去重后总量(C)': '去重后总量',
      '真实订单数': '真实订单数',
      '补足率(C/A-1)%': '补足率',
      '备注': '备注'
    },
    qa: {
      '验收项': '验收项',
      '状态': '状态',
      'EMQ分数/备注': 'EMQ分数备注'
    }
  },
  a4: { main: {} },
  b2: { base: {}, hooks: {} },
  b3: { sku: {}, script: {} },
  b4: {
    core: {
      '素材ID': '素材ID',
      '脚本框架': '脚本框架',
      '3s停留率TS%': '三秒停留率',
      '15s完播率Hold%': '完播率',
      '链接CTR%': 'CTR',
      'CVR%': 'CVR',
      'CPM($)': 'CPM',
      'CPC($)': 'CPC',
      '曝光量': '曝光量',
      '结论Action': '结论'
    },
    winner: {
      '维度': '分析维度',
      '观察记录': '观察记录',
      '后续行动方案': '后续行动方案'
    }
  },
  b5: {
    funnel: {},
    rules: {
      '规则类型': '规则类型',
      '触发条件': '触发条件',
      '执行动作': '执行动作',
      '适用账户': '适用账户'
    }
  },
  b6: { analysis: {}, seeds: {} }
};

/**
 * 获取字段映射
 * @param {string} panelId
 * @param {string} [subKey] - 不传则取第一个子表
 */
export function getFieldMap(panelId, subKey) {
  const id = panelId?.toLowerCase();
  const panelMaps = MAPS[id];
  if (!panelMaps) return null;
  const key = subKey ?? Object.keys(panelMaps)[0];
  return panelMaps[key] ?? null;
}

/**
 * 将前端 records 按字段映射转换为飞书字段格式
 * 空对象 fieldMap = 透传（scaffold 面板直接用原字段名）
 */
export function applyFieldMap(records, fieldMap) {
  const isPassthrough = Object.keys(fieldMap).length === 0;
  return records.map(record => {
    const out = {};
    for (const [frontKey, val] of Object.entries(record)) {
      if (val === '' || val === null || val === undefined) continue;
      const feishuKey = isPassthrough ? frontKey : (fieldMap[frontKey] ?? frontKey);
      out[feishuKey] = val;
    }
    return out;
  });
}
